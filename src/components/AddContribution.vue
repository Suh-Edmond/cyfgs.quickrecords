<template>
  <div class="q-pa-md">
    <div class="q-mt-md q-mx-md">
      <q-form @submit="onAddContribution" class="q-gutter-md">
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
            input-debounce="0"
            use-input
            hide-selected
            fill-input
          >
          </q-select>
        </div>
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
            :options="getPaymentItems"
            input-debounce="0"
            @input="fetchPaymentItem"
          >
          </q-select>
          <small
            v-if="
              contribution.payment_category_id != null &&
              !checkIsExistPaymentItem
            "
            class="noPaymentItems"
            >No Payment items found under this category</small
          >
        </div>
        <div class="q-mb-md">
          <label for="credential" class="form_field"
            >Amount Payable (XAF)</label
          >
          <q-input
            v-model="contribution.amount_payable"
            outlined
            dense
            type="number"
            disable
          />
        </div>
        <div class="q-mb-md" v-show="hasMadePayment">
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
          >
          </q-input>
          <small v-show="checkPaymentItemBal" class="text-red">
            Amount deposited can not be more than the specified amount for the
            item
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
          />
        </div>
        <div class="row q-mt-lg justify-end">
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

    this.getOrganisationMembers(organisation_id);

    this.setFormFields();
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
      hasMadePayment: false,
    };
  },
  computed: {
    checkPaymentItemBal() {
      let in_range = false;
      if (this.$store.getters.getCurrentPaymentItem != null) {
        in_range =
          this.contribution.amount_deposited >
          this.$store.getters.getCurrentPaymentItem.amount;
      }
      return in_range;
    },

    validateForm() {
      return this.contribution.user_id === null ||
        this.contribution.amount_deposited == 0 ||
        this.contribution.payment_item_id == null ||
        this.checkPaymentItemBal
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

    checkIsExistPaymentItem() {
      return this.getPaymentItems.length > 0;
    },
  },
  methods: {
    onAddContribution() {
      let payload = {
        url: this.setActionUrl(this.contribution.id),
        data: {
          user_id: this.contribution.user_id.value,
          amount_deposited:parseFloat(this.contribution.amount_deposited),
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
      this.setDispatchAction(this.contribution.id, payload);
    },

    fetchPaymentItems() {
      this.getPaymentItemsByCategory(
        this.contribution.payment_category_id.value
      );
    },

    fetchPaymentItem() {
      let payload = {
        status: "none",
        url: `/api/protected/payment-categories/${this.contribution.payment_category_id.value}/payment-items/${this.contribution.payment_item_id.value}`,
        has_path_val: true,
        show_feedback: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_CURRENT_PAYMENT_ITEM",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {
        //payload to check the amount that has been deposited by the user
        let amount_deposited_payload = {
          status: "none",
          url: `/api/protected/contributions/users/${this.contribution.user_id.value}/items/${this.contribution.payment_item_id.value}`,
          has_path_val: true,
          show_feedback: false,
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
            //set the balance to be paid id the member has paid anything got the item before
            if (res.data > 0) {
              this.hasMadePayment = true;
              this.contribution.total_amount_deposited = res.data;
              this.contribution.balance = (this.contribution.amount_payable - res.data)
            }
          });

        //set the total amount to be paid
        this.contribution.amount_payable =
          this.$store.getters.getCurrentPaymentItem.amount;
      });
    },

    setPaymentItemBalance() {
      let total_amount_paid = parseFloat(this.contribution.total_amount_deposited) + parseFloat(this.contribution.amount_deposited);
      this.contribution.balance = this.$store.getters.getCurrentPaymentItem.amount - total_amount_paid;
    },

    resetForm() {
      this.contribution.user_id = null;
      this.contribution.amount_payable = 0.0;
      this.contribution.amount_deposited = 0.0;
      this.contribution.balance = null;
      this.contribution.comment = null;
      this.contribution.payment_item_id = null;
      this.contribution.payment_category_id = null;
      this.contribution.id = null;
      contribution.total_amount_deposited = 0.0

      return this.contribution;
    },

    setActionUrl(id) {
      let url = "";
      if (id === null) {
        url = `/api/protected/contributions`;
      } else {
        url = `/api/protected/contributions/${id}/update`;
      }
      return url;
    },

    setDispatchAction(id, payload) {
      this.loading = true;
      if (id === null) {
        this.$store
          .dispatch("postRequest", payload)
          .then(() => {
            this.getMembersContributionsByPaymentItem(
              payload.data.payment_item_id
            );

            this.setCurrentContributedPaymentItem(payload.data.payment_item_id);
          })
          .finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
            this.resetForm();
          });
      } else {
        this.$store
          .dispatch("putRequest", payload)
          .then(() => {
            this.getMembersContributionsByPaymentItem(id);
            this.setCurrentContributedPaymentItem(id);
          })
          .finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
            this.resetForm();
            this.$store.dispatch("setEditState", false);
          });
      }
    },

    setCurrentContributedPaymentItem(id) {
      let item = null;
      item = this.$store.getters.getPaymentItems.data.filter(
        (ele) => ele.id === id
      );
      this.$store.dispatch("setCurrentPaymentItem", item[0]); //set the state with the first element from the filtered array
    },

    setFormFields() {
      let data = this.$store.getters.getSelectedContribution;
      let payment_item = this.$store.getters.getCurrentPaymentItem;

      let payment_category =
        payment_item != null
          ? this.$store.getters.getPaymentCategories.find(
              (ele) => ele.id === payment_item.payment_category_id
            )
          : [];

      if (data != null && this.$store.getters.getEditState) {
        let member = this.$store.getters.getMembers.find(
          (ele) => ele.id == data.user_id
        );
        this.contribution.user_id = { label: member.name, value: member.id };
        this.contribution.payment_item_id = {
          label: payment_item.name,
          value: payment_item.id,
        };
        this.contribution.amount_deposited = data.amount_deposited;
        this.contribution.comment = data.comment;
        this.contribution.balance = data.balance;
        this.contribution.amount_payable = data.payment_item_amount;
        (this.contribution.payment_category_id = {
          label: payment_category.name,
          value: payment_category.id,
        }),
          (this.contribution.id = data.id);
      }
      return this.contribution;
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
