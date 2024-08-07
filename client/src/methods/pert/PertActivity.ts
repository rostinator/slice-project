import {CpmActivity} from "../cpm/CpmActivity";


export class PertActivity extends CpmActivity {

    optimisticEstimation: number | undefined;
    modalEstimation: number | undefined;
    pessimisticEstimation: number | undefined;
    averageDuration: number | undefined;
    standardDeviation: number | undefined;
    dispersion: number | undefined;


    constructor(id: number, duration: number, name: string, successors: number[], predecessors: number[],
                optimisticEstimation?: number, modalEstimation?: number, pessimisticEstimation?: number) {
        super(id, duration, name, successors, predecessors);
        this.optimisticEstimation = optimisticEstimation;
        this.modalEstimation = modalEstimation;
        this.pessimisticEstimation = pessimisticEstimation;
    }

    calculateMissingValues() {
        if (this.optimisticEstimation === undefined
            || this.modalEstimation === undefined
            || this.pessimisticEstimation === undefined)
            return

        this.averageDuration = (this.optimisticEstimation + (4 * this.modalEstimation) + this.pessimisticEstimation) / 6
        this.standardDeviation = (this.pessimisticEstimation - this.optimisticEstimation) / 6
        this.dispersion = Math.pow(this.standardDeviation, 2)
        this.duration = this.averageDuration
    }
}