import { Ranking, User } from "@/domain";

export class EveryoneRankingItemViewModel {

    get userName() { return this.user?.name ?? ""; }

    get photoUrl() { return this.user?.photoUrl ?? ""; }

    constructor(readonly rankings: Ranking[], private readonly user?: User) {
    }

}