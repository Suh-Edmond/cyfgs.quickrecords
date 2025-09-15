<template>
  <div class="q-mx-md q-mt-md">
    <div class="flex justify-between q-pb-md">
      <div>
        <label class="label"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.paymentItem") }}:
        </label>
      </div>
      <div class="detail-value wrap">
        <label class="value">
          {{ getPaymentDetails.details.name }}
        </label>
      </div>
    </div>
     <div class="flex justify-between q-pb-md">
      <div>
        <label class="label"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.isRangeLabel") }}:
        </label>
      </div>
      <div class="detail-value wrap">
        <label class="value" v-if="!getPaymentDetails.details.is_range">
          NO
        </label>
         <label class="value" v-if="getPaymentDetails.details.is_range">
          YES
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label class="label"
          ><span>
            <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.totalAmountPayable") }}:
        </label>
      </div>
      <div>
        <label class="value" v-if="!getPaymentDetails.details.is_range"
          >{{
            Number(
              getPaymentDetails.details.payment_item_amount
            ).toLocaleString()
          }}
          XAF</label
        >
        <label class="value" v-if="getPaymentDetails.details.is_range"
          >{{
            Number(
              getPaymentDetails.details.start_amount
            ).toLocaleString()
          }}  -  {{
            Number(
              getPaymentDetails.details.end_amount
            ).toLocaleString()
          }}
          XAF</label
        >
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label class="label"
          ><span> <q-icon name="check" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.compulsoryLabel") }}:
        </label>
      </div>

      <div>
        <label
          class="value"
          v-if="getPaymentDetails.details.is_compulsory === 1"
          >{{ $t("app.yes") }}</label
        >
        <label
          class="value"
          v-if="getPaymentDetails.details.is_compulsory === 0"
          >{{ $t("app.no") }}</label
        >
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label class="label"
          ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.frequency") }}:
        </label>
      </div>
      <div>
        <label class="value">
          {{ formatConstants(getPaymentDetails.details.frequency) }}
        </label>
      </div>
    </div>
    <div
      class="flex justify-between q-mb-md"
      v-if="getPaymentDetails.details.frequency === 'QUARTERLY'"
    >
      <div>
        <label class="label"
          ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.quarterLabel") }}:
        </label>
      </div>
      <div>
        <label class="value">
          {{ getPaymentDetails.details.quarterly_name }}
        </label>
      </div>
    </div>
    <div
      class="flex justify-between q-mb-md"
      v-if="getPaymentDetails.details.frequency === 'MONTHLY'"
    >
      <div>
        <label class="label"
          ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.monthLabel") }}:
        </label>
      </div>
      <div>
        <label class="value">
          {{ getPaymentDetails.details.month_name }}
        </label>
      </div>
    </div>
    <div class="q-mb-md flex justify-between">
      <div>
        <label class="label"
          ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.year") }}:
        </label>
      </div>
      <div>
        <label class="value">
          {{ getPaymentDetails.details.year }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.membersName") }}:
        </label>
      </div>
      <div>
        <label class="value">
          {{ getPaymentDetails.user.name }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label class="label">
          <span>
            <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.amountDeposited") }}:
        </label>
      </div>
      <div>
        <label class="value">
          {{ Number(getPaymentDetails.details.amount).toLocaleString() }}
          XAF
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label class="label">
          <span>
            <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.balance") }}
        </label>
      </div>

      <div>
        <label class="value">
          {{ Number(getPaymentDetails.details.balance).toLocaleString() }}
          XAF
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label class="label"
          ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.paymentDate") }}:
        </label>
      </div>
      <div>
        <label class="value">
          {{ getPaymentDetails.details.date }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label class="label"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.transactionStatus") }}</label
        >
      </div>
      <div v-show="getPaymentDetails.details.approve === 'PENDING'">
        <label class="value pending_color">
          {{ getPaymentDetails.details.approve }}
        </label>
      </div>
      <div v-show="getPaymentDetails.details.approve === 'APPROVED'">
        <label class="value approved_color">
          {{ getPaymentDetails.details.approve }}
        </label>
      </div>
      <div v-show="getPaymentDetails.details.approve === 'DECLINED'">
        <label class="value unapproved_color">
          {{ getPaymentDetails.details.approve }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label class="label"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.paymentStatus") }}:
        </label>
      </div>

      <div v-show="getPaymentDetails.details.payment_status === 'COMPLETE'">
        <label class="value text-secondary">
          {{ getPaymentDetails.details.payment_status }}
        </label>
      </div>
      <div v-show="getPaymentDetails.details.payment_status === 'INCOMPLETE'">
        <label class="value text-orange">
          {{ getPaymentDetails.details.payment_status }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label class="label"
          ><span> <q-icon name="badge" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.transactionCode") }}
        </label>
      </div>
      <div>
        <label class="value">
          {{ getPaymentDetails.details.code }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.createdBy") }}
        </label>
      </div>
      <div>
        <label class="value">
          {{ getPaymentDetails.details.created_by }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label class="label"
          ><span> <q-icon name="description" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.comment") }}
        </label>
      </div>
      <div class="value">{{ getPaymentDetails.details.comment }}</div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import organisationMixin from "src/mixins/organisationMixin.vue";
import memberMixin from "src/mixins/memberMixin.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";

export default {
  mixins: [organisationMixin, memberMixin, HelperMixin],
  props: {
    paymentDetails: {
      type: Object,
      required: true,
    },
  },

  mounted() {
    let heading = this.$t("app.paymentDetails");
    this.$emit("set-heading", heading);
  },

  data() {
    return {
      show_image: false,
      position: "right",
    };
  },
  computed: {
    getPaymentDetails() {
      return this.paymentDetails;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.unapproved_color {
  color: $orange;
}

.approved_color {
  color: $secondary;
}

.label {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 0.7rem;
  color: $grey5;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.7rem;
  color: $grey8;
}

.detail-value {
  max-width: 250px;
}

.pending_color {
  color: $info;
}
</style>
