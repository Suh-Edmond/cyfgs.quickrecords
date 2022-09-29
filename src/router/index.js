import Vue from "vue";
import VueRouter from "vue-router";
import { Notify } from "quasar";

import routes from "./routes";

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (
  {
    /* store ssrContext*/
  }
) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });

  Router.beforeEach((to, from, next) => {
    const data = JSON.parse(localStorage.getItem("data"));
    let roles = [];

    if (from.meta.middleware === "guest" || to.meta.middleware === "guest") {
      next();
    }
    if (to.meta.middleware === "auth" && data === null) {
      next({ name: "Login" });
      Notify.create({
        type: "info",
        position: "top-right",
        message: `Login is required to view this page`,
        progress: true,
      });
    }

    if (to.meta.middleware === "auth" && data !== null) {
      data.data.roles.forEach((role) => {
        roles.push(role.name);
      });
      if (roles.includes(to.meta.roles)) {
        next();
      } else {
        Notify.create({
          type: "info",
          position: "top-right",
          message: `Access denied to view this page`,
          progress: true,
        });
      }
    }
  });
  return Router;
}
