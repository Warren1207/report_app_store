import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Token: localStorage.getItem("report_app_token")
  },
  mutations: {
    setToken(state, token) {
      state.Token = token;
    }
  },
  getters: {
    Token: state => state.Token
  },
  actions: {}
});
