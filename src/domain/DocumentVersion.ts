import { Collection } from 'fireorm';


export const FEELING_DOCUMENTS ="FeelingDocuments" ;
export const CREAM_PUFF_DOCUMENTS ="CreamPuffDocuments" ;
export const RANKING_DOCUMENTS ="RankingDocuments" ;


@Collection("DocumentVersion")
export class DocumentVersion {
    id!: string;
    documentName!: string;
    version!: number;

    // constructor(init?: Partial<DocumentVersion>)
    // {
    //     Object.assign(this, init);
    // }
}
