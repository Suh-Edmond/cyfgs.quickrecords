<template>
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
        <label class="billing_field">{{ $t("app.organisationName") }} </label>
        <label class="billing_field text-weight-bold"
          >{{ getOrganisation.name }}
        </label>
      </div>

      <div class="bill_info row justify-between">
        <label class="billing_field">{{ $t("app.billingCycle") }} </label>
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
        <label class="billing_field">{{ $t("app.billingDuration") }} </label>
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
        <label class="billing_field">{{ $t("app.nextBilling") }} </label>
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
            >{{ getFormatDate(getSubscription.current_period_start_date) }}
          </label>
        </div>

        <div class="bill_info row justify-between">
          <label class="billing_field">{{ $t("app.subscriptionEnd") }} </label>
          <label class="billing_field text-weight-bold"
            >{{ getFormatDate(getSubscription.current_period_end_date) }}
          </label>
        </div>
      </div>

      <div v-if="getSubscription.status === 'trialing'">
        <div class="bill_info row justify-between">
          <label class="billing_field">{{ $t("app.trialingStart") }} </label>
          <label class="billing_field text-weight-bold"
            >{{ getFormatDate(getSubscription.trial_period_start_date) }}
          </label>
        </div>

        <div class="bill_info row justify-between">
          <label class="billing_field">{{ $t("app.trialingEnd") }} </label>
          <label class="billing_field text-weight-bold"
            >{{ getFormatDate(getSubscription.trial_period_end_date) }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "PageIndex",
  props: {
    subscription: {
      required: true,
      type: Object,
    },
    features: {
      required: true,
      type: Array,
    },
    organisation: {
      required: true,
      type: Object,
    },
  },

  methods: {
    getFormatDate(date) {
      return moment(date).format("MMMM Do YYYY");
    },
  },
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
