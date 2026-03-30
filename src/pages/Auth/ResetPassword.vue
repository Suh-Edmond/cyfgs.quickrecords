<template>
  <q-page class="page">
    <div
      class="row q-px-md"
      :class="$q.screen.lg ? 'q-pt-lg flex flex-center' : 'q-pt-sm'"
    >
      <div class="col-4 col-md-4 col-lg-4 col-sm-12 col-xs-12"></div>
      <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12 q-mt-xl">
        <q-card :class="$q.screen.lg ? 'q-mt-lg card_lg' : 'q-mt-md card'">
          <div v-if="!show_token_expire_msg">
            <!-------------------------PASSWORD RESET TOKEN-------------------------------->
            <q-card-section v-if="show_new_password_form">
              <div class="text_h6 text-center q-pt-sm q-pb-sm">
                <div>
                  <a :href="baseUrl"
                    ><q-avatar :size="$q.screen.lg ? '6.6rem' : '6.6rem'">
                      <img
                        src="../../assets/App_Logo.jpeg"
                        alt="app logo"
                      /> </q-avatar
                  ></a>
                </div>
                <div class="main_login_text">
                  {{ $t("app.passwordResetToken") }}
                </div>
              </div>
              <div class="text-subtitle2 text-center q-pb-xs">
                {{ $t("app.passwordResetTokenCap") }}
              </div>

              <q-form
                @submit="onSubmitPasswordResetToken"
                class="q-gutter-md q-mt-md"
                :class="$q.screen.lg ? 'q-px-md' : ''"
              >
                <div>
                  <label class="form_field"
                    ><q-icon name="token" size="xs"></q-icon
                    >{{ $t("app.token") }}
                    <span class="text-red">*</span></label
                  >
                  <q-input v-model="token" outlined dense type="text">
                  </q-input>
                </div>
                <div class="q-mb-xl q-mt-xl">
                  <q-btn
                    class="form_button"
                    :label="$t('app.submit')"
                    :loading="loading"
                    :color="'primary'"
                    :disabled="validationToken"
                    no-caps
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
            <!------------------------------END OF PASSWORD RESET TOKEN FORM------------------------->

            <!-------------------------NEW PASSWORD FORM-------------------------------->
            <q-card-section v-if="!show_new_password_form">
              <div class="text_h6 text-center q-pt-sm q-pb-sm">
                <div>
                  <a :href="baseUrl">
                    <q-avatar :size="$q.screen.lg ? '6.6rem' : '6.6rem'">
                      <img src="../../assets/App_Logo.jpeg" alt="app logo" />
                    </q-avatar>
                  </a>
                </div>
                <div class="main_login_text">
                  {{ $t("app.resetPasswordMsg") }}
                </div>
              </div>
              <div class="text-subtitle2 text-center q-pb-xs">
                {{ $t("app.resetCap") }}
              </div>
              <q-form
                @submit="onSubmitNewPassword"
                class="q-gutter-xs q-mt-md"
                :class="$q.screen.lg ? 'q-px-md' : ''"
              >
                <div>
                  <label class="form_field"
                    ><q-icon name="lock" size="xs"></q-icon
                    >{{ $t("app.newPassword") }}
                    <span class="text-red">*</span></label
                  >
                  <q-input
                    v-model="user.new_password"
                    :type="isPwd ? 'password' : 'text'"
                    outlined
                    dense
                    bottom-slots
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                    <template v-slot:hint>
                      <span class="text-red" v-show="validatePasswordSize">{{
                        $t("app.newPasswordHintMsg")
                      }}</span>
                    </template>
                  </q-input>
                </div>
                <div>
                  <label class="form_field"
                    ><q-icon name="lock" size="xs"></q-icon
                    >{{ $t("app.confirmPasword") }}
                    <span class="text-red">*</span></label
                  >
                  <q-input
                    v-model="user.confirm_password"
                    :type="isConfirmPwd ? 'password' : 'text'"
                    outlined
                    dense
                    bottom-slots
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isConfirmPwd = !isConfirmPwd"
                      />
                    </template>
                    <template v-slot:hint>
                      <span class="text-red" v-if="validatePasswordMatch">{{
                        $t("app.passwordNotMatchMsg")
                      }}</span>
                    </template>
                  </q-input>
                </div>
                <div class="q-mb-xl">
                  <q-btn
                    class="form_button"
                    :label="$t('app.saveBtnLabel')"
                    :loading="loading"
                    :disabled="validatePassword"
                    :color="'primary'"
                    no-caps
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
            <!-------------------------END NEW PASSWORD FORM-------------------------------->
          </div>

          <!-------------------------START PASSWORD RESET TOKEN EXPIRED-------------------------------->
          <q-card-section v-if="show_token_expire_msg">
            <div class="text-center token_expire_section">
              <q-icon name="hourglass_bottom" class="expired_icon"></q-icon>
            </div>
            <div class="q-pa-md">
              <p class="tokenMsg">{{ $t("app.tokenExpireMsg") }}.</p>
              <p class="passwordCaption">
                {{ $t("app.passwordTokenExpireCaption") }}.
              </p>
            </div>
            <div class="text-center q-mb-xl">
              <q-btn
                to="/"
                flat
                :label="$t('app.newPasswordResetTokenMsg')"
                @click="onRedirected"
                color="primary"
                no-caps
              />
            </div>
          </q-card-section>
          <!-------------------------END PASSWORD RESET TOKEN EXPIRED-------------------------------->
        </q-card>
      </div>
      <div class="col-4 col-md-4 col-lg-4 col-sm-12 col-xs-12"></div>
    </div>
  </q-page>
