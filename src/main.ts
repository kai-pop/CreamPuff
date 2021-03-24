import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VuetifyDialog from "vuetify-dialog";
import "vuetify-dialog/dist/vuetify-dialog.css";
import firebase from "firebase/app";
import "firebase/firestore";
import * as fireorm from "fireorm";

const firebaseConfig = {
  apiKey: "AIzaSyDyJTN9T5VSx16SrkcsUghOB1LGqqageKA",
  authDomain: "creampuff-98d9d.firebaseapp.com",
  projectId: "creampuff-98d9d",
  storageBucket: "creampuff-98d9d.appspot.com",
  messagingSenderId: "894631754925",
  appId: "1:894631754925:web:332a6e4d85ffd377019a24",
  measurementId: "G-6PS0GLLBN5"
};
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
fireorm.initialize(firestore);

Vue.config.productionTip = false;

Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
});

import VueCompositionApi from "@vue/composition-api";
import globalStore from "./store/globalStore";

Vue.use(VueCompositionApi);


Vue.prototype.$globalStore = globalStore();


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
