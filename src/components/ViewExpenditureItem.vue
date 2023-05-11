<template>
  <div class="q-pa-md">
    <div>
      <div class="flex q-mb-md">
        <label for="expenditure_item" class="label"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >Payment Activity:
          <span class="value payment_activity">{{
            getUpdatedExpenditureFromState.payment_item.name
          }}</span></label
        >
      </div>
      <div class="flex q-mb-md">
        <label for="expenditure_item" class="label"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >Expenditure Activity:
          <span class="value value_item">{{
            getUpdatedExpenditureFromState.name
          }}</span></label
        >
      </div>
      <div class="flex q-mb-md">
        <label for="venue" class="label"
          ><span> <q-icon name="location_on" size="xs" class="q-pr-sm" /> </span
          >Venue:
          <span class="value value_venue">{{
            getUpdatedExpenditureFromState.venue
          }}</span></label
        >
      </div>
      <div class="q-mb-md">
        <label for="date" class="label"
          ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
          >Date:
          <span class="value value_date">{{
            getFormatedCreatedDate
          }}</span></label
        >
      </div>
      <div class="q-mb-md">
        <label for="amount" class="label"
          ><span>
            <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >Estimated Amount:
          <span class="value value_amount">
            {{
              Number(getUpdatedExpenditureFromState.amount).toLocaleString()
            }}
            XAF</span
          ></label
        >
      </div>
      <div class="q-mb-md">
        <label for="amount" class="label"
          ><span>
            <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >Total Amount Given:
          <span class="value value_item">
            {{ getUpdatedExpenditureFromState.total_amount_given }} XAF</span
          ></label
        >
      </div>
      <div class="q-mb-md">
        <label for="amount" class="label"
          ><span>
            <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >Total Amount Spent:
          <span class="value value_item">
            {{ getUpdatedExpenditureFromState.total_amount_spent }} XAF</span
          ></label
        >
      </div>
      <div class="q-mb-md">
        <label for="amount" class="label"
          ><span>
            <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >Total Balance:
          <span class="value value_balance">
            {{
              Number(
                getUpdatedExpenditureFromState.total_balance
              ).toLocaleString()
            }}
            XAF</span
          ></label
        >
      </div>
      <div class="q-mb-md">
        <label
          for="status"
          class="label"
          v-show="getUpdatedExpenditureFromState.approve == 'DECLINED'"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >Transaction Status:
          <span class="value_trxn unapproved_color">{{
            getUpdatedExpenditureFromState.approve
          }}</span></label
        >
        <label
          for="status"
          class="label"
          v-show="getUpdatedExpenditureFromState.approve == 'APPROVED'"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >Transaction Status:
          <span class="value_trxn approved_color">
            {{ getUpdatedExpenditureFromState.approve }}</span
          ></label
        >
        <label
          for="status"
          class="label"
          v-show="getUpdatedExpenditureFromState.approve == 'PENDING'"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >Transaction Status:
          <span class="value_trxn pending_color">
            {{ getUpdatedExpenditureFromState.approve }}</span
          ></label
        >
      </div>
      <div class="q-mb-md">
        <label for="amount" class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >Updated By:
          <span class="value value_created_by">
            {{ getUpdatedExpenditureFromState.updated_by }}</span
          ></label
        >
      </div>
      <div class="q-mb-md">
        <label for="comment" class="field"
          ><span> <q-icon name="description" size="xs" class="q-pr-sm" /> </span
          >Comment:</label
        >
        <p class="value q-pl-lg">
          {{ getUpdatedExpenditureFromState.comment }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";
import moment from "moment";

export default {
  mixins: [expenditureItemMixinVue],

  created() {
    let heading = "Expenditure Item Information";
    this.$emit("set-heading", heading);
  },
  data() {
    return {};
  },
  computed: {
    getUpdatedExpenditureFromState() {
      return this.$store.getters.getUpdatedExpenditureItem;
    },

    getFormatedCreatedDate() {
      return moment(this.getUpdatedExpenditureFromState.date).format(
        "MMMM Do YYYY"
      );
    },
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">
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
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
  color: $dark;
}
.value_balance {
  padding-left: 4.9rem;
}
.value_item {
  padding-left: 2.3rem;
}

.payment_activity {
  padding-left: 3.5rem;
}

.value_venue {
  padding-left: 7.6rem;
}

.value_amount {
  padding-left: 2.7rem;
}

.value_date {
  padding-left: 8.2rem;
}

.value_trxn {
  padding-left: 2.8rem;
}

.value_created_by {
  padding-left: 5.7rem;
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
