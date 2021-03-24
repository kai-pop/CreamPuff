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
      <v-data-iterator
        disable-sort
        :items="items"
        :page="itemsPage"
        :items-per-page="itemsPerPage"
      >
        <template v-slot:default="props">
          <v-row>
            <v-col
              v-for="item in props.items"
              :key="item.fromForDisplay"
              cols="12"
              sm="4"
              md="3"
              lg="2"
            >
              <ranking-item-image :item="item" @on-click="onClickCard">
                <template v-slot:bottom-left>
                  <v-badge
                    :content="item.buyCount"
                    :value="item.buyCount"
                    color="green darken-2"
                    overlap
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on" @click.stop="onClickBuy(item)">
                          <v-icon v-if="item.buyCount" color="green darken-2"
                            >mdi-cart</v-icon
                          >
                          <v-icon v-else color="grey darken-2">mdi-cart</v-icon>
                        </v-btn>
                      </template>
                      <span>買います</span>
                    </v-tooltip>
                  </v-badge>
                </template>

                <template v-slot:bottom-right>
                  <!--バッヂがはみでるからpadding-rightをマイナスで左に寄せる-->
                  <div class="pr-2">
                    <v-badge
                      :content="item.notNeedCount"
                      :value="item.notNeedCount"
                      color="pink darken-2"
                      overlap
                    >
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            icon
                            v-on="on"
                            @click.stop="onClickNotNeed(item)"
                          >
                            <v-icon
                              v-if="item.notNeedCount"
                              color="pink darken-2"
                              >mdi-cancel</v-icon
                            >
                            <v-icon v-else color="grey darken-2"
                              >mdi-cancel</v-icon
                            >
                          </v-btn>
                        </template>
                        <span>買いません</span>
                      </v-tooltip>
                    </v-badge>
                  </div>
                </template>
              </ranking-item-image>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.this-week {
  border: 3px solid rgb(196, 147, 25);
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import "@/domain/Date.extensions";
import { Feeling } from "@/domain";
import { RankingItemImage } from "@/components";
import {
  WeeklyMenuItemViewModel,
  ICreamPuffImage,
  FeelingViewModel
} from "@/viewModels";
import firebase from "firebase/app";
import "firebase/auth";
import { getUserId } from "@/helper";
import linq from "linq";

@Component({
  components: { RankingItemImage }
})
export default class WeeklyMenu extends Vue {
  itemsPage = 1;
  itemsPerPage = 10;

  yearSelectItems: string[] = this.$globalStore.creamPuffs.state.selectItems;

  @Prop({ default: new Date().getFullYear().toString() })
  year!: string;

  get items() {
    const userId = getUserId()!;
    const feelings = linq
      .from(this.$globalStore.fellings.state.documents)
      .select(x =>
        x.items.map(f => ({
          userId: x.userId,
          creamPuffId: f.creamPuffId,
          buy: f.buy,
          notNeed: f.notNeed
        }))
      )
      .selectMany(x => x)
      .groupBy(x => x.creamPuffId)
      .select(
        x =>
          new FeelingViewModel({
            creamPuffId: x.key(),
            buyCount: x.count(y => y.buy),
            notNeedCount: x.count(y => y.notNeed),
            buy: x.any(y => y.userId === userId && y.buy),
            notNeed: x.any(y => y.userId === userId && y.notNeed)
          })
      )
      .toArray();

    return linq
      .from(this.$globalStore.creamPuffs.state.items)
      .groupJoin(
        feelings,
        x => x.id,
        x => x.creamPuffId,
        (creamPuff, feelings) => ({
          creamPuff: creamPuff,
          feelings: feelings
        })
      )
      .selectMany(
        x => x.feelings.defaultIfEmpty(),
        (x, feeling) => new WeeklyMenuItemViewModel(x.creamPuff, feeling)
      )
      .toArray();
  }

  async created() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        await this.$globalStore.creamPuffs.fetch(this.year);
        const thisWeekIndex = this.$globalStore.creamPuffs.state.items.findIndex(x => x.thisWeek);
        this.itemsPage = Math.trunc(thisWeekIndex / this.itemsPerPage) + 1;
        await this.$globalStore.fellings.fetch(this.year);
      }
    });
  }

  async onChangeYear(year: string) {
    await this.$router.push({
      //name: "WeeklyMenu",
      query: {
        year: year
      }
    });
  }

  async onClickBuy(item: WeeklyMenuItemViewModel) {
    const userId = getUserId();
    const feeling = new Feeling({
      creamPuffId: item.creamPuffId,
      buy: !item.buy,
      notNeed: false
    });
    await this.$globalStore.fellings.update(userId!, feeling);
  }

  async onClickNotNeed(item: WeeklyMenuItemViewModel) {
    const userId = getUserId();
    const feeling = new Feeling({
      creamPuffId: item.creamPuffId,
      buy: false,
      notNeed: !item.notNeed
    });
    await this.$globalStore.fellings.update(userId!, feeling);
  }

  async onClickCard(item: ICreamPuffImage) {
    await this.$router.push({
      name: "MyRanking",
      query: {
        year: this.year,
        creamPuffId: item.creamPuffId.toString()
      }
    });
  }
}
</script>
