import { Collection } from 'fireorm';
import { Feeling } from '.';

@Collection("FeelingDocuments")
export class FeelingDocument {
    id!: string;
    year!: string;
    userId!: string;
    items!: Feeling[]

    constructor(init?: Partial<FeelingDocument>)
    {
        Object.assign(this, init);
    }
}
