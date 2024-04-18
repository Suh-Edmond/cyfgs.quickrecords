<template>
   <div class="q-mx-md q-mt-md">
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
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
          <label for="name" class="label"
            ><span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.totalAmountPayable") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value"
            >{{
              Number(
                getPaymentDetails.details.payment_item_amount
              ).toLocaleString()
            }}
            XAF</label
          >
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="check" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.compulsoryLabel") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label
            class="value"
            v-if="getPaymentDetails.details.is_compulsory == 1"
            >{{ $t("app.yes") }}</label
          >
          <label
            class="value"
            v-if="getPaymentDetails.details.is_compulsory == 0"
            >{{ $t("app.no") }}</label
          >
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="amount" class="label"
            ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.frequency") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{ getPaymentDetails.details.frequency }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md" v-if="getPaymentDetails.details.frequency == 'QUARTERLY'">
        <div>
          <label for="amount" class="label"
            ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.quarterLabel") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{ getPaymentDetails.details.quarterly_name }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md" v-if="getPaymentDetails.details.frequency == 'MONTHLY'">
        <div>
          <label for="amount" class="label"
            ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.monthLabel") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{ getPaymentDetails.details.month_name }}
          </label>
        </div>
      </div>
      <div class="q-mb-md flex justify-between">
        <div>
          <label for="year" class="label"
            ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.year") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{ getPaymentDetails.details.year }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.membersName") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{ getPaymentDetails.user.name }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label">
            <span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.amount") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{ Number(getPaymentDetails.details.amount).toLocaleString() }}
            XAF
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label">
            <span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.balance") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label class="value">
            {{ Number(getPaymentDetails.details.balance).toLocaleString() }}
            XAF
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.paymentDate") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{ getPaymentDetails.details.created_at }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="status" class="label"
            ><span>
              <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.transactionStatus") }}:</label
          >
        </div>
        <div
          class="detail-value wrap"
          v-show="getPaymentDetails.details.approve == 'PENDING'"
        >
          <label class="value pending_color">
            {{ getPaymentDetails.details.approve }}
          </label>
        </div>
        <div
          class="detail-value wrap"
          v-show="getPaymentDetails.details.approve == 'APPROVED'"
        >
          <label class="value approved_color">
            {{ getPaymentDetails.details.approve }}
          </label>
        </div>
        <div
          class="detail-value wrap"
          v-show="getPaymentDetails.details.approve == 'DECLINED'"
        >
          <label class="value unapproved_color">
            {{ getPaymentDetails.details.approve }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span>
              <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.paymentStatus") }}:
          </label>
        </div>

        <div
          class="detail-value wrap"
          v-show="getPaymentDetails.details.payment_status == 'COMPLETE'"
        >
          <label class="value text-secondary">
            {{ getPaymentDetails.details.payment_status }}
          </label>
        </div>
        <div
          class="detail-value wrap"
          v-show="getPaymentDetails.details.payment_status == 'INCOMPLETE'"
        >
          <label class="value text-secondary">
            {{ getPaymentDetails.details.payment_status }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="badge" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.transactionCode") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{ getPaymentDetails.details.code }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.createdBy") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{ getPaymentDetails.details.created_by }}
          </label>
        </div>
      </div>
      <div class="flex justify-start q-pb-md">
        <div>
          <label for="name" class="label"
            ><span>
              <q-icon name="description" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.comment") }}:
          </label>
        </div>
      </div>
      <div class="value_comment">{{ getPaymentDetails.details.comment }}</div>
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
  color: #f2994a;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
}

.approved_color {
  color: #27ae60;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
}

.label {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $grey5;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.01em;
  color: $grey8;
}

.detail-value {
  max-width: 250px;
}
.value_comment {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.01em;
  color: $dark;
  margin-left: 1.8rem;
}

.image {
  height: 100px;
  width: 100px;
}

.pending_color {
  color: $info;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
}
</style>
