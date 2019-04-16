import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
/** Element UI 引入 **/
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { post, fetch } from "./libs/http";
/** iconfont **/
import "@/assets/iconfont/iconfont.css";
import "babel-polyfill";
// import "./mock"; // 模拟数据

Vue.use(ElementUI, { size: "", zIndex: 3000 });
Vue.config.productionTip = false;

//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
