<template>
  <q-page>
    <!-- header for filter categories -->
    <div>
      <FilterComponentVue
        :show_member_filters="false"
        :show_categories="true"
        :loading_download="loading_download"
        :disable_download_btn="validateDownload"
        @filter-categories="filterPaymentCategories"
        @download-categories="downloadPaymentCategory"
      >
      </FilterComponentVue>
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
            :pagination="pagination"
            :table_loading="table_loader"
            @delete-row="deleteRow"
            @show-payment-items="showPaymentItems"
            @update-payment-category="updatePaymentCategory"
            @onRequest="onRequest"
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
import FilterComponentVue from "src/components/FilterComponent.vue";

export default {
  mixins: [PaymentCategoryMixinVue, HelperMixinVue, CurrentYearMixin],
  mounted() {
    this.fetchOrganisationCategories(1, 7, "name");
  },
  data() {
    return {
      year: null,
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
          name: "code",
          required: true,
          label: "Code",
          align: "left",
          field: (row) => row.code,
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
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 7,
        rowsNumber: 0,
      },
      table_loader: false,
      organisation_id: this.$store.getters.getOrganisation.id,
    };
  },
  computed: {
    getData() {
      let data = [];
      if (this.$store.getters.getPaymentCategories !== null) {
        this.$store.getters.getPaymentCategories.data.forEach((element) => {
          data.push({
            counter:
              this.$store.getters.getPaymentCategories.data.indexOf(element) +
              1,
            name: element.name,
            item: this.$t("app.viewPaymentItems"),
            id: element.id,
            description: element.description,
            type: "PAYMENT_CATEGORY",
            organisation_id: element.organisation_id,
            code: element.code,
          });
        });
      }
      return data;
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
    onRequest(props) {
      const { page, rowsPerPage, sortBy } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.fetchOrganisationCategories(page, fetch_count, sortBy, false, "");
    },

    fetchOrganisationCategories(page, per_page, sort_by, year) {
      let year_value =
        this.$store.getters.getCurrentYear !== null
          ? this.$store.getters.getCurrentYear.year
          : year;
      let payload = {
        url: `/api/protected/organisation/payment-categories?organisation_id=${this.organisation_id}&year=${year_value}&page=${page}&per_page=${per_page}&sort_by=${sort_by}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        commit: "SET_PAYMENT_CATEGORIES",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.commit("SET_PAYMENT_CATEGORIES", null);
      this.table_loader = true;
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.pagination.page = response.data.current_page;
          this.pagination.rowsNumber = response.data.total;
          this.pagination.rowsPerPage = response.data.per_page;
        })
        .finally(() => {
          this.table_loader = false;
        });
    },

    updatePaymentCategory(data) {
      this.$store.dispatch("setUpdatedPayCategories", data.data);

      this.$emit("update-payment-category", data);
    },

    showPaymentItems(data) {
      this.$emit("fetch-payment-items", data);

      let intermediate_tabs = [];

      intermediate_tabs.push({
        name: this.$t("app.paymentItemLabel"),
        has_intermediate_tab: true,
      });

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);

      this.$store.dispatch("setCurrentPaymentCategory", data);
    },

    updatePaymentItems(data) {
      this.$emit("update-payment-item", data);
    },

    filterPaymentCategories(data) {
      this.$router.push({
        path: "/dashboard/payment-categories",
        query: { year: data.year.label, t: new Date().getTime() },
      });

      this.fetchOrganisationCategories(1, 7, "name", data.year.label);
    },

    downloadPaymentCategory(data) {
      let url = `/api/protected/download-payment-categories?organisation_id=${this.organisation_id}&year=${data.year.label}`;
      let file_name = "Organisation_Payment_Categories.pdf";
      this.loading = this.downloadPdf(url, file_name);
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
        this.fetchOrganisationCategories(1, 1, "name", null);
      });
    },
  },
  components: {
    CategoryTable,
    FilterComponentVue,
  },
};
</script>

<style lang="scss" scoped></style>
