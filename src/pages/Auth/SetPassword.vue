<template>
  <q-page class="page">
    <div
      class="row q-px-sm"
      :class="$q.screen.lg ? 'q-pt-lg flex flex-center' : 'q-pt-sm'"
    >
      <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12">
        <q-card :class="$q.screen.lg ? 'q-mt-lg' : 'q-mt-md q-mb-xl'">
          <q-card-section>
            <div class="back_arrow_button" v-show="is_exist_user">
              <q-btn
                class="material-icons back_arrow"
                icon="arrow_back"
                @click="goBack"
                flat
              />
            </div>
            <div class="text_h6 text-center q-pt-sm q-pb-sm">
              {{ $t("app.signIn") }}
            </div>
            <div class="text-subtitle2 text-center q-pb-xs">
              {{ $t("app.loginCaption") }}
            </div>

            <!-- form to check invited member exist -->
            <q-form
              @submit="onCheckUserExist"
              class="q-gutter-md q-mt-md q-px-xs"
              v-show="!is_exist_user"
            >
              <div>
                <label for="credential" class="form_field"
                  >{{ $t("app.telephoneLabel") }}
                  <span class="text-red">*</span></label
                >
                <vue-tel-input
                  v-model="check_user.credential"
                  defaultCountry="cm"
                  mode="international"
                  class="q-pa-xs"
                ></vue-tel-input>
              </div>
              <div>
                <q-btn
                  class="form_button q-mt-md q-pa-xs"
                  :label="label_continue"
                  :loading="loading"
                  :disabled="validatePhone"
                  :color="color"
                  :no_caps="no_caps"
                  type="submit"
                >
                  <q-icon
                    name="arrow_forward"
                    size="xs"
                    class="q-pl-lg"
                  ></q-icon>
                </q-btn>
                <div class="row q-mb-xl justify-end">
                  <span class="account_text" v-if="!$q.screen.lg"
                    >{{ $t("app.noAccountMsg") }}
                    <router-link to="/auth/register" class="sign_link">
                      <span>{{ $t("app.signUpLabel") }}</span>
                    </router-link>
                  </span>
                </div>
              </div>
            </q-form>

            <!-- form to set password for invited members -->
            <q-form
              @submit="onSetPassword"
              class="q-gutter-md q-mt-md q-px-md"
              v-show="is_exist_user"
            >
              <div>
                <label for="credential" class="form_field"
                  >{{ $t("app.telephoneLabel") }}
                  <span class="text-red">*</span></label
                >
                <vue-tel-input
                  v-model="user.credential"
                  defaultCountry="cm"
                  mode="international"
                  class="q-pa-xs"
                ></vue-tel-input>
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
              <div>
                <label for="password_confirmation" class="form_field"
                  >{{ $t("app.confirmPasswordLabel")
                  }}<span class="text-red">*</span></label
                >
                <q-input
                  v-model="user.password_confirmation"
                  :type="is_pwd_confirm ? 'password' : 'text'"
                  outlined
                  dense
                  bottom-slots
                >
                  <template v-slot:append>
                    <q-icon
                      :name="is_pwd_confirm ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="is_pwd_confirm = !is_pwd_confirm"
                    />
                  </template>
                  <template v-slot:hint v-if="validatePasswordMatch">
                    <span class="text-red">{{
                      $t("app.passwordNotMatchMsg")
                    }}</span>
                  </template>
                </q-input>
              </div>
              <div>
                <q-btn
                  class="form_button q-pa-xs"
                  :label="label_sigin"
                  :loading="loading"
                  :color="color"
                  :disabled="validatePasswordMatch"
                  :no_caps="no_caps"
                  type="submit"
                >
                  <q-icon
                    name="arrow_forward"
                    size="xs"
                    class="q-pl-lg"
                  ></q-icon>
                </q-btn>
                <div
                  class="row q-mb-xl"
                  :class="!$q.screen.lg ? 'justify-evenly' : 'justify-end'"
                >
                  <span class="account_text" v-if="!$q.screen.lg"
                    >{{ $t("app.noAccountMsg") }}
                    <router-link to="/auth/register" class="sign_link">
                      <span>{{ $t("app.signUpLabel") }}</span>
                    </router-link>
                  </span>
                  <router-link
                    to="/auth/password-reset/get-token"
                    class="sign_link"
                  >
                    <span class="forgot_password">{{
                      $t("app.forgotPasswordMsg")
                    }}</span>
                  </router-link>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, Notify, Platform, SessionStorage } from "quasar";
