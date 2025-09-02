<template>
  <div
    class="q-my-md"
    :class="$q.platform.is.mobile ? 'q-ml-lg q-mr-md' : 'q-mx-md'"
  >
    <div class="q-mb-md">
      <label class="text-muted info"
        >{{ $t("app.warningField") }}<span class="text-red">*</span
        >{{ $t("app.fields") }}</label
      >
    </div>
    <div class="q-mt-md">
      <q-form @submit="onAddExpenditureCategory" class="q-gutter-md">
        <div>
          <label class="form_field"
            >{{ $t("app.nameLabel") }} <span class="text-red">*</span></label
          >
          <q-input v-model="expenditure.name" outlined dense type="text" />
        </div>
        <div>
          <label class="form_field"
            >{{ $t("app.codeLabel") }} <span class="text-red">*</span></label
          >
          <q-input
            v-model="expenditure.code"
            outlined
            bottom-slots
            dense
            type="text"
          >
            <template v-slot:hint>
              {{ $t("app.codeHintCategory") }}
            </template>
          </q-input>
        </div>
        <div>
          <label class="form_field"
            >{{ $t("app.description") }} <span class="text-red">*</span></label
          >
          <q-input
            v-model="expenditure.description"
            outlined
            dense
            type="textarea"
            :placeholder="$t('app.provideDescription')"
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
        <div v-if="$q.platform.is.mobile" class="q-gutter-y-lg q-mb-lg q-mt-sm">
          <ButtonVue
            :label="label_save"
            :loading="loading"
            :color="'primary'"
            :disabled="validateForm"
            :no_caps="no_caps"
            class="full-width"
          >
          </ButtonVue>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import ExpenditureCategoryMixinVue from "src/mixins/ExpenditureCategoryMixin.vue";

export default {
  mixins: [organisationMixinVue, ExpenditureCategoryMixinVue],
  created() {
    let heading = this.$t("app.expenditureCategoryHeading");
    this.$emit("set-heading", heading);
  },
  data() {
    return {
      label_save: this.$t("app.saveBtnLabel"),
      loading: false,
      color: "primary",
      expenditure: {
        name: null,
        description: null,
        id: null,
        code: null,
      },
      position: "right",
      dialog: false,
      no_caps: true,
    };
  },
  computed: {
    validateForm() {
      return this.expenditure.name == null ||
        this.expenditure.description == null;
    },
    getUpdatedExpenditureCategory() {
      return this.setFormField(this.getUpdatedExpenditureCategoryFromState());
    },
  },
  watch: {
    getUpdatedExpenditureCategory() {
      return this.setFormField(this.getUpdatedExpenditureCategoryFromState());
    },
  },
  methods: {
    setRequestUrl() {
      let id = this.getOrganisationId;
      return this.getUpdatedExpenditureCategoryFromState() === null
        ? `/api/protected/organisations/${id}/expenditure-categories`
        : `/api/protected/organisations/${id}/expenditure-categories/${
            this.getUpdatedExpenditureCategoryFromState().id
          }`;
    },
    onAddExpenditureCategory() {
      let current_session_id = this.$store.getters.getCurrentYear.id;
      let payload = {
        url: this.setRequestUrl(),
        data: {
          name: this.expenditure.name,
          description: this.expenditure.description,
          id:
            this.getUpdatedExpenditureCategoryFromState() == null
              ? null
              : this.getUpdatedExpenditureCategoryFromState().id,
          code: this.expenditure.code,
        },
        msg: this.$t("app.expenditureCategorySuccessMsg"),
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
      if (this.getUpdatedExpenditureCategoryFromState() == null) {
        this.$store
          .dispatch("postRequest", payload)
          .then(() => {
            this.fetchOrganisationExpenditureCategories(
              this.$store.getters.getOrganisation.id,
              1,
              10,
              "name",
              "",
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
            this.fetchOrganisationExpenditureCategories(
              this.$store.getters.getOrganisation.id,
              1,
              10,
              "name",
              "",
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
      this.expenditure.description = null;
      this.expenditure.name = null;
      this.expenditure.id = null;
      this.expenditure.code = null;
      return this.expenditure;
    },

    getUpdatedExpenditureCategoryFromState() {
      return this.$store.getters.getUpdatedExpenditureCategory;
    },

    setFormField(data) {
      (this.expenditure.name = data == null ? null : data.name),
        (this.expenditure.description = data == null ? null : data.description),
        (this.id = data == null ? null : data.id);
      this.expenditure.code = data == null ? null : data.code;

      return this.expenditure;
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
  font-size: 0.8rem;
  align-items: center;
  color: $grey5;
}

.info {
  color: $grey2;
  font-size: smaller;
}
</style>