</template>

<script>
import { Notify, Platform } from "quasar";

export default {
  data() {
    return {
      token: "",
      loading: false,
      show_new_password_form: true,
      isPwd: true,
      isConfirmPwd: true,
      user: {
        confirm_password: "",
        new_password: "",
        user_id: "",
      },
      show_token_expire_msg: false,
      baseUrl: process.env.CLIENT_SERVER,
    };
  },
  computed: {
    validationToken() {
      return this.token === "";
    },
    validatePassword() {
      return (
        this.user.new_password === "" ||
        this.user.new_password.length < 8 ||
        this.user.confirm_password === "" ||
        this.user.confirm_password.length < 8 ||
        this.user.new_password !== this.user.confirm_password
      );
    },
    validatePasswordSize() {
      return this.user.new_password !== "" && this.user.new_password.length < 8;
    },
    validatePasswordMatch() {
      return this.user.new_password !== this.user.confirm_password;
    },
  },
  methods: {
    onSubmitPasswordResetToken() {
      let payload = {
        url: "/api/public/auth/validate/password-reset",
        data: {
          token: this.token,
        },
        msg: this.$t("app.successResetTokenMsg"),
        color: "default",
        show_feedback: true,
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then((res) => {
          if (res.status === 200) {
            this.user.user_id = res.data.data.user_id;
            this.show_new_password_form = false;
          }
          if (res.status === 400) {
            this.show_token_expire_msg = true;
            Notify.create({
              type: "info",
              position: Platform.is.mobile ? "bottom" : "top-right",
              message: this.$t("app.tokenExpireMsg"),
            });
          }
          if (res.status === 403) {
            Notify.create({
              type: "info",
              position: Platform.is.mobile ? "bottom" : "top-right",
              message: this.$t("app.invalidTokenMsg"),
            });
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.loading = false;
        });
    },

    onSubmitNewPassword() {
      let payload = {
        url: "/api/public/auth/reset-password",
        data: {
          token: this.token,
          user_id: this.user.user_id,
          new_password: this.user.new_password,
        },
        msg: this.$t("app.successResetPasswordMsg"),
        color: "default",
        show_feedback: true,
        to_on_ok: "Login",
        to_on_fail: "PasswordReset",
        error_msg: this.$t("app.failedResetPasswordMsg"),
        to_be_store_data: {
          required: true,
          has_value: true,
          data: [],
        },
      };
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then((response) => {})
        .catch((error) => {})
        .finally(() => {
          this.loading = false;
        });
    },

    onRedirected(e, go) {
      e.preventDefault();
      go({
        to: "/auth/password-reset/get-token",
      })
        .then((_vueRouterResult) => {})
        .catch((_vueRouterError) => {});
    },
  },
  components: {},
};
</script>

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
  font-weight: 500;
  font-size: 0.9rem;
  align-items: center;
  text-align: center;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
  align-items: center;
  color: $grey5;
}

.tokenMsg {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  align-items: center;
  text-align: center;
}

.form_button {
  width: 100%;
}

.check_icon {
  font-size: 4rem;
  color: $positive;
}

.passwordCaption {
  color: $grey2;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
  text-align: center;
}

.expired_icon {
  color: $red;
  font-size: 4rem;
}

.main_login_text {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  align-items: center;
  text-align: center;
}

.card {
  height: 33rem;
}

.card_lg {
  height: 25rem;
}

.token_expire_section {
  margin-top: 5rem;
}
</style>
