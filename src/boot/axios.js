import axios_ from "axios";
import { LocalStorage, Notify, Platform } from "quasar";

const axios = axios_.create({
  baseURL: process.env.SERVER_BASE_URL, // Ensure this matches api.mountzioncm.com
  withCredentials: true,
  withXSRFToken: true,
});

export default async ({ Vue, router }) => {
  axios.interceptors.request.use(
    async (config) => {
      // 1. Always ensure headers are correct
      config.headers.Accept = "application/json";

      // 2. Auth Token Handling
      const data = LocalStorage.getItem("data");
      if (data?.user_data?.token) {
        config.headers.Authorization = `Bearer ${data.user_data.token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response, config } = error;

      // 3. Handle 419 (CSRF Mismatch) by retrying ONCE
      if (response?.status === 419 && !config._retry) {
        config._retry = true;
        // Re-initialize the CSRF cookie
        await axios.get("/sanctum/csrf-cookie");
        // Re-run the original request
        return axios(config);
      }

      if (!response) {
        Notify.create({
          type: "info",
          message: "No Internet Connection",
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
