export class FeelingViewModel {
    creamPuffId!: number;
    buyCount!: number;
    notNeedCount!: number;
    buy!: boolean;
    notNeed!: boolean;

    constructor(init?: Partial<FeelingViewModel>) {
        Object.assign(this, init);
    }
}