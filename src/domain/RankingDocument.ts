import { Collection } from 'fireorm';
import { Ranking } from '.';

@Collection("RankingDocuments")
export class RankingDocument {
    id!: string;
    year!: string;
    userId!: string;
    items!: Ranking[]

    constructor(init?: Partial<RankingDocument>) {
        Object.assign(this, init);
    }
}
