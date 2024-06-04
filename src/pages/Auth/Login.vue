<template>
  <q-page class="page">
    <div
      class="row q-px-sm"
      :class="$q.screen.lg ? 'q-pt-lg flex flex-center' : 'q-pt-sm'"
    >
      <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12">
        <q-card :class="$q.screen.lg ? 'q-mt-lg' : 'q-mt-lg login-card'">
          <q-card-section>
            <div class="text_h6 text-center q-pt-sm q-pb-sm">
              {{ $t("app.signIn") }}
            </div>
            <div class="text-subtitle2 text-center q-pb-xs">
              {{ $t("app.loginCaption") }}
            </div>
            <q-form
              @submit="onSubmit"
              class="q-gutter-md q-mt-lg"
              :class="$q.screen.lg ? 'q-px-md' : ''"
            >
              <div>
                <label for="credential" class="form_field"
                  >{{ $t("app.emailLabel") }}
                  <span class="text-red">*</span></label
                >
                <q-input
                  v-model="user.credential"
                  outlined
                  dense
                  type="email"
                />
              </div>
              <div>
                <label for="password" class="form_field"
                  >{{ $t("app.passwordLabel") }}
                  <span class="text-red">*</span></label
                >
                <q-input
                  v-model="user.password"
                  :type="isPwd ? 'password' : 'text'"
                  outlined
                  dense
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
              <div class="q-mt-lg q-mb-lg">
                <q-btn
                  class="form_button"
                  :label="label_sigin"
                  :loading="loading"
                  :disabled="validateLogin"
                  :color="color"
                  no-caps
                  type="submit"
                >
                  <q-icon
                    name="arrow_forward"
                    size="xs"
                    class="q-pl-lg"
                  ></q-icon>
                </q-btn>
                <router-link
                  to="/auth/password-reset/get-token"
                  class="sign_link"
                  v-if="!$q.platform.is.mobile"
                >
                  <span class="forgot_password text-right">{{
                    $t("app.forgotPasswordMsg")
                  }}</span>
                </router-link>
              </div>

              <div
                class="row justify-center q-mb-lg"
                v-if="$q.platform.is.mobile"
              >
                <router-link
                  to="/auth/password-reset/get-token"
                  class="sign_link"
                >
                  <span class="forgot_password text-right">{{
                    $t("app.forgotPasswordMsg")
                  }}</span>
                </router-link>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import organisationMixin from "src/mixins/organisationMixin.vue";
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import UserSavingMixinVue from "src/mixins/UserSavingMixin.vue";
import ContributionsMixinVue from "src/mixins/ContributionsMixin.vue";
import { Notify, Platform, SessionStorage } from "quasar";

export default {
  name: "PageIndex",
  mixins: [
    organisationMixin,
    CurrentYearMixinVue,
    memberMixinVue,
    UserSavingMixinVue,
    ContributionsMixinVue,
  ],
  data() {
    return {
      user: {
        password: null,
        password_confirmation: null,
        credential: null,
      },
      isPwd: true,
      label_sigin: this.$t("app.loginBtnLabel"),
      loading: false,
      color: "primary",
      no_caps: true,
    };
  },
  computed: {
    validatePasswordMatch() {
      return this.user.password === this.user.password_confirmation
        ? false
        : true;
    },
    validateLogin() {
      return this.user.credential === null || this.user.password === null
        ? true
        : false;
    },
  },
  methods: {
    onSubmit() {
      this.loading = true;
      let payload = {
        url: "/api/public/auth/login",
        data: {
          email: this.user.credential,
          password: this.user.password,
        },
        msg: "Login Successful",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: "Invalid Credentials! Please try again",
        to_be_store_data: {
          required: true,
          has_value: false,
          data: [{ key: "data", value: null }],
        },
      };
      this.$store
        .dispatch("postRequest", payload)
        .then((response) => {
          if (response.status == 200) {
            this.$store.dispatch(
              "setCurrentYear",
              response.data.data.current_session
            );
            let payload = {
              status: "none",
              url: "/api/protected/organisation-info",
              has_path_val: true,
              show_feedback: false,
              msg: "none",
              color: "default",
              error_msg: "default",
              to_on_ok: "none",
              commit: "SET_ORGANISATION",
              has_commit: true,
              to_be_store_data: {
                required: true,
                has_value: false,
                data: null,
              },
            };
            this.$store.dispatch("getRequest", payload).then((res) => {
              if (res.success) {
                this.$router.push({
                  name: "dashboard",
                });
                SessionStorage.set("to_tab", "Dashboard");
              } else {
                this.$router.push({
                  name: "create_organisation",
                });
                Notify.create({
                  type: "info",
                  message: this.$t("app.createOrganisationCaption"),
                  position: Platform.is.mobile ? "bottom" : "top-right",
                });
              }
              return res;
            });
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.loading = false;
        });
    },

    getTotalYearlyExpenditures(id) {
      let payload = {
        url: `/api/protected/expenditures_total?session_id=${id}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch payment categories",
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        has_path_val: false,
        commit: "SET_TOTAL_YEARLY_EXPENDITURE",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },
  },
  components: {},
};
</script>

<style src="vue-tel-input/dist/vue-tel-input.css"></style>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.page {
  background-color: $grey1;
}

.text_h6 {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 0.9em;
  align-items: center;
  text-align: center;
}

.text-subtitle2 {
  color: $grey2;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 0.8rem;
  align-items: center;
  text-align: center;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.7rem;
  align-items: center;
  color: $grey5;
}

.form_button {
  width: 100%;
  margin-bottom: 0.1rem;
}

.forgot_password {
  display: block;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 0.7rem;
  align-items: center;
  color: $primary;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.sign_link {
  text-decoration: none;
  color: $primary;
  font-weight: 600;
}

.login-card {
  height: 500px;
}
</style>
