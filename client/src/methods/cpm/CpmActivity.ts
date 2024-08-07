import {Activity} from "../../componens/project/CalculationStepper";

export class CpmActivity implements Activity {

    public id: number;
    private _duration: number;
    public name: string;
    private _successors: number[];
    private _predecessors: number[];
    private _calculationFailed: boolean;

    private _earliestStart: number | undefined;
    private _earliestFinish: number| undefined;
    private _latestStart: number| undefined;
    private _latestFinish: number| undefined;
    private _totalFloat: number| undefined;
    private _freeFloat: number| undefined;
    public isCritical: boolean;

    constructor(id: number, duration: number, name: string, successors: number[], predecessors: number[]) {
        this.id = id;
        this._duration = duration;
        this.name = name;
        this._successors = successors;
        this._predecessors = predecessors;
        this._calculationFailed = false;
        this.isCritical = false;
    }

    get duration(): number {
        return this._duration;
    }

    set duration(value: number) {
        this._duration = value;
    }

    // get name(): string {
    //     return this.name;
    // }
    //
    // set name(value: string) {
    //     this.name = value;
    // }

    get successors(): number[] {
        return this._successors;
    }

    get predecessors(): number[] {
        return this._predecessors;
    }

    get calculationFailed(): boolean {
        return this._calculationFailed;
    }

    set calculationFailed(value: boolean) {
        this._calculationFailed = value;
    }

    get earliestStart(): number | undefined {
        return this._earliestStart;
    }

    set earliestStart(value: number | undefined) {
        this._earliestStart = value;
    }

    get earliestFinish(): number | undefined {
        return this._earliestFinish;
    }

    set earliestFinish(value: number | undefined) {
        this._earliestFinish = value;
    }

    get latestStart(): number | undefined {
        return this._latestStart;
    }

    set latestStart(value: number | undefined) {
        this._latestStart = value;
    }

    get latestFinish(): number | undefined {
        return this._latestFinish;
    }

    set latestFinish(value: number | undefined) {
        this._latestFinish = value;
    }

    get totalFloat(): number | undefined {
        return this._totalFloat;
    }

    set totalFloat(value: number | undefined) {
        this._totalFloat = value;
        this.isCritical = this._totalFloat !== undefined && this._totalFloat <= 0.0000000001
    }

    get freeFloat(): number | undefined {
        return this._freeFloat;
    }

    set freeFloat(value: number | undefined) {
        this._freeFloat = value;
    }

}