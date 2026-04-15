import axios_ from "axios";
import { LocalStorage, Notify, Platform } from "quasar";

const axios = axios_.create({
  baseURL: process.env.SERVER_BASE_URL, // Ensure this matches api.mountzioncm.com
  withCredentials: false,
});

export default async ({ Vue, router }) => {
  axios.interceptors.request.use(
    (config) => {
      // 1. Always ensure headers are correct
      config.headers.Accept = "application/json";

      // 2. Auth Token Handling
      const data = LocalStorage.getItem("data");
      if (data && data.user_data && data.user_data.token) {
        config.headers.Authorization = `Bearer ${data.user_data.token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const { response } = error;

      if (!response) {
        Notify.create({
          type: "info",
          message: "No Internet Connection",
          position: Platform.is.mobile ? "bottom" : "top",
        });
      } else if (response.status === 401) {
        LocalStorage.remove("data");
        if (router.currentRoute.path !== "/login") {
          router.push({ name: "Login" }).catch(() => {});
        }
      }
      return Promise.reject(error);
    }
  );

  Vue.prototype.$axios = axios;
};

export { axios };
