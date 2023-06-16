<template>
  <div class="q-pa-md">
    <div class="q-ml-sm q-mb-lg">
      <label class="text-muted"
        >All fields with <span class="text-red">*</span> are required</label
      >
    </div>
    <div class="q-px-sm">
      <q-form @submit="onAddContribution" class="q-gutter-md">
        <div>
          <div class="q-mb-md">
            <label for="name" class="form_field"
              >Payment Category <span class="text-red">*</span>
            </label>
            <q-select
              outlined
              dense
              v-model="contribution.payment_category_id"
              :options="payment_categories"
              @input="fetchPaymentItems"
              label="Search payment category..."
              input-debounce="0"
              use-input
              clearable
              @filter="filterPaymentCategories"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="q-mb-md">
            <label for="name" class="form_field"
              >Payment Item <span class="text-red">*</span>
            </label>
            <q-select
              outlined
              dense
              v-model="contribution.payment_item_id"
              :options="filtered_payment_items"
              @input="fetchPaymentItem"
              label="Search payment item..."
              input-debounce="0"
              use-input
              clearable
              @filter="filterPaymentItems"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="q-mb-md">
            <label for="credential" class="form_field"
              >Amount Payable(XAF)</label
            >
            <q-input
              v-model="contribution.amount_payable"
              outlined
              dense
              type="number"
              disable
            />
          </div>
          <div class="row justify-end" v-show="!has_selected_payment_item">
            <q-btn
              @click="has_selected_payment_item = !has_selected_payment_item"
              color="primary"
              label="Next"
              no-caps
              :disable="validatePaymentItem"
              ><q-icon name="arrow_forward" size="xs" class="q-pl-sm"></q-icon
            ></q-btn>
          </div>
          <div v-show="has_selected_payment_item">
            <div class="q-mb-md">
              <label for="name" class="form_field"
                >Member Name <span class="text-red">*</span>
              </label>
              <q-select
                outlined
                dense
                v-model="contribution.user_id"
                :options="members"
                @input="selectMember"
                label="Search member..."
                input-debounce="0"
                use-input
                clearable
                @filter="filterMembers"
              >
              </q-select>
            </div>
            <div class="q-mb-md" v-if="valideteMonthlyPaymentItemFrequency">
              <label for="credential" class="form_field"
                >Select Month <span class="text-red">*</span></label
              >
              <q-select
                v-model="contribution.month_name"
                outlined
                dense
                :options="monthsOptions"
                label="Search month..."
                use-input
                input-debounce="0"
                clearable
                @filter="filterMonths"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="q-mb-md" v-if="valideteQuarterlyPaymentItemFrequency">
              <label for="credential" class="form_field"
                >Select Quarter <span class="text-red">*</span></label
              >
              <q-select
                v-model="contribution.quarterly_name"
                outlined
                dense
                :options="quartersOptions"
                input-debounce="0"
                clearable
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="q-mb-md">
              <label for="credential" class="form_field"
                >Total Amount Deposited (XAF)</label
              >
              <q-input
                v-model.number="contribution.total_amount_deposited"
                outlined
                dense
                type="number"
                disable
              >
              </q-input>
            </div>
            <div class="q-mb-md">
              <label for="credential" class="form_field">Balance (XAF)</label>
              <q-input
                v-model="contribution.balance"
                outlined
                dense
                type="number"
                disable
              />
            </div>
            <div class="q-mb-md">
              <label for="credential" class="form_field"
                >Deposite Amount (XAF)<span class="text-red">*</span></label
              >
              <q-input
                v-model.number="contribution.amount_deposited"
                outlined
                dense
                type="number"
                @keyup="setPaymentItemBalance"
                :disable="has_completed_payment"
              >
              </q-input>
              <small v-if="checkPaymentItemBal" class="text-red">
                <b>Amount deposited can not be more than Amount Payable</b>
              </small>
              <small v-if="has_completed_payment" class="text-info">
                <b
                  >Member has already completed payment for
                  {{ selected_payment_item.label }}</b
                >
              </small>
            </div>
            <div class="q-mb-md">
              <label for="credential" class="form_field">Comment </label>
              <q-input
                v-model="contribution.comment"
                outlined
                type="textarea"
                placeholder="Provide any comment about this contribution"
                :disable="has_completed_payment"
              />
            </div>
            <div class="flex q-mt-lg justify-end">
              <div class="q-mr-lg">
                <q-btn
                  class="form_button"
                  label="Reset"
                  :color="'primary'"
                  :disabled="!validateForm"
                  no-caps
                  outline
                  @click="resetForm"
                >
                </q-btn>
              </div>
              <div>
                <ButtonVue
                  class="form_button"
                  :label="'Save'"
                  :loading="loading"
                  :color="'primary'"
                  :disabled="validateForm"
                  :no_caps="true"
                >
                </ButtonVue>
              </div>
            </div>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import PaymentCategoryMixinVue from "src/mixins/PaymentCategoryMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import ContributionsMixinVue from "src/mixins/ContributionsMixin.vue";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const quarters = [
  "January-March",
  "April-June",
  "July-September",
  "October-December",
];
export default {
  mixins: [
    PaymentCategoryMixinVue,
    organisationMixinVue,
    memberMixinVue,
    ContributionsMixinVue,
  ],

  mounted() {
    let heading = "Contribution Information";

    this.$emit("set-heading", heading);

    let organisation_id = this.getOrganisationId;

    if (this.getMembersFromState().length == 0) {
      this.getOrganisationMembers(organisation_id, false);
    } else {
      this.getMembersFromState();
    }

    if (this.getPaymentCategoriesFromState().length == 0) {
      this.fetchCategories(organisation_id, false);
    }
  },

  data() {
    return {
      loading: false,
      contribution: {
        user_id: null,
        payment_item_id: null,
        amount_deposited: 0,
        comment: "",
        balance: 0,
        amount_payable: 0,
        total_amount_deposited: 0,
        payment_category_id: null,
        id: null,
        month_name: "",
        quarterly_name: "",
      },
      position: "right",
      error_bal: false,
      dialog: false,
      has_completed_payment: false,
      has_selected_payment_item: false,
      filtered_payment_items: [],
      payment_items_by_category: [],
      selected_payment_item: null,
      payment_categories: [],
      members: [],
      monthsOptions: [],
      quartersOptions: quarters,
    };
  },
  computed: {
    checkPaymentItemBal() {
      return this.contribution.amount_deposited != 0 &&
        parseFloat(this.contribution.amount_deposited) +
          parseFloat(this.contribution.total_amount_deposited) >
          parseFloat(this.contribution.amount_payable)
        ? true
        : false;
    },

    validateForm() {
      return this.contribution.user_id === null ||
        this.contribution.amount_deposited == 0 ||
        this.contribution.payment_item_id == null ||
        this.checkPaymentItemBal ||
        (this.validetePaymentItemFrequency &&
          this.contribution.month_name == "") ||
        (this.valideteQuarterlyPaymentItemFrequency &&
          this.contribution.quarterly_name == "")
        ? true
        : false;
    },

    validatePaymentItem() {
      return this.contribution.payment_category_id == null ||
        this.contribution.payment_item_id == null
        ? true
        : false;
    },

    valideteMonthlyPaymentItemFrequency() {
      return this.contribution.payment_item_id != null &&
        this.contribution.payment_item_id.frequency == "MONTHLY"
        ? true
        : false;
    },

    valideteQuarterlyPaymentItemFrequency() {
      return this.contribution.payment_item_id != null &&
        this.contribution.payment_item_id.frequency == "QUARTERLY"
        ? true
        : false;
    },
  },
  methods: {
    onAddContribution() {
      let payload = {
        url: `/api/protected/contributions`,
        data: {
          user_id: this.contribution.user_id.value,
          amount_deposited: parseFloat(this.contribution.amount_deposited),
          payment_item_id: this.contribution.payment_item_id.value,
          comment: this.contribution.comment,
          month_name: this.contribution.month_name,
          quarterly_name: this.contribution.quarterly_name
            .replace("-", "").trim(),
        },
        msg: "Member Contribution saved Successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.setDispatchAction(payload, this.contribution.payment_item_id);
    },

    fetchPaymentItems() {
      let payload = {
        status: "none",
        url: `/api/protected/payment-categories/${this.contribution.payment_category_id.value}/payment-items`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.payment_items_by_category = [];
        if (res.success) {
          res.data.data.forEach((ele) => {
            this.payment_items_by_category.push({
              label: ele.name,
              value: ele.id,
              amount: ele.amount,
              frequency: ele.frequency,
            });
          });
        }
      });
      return this.payment_items_by_category;
    },

    fetchPaymentItem() {
      if (this.contribution.payment_item_id != null) {
        this.selected_payment_item = this.filtered_payment_items.find(
          (item) => item.value == this.contribution.payment_item_id.value
        );
        if (this.selected_payment_item != undefined) {
          this.contribution.amount_payable = this.selected_payment_item.amount;
        }
      }
    },

    selectMember() {
      this.has_completed_payment = false;
      let user_id =
        this.contribution.user_id != null
          ? this.contribution.user_id.value
          : "";
      let amount_deposited_payload = {
        status: "none",
        url: `/api/protected/contributions/users/${user_id}/items/${this.contribution.payment_item_id.value}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store
        .dispatch("getRequest", amount_deposited_payload)
        .then((res) => {
          // //set the balance to be paid by the member has paid anything got the item before
          if (res) {
            this.contribution.total_amount_deposited = res.data;
            this.contribution.balance =
              this.contribution.amount_payable - res.data;
            if (this.contribution.balance == 0) {
              this.has_completed_payment = true;
            }
          }
        });
    },

    setPaymentItemBalance() {
      let total_amount_paid =
        parseFloat(this.contribution.total_amount_deposited) +
        parseFloat(this.contribution.amount_deposited);
      this.contribution.balance =
        this.contribution.amount_deposited != 0
          ? this.contribution.amount_payable - total_amount_paid
          : this.contribution.amount_payable -
            this.contribution.total_amount_deposited;
    },

    resetForm() {
      this.has_selected_payment_item = false;
      this.has_completed_payment = false;
      this.contribution.user_id = null;
      this.contribution.amount_payable = 0.0;
      this.contribution.amount_deposited = 0.0;
      this.contribution.balance = null;
      this.contribution.comment = null;
      this.contribution.payment_item_id = null;
      this.contribution.payment_category_id = null;
      this.contribution.id = null;
      this.contribution.total_amount_deposited = 0.0;
      this.contribution.month_name = "";
      this.contribution.quarterly_name = "";

      return this.contribution;
    },

    setDispatchAction(payload, payment_item) {
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then(() => {
          let data = {
            payment_item_id: payment_item,
            year: this.$store.getters.getCurrentYear.id,
            month: "",
            date: "",
            status: "",
            date_range: "",
          };
          this.filterMembersContributions(data);
          this.resetForm();
        })
        .finally(() => {
          this.$emit("close-right-drawer");
          this.loading = false;
        });
    },

    filterPaymentItems(val, update, abort) {
      if (val < 2) {
        this.start_filtering = false;
        abort();
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.filtered_payment_items = this.payment_items_by_category.filter(
          (item) => item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.filtered_payment_items;
      });
    },

    getPaymentCategoriesFromState() {
      this.payment_categories = [];
      this.$store.getters.getPaymentCategories.forEach((ele) => {
        this.payment_categories.push({
          label: ele.name,
          value: ele.id,
        });
      });

      return this.payment_categories;
    },

    filterPaymentCategories(val, update, abort) {
      if (val < 2) {
        this.start_filtering = false;
        abort();
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.payment_categories = this.getPaymentCategoriesFromState().filter(
          (item) => item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.payment_categories;
      });
    },

    getMembersFromState() {
      this.members = [];
      this.$store.getters.getMembers.forEach((ele) => {
        this.members.push({
          label: ele.name,
          value: ele.id,
        });
      });

      return this.members;
    },

    filterMembers(val, update, abort) {
      if (val < 2) {
        this.start_filtering = false;
        abort();
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.members = this.getMembersFromState().filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.members;
      });
    },

    filterMonths(val, update, abort) {
      if (val.length < 2) {
        abort();
        return;
      }
      if (this.month == "") {
        this.monthsOptions = months;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.monthsOptions = months.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
  },
  components: {
    ButtonVue,
  },
};
</script>

<style scoped lang="scss">
.button {
  width: 100%;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.noPaymentItems {
  color: $grey2;
}
</style>
