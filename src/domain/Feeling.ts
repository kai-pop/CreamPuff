export class Feeling {
    creamPuffId!: number;
    buy!: boolean;
    notNeed!: boolean;

    constructor(init?: Partial<Feeling>)
    {
        Object.assign(this, init);
    }
}