<template>
  <div class="q-pa-md">
    <div class="q-ml-sm q-mb-lg">
      <label class="text-muted"
        >All fields with <span class="text-red">*</span> are required</label
      >
    </div>
    <div class="q-px-sm">
      <q-form @submit="onUpdateContribution" class="q-gutter-md">
        <div>
          <div class="q-mb-md">
            <label for="name" class="form_field">Payment Category </label>
            <q-select
              outlined
              dense
              v-model="contribution.payment_category_id"
              disable
            >
            </q-select>
          </div>
          <div class="q-mb-md">
            <label for="name" class="form_field">Payment Item </label>
            <q-select
              outlined
              dense
              v-model="contribution.payment_item_id"
              disable
            >
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

          <div>
            <div class="q-mb-md">
              <label for="name" class="form_field">Member's Name </label>
              <q-select
                outlined
                dense
                v-model="contribution.user_id"
                placeholder="Type name to search..."
                disable
              >
              </q-select>
            </div>
            <div class="q-mb-md">
              <label for="credential" class="form_field"
                >Amount Deposited(XAF) <span class="text-red">*</span></label
              >
              <q-input
                v-model.lazy="contribution.amount_deposited"
                outlined
                dense
                type="number"
                @keyup="depositedAmount"
              >
              </q-input>
              <small v-if="checkPaymentItemBal" class="text-red">
                <b>Amount deposited can not be more than Amount Payable</b>
              </small>
            </div>
            <div class="q-mb-md">
              <label for="credential" class="form_field">Comment </label>
              <q-input
                v-model="contribution.comment"
                outlined
                dense
                type="textarea"
                placeholder="Provide any comment about this contribution"
              />
            </div>
            <div class="row q-mt-lg justify-end">
              <div class="col-md-2 col-sm-2 col-xs-2 q-mr-lg">
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
              <div class="col-md-2 col-sm-2 col-xs-2">
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
import ContributionsMixinVue from "src/mixins/ContributionsMixin.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";

export default {
  mixins: [ContributionsMixinVue, HelperMixin],

  mounted() {
    let heading = "Edit Member's Contribution";

    this.$emit("set-heading", heading);

    this.setFormFields();
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
      },
      amount_has_exceed: false,
      amount_before_update:
        this.$store.getters.getSelectedContribution.amount_deposited,
    };
  },
  computed: {
    validateForm() {
      return this.contribution.amount_deposited == 0 || !this.amount_has_exceed
        ? false
        : true;
    },

    hasCompletedPayment() {
      return (
        parseFloat(this.contribution.total_amount_deposited) ==
        parseFloat(
          this.$store.getters.getSelectedContribution.payment_item_amount
        )
      );
    },

    getContributedPaymentItemTitle() {
      return this.$store.getters.getSelectedContribution.payment_item_name;
    },

    checkPaymentItemBal() {
      return this.contribution.amount_deposited != 0 &&
        parseFloat(this.contribution.amount_deposited) +
          parseFloat(this.contribution.total_amount_deposited) >
          parseFloat(this.contribution.amount_payable)
        ? true
        : false;
    },
  },
  methods: {
    onUpdateContribution() {
      let payload = {
        url: `/api/protected/contributions/${this.contribution.id}/update`,
        data: {
          user_id: this.contribution.user_id.value,
          amount_deposited: parseFloat(this.contribution.amount_deposited),
          payment_item_id: this.contribution.payment_item_id.value,
          comment: this.contribution.comment == null ? "" : this.contribution.comment,
        },
        msg: "Member Contribution updated Successfully",
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
      this.setDispatchAction(payload);
    },

    setPaymentItemBalance() {
      let total_amount_paid =
        parseFloat(this.contribution.total_amount_deposited) +
        parseFloat(this.contribution.amount_deposited);
      this.contribution.balance =
        this.contribution.amount_payable - total_amount_paid;
    },

    resetForm() {
      this.contribution.user_id = null;
      this.contribution.amount_payable = 0.0;
      this.contribution.amount_deposited = 0.0;
      this.contribution.balance = null;
      this.contribution.comment = "";
      this.contribution.payment_item_id = null;
      this.contribution.payment_category_id = null;
      this.contribution.id = null;
      this.contribution.total_amount_deposited = 0.0;

      return this.contribution;
    },

    setDispatchAction(payload) {
      this.loading = true;
      this.$store
        .dispatch("putRequest", payload)
        .then(() => {
          this.getMemberContributionsByPaymentItem(
            payload.data.payment_item_id,
            payload.data.user_id
          );
          this.resetForm();
        })
        .finally(() => {
          this.$emit("close-right-drawer");
          this.loading = false;
        });
    },

    setFormFields() {
      let data = this.$store.getters.getSelectedContribution;

      this.contribution.user_id = {
        label: data.user_name,
        value: data.user_id,
      };
      this.contribution.payment_item_id = {
        label: data.payment_item_name,
        value: data.payment_item_id,
      };
      this.contribution.amount_deposited = data.amount_deposited;
      this.contribution.comment = data.comment;
      this.contribution.balance = parseFloat(data.balance);
      this.contribution.amount_payable = data.payment_item_amount;
      this.contribution.total_amount_deposited = parseFloat(
        data.total_amount_deposited
      );
      (this.contribution.payment_category_id = {
        label: data.payment_category.name,
        value: data.payment_category.id,
      }),
        (this.contribution.id = data.id);
      return this.contribution;
    },

    depositedAmount() {
      if (this.amount_before_update == this.contribution.amount_deposited) {
        this.contribution.balance = this.contribution.balance;
      } else {
        this.setPaymentItemBalance();
      }
      return true;
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
