import "firebase/firestore"
import { BaseFirestoreRepository, CustomRepository, getCustomRepository, getRepository, runTransaction } from 'fireorm';
import { User, Feeling, DocumentVersion, Ranking, RANKING_DOCUMENTS } from "@/domain";

@CustomRepository(User)
export class UserRepository extends BaseFirestoreRepository<User> {

  static get instance() {
    return getCustomRepository(User) as UserRepository;
  }
}