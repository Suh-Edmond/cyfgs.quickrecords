<template>
  <q-page>
    <div class="q-pa-xl">
      <div class="row">
        <div class="col-4"></div>
        <div class="col-4">
          <q-card class="login_form">
            <q-card-section class="q-pt-xs">
              <div class="q-py-xs back_arrow_button" v-show="!has_logged_in">
                <q-btn
                  class="material-icons back_arrow"
                  icon="arrow_back"
                  @click="goBack"
                  flat
                />
              </div>
              <div
                class="text_h6 text-center"
                :class="has_logged_in ? 'q-pt-lg' : ''"
              >
                SIGN IN
              </div>
              <div class="text-subtitle2 text-center q-pt-sm">
                Sign in to continue to Financial-Assistant
              </div>
            </q-card-section>

            <q-card-section>
              <div class="q-pa-xs" style="width: 100%">
                <!-- for user who have already loggedIn -->
                <q-form
                  @submit="onSubmit"
                  class="q-gutter-md"
                >
                  <div>
                    <label for="telephone" class="form_field">Telephone</label>
                    <q-input
                      v-model="user.telephone"
                      outlined
                      dense
                      type="tel"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Telephone is required',
                      ]"
                    />
                  </div>
                  <div>
                    <label for="password" class="form_field">Password</label>
                    <q-input
                      v-model="user.password"
                      :type="isPwd ? 'password' : 'text'"
                      outlined
                      dense
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Password is required',
                      ]"
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
                  <div v-show="is_user_exist">
                    <label for="confirm_password" class="form_field"
                      >Confirm Password</label
                    >
                    <q-input
                      v-model="user.confirm_password"
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
                    <ButtonVue
                      class="form_button"
                      :label="label_sigin"
                      :loading="loading"
                      :disabled="validateForm"
                    ></ButtonVue>
                    <span class="forgot_password text-right"
                      >Forgot Password ?</span
                    >
                  </div>
                  <div>
                    <ButtonVue
                      class="form_button"
                      :label="label_continue"
                      :loading="loading"
                      :disabled="false"
                    ></ButtonVue>
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
        confirm_password: "",
      },
      isPwd: true,
      label_continue: "CONTINUE",
      label_sigin: "SIGN IN",
      is_user_exist: false,
      loading: false,
      disabled: false,
      has_logged_in: true,
    };
  },
  computed: {
    validateForm() {
    return false;
    },
  },
  methods: {
    onSubmit() {
      this.loading = true;
      this.$store
        .dispatch("auth/loginUser", this.user)
        .then((response) => {
          if (response.status == 200) {
            this.sendMessage("positive", "Login Successful");
            this.$router.push("/user/dashboard");
          } else if (response.status == 401) {
            this.sendMessage("negative", "Login Failed!  Invalid Credentials ");
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
