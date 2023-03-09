<template>
  <div class="q-pa-md">
    <div class="q-ml-sm q-mb-lg">
      <label class="text-muted"
        >All fields with <span class="text-red">*</span> are required</label
      >
    </div>
    <div class="q-mt-lg q-mx-sm">
      <q-form @submit="onAddPaymentCategory" class="q-gutter-md">
        <div>
          <label for="credential" class="form_field"
            >Name <span class="text-red">*</span></label
          >
          <q-input v-model="payment_category.name" outlined dense type="text" />
        </div>
        <div>
          <label for="credential" class="form_field"
            >Description <span class="text-red">*</span></label
          >
          <q-input
            v-model="payment_category.description"
            outlined
            dense
            type="textarea"
            placeholder="Please provide a description about the category"
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
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import PaymentCategoryMixinVue from "src/mixins/PaymentCategoryMixin.vue";

export default {
  mixins: [organisationMixinVue, PaymentCategoryMixinVue],
  created() {
    let heading = "Payment Category Information";
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
        id: null,
      },
      position: "right",
      dialog: false,
      no_caps: true,
    };
  },
  computed: {
    validateForm() {
      return this.payment_category.name === null ? true : false;
    },
    getUpdatedCategory() {
      return this.setFormField(this.getUpdatedPaymentCategoryFromState());
    },
  },
  watch: {
    getUpdatedCategory() {
      return this.setFormField(this.getUpdatedPaymentCategoryFromState());
    },
  },
  methods: {
    onAddPaymentCategory() {
      let id = this.getOrganisationId;
      let payload = {
        url: `/api/protected/organisations/${id}/payment-categories`,
        data: {
          name: this.payment_category.name,
          description: this.payment_category.description,
          id: this.getUpdatedPaymentCategoryFromState() != null ? this.getUpdatedPaymentCategoryFromState().id: null,
        },
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
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then(() => {
          this.fetchCategories(id, true);
        })
        .finally(() => {
          this.loading = false;
          this.resetForm();
          this.$emit("close-right-drawer");
        });
    },

    resetForm() {
      this.payment_category.description = null;
      this.payment_category.name = null;
      this.payment_category.id = null
      return this.payment_category;
    },

    getUpdatedPaymentCategoryFromState() {
      return this.$store.getters.getUpdatedPaymentCategory;
    },

    setFormField(data) {
      (this.payment_category.name = data == null ? null : data.name),
        (this.payment_category.description =
          data == null ? null : data.description),
        (this.id = data == null ? null : data.id);

      return this.payment_category;
    },
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
