<template>
  <q-page>
    <div class="q-pa-xl">
      <div class="row">
        <div class="col-4">
        </div>
        <div class="col-4">
          <q-card class="login_form">
            <q-card-section class="q-pt-xs">
              <div class="q-py-xs back_arrow_button" v-show="!has_logged_in">
                <q-btn class="material-icons back_arrow" icon="arrow_back" @click="goBack" flat />
              </div>
              <div class="text_h6 text-center" :class="has_logged_in? 'q-pt-lg':''">SIGN IN</div>
              <div class="text-subtitle2 text-center">Sign in to continue with Financial-Assistant</div>
            </q-card-section>

            <q-card-section>
              <div class="q-pa-xs" style="width: 100%">

                <!-- for first time loggedIn users -->
                <q-form @submit="onSubmit" class="q-gutter-md" v-show="!has_logged_in">
                  <div>
                    <label for="telephone" class="form_field">Telephone/E-mail</label>
                    <q-input v-model="user.telephone" outlined dense type="tel" />
                  </div>
                  <div v-show="is_user_exist">
                    <label for="password" class="form_field">Password</label>
                    <q-input v-model="user.password" :type="isPwd ? 'password' : 'text'" outlined dense>
                      <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                          @click="isPwd = !isPwd" />
                      </template>
                    </q-input>
                  </div>
                  <div v-show="is_user_exist">
                    <label for="confirm_password" class="form_field">Confirm Password</label>
                    <q-input v-model="user.confirm_password" :type="isPwd ? 'password' : 'text'" outlined dense>
                      <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                          @click="isPwd = !isPwd" />
                      </template>
                    </q-input>
                  </div>

                  <div v-show="!is_user_exist">
                    <ButtonVue class="form_button" :label="label_continue" :loading="loading"></ButtonVue>
                    <span class="forgot_password text-right">Forgot Password ?</span>
                  </div>
                  <div v-show="is_user_exist">
                    <ButtonVue class="form_button" :label="label_sigin" :loading="loading"></ButtonVue>
                    <span class="forgot_password text-right">Forgot Password ?</span>
                  </div>
                </q-form>

                <!-- for user who have already loggedIn -->
                <q-form @submit="onSubmit" class="q-gutter-md" v-show="has_logged_in">
                  <div>
                    <label for="telephone" class="form_field">Telephone/E-mail</label>
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
                    <ButtonVue class="form_button" :label="label_sigin" :loading="loading"></ButtonVue>
                    <span class="forgot_password text-right">Forgot Password ?</span>
                  </div>
                </q-form>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-4">
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>
import ButtonVue from 'src/components/Button.vue';
import sendMessage from 'src/helper/notification-service.js'
export default {
  name: 'PageIndex',
  data() {
    return {
      user: {
        telephone: '',
        password: '',
        confirm_password: ''
      },
      isPwd: true,
      label_continue: "CONTINUE",
      label_sigin: "SIGN IN",
      has_logged_in: false,
      is_user_exist: false,
      loading: false,
    }
  },
  methods: {
    onSubmit() {
      if (!this.has_logged_in) {
        this.loading = true;

        //call end point to check user
        this.is_user_exist = true
        //on success set has_logged_in to true
        setTimeout(() => {
          // delay simulated, we are done,
          // now restoring submit to its initial state
          this.loading = false
        }, 3000)
        sendMessage('success', 'success');

      } else {
        this.loading = true;
        // call endpoint to login user
        this.has_logged_in = true
        //sample case
        setTimeout(() => {
          // delay simulated, we are done,
          // now restoring submit to its initial state
          this.loading = false
        }, 3000)
        sendMessage('success', 'success');
      }
    },
    goBack() {
      this.is_user_exist = false
    },

  },
  components: {
    ButtonVue
  }
}
</script>

<style lang="scss" scoped>
.col-4 {
  display: block;
}

.login_form {
  width: 100%;
}

.back_arrow {
  font-size: .9rem;
  margin-left: 0;
  padding-left: 0;
}

.text_h6 {
  color: $dark;
  font-family: 'Roboto';
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
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.01em;
}

.form_field {
  font-family: 'Roboto';
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
  margin-top: .5rem;
  display: block;
  font-family: 'Roboto';
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