import organisationMixin from "src/mixins/organisationMixin.vue";
import { VueTelInput } from "vue-tel-input";
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import ContributionsMixinVue from "src/mixins/ContributionsMixin.vue";
import UserSavingMixinVue from "src/mixins/UserSavingMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
export default {
  mixins: [
    organisationMixin,
    CurrentYearMixinVue,
    memberMixinVue,
    ContributionsMixinVue,
    UserSavingMixinVue,
    ExpenditureItemDetailMixinVue,
  ],
  mounted() {
    LocalStorage.clear();
  },
  data() {
    return {
      user: {
        password: "",
        password_confirmation: "",
        credential:
          LocalStorage.getItem("credential") !== undefined
            ? LocalStorage.getItem("credentail")
            : "",
      },
      check_user: {
        credential: "",
      },
      isPwd: true,
      is_pwd_confirm: true,
      label_continue: this.$t("app.continue"),
      label_sigin: this.$t("app.signIn"),
      loading: false,
      is_exist_user: false,
      color: "primary",
      no_caps: true,
    };
  },
  computed: {
    validatePhone() {
      return this.check_user.credential === "";
    },
    validatePasswordMatch() {
      return this.user.password !== this.user.password_confirmation;
    },
    validateLogin() {
      return this.user.credential === "" || this.user.password === "";
    },
  },
  methods: {
    goBack() {
      this.is_exist_user = false;
      this.has_logged_in = false;
      LocalStorage.remove("is_exist_user");
      LocalStorage.set("is_exist_user", false);
    },

    onCheckUserExist() {

      let payload = {
        url: "/api/public/auth/check-user",
        data: {
          credential: this.check_user.credential.replace(/\s+/g, ""),
        },
        msg: this.$t("app.inviteUserSuccessMsg"),
        color: "default",
        show_feedback: true,
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: this.$t("app.inviteMemberFailMsg"),
        to_be_store_data: {
          required: true,
          has_value: true,
          data: [
            { key: "is_exist_user", value: true },
            { key: "credential", value: this.check_user.credential },
          ],
        },
      };
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then((res) => {
          if (res.status == 200) {
            this.is_exist_user = true;
            this.user.credential = this.check_user.credential;
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.loading = false;
        });
    },
    onSetPassword() {
      let payload = {
        url: "/api/public/auth/set-password",
        data: {
          credential: this.user.credential.replace(/\s+/g, ""),
          password: this.user.password,
          password_confirmation: this.user.password_confirmation,
          role: this.$router.currentRoute.query.role
        },
        msg: this.$t("app.loginSuccess"),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: "",
        to_be_store_data: {
          required: true,
          has_value: false,
          data: [{ key: "data", value: null }],
        },
      };
      let current_session_id = "";
      let organisation_id = "";
      this.loading = true;

      this.$store
        .dispatch("postRequest", payload)
        .then((response) => {
          if (response.status == 200) {
            current_session_id = response.data.data.current_session.id;
            organisation_id = response.data.data.user_data.organisation_id;
            SessionStorage.set("to_tab", "Dashboard");
            this.getOrganisationInfo();
            this.$store.dispatch(
              "setCurrentYear",
              response.data.data.current_session
            );
            this.$router.push({
              name: "dashboard",
            });
          }
          if (response.status == 404 || response.status == 403) {
            Notify.create({
              type: "info",
              message: this.$t("app.invalidAccount"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
          return response;
        })
        .then(async (response) => {
          if (response.status == 200) {
            this.getUserByRegistrationStatus(organisation_id);
          }
          return response;
        })
        .then(async (response) => {
          if (response.status == 200) {
            this.getTotalContributionByYear(current_session_id);
          }
          return response;
        })
        .then(async (response) => {
          if (response.status == 200) {
            this.getUserByRegistration(organisation_id);
          }
          return response;
        })
        .then(async (response) => {
          if (response.status == 200) {
            this.getOrganisationMemberSavings(organisation_id, 1, 10);
          }
          return response;
        })
        .then(async (response) => {
          if (response.status == 200) {
            this.getOrganisationMembers(organisation_id);
          }
          return response;
        })
        .then(async (response) => {
          if (response.status == 200) {
            this.getTotalYearlyExpenditures(current_session_id);
          }
          return response;
        })
        .then(async (response) => {
          if (response.status == 200) {
            this.filterOrganisationMembers(
              organisation_id,
              false,
              1,
              10,
              "name",
              current_session_id,
              "",
              "",
              ""
            );
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  components: {
    VueTelInput,
  },
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

.back_arrow_button {
  margin: 0;
  padding: 0;
}

.back_arrow {
  font-size: 0.7rem;
  margin: 0;
  padding: 0;
}

.text_h6 {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 24px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
}

.text-subtitle2 {
  color: $grey2;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.01em;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.form_button {
  width: 100%;
  // margin-top: 0.2rem;
  margin-bottom: 0.1rem;
}

.forgot_password {
  display: block;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 24px;
  align-items: center;
  letter-spacing: 0.005em;
  color: $primary;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.sign_link {
  text-decoration: none;
  color: $primary;
}

.account_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  color: $dark;
  text-transform: uppercase;
  line-height: 37px;
  float: right;
}
</style>
