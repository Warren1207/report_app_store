import axios from "axios";
import store from "@/store";
import router from "@/router";
import { Message } from "element-ui";
import config from "@/libs/config";

axios.defaults.timeout = 5000;
axios.defaults.baseURL = config.baseUrl;

// 路由请求拦截
// http request 拦截器
axios.interceptors.request.use(
  config => {
    config.headers["Token"] = store.getters.Token;
    return config;
  },
  error => {
    return Promise.reject(error.response);
  }
);

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      router.push({
        name: "login"
      });
    }
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);
/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      response => {
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}
