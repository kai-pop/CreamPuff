import { Collection } from 'fireorm';
import firebase from "firebase/app";

@Collection("Users")
export class User {
    id!: string;
    name: string | null = null;
    photoUrl: string | null = null;

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }

    equals(value: firebase.User) {
        return this.id === value.uid &&
            this.name === value.displayName &&
            this.photoUrl === value.photoURL;
    }

    map(value: firebase.User) {
        if (this.id != value.uid) throw new Error("マッピング対象の id が一致しません。");
        this.name = value.displayName;
        this.photoUrl = value.photoURL;
    }
}