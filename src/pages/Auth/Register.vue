<template>
  <q-page>
    <div class="q-pa-lg">
      <div class="row">
        <div class="col-4"></div>
        <div class="col-4">
          <q-card class="login_form">
            <q-card-section class="q-pt-xs">
              <div class="q-py-xs back_arrow_button" v-show="has_logged_in">
                <q-btn
                  class="material-icons back_arrow"
                  icon="arrow_back"
                  @click="goBack"
                  flat
                />
              </div>
              <div
                class="text_h6 text-center"
                :class="!has_logged_in ? 'q-pt-lg' : ''"
              >
                SIGN UP
              </div>
              <div class="text-subtitle2 text-center q-pt-sm">
                Sign up to get started to Financial-Assistant
              </div>
            </q-card-section>

            <q-card-section>
              <div class="q-pa-xs" style="width: 100%">
                <!-- register form -->
                <q-form @submit="onSubmit" class="q-gutter-md">
                  <div>
                    <label for="name" class="form_field">Name</label>
                    <q-input
                      v-model="user.name"
                      outlined
                      dense
                      type="text"
                      lazy-rules
                      :rules="[
                        (val) => (val && val.length > 0) || 'Name is required',
                      ]"
                    />
                  </div>
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
                      :type="is_pwd ? 'password' : 'text'"
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
                          :name="is_pwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="is_pwd = !is_pwd"
                        />
                      </template>
                    </q-input>
                  </div>
                  <div>
                    <label for="confirm_password" class="form_field"
                      >Confirm Password</label
                    >
                    <q-input
                      v-model="user.password_confirmation"
                      :type="is_confirm_pwd ? 'password' : 'text'"
                      outlined
                      dense
                      :rules="[
                        (val) =>
                          (val && val.length > 0) ||
                          'Confirm Password is required',
                      ]"
                      :error="!validatePassword"
                    >
                      <template v-slot:append>
                        <q-icon
                          :name="
                            is_confirm_pwd ? 'visibility_off' : 'visibility'
                          "
                          class="cursor-pointer"
                          @click="is_confirm_pwd = !is_confirm_pwd"
                        />
                      </template>
                      <template v-slot:error> Password mismatch </template>
                    </q-input>
                  </div>
                  <div>
                    <ButtonVue
                      class="form_button"
                      :label="label_sigup"
                      :loading="loading"
                      :disabled="validateForm"
                    >
                    </ButtonVue>
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
  mixins:[notificationMixin],
  data() {
    return {
      user: {
        telephone: "",
        password: "",
        password_confirmation: "",
        name: "",
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

.col-4 {
  display: block;
  width: 100%;
}

.login_form {
  // width: 100%;
  // display: block;
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
  margin-top: 0.5rem;
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
