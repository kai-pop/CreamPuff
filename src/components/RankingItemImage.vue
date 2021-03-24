<template>
  <v-card hover :ripple="false" @click.stop="onClick">
    <v-img :src="item.imageUrl" class="thumbnail flex-wrap">
      <div
        class="d-flex flex-column justify-space-between"
        :class="{'this-week': item.thisWeek}"
        style="height:100%;"
      >
        <!-- 上段 -->
        <div class="d-flex justify-space-between">

          <div class="action" style="flex-basis:15%">
            <slot name="top-left" />
          </div>

          <div class="action" style="flex-basis:70%">
            <v-card-subtitle
              class="headline justify-center text-center pa-0 brown--text text-lg-subtitle-2"
              >{{ item.caption }}</v-card-subtitle
            >
          </div>

          <div class="action" style="flex-basis:15%">
            <slot name="top-right" />
          </div>

        </div>

        <!-- 下段 -->
        <div class="d-flex justify-space-between">

          <div class="action">
            <slot name="bottom-left"/>
          </div>

          <div class="action">
            <slot name="bottom-right"/>
          </div>

        </div>
      </div>
    </v-img>
  </v-card>
</template>

<style lang="scss" scoped>
.thumbnail {
  max-width: 100%;
  max-height: 100%;
}

.this-week {
  border: 3px solid red;
}

.highlight-right {
  border-right: 3px solid red;
}

.action {
  height: 100%;
  /*flex: 1;*/
}
</style>

<script lang="ts">
import { Vue, Component, Emit, Prop } from "vue-property-decorator";
import { ICreamPuffImage } from "@/viewModels";
@Component({
  components: {}
})
export default class RankingItemImage extends Vue {
  @Prop({ type: Object as () => ICreamPuffImage, required: true })
  item!: ICreamPuffImage;

  @Emit()
  onClick() {
    return this.item;
  }
}
</script>