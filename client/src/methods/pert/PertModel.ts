import {PertActivity} from "./PertActivity";
import {Task} from "../../model/models";
import {CpmModel} from "../cpm/CpmModel";

export class PertModel {

    private _activities: Map<number, PertActivity>
    private _startActivities: number[]
    private _endActivities: number[]
    private _cpmModel?: CpmModel;
    private _isInitFailed: boolean;

    constructor(tasks: Task[]) {
        this._activities = new Map()
        this._startActivities = [];
        this._endActivities = [];
        this._isInitFailed = false
        try {
            this.initModel(tasks)
        } catch (e) {
            this._isInitFailed = true
        }

        try {
            if (this.hasAllActivitiesFilledEstimations())
                this._cpmModel = new CpmModel(this.activities)
        } catch (e) {
        }
    }

    get activities(): PertActivity[] {
        return Array.from(this._activities.values());
    }

    get cpmModel(): CpmModel | undefined {
        return this._cpmModel;
    }

    hasAllActivitiesFilledEstimations(): boolean {
        for (let value of this._activities.values()) {
            if (value.optimisticEstimation === undefined
                || value.modalEstimation === undefined
                || value.pessimisticEstimation === undefined) {
                return false
            }
        }
        return true
    }


    get isInitFailed(): boolean {
        return this._isInitFailed;
    }

    isCpmCalculated(): boolean {
        return !!this._cpmModel && !this._cpmModel.isCalculationFailed
    }

    initModel(tasks: Task[]): void {
        for (let task of tasks) {
            const activity = new PertActivity(
                task.id,
                -1,
                task.name,
                task.taskSuccessor.map(value => value.relatedTaskId),
                task.taskPredecessor.map(value => value.relatedTaskId),
                task.optimisticEstimation,
                task.modalEstimation,
                task.pessimisticEstimation
            )

            if (activity.optimisticEstimation !== undefined
                && activity.modalEstimation !== undefined
                && activity.pessimisticEstimation !== undefined) {
                if (!(0 <= activity.optimisticEstimation
                    && activity.optimisticEstimation <= activity.modalEstimation
                    && activity.modalEstimation <= activity.pessimisticEstimation)) {
                    throw new Error(`Task with id=${task.id} invalid values of time estimations`)
                }

                activity.calculateMissingValues()
            }

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

    criticalActivities(): PertActivity[] {
        // @ts-ignore
        return this._cpmModel === undefined ? [] : this._cpmModel.topologicalSort().filter(a => a.isCritical())
    }

    calculateProjectTotalDuration(): number {
        return this.activities.filter(a => a.isCritical).map(a => a.duration).reduce((a, b) => a + b)
    }

    calculateTotalProjectDispersion(): number {
        return this.activities.filter(a => a.isCritical).map(a => a.dispersion === undefined ? 0 : a.dispersion).reduce((a, b) => a + b)
    }
}