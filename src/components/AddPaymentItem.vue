<template>
  <div class="q-pa-md">
    <div class="q-mt-md q-mx-md">
      <q-form @submit="onAddPaymentItem" class="q-gutter-md">
        <div>
          <label for="credential" class="form_field">Name <span class="text-red">*</span></label>
          <q-input v-model="payment_item.name" outlined dense type="text" />
        </div>
        <div>
          <label for="credential" class="form_field">Amount <span class="text-red">*</span></label>
          <q-input v-model="payment_item.amount" outlined dense type="number" />
        </div>
        <div class="flex">
          <div>
            <label for="credential" class="form_field">Compulsory <span class="text-red">*</span></label>
          </div>
          <div class="q-gutter-sm q-ml-lg">
            <q-radio dense v-model="payment_item.complusory" :val=true label="YES" size="xs" />
            <q-radio dense v-model="payment_item.complusory" :val=false label="NO" size="xs" />
          </div>
        </div>
        <div>
          <label for="credential" class="form_field">Description <span class="text-red">*</span></label>
          <q-input v-model="payment_item.description" outlined dense type="textarea"
            placeholder="Please provide a description about the category" />
        </div>
        <div class="row q-mt-lg justify-end">
          <div class="col-md-2 col-sm-2 col-xs-2">
            <ButtonVue class="form_button" :label="label_save" :loading="loading" :color="color"
              :disabled="validateForm" :no_caps="no_caps">
            </ButtonVue>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import PaymentItemMixin from "src/mixins/PaymentItemMixin.vue";
import PaymentItemMixinVue from "src/mixins/PaymentItemMixin.vue";


export default {
  mixins: [PaymentItemMixin, PaymentItemMixinVue],

  created() {
    let heading = "Payment Item Information";
    this.$emit("set-heading", heading);
  },

  data() {
    return {
      label_save: "Save",
      loading: false,
      color: "primary",
      payment_category: {
        name: null,
        description: null,
      },
      position: "right",
      dialog: false,
      no_caps: true,
      payment_item: {
        complusory: true,
        name: null,
        description: null,
        id: null,
        payment_category_id: null,
        amount: 0
      },
    };
  },
  computed: {

    validateForm() {
      return this.payment_item.name === null || this.payment_item.description === null || this.payment_item.amount === 0 ? true : false;
    },

    getUpdatedPaymentItem() {
      return this.setFormFields(this.$store.getters.getUpdatedPaymentItem);
    }
  },

  watch: {
    getUpdatedPaymentItem() {
      return this.setFormFields(this.$store.getters.getUpdatedPaymentItem);
    }
  },

  methods: {
    onAddPaymentItem() {
      let category = this.$store.getters.getCurrentPaymentCategory;
      let payload = {
        url: this.setAddUpdatePaymentItemUrl(this.payment_item, category),
        data: this.payment_item,
        msg: "Payment Category save Successfully",
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
      this.setDispatchAction(this.payment_item, payload, category);
    },

    resetForm() {
      this.payment_item.name = null
      this.payment_item.amount = 0;
      this.payment_item.description = null,
        this.payment_item.complusory = true

      return this.payment_item;
    },

    setAddUpdatePaymentItemUrl(payment_item, category) {
      let url = "";
      if (payment_item.id === null) {
        url = `/api/protected/payment-categories/${category.id}/payment-items`
      } else {
        url = `/api/protected/payment-categories/${category.id}/payment-items/${payment_item.id}`
      }

      return url;
    },

    setDispatchAction(payment_item, payload, category) {
      if (payment_item.id === null) {
        this.loading = true;
        this.$store
          .dispatch("postRequest", payload)
          .then(() => {
            this.getPaymentItemsByCategory(category.id)
          })
          .finally(() => {
            this.loading = false;
            this.resetForm();
            this.$emit("close-right-drawer");
          });
      }
      else {
        this.loading = true;
        this.$store
          .dispatch("putRequest", payload)
          .then(() => {
            this.getPaymentItemsByCategory(category.id)
          })
          .finally(() => {
            this.loading = false;
            this.resetForm();
            this.$emit("close-right-drawer");
          });
      }
    },

    setFormFields(data) {
      this.payment_item.name = data?.name,
      this.payment_item.payment_category_id = data?.payment_category_id;
      this.payment_item.amount = data?.amount;
      this.payment_item.description = data?.description;
      this.payment_item.id = data?.id;
      this.payment_item.complusory = data?.complusory == 1 ? true : false; //because the complusory field value is returned as either 1 or 0

      return this.payment_item;
    }

  },
  components: {
    ButtonVue,
  },
};
</script>

<style scoped lang="scss">
.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}
</style>
