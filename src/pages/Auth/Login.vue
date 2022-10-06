<template>
  <q-page class="page">
    <div class="row q-px-sm" :class="$q.screen.lg?'q-pt-lg flex flex-center':'q-pt-sm'">
      <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12">
        <q-card :class="$q.screen.lg?'q-mt-lg':'q-mt-md q-mb-xl'">
          <q-card-section>
            <div class="back_arrow_button" v-show="has_logged_in">
              <q-btn class="material-icons back_arrow" icon="arrow_back" @click="goBack" flat />
            </div>
            <div class="text_h6 text-center q-pt-sm">
              SIGN IN
            </div>
            <div class="text-subtitle2 text-center">
              Sign in to continue to Financial-Assistant
            </div>
            <q-form @submit="loginUser" class="q-gutter-md q-mt-lg q-px-md" v-show="!has_logged_in">
              <div>
                <label for="telephone" class="form_field">Telephone/Email</label>
                <q-input v-model="user.telephone" outlined dense type="tel" />
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
                <ButtonVue class="form_button" :label="label_sigin" :loading="loading" :disabled="validateForm">
                </ButtonVue>
                <span class="forgot_password text-right">Forgot Password ?</span>
              </div>
            </q-form>
            <q-form @submit="onCheckUserExist" class="q-gutter-md q-mt-xl q-px-md"
              v-show="has_logged_in && !is_exist_user">
              <div>
                <label for="telephone" class="form_field">Telephone/Email</label>
                <q-input v-model="user.telephone" outlined dense type="tel" />
              </div>
              <div>
                <ButtonVue class="form_button" :label="label_continue" :loading="loading" :disabled="!validatePhone">
                </ButtonVue>
                <div class="row q-mb-xl justify-end">
                  <span class="account_text" v-if="!$q.screen.lg">Don't Have an Account ?
                    <router-link to="/auth/register" class="sign_link">
                      <span @click="checkAccountExist">SIGN UP</span>
                    </router-link>
                  </span>
                </div>
              </div>
            </q-form>
            <q-form @submit="onSetPassword" class="q-gutter-md q-mt-lg q-px-md" v-show="has_logged_in && is_exist_user">
              <div>
                <label for="telephone" class="form_field">Telephone/Email</label>
                <q-input v-model="user.telephone" outlined dense type="tel" />
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
                <q-input v-model="user.password_confirmation" :type="isPwd ? 'password' : 'text'" outlined dense>
                  <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd = !isPwd" />
                  </template>
                </q-input>
              </div>
              <div>
                <ButtonVue class="form_button" :label="label_sigin" :loading="loading" :disabled="validateForm">
                </ButtonVue>
                <div class="row q-mb-xl" :class="!$q.screen.lg?'justify-evenly':'justify-end'">
                  <span class="account_text" v-if="!$q.screen.lg">Don't Have an Account ?
                    <router-link to="/auth/register" class="sign_link">
                      <span @click="checkAccountExist">SIGN UP</span>
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
import axios from "axios";
import ButtonVue from "src/components/Button.vue";
import notificationMixin from "src/mixins/notificationMixin";
export default {
  name: "PageIndex",
  mixins: [notificationMixin],
  created() {
    this.has_logged_in = this.$router.history.current.meta.firstTimer;
    this.is_exist_user = localStorage.getItem('is_exist_user');
  },
  data() {
    return {
      user: {
        telephone: "",
        password: "",
        password_confirmation: "",
      },
      isPwd: true,
      label_continue: "CONTINUE",
      label_sigin: "SIGN IN",
      loading: false,
      disabled: false,
      validateForm: false,
      is_exist_user: false
    };
  },
  computed: {
    checkUserExist() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.is_exist_user = localStorage.getItem('is_exist_user');
      return this.is_exist_user;
    },
    validatePhone() {
      return (this.user.telephone == "") ? false : true
    }
  },
  methods: {
    loginUser() {
      // this.loading = true;
      // this.$store
      //   .dispatch("auth/loginUser", this.user)
      //   .then((response) => {
      //     if (response.status == 200) {
      //       this.sendMessage("positive", "Login Successful");
      //       this.$router.push("/user/dashboard");
      //     } else if (response.status == 401) {
      //       this.sendMessage("negative", "Login Failed!  Invalid Credentials ");
      //     }
      //   })
      //   .finally(() => {
      //     this.loading = false;
      //   });
      console.log("hi");
    },
    goBack() {
      this.is_user_exist = false;
    },
    onSubmit() {
      console.log("hello");
    },
    onCheckUserExist() {
      const API_URL = process.env.BASE_URL[0];
      this.loading = true;
      axios.post(`${API_URL}/api/public/auth/check-user`, this.user).then((response) => {
        this.is_exist_user = true;
        localStorage.setItem('is_exist_user', true);
        console.log(response.data.telephone);
        this.user.telephone = response.data.telephone
      }).catch((error) => {
        this.sendMessage('negative', 'User Account not found');
      }).finally(() => {
        this.loading = false;
      })
    },
    onSetPassword() {
      const API_URL = process.env.BASE_URL[0];
      this.loading = true;
      axios.post(`${API_URL}/api/public/auth/set-password`, this.user).then((res) => {
        const data = JSON.stringify(res.data);
        localStorage.setItem("data", data);
        this.$router.history.current.meta.firstTimer = false;
        this.sendMessage('positive', 'Login Successful');
      }).catch((error) => {
        return error.response;
      }).finally(() => {
        this.loading = false
      });
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
