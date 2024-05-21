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
      <CategoryTable
        :class="$q.platform.is.desktop ? 'q-pt-sm q-px-sm' : ' q-px-sm q-pt-xl'"
        :columns="columns"
        :data="getData"
        :label="label"
        :message="message"
        :show_payment_category="false"
        :show_payment_item="false"
        :show_expenditure_category="true"
        :show_expenditure_item="false"
        :pagination="getPagination"
        :table_loading="getLoadingState"
        @show-expenditure-items="showExpenditureItems"
        @update-expenditure-category="updateExpenditureCategory"
        @delete-row="onDeleteRow"
        @onRequest="onRequest"
      >
      </CategoryTable>
    </div>
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import ExpenditureCategoryMixinVue from "src/mixins/ExpenditureCategoryMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import FilterComponentVue from "src/components/FilterComponent.vue";

export default {
  mixins: [ExpenditureCategoryMixinVue, organisationMixinVue, HelperMixinVue],
  beforeMount() {
    this.$store.commit("SET_PAGINATION", {
      sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 7,
      rowsNumber: 0,
    });
  },

  mounted() {
    this.fetchOrganisationExpenditureCategories(
      this.organisation_id,
      1,
      7,
      "name",
      "",
      ""
    );
  },

  data() {
    return {
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
      organisation_id: this.$store.getters.getOrganisation.id,
    };
  },
  computed: {
    getData() {
      let data = [];
      if (
        this.$store.getters.getExpenditureCategories != null &&
        this.$store.getters.getExpenditureCategories != "undefined"
      ) {
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
  methods: {
    onRequest(props) {
      const { page, rowsPerPage, sortBy } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
        const filter = props.filter;
      this.fetchOrganisationExpenditureCategories(
        this.organisation_id,
        page,
        fetch_count,
        sortBy,
        "",
        filter
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
        this.organisation_id,
        1,
        7,
        "name",
        data.year.value,
        ""
      );
    },

    downloadExpenditureCategory(data) {
      let year_value =
        data.year !== "" && data.year !== "" ? data.year.value : "";
      let url = `/api/protected/expenditure-categories/download?organisation_id=${this.organisation_id}&year=${year_value}&sort_by=name`;
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
        this.fetchOrganisationExpenditureCategories(
          this.organisation_id,
          1,
          7,
          "name",
          "",
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

<style lang="scss" scoped>
.search {
  cursor: pointer;
}
</style>
