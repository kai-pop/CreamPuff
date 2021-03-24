<template>
  <v-container>
    <div id="firebaseui-auth-container"></div>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import firebaseui from "firebaseui-ja";
import "firebaseui-ja/dist/firebaseui.css";

export default {
  name: "Signin",
  data() {
    return {};
  },
  mounted() {
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: authResult => {
          this.$router.push(this.$route.query.redirect ?? "/");
          return false;
        }
      },
      signInFlow: "redirect",
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    };
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>
