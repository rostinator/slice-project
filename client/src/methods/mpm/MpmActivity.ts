import {CpmActivity} from "../cpm/CpmActivity";

export class MpmActivity extends CpmActivity {

    constructor(id: number, duration: number, name: string, successors: number[], predecessors: number[]) {
        super(id, duration, name, successors, predecessors);
    }
}