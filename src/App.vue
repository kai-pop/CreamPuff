<template>
  <v-app>
    <v-app-bar color="primary" dark app clipped-left>
      <router-link to="/">
        <v-toolbar-title>CreamPuff.log</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn to="/weeklyMenu" text
          ><v-icon>mdi-calendar-month</v-icon>カレンダー</v-btn
        >
        <v-btn to="/MyRanking" text
          ><v-icon>mdi-format-list-numbered</v-icon>マイランク</v-btn
        >
        <v-btn to="/EveryoneRanking" text
          ><v-icon>mdi-format-list-numbered</v-icon>個人別ランク</v-btn
        >
        <v-btn to="/Chart" text
          ><v-icon>mdi-chart-bar</v-icon>総合チャート</v-btn
        >
        <!-- <v-btn to="/Me" text><v-icon>mdi-account</v-icon>マイページ</v-btn> -->
        <v-btn @click="signOut" text v-if="signedIn"
          ><v-icon>mdi-logout</v-icon>サインアウト</v-btn
        >
        <v-btn to="/Signin" text v-if="!signedIn"
          ><v-icon>mdi-login</v-icon>サインイン</v-btn
        >
        <!-- <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text>Support<v-icon>mdi-menu-down</v-icon></v-btn>
          </template>
          <v-list>
            <v-list-item v-for="support in supports" :key="support.name">
              <v-list-item-icon>
                <v-icon>{{ support.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ support.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu> -->
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <router-view :key="$route.fullPath" />
    </v-main>

    <v-footer color="primary" dark app>
      ガ〇ー専科
    </v-footer>
  </v-app>
</template>


<style scoped>
.v-toolbar__title {
  color: white;
  text-decoration: none;
}
</style>
<script lang="ts">
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/auth";
import { getRepository } from "fireorm";
import { User } from "./domain";

export default Vue.extend({
  name: "App",

  data: () => ({
    signedIn: false
  }),
  async created() {
    firebase.auth().onAuthStateChanged(user => {
      this.signedIn = !!user;
      if (user) {
        const repository = getRepository(User);
        repository.runTransaction(async tran => {
          const storeUser = await tran.findById(user.uid);
          if (storeUser) {
            if (!storeUser.equals(user)) {
              storeUser.map(user);
              tran.update(storeUser);
            }
          } else {
            const addingUser = Object.assign(
              {},
              new User({
                id: user.uid,
                name: user.displayName,
                photoUrl: user.photoURL
              })
            );
            await tran.create(addingUser);
          }
        });
      }
    });
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => this.$router.push("/"))
        .catch(console.log);
    }
  }
});
</script>
