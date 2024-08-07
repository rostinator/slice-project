import {Task} from "../../model/models";
import {MpmRelationship} from "./MpmRelationship";
import {MpmActivity} from "./MpmActivity";
import {dateDiffInDays} from "../../utils/commonUtils";
import {CpmModel} from "../cpm/CpmModel";

export class MpmModel {

    private _activities: Map<number, MpmActivity>
    private _activitiesRelationship: Map<string, MpmRelationship>
    private _startActivities: number[]
    private _endActivities: number[]
    private _cpmModel: CpmModel
    private _isForwardCalculationFailed: boolean
    private _isBackwardCalculationFailed: boolean
    private _isInitFailed: boolean

    constructor(tasks: Task[]) {
        this._activities = new Map<number, MpmActivity>()
        this._activitiesRelationship = new Map<string, MpmRelationship>()
        this._startActivities = []
        this._endActivities = []
        this._isForwardCalculationFailed = false
        this._isBackwardCalculationFailed = false
        this._cpmModel = new CpmModel(this.activities, true)
        this._isInitFailed = false

        try {
            this.initModel(tasks)
        } catch (e) {
            this._isInitFailed = true
        }

        if (!this._isInitFailed) {
            try {
                this.calculateMpmMethod()
            } catch (e) {
                console.log(e)
            }
        }
    }

    topologicalSort(reverse?: boolean): MpmActivity[] {
        return this._cpmModel.topologicalSort(reverse)
    }

    get activitiesRelationship(): MpmRelationship[] {
        return Array.from(this._activitiesRelationship.values())
    }

    get activitiesRelationshipMap(): Map<string, MpmRelationship> {
        return this._activitiesRelationship
    }

    public findActivitiesRelationship(taskId?: number, relatedTaskId?: number): MpmRelationship | undefined {
        return this._activitiesRelationship.get(`${taskId}-${relatedTaskId}`)
    }

    get activities(): MpmActivity[] {
        return Array.from(this._activities.values())
    }

    get activitiesMap(): Map<number, MpmActivity> {
        return this._activities
    }

    get isForwardCalculationFailed(): boolean {
        return this._isForwardCalculationFailed;
    }

    get isBackwardCalculationFailed(): boolean {
        return this._isBackwardCalculationFailed;
    }

    get isInitFailed(): boolean {
        return this._isInitFailed;
    }

    getActivitySafety(id: number): MpmActivity {
        const activity = this._activities.get(id)
        if (!activity) throw new Error(`Activity with=${id} not found`)
        return activity
    }

    initModel(tasks: Task[]): void {
        for (let task of tasks) {
            const mpmActivity = new MpmActivity(
                task.id,
                dateDiffInDays(task.startDate, task.endDate),
                task.name,
                task.taskSuccessor.map(value => value.relatedTaskId),
                task.taskPredecessor.map(value => value.relatedTaskId)
            );

            this._activities.set(task.id, mpmActivity)

            if (mpmActivity.predecessors.length === 0 && mpmActivity.successors.length === 0) {
                throw new Error("Project graph isn't related")
            }

            if (!mpmActivity.predecessors.length)
                this._startActivities.push(mpmActivity.id)

            if (!mpmActivity.successors.length)
                this._endActivities.push(mpmActivity.id)

            for (let relatedTask of task.taskSuccessor) {
                const mpmRelationship = new MpmRelationship(
                    task.id,
                    relatedTask.relatedTaskId,
                    relatedTask.minimumTimeGap,
                    relatedTask.maximumTimeGap
                );

                this._activitiesRelationship.set(`${task.id}-${relatedTask.relatedTaskId}`, mpmRelationship)
            }
        }
    }

