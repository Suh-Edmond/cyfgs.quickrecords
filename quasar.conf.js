/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v1.quasar.dev/quasar-cli/quasar-conf-js

const ESLintPlugin = require("eslint-webpack-plugin");
const dotenv = require("dotenv");
const path = require("path");

const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

module.exports = function (ctx) {
  return {
    bin: "C:/Program Files/Android/Android Studio/bin/studio64.sh",
    // https://v1.quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://v1.quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v1.quasar.dev/quasar-cli/boot-files
    boot: ["i18n", "axios", "app-init"],

    // https://v1.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: ["app.scss"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      "roboto-font", // optional, you are not bound to it
      "material-icons", // optional, you are not bound to it
      "material-icons-outlined",
    ],

    // Full list of options: https://v1.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build

    build: {
      vueRouterMode: "history", // available values: 'hash', 'history'
      env: {
        SERVER_BASE_URL: ctx.mode.dev
          ? "http://localhost:8000"
          : "https://api.mountzioncm.com",
        CLIENT_SERVER: "https://app.quickrecords.xyz/auth/login",
        CLIENT_ONBOARDING_URL:
          "https://app.quickrecords.xyz/auth/client-onboarding",
        REDIRECT_URL: "https://app.quickrecords.xyz/auth/invite-member",
        APP_NAME: "Quick_Records",
        FILE_CATEGORY: "LOGOS",
        BASE_FOLDER: "LOGOS",
        PROFILE_PICTURES: "PROFILE_PICTURES",
        appLinkedinUrl: "https://www.linkedin.com/company/quickrecords",
        PAYMENT_CHARGES: 2,
        VITE_REVERB_APP_KEY: "4duflprn6epgas47upi1",
        VITE_REVERB_HOST: "localhost",
        VITE_REVERB_PORT: "8001",
        VITE_REVERB_SCHEME: "http",
        VITE_REVERB_APP_SECRET: "ayvjxr9c1iiwvuxhramu",
      },
      distDir: ctx.mode.spa ? "public" : null,
      // env: envparser(),
      // transpile: false,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: false, // https://v1.quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://v1.quasar.dev/quasar-cli/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      // chainWebpack(chain) {
      //   chain
      //     .plugin("eslint-webpack-plugin")
      //     .use(ESLintPlugin, [
      //       { extensions: ["js", "vue"] },
      //       { loader: "@kazupon/vue-i18n-loader" },
      //       { loader: "yaml-loader" },
      //     ]);
      // },
      extendWebpack(cfg) {},
    },

    // Full list of options: https://v1.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      host: "localhost",
      port: 7000,
      open: true, // opens browser window automatically
    },

    // https://v1.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: "material-icons", // Quasar icon set
      lang: "en-us", // Quasar language pack
      config: {},

      // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: "auto",

      // For special cases outside of where "auto" importStrategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [
        "Notify",
        "LocalStorage",
        "SessionStorage",
        "Loading",
        "Dialog",
      ],
      config: {
        notify: {
          /* look at QUASARCONFOPTIONS from the API card (bottom of page) */
        },
        loading: {},
      },
    },

    // animations: 'all', // --- includes all animations
    // https://v1.quasar.dev/options/animations
    animations: [],

    // https://v1.quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,
    },

    // https://v1.quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: "GenerateSW", // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: `QuickRecords`,
        short_name: `QuickRecords`,
        description: `A web,mobile and desktop application for assisting the management of financial transactions in a group or organisation`,
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#027be3",
        icons: [
          {
            src: "icons/favicon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },

    // Full list of options: https://v1.quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v1.quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v1.quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: "packager", // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: "financial-assistant-web",
      },

      // More info: https://v1.quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,

      extendWebpack(/* cfg */) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },
    },
  };
};
