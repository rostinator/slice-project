import {CpmActivity} from "./CpmActivity";
import {Task} from "../../model/models";
import {dateDiffInDays} from "../../utils/commonUtils";

export class CpmModel {

    private _activities: Map<number, CpmActivity>
    private _startActivities: number[]
    private _endActivities: number[]
    private _isCalculationFailed: boolean;

    constructor(cpmActivities: CpmActivity[], initOnly?: boolean) {
        this._activities = new Map()
        this._startActivities = []
        this._endActivities = []
        this._isCalculationFailed = false

        try {
            this.initModel(cpmActivities)
            if (!initOnly) {
                this.calculateCPM()
            }
        } catch (error) {
            this._isCalculationFailed = true
            console.log(error)
        }
    }

    static initFromTask(tasks: Task[]): CpmModel {
        return new CpmModel(
            tasks.map(task => new CpmActivity(
                    task.id,
                    dateDiffInDays(task.startDate, task.endDate),
                    task.name,
                    task.taskSuccessor.map(value => value.relatedTaskId),
                    task.taskPredecessor.map(value => value.relatedTaskId)
                )
            )
        )
    }

    get activities(): CpmActivity[] {
        return Array.from(this._activities.values());
    }

    activitiesMap(): Map<number, CpmActivity> {
        return this._activities
    }

    get isCalculationFailed(): boolean {
        return this._isCalculationFailed;
    }

    isCriticalActivity(taskId: number): boolean {
        if (this.isCalculationFailed) return false
        return this.getActivitySafety(taskId).isCritical
    }

    topologicalSort(reverse?: boolean): CpmActivity[] {
        let sortedList: CpmActivity[] = []

        const sortedStartActivity = this._startActivities
            .map(id => this.getActivitySafety(id))
            .sort((a, b) => a.id - b.id)

        sortedList.push(...sortedStartActivity)

        for (let startActivity of sortedStartActivity) {
            for (let successorId of startActivity.successors) {
                sortedList = this.innerSort(this.getActivitySafety(successorId), sortedList)
            }
        }

        return reverse ? sortedList.reverse() : sortedList
    }

    innerSort(activity: CpmActivity, sortedList: CpmActivity[]): CpmActivity[] {
        if (sortedList.some(value => value.id === activity.id)) return sortedList
        for (let predecessorId of activity.predecessors) {
            if (!sortedList.some(value => value.id === predecessorId)) {
                sortedList = this.innerSort(this.getActivitySafety(predecessorId), sortedList)
            }
        }
        if (!sortedList.some(value => value.id === activity.id))
            sortedList.push(activity)

        for (let successorId of activity.successors) {
            sortedList = this.innerSort(this.getActivitySafety(successorId), sortedList)
        }

        return sortedList
    }

    initModel(cpmActivities: CpmActivity[]): void {
        for (let activity of cpmActivities) {
            this._activities.set(activity.id, activity)

            if (activity.predecessors.length === 0 && activity.successors.length === 0) {
                throw new Error("Project graph isn't related")
            }

            if (!activity.predecessors.length)
                this._startActivities.push(activity.id)

            if (!activity.successors.length)
                this._endActivities.push(activity.id)
        }
    }

    getActivitySafety(id: number): CpmActivity {
        const activity = this._activities.get(id)
        if (!activity) throw new Error(`Activity with=${id} not found`)
        return activity
    }

    calculateCPM(): void {
        for (let startActivityId of this._startActivities) {
            const startActivity = this.getActivitySafety(startActivityId)
            startActivity.earliestStart = 0
            startActivity.earliestFinish = startActivity.duration
        }

        for (let value of this._activities.values()) {
            this.doForwardPass(value)
        }

        const maxEarliestFinish = Math.max(...this._endActivities.map(id => {
            const endActivity = this.getActivitySafety(id)
            if (!endActivity.earliestFinish)
                throw new Error("Activity with id=" + id + " doesn't have set EF value")
            return endActivity.earliestFinish
        }))

        for (let endActivityId of this._endActivities) {
            const endActivity = this.getActivitySafety(endActivityId)
            endActivity.latestFinish = maxEarliestFinish
            endActivity.latestStart = maxEarliestFinish - endActivity.duration
        }

        const activitiesArray = this.activities
        for (let i = activitiesArray.length - 1; i >= 0; i--) {
            this.doBackwardPass(activitiesArray[i])
        }

        for (let value of this._activities.values()) {
            this.doFloatCalculation(value)
        }
    }

    doForwardPass(activity: CpmActivity): void {
        if (activity.earliestStart === 0)
            return

        let maxEFPredecessor = -1

        for (let predecessorId of activity.predecessors) {
            const predecessor = this.getActivitySafety(predecessorId)

            if (predecessor.earliestStart === undefined)
                this.doForwardPass(predecessor)

            if (predecessor.earliestFinish === undefined) {
                throw new Error("Predecessor ES is undefined")
            }

            if (maxEFPredecessor < predecessor.earliestFinish)
                maxEFPredecessor = predecessor.earliestFinish
        }

        if (maxEFPredecessor <= 0)
            throw new Error("Invalid MAX EF value")

        activity.earliestStart = maxEFPredecessor
        activity.earliestFinish = maxEFPredecessor + activity.duration
    }

    doBackwardPass(activity: CpmActivity): void {
        if (activity.latestFinish && activity.latestStart)
            return

        let minLSSuccessor = Number.MAX_VALUE;

        for (let successorId of activity.successors) {
            const successor = this.getActivitySafety(successorId)

            if (successor.latestStart === undefined)
                this.doBackwardPass(successor)

            if (successor.latestStart === undefined)
                throw new Error("Successor LS is undefined")

            if (minLSSuccessor > successor.latestStart)
                minLSSuccessor = successor.latestStart
        }

        if (minLSSuccessor === Number.MAX_VALUE)
            throw new Error("Invalid MIN LS value")

        activity.latestFinish = minLSSuccessor
        activity.latestStart = minLSSuccessor - activity.duration
    }

    doFloatCalculation(activity: CpmActivity): void {
        if (activity.latestStart === undefined || activity.earliestStart === undefined || activity.earliestFinish === undefined)
            throw new Error("Activity LS, ES or EF is not defined")

        activity.totalFloat = activity.latestStart - activity.earliestStart

        let minEsSuccessors = Math.min(...activity.successors.map(id => {
            const successor = this.getActivitySafety(id)
            if (successor.earliestStart === undefined)
                throw new Error("Activity ES is not defined")
            return successor.earliestStart
        }))

        minEsSuccessors = activity.successors.length == 0 ? activity.earliestFinish : minEsSuccessors
        activity.freeFloat = minEsSuccessors - activity.earliestFinish
    }

}