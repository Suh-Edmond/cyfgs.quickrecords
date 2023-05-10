<template>
  <div class="q-pa-lg">
    <div>
      <div class="flex q-mb-md">
        <label for="expenditure_item" class="label"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >Category:
          <span class="value category">{{
            getUpdatedExpenditureFromState.payment_category_name
          }}</span></label
        >
      </div>
      <div class="flex q-mb-md">
        <label for="expenditure_item" class="label"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >Payment Item:
          <span class="value payment_activity">{{
            getUpdatedExpenditureFromState.name
          }}</span></label
        >
      </div>
      <div class="q-mb-md">
        <label for="date" class="label"
          ><span> <q-icon name="priority_high" size="xs" class="q-pr-sm" /> </span
          >Compulsory:
          <span class="value value_com" v-if="getUpdatedExpenditureFromState.compulsory == '1'">YES</span>
          <span class="value value_com" v-else>NO</span>
        </label>

      </div>
      <div class="q-mb-md">
        <label for="amount" class="label"
          ><span>
            <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >Amount:
          <span class="value value_amount">
            {{ Number(getUpdatedExpenditureFromState.amount).toLocaleString() }}
            XAF</span
          ></label
        >
      </div>
      <div class="q-mb-md">
        <label for="amount" class="label"
          ><span>
            <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
          >Frequency:
          <span class="value frequency">
            {{ getUpdatedExpenditureFromState.frequency }} PAYMENT
          </span></label
        >
      </div>
      <div class="q-mb-md">
        <label for="amount" class="label"
          ><span>
            <q-icon name="title" size="xs" class="q-pr-sm" /> </span
          >Type:
          <span class="value type">
            {{ getUpdatedExpenditureFromState.payment_item_type }}
          </span></label
        >
      </div>
      <div class="q-mb-md">
        <label for="amount" class="label"
          ><span>
            <q-icon name="people" size="xs" class="q-pr-sm" /> </span
          >Member(s):
        </label>
        <div v-if="getReferences.length > 0">
          <div class="q-gutter-sm q-mt-sm q-ml-md">
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
          <label  class="no_member ">No Member has been Selected</label>
        </div>
      </div>
      <div class="q-mb-md">
        <label for="amount" class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >Created At:
          <span class="value created_at">
            {{ getFormatedCreatedDate }}</span
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
        <label for="comment" class="label"
          ><span> <q-icon name="description" size="xs" class="q-pr-sm" /> </span
          >Comment:</label
        >
        <p class="value q-pl-lg">
          {{ getUpdatedExpenditureFromState.description }}
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
    let heading = "Payment Item Details";
    this.$emit("set-heading", heading);
  },
  data() {
    return {};
  },
  computed: {
    getUpdatedExpenditureFromState() {
      return this.$store.getters.getUpdatedPaymentItem;
    },

    getFormatedCreatedDate() {
      return moment(this.getUpdatedExpenditureFromState.created_at).format(
        "MMMM Do YYYY"
      );
    },
    getReferences() {
      let data = [];
      this.getUpdatedExpenditureFromState.references.forEach((ele) => {
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
  font-weight: 400;
  font-size: 13px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $dark;
  padding-left: 1.6rem;
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
.frequency {
  padding-left: 3.5rem;
}
.type {
  padding-left: 5.7rem;
}

.category {
  padding-left: 3.8rem;
}
.payment_activity {
  padding-left: 2rem;
}

.value_venue {
  padding-left: 7.6rem;
}

.value_amount {
  padding-left: 4.5rem;
}

.value_com {
  padding-left: 2.9rem;
}

.value_trxn {
  padding-left: 2.8rem;
}

.value_created_by {
  padding-left: 5.7rem;
}

.created_at {
  padding-left: 4rem;
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
