import { creamPuffStore } from "./creamPuffStore";
import { feelingStore } from "./feelingStore";

export default function globalStore() {
    return {
        creamPuffs: creamPuffStore(),
        fellings: feelingStore()
    };
}

export type GlobalStore = ReturnType<typeof globalStore>;