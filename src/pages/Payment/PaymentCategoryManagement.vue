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
            :pagination="getPagination"
            :table_loading="getLoadingState"
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
  beforeMount(){
    this.$store.commit("SET_PAGINATION", {
      sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 7,
      rowsNumber: 0,
    });
  },

  mounted() {
    this.fetchOrganisationCategories(this.organisation_id, 1, 7, "name", "");
  },
  data() {
    return {
      year: "",
      loading: false,
      columns: [
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

    getPagination() {
      let paginate_object = {
        sortBy: this.$store.getters.getPagination.sortBy,
        descending: this.$store.getters.getPagination.descending,
        page: this.$store.getters.getPagination.page,
        rowsPerPage: this.$store.getters.getPagination.rowsPerPage,
        rowsNumber: this.$store.getters.getPagination.rowsNumber,
      };

      return paginate_object;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },

  watch: {},

  methods: {
    onRequest(props) {
      const { page, rowsPerPage, sortBy } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.fetchOrganisationCategories(
        this.organisation_id,
        page,
        fetch_count,
        sortBy,
        ""
      );
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

      this.fetchOrganisationCategories(
        this.organisation_id,
        1,
        7,
        "name",
        data.year.label
      );
    },

    downloadPaymentCategory(data) {
      let year_label = data.year !== "" && data.year !== "" ? data.year.label: ""
      let url = `/api/protected/download-payment-categories?organisation_id=${this.organisation_id}&year=${year_label}&sort_by=name`;
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
        this.fetchOrganisationCategories(
          this.organisation_id,
          1,
          7,
          "name",
          ""
        );
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
