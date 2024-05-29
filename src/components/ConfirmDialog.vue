<template>
  <div>
    <!-- confirmation dialog for delete -->
    <q-dialog v-model="show_dialog">
      <q-card class="q-pa-sm">
        <q-card-section>
          <div class="row">
            <label class="message">{{ msg }}</label
            ><br />
            <small class="warning_caption">
              <span v-if="show_payment_category">{{
                $t("app.warningPayments")
              }}</span>
              <span v-if="show_expenditure_category">{{
                $t("app.warningExpenditure")
              }}</span>
              <span v-if="show_expenditure_item">{{
                $t("app.warningDetails")
              }}</span> </small
            ><br
              v-if="
                show_payment_category ||
                show_expenditure_category ||
                show_expenditure_item
              "
            />
          </div>
          <label class="warning_caption">{{ $t("app.actionUndoneMsg") }}</label>

          <!-- contribution details -->
          <div v-if="show_delete_contribution" class="q-mt-md">
            <div class="text-weight-bold text-left text-red record_label">
              {{ $t("app.paymentItem") }}:
              <span class="q-pl-xl">{{ data.payment_item_name }}</span>
            </div>

            <div class="text-weight-bold text-left text-red record_value">
              {{ $t("app.amountDeposited") }}:
              <span class="amount"
                >{{ Number(data.amount_deposited).toLocaleString() }} XAF</span
              >
            </div>

            <div class="text-weight-bold text-left text-red record_value">
              {{ $t("app.membersName") }}:
              <span class="member_name">{{ data.user_name }}</span>
            </div>
          </div>
          <!-- end of contribution -->

          <!-- members details -->
          <div
            class="text-weight-bold text-left text-red q-mt-md record_value"
            v-if="show_members"
          >
            {{ $t("app.nameLabel") }}:
            <span class="q-pl-md">{{ data.name }}</span>
          </div>
          <!-- end of members -->

          <!-- a_member details -->
          <div
            class="text-weight-bold text-left text-red record_value"
            v-if="show_member"
          >
            {{ $t("app.nameLabel") }}:
            <span class="q-pl-md">{{ data.name }}</span>
          </div>
          <!-- end of member -->

          <!-- income_activity details -->
          <div v-if="show_income_activity" class="q-mt-md">
            <div class="text-weight-bold text-left text-red record_label">
              {{ $t("app.nameLabel") }}:
              <span class="income_name">{{ data.name }}</span>
            </div>
            <div class="text-weight-bold text-left text-red record_value">
              {{ $t("app.amount") }}:
              <span class="amount"
                >{{ Number(data.amount).toLocaleString() }} XAF</span
              >
            </div>
          </div>
          <!-- end of income activity -->

          <!-- Payment Activity -->
          <div
            class="text-weight-bold text-left text-red record_label"
            v-if="show_contribution"
          >
            {{ $t("app.paymentItem") }}:
            <span class="payment_item_name">{{ data.payment_item_name }}</span>
          </div>
          <!-- end of Payment Activity -->

          <!-- registration fee details -->
          <div v-if="show_reg_fee">
            <div class="text-weight-bold text-left text-red record_label">
              {{ $t("app.amount") }}:
              <span class="amount"
                >{{ Number(data.amount).toLocaleString() }} XAF</span
              >
            </div>
            <div class="text-weight-bold text-left text-red record_value">
              {{ $t("app.frequency") }}:
              <span class="frequency">{{ data.frequency }}</span>
            </div>
          </div>
          <!-- end of registration fee -->

          <!-- payment category -->
          <div v-if="show_payment_category || show_expenditure_category">
            <div
              class="text-weight-bold text-left text-red record_value q-mt-md"
            >
              {{ $t("app.nameLabel") }}:
              <span class="amount">{{ data.name }} </span>
            </div>
          </div>
          <!-- end of payment category -->

          <!-- Expenditure Item -->
          <div
            class="text-weight-bold text-left text-red record_label"
            v-if="show_expenditure_item || show_payment_item"
          >
            {{ $t("app.nameLabel") }}:
            <span class="payment_item_name">{{ data.name }}</span>
          </div>
          <!-- end of Expenditure Item -->

          <!-- Expenditure Item details -->
          <div v-if="show_expenditure_item_detail">
            <div class="text-weight-bold text-left text-red record_label">
              {{ $t("app.nameLabel") }}:
              <span class="frequency">{{ data.name }}</span>
            </div>
            <div class="text-weight-bold text-left text-red record_value">
              {{ $t("app.amountGiven") }}:
              <span class="amount"
                >{{ Number(data.amount_given).toLocaleString() }} XAF</span
              >
            </div>
            <div class="text-weight-bold text-left text-red record_value">
              {{ $t("app.amountSpent") }}:
              <span class="amount"
                >{{ Number(data.amount_spent).toLocaleString() }} XAF</span
              >
            </div>
          </div>
          <!-- end of Expenditure Item -->
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            :label="$t('app.cancel')"
            :color="'primary'"
            :disabled="false"
            :loading="false"
            no-caps
            flat
            class="dialog_button"
            @click="cancelDialog"
            v-close-popup
            size="md"
          ></q-btn>
          <q-btn
            :label="$t('app.delete')"
            :color="'primary'"
            class="dialog_button"
            :disabled="false"
            :loading="false"
            no-caps
            flat
            v-close-popup
            size="md"
            @click="deleteRow()"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    msg: {
      type: String,
      required: true,
    },
    data: {
      type: Object || null,
      required: true,
    },
    show_members: {
      type: Boolean,
      required: false,
    },
    show_contribution: {
      type: Boolean,
      required: false,
    },
    show_delete_contribution: {
      type: Boolean,
      required: false,
    },
    show_income_activity: {
      type: Boolean,
      required: false,
    },
    show_reg_fee: {
      type: Boolean,
      required: false,
    },
    show_payment_category: {
      type: Boolean,
      required: false,
    },
    show_expenditure_item: {
      type: Boolean,
      required: false,
    },
    show_expenditure_category: {
      type: Boolean,
      required: false,
    },
    show_payment_item: {
      type: Boolean,
      required: false,
    },
    show_expenditure_item_detail: {
      type: Boolean,
      required: false,
    },
    show_member: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      show_dialog: true,
    };
  },
  methods: {
    deleteRow() {
      return this.$emit("delete-row");
    },

    formatDate(date) {
      return moment(date).format("MMMM Do YYYY");
    },

    cancelDialog() {
      return this.$emit("cancel-dialog");
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog_button {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.amount {
  margin-left: 1.2rem;
}

.payment_item_name {
  margin-left: 1.8rem;
}

.message {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem;
  color: $primary;
}

.member_name {
  margin-left: 2.1rem;
}
.frequency {
  padding-left: 0.5rem;
}
.warning_caption {
  color: $grey2;
  font-weight: 400;
  font-size: 0.7rem;
}

.income_name {
  padding-left: 2rem;
}

.record_value {
  font-size: 0.8rem;
}

.record_label {
  font-size: 0.8rem;
}
</style>
