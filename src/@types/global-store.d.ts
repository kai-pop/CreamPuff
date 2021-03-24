import Vue from 'vue';
import { GlobalStore } from '../store/globalStore';

declare module 'vue/types/vue' {
  interface Vue {
    readonly $globalStore: Readonly<GlobalStore>;
  }
}