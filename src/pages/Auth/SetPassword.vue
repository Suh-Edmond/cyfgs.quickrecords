<template>
  <q-page class="page">
    <div
      class="row q-px-sm"
      :class="$q.screen.lg ? 'q-pt-lg flex flex-center' : 'q-pt-sm'"
    >
      <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12">
        <q-card :class="$q.screen.lg ? 'q-mt-lg q-pb-xl' : 'q-mt-md q-pb-xl'">
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
              class="q-gutter-md q-mt-md"
              v-show="!is_exist_user"
            >
              <div>
                <label for="credential" class="form_field"
                  >{{ $t("app.emailLabel") }}
                  <span class="text-red">*</span></label
                >
                <q-input
                  v-model="check_user.credential"
                  outlined
                  dense
                  type="email"
                  :placeholder="$t('app.provideEmailMsg')"
                />
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
              </div>
            </q-form>

            <!-- form to set password for invited members -->
            <q-form
              @submit="onSetPassword"
              class="q-gutter-md q-mt-md"
              :class="$q.screen.lg ? 'q-px-md' : ''"
              v-show="is_exist_user"
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
                  disable
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
              <div>
                <label for="password_confirmation" class="form_field"
                  >{{ $t("app.confirmPasswordLabel") }}
                  <span class="text-red">*</span></label
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
          credential: this.check_user.credential,
        },
        msg: this.$t("app.inviteUserSuccessMsg"),
        color: "default",
        show_feedback: false,
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "none",
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

            Notify.create({
              color: "positive",
              type: "positive",
              message: this.$t("app.inviteUserSuccessMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          } else if (res.status == 403) {
            Notify.create({
              color: "info",
              type: "info",
              message: this.$t("app.invitationLinkExpiredMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          } else {
            Notify.create({
              color: "info",
              type: "info",
              message: this.$t("app.inviteMemberFailMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
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
          credential: this.user.credential,
          password: this.user.password,
          password_confirmation: this.user.password_confirmation,
          role: this.$router.currentRoute.query.role,
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
}
</style>
