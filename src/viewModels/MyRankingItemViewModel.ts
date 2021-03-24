import { Ranking } from "@/domain";
import { ICreamPuffImage } from ".";

export class MyRankingItemViewModel implements ICreamPuffImage {

    get creamPuffId() { return this.item.creamPuffId; }

    get caption() { return this.item.orderNo?.toString() ?? ""; }

    get imageUrl() { return this.item.imageUrl; }

    get orderNo() { return this.item.orderNo; }

    get thisWeek() { return false; }

    constructor(readonly item: Ranking) {
    }
}