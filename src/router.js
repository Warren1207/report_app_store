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
      component: Layout,
      children: [
        {
          path: "uploadStation",
          title: "工参上传",
          name: "uploadStation",
          component: () => import("@/views/UploadStation")
        },
        {
          path: "uploadReport",
          title: "报告模板上传",
          name: "uploadReport",
          component: () => import("@/views/UploadReport")
        },
        {
          path: "reportList",
          title: "报告列表",
          name: "reportList",
          component: () => import("@/views/ReportList")
        },
        {
          path: "taskPlan",
          title: "计划任务",
          name: "taskPlan",
          component: () => import("@/views/TaskPlan")
        },
        {
          path: "setReport",
          title: "设定报告",
          name: "setReport",
          component: () => import("@/views/SetReport")
        },
        {
          path: "serverList",
          title: "SKY服务器列表",
          name: "serverList",
          component: () => import("@/views/ServerList")
        }
      ]
    }
  ]
});
