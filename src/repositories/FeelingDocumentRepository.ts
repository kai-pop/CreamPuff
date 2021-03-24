import "firebase/firestore"
import { BaseFirestoreRepository, CustomRepository, getCustomRepository, getRepository, runTransaction } from 'fireorm';
import { FeelingDocument, Feeling, DocumentVersion, FEELING_DOCUMENTS } from "@/domain";

@CustomRepository(FeelingDocument)
export class FeelingDocumentRepository extends BaseFirestoreRepository<FeelingDocument> {

  static get instance() {
    return getCustomRepository(FeelingDocument) as FeelingDocumentRepository;
  }

  async findByYear(year: string): Promise<FeelingDocument[]> {
    const documents = await this.whereEqualTo("year", year).find();
    if (documents.length) {
      return documents;
    } else {
      return [];
    }
  }

  async findMyDataByYear(year: string, userId: string): Promise<Feeling[]> {
    const documents = await this.whereEqualTo("year", year).whereEqualTo("userId", userId).findOne();
    return documents?.items ?? [];
  }

  async updateFeeling(year: string, userId: string, feeling: Feeling) {

    // // DocumentVersion 更新
    // const versionRepository = getRepository(DocumentVersion);

    // const version = await versionRepository.whereEqualTo("documentName", FEELING_DOCUMENTS).findOne();
    // if (version) {
    //   console.log("version", version);
    //   version.version++;
    //   await versionRepository.update(version);
    // } else {
    //   console.log("version is not exists");
    //   const newDoc = new DocumentVersion();
    //   newDoc.documentName = FEELING_DOCUMENTS;
    //   newDoc.version =1;
    //   await versionRepository.create(newDoc)
    //   //await versionRepository.create(new DocumentVersion({ documentName: FEELING_DOCUMENTS, version: 1 }))
    // }

    // console.log("version updated.")

    // // FeelingDocuments 更新
    // const feelingDocumentRepository = getRepository(FeelingDocument);
    // const feelingDocument = await feelingDocumentRepository.whereEqualTo("year", year).whereEqualTo("userId", userId).findOne();
    // console.log("feelingDocument", feelingDocument);
    // if (feelingDocument) {
    //   const items = feelingDocument.items;
    //   const currentFeelingIndex = items.findIndex(x => x.creamPuffId === feeling.creamPuffId);
    //   if (currentFeelingIndex > 0) {
    //     // update items
    //     items.splice(currentFeelingIndex, 1, feeling);
    //   } else {
    //     // add items
    //     items.push(feeling);
    //   }
    //   console.log("feelingDocument update")

    //   // update document
    //   return await feelingDocumentRepository.update(feelingDocument);

    // } else {
    //   // create document
    //   const newFeelingDoc = new FeelingDocument({ year: year, userId: userId, items: [Object.assign({}, feeling)] });
    //   // const newFeelingDoc = new FeelingDocument();
    //   // newFeelingDoc.year = year;
    //   // newFeelingDoc.userId = userId;
    //   // newFeelingDoc.items = [Object.assign({}, feeling)];
    //   // console.log("feelingDocument create", newFeelingDoc)
    //   return await feelingDocumentRepository.create(newFeelingDoc);
    // }


    const version = await getRepository(DocumentVersion).whereEqualTo("documentName", FEELING_DOCUMENTS).findOne();
    const feelingDocument = await getRepository(FeelingDocument).whereEqualTo("year", year).whereEqualTo("userId", userId).findOne();

    return await runTransaction(async tran => {

      // DocumentVersion 更新
      const versionRepository = tran.getRepository(DocumentVersion);

      if (version) {
        version.version++;
        await versionRepository.update(version);
      } else {
        const newDoc = new DocumentVersion();
        newDoc.documentName = FEELING_DOCUMENTS;
        newDoc.version = 1;
        await versionRepository.create(newDoc)
        //await versionRepository.create(new DocumentVersion({ documentName: FEELING_DOCUMENTS, version: 1 }))
      }


      // FeelingDocuments 更新
      const feelingDocumentRepository = tran.getRepository(FeelingDocument);
      if (feelingDocument) {
        const items = feelingDocument.items;
        const currentFeelingIndex = items.findIndex(x => x.creamPuffId === feeling.creamPuffId);
        if (currentFeelingIndex >= 0) {
          // update items
          items.splice(currentFeelingIndex, 1, Object.assign({}, feeling));
        } else {
          // add items
          items.push(Object.assign({}, feeling));
        }

        // update document
        return await feelingDocumentRepository.update(feelingDocument);

      } else {
        // create document
        return await feelingDocumentRepository.create(new FeelingDocument({ year: year, userId: userId, items: [Object.assign({}, feeling)] }));
      }
    });
  }
}