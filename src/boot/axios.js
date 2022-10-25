import Vue from "vue";
import axios from "axios";

Vue.prototype.$axios = axios;

const data = JSON.parse(localStorage.getItem("data"));
let token = "";
if (data !== null) {
  token = data.token;
}

axios.interceptors.request.use(function (config) {
  config.headers.Accept = "application/json";
  config.headers.ContentType = "application/json";
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});
