<template>
  <div
    class="row q-px-sm flex flex-center"
    :class="$q.screen.lg ? 'q-pt-xl flex flex-center' : 'q-pt-sm'"
  >
    <div class="col-md-6 col-lg-6 col-sm-12 col-xs-12">
      <q-card flat>
        <q-card-section>
          <div class="text_h6 text-center q-pt-xs q-pb-sm">
            {{ $t("app.createSubscription") }}
          </div>

          <div class="q-pa-md">
            <q-form @submit="onSubmit" class="q-gutter-md">
              <div class="row q-gutter-x-md bg-grey-2">
                <div class="col-md-6">
                  <q-list>
                    <q-item
                      v-ripple
                      v-for="(feature, index) in featuresFirstFour"
                      ,
                      :key="index"
                    >
                      <q-item-section avatar>
                        <q-icon
                          color="secondary"
                          text-color="white"
                          name="done"
                          size="sm"
                        />
                      </q-item-section>
                      <q-item-section>{{ feature }}</q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <div class="col-md-6">
                  <q-list>
                    <q-item
                      v-ripple
                      v-for="(feature, index) in featuresLastFour"
                      ,
                      :key="index"
                    >
                      <q-item-section avatar>
                        <q-icon
                          color="secondary"
                          text-color="white"
                          name="done"
                          size="sm"
                        />
                      </q-item-section>
                      <q-item-section>{{ feature }}</q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>

              <div class="q-pt-md">
                <q-list bordered class="subscription">
                  <q-item
                    class="q-py-md"
                    :class="
                      defaultSubPlan.billing_cycle === 'yearly'
                        ? 'yearly_subscription'
                        : ''
                    "
                    clickable
                    @click="onSelectSubPlan('yearly')"
                  >
                    <q-item-section>
                      <q-item-label class="text-bold">Yearly</q-item-label>
                      <q-item-label caption class="text-weight-bold"
                        >Three months free Trial - Then
                        {{ Number(getYearlyPlan).toLocaleString() }}
                        XAF/Year</q-item-label
                      >
                    </q-item-section>

                    <q-item-section side top>
                      <q-item-label caption
                        ><q-badge color="secondary">
                          Best value
                        </q-badge></q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="q-pt-md">
                <q-list
                  bordered
                  class="subscription"
                  :class="
                    defaultSubPlan.billing_cycle === 'monthly'
                      ? 'month_subscription'
                      : ''
                  "
                >
                  <q-item
                    class="q-py-md"
                    clickable
                    @click="onSelectSubPlan('monthly')"
                  >
                    <q-item-section>
                      <q-item-label class="text-bold">Monthly</q-item-label>
                      <q-item-label caption class="text-weight-bold"
                        >One month free Trial - Then
                        {{ Number(getMonthlyPlan).toLocaleString() }}
                        XAF/Month</q-item-label
                      >
                    </q-item-section>

                    <q-item-section side top>
                      <q-item-label caption
                        ><q-badge color="warning">
                          Basic value
                        </q-badge></q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div class="q-py-md">
                <label class="form_field">{{ $t("app.couponCode") }} </label>
                <q-input
                  v-model="subscription.referral_code"
                  outlined
                  dense
                  type="text"
                />

                <q-tooltip anchor="top middle" self="top middle">
                  {{ $t("app.referralCodeCaption") }}
                </q-tooltip>
              </div>

              <div class="q-pt-xs">
                <q-btn
                  class="form_button"
                  :label="$t('app.saveSubscriptionBtnLabel')"
                  :loading="loading"
                  :disabled="false"
                  color="primary"
                  no-caps
                  type="submit"
                >
                  <q-icon
                    name="arrow_forward"
                    size="xs"
                    class="q-pl-lg"
                  ></q-icon>
                </q-btn>
              </div>
              <div class="row justify-between q-pt-md">
                <q-btn
                  outline
                  rounded
                  @click="onContinueWithTrial()"
                  color="primary"
                  no-caps
                  :label="$t('app.continuetrialLink')"
                />

                <q-btn
                  outline
                  rounded
                  @click="onbacK()"
                  color="primary"
                  no-caps
                  :label="$t('app.backToOrganisation')"
                />
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { LocalStorage, Notify, Platform } from "quasar";
import ProcessStatusVue from "../Constants/ProcessStatus.vue";
import { APP_FEATURES_EN, APP_FEATURES_FR } from "../../utils/app-features";
export default {
  name: "PageIndex",
  mounted() {
    this.getSubscriptionPlans();
  },
  data() {
    return {
      subscription: {
        subscription_plan_id: null,
        organisation_id: null,
        referral_code: null,
        is_trial: null,
        login_id: null,
        auto_renewal: null,
      },
      loading: false,
      defaultSubPlan: {},
      color: "primary",
      features:
        this.$i18n.locale === "en-US" ? APP_FEATURES_EN : APP_FEATURES_FR,
    };
  },
  emits: [
    "onMakePayment",
    "onContinueTrial",
    "onBackToOrganisation",
    "setProgressBar",
  ],
  computed: {
    getYearlyPlan() {
      const yearlyPlan = this.$store.getters.getSubscriptionPlans.find(
        (e) => e.billing_cycle == "yearly"
      );
      if (!yearlyPlan) {
        return 0;
      }
      return yearlyPlan.price;
    },

    getMonthlyPlan() {
      const yearlyPlan = this.$store.getters.getSubscriptionPlans.find(
        (e) => e.billing_cycle === "monthly"
      );
      if (!yearlyPlan) {
        return 0;
      }
      return yearlyPlan.price;
    },

    featuresFirstFour() {
      return this.features.slice(0, 6);
    },
    featuresLastFour() {
      return this.features.slice(6);
    },
  },
  methods: {
    onSubmit() {
      const data = {
        subscription_plan_id: this.defaultSubPlan.id,
        organisation_id: LocalStorage.getItem("organisationId"),
        referral_code: this.subscription.referral_code,
        is_trial: true,
        login_id: LocalStorage.getItem("loginId"),
        auto_renewal: false,
      };
      let payload = {
        url: "/api/protected/init/subscriptions",
        data: data,
        msg: "Subscription createde successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "default",
        show_feedback: true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then((res) => {
          if (res.status === 422) {
            Notify.create({
              type: "negative",
              message: res.data.message,
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
          if (res.status === 200) {
            let subscriptions = [];
            const subscription = {
              id: res.data.data.id,
              organisation: res.data.data.organisation,
              subscription_plan: res.data.data.subscription_plan,
              auto_renewal: res.data.data.auto_renewal,
              referral_code_discount: res.data.data.referral_code_discount,
              current_period_start_date:
                res.data.data.current_period_start_date,
              current_period_end_date: res.data.data.current_period_end_date,
              status: res.data.data.status,
              trial_period_end_date: res.data.data.trial_period_end_date,
              trial_period_start_date: res.data.data.trial_period_start_date,
              is_trail: res.data.data.is_trail,
              login_id: res.data.data.login_id,
            };
            subscriptions.push(subscription);
            LocalStorage.set("subscriptions", JSON.stringify(subscriptions));

            this.$store.commit("SET_PROCESS_STEP", {
              processStatus: ProcessStatusVue.MAKE_PAYMENT,
              step: 6,
              isSuccessful: true,
            });
            this.$emit("onMakePayment");
          }
        })
        .catch((e) => {})
        .finally(() => {
          this.loading = false;
        });
    },

    onContinueWithTrial() {
      this.$store.commit("SET_PROCESS_STEP", {
        processStatus: ProcessStatusVue.IN_TRIAL,
        step: 5,
        isSuccessful: true,
        isTrial: true,
      });
      this.subscription.is_trial = true;
      this.$emit("onContinueTrial");
    },

    onSelectSubPlan(plan) {
      const selectedPlan = this.$store.getters.getSubscriptionPlans.find(
        (e) => e.billing_cycle === plan
      );
      this.defaultSubPlan = selectedPlan;
    },

    onbacK() {
      this.$store.commit("SET_PROCESS_STEP", {
        processStatus: ProcessStatusVue.CREATE_ORGANISATION,
        step: 3,
        isSuccessful: true,
        isTrial: false,
      });
      this.$emit("onBackToOrganisation");
    },

    getSubscriptionPlans() {
      let payload = {
        status: "none",
        url: "/api/public/subscription-plans",
        has_path_val: true,
        show_feedback: false,
        msg: "default",
        color: "default",
        error_msg: "default",
        commit: "SET_SUBSCRIPTION_PLAN",
        has_commit: true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: null,
        },
      };
      this.$emit("setProgressBar", true);
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          if (res.success) {
            this.defaultSubPlan = res.data.find(
              (e) => e.billing_cycle === "yearly"
            );
          }
        })
        .finally(() => {
          this.$emit("setProgressBar", false);
        });
    },
  },
  components: {},
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
  font-weight: 800;
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
}

.subscription {
  border-radius: 10px;
}

.sign_link {
  text-decoration: none;
  color: $primary;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.bottom {
  margin-bottom: 2.5rem;
}

.yearly_subscription {
  border: 2px solid $primary;
  border-radius: 8px;
}

.month_subscription {
  border: 2px solid $primary;
  border-radius: 8px;
}
</style>