    private calculateMpmMethod(): void {
        for (let startActivityId of this._startActivities) {
            const startActivity = this.getActivitySafety(startActivityId)

            startActivity.earliestStart = 0
            startActivity.earliestFinish = startActivity.duration
        }

        for (let value of this._activities.values()) {
            if (!this.doForwardPass(value))
                break
        }

        let isForwardPassFailed = false

        for (let value of this._activities.values()) {
            if (value.earliestFinish === undefined || value.earliestStart === undefined) {
                value.calculationFailed = true
                isForwardPassFailed = true
            }
        }

        if (isForwardPassFailed) {
            this._isForwardCalculationFailed = true
            return
        }

        const maxEarliestFinish = Math.max(...this._endActivities.map(id => {
            const endActivity = this.getActivitySafety(id)
            if (!endActivity.earliestFinish)
                throw new Error("Activity with id=" + id + " doesn't have set earliestFinish value")
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

        let isBackwardPassFailed = false
        for (let value of this._activities.values()) {
            if (value.latestFinish === undefined || value.latestStart === undefined) {
                value.calculationFailed = true
                isBackwardPassFailed = true
            }
        }

        if (isBackwardPassFailed) {
            this._isBackwardCalculationFailed = true
            return
        }

        for (let value of this._activities.values()) {
            if (value.earliestFinish === undefined || value.earliestStart === undefined) {
                value.calculationFailed = true
                isForwardPassFailed = true
            }
        }

        for (let value of this._activities.values()) {
            this.doFloatCalculation(value)
        }
    }

    private doForwardPass(activity: MpmActivity): boolean {
        if (activity.earliestStart === 0) return true

        let maxSumEFAndMinimumTimeGap = -1

        for (let predecessorId of activity.predecessors) {
            const predecessor = this.getActivitySafety(predecessorId)

            if (predecessor.earliestStart === undefined) {
                const isConditionFulfilled = this.doForwardPass(predecessor);
                if (!isConditionFulfilled)
                    return false
            }

            if (predecessor.earliestFinish === undefined)
                throw new Error("Predecessor ES is undefined")

            const activitiesRelationship = this.findActivitiesRelationship(predecessorId, activity.id)
            if (activitiesRelationship === undefined)
                throw new Error("Activities relationship not found")

            const sumEFAndMinimumTimeGap = predecessor.earliestFinish + (activitiesRelationship.minimumTimeGap ? activitiesRelationship.minimumTimeGap : 0)
            if (sumEFAndMinimumTimeGap > maxSumEFAndMinimumTimeGap)
                maxSumEFAndMinimumTimeGap = sumEFAndMinimumTimeGap
        }

        if (maxSumEFAndMinimumTimeGap < 0)
            throw new Error("Unable to determinate EF")

        activity.earliestFinish = maxSumEFAndMinimumTimeGap + activity.duration
        activity.earliestStart = activity.earliestFinish - activity.duration

        // condition check
        for (let predecessorId of activity.predecessors) {
            const predecessor = this.getActivitySafety(predecessorId)
            const activitiesRelationship = this.findActivitiesRelationship(predecessorId, activity.id)
            if (!activitiesRelationship)
                throw new Error("Activities relationship not found")

            if (activity.earliestStart - (predecessor.earliestFinish ?? 0) <= (activitiesRelationship?.maximumTimeGapOrDefaultValue ?? Number.MAX_VALUE)) {
                activitiesRelationship.isForwardConditionFulfilled = true
            } else {
                activitiesRelationship.isForwardConditionFulfilled = false
                return false
            }
        }

        return true
    }

    private doBackwardPass(activity: MpmActivity) :boolean {
        if (activity.latestFinish && activity.latestStart)
            return true

        let minDiffLSAndMinimumTimeGap = Number.MAX_VALUE;

        for (let successorId of activity.successors) {
            const successor = this.getActivitySafety(successorId)

            if (successor.latestStart === undefined) {
                const isConditionFulfilled = this.doBackwardPass(successor)
                if (!isConditionFulfilled)
                    return false
            }

            if (successor.latestStart === undefined)
                throw new Error("Successor LS is undefined")

            const activitiesRelationship = this.findActivitiesRelationship(activity.id, successorId)
            if (activitiesRelationship === undefined)
                throw new Error("Activities relationship not found")

            const diffLSAndMinimumTimeGap = successor.latestStart - activitiesRelationship.minimumTimeGapOrDefaultValue

            if (minDiffLSAndMinimumTimeGap > diffLSAndMinimumTimeGap)
                minDiffLSAndMinimumTimeGap = diffLSAndMinimumTimeGap
        }

        activity.latestStart = minDiffLSAndMinimumTimeGap - activity.duration
        activity.latestFinish = activity.latestStart + activity.duration

        for (let successorId of activity.successors) {
            const successor = this.getActivitySafety(successorId)
            const activitiesRelationship = this.findActivitiesRelationship(activity.id, successorId)
            if (!activitiesRelationship)
                throw new Error("Activities relationship not found")

            if ((successor.latestStart ?? 0) - activity.latestFinish <= (activitiesRelationship?.maximumTimeGapOrDefaultValue ?? Number.MAX_VALUE)) {
                activitiesRelationship.isBackwardConditionFulfilled = true
            } else {
                activitiesRelationship.isBackwardConditionFulfilled = false
                return false
            }
        }

        return true
    }

    doFloatCalculation(activity: MpmActivity): void {
        if (activity.latestFinish === undefined || activity.earliestStart === undefined)
            throw new Error("Activity LF of ES is not defined")

        activity.totalFloat = activity.latestFinish - activity.earliestStart - activity.duration
    }

}