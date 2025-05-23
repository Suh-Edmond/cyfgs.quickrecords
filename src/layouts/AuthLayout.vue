<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="header text-white">
      <q-toolbar>
        <q-toolbar-title
          :class="$q.screen.lg ? 'header_title' : 'header_title_small'"
        >
          <a :href="baseUrl" class="app_header">
            <span :href="baseUrl" class="app_logo"
              ><q-avatar :size="$q.screen.lg ? '5rem' : '5rem'">
                <img
                  src="../assets/App_Logo.jpeg"
                  alt="app logo"
                /> </q-avatar></span
            ><span class="app_name app_logo">{{ $t("app.nameOne") }}</span
            ><span class="app_name_2 app_logo">{{ $t("app.nameTwo") }}</span>
          </a>
        </q-toolbar-title>
        <div class="header_note" v-show="$q.screen.lg">
          <div class="q-pa-md header_language">
            <q-btn-dropdown color="black" :label="getLocale" flat class="lang">
              <q-list>
                <q-item clickable v-close-popup @click="onItemClick('en-US')">
                  <q-item-section class="text-center">
                    <q-item-label>{{ $t("app.english") }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="onItemClick('fr')">
                  <q-item-section class="text-center">
                    <q-item-label>{{ $t("app.french") }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <div class="header_note" v-show="!$q.screen.lg">
          <div class="q-pa-md header_language">
            <q-btn-dropdown color="black" :label="getLocale" flat class="lang">
              <q-list>
                <q-item clickable v-close-popup @click="onItemClick('en-US')">
                  <q-item-section class="text-center lang">
                    <q-item-label>{{ $t("app.english") }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="onItemClick('fr')">
                  <q-item-section class="text-center lang">
                    <q-item-label>{{ $t("app.french") }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="content">
      <router-view />
    </q-page-container>
    <q-footer class="text-black footer flex flex-center">
      <q-toolbar>
        <q-toolbar-title>
          <p class="footer_text">
            <span class="material-icons copy_right"> copyright </span>
            {{ year }}
            <span class="appName"
              >{{ $t("app.nameOne") }}{{ $t("app.nameTwo") }}</span
            >.{{ $t("app.allRightsReserved") }}
          </p>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  mounted() {
    return this.$store.getters.getOrganisation;
  },
  data() {
    return {
      year: new Date().getFullYear(),
      language: this.$i18n.locale,
      type: "SIGN_IN",
      baseUrl: process.env.CLIENT_SERVER,
    };
  },
  computed: {
    getOrganisation() {
      return this.$store.getters.getOrganisation;
    },

    getLocale() {
      return this.$i18n.locale === "en-US"
        ? this.$t("app.english")
        : this.$t("app.french");
    },
  },
  methods: {
    onItemClick(lang) {
      if (lang === "fr") {
        this.$i18n.locale = "fr";
        this.showAppTranslateLoading();
      }
      if (lang === "en-US") {
        this.$i18n.locale = "en-US";
        this.showAppTranslateLoading();
      }
    },
    showAppTranslateLoading() {
      this.$q.loading.show({
        message: this.$t("app.appTranslationLabel"),
        backgroundColor: "primary",
        sanitize: true,
      });

      // hiding in 3s
      this.timer = setTimeout(() => {
        this.$q.loading.hide();
        this.timer = void 0;
      }, 5000);
    },

    checkAccountExist(type) {
      return (this.type = type);
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.footer {
  background-color: $white1;
  height: 2rem;
}

.content {
  background-color: $grey1;
  height: 100vh;
}

.app_name {
  color: $primary;
}

.app_name_2 {
  color: $orange;
}

.header {
  background-color: $white1;
}

.header_title {
  text-transform: capitalize;
  color: $orange;
  font-weight: bold;
  font-size: 1.2rem;
  font-family: "Roboto";
  display: block;
}

.header_title_small {
  text-transform: capitalize;
  color: $orange;
  font-weight: bold;
  padding: 0.6rem;
  font-size: large;
  font-family: "Roboto";
  display: block;
}

.app_header {
  text-decoration: none;
}

.header_note {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.sign_link {
  text-decoration: none;
  color: $primary;
}

.header_language {
  margin-right: 0.5rem;
}

.lang {
  font-size: 0.6rem;
}

.appName {
  font-family: "Roboto";
  font-style: normal;
  text-transform: capitalize;
  color: $dark;
  font-weight: 700;
  font-size: 0.7rem;
}

.footer_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 0.6rem;
  align-items: center;
  text-align: center;
  padding-bottom: 1rem;
}

.copy_right {
  font-size: large;
}

.app_logo {
  cursor: pointer;
}
</style>
