<template>
  <div
    class="row q-px-sm flex flex-center"
    :class="$q.screen.lg ? 'q-pt-xl flex flex-center' : 'q-pt-sm'"
  >
    <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12">
      <q-card flat>
        <q-card-section>
          <div class="text_h6 text-center q-pt-xs q-pb-sm">
            {{ $t("app.createAccountTitle") }}
          </div>
          <div class="text-subtitle2 text-center q-pb-xs">
            {{ $t("app.signUpCaptionMsg") }}
          </div>
          <small class="q-pl-md hint"
            >{{ $t("app.warningField") }}<span class="text-red">* </span
            >{{ $t("app.fields") }}</small
          >
          <div class="q-pa-md">
            <q-form @submit="onSubmit" class="q-gutter-md">
              <div class="q-pb-md">
                <label class="form_field"
                  >{{ $t("app.nameAdminLabel") }}
                  <span class="text-red">*</span></label
                >
                <q-input
                  v-model="user.name"
                  outlined
                  dense
                  type="text"
                  lazy-rules
                />
              </div>
              <div class="q-pb-md">
                <label class="form_field"
                  >{{ $t("app.usernameAdminLabel") }}
                  <span class="text-red">*</span></label
                >
                <q-input
                  v-model="user.username"
                  outlined
                  dense
                  type="text"
                  placeholder="exampleadmin"
                  lazy-rules
                />
              </div>
              <div class="q-pb-md">
                <label class="form_field"
                  >{{ $t("app.telephoneLabel") }}
                  <span class="text-red">*</span></label
                >
                <vue-tel-input
                  v-model="user.telephone"
                  defaultCountry="cm"
                  mode="international"
                  class="q-pa-xs"
                ></vue-tel-input>
              </div>
              <div>
                <label class="form_field">{{ $t("app.emailLabel") }} </label>
                <q-input
                  v-model="user.email"
                  outlined
                  dense
                  type="email"
                  bottom-slots
                  placeholder="example@example.com"
                >
                </q-input>
              </div>
              <div>
                <label class="form_field"
                  >{{ $t("app.passwordLabel") }}
                  <span class="text-red">*</span></label
                >
                <q-input
                  v-model="user.password"
                  :type="is_pwd ? 'password' : 'text'"
                  outlined
                  dense
                  bottom-slots
                >
                  <template v-slot:append>
                    <q-icon
                      :name="is_pwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="is_pwd = !is_pwd"
                    />
                  </template>
                  <template v-slot:hint>
                    <span class="text-red" v-if="invalidPassword">{{
                      $t("app.newPasswordHintMsg")
                    }}</span>
                  </template>
                </q-input>
              </div>
              <div>
                <label class="form_field"
                  >{{ $t("app.confirmPasswordLabel") }}
                  <span class="text-red">*</span></label
                >
                <q-input
                  v-model="user.password_confirmation"
                  :type="is_confirm_pwd ? 'password' : 'text'"
                  outlined
                  @input="checkValidate()"
                  bottom-slots
                  dense
                >
                  <template v-slot:append>
                    <q-icon
                      :name="is_confirm_pwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="is_confirm_pwd = !is_confirm_pwd"
                    />
                  </template>
                  <template v-slot:hint v-if="!validatePasswordMatch">
                    <span class="text-red">{{
                      $t("app.passwordNotMatchMsg")
                    }}</span>
                  </template>
                </q-input>
              </div>
              <div class="q-pt-lg">
                <q-btn
                  class="form_button"
                  :label="$t('app.createAccountTitle')"
                  :loading="loading"
                  :disabled="!validateForm"
                  :color="color"
                  :no_caps="true"
                  type="submit"
                >
                  <q-icon
                    name="arrow_forward"
                    size="xs"
                    class="q-pl-lg"
                  ></q-icon>
                </q-btn>
              </div>
              <div class="row justify-center bottom q-pt-md">
                {{ $t("app.haveAccountMsg") }}
                <span @click="onConfirmAccountCreation()" class="sign_link"
                  >&nbsp;{{ $t("app.confirmAccount") }}</span
                >
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { Notify, Platform } from "quasar";
import { VueTelInput } from "vue-tel-input";
import ProcessStatusVue from "../Constants/ProcessStatus.vue";
export default {
  name: "PageIndex",
  data() {
    return {
      user: {
        telephone: null,
        password: null,
        password_confirmation: null,
        name: null,
        email: null,
        username: null,
      },
      is_pwd: true,
      is_confirm_pwd: true,
      loading: false,
      has_logged_in: false,
      disabled: true,
      is_valid_email: false,
      color: "primary",
    };
  },
  emits: ["confirmAccountCreation", "onAccountCreation"],
  computed: {
    validatePasswordMatch() {
      return this.checkValidate();
    },
    validateForm() {
      return (
        this.user.name !== null &&
        this.user.username !== null &&
        this.user.telephone !== null &&
        this.user.password !== null &&
        this.user.password_confirmation !== null &&
        this.validatePasswordMatch
      );
    },

    invalidPassword() {
      return this.user.password !== null && this.user.password.length < 8;
    },
  },
  methods: {
    onSubmit() {
      // this.$store.commit("SET_PROCESS_STEP", {
      //   processStatus: ProcessStatusVue.ACCOUNT_VERIFICATION,
      //   step: 2,
      // });
      // let payload = {
      //   url: "/api/public/auth/signup",
      //   data: this.user,
      //   msg: "Account Created Successfully",
      //   color: "default",
      //   to_on_ok: "",
      //   to_on_fail: "",
      //   error_msg: "default",
      //   show_feedback: true,
      //   to_be_store_data: {
      //     required: true,
      //     has_value: true,
      //     data: [
      //       { key: "is_exist_user", value: true },
      //       { key: "has_logged_in", value: true },
      //     ],
      //   },
      // };
      // this.loading = true;
      // this.$store.dispatch("postRequest", payload).then((res) => {
      //   if ((res.status = 422)) {
      //     Notify.create({
      //       type: "negative",
      //       message: this.$t("app.createAccountFailMsg"),
      //       position: Platform.is.mobile ? "bottom" : "top-right",
      //     });
      //   }
      //   if (res.status == 200) {

      this.$store.commit("SET_PROCESS_STEP", {
        processStatus: ProcessStatusVue.CREATE_ORGANISATION,
        step: 3,
        isSuccessful: true,
      });
      this.$emit("onAccountCreation");
      //   }
      //   this.loading = false;
      // });
    },
    checkValidate() {
      return this.user.password === this.user.password_confirmation;
    },
    onConfirmAccountCreation() {
      this.$store.commit("SET_PROCESS_STEP", {
        processStatus: ProcessStatusVue.ACCOUNT_VERIFICATION,
        step: 2,
        isSuccessful: true,
      });

      this.$emit("confirmAccountCreation");
    },
  },
  components: {
    VueTelInput,
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
}

.page {
  background-color: $grey1;
}

.text_h6 {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 800;
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
  font-size: 12px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.form_button {
  width: 100%;
}

.forgot_password {
  margin-top: 0.5rem;
  display: block;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  align-items: center;
  letter-spacing: 0.005em;
  color: $primary;
  cursor: pointer;
  margin-bottom: 2.2rem;
}

.sign_link {
  text-decoration: none;
  color: $primary;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.account_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  color: $dark;
  text-transform: uppercase;
}

.bottom {
  margin-bottom: 2.5rem;
}

.hint {
  color: $grey2;
  font-size: small;
}
</style>
