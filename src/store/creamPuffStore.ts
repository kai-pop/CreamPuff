import { CreamPuff, CREAM_PUFF_DOCUMENTS, DocumentVersion } from "@/domain";
import { CreamPuffDocumentRepository } from "@/repositories";
import "firebase/auth";
import { getRepository } from "fireorm";
import Vue from "vue";

const startYear = 2021;
const thisYear = new Date().getFullYear();

export function creamPuffStore() {

    // private field
    let version = 0;
    let year = "";

    type State = {
        selectItems: string[],
        items: CreamPuff[]
    };

    const state = {
        selectItems: Array(thisYear - startYear + 1).fill(0).map((_, i) => (startYear + i).toString()),
        items: []
    } as State;

    const fetch = async (newYear: string) => {
        let needToUpdate = false;
        if (year === newYear) {
            // 更新があるかversion比較
            const docVersion = await getRepository(DocumentVersion).whereEqualTo("documentName", CREAM_PUFF_DOCUMENTS).findOne();
            if (docVersion && docVersion.version != version) {
                version = docVersion.version;
                needToUpdate = true;
            }
        } else {
            needToUpdate = true;
            year = newYear;
        }

        if (!needToUpdate) return;

        state.items = (await CreamPuffDocumentRepository.instance.findByYear(newYear))
            .map(x => Object.assign(new CreamPuff(), x)); // オブジェクトを再生成しないと読み取り専用プロパティが参照できなかった
    }

    return Vue.observable({
        state: state,
        fetch: fetch
    });
}

export type CreamPuffStore = ReturnType<typeof creamPuffStore>;
