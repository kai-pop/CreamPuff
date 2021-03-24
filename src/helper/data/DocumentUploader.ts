import { getRepository } from 'fireorm';
import { CreamPuff } from '@/domain/CreamPuff';
import firebase from "firebase/app";
import "firebase/firestore"
import { CreamPuffDocument } from '@/domain';


export async function uploadCreamPuff() {

    const data = `2021/01/01	2021/01/07	ティラミス風味	https://gateausenka.jp/image/2021/01/mc2021-01.jpg
2021-01-08	2021-01-14	苺ミルク	https://gateausenka.jp/image/2021/01/mc2021-02.jpg
2021-01-15	2021-01-21	チョコバナナ	https://gateausenka.jp/image/2021/01/mc2021-03.jpg
2021-01-22	2021-01-28	あん生クリーム	https://gateausenka.jp/image/2021/01/mc2021-04.jpg
2021-01-29	2021-02-04	クッキークリーム	https://gateausenka.jp/image/2021/01/mc2021-05.jpg
2021-02-05	2021-02-11	塚田のフルーツ牛乳	https://gateausenka.jp/image/2021/01/mc2021-06.jpg
2021-02-12	2021-02-18	プレミアム生チョコ	https://gateausenka.jp/image/2021/01/mc2021-07.jpg
2021-02-19	2021-02-25	Wクリーム	https://gateausenka.jp/image/2021/01/mc2021-08.jpg
2021-02-26	2021-03-04	焦がしプリン	https://gateausenka.jp/image/2021/01/mc2021-09.jpg
2021-03-05	2021-03-11	豆乳クリーム	https://gateausenka.jp/image/2021/01/mc2021-10.jpg
2021-03-12	2021-03-18	濃厚カスタード	https://gateausenka.jp/image/2021/01/mc2021-11.jpg
2021-03-19	2021-03-25	マーマレード	https://gateausenka.jp/image/2021/01/mc2021-12.jpg
2021-03-26	2021-04-01	苺	https://gateausenka.jp/image/2021/01/mc2021-13.jpg
2021-04-02	2021-04-08	ブルーベリー	https://gateausenka.jp/image/2021/01/mc2021-14.jpg
2021-04-09	2021-04-15	桜の生シュー	https://gateausenka.jp/image/2021/01/mc2021-15.jpg
2021-04-16	2021-04-22	マスカルポーネ	https://gateausenka.jp/image/2021/01/mc2021-16.jpg
2021-04-23	2021-04-29	メープルシロップ	https://gateausenka.jp/image/2021/01/mc2021-17.jpg
2021-04-30	2021-05-06	ブルーベリー	https://gateausenka.jp/image/2021/01/mc2021-18.jpg
2021-05-07	2021-05-13	塩キャラメル	https://gateausenka.jp/image/2021/01/mc2021-19.jpg
2021-05-14	2021-05-20	コーヒーゼリー	https://gateausenka.jp/image/2021/01/mc2021-20.jpg
2021-05-21	2021-05-27	苺ヨーグルト	https://gateausenka.jp/image/2021/01/mc2021-21.jpg
2021-05-28	2021-06-03	プレミアム生シュー	https://gateausenka.jp/image/2021/01/mc2021-22.jpg
2021-06-04	2021-06-10	ルレクチェ	https://gateausenka.jp/image/2021/01/mc2021-23.jpg
2021-06-11	2021-06-17	杏仁豆腐	https://gateausenka.jp/image/2021/01/mc2021-24.jpg
2021-06-18	2021-06-24	ピーチ生クリーム	https://gateausenka.jp/image/2021/01/mc2021-25.jpg
2021-06-25	2021-07-01	クリームチーズ	https://gateausenka.jp/image/2021/01/mc2021-26.jpg
2021-07-02	2021-07-08	バナナカスタード	https://gateausenka.jp/image/2021/01/mc2021-27.jpg
2021-07-09	2021-07-15	塩バニラ	https://gateausenka.jp/image/2021/01/mc2021-28.jpg
2021-07-16	2021-07-22	シトラスレモン	https://gateausenka.jp/image/2021/01/mc2021-29.jpg
2021-07-23	2021-07-29	濃厚ミルク	https://gateausenka.jp/image/2021/01/mc2021-30.jpg
2021-07-30	2021-08-05	ゴールデンパイン	https://gateausenka.jp/image/2021/01/mc2021-31.jpg
2021-08-06	2021-08-12	キウイヨーグルト	https://gateausenka.jp/image/2021/01/mc2021-32.jpg
2021-08-13	2021-08-19	黒崎茶豆	https://gateausenka.jp/image/2021/01/mc2021-33.jpg
2021-08-20	2021-08-26	キャラメルルレクチェ	https://gateausenka.jp/image/2021/01/mc2021-34.jpg
2021-08-27	2021-09-02	アーモンドチョコ	https://gateausenka.jp/image/2021/01/mc2021-35.jpg
2021-09-03	2021-09-09	安納芋	https://gateausenka.jp/image/2021/01/mc2021-36.jpg
2021-09-10	2021-09-16	マロンマロン	https://gateausenka.jp/image/2021/01/mc2021-37.jpg
2021-09-17	2021-09-23	抹茶ティラミス	https://gateausenka.jp/image/2021/01/mc2021-38.jpg
2021-09-24	2021-09-30	スイートポテト	https://gateausenka.jp/image/2021/01/mc2021-39.jpg
2021-10-01	2021-10-07	ピスタチオ	https://gateausenka.jp/image/2021/01/mc2021-40.jpg
2021-10-08	2021-10-14	バターシュガー	https://gateausenka.jp/image/2021/01/mc2021-41.jpg
2021-10-15	2021-10-21	黒ゴマチーズ	https://gateausenka.jp/image/2021/01/mc2021-42.jpg
2021-10-22	2021-10-28	チョコレート	https://gateausenka.jp/image/2021/01/mc2021-43.jpg
2021-10-29	2021-11-04	パンプキンカスタード	https://gateausenka.jp/image/2021/01/mc2021-44.jpg
2021-11-05	2021-11-11	ラムレーズン	https://gateausenka.jp/image/2021/01/mc2021-45.jpg
2021-11-12	2021-11-18	アップルカスタード	https://gateausenka.jp/image/2021/01/mc2021-46.jpg
2021-11-19	2021-11-25	ココア	https://gateausenka.jp/image/2021/01/mc2021-47.jpg
2021-11-26	2021-12-02	抹茶ミルク	https://gateausenka.jp/image/2021/01/mc2021-48.jpg
2021-12-03	2021-12-09	ダブルチーズ	https://gateausenka.jp/image/2021/01/mc2021-49.jpg
2021-12-10	2021-12-16	エスプレッソクリーム	https://gateausenka.jp/image/2021/01/mc2021-50.jpg
2021-12-17	2021-12-23	黒蜜きなこ	https://gateausenka.jp/image/2021/01/mc2021-51.jpg
2021-12-24	2021-12-30	生チョコ	https://gateausenka.jp/image/2021/01/mc2021-52.jpg
2021-12-31	2022-01-06	豆乳ココア	https://gateausenka.jp/image/2021/01/mc2021-53.jpg`;



    // const items = data.split("\n").map(x => {
    //     const values = x.split("\t");
    //     const creamPuff = new CreamPuff();
    //     creamPuff.from = new Date(values[0]);
    //     creamPuff.to = new Date(values[1]);
    //     creamPuff.name = values[2];
    //     creamPuff.imageUrl = values[3];
    //     creamPuff.year = "2021";
    //     return creamPuff;
    // });
    // //console.log(items);

    // const repository = getRepository(CreamPuff);
    // const batch = repository.createBatch();
    // items.forEach(x => {
    //     batch.create(x);
    // });
    // batch.commit();



    
    // const items = data.split("\n").map((x, index) => {
    //     const values = x.split("\t");
    //     const creamPuff:any = {};
    //     creamPuff.id = index;
    //     creamPuff.from = new Date(values[0]);
    //     creamPuff.to = new Date(values[1]);
    //     creamPuff.name = values[2];
    //     creamPuff.imageUrl = values[3];
    //     creamPuff.year = "2021";
    //     return creamPuff;
    // });
    
    // const docuemnt = new CreamPuffDocument();
    // docuemnt.year = "2021";
    // docuemnt.items = items;

    // const repository = getRepository(CreamPuffDocument);
    // await repository.create(docuemnt);
}