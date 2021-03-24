import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import firebase from "firebase/app";
import "firebase/auth";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    meta: { isPublic: true },
    component: Home
  },
  {
    path: "/Signin",
    name: "Signin",
    meta: { isPublic: true },

    component: () =>
      import(/* webpackChunkName: "signin" */ "../views/Signin.vue")
  },
  {
    path: "/WeeklyMenu",
    name: "WeeklyMenu",
    props: (route) => (route.query),
    component: () =>
      import(/* webpackChunkName: "weekly-menu" */ "../views/WeeklyMenu.vue")
  },
  {
    path: "/MyRanking",
    name: "MyRanking",
    props: (route) => ({
      year: route.query.year,
      creamPuffId: Number(route.query.creamPuffId)
    }),
    component: () =>
      import(/* webpackChunkName: "my-ranking" */ "../views/MyRanking.vue")
  },
  {
    path: "/EveryoneRanking",
    name: "EveryoneRanking",
    props: (route) => ({
      year: route.query.year
    }),
    component: () =>
      import(/* webpackChunkName: "everyone-ranking" */ "../views/EveryoneRanking.vue")
  },
  {
    path: "/Chart",
    name: "Chart",
    props: (route) => ({
      year: route.query.year
    }),
    component: () =>
      import(/* webpackChunkName: "everyone-ranking" */ "../views/Chart.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.isPublic);
  if (isPublic) {
    next();
    return;
  }

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      next();
    } else {
      next({
        path: "/signin",
        query: { redirect: to.fullPath }
      });
    }
  });
});

export default router;
