<template>
  <q-page>
    <div class="q-pa-xl">
      <div class="row">
        <div class="col-4"></div>
        <div class="col-4">
          <q-card class="login_form">
            <q-card-section class="q-pt-xs">
              <div class="q-py-xs back_arrow_button" v-show="has_logged_in">
                <q-btn class="material-icons back_arrow" icon="arrow_back" @click="goBack" flat />
              </div>
              <div class="text_h6 text-center" :class="has_logged_in ? 'q-pt-lg' : ''">
                SIGN IN
              </div>
              <div class="text-subtitle2 text-center q-pt-sm">
                Sign in to continue to Financial-Assistant
              </div>
            </q-card-section>
            <q-card-section>
              <div class="q-pa-xs" style="width: 100%" v-show="!has_logged_in">
                <q-form @submit="loginUser" class="q-gutter-md">
                  <div>
                    <label for="telephone" class="form_field">Telephone</label>
                    <q-input v-model="user.telephone" outlined dense type="tel" lazy-rules :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Telephone is required',
                    ]" />
                  </div>
                  <div>
                    <label for="password" class="form_field">Password</label>
                    <q-input v-model="user.password" :type="isPwd ? 'password' : 'text'" outlined dense lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Password is required',
                      ]">
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
              </div>
              <div class="q-pa-xs" style="width: 100%" v-show="has_logged_in && !is_exist_user">
                <q-form @submit="onCheckUserExist" class="q-gutter-md">
                  <div>
                    <label for="telephone" class="form_field">Telephone</label>
                    <q-input v-model="user.telephone" outlined dense type="tel" lazy-rules :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Telephone is required',
                    ]" />
                  </div>
                  <div>
                    <ButtonVue class="form_button q-mb-xl" :label="label_continue" :loading="loading"
                      :disabled="!validatePhone">
                    </ButtonVue>
                  </div>
                </q-form>
              </div>
              <div class="q-pa-xs" style="width: 100%" v-show="has_logged_in && is_exist_user">
                <q-form @submit="onSetPassword" class="q-gutter-md">
                  <div>
                    <label for="telephone" class="form_field">Telephone</label>
                    <q-input v-model="user.telephone" outlined dense type="tel" lazy-rules :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Telephone is required',
                    ]" />
                  </div>
                  <div>
                    <label for="password" class="form_field">Password</label>
                    <q-input v-model="user.password" :type="isPwd ? 'password' : 'text'" outlined dense lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Password is required',
                      ]">
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
                    <span class="forgot_password text-right">Forgot Password ?</span>
                  </div>
                </q-form>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-4"></div>
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
  margin: 0;
}

.col-4 {
  display: block;
}

.login_form {
  width: 100%;
}

.back_arrow {
  font-size: 0.9rem;
  margin-left: 0;
  padding-left: 0;
}

.text_h6 {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
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
  margin-top: 1rem;
  margin-bottom: 2.5rem;
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
</style>
