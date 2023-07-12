<template>
  <q-page class="page">
    <div class="row q-px-sm" :class="$q.screen.lg ? 'q-pt-lg flex flex-center' : 'q-pt-sm'">
      <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12">
        <q-card :class="$q.screen.lg ? 'q-mt-lg' : 'q-mt-md q-mb-xl'">
          <q-card-section>
            <div class="text_h6 text-center q-pt-sm q-pb-sm">SIGN IN</div>
            <div class="text-subtitle2 text-center q-pb-xs">
              Sign in to continue to Financial Assistant
            </div>
            <q-form @submit="onSubmit" class="q-gutter-md q-mt-lg q-px-md">
              <div>
                <label for="credential" class="form_field">Telephone <span class="text-red">*</span></label>
                <q-input v-model="user.credential" outlined dense type="tel" mask="(+###) ### - ### - ###" unmasked-value
                  hint="Example: (+237) ### - ### - ###" />
              </div>
              <div>
                <label for="password" class="form_field">Password <span class="text-red">*</span></label>
                <q-input v-model="user.password" :type="isPwd ? 'password' : 'text'" outlined dense>
                  <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd = !isPwd" />
                  </template>
                </q-input>
              </div>
              <div class="q-mt-lg">
                <q-btn class="form_button q-pa-xs" :label="label_sigin" :loading="loading" :disabled="validateLogin"
                  :color="color" :no_caps="no_caps" type="submit">
                  <q-icon name="arrow_forward" size="xs" class="q-pl-lg"></q-icon>
                </q-btn>
                <span class="forgot_password text-right">Forgot Password ?</span>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import organisationMixin from "src/mixins/organisationMixin.vue";
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import UserSavingMixinVue from "src/mixins/UserSavingMixin.vue";
import ContributionsMixinVue from 'src/mixins/ContributionsMixin.vue';

export default {
  name: "PageIndex",
  mixins: [
    organisationMixin,
    CurrentYearMixinVue,
    memberMixinVue,
    UserSavingMixinVue,
    ContributionsMixinVue
  ],
  data() {
    return {
      user: {
        password: null,
        password_confirmation: null,
        credential: null,
      },
      isPwd: true,
      label_sigin: "SIGN IN",
      loading: false,
      color: "primary",
      no_caps: true,
    };
  },
  computed: {
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
    onSubmit() {
      this.loading = true;
      let payload = {
        url: "/api/public/auth/login",
        data: {
          telephone: this.user.credential,
          password: this.user.password,
        },
        msg: "Login Successful",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: "Invalid Credentials! Please try again",
        to_be_store_data: {
          required: true,
          has_value: false,
          data: [{ key: "data", value: null }],
        },
      };
      this.$store
        .dispatch("postRequest", payload)
        .then(() => {
          let payload = {
            status: "none",
            url: "/api/protected/organisation-info",
            has_path_val: true,
            show_feedback: false,
            msg: "none",
            color: "default",
            error_msg: "default",
            to_on_ok: "none",
            commit: "SET_ORGANISATION",
            has_commit: true,
            to_be_store_data: {
              required: true,
              has_value: false,
              data: null,
            },
          };
          this.$store
            .dispatch("getRequest", payload)
            .then((res) => {
              this.fetchCurrentYear();
              this.getOrganisationMembers(res.data.id);
              this.getUserByRegistrationStatus(res.data.id);
              this.getUserByRegistration(res.data.id);
              this.$router.push({
                name: "dashboard",
              });
            })
            .catch(() => {
              this.$router.push({
                name: "create_organisation",
              });
            }).finally(() => {
              this.getOrganisationMemberSavings(this.$store.getters.getOrganisation.id);
              this.getTotalContributionByYear( this.$store.getters.getCurrentYear != null ? this.$store.getters.getCurrentYear.id :"");
            });
        })
        .catch(() => { })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  components: {},
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

.form_button {
  width: 100%;
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
</style>
