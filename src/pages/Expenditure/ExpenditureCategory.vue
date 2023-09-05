<template>
  <q-page>
    <div>
      <!-- header for filter categories -->
      <FilterComponentVue
        :show_member_filters="false"
        :show_categories="true"
        :loading_download="loading_download"
        :disable_download_btn="validateDownload"
        @filter-categories="filterExpenditureCategories"
        @download-categories="downloadExpenditureCategory"
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
            :show_payment_category="false"
            :show_payment_item="false"
            :show_expenditure_category="true"
            :show_expenditure_item="false"
            :pagination="pagination"
            :table_loading="table_loader"
            @show-expenditure-items="showExpenditureItems"
            @update-expenditure-category="updateExpenditureCategory"
            @delete-row="onDeleteRow"
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
import ExpenditureCategoryMixinVue from "src/mixins/ExpenditureCategoryMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import CurrentYearMixin from "src/mixins/CurrentYearMixin.vue";
import FilterComponentVue from "src/components/FilterComponent.vue";

export default {
  mixins: [
    ExpenditureCategoryMixinVue,
    organisationMixinVue,
    expenditureItemMixinVue,
    HelperMixinVue,
    CurrentYearMixin,
  ],
  mounted() {
    this.fetchOrganisationExpenditureCategories(1, 7, "name", "");
  },

  data() {
    return {
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
          name: "expenditure_items",
          align: "center",
          label: "",
          field: "expenditure_items",
        },
        {
          name: "action",
          label: "Action",
          field: "action",
        },
      ],
      label: this.$t("app.delete"),
      message: this.$t("app.deleteExpenditureCategoryWarningMsg"),
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
      if (this.$store.getters.getExpenditureCategories !== null) {
        this.$store.getters.getExpenditureCategories.data.forEach((element) => {
          data.push({
            counter:
              this.$store.getters.getExpenditureCategories.data.indexOf(
                element
              ) + 1,
            name: element.name,
            code: element.code,
            expenditure_items: this.$t("app.viewExpenditureItems"),
            id: element.id,
            description: element.description,
            type: "EXPENDITURE_CATEGORY",
            organisation_id: element.organisation_id,
          });
        });
      }
      return data;
    },

    validateDownload() {
      return this.getData.length == 0;
    },
  },
  methods: {
    fetchOrganisationExpenditureCategories(page, per_page, sort_by, year) {
      let year_value =
        this.$store.getters.getCurrentYear !== null
          ? this.$store.getters.getCurrentYear.year
          : year;
      let payload = {
        url: `/api/protected/organisations/${this.organisation_id}/expenditure-categories?year=${year_value}&page=${page}&per_page=${per_page}&sort_by=${sort_by}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        commit: "SET_EXPENDITURE_CATEGORIES",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.commit("SET_EXPENDITURE_CATEGORIES", null);
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

    onRequest(props) {
      const { page, rowsPerPage, sortBy } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.fetchOrganisationExpenditureCategories(
        page,
        fetch_count,
        sortBy,
        ""
      );
    },

    showExpenditureItems(data) {
      this.$store.dispatch(
        "setCurrentExpenditureCategory",
        data.expenditure_items
      );

      let intermediate_tabs = [];

      intermediate_tabs.push({
        name: this.$t("app.expenditureItemLabel"),
        has_intermediate_tab: true,
      });

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);

      this.$emit("show-expenditure-items", data);
    },

    updateExpenditureCategory(data) {
      this.$store.dispatch("setUpdatedExpenditureCategory", data.data);

      this.$emit("update-expenditure-category", data);
    },

    filterExpenditureCategories(data) {
      this.$router.push({
        path: "/dashboard/expenditure-categories",
        query: { year: data.year.label, t: new Date().getTime() },
      });

      this.fetchOrganisationExpenditureCategories(
        1,
        7,
        "name",
        data.year.value
      );
    },

    downloadExpenditureCategory(data) {
      let url = `/api/protected/expenditure-categories/download?organisation_id=${this.organisation_id}&year=${data.year.value}`;
      let file_name = "Expenditure_Categories.pdf";
      this.loading_download = this.downloadPdf(url, file_name);
    },

    onDeleteRow(data) {
      let payload = {
        url: `/api/protected/organisations/${data.organisation_id}/expenditure-categories/${data.id}`,
        msg: this.$t("app.expenditureItemDeleteSuccessMsg"),
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
        this.fetchOrganisationExpenditureCategories(1, 7, "name", "");
      });
    },
  },
  components: {
    CategoryTable,
    FilterComponentVue,
  },
};
</script>

<style lang="scss" scoped>
.search {
  cursor: pointer;
}
</style>
