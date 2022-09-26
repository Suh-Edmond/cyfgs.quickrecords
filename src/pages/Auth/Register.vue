<template>
  <q-page>
    <div class="q-pa-xl">
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
              <div class="text-subtitle2 text-center">
                Sign up to get started with Financial-Assistant
              </div>
            </q-card-section>

            <q-card-section>
              <div class="q-pa-xs" style="width: 100%">
                <!-- register form -->
                <q-form @submit="onSubmit" class="q-gutter-md">
                  <div>
                    <label for="name" class="form_field">Name</label>
                    <q-input v-model="user.name" outlined dense type="text" />
                  </div>
                  <div>
                    <label for="telephone" class="form_field"
                      >Telephone/E-mail</label
                    >
                    <q-input
                      v-model="user.telephone"
                      outlined
                      dense
                      type="tel"
                    />
                  </div>
                  <div>
                    <label for="password" class="form_field">Password</label>
                    <q-input
                      v-model="user.password"
                      :type="is_pwd ? 'password' : 'text'"
                      outlined
                      dense
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
                      v-model="user.confirm_password"
                      :type="is_confirm_pwd ? 'password' : 'text'"
                      outlined
                      dense
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
                    </q-input>
                  </div>
                  <div>
                    <ButtonVue
                      class="form_button"
                      :label="label_sigup"
                      :loading="loading"
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
export default {
  name: "PageIndex",
  data() {
    return {
      user: {
        telephone: "",
        password: "",
        confirm_password: "",
        name: "",
      },
      is_pwd: true,
      is_confirm_pwd: true,
      label_sigup: "SIGN UP",
      loading: false,
      has_logged_in: false,
    };
  },
  methods: {
    onSubmit() {
      this.loading = true;
      // call endpoint to login user
      this.has_logged_in = true;
      //sample case
      setTimeout(() => {
        // delay simulated, we are done,
        // now restoring submit to its initial state
        this.loading = false;
        this.$router.push("/auth/login");
      }, 3000);
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
