<template>
  <div class="row flex flex-center">
    <q-card flat class="col-4 col-md-4 col-lg-4 col-sm-12 col-xs-12">
      <q-card-section>
        <div class="text_h6 text-center">
          {{ $t("app.createAccountTitle") }}
        </div>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <div>
            <label class="form_field"
              ><q-icon name="person" size="xs" class="q-pr-xs"></q-icon>
              {{ $t("app.nameAdminLabel") }}
              <span :class="nameError ? 'text-red' : ''">*</span>
            </label>
            <q-input
              v-model="user.name"
              outlined
              dense
              type="text"
              @input="validateName()"
              :error="!!nameError"
              :error-message="nameError"
            />
          </div>
          <div>
            <label class="form_field"
              ><q-icon name="lock_person" size="xs" class="q-pr-xs"></q-icon
              >{{ $t("app.usernameAdminLabel") }}
              <span :class="usernameError ? 'text-red' : ''">*</span>
            </label>
            <q-input
              v-model="user.username"
              outlined
              dense
              @input="validateUsername()"
              type="text"
              :error="!!usernameError"
              :error-message="usernameError"
            >
              <template v-slot:hint>
                {{ $t("app.usernameHintMsg") }}
              </template>
            </q-input>
          </div>
          <div class="q-pb-xs">
            <label class="form_field"
              ><q-icon name="phone" size="xs" class="q-pr-xs"></q-icon
              >{{ $t("app.telephoneLabel") }}
              <span :class="telephoneError ? 'text-red' : ''">*</span>
            </label>
            <q-input
              v-model="user.telephone"
              outlined
              dense
              type="text"
              :error="!!telephoneError"
              :error-message="telephoneError"
              @input="validateTelephone()"
            ></q-input>
          </div>
          <div class="q-pb-md">
            <label class="form_field"
              ><q-icon name="email" size="xs" class="q-pr-xs"></q-icon
              >{{ $t("app.emailLabel") }}
              <span :class="emailError ? 'text-red' : ''">*</span></label
            >
            <q-input
              v-model="user.email"
              outlined
              dense
              type="email"
              :error="!!emailError"
              :error-message="emailError"
              @input="validateEmail()"
            >
              <template v-slot:hint>
                {{ $t("app.optionalFieldHintMsg") }}
              </template>
            </q-input>
          </div>
          <div>
            <label class="form_field"
              ><q-icon name="lock" size="xs" class="q-pr-xs"></q-icon
              >{{ $t("app.passwordLabel") }}
              <span :class="passwordError ? 'text-red' : ''">*</span></label
            >
            <q-input
              v-model="user.password"
              :type="is_pwd ? 'password' : 'text'"
              outlined
              dense
              bottom-slots
              @input="validatePassword()"
              :error="!!passwordError"
              :error-message="passwordError"
            >
              <template v-slot:append>
                <q-icon
                  :name="is_pwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="is_pwd = !is_pwd"
                />
              </template>
            </q-input>
          </div>
          <div class="q-pb-xs">
            <label class="form_field"
              ><q-icon name="lock" size="xs" class="q-pr-xs"></q-icon
              >{{ $t("app.confirmPasswordLabel") }}
              <span :class="passwordConfirmError ? 'text-red' : ''">*</span>
            </label>
            <q-input
              v-model="user.password_confirmation"
              :type="is_confirm_pwd ? 'password' : 'text'"
              outlined
              @input="validatePasswordMatch()"
              bottom-slots
              dense
              :error="!!passwordConfirmError"
              :error-message="passwordConfirmError"
            >
              <template v-slot:append>
                <q-icon
                  :name="is_confirm_pwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="is_confirm_pwd = !is_confirm_pwd"
                />
              </template>
            </q-input>
          </div>
          <div>
            <q-btn
              class="form_button"
              :label="$t('app.createAccountTitle')"
              :loading="loading"
              :disabled="!validateForm"
              :color="color"
              :no_caps="true"
              type="submit"
            >
            </q-btn>
          </div>
          <div class="row justify-between bottom q-pt-md">
            <p>
              {{ $t("app.haveAccountMsg") }}
              <span @click="onConfirmAccountCreation()" class="sign_link"
                >&nbsp;{{ $t("app.confirmAccount") }}</span
              >
            </p>

            <p>
              {{ $t("app.haveSubscription") }}
              <span @click="onLogin()" class="sign_link"
                >&nbsp;{{ $t("app.loginBtnLabel") }}</span
              >
            </p>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { LocalStorage, Notify, Platform } from "quasar";
import ProcessStatusVue from "../Constants/ProcessStatus.vue";
export default {
  name: "PageIndex",
  data() {
    return {
      user: {
        telephone: null,
        password: null,
        password_confirmation: null,
        name: " ",
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
      emailError: "",
      usernameError: "",
      nameError: "",
      passwordError: "",
      passwordConfirmError: "",
      telephoneError: "",
    };
  },
  emits: ["confirmAccountCreation", "onAccountCreation"],
  computed: {
    validateForm() {
      return (
        (this.user.email === null ||
          (this.user.email !== null && this.emailError === "")) &&
        this.user.telephone !== null &&
        this.telephoneError === "" &&
        this.user.name !== null &&
        this.nameError === "" &&
        this.user.username !== null &&
        this.usernameError === "" &&
        this.user.password !== null &&
        this.passwordError === "" &&
        this.user.password_confirmation !== null &&
        this.passwordConfirmError === ""
      );
    },
  },
  methods: {
    onSubmit() {
      let payload = {
        url: "/api/public/auth/signup",
        data: this.user,
        msg: "Account Created Successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "default",
        show_feedback: true,
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
          if (res.status === 422) {
            Notify.create({
              type: "negative",
              message: this.$t("app.createAccountFailMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
          if (res.status === 200) {
            this.$store.commit("SET_PROCESS_STEP", {
              ...res.data.data,
              processStatus: ProcessStatusVue.CREATE_ORGANISATION,
              step: 3,
              isSuccessful: true,
              username: res.data.data.username,
              loginId: res.data.data.id,
              email: res.data.data.email,
            });
            this.$emit("onAccountCreation");
            LocalStorage.set("loginId", res.data.data.id);
          }
        })
        .catch((e) => {})
        .finally(() => {
          this.loading = false;
        });
    },
    validatePasswordMatch() {
      const isValid = this.user.password === this.user.password_confirmation;
      this.passwordConfirmError = isValid
        ? ""
        : this.$t("app.passwordNotMatchMsg");
      return isValid;
    },
    validString(data) {
      return data !== null && data !== undefined && data.trim().length > 0;
    },

    validateEmail() {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const validEmail =
        this.user !== null &&
        thhis.user.email !== " " &&
        this.user.email !== null &&
        regex.test(this.user.email);
      this.emailError = validEmail ? "" : this.$t("app.invalidEmailErrorMsg");
      return validEmail;
    },
    validateName() {
      const validName =
        this.validString(this.user.name) && this.user.name.length >= 4;
      this.nameError = validName ? "" : this.$t("app.invalidNameMsg");
      return validName;
    },
    validateUsername() {
      const isvalid =
        this.validString(this.user.username) &&
        this.user.username.length >= 8 &&
        !this.user.username.includes(" ");
      this.usernameError = isvalid
        ? ""
        : this.$t("app.invalidUsernameErrorMsg");
      return isvalid;
    },

    validateTelephone() {
      const regex = /^\d{9,15}$/;
      const validPhone = regex.test(this.user.telephone);
      this.telephoneError = validPhone ? "" : this.$t("app.invalidPhoneError");
      return validPhone;
    },

    validatePassword() {
      const validPass =
        this.user.password !== null && this.user.password.length >= 8;
      this.passwordError = validPass ? "" : this.$t("app.newPasswordHintMsg");
      return validPass;
    },
    onConfirmAccountCreation() {
      this.$store.commit("SET_PROCESS_STEP", {
        processStatus: ProcessStatusVue.ACCOUNT_VERIFICATION,
        step: 2,
        isSuccessful: true,
      });

      this.$emit("confirmAccountCreation");
    },

    onLogin() {
      this.$router.push("/auth/login");
    },
  },
  components: {},
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
  font-size: 17px;
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
  font-size: 0.9rem;
  align-items: center;
  color: $grey5;
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
