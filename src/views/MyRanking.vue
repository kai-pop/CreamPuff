<template>
  <div>
    <v-container>
      <template v-if="hasAddItem">
        <p>下のランキングに追加してください。</p>
        <v-row
          is="draggable"
          class="row add-area"
          v-model="addItem"
          v-bind="dragOptionsOfAdding"
        >
          <v-col
            class="list-group-item"
            v-for="item in addItemVM"
            :key="item.creamPuffId"
            cols="12"
            sm="4"
            md="3"
            lg="2"
          >
            <ranking-item-image :item="item" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
      </template>

      <v-row
        is="draggable"
        class="row edit-area"
        animation="300"
        v-model="items"
        v-bind="dragOptions"
        @add="onAdd"
        @end="onEnd"
      >
        <v-col
          v-for="item in itemsVM"
          :key="item.creamPuffId"
          cols="12"
          sm="4"
          md="3"
          lg="2"
        >
          <ranking-item-image :item="item">
            <template v-slot:bottom-right>
              <v-btn icon @click.stop="onClickDelete(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </ranking-item-image>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.add-area {
  position: sticky;
  top: 0;
  z-index: 2;
}

.edit-area {
  min-height: 40px;
  background-color: cornsilk;
  z-index: 1;
}
</style>

<script lang="ts">
import "@/domain/Date.extensions";
import { IDraggableEvent, Ranking } from "@/domain";
import { RankingItemImage } from "@/components";
import { Vue, Component, Prop } from "vue-property-decorator";
import Draggable from "vuedraggable";
import { RankingDocumentRepository } from "@/repositories";
import { MyRankingItemViewModel } from "@/viewModels";
import firebase from "firebase/app";
import "firebase/auth";
import { getUserId } from "@/helper";

@Component({
  components: { RankingItemImage, Draggable }
})
export default class MyRanking extends Vue {
  @Prop({ default: new Date().getFullYear().toString() })
  year!: string;

  @Prop()
  creamPuffId?: number;

  readonly rankingDocumentRepository: RankingDocumentRepository =
    RankingDocumentRepository.instance;

  addItem: Ranking[] = [];

  items: Ranking[] = [];

  get addItemVM() {
    return this.addItem.map(x => new MyRankingItemViewModel(x));
  }

  get itemsVM() {
    return this.items.map(x => new MyRankingItemViewModel(x));
  }

  get dragOptionsOfAdding() {
    return {
      animation: 300,
      group: { name: "items" }
    };
  }

  get dragOptions() {
    return {
      animation: 300,
      group: { name: "items", pull: false }
    };
  }

  get hasAddItem() {
    return this.addItem.length > 0;
  }

  async created() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        this.items = await this.rankingDocumentRepository.findMyRanking(
          this.year,
          user.uid
        );

        // 前の画面で選択したアイテムがランキングに存在していない場合はaddItemを設定する。
        if (!this.items.some(x => x.creamPuffId === this.creamPuffId)) {
          await this.$globalStore.creamPuffs.fetch(this.year);
          const creamPuffs = this.$globalStore.creamPuffs.state.items;
          this.addItem = creamPuffs
            .filter(x => x.id === this.creamPuffId)
            .map(x => Ranking.instanceForAdd(x));
        }
      }
    });
  }

  async onAdd(e: IDraggableEvent) {
    this.items = this.items.map((x, index) => {
      if (e.newIndex <= index) {
        x.orderNo = index + 1;
      }
      return x;
    });

    await this.rankingDocumentRepository.updateRanking(
      this.year,
      getUserId()!,
      this.items
    );
  }

  async onEnd(e: IDraggableEvent) {
    if (e.oldIndex === e.newIndex) return;

    const range = [e.oldIndex, e.newIndex];
    const min = Math.min(...range);
    const max = Math.max(...range);
    this.items = this.items.map((x, index) => {
      if (min <= index && index <= max) {
        x.orderNo = index + 1;
      }
      return x;
    });

    await this.rankingDocumentRepository.updateRanking(
      this.year,
      getUserId()!,
      this.items
    );
  }

  async onClickDelete(vm: MyRankingItemViewModel) {
    const res = await this.$dialog.confirm({
      text: "",
      title: "削除しますか？"
    });
    if (res) {
      // レコード削除
      this.items.splice(vm.orderNo! - 1, 1);

      // 全レコードを頭から順位設定しなおす。
      this.items = this.items.map((x, index) =>
        Object.assign(x, { orderNo: index + 1 })
      );

      await this.rankingDocumentRepository.updateRanking(
        this.year,
        getUserId()!,
        this.items
      );
    }
  }
}
</script>
