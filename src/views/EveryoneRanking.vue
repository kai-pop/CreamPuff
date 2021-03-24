<template>
  <div>
    <v-container>
      <v-row class="mb-5">
        <v-col cols="auto">
          <v-select
            :items="yearSelectItems"
            :value="year"
            @change="onChangeYear"
            menu-props="auto"
            label="Year"
            hide-details
            prepend-icon="mdi-calendar-search"
          ></v-select>
        </v-col>
      </v-row>
      <v-simple-table fixed-header :height="height" v-if="rankingMaxLength > 0">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">User</th>
              <th class="text-center" v-for="i in rankingMaxLength" :key="i">
                {{ i }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td class="text-center">
                <v-avatar>
                  <img :src="item.photoUrl" :alt="item.userName" />
                </v-avatar>
                <p>{{ item.userName }}</p>
              </td>
              <td
                class="text-center"
                v-for="(ranking, index) in item.rankings"
                :key="index"
              >
                <img :src="ranking.imageUrl" height="150" />
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-container>
  </div>
</template>

<style>
table > tbody > tr > td:nth-child(1),
table > thead > tr > th:nth-child(1) {
  position: sticky !important;
  left: 0;
  z-index: 9998;
  background: white;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import "@/domain/Date.extensions";
import { User, RankingDocument, Ranking } from "@/domain";
import { RankingItemImage, RankingChart } from "@/components";
import { EveryoneRankingItemViewModel } from "@/viewModels";
import firebase from "firebase/app";
import "firebase/auth";
import linq from "linq";
import { getRepository } from "fireorm";
import { RankingDocumentRepository } from "@/repositories";

@Component({
  components: { RankingItemImage, RankingChart }
})
export default class EveryoneRanking extends Vue {
  @Prop({ default: new Date().getFullYear().toString() })
  year!: string;

  yearSelectItems: string[] = this.$globalStore.creamPuffs.state.selectItems;

  rankingDocs: RankingDocument[] = [];

  users: User[] = [];

  get rankingMaxLength() {
    if (!this.rankingDocs.length) return 0;
    const rankingItemsLengths = this.rankingDocs.map(x => x.items.length);
    return Math.max(...rankingItemsLengths);
  }

  height = window.innerHeight - 210;

  get items() {
    if (this.rankingMaxLength === 0) return [];

    return linq
      .from(this.rankingDocs)
      .groupJoin(
        this.users,
        x => x.userId,
        x => x.id,
        (ranking, users) => ({
          ranking: ranking,
          users: users
        })
      )
      .selectMany(
        x => x.users.defaultIfEmpty(),
        (x, user) => {
          const array = Array(this.rankingMaxLength).fill(new Ranking());
          array.splice(0, x.ranking.items.length, ...x.ranking.items);
          return new EveryoneRankingItemViewModel(array, user);
        }
      )
      .toArray();
  }

  get chartData() {
    if (!this.rankingDocs) return {};
    const totalRanking = this.totalRanking();
    const datasets = this.rankingDocs.map(rankingDoc => {
      const myRankingLength = rankingDoc.items.length;
      const user = this.users.find(user => user.id === rankingDoc.userId);

      const data = linq
        .from(totalRanking)
        .groupJoin(
          rankingDoc.items,
          x => x.id,
          x => x.creamPuffId,
          (x, rankings) => ({
            totalRanking: x,
            myRankings: rankings
          })
        )
        .selectMany(
          x => x.myRankings.defaultIfEmpty(),
          (x, myRanking) => myRankingLength - myRanking.orderNo + 1
        )
        .toArray();

      return {
        label: user?.name ?? rankingDoc.userId.toString(),
        data: data
      };
    });
    return {
      labels: totalRanking.map(x => x.id),
      datasets: datasets.map(x => Object.assign({}, x))
    } as Chart.ChartData;
  }

  totalRanking() {
    return linq
      .from(this.rankingDocs)
      .selectMany(x => {
        const length = x.items.length;
        return x.items.map((item, index) => ({
          creamPuffId: item.creamPuffId,
          imageUrl: item.imageUrl,
          point: length - index
        }));
      })
      // creamPuff.nameが必要だから結合
      .groupJoin(
        this.$globalStore.creamPuffs.state.items,
        x => x.creamPuffId,
        x => x.id,
        (ranking, creamPuffs) => ({ ranking: ranking, creamPuffs: creamPuffs })
      )
      .selectMany(
        x => x.creamPuffs.defaultIfEmpty(),
        (x, creamPuff) => ({
          ranking: x.ranking,
          creamPuff: creamPuff
        })
      )
      .groupBy(
        x => x.creamPuff,
        x => x.ranking.point,
        (key, grp) => ({ key: key, point: grp.sum() }),
        x => x.id
      )
      .orderByDescending(x => x.point)
      .select(x => x.key)
      .toArray();
  }

  async created() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const results = await Promise.all([
          RankingDocumentRepository.instance.findByYear(this.year),
          getRepository(User).find()
        ]);
        this.rankingDocs = results[0];
        this.users = results[1];
      }
    });
  }

  async onChangeYear(year: string) {
    await this.$router.push({
      query: {
        year: year
      }
    });
  }
}
</script>
