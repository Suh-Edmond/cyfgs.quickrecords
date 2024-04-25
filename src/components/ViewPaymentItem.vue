<template>
  <div class="q-pa-md">
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="expenditure_item" class="label"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.category") }}:
        </label>
      </div>
      <div class="detail-value wrap">
        <label class="value">
          {{ getUpdatedPaymentItemFromState.payment_category_name }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="expenditure_item" class="label"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.paymentItem") }}:
        </label>
      </div>
      <div class="detail-value wrap">
        <label class="value">
          {{ getUpdatedPaymentItemFromState.name }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="complusory" class="label"
          ><span>
            <q-icon name="priority_high" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.compulsoryLabel") }}:
        </label>
      </div>
      <div class="detail-value wrap">
        <label
          class="value"
          v-if="getUpdatedPaymentItemFromState.compulsory == '1'"
        >
          {{ $t("app.yes") }}
        </label>
        <label class="value" v-else>
          {{ $t("app.no") }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="amount" class="label"
          ><span>
            <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.amount") }}:
        </label>
      </div>
      <div class="detail-value wrap">
        <label class="value">
          {{ Number(getUpdatedPaymentItemFromState.amount).toLocaleString() }}
          XAF
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="amount" class="label"
          ><span> <q-icon name="trending_flat" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.frequency") }}:
        </label>
      </div>

      <div class="detail-value wrap">
        <label class="value">
          {{ formatConstants(getUpdatedPaymentItemFromState.frequency) }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <label for="amount" class="label"
        ><span> <q-icon name="title" size="xs" class="q-pr-sm" /> </span
        >{{ $t("app.type") }}:
      </label>
      <div class="detail-value wrap">
        <label class="value">
          {{ formatConstants(getUpdatedPaymentItemFromState.payment_item_type) }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="deadline" class="label"
          ><span>
            <q-icon name="hourglass_top" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.deadline") }}:
        </label>
      </div>
      <div class="detail-value wrap">
        <label class="value">
          {{ getFormatedDeadline }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="deadline" class="label"
          ><span>
            <q-icon name="hourglass_top" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.status") }}:
        </label>
      </div>
      <div class="detail-value wrap">
        <label
          class="value unapproved_color"
          v-show="getUpdatedPaymentItemFromState.deadline_state == 'EXPIRED'"
        >
          {{ getUpdatedPaymentItemFromState.deadline_state }}
        </label>
        <label
          class="value text-secondary text-weight-bold"
          v-show="getUpdatedPaymentItemFromState.deadline_state == 'ACTIVE'"
        >
          {{ getUpdatedPaymentItemFromState.deadline_state }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="amount" class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.createdAt") }}:
        </label>
      </div>
      <div class="detail-value wrap">
        <label class="value">
          {{ getFormatedCreatedDate }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="amount" class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.updatedBy") }}:
        </label>
      </div>
      <div class="detail-value wrap">
        <label class="value">
          {{ getUpdatedPaymentItemFromState.updated_by }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="amount" class="label"
          ><span> <q-icon name="people" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.members") }}:
        </label>
      </div>
      <div
        class="detail-value wrap"
        v-if="
          getUpdatedPaymentItemFromState.payment_item_type !== 'ALL_MEMBERS'
        "
      >
        <div
          class="q-gutter-sm q-mt-sm q-ml-md"
          v-if="getReferences.length > 0"
        >
          <q-chip
            color="primary"
            text-color="white"
            v-for="ref in getReferences"
            :key="ref.id"
            size="md"
            >{{ ref.name }}</q-chip
          >
        </div>
      </div>
      <div v-else>
        <label class="no_member">{{ $t("app.noMember") }}</label>
      </div>
    </div>
    <div class="row q-mb-md">
      <label for="comment" class="label"
        ><span> <q-icon name="description" size="xs" class="q-pr-sm" /> </span
        >{{ $t("app.comment") }}:</label
      >
    </div>
    <div
      class="value_comment"
      v-show="getUpdatedPaymentItemFromState.description !== null"
    >
      {{ getUpdatedPaymentItemFromState.description }}
    </div>
    <div
      class="value_comment"
      v-show="getUpdatedPaymentItemFromState.description === null"
    >
      {{ $t("app.none") }}
    </div>
  </div>
</template>
<script>
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";
import moment from "moment";
import HelperMixin from "src/mixins/HelperMixin.vue";

export default {
  mixins: [expenditureItemMixinVue, HelperMixin],

  created() {
    let heading = this.$t("app.paymentItemHeading");
    this.$emit("set-heading", heading);
  },
  data() {
    return {};
  },
  computed: {

    getUpdatedPaymentItemFromState() {
      return this.$store.getters.getUpdatedPaymentItem;
    },

    getFormatedCreatedDate() {
      return moment(this.getUpdatedPaymentItemFromState.created_at).format(
        "MMMM Do YYYY"
      );
    },
    getFormatedDeadline() {
      return moment(this.getUpdatedPaymentItemFromState.deadline).format(
        "MMMM Do YYYY"
      );
    },
    getReferences() {
      let data = [];
      this.getUpdatedPaymentItemFromState.references.forEach((ele) => {
        data.push(ele);
      });
      return data;
    },
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">
.label {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $grey5;
}

.no_member {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $grey8;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.01em;
  color: $grey8;
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

.unapproved_color {
  color: #f2994a;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 11px;
  letter-spacing: 0.01em;
}
.approved_color {
  color: #27ae60;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 11;
  letter-spacing: 0.01em;
}
</style>
