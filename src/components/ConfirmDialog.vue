<template>
  <div>
    <!-- confirmation dialog for delete -->
    <q-dialog v-model="show_dialog">
      <q-card>
        <q-card-section class="q-pa-lg">
          <div class="q-mb-sm text-left">
            <label class="message">{{ msg }}</label
            ><br />
            <small class="warning_caption">All <span v-if="type == 'PAYMENT_CATEGORY'">Payments</span> <span v-else>Expenditures</span> recorded under this Category will be lost.</small><br/>
            <small class="warning_caption">This action can not be undone</small>
          </div>

          <!-- contribution details -->
          <div v-if="show_contribution">
            <div class="text-weight-bold text-left text-red">
              Name:
              <span
                class="q-pl-md"
                :class="show_members ? 'name' : ' q-ml-md'"
                >{{ data.name }}</span
              >
            </div>

            <div class="text-weight-bold text-left text-red">
              Amount Deposited:
              <span class="amount"
                >{{ Number(data.amount_deposited).toLocaleString() }} XAF</span
              >
            </div>

            <div class="text-weight-bold text-left text-red">
              Member's Name:
              <span class="member_name">{{ data.user_name }}</span>
            </div>
          </div>
          <!-- end of contribution -->

          <!-- members details -->
          <div class="text-weight-bold text-left text-red" v-if="show_members">
            Name: <span class="q-pl-md">{{ data.name }}</span>
          </div>
          <!-- end of members -->

          <!-- a_member details -->
          <div class="text-weight-bold text-left text-red" v-if="show_member">
            Name: <span class="q-pl-md">{{ data.name }}</span>
          </div>
          <!-- end of member -->

          <!-- income_activity details -->
          <div v-if="show_income_activity">
            <div class="text-weight-bold text-left text-red">
              Amount:
              <span class="amount"
                >{{ Number(data.amount).toLocaleString() }} XAF</span
              >
            </div>
            <div class="text-weight-bold text-left text-red">
              Date: <span class="date">{{ formatDate(data.date) }}</span>
            </div>
          </div>
          <!-- end of income activity -->

          <!-- Payment Activity -->
          <div
            class="text-weight-bold text-left text-red"
            v-if="show_contribution"
          >
            Payment Activity:
            <span class="payment_item_name">{{ data.payment_item_name }}</span>
          </div>
          <!-- end of Payment Activity -->

          <!-- registration fee details -->
          <div v-if="show_reg_fee">
            <div class="text-weight-bold text-left text-red">
              Amount:
              <span class="amount"
                >{{ Number(data.amount).toLocaleString() }} XAF</span
              >
            </div>
            <div class="text-weight-bold text-left text-red">
              Frequency: <span class="frequency">{{ data.frequency }}</span>
            </div>
          </div>
          <!-- end of registration fee -->

          <!-- payment category -->
          <div v-if="show_payment_category || show_expenditure_category">
            <div class="text-weight-bold text-left text-red">
              Name:
              <span class="amount">{{ data.name }} </span>
            </div>
          </div>
          <!-- end of payment category -->
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Cancel"
            :color="'primary'"
            :disabled="false"
            :loading="false"
            no-caps
            :flat="true"
            class="dialog_button"
            @click="cancelDialog"
            v-close-popup
          ></q-btn>
          <q-btn
            label="Delete"
            :color="'primary'"
            class="dialog_button"
            :disabled="false"
            :loading="false"
            no-caps
            :flat="true"
            v-close-popup
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
  font-size: 15px;
  align-items: left;
  letter-spacing: 0.01em;
  color: $dark;
}

.member_name {
  margin-left: 2.1rem;
}
.frequency {
  padding-left: 0.5rem;
}
.warning_caption {
  color: $grey2;
  font-weight: 500;
  font-size: 13px;
}

.category_warning {
  font-size: 13px;
}
</style>
