<template>
  <div class="row q-pb-lg flex flex-center">
    <div class="col-md-6 col-lg-6 col-sm-12 col-xs-12">
      <q-card flat bordered>
        <q-card-section class="bg-indigo-1 row justify-between">
          <div>
            <div class="text_h6 q-pt-xs q-pb-sm row justify-start text-black">
              {{ $t("app.currentSubscription") }}
            </div>
            <div class="q-pb-sm summaryCaption">
              {{ $t("app.currentSubscriptionCaption") }}
            </div>
          </div>
          <div
            class="items-end"
            v-if="getSubscriptionPlan.billing_cycle === 'yearly'"
          >
            <div class="text_h6 q-pt-xs q-pb-sm row justify-start text-black">
              {{ $t("app.yearlyPlan") }}
            </div>
            <div class="q-pb-sm summaryCaption">
              {{ Number(getSubscriptionPlan.price).toLocaleString() }} XAF
            </div>
          </div>
          <div
            class="items-end"
            v-if="getSubscriptionPlan.billing_cycle === 'monthly'"
          >
            <div class="text_h6 q-pt-xs q-pb-sm row justify-start text-black">
              {{ $t("app.monthlyPlan") }}
            </div>
            <div class="q-pb-sm summaryCaption">
              {{ Number(getSubscriptionPlan.price).toLocaleString() }} XAF
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div
            class="bg-green-1 rounded-borders"
            v-if="getSubscriptionStatus === 'active'"
          >
            <q-list bordered class="rounded-borders">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar
                    color="secondary"
                    text-color="white"
                    icon="done"
                    size="sm"
                  />
                </q-item-section>

                <q-item-section class="q-pa-xs">
                  <q-item-label lines="1" class="text-weight-bold">{{
                    $t("app.subscriptionActive")
                  }}</q-item-label>
                  <q-item-label lines="2">
                    {{ $t("app.packagesubscription") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div
            class="bg-deep-orange-1 rounded-borders"
            v-if="getSubscriptionStatus === 'trialing'"
          >
            <q-list bordered class="rounded-borders">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar
                    color="warning"
                    text-color="white"
                    icon="exclamation"
                    size="sm"
                  />
                </q-item-section>

                <q-item-section class="q-pa-xs">
                  <q-item-label lines="1" class="text-weight-bold">{{
                    $t("app.trailingSubscription")
                  }}</q-item-label>
                  <q-item-label lines="2">
                    {{ $t("app.trialingSubscriptionCaption") }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    flat
                    :label="$t('app.makePaymentBtnLabel')"
                    color="primary"
                    no-caps
                    @click="makeSubscriptionPayment()"
                  >
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-6 col-md-6 col-lg-6 col-xs-12 col-sm-12">
              <div class="text_h6 flex justify-start q-pl-md q-pb-sm">
                {{ $t("app.planFeatures") }}
              </div>
              <q-list>
                <q-item
                  v-ripple
                  v-for="(feature, index) in features"
                  dense
                  :key="index"
                >
                  <q-item-section avatar>
                    <q-icon
                      color="secondary"
                      text-color="white"
                      name="done"
                      size="xs"
                    />
                  </q-item-section>
                  <q-item-section>{{ feature }}</q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="col-6 col-md-6 col-lg-6 col-xs-12 col-sm-12">
              <div class="text_h6 flex justify-start q-pb-sm">
                {{ $t("app.billingInformation") }}
              </div>
              <div class="q-pt-sm bill_info row justify-between">
                <label class="billing_field"
                  >{{ $t("app.organisationName") }}
                </label>
                <label class="billing_field text-weight-bold"
                  >{{ getOrganisation.name }}
                </label>
              </div>

              <div class="bill_info row justify-between">
                <label class="billing_field"
                  >{{ $t("app.billingCycle") }}
                </label>
                <label class="billing_field text-weight-bold"
                  >{{ getSubscriptionPlan.billing_cycle }}
                </label>
              </div>

              <div class="bill_info row justify-between">
                <label class="billing_field">{{ $t("app.amount") }} </label>
                <label class="billing_field text-weight-bold">
                  {{ Number(getSubscriptionPlan.price).toLocaleString() }} XAF
                </label>
              </div>
              <div class="bill_info row justify-between">
                <label class="billing_field"
                  >{{ $t("app.billingDuration") }}
                </label>
                <label class="billing_field text-weight-bold">
                  {{ getSubscription.billing_duration }}</label
                >
              </div>

              <div class="bill_info row justify-between">
                <label class="billing_field"
                  >{{ $t("app.referralCodeDiscountLabel") }}
                </label>
                <label class="billing_field text-weight-bold">
                  {{ getSubscription.referral_code_discount }}
                </label>
              </div>

              <div class="bill_info row justify-between">
                <label class="billing_field"
                  >{{ $t("app.nextBilling") }}
                </label>
                <label class="billing_field text-weight-bold"
                  >{{ getFormatDate(getNextBillingDate) }}
                </label>
              </div>

              <div v-if="getSubscription.status === 'active'">
                <div class="bill_info row justify-between">
                  <label class="billing_field"
                    >{{ $t("app.subscriptionStart") }}
                  </label>
                  <label class="billing_field text-weight-bold"
                    >{{
                      getFormatDate(getSubscription.current_period_start_date)
                    }}
                  </label>
                </div>

                <div class="bill_info row justify-between">
                  <label class="billing_field"
                    >{{ $t("app.subscriptionEnd") }}
                  </label>
                  <label class="billing_field text-weight-bold"
                    >{{
                      getFormatDate(getSubscription.current_period_end_date)
                    }}
                  </label>
                </div>
              </div>

              <div v-if="getSubscription.status === 'trialing'">
                <div class="bill_info row justify-between">
                  <label class="billing_field"
                    >{{ $t("app.trialingStart") }}
                  </label>
                  <label class="billing_field text-weight-bold"
                    >{{
                      getFormatDate(getSubscription.trial_period_start_date)
                    }}
                  </label>
                </div>

                <div class="bill_info row justify-between">
                  <label class="billing_field"
                    >{{ $t("app.trialingEnd") }}
                  </label>
                  <label class="billing_field text-weight-bold"
                    >{{ getFormatDate(getSubscription.trial_period_end_date) }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="row justify-center q-py-lg">
          <div class="q-py-lg">
            <q-btn
              to="/auth/login"
              class="form_button full-width q-px-lg"
              :label="$t('app.loginToQuickRecords')"
              color="primary"
              no-caps
              type="submit"
            >
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { LocalStorage } from "quasar";
import moment from "moment";
export default {
  name: "PageIndex",
  mounted() {},
  data() {
    return {
      defaultSubPlan: {},
      color: "primary",
      features: [
        "User Management",
        "Income Management",
        "Expenditure Management",
        "Contributions",
        "Reports and Statistics",
        "Balance Sheets",
        "Logs and Tracability",
        "Security and Secure Storage",
      ],
      userSubscriptions: JSON.parse(LocalStorage.getItem("subscriptions")),
    };
  },
  emits: ["onMakePayment"],
  computed: {
    getSubscriptionPlan() {
      if (this.userSubscriptions === null) {
        return;
      }
      return this.userSubscriptions[0].subscription_plan;
    },
    getSubscriptionStatus() {
      if (this.userSubscriptions === null) {
        return;
      }
      return this.userSubscriptions[0].status;
    },
    getOrganisation() {
      if (this.userSubscriptions === null) {
        return;
      }
      return this.userSubscriptions[0].organisation;
    },
    getSubscription() {
      if (this.userSubscriptions === null) {
        return;
      }
      return this.userSubscriptions[0];
    },
    getNextBillingDate() {
      const currentDate = new Date();
      console.log(this.getSubscription);

      if (this.getSubscription.subscription_plan.billing_cycle === "monthly") {
        console.log("enter");

        currentDate.setMonth(
          currentDate.getMonth() + this.getSubscription.billing_duration
        );
      } else {
        currentDate.setMonth(
          currentDate.getFullYear() + this.getSubscription.billing_duration
        );
      }

      console.log(currentDate);

      return currentDate;
    },
  },
  methods: {
    getFormatDate(date) {
      return moment(date).format("MMMM Do YYYY");
    },
    makeSubscriptionPayment() {
      this.$store.commit("SET_PROCESS_STEP", {
        processStatus: ProcessStatusVue.MAKE_PAYMENT,
        step: 6,
        isSuccessful: true,
      });
      this.$emit("onMakePayment");
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

.billing_field {
  font-family: "Roboto";
  font-style: normal;

  font-size: 14px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $dark;
}

.bill_info {
  margin-bottom: 0.7rem;
}
</style>
