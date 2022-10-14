<template>
  <q-page class="page">
    <div class="row q-px-sm" :class="$q.screen.lg?'q-pt-lg flex flex-center':'q-pt-sm'">
      <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12">
        <q-card :class="$q.screen.lg?'q-mt-lg':'q-mt-md q-mb-xl'">
          <q-card-section>
            <div class="back_arrow_button" v-show="!is_exist_user || !has_logged_in">
              <q-btn class="material-icons back_arrow" icon="arrow_back" @click="goBack" flat />
            </div>
            <div class="text_h6 text-center q-pt-sm">
              SIGN IN
            </div>
            <div class="text-subtitle2 text-center">
              Sign in to continue to FinancialAssistant
            </div>
            <q-form @submit="onSubmit" class="q-gutter-md q-mt-lg q-px-md" v-show="has_logged_in && is_exist_user">
              <div>
                <label for="credential" class="form_field">Telephone/Email</label>
                <q-input v-model="user.credential" outlined dense type="text" />
              </div>
              <div>
                <label for="password" class="form_field">Password</label>
                <q-input v-model="user.password" :type="isPwd ? 'password' : 'text'" outlined dense>
                  <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd = !isPwd" />
                  </template>
                </q-input>
              </div>
              <div>
                <ButtonVue class="form_button" :label="label_sigin" :loading="loading" :disabled="validateLogin">
                </ButtonVue>
                <span class="forgot_password text-right">Forgot Password ?</span>
              </div>
            </q-form>
            <q-form @submit="onCheckUserExist" class="q-gutter-md q-mt-xl q-px-md"
              v-show="!has_logged_in && !is_exist_user">
              <div>
                <label for="credential" class="form_field">Telephone/Email</label>
                <q-input v-model="check_user.credential" outlined dense type="text" />
              </div>
              <div>
                <ButtonVue class="form_button" :label="label_continue" :loading="loading" :disabled="!validatePhone">
                </ButtonVue>
                <div class="row q-mb-xl justify-end">
                  <span class="account_text" v-if="!$q.screen.lg">Don't Have an Account ?
                    <router-link to="/auth/register" class="sign_link">
                      <span>SIGN UP</span>
                    </router-link>
                  </span>
                </div>
              </div>
            </q-form>
            <q-form @submit="onSetPassword" class="q-gutter-md q-mt-lg q-px-md"
              v-show="!has_logged_in && is_exist_user">
              <div>
                <label for="credential" class="form_field">Telephone/Email</label>
                <q-input v-model="user.credential" outlined dense type="text" />
              </div>
              <div>
                <label for="password" class="form_field">Password</label>
                <q-input v-model="user.password" :type="isPwd ? 'password' : 'text'" outlined dense>
                  <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd = !isPwd" />
                  </template>
                </q-input>
              </div>
              <div>
                <label for="password_confirmation" class="form_field">Confirm Password</label>
                <q-input v-model="user.password_confirmation" :type="is_pwd_confirm ? 'password' : 'text'" outlined
                  dense bottom-slots>
                  <template v-slot:append>
                    <q-icon :name="is_pwd_confirm ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="is_pwd_confirm = !is_pwd_confirm" />
                  </template>
                  <template v-slot:hint v-if="validatePasswordMatch">
                    <span class="text-red">Password must match</span>
                  </template>
                </q-input>
              </div>
              <div>
                <ButtonVue class="form_button" :label="label_sigin" :loading="loading"
                  :disabled="validatePasswordMatch">
                </ButtonVue>
                <div class="row q-mb-xl" :class="!$q.screen.lg?'justify-evenly':'justify-end'">
                  <span class="account_text" v-if="!$q.screen.lg">Don't Have an Account ?
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
export default {
  name: "PageIndex",
  created() {
    this.has_logged_in = localStorage.getItem('has_logged_in');
    this.is_exist_user = localStorage.getItem('is_exist_user');
    this.user.credential = localStorage.getItem('credential')
  },
  data() {
    return {
      user: {
        password: null,
        password_confirmation: null,
        credential: localStorage.getItem('credential') !== undefined ? localStorage.getItem('credentail') : null,
      },
      check_user: {
        credential: null
      },
      isPwd: true,
      is_pwd_confirm: true,
      label_continue: "CONTINUE",
      label_sigin: "SIGN IN",
      loading: false,
      is_exist_user: localStorage.getItem('is_exist_user'),
      has_logged_in: localStorage.getItem('has_logged_in'),
    };
  },
  computed: {
    validatePhone() {
      return (this.check_user.credential == null) ? false : true
    },
    validatePasswordMatch() {
      return (this.user.password === this.user.password_confirmation) ? false : true
    },
    validateLogin() {
      return (this.user.credential !== null && this.user.password !== null) ? false : true
    }
  },
  methods: {
    goBack() {
      this.is_user_exist = false;
    },
    onSubmit() {
      let payload = {
        url: "/api/public/auth/login",
        data: this.user,
        msg: "Login Successful",
        color: "default",
        to_on_ok: "Dashboard",
        to_on_fail: "none",
        error_msg: "Invalid Credentials",
        to_be_store_data: {
          required: true,
          has_value: false,
          data: [
            { key: 'data', value: null }
          ]
        }
      }
      this.$store.dispatch("auth/postRequest", payload).then(() => {
      }).finally(() => {
        this.loading = false;
      })
    },
    onCheckUserExist() {
      let payload = {
        url: "/api/public/auth/check-user",
        data: this.check_user,
        msg: "Success! please provide a password to Login",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "User Account does not exist",
        to_be_store_data: {
          required: true,
          has_value: true,
          data: [
            { key: 'is_exist_user', value: true },
            { key: 'credential', value: this.check_user.credential }
          ]
        }
      }
      this.loading = true;
      this.$store.dispatch('auth/postRequest', payload).then((res) => {
        if (res !== undefined) {
          this.is_exist_user = true;
          this.user.credential = this.check_user.credential
        }

      }).finally(() => {
        this.loading = false;
      })
    },
    onSetPassword() {
      let payload = {
        url: "/api/public/auth/set-password",
        data: this.user,
        msg: "Login Successful",
        color: "default",
        to_on_ok: "Dashboard",
        to_on_fail: "none",
        error_msg: "Invalid Credentails",
        to_be_store_data: {
          required: true,
          has_value: false,
          data: [
            { key: 'data', value: null }
          ]
        }
      }
      this.loading = true;
      this.$store.dispatch("auth/postRequest", payload).then(() => {
      }).finally(() => {
        this.loading = false;
      })
    }


  },
  components: {
    ButtonVue,
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box
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
  font-weight: bold;
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
  font-weight: 500;
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
  margin-top: .5rem;
  margin-bottom: .1rem;
}

.forgot_password {
  display: block;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 24px;
  align-items: center;
  letter-spacing: 0.005em;
  color: $primary;
  cursor: pointer;
  margin-top: .2rem;
}

.sign_link {
  text-decoration: none;
  color: $primary;
}

.account_text {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  color: $dark;
  text-transform: uppercase;
  line-height: 37px;
  float: right;

}
</style>
