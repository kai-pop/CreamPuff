<template>
  <div class="home">
    <HomeHero />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HomeHero from "@/components/HomeHero.vue";

@Component({
  components: {
    HomeHero
  }
})
export default class Home extends Vue {}
</script>
