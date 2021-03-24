import { CreamPuff, Feeling } from "@/domain";
import { ICreamPuffImage } from ".";
import { FeelingViewModel } from "./FeelingViewModel";

export class WeeklyMenuItemViewModel implements ICreamPuffImage {

    get creamPuffId() { return this.entity.id; }

    get caption() { return `${this.entity.fromForDisplay} ～ ${this.entity.toForDisplay}`; }

    get imageUrl() { return this.entity.imageUrl; }

    get buyCount() { return this.feelingViewModel?.buyCount ?? 0; }

    get notNeedCount() { return this.feelingViewModel?.notNeedCount ?? 0; }

    get buy() { return this.feelingViewModel?.buy ?? false; }

    get notNeed() { return this.feelingViewModel?.notNeed ?? false; }

    get thisWeek() { return this.entity.thisWeek; }

    constructor(readonly entity: CreamPuff, readonly feelingViewModel: FeelingViewModel) {
    }
}