import axios_ from "axios";
import { LocalStorage, Notify, Platform } from "quasar";

// 1. Create the Axios instance
const axios = axios_.create({
  withCredentials: true,
  withXSRFToken: true,
});

const CSRF_URL = `${process.env.SERVER_BASE_URL}/sanctum/csrf-cookie`;
export default async ({ Vue, router }) => {
  // 2. Request Interceptor
  axios.interceptors.request.use(
    async (config) => {
      // Laravel Sanctum CSRF Handshake
      // We only trigger this if the XSRF cookie is missing and it's a "write" request
      const hasXsrfToken = document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("XSRF-TOKEN="));

      if (
        !hasXsrfToken &&
        ["post", "put", "patch", "delete"].includes(config.method.toLowerCase())
      ) {
        try {
          await axios_.get(CSRF_URL, {
            withCredentials: true,
            withXSRFToken: true,
          });
        } catch (e) {}
      }

      // Auth Token Handling (Broadcasting Readiness)
      const data = LocalStorage.getItem("data");
      if (data && data.user_data && data.user_data.token) {
        config.headers.Authorization = `Bearer ${data.user_data.token}`;
      }

      config.headers.Accept = "application/json";
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 3. Response Interceptor
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response } = error;

      if (!response) {
        Notify.create({
          type: "info",
          message: "No Internet Connection",
          position: Platform.is.mobile ? "bottom" : "top-right",
        });
      } else if (response.status === 401 || response.status === 419) {
        // Clear data and redirect on unauthorized or session expired
        LocalStorage.remove("data");

        // Use router.push to go back to login
        if (router.currentRoute.path !== "/login") {
          router.push({ name: "Login" }).catch(() => {});
        }
      }
      return Promise.reject(error);
    }
  );

  // 4. Vue 2 Prototype assignment
  Vue.prototype.$axios = axios;
};

export { axios };
