<template>
  <div class="q-pa-md">
    <div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="expenditure_item" class="label"
            ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.paymentItem") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{ getUpdatedExpenditureFromState.payment_item.name }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="expenditure_item" class="label"
            ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.expenditureItem") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label class="value">
            {{ getUpdatedExpenditureFromState.name }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="venue" class="label"
            ><span>
              <q-icon name="location_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.venue") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label class="value">
            {{ getUpdatedExpenditureFromState.venue }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="date" class="label"
            ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.date") }}:
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
            ><span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.estimatedAmount") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label class="value">
            {{ Number(getUpdatedExpenditureFromState.amount).toLocaleString() }}
            XAF
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="amount" class="label"
            ><span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.totalAmountGiven") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label class="value">
            {{
              Number(
                getUpdatedExpenditureFromState.total_amount_given
              ).toLocaleString()
            }}
            XAF
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="amount" class="label"
            ><span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.totalAmountSpent") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label class="value">
            {{
              Number(
                getUpdatedExpenditureFromState.total_amount_spent
              ).toLocaleString()
            }}
            XAF
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="amount" class="label"
            ><span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.totalBalance") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label class="value">
            {{
              Number(
                getUpdatedExpenditureFromState.total_balance
              ).toLocaleString()
            }}
            XAF
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="status" class="label"
            ><span>
              <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.transactionStatus") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label
            class="value unapproved_color"
            v-show="getUpdatedExpenditureFromState.approve == 'DECLINED'"
          >
            {{ getUpdatedExpenditureFromState.approve }}
          </label>
          <label
            class="value approved_color"
            v-show="getUpdatedExpenditureFromState.approve == 'APPROVED'"
          >
            {{ getUpdatedExpenditureFromState.approve }}
          </label>
          <label
            class="value pending_color"
            v-show="getUpdatedExpenditureFromState.approve == 'PENDING'"
          >
            {{ getUpdatedExpenditureFromState.approve }}
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
            {{ getUpdatedExpenditureFromState.updated_by }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <label for="comment" class="field"
          ><span> <q-icon name="description" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.comment") }}:</label
        >
      </div>
      <div class="value_comment">
        {{ getUpdatedExpenditureFromState.comment }}
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
    let heading = this.$t("app.addExpenditureItemHeading");
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
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;
  letter-spacing: 0.01em;
}

.approved_color {
  color: #27ae60;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11;
  letter-spacing: 0.01em;
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

.pending_color {
  color: $info;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;
  letter-spacing: 0.01em;
}
</style>
