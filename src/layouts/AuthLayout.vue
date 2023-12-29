<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="header text-white">
      <q-toolbar>
        <q-toolbar-title
          :class="$q.screen.lg ? 'header_title' : 'header_title_small'"
        >
          <span class="app_name">{{ $t("app.nameOne") }}</span
          >{{ $t("app.nameTwo") }}
        </q-toolbar-title>
        <div class="header_note" v-show="$q.screen.lg">
          <div
            class="flex"
            v-if="
              this.$router.currentRoute.name == 'Login' &&
              getOrganisation == null
            "
          >
            <div class="account_text">{{ $t("app.noAccountMsg") }}</div>
            <div class="account_text__signup">
              <router-link to="/auth/register" class="sign_link"
                ><span @click="checkAccountExist('SIGN_UP')">{{
                  $t("app.signUpLabel")
                }}</span></router-link
              >
            </div>
          </div>
          <div
            class="flex"
            v-if="
              this.$router.currentRoute.name == 'Register' &&
              getOrganisation == null
            "
          >
            <div class="account_text">{{ $t("app.haveAccountMsg") }}</div>
            <div class="account_text__signup">
              <router-link to="/auth/login" class="sign_link"
                ><span @click="checkAccountExist('SIGN_IN')">{{
                  $t("app.signInLabel")
                }}</span></router-link
              >
            </div>
          </div>
          <div class="q-pa-md header_language">
            <q-btn-dropdown color="black" :label="getLocale" flat>
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
            <q-btn-dropdown color="black" :label="getLocale" flat>
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
      </q-toolbar>
    </q-header>
    <q-page-container class="content">
      <router-view />
    </q-page-container>
    <q-footer class="text-black footer flex flex-center">
      <q-toolbar>
        <q-toolbar-title>
          <p class="footer_text">
            <span class="material-icons copy_right"> copyright </span
            >{{ $t("app.copyright") }} {{ year }}
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
      if (lang == "fr") {
        this.$i18n.locale = "fr";
        this.showAppTranslateLoading();
      }
      if (lang == "en-US") {
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

.header {
  background-color: $white1;
}

.header_title {
  text-transform: capitalize;
  color: $orange;
  font-weight: bold;
  padding: 0.6rem;
  font-size: xx-large;
  font-family: "Roboto";
  letter-spacing: 0.009em;
  display: block;
}

.header_title_small {
  text-transform: capitalize;
  color: $orange;
  font-weight: bold;
  padding: 0.6rem;
  font-size: large;
  font-family: "Roboto";
  letter-spacing: 0.009em;
  display: block;
}

.logo {
  width: 50px;
  height: 50px;
}

.header_logo {
  background-color: $dark;
  margin-right: 0.5rem;
}

.header_note {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.account_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: bold;
  font-size: 13px;
  color: $dark;
  margin-right: 0.5rem;
  text-transform: uppercase;
  line-height: 37px;
}

.sign_link {
  text-decoration: none;
  color: $primary;
}

.account_text__signup {
  font-family: "Roboto";
  font-style: normal;
  font-weight: bold;
  font-size: 13px;
  align-items: center;
  color: $primary;
  cursor: pointer;
  line-height: 37px;
  margin-right: 7rem;
}

.header_language {
  margin-right: 0.5rem;
}

.appName {
  font-family: "Roboto";
  font-style: normal;
  text-transform: capitalize;
  color: $dark;
  font-weight: 700;
  font-size: medium;
}

.footer_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
  padding-bottom: 1rem;
}

.copy_right {
  font-size: large;
}
</style>
