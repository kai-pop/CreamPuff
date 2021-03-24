import "firebase/firestore"
import { BaseFirestoreRepository, CustomRepository, getCustomRepository } from 'fireorm';
import { CreamPuff, CreamPuffDocument } from "@/domain";

@CustomRepository(CreamPuffDocument)
export class CreamPuffDocumentRepository extends BaseFirestoreRepository<CreamPuffDocument> {

  static get instance() {
    return getCustomRepository(CreamPuffDocument) as CreamPuffDocumentRepository;
  }

  async findByYear(year: string): Promise<CreamPuff[]> {
    const documents = await this.whereEqualTo("year", year).findOne();
    return documents?.items ?? [];
  }

}