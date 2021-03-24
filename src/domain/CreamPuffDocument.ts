import { CreamPuff } from '@/domain';
import { Collection } from 'fireorm';

@Collection("CreamPuffs")
export class CreamPuffDocument {
    id!: string;
    year!: string;
    items!: CreamPuff[]
}
