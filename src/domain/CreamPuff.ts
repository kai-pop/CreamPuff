import { Feeling } from ".";
import linq from "linq"

export class CreamPuff {
    id!: number;
    name!: string;
    imageUrl!: string;
    year!: string;
    from!: Date;
    to!: Date;
    feelings!: Feeling[];

    get fromForDisplay() {
        return this.from.toFormatString("M/D");
    }

    get toForDisplay() {
        return this.to.toFormatString("M/D");
    }

    get thisWeek() {
        return Date.today().between(new Date(this.from.setHours(0, 0, 0, 0)), new Date(this.to.setHours(0, 0, 0, 0)));
    }

    get buyCount() {
        return linq.from(this.feelings).count(x => x.buy);
    }

    get notNeedCount() {
        return linq.from(this.feelings).count(x => x.notNeed);
    }
}