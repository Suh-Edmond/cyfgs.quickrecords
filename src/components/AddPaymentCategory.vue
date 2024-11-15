<template>
  <div
    class="q-my-md"
    :class="$q.platform.is.mobile ? 'q-ml-lg q-mr-md' : 'q-mx-lg'"
  >
    <div class="q-ml-sm">
      <label class="text-muted info"
        >{{ $t("app.warningField") }}<span class="text-red">*</span
        >{{ $t("app.fields") }}</label
      >
    </div>
    <div class="q-mt-lg">
      <q-form @submit="onAddPaymentCategory" class="q-gutter-md">
        <div>
          <label for="credential" class="form_field"
            >{{ $t("app.nameLabel") }} <span class="text-red">*</span></label
          >
          <q-input
            v-model="payment_category.name"
            outlined
            dense
            type="text"
            :readonly="checkTreasurerRole()"
          />
        </div>
        <div>
          <label for="credential" class="form_field"
            >{{ $t("app.codeLabel") }} <span class="text-red">*</span></label
          >
          <q-input
            v-model="payment_category.code"
            bottom-slots
            outlined
            dense
            type="text"
            :readonly="checkTreasurerRole()"
          >
            <template v-slot:hint>
              {{ $t("app.codeHintCategory") }}
            </template>
          </q-input>
        </div>
        <div>
          <label for="credential" class="form_field"
            >{{ $t("app.description") }} <span class="text-red">*</span></label
          >
          <q-input
            v-model="payment_category.description"
            outlined
            dense
            type="textarea"
            placeholder="Please provide a description about the category"
            :readonly="checkTreasurerRole()"
          />
        </div>
        <div
          v-if="$q.platform.is.desktop"
          :class="
            $q.platform.is.desktop
              ? 'flex q-mt-lg justify-end'
              : 'q-pt-xs q-mb-lg'
          "
        >
          <ButtonVue
            :label="label_save"
            :loading="loading"
            :color="'primary'"
            :disabled="validateForm"
            :no_caps="no_caps"
          >
          </ButtonVue>
        </div>
        <div v-if="$q.platform.is.mobile" class="full-width q-ml-md">
          <ButtonVue
            :label="label_save"
            :loading="loading"
            :color="'primary'"
            :disabled="validateForm"
            :no_caps="no_caps"
          >
          </ButtonVue>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import PaymentCategoryMixinVue from "src/mixins/PaymentCategoryMixin.vue";
import { LocalStorage } from "quasar";

export default {
  mixins: [PaymentCategoryMixinVue],
  created() {
    let heading = this.$t("app.paymentCategoryHeading");
    this.$emit("set-heading", heading);
  },
  data() {
    return {
      label_save: this.$t("app.saveBtnLabel"),
      loading: false,
      payment_category: {
        name: null,
        description: null,
        id: null,
        code: null,
      },
      position: "right",
      dialog: false,
      no_caps: true,
      organisation_id: this.$store.getters.getOrganisation.id,
    };
  },
  computed: {
    validateForm() {
      return (
        this.payment_category.name === null ||
        this.payment_category.code === null ||
        this.checkTreasurerRole()
      );
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
    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").user_data.roles.find(
        (role) => role.name === "TREASURER"
      );
      return treasurer_role != undefined;
    },

    setRequestUrl() {
      return this.getUpdatedPaymentCategoryFromState() === null
        ? `/api/protected/organisations/${this.organisation_id}/payment-categories`
        : `/api/protected/organisations/${
            this.organisation_id
          }/payment-categories/${this.getUpdatedPaymentCategoryFromState().id}`;
    },
    onAddPaymentCategory() {
      let payload = {
        url: this.setRequestUrl(),
        data: {
          name: this.payment_category.name,
          description: this.payment_category.description,
          id:
            this.getUpdatedPaymentCategoryFromState() !== null
              ? this.getUpdatedPaymentCategoryFromState().id
              : null,
          code: this.payment_category.code,
        },
        msg: this.$t("app.paymentCategorySuccessMsg"),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading = true;
      if (this.getUpdatedPaymentCategoryFromState() === null) {
        this.$store
          .dispatch("postRequest", payload)
          .then(() => {
            this.fetchOrganisationCategories(
              this.organisation_id,
              1,
              10,
              "name",
              ""
            );
          })
          .finally(() => {
            this.loading = false;
            this.resetForm();
            this.$emit("close-right-drawer");
          });
      } else {
        this.$store
          .dispatch("putRequest", payload)
          .then(() => {
            this.fetchOrganisationCategories(
              this.organisation_id,
              1,
              10,
              "name",
              ""
            );
          })
          .finally(() => {
            this.loading = false;
            this.resetForm();
            this.$emit("close-right-drawer");
          });
      }
    },

    resetForm() {
      this.payment_category.description = null;
      this.payment_category.name = null;
      this.payment_category.id = null;
      this.payment_category.code = null;
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
      this.payment_category.code = data == null ? null : data.code;

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
  font-size: 0.7rem;
  align-items: center;
  color: $grey5;
}

.info {
  color: $grey2;
  font-size: smaller;
}
</style>
