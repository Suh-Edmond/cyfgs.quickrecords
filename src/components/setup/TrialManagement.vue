<template>
  <div>
    <div class="row q-px-sm flex flex-center" v-if="$q.platform.is.desktop">
      <div class="col-md-6 col-lg-6 col-sm-12 col-xs-12">
        <q-card flat>
          <q-card-section>
            <div class="text_h6 text-center q-pt-xs q-pb-sm">
              {{ $t("app.createSubscription") }}
            </div>

            <div class="q-pa-md">
              <q-form @submit="onSubmit" class="q-gutter-md">
                <div class="row q-gutter-x-md bg-grey-2">
                  <div class="col">
                    <q-list>
                      <q-item
                        v-ripple
                        v-for="(feature, index) in featuresFirstFour"
                        ,
                        :key="index"
                      >
                        <q-item-section avatar>
                          <q-icon
                            :color="
                              feature.requires_subscription
                                ? 'negative'
                                : 'secondary'
                            "
                            text-color="white"
                            :name="
                              feature.requires_subscription ? 'cancel' : 'done'
                            "
                            size="sm"
                          />
                        </q-item-section>
                        <q-item-section>{{ feature.name }}</q-item-section>
                      </q-item>
                    </q-list>
                  </div>

                  <div class="col">
                    <q-list>
                      <q-item
                        v-ripple
                        v-for="(feature, index) in featuresLastFour"
                        ,
                        :key="index"
                      >
                        <q-item-section avatar>
                          <q-icon
                            :color="
                              feature.requires_subscription
                                ? 'negative'
                                : 'secondary'
                            "
                            text-color="white"
                            :name="
                              feature.requires_subscription ? 'cancel' : 'done'
                            "
                            size="sm"
                          />
                        </q-item-section>
                        <q-item-section>{{ feature.name }}</q-item-section>
                      </q-item>
                    </q-list>
                  </div>
                </div>
                <div class="q-pt-lg">
                  <q-list bordered class="subscription month_subscription">
                    <q-item class="q-py-md" clickable>
                      <q-item-section>
                        <q-item-label class="text-bold">{{
                          $t("app.monthlyPlan")
                        }}</q-item-label>
                        <q-item-label caption class="text-weight-bold"
                          >{{ $t("app.trialPlanCaption") }}
                          {{ Number(getMonthlyPlan).toLocaleString() }}
                          XAF/{{ $t("app.month") }}</q-item-label
                        >
                      </q-item-section>

                      <q-item-section side top>
                        <q-item-label caption
                          ><q-badge color="warning">
                            {{ $t("app.basicValue") }}
                          </q-badge></q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <div class="q-py-lg">
                  <q-btn
                    class="form_button"
                    :label="$t('app.startTrial')"
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
                <div class="row justify-end"></div>
              </q-form>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-card flat class="card" v-if="$q.platform.is.mobile">
      <q-card-section>
        <div class="text_h6 text-center q-pt-xs q-pb-sm">
          {{ $t("app.createSubscription") }}
        </div>

        <q-form @submit="onSubmit">
          <q-list class="fll-width bg-grey-2">
            <q-item
              v-ripple
              v-for="(feature, index) in featuresFirstFour"
              ,
              :key="index"
            >
              <q-item-section avatar>
                <q-icon
                  :color="
                    feature.requires_subscription ? 'negative' : 'secondary'
                  "
                  text-color="white"
                  :name="feature.requires_subscription ? 'cancel' : 'done'"
                  size="sm"
                />
              </q-item-section>
              <q-item-section>{{ feature.name }}</q-item-section>
            </q-item>
          </q-list>
          <q-list class="bg-grey-2">
            <q-item
              v-ripple
              v-for="(feature, index) in featuresLastFour"
              ,
              :key="index"
            >
              <q-item-section avatar>
                <q-icon
                  :color="
                    feature.requires_subscription ? 'negative' : 'secondary'
                  "
                  text-color="white"
                  :name="feature.requires_subscription ? 'cancel' : 'done'"
                  size="sm"
                />
              </q-item-section>
              <q-item-section>{{ feature.name }}</q-item-section>
            </q-item>
          </q-list>
          <q-list bordered class="subscription month_subscription">
            <q-item class="q-py-md" clickable>
              <q-item-section>
                <q-item-label class="text-bold">{{
                  $t("app.monthPlan")
                }}</q-item-label>
                <q-item-label caption class="text-weight-bold"
                  >{{ $t("app.trialPlanCaption") }}
                  {{ Number(getMonthlyPlan).toLocaleString() }}
                  XAF/{{ $t("app.month") }}</q-item-label
                >
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption
                  ><q-badge color="warning">
                    {{ $t("app.basicValue") }}
                  </q-badge></q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
          <q-btn
            class="form_button"
            :label="$t('app.startTrial')"
            :loading="loading"
            :disabled="false"
            color="primary"
            no-caps
            type="submit"
          >
          </q-btn>
        </q-form>
      </q-card-section>
    </q-card>
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
  emits: ["onMakePayment", "onStartTrial", "setProgressBar"],
  computed: {
    getMonthlyPlan() {
      return this.defaultSubPlan.price;
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
        referral_code: null,
        is_trial: true,
        loginId: LocalStorage.getItem("loginId"),
        auto_renewal: false,
      };
      let payload = {
        url: "/api/protected/init/subscriptions/trial",
        data: data,
        msg: "Subscription trail activated successfully",
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
          if (res.status === 400) {
            Notify.create({
              type: "info",
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
              billing_duration: res.data.data.billing_duration,
            };
            subscriptions.push(subscription);
            LocalStorage.set("subscriptions", JSON.stringify(subscriptions));

            this.$store.commit("SET_PROCESS_STEP", {
              processStatus: ProcessStatusVue.COMPLETE_SETUP,
              step: 7,
              isSuccessful: true,
            });
            this.$emit("onStartTrial");
          }
        })
        .catch((e) => {})
        .finally(() => {
          this.loading = false;
        });
    },

    onMakePaymentToPackage() {
      this.$store.commit("SET_PROCESS_STEP", {
        processStatus: ProcessStatusVue.MAKE_PAYMENT,
        step: 6,
        isSuccessful: true,
        isTrial: false,
      });
      this.$emit("onMakePaymentToPackage");
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
      this.$q.loading.show();
      this.$emit("setProgressBar", true);
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          if (res.success) {
            this.defaultSubPlan = res.data.find(
              (e) => e.billing_cycle === "monthly"
            );
          }
        })
        .finally(() => {
          this.$emit("setProgressBar", false);
          this.$q.loading.hide();
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
  margin-top: 20px;
  margin-bottom: 10px;
}

.subscription {
  border-radius: 10px;
}

.card {
  margin-bottom: 10px;
}

.bottom {
  margin-bottom: 2.5rem;
}

.month_subscription {
  border: 2px solid $primary;
  border-radius: 8px;
  margin-top: 10px;
}
</style>
