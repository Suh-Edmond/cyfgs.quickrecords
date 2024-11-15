<template>
  <q-page class="page">
    <div
      class="row q-px-md"
      :class="$q.screen.lg ? 'q-pt-lg flex flex-center' : 'q-pt-sm'"
    >
      <div class="col-4 col-md-4 col-lg-4 col-sm-12 col-xs-12"></div>
      <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12 q-mt-xl">
        <q-card :class="$q.screen.lg ? 'q-mt-lg card_lg' : 'q-mt-md card'">
          <!-------------------------PASSWORD RESET TOKEN FORM -------------------------------->
          <q-card-section v-show="show_token_form">
            <div class="back_arrow_button">
              <q-btn
                class="material-icons back_arrow"
                icon="arrow_back"
                @click="goBack"
                flat
              />
            </div>
            <div class="text_h6 text-center q-pt-sm q-pb-sm">
              <div>
                <a :href="baseUrl">
                  <q-avatar :size="$q.screen.lg ? '6.6rem' : '6.6rem'">
                    <img src="../../assets/App_Logo.jpeg" alt="app logo" />
                  </q-avatar>
                </a>
              </div>
              <div class="main_login_text">
                {{ $t("app.passwordReset") }}
              </div>
            </div>
            <div class="text-subtitle2 text-center q-pb-xs">
              {{ $t("app.passwordResetCaption") }}
            </div>

            <!-- Form to get password reset token -->
            <q-form
              @submit="onGetPasswordResetToken"
              class="q-gutter-md q-mt-md"
              :class="$q.screen.lg ? 'q-px-md' : ''"
            >
              <div>
                <label for="credential" class="form_field"
                  ><q-icon name="email" size="xs" class="q-py-sm"></q-icon
                  >{{ $t("app.emailLabel") }}
                  <span class="text-red">*</span></label
                >
                <q-input
                  v-model="user.email"
                  outlined
                  dense
                  type="email"
                  bottom-slots
                >
                </q-input>
              </div>
              <div class="q-mb-xl">
                <q-btn
                  class="form_button"
                  :label="label"
                  :loading="loading"
                  :disabled="validateEmail"
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
          <!------------------------------END OF PASSWORD RESET TOKEN FORM------------------------->

          <q-card-section v-show="!show_token_form && emailSentSuccessfully">
            <div class="text-center email_sent_icon">
              <q-icon name="check" class="check_icon"></q-icon>
            </div>
            <div class="q-pa-md">
              <p class="tokenMsg">
                {{ $t("app.passwordResetTokenSuccessMsg") }}.
              </p>
              <p class="passwordCaption">
                {{ $t("app.passwordTokenCaption") }}.
              </p>
            </div>
          </q-card-section>

          <q-card-section v-show="!show_token_form && !emailSentSuccessfully">
            <div class="text-center email_sent_icon">
              <q-icon
                name="close"
                :class="emailSentSuccessfully ? 'check_icon' : 'close_icon'"
              ></q-icon>
            </div>
            <div class="q-pa-md">
              <p class="tokenMsg">{{ $t("app.passwordResetTokenFailMsg") }}.</p>
              <p class="passwordCaption">
                {{ $t("app.passwordResetFailCaption") }}
              </p>
            </div>
          </q-card-section>
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
      user: {
        email: "",
      },
      label: this.$t("app.getPasswordResetToken"),
      loading: false,
      show_token_form: true,
      emailSentSuccessfully: true,
      baseUrl: process.env.API_BASE_URL,
    };
  },
  computed: {
    validateEmail() {
      return this.user.email == "";
    },
  },
  methods: {
    goBack() {
      history.back();
    },

    onGetPasswordResetToken() {
      let payload = {
        url: "/api/public/auth/reset-password-token",
        data: {
          email: this.user.email,
        },
        msg: this.$t("app.passwordResetTokenSuccessMsg"),
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
          if (res.status == 200) {
            this.show_token_form = false;
            this.emailSentSuccessfully = true;
          } else if (res.status == 403) {
            this.emailSentSuccessfully = false;
            Notify.create({
              type: "info",
              message: this.$t("app.NonRoleUserEmailFailMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          } else if (res.status == 404) {
            this.emailSentSuccessfully = false;
            Notify.create({
              type: "info",
              message: this.$t("app.invalidEmailMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          } else {
            this.emailSentSuccessfully = false;
            Notify.create({
              type: "info",
              message: this.$t("app.notSendEmailMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.loading = false;
        });
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.card {
  height: 32rem;
}

.card_lg {
  height: 25rem;
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
  margin-bottom: 0.1rem;
}

.check_icon {
  font-size: 5rem;
  color: $positive;
}

.close_icon {
  font-size: 5rem;
  color: $red;
}

.passwordCaption {
  color: $grey2;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 0.8rem;
  text-align: center;
}

.main_login_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  align-items: center;
  text-align: center;
}

.email_sent_icon {
  margin-top: 6rem;
}
</style>
