import "firebase/firestore"
import { BaseFirestoreRepository, CustomRepository, getCustomRepository, getRepository, runTransaction } from 'fireorm';
import { RankingDocument, Feeling, DocumentVersion, Ranking, RANKING_DOCUMENTS } from "@/domain";

@CustomRepository(RankingDocument)
export class RankingDocumentRepository extends BaseFirestoreRepository<RankingDocument> {

  static get instance() {
    return getCustomRepository(RankingDocument) as RankingDocumentRepository;
  }

  async findByYear(year: string): Promise<RankingDocument[]> {
    const documents = await this.whereEqualTo("year", year).find();
    if (documents.length) {
      return documents;
    } else {
      return [];
    }
  }

  async findMyDocument(year: string, userId: string) {
    const document = await this.whereEqualTo("year", year).whereEqualTo("userId", userId).findOne();
    return document;
  }

  async findMyRanking(year: string, userId: string): Promise<Ranking[]> {
    const document = await this.findMyDocument(year, userId);
    return document?.items ?? [];
  }


  async updateRanking(year: string, userId: string, rankings: Ranking[]) {
    const version = await getRepository(DocumentVersion).whereEqualTo("documentName", RANKING_DOCUMENTS).findOne();
    const rankingDocument = await this.findMyDocument(year, userId);

    return await runTransaction(async tran => {

      // DocumentVersion 更新
      const versionRepository = tran.getRepository(DocumentVersion);

      if (version) {
        version.version++;
        await versionRepository.update(version);
      } else {
        const newDoc = new DocumentVersion();
        newDoc.documentName = RANKING_DOCUMENTS;
        newDoc.version = 1;
        await versionRepository.create(newDoc)
      }


      // RankingDocuments 更新
      const items = rankings.map(x => Object.assign({}, x));
      const rankingDocumentRepository = tran.getRepository(RankingDocument);
      if (rankingDocument) {
        rankingDocument.items = items;

        // update document
        return await rankingDocumentRepository.update(rankingDocument);

      } else {
        // create document
        return await rankingDocumentRepository.create(new RankingDocument({ year: year, userId: userId, items: items }));
      }
    });
  }
}