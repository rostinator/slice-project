import {boolean, number, string} from "yup";

export class MpmRelationship {

    id: string;
    taskId: number;
    relatedTaskId: number;
    minimumTimeGap: number | undefined;
    maximumTimeGap: number | undefined;
    private _isForwardConditionFulfilled: boolean | undefined;
    private _isBackwardConditionFulfilled: boolean | undefined;

    constructor(taskId: number, relatedTaskId: number, minimumTimeGap: number | undefined, maximumTimeGap: number | undefined) {
        this.id = `${taskId}-${relatedTaskId}`
        this.taskId = taskId;
        this.relatedTaskId = relatedTaskId;
        this.minimumTimeGap = minimumTimeGap;
        this.maximumTimeGap = maximumTimeGap;
    }

    get minimumTimeGapOrDefaultValue(): number {
        return this.minimumTimeGap ? this.minimumTimeGap : 0
    }

    get maximumTimeGapOrDefaultValue(): number {
        return this.maximumTimeGap ? this.maximumTimeGap : Number.MAX_VALUE
    }

    get maximumTimeGapOrDefaultValueStr(): string {
        return this.maximumTimeGap ? this.maximumTimeGap.toString() : "&infin;"
    }

    get isForwardConditionFulfilled(): boolean | undefined {
        return this._isForwardConditionFulfilled;
    }

    set isForwardConditionFulfilled(value: boolean | undefined) {
        this._isForwardConditionFulfilled = value;
    }

    get isBackwardConditionFulfilled(): boolean | undefined {
        return this._isBackwardConditionFulfilled;
    }

    set isBackwardConditionFulfilled(value: boolean | undefined) {
        this._isBackwardConditionFulfilled = value;
    }
}