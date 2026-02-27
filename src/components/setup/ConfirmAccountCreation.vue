<template>
  <div
    class="row q-px-sm flex flex-center"
    :class="$q.screen.lg ? 'q-pt-xl flex flex-center' : 'q-pt-sm'"
  >
    <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12">
      <q-card flat>
        <q-card-section>
          <div class="text_h6 text-center q-pt-xs q-pb-sm">
            {{ $t("app.confirmAccount") }}
          </div>
          <div class="q-pa-md">
            <q-form @submit="onSubmit" class="q-gutter-md">
              <div>
                <label class="form_field">{{ $t("app.usernameLabel") }} </label>
                <q-input
                  v-model="user.username"
                  outlined
                  dense
                  @input="validateUsername()"
                  type="text"
                  placeholder="exampleadmin"
                  :error="!!usernameError"
                  :error-message="usernameError"
                >
                </q-input>
              </div>
              <div class="q-pt-md">
                <label class="form_field">{{ $t("app.passwordLabel") }} </label>
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
              <div class="q-pt-md">
                <q-btn
                  class="form_button"
                  :label="$t('app.confirmAccount')"
                  :loading="loading"
                  :disabled="!validateForm"
                  color="primary"
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
              <div class="row justify-center bottom q-pt-md">
                {{ $t("app.noAccountMsg") }}
                <span @click="onAccountCreation()" class="sign_link"
                  >&nbsp;{{ $t("app.createAccountTitle") }}</span
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
import { LocalStorage, Notify, Platform } from "quasar";
import ProcessStatusVue from "../Constants/ProcessStatus.vue";
export default {
  name: "PageIndex",
  data() {
    return {
      user: {
        password: null,
        username: null,
      },
      is_pwd: true,
      is_confirm_pwd: true,
      loading: false,
      usernameError: "",
      telephoneError: "",
      passwordError: "",
    };
  },
  emits: ["onAccountCreation", "onCreateOrganisation"],
  computed: {
    validatePasswordMatch() {
      return this.checkValidate();
    },
    validateForm() {
      return (
        this.user.username !== null &&
        this.user.telephone !== null &&
        this.user.password !== null
      );
    },

    invalidPassword() {
      return this.user.password !== null && this.user.password.length < 8;
    },
  },
  methods: {
    onSubmit() {
      let payload = {
        url: "/api/public/auth/verify-client",
        data: this.user,
        msg: "Account Confirm Successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "default",
        show_feedback: true,
        to_be_store_data: {
          required: true,
          has_value: true,
          data: [
            { key: "is_exist_user", value: true },
            { key: "has_logged_in", value: true },
          ],
        },
      };
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then((res) => {
          if (res.status === 422) {
            Notify.create({
              type: "negative",
              message: this.$t("app.confirmAccountFailMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
          if (res.status === 403) {
            Notify.create({
              type: "negative",
              message: this.$t("app.accountInvalid"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
          if (res.status === 200) {
            LocalStorage.set("loginId", res.data.data.id);
            this.$store.commit("SET_PROCESS_STEP", {
              ...res.data.data,
              processStatus: ProcessStatusVue.CREATE_ORGANISATION,
              step: 3,
              isSuccessful: true,
              loginId: res.data.data.id,
              accountId: res.data.data.id,
            });
            this.$emit("onCreateOrganisation");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    validString(data) {
      return data !== null && data !== undefined && data.trim().length > 0;
    },

    validateUsername() {
      const isvalid =
        this.validString(this.user.username) &&
        this.user.username.length >= 4 &&
        !this.user.username.includes(" ");
      this.usernameError = isvalid
        ? ""
        : this.$t("app.invalidUsernameErrorMsg");
      return isvalid;
    },

    validateTelephone() {
      const regex = /^(\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4}))$/;
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

    onAccountCreation() {
      this.$store.commit("SET_PROCESS_STEP", {
        processStatus: ProcessStatusVue.CREATE_ACCOUNT,
        step: 1,
        isSuccessful: false,
      });
      this.$emit("onAccountCreation");
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
