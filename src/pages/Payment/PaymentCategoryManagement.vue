<template>
  <q-page>
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-md"
        v-if="getLoadingState"
      />
    </div>

    <!-- header for filter categories -->
    <div>
      <div
        class="row q-ml-xs q-pt-xs"
        :class="$q.screen.lg ? 'q-pa-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <q-select
            v-model="year"
            outlined
            dense
            :options="getSessionsFromState"
            :label="$t('app.selectYearLabel')"
          />
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-ml-md">
          <q-btn
            :label="$t('app.filter')"
            :loading="is_fetching"
            color="primary"
            :disabled="validateFilter"
            @click="filterPaymentCategories"
            no-caps
            icon-right="filter_list"
          >
          </q-btn>
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn
            :label="$t('app.print')"
            :loading="loading"
            color="positive"
            :disabled="validateDownload"
            no-caps
            icon-right="print"
            @click="downloadPaymentCategory"
          ></q-btn>
        </div>
      </div>
      <!-- table for categories -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <CategoryTable
            :columns="columns"
            :data="getData"
            :label="label"
            :message="message"
            :show_payment_category="true"
            :show_payment_item="false"
            :show_expenditure_category="false"
            :show_expenditure_item="false"
            @delete-row="deleteRow"
            @show-payment-items="showPaymentItems"
            @update-payment-category="updatePaymentCategory"
          >
          </CategoryTable>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import PaymentCategoryMixinVue from "src/mixins/PaymentCategoryMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import CurrentYearMixin from "src/mixins/CurrentYearMixin.vue";

export default {
  mixins: [PaymentCategoryMixinVue, HelperMixinVue, CurrentYearMixin],
  mounted() {
    let id = this.$store.getters.getOrganisation.id;
    this.fetchCategories(id, true);
  },
  data() {
    return {
      year: null,
      is_fetching: false,
      loading: false,
      columns: [
        {
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
        },
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "item",
          align: "center",
          label: "",
          field: "item",
        },
        {
          name: "action",
          label: "Action",
          field: "action",
        },
      ],
      label: this.$t("app.delete"),
      message: this.$t("app.deletePaymentCategoryWarningMsg"),
      filteredPaymentCategories: [],
      is_filtering: false,
    };
  },
  computed: {
    getData() {
      let data = [];
      if (this.filteredPaymentCategories.length == 0 && !this.is_filtering) {
        this.$store.getters.getPaymentCategories.forEach((element) => {
          data.push({
            counter:
              this.$store.getters.getPaymentCategories.indexOf(element) + 1,
            name: element.name,
            item: this.$t("app.viewPaymentItems"),
            id: element.id,
            description: element.description,
            type: "PAYMENT_CATEGORY",
            organisation_id: element.organisation_id,
          });
        });
      } else {
        data = this.filteredPaymentCategories;
      }
      return data;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    validateFilter() {
      return this.year == null;
    },

    validateDownload() {
      return this.getData.length == 0;
    },
  },

  watch: {
    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },

  methods: {
    updatePaymentCategory(data) {
      this.$store.dispatch("setUpdatedPayCategories", data.data);

      this.$emit("update-payment-category", data);
    },

    showPaymentItems(data) {
      this.getPaymentItemsByCategory(data.data.id);

      let intermediate_tabs = [];

      intermediate_tabs.push({
        name: this.$t("app.paymentItemLabel"),
        has_intermediate_tab: true,
      });

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);

      this.$store.dispatch("setCurrentPaymentCategory", data.data);
    },

    updatePaymentItems(data) {
      this.$emit("update-payment-item", data);
    },

    filterPaymentCategories() {
      this.$router.push({
        path: "/dashboard/payment-categories",
        query: { year: this.year.label },
      });

      this.filteredPaymentCategories = [];
      let year = this.year.label.substring(0, 4);

      let organisationId = this.$store.getters.getOrganisation.id;
      this.is_fetching = true;
      let payload = {
        url: `/api/protected/filter-payment-categories?organisation_id=${organisationId}&year=${year}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.paymentCategoryErrorMsg"),
        has_commit: false,
        show_feedback: false,
        show_spinner: true,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.is_filtering = true;
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.is_fetching = false;
        res.data.forEach((element) => {
          this.filteredPaymentCategories.push({
            counter: res.data.indexOf(element) + 1,
            name: element.name,
            item: this.$t("app.viewPaymentItems"),
            id: element.id,
            description: element.description,
            type: "PAYMENT_CATEGORY",
            organisation_id: element.organisation_id,
          });
        });
      });
    },

    downloadPaymentCategory() {
      let year = this.year != null ? this.year.label.substring(0, 4) : null;

      let organisationId = this.$store.getters.getOrganisation.id;
      let url = `/api/protected/download-payment-categories?organisation_id=${organisationId}&year=${year}`;
      let file_name = "Organisation_Payment_Categories.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    getPaymentItemsByCategory(id) {
      let payload = {
        status: "none",
        url: `/api/protected/payment-categories/${id}/payment-items`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_PAYMENT_ITEMS",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    deleteRow(data) {
      let payload = {
        url: `/api/protected/organisations/${data.organisation_id}/payment-categories/${data.id}`,
        msg: this.$t("app.deletePaymentItemFeedbackMsg"),
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
      this.$store.dispatch("deleteRequest", payload).then(() => {
        this.fetchCategories(data.organisation_id, true);
      });
    },
  },
  components: {
    CategoryTable,
  },
};
</script>

<style lang="scss" scoped></style>
