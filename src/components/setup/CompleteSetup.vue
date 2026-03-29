<template>
  <div class="row flex flex-center">
    <div class="col-md-8 col-lg-8 col-sm-12 col-xs-12">
      <q-card flat bordered>
        <q-card-section class="bg-indigo-1">
          <trial-header :subscriptionPlan="getSubscriptionPlan"></trial-header>
        </q-card-section>

        <q-card-section>
          <trial-banner
            :subscription="getSubscription"
            :subscriptionStatus="getSubscriptionStatus"
          ></trial-banner>
        </q-card-section>
        <q-card-section>
          <account-completed-in-trial
            :features="features"
            :organisation="getOrganisation"
            :subscription="getSubscription"
          ></account-completed-in-trial>
        </q-card-section>
        <q-card-section class="row justify-center q-py-lg">
          <div>
            <q-btn
              to="/auth/login"
              class="form_button q-py-sm"
              :label="$t('app.loginToQuickRecords')"
              color="primary"
              no-caps
              type="submit"
              @click="completedSetup()"
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
import AccountCompletedInTrial from "./AccountCompletedInTrial.vue";
import TrialBanner from "./TrialBanner.vue";
import TrialHeader from "./TrialHeader.vue";
import { APP_FEATURES_EN, APP_FEATURES_FR } from "../../utils/app-features";
export default {
  name: "PageIndex",
  mounted() {},
  data() {
    return {
      defaultSubPlan: {},
      color: "primary",
      features:
        this.$i18n.locale === "en-US" ? APP_FEATURES_EN : APP_FEATURES_FR,
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
      if (this.getSubscription.subscription_plan.billing_cycle === "monthly") {
        currentDate.setMonth(
          currentDate.getMonth() + this.getSubscription.billing_duration
        );
      } else {
        currentDate.setMonth(
          currentDate.getFullYear() + this.getSubscription.billing_duration
        );
      }
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
    completedSetup() {
      LocalStorage.remove("subscriptions");
    },
  },
  components: {
    TrialBanner,
    AccountCompletedInTrial,
    TrialHeader,
  },
};
TrialBanner;
</script>

<style lang="scss" scoped>
* {
  margin: 0;
}

.page {
  background-color: $grey1;
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
