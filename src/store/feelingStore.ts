import { Feeling, FEELING_DOCUMENTS, DocumentVersion, FeelingDocument } from "@/domain";
import { FeelingDocumentRepository } from "@/repositories";
import "firebase/auth";
import { getRepository, runTransaction } from "fireorm";
import Vue from "vue";

const startYear = 2021;

export function feelingStore() {

    // private field
    let version = 0;
    let year = "";

    type State = {
        documents: FeelingDocument[]
    };

    const state = {
        documents: []
    } as State;

    const fetch = async (newYear: string) => {
        let needToUpdate = false;
        if (year === newYear) {
            // 更新があるかversion比較
            const docVersion = await getRepository(DocumentVersion).whereEqualTo("documentName", FEELING_DOCUMENTS).findOne();
            if (docVersion && docVersion.version != version) {
                version = docVersion.version;
                needToUpdate = true;
            }
        } else {
            needToUpdate = true;
            year = newYear;
        }

        if (!needToUpdate) return;

        state.documents = (await FeelingDocumentRepository.instance.findByYear(newYear))
            .map(x => Object.assign(new FeelingDocument(), x)); // オブジェクトを再生成しないと読み取り専用プロパティが参照できなかった
    }

    const update = async (userId: string, feeling: Feeling) => {
        const reopsitory = FeelingDocumentRepository.instance;
        const newEntity = await reopsitory.updateFeeling(year, userId, feeling);
        const currentDocIndex = state.documents.findIndex(x => x.id === newEntity.id);
        if (currentDocIndex >= 0) {
            state.documents.splice(currentDocIndex, 1, newEntity);
        } else {
            state.documents.push(newEntity);
        }
    }

    return Vue.observable({
        state: state,
        fetch: fetch,
        update: update
    });
}

export type FeelingStore = ReturnType<typeof feelingStore>;
