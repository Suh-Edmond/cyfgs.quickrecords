<template>
  <div class="q-py-md" :class="$q.platform.is.mobile ? 'q-px-lg' : 'q-px-md'">
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="expenditure_item" class="label"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.category") }}
        </label>
      </div>
      <div>
        <label class="value">
          {{ getUpdatedPaymentItemFromState.payment_category_name }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="expenditure_item" class="label"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.paymentItem") }}
        </label>
      </div>
      <div>
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
          >{{ $t("app.compulsoryLabel") }}
        </label>
      </div>
      <div>
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
          >{{ $t("app.amount") }}
        </label>
      </div>
      <div>
        <label class="value">
          {{ Number(getUpdatedPaymentItemFromState.amount).toLocaleString() }}
          XAF
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="amount" class="label"
          ><span>
            <q-icon name="trending_flat" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.frequency") }}
        </label>
      </div>

      <div>
        <label class="value">
          {{ formatConstants(getUpdatedPaymentItemFromState.frequency) }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <label for="type" class="label"
        ><span> <q-icon name="title" size="xs" class="q-pr-sm" /> </span
        >{{ $t("app.type") }}
      </label>
      <div>
        <label class="value">
          {{
            formatConstants(getUpdatedPaymentItemFromState.payment_item_type)
          }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="deadline" class="label"
          ><span>
            <q-icon name="hourglass_top" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.deadline") }}
        </label>
      </div>
      <div>
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
          >{{ $t("app.status") }}
        </label>
      </div>
      <div>
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
          >{{ $t("app.createdAt") }}
        </label>
      </div>
      <div>
        <label class="value">
          {{ getFormatedCreatedDate }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="amount" class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.updatedBy") }}
        </label>
      </div>
      <div>
        <label class="value">
          {{ getUpdatedPaymentItemFromState.updated_by }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="amount" class="label"
          ><span> <q-icon name="people" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.members") }}
        </label>
      </div>
      <div
        v-if="
          getUpdatedPaymentItemFromState.payment_item_type !== 'ALL_MEMBERS'
        "
      >
        <div class="q-gutter-xs q-ml-md" v-if="getReferences.length > 0">
          <q-chip
            color="teal"
            text-color="white"
            v-for="ref in getReferences"
            :key="ref.id"
            size="sm"
            >{{ ref.name }}</q-chip
          >
        </div>
      </div>
      <div v-else>
        <label class="no_member">{{ $t("app.allMembers") }}</label>
      </div>
    </div>
    <div class="row q-mb-xs">
      <label for="comment" class="label"
        ><span> <q-icon name="description" size="xs" class="q-pr-sm" /> </span
        >{{ $t("app.comment") }}</label
      >
    </div>
    <div
      class="value detail-value q-pl-lg"
      v-show="getUpdatedPaymentItemFromState.description !== null"
    >
      {{ getUpdatedPaymentItemFromState.description }}
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
  font-size: 0.8rem;
  color: $grey5;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
  color: $grey8;
}

.no_member {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
  color: $grey8;
}

.unapproved_color {
  color: $orange;
}
.approved_color {
  color: $secondary;
}
</style>
