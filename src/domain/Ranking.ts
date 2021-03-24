import { CreamPuff } from ".";

export class Ranking {

  creamPuffId!: number;

  orderNo!: number;

  imageUrl!: string;

  constructor(init?: Partial<Ranking>) {
    Object.assign(this, init);
  }

  static instanceForAdd(creamPuff: CreamPuff) {
    return new Ranking({
      creamPuffId: creamPuff.id,
      imageUrl: creamPuff.imageUrl
    });
  }
}