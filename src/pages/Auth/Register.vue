<template>
  <q-page class="page">
    <div class="row q-px-sm" :class="$q.screen.lg?'q-pt-md flex flex-center':'q-pt-sm'">
      <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section>
            <div class="text_h6 text-center q-pt-sm">
              SIGN UP
            </div>
            <div class="text-subtitle2 text-center">
              Sign up to get started with FinancialAssistant
            </div>
            <div class="q-pa-md">
              <q-form @submit="onSubmit" class="q-gutter-md">
                <div class="q-pb-md">
                  <label for="name" class="form_field">Name</label>
                  <q-input v-model="user.name" outlined dense type="text" lazy-rules />
                </div>
                <div class="q-pb-md">
                  <label for="telephone" class="form_field">Telephone</label>
                  <q-input v-model="user.telephone" outlined dense type="tel" />
                </div>
                <div class="q-pb-md">
                  <label for="email" class="form_field">E-mail</label>
                  <q-input v-model="user.email" outlined dense type="email" />
                </div>
                <div class="q-pb-md">
                  <label for="password" class="form_field">Password</label>
                  <q-input v-model="user.password" :type="is_pwd ? 'password' : 'text'" outlined dense>
                    <template v-slot:append>
                      <q-icon :name="is_pwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="is_pwd = !is_pwd" />
                    </template>
                  </q-input>
                </div>
                <div class="q-pb-sm">
                  <label for="confirm_password" class="form_field">Confirm Password</label>
                  <q-input v-model="user.password_confirmation" :type="is_confirm_pwd ? 'password' : 'text'" outlined
                    dense>
                    <template v-slot:append>
                      <q-icon :name="
                        is_confirm_pwd ? 'visibility_off' : 'visibility'
                      " class="cursor-pointer" @click="is_confirm_pwd = !is_confirm_pwd" />
                    </template>
                    <template v-slot:error> Password mismatch </template>
                  </q-input>
                </div>
                <div class="bottom">
                  <ButtonVue class="form_button" :label="label_sigup" :loading="loading" :disabled="validateForm">
                  </ButtonVue>
                  <div class="account_text" v-if="!$q.screen.lg">Already Have an Account ?<router-link to="/auth/login" class="sign_link">
                      <span @click="checkAccountExist">SIGN IN</span></router-link>
                  </div>
                </div>
              </q-form>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import ButtonVue from "src/components/Button.vue";
import notificationMixin from "src/mixins/notificationMixin";
export default {
  name: "PageIndex",
  mixins: [notificationMixin],
  data() {
    return {
      user: {
        telephone: "",
        password: "",
        password_confirmation: "",
        name: "",
        email: ""
      },
      is_pwd: true,
      is_confirm_pwd: true,
      label_sigup: "SIGN UP",
      loading: false,
      has_logged_in: false,
      disabled: true,
      is_valid_email: false,
    };
  },
  computed: {
    validatePassword() {
      return this.user.password === this.user.password_confirmation
        ? true
        : false;
    },
    validateForm() {
      if (
        this.user.name !== "" &&
        this.user.telephone !== "" &&
        this.user.password !== "" &&
        this.user.password_confirmation === this.user.password
      ) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.disabled = false;
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.disabled = true;
      }
      return this.disabled;
    },
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      await this.$store
        .dispatch("auth/registerUser", this.user)
        .then((res) => {
          this.loading = false;
          if (res.status == 200) {
            this.$router.push("/auth/login");
            this.sendMessage("positive", res.data.message)
          } else if (res.status == 500) {
            this.sendMessage("negative", "Fail to create Account")
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    goBack() {
      this.is_user_exist = false;
    },
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
.page {
  background-color: $grey1;
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
  margin-top: 0.5rem;
  margin-bottom: .5rem;
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
}

.account_text {
  font-family: 'Roboto';
  font-style: normal;
  font-weight:500;
  font-size: 10px;
  color: $dark;
  text-transform: uppercase;
  line-height: 37px;
  float: right;

}
.bottom {
  margin-bottom: 2.5rem;
}
</style>
