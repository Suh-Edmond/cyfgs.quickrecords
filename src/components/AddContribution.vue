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
              placeholder="Type name to search..."
              :options="getPaymentCategories"
              input-debounce="0"
              @input="fetchPaymentItems"
            >
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
              placeholder="Type name to search..."
              :options="payment_items"
              input-debounce="0"
              @input="fetchPaymentItem"
            >
            </q-select>
            <small
              v-if="
                (contribution.payment_category_id != null && payment_items.length == 0 && contribution.payment_item_id == null)
              "
              class="noPaymentItems"
              >No Payment items found under this category</small
            >
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
                placeholder="Type name to search..."
                :options="getMembers"
                @input="selectMember"
              >
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
                v-model.lazy="contribution.amount_deposited"
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
                dense
                type="text"
                autogrow
                placeholder="Provide any comment about this contribution"
                :disable="has_completed_payment"
              />
            </div>
            <div class="row q-mt-lg justify-end">
              <div class="col-md-2 col-sm-2 col-xs-2 q-mr-lg">
                <q-btn
                  class="form_button"
                  label="Reset"
                  :color="color"
                  :disabled="!validateForm"
                  no-caps
                  outline
                  @click="resetForm"
                >
                </q-btn>
              </div>
              <div class="col-md-2 col-sm-2 col-xs-2">
                <ButtonVue
                  class="form_button"
                  :label="label_save"
                  :loading="loading"
                  :color="color"
                  :disabled="validateForm"
                  :no_caps="no_caps"
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
import PaymentItemMixinVue from "src/mixins/PaymentItemMixin.vue";
import ContributionsMixinVue from "src/mixins/ContributionsMixin.vue";

export default {
  mixins: [
    PaymentCategoryMixinVue,
    organisationMixinVue,
    memberMixinVue,
    PaymentItemMixinVue,
    ContributionsMixinVue,
  ],

  mounted() {
    let heading = "Contribution Information";

    this.$emit("set-heading", heading);

    let organisation_id = this.getOrganisationId;

    this.getOrganisationMembers(organisation_id. false);

    if (this.getPaymentCategories.length == 0) {
      this.fetchCategories(organisation_id, false);
    }
  },

  data() {
    return {
      label_save: "Save",
      loading: false,
      color: "primary",
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
      },
      position: "right",
      error_bal: false,
      dialog: false,
      no_caps: true,
      has_completed_payment: false,
      has_selected_payment_item: false,
      payment_items: [],
      selected_payment_item: null,
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
        this.checkPaymentItemBal
        ? true
        : false;
    },

    validatePaymentItem() {
      return this.contribution.payment_category_id == null ||
        this.contribution.payment_item_id == null
        ? true
        : false;
    },

    getMembers() {
      let members = [];
      this.$store.getters.getMembers.forEach((ele) => {
        members.push({
          label: ele.name,
          value: ele.id,
        });
      });

      return members;
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
      this.setDispatchAction(payload, this.contribution.payment_item_id.value);
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
        if (res.success) {
          res.data.data.forEach((ele) => {
            this.payment_items.push({
              label: ele.name,
              value: ele.id,
              amount: ele.amount,
            });
          });
        }
      });
      return this.payment_items;
    },

    fetchPaymentItem() {
      this.selected_payment_item = this.payment_items.find(
        (item) => item.value == this.contribution.payment_item_id.value
      );
      if (this.selected_payment_item != undefined) {
        this.contribution.amount_payable = this.selected_payment_item.amount;
      }
    },

    selectMember() {
      this.has_completed_payment = false;
      let amount_deposited_payload = {
        status: "none",
        url: `/api/protected/contributions/users/${this.contribution.user_id.value}/items/${this.contribution.payment_item_id.value}`,
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
          this.contribution.total_amount_deposited = res.data;
          this.contribution.balance =
            this.contribution.amount_payable - res.data;
          if (this.contribution.balance == 0) {
            this.has_completed_payment = true;
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

      return this.contribution;
    },

    setDispatchAction(payload, payment_item_id) {
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then(() => {
          let data = {
            payment_item_id: payment_item_id,
            year:null,
            month:null,
            date:null,
            status:null,
            date_range:null
          }
          this.filterMembersContributions(data);
          this.resetForm();
        })
        .finally(() => {
          this.$emit("close-right-drawer");
          this.loading = false;
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
