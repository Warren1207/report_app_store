import Vue from "vue";
import Router from "vue-router";
import Layout from "./views/Layout.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "*",
      redirect: "/"
    },
    {
      path: "/login",
      name: "login",
      meta: {
        hideInMenu: true
      },
      component: () => import("@/views/Login.vue")
    },
    {
      path: "/",
      name: "Layout",
      component: Layout
    }
  ]
});
