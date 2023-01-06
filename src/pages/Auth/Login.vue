<template>
  <q-page class="page">
    <div
      class="row q-px-sm"
      :class="$q.screen.lg ? 'q-pt-lg flex flex-center' : 'q-pt-sm'"
    >
      <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12">
        <q-card :class="$q.screen.lg ? 'q-mt-lg' : 'q-mt-md q-mb-xl'">
          <q-card-section>
            <div
              class="back_arrow_button"
              v-show="!is_exist_user || !has_logged_in"
            >
              <q-btn
                class="material-icons back_arrow"
                icon="arrow_back"
                @click="goBack"
                flat
              />
            </div>
            <div class="text_h6 text-center q-pt-sm q-pb-sm">SIGN IN</div>
            <div class="text-subtitle2 text-center q-pb-xs">
              Sign in to continue to Financial Assistant
            </div>
            <q-form
              @submit="onSubmit"
              class="q-gutter-md q-mt-lg q-px-md"
              v-show="has_logged_in && is_exist_user"
            >
              <div>
                <label for="credential" class="form_field">Telephone</label>
                <q-input
                  v-model="user.credential"
                  outlined
                  dense
                  type="tel"
                  mask="(+###) ### - ### - ###"
                  unmasked-value
                  hint="Example: (+237) ### - ### - ###"
                />
              </div>
              <div>
                <label for="password" class="form_field">Password</label>
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
              <div class="q-mt-lg">
                <ButtonVue
                  class="form_button q-pa-xs"
                  :label="label_sigin"
                  :loading="loading"
                  :disabled="validateLogin"
                  :color="color"
                  :no_caps="no_caps"
                >
                </ButtonVue>
                <span class="forgot_password text-right"
                  >Forgot Password ?</span
                >
              </div>
            </q-form>
            <q-form
              @submit="onCheckUserExist"
              class="q-gutter-md q-mt-md q-px-xs"
              v-show="!has_logged_in && !is_exist_user"
            >
              <div>
                <label for="credential" class="form_field">Telephone</label>
                <q-input
                  v-model="check_user.credential"
                  outlined
                  dense
                  type="tel"
                  mask="(+###) ### - ### - ###"
                  unmasked-value
                  hint="Example: (+237) ### - ### - ###"
                />
              </div>
              <div>
                <ButtonVue
                  class="form_button q-mt-md q-pa-xs"
                  :label="label_continue"
                  :loading="loading"
                  :disabled="!validatePhone"
                  :color="color"
                  :no_caps="no_caps"
                >
                </ButtonVue>
                <div class="row q-mb-xl justify-end">
                  <span class="account_text" v-if="!$q.screen.lg"
                    >Don't Have an Account ?
                    <router-link to="/auth/register" class="sign_link">
                      <span>SIGN UP</span>
                    </router-link>
                  </span>
                </div>
              </div>
            </q-form>
            <q-form
              @submit="onSetPassword"
              class="q-gutter-md q-mt-md q-px-md"
              v-show="!has_logged_in && is_exist_user"
            >
              <div>
                <label for="credential" class="form_field">Telephone</label>
                <q-input
                  v-model="user.credential"
                  outlined
                  dense
                  type="tel"
                  mask="(+###) ### - ### - ###"
                  unmasked-value
                  hint="Example: (+237) ### - ### - ###"
                />
              </div>
              <div>
                <label for="password" class="form_field">Password</label>
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
                  >Confirm Password</label
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
                    <span class="text-red">Password must match</span>
                  </template>
                </q-input>
              </div>
              <div>
                <ButtonVue
                  class="form_button q-pa-xs"
                  :label="label_sigin"
                  :loading="loading"
                  :color="color"
                  :disabled="validatePasswordMatch"
                  :no_caps="no_caps"
                >
                </ButtonVue>
                <div
                  class="row q-mb-xl"
                  :class="!$q.screen.lg ? 'justify-evenly' : 'justify-end'"
                >
                  <span class="account_text" v-if="!$q.screen.lg"
                    >Don't Have an Account ?
                    <router-link to="/auth/register" class="sign_link">
                      <span>SIGN UP</span>
                    </router-link>
                  </span>
                  <span class="forgot_password">Forgot Password ?</span>
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
import ButtonVue from "src/components/Button.vue";
import { LocalStorage, SessionStorage } from "quasar";
export default {
  name: "PageIndex",
  created() {
    this.has_logged_in = LocalStorage.getItem("has_logged_in");
    this.is_exist_user = LocalStorage.getItem("is_exist_user");
    this.user.credential = LocalStorage.getItem("credential");
  },
  data() {
    return {
      user: {
        password: null,
        password_confirmation: null,
        credential:
          LocalStorage.getItem("credential") !== undefined
            ? LocalStorage.getItem("credentail")
            : null,
      },
      check_user: {
        credential: null,
      },
      isPwd: true,
      is_pwd_confirm: true,
      label_continue: "CONTINUE",
      label_sigin: "SIGN IN",
      loading: false,
      is_exist_user: LocalStorage.getItem("is_exist_user"),
      has_logged_in: LocalStorage.getItem("has_logged_in"),
      roles: [],
      color: "primary",
      no_caps: true,
    };
  },
  computed: {
    validatePhone() {
      return this.check_user.credential == null ? false : true;
    },
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
    goBack() {
      this.is_exist_user = false;
      this.has_logged_in = false;
      LocalStorage.remove("is_exist_user");
      LocalStorage.set("is_exist_user", false);
    },
    onSubmit() {
      this.loading = true;
      let payload = {
        url: "/api/public/auth/login",
        data: {
          telephone: this.user.credential,
          password: this.user.password,
          email: this.user.credential,
        },
        msg: "Login Successful",
        color: "default",
        to_on_ok: "dashboard",
        to_on_fail: "none",
        show_feedback:true,
        error_msg: "Invalid Credentials! Please try again",
        to_be_store_data: {
          required: true,
          has_value: false,
          data: [{ key: "data", value: null }],
        },
      };
      this.$store
        .dispatch("postRequest", payload)
        .then((res) => {
          SessionStorage.set("to_tab", 'Dashboard');
          if (typeof res !== undefined) {
            this.$store.dispatch(
              "setRoles",
              this.setUserRoles(res.data.data.roles)
            );
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onCheckUserExist() {
      let payload = {
        url: "/api/public/auth/check-user",
        data: this.check_user,
        msg: "Success! please provide a password to Login",
        color: "default",
        show_feedback:true,
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "User Account does not exist! Please try again",
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
          if (res !== undefined) {
            this.is_exist_user = true;
            this.user.credential = this.check_user.credential;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onSetPassword() {
      let payload = {
        url: "/api/public/auth/set-password",
        data: this.user,
        msg: "Login Successful",
        color: "default",
        to_on_ok: "members",
        to_on_fail: "none",
        show_feedback:true,
        error_msg: "Invalid Credentails! Please try again",
        to_be_store_data: {
          required: true,
          has_value: false,
          data: [{ key: "data", value: null }],
        },
      };
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then(() => {
          SessionStorage.set("to_tab", 'Dashboard');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setUserRoles(roles) {
      roles.forEach((role) => {
        this.roles.push(role.name);
      });
      return this.roles;
    },
  },
  components: {
    ButtonVue,
  },
};
</script>

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
