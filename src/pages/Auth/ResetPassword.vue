<template>
  <q-page class="page">
    <div class="row q-px-md" :class="$q.screen.lg ? 'q-pt-lg flex flex-center' : 'q-pt-sm'">
      <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12">
        <q-card :class="$q.screen.lg ? 'q-mt-lg' : 'q-mt-md q-mb-xl'">
          <!-------------------------PASSWORD RESET TOKEN-------------------------------->
          <q-card-section v-show="show_new_password_form">
            <div class="text_h6 text-center q-pt-sm q-pb-sm">{{ $t('app.passwordResetToken') }}</div>
            <div class="text-subtitle2 text-center q-pb-xs">
              {{ $t('app.passwordResetTokenCap') }}
            </div>

            <q-form @submit="onSubmitPasswordResetToken" class="q-gutter-md q-mt-md q-px-md">
              <div>
                <label for="credential" class="form_field">{{ $t('app.token') }} <span class="text-red">*</span></label>
                <q-input v-model="token" outlined dense type="text" disable>
                </q-input>
              </div>
              <div class="q-mb-xl q-mt-lg">
                <q-btn class="form_button q-pa-xs" :label="label" :loading="loading" :color="'primary'" no-caps
                  type="submit">
                  <q-icon name="arrow_forward" size="xs" class="q-pl-lg"></q-icon>
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
          <!------------------------------END OF PASSWORD RESET TOKEN FORM------------------------->

          <q-card-section v-show="!show_new_password_form">
            <div class="text_h6 text-center q-pt-sm q-pb-sm">{{ $t('app.resetPasswordMsg') }}</div>
            <div class="text-subtitle2 text-center q-pb-xs">
              {{ $t('app.resetCap') }}
            </div>
            <q-form @submit="onSubmitNewPassword" class="q-gutter-md q-mt-md q-px-md">
              <div>
                <label for="credential" class="form_field">{{ $t('app.newPassword') }} <span
                    class="text-red">*</span></label>
                <q-input v-model="user.new_password" :type="isPwd ? 'password' : 'text'" outlined dense>
                  <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd = !isPwd" />
                  </template>
                </q-input>
              </div>
              <div>
                <label for="credential" class="form_field">{{ $t('app.confirmPasword') }} <span
                    class="text-red">*</span></label>
                <q-input v-model="user.confirm_password" :type="isConfirmPwd ? 'password' : 'text'" outlined dense>
                  <template v-slot:append>
                    <q-icon :name="isConfirmPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isConfirmPwd = !isConfirmPwd" />
                  </template>
                </q-input>
              </div>
              <div class="q-mb-xl q-mt-lg">
                <q-btn class="form_button q-pa-xs" :label="this.$t('app.saveBtnLabel')" :loading="loading"  :disabled="validatePassword"
                  :color="'primary'" no-caps type="submit">
                  <q-icon name="arrow_forward" size="xs" class="q-pl-lg"></q-icon>
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      token: this.$route.query.token,
      label: this.$t('app.submit'),
      loading: false,
      show_new_password_form: true,
      isPwd: true,
      isConfirmPwd: true,
      user: {
        confirm_password: null,
        new_password: null
      }
    };
  },
  computed: {
    validatePassword(){
      return this.user.password !== this.user.confirm_password
    }
  },
  methods: {
    onSubmitPasswordResetToken() {
      let payload = {
        url: "/api/public/auth/validate/password-reset",
        data: {
          token: this.token,
        },
        msg: this.$t('app.successResetTokenMsg'),
        color: "default",
        show_feedback: true,
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: this.$t('app.invalidTokenMsg'),
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [
          ],
        },
      };
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then((res) => {
          res.status === 200 ? this.show_new_password_form = false : this.show_new_password_form = true;
        })
        .catch((error) => {
        })
        .finally(() => {
          this.loading = false;
        });
    },

    onSubmitNewPassword() {

    }
  },
  components: {

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
  font-size: 12px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.tokenMsg {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 17px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
}

.form_button {
  width: 100%;
  margin-bottom: 0.1rem;
}

.check_icon {
  font-size: 4rem;
  color: $positive;
}

.passwordCaption {
  color: $grey2;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
}
</style>
