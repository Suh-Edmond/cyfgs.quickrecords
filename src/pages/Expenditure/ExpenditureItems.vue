<template>
  <q-page>
    <div>
      <!-- header for filter categories -->
      <FilterComponentVue
        :show_member_filters="false"
        :show_categories="false"
        :show_filter_expenditure_items="true"
        :loading_download="loading_download"
        :disable_download_btn="validateDownload"
        @filter-expenditure-items="filterItems"
        @download-expenditure-items="downloadExpenditureItems"
      >
      </FilterComponentVue>

      <!-- table for categories -->
      <CategoryTable
        :class="$q.platform.is.desktop ? 'q-pt-sm q-px-sm' : ' q-px-sm q-pt-xl'"
        :columns="columns"
        :data="getExpenditureItems"
        :label="label"
        :message="message"
        :title="getTableTitle"
        :show_payment_category="false"
        :show_payment_item="false"
        :show_expenditure_category="false"
        :show_expenditure_item="true"
        :pagination="getPagination"
        :table_loading="getLoadingState"
        @edit-expenditure-item="editExpenditureItem"
        @view-expenditure-item="viewExpenditureItem"
        @show-expenditure-item-details="showExpenditureItemDetails"
        @delete-row="deleteRow"
        @onRequest="onRequest"
      >
      </CategoryTable>
    </div>
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";
import FilterComponentVue from "src/components/FilterComponent.vue";

export default {
  mixins: [
    HelperMixinVue,
    ExpenditureItemDetailMixinVue,
    expenditureItemMixinVue,
  ],

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
    this.fetchExpenditureItems(1, 7, "", this.status, "", "");
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
          name: "amount",
          align: "left",
          label: "Estimated Amount (XAF)",
          field: "amount",
          sortable: true,
        },
        {
          name: "venue",
          align: "left",
          label: "Venue",
          field: "venue",
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "Date",
          field: "date",
          sortable: true,
        },
        {
          name: "action",
          label: "Action",
          field: "action",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      data: [],
      label: this.$t("app.delete"),
      message: this.$t("app.deleteExpenditureItemWarningMsg"),
      status: "",
      payment_item_id: null,
      session_id: this.$store.getters.getCurrentYear.id,
      loading_download: false,
    };
  },
  computed: {
    getExpenditureItems() {
      let data = [];
      if (this.$store.getters.getExpenditureItems !== null) {
        this.$store.getters.getExpenditureItems.data.forEach((ele) => {
          data.push({
            counter:
              this.$store.getters.getExpenditureItems.data.indexOf(ele) + 1,
            name: ele.name,
            id: ele.id,
            amount: ele.amount,
            venue: ele.venue,
            date: ele.date,
            comment: ele.comment,
            approve: ele.approve,
            expenditure_category: ele.expenditure_category,
            created_at: ele.created_at,
            updated_at: ele.updated_at,
            updated_by: ele.updated_by,
            total_amount_given: ele.total_amount_given,
            total_amount_spent: ele.total_amount_spent,
            total_balance: ele.total_balance,
            type: "EXPENDITURE_ITEMS",
            payment_item: ele.payment_item,
          });
        });
      }
      return data;
    },

    getTableTitle() {
      let title = "";
      if (this.payment_item_id !== null && this.payment_item_id !== "") {
        title =
          this.$t("app.expenditureItemTitlePartName") +
          `${this.payment_item_id.label}`;
      } else {
        title = this.$store.getters.getCurrentExpenditureCategory.name;
      }
      return title;
    },

    validateDownload() {
      return this.getExpenditureItems.length == 0;
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
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      let payment_item_value =
        this.payment_item_id !== "" && this.payment_item_id !== null
          ? this.payment_item_id.value
          : "";
      const filter = props.filter;
      this.fetchExpenditureItems(
        page,
        fetch_count,
        "",
        this.status,
        payment_item_value,
        filter
      );
    },

    editExpenditureItem(data) {
      this.$emit("edit-expenditure-item", data);
    },

    viewExpenditureItem(data) {
      this.$emit("view-expenditure-item", data);
    },

    showExpenditureItemDetails(data) {
      this.$store.dispatch("setCurrentExpenditureItem", {
        id: data.expenditure_item.id,
        name: data.expenditure_item.name,
      });

      const intermediate_tabs = Array.from(
        this.$store.getters.getIntermediateTabs
      );

      intermediate_tabs.push({
        name: this.$t("app.expenditureItemDetailLabel"),
        has_intermediate_tab: true,
      });

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);

      this.$emit("show-expenditure-item-details", data);
    },

    downloadExpenditureItems(data) {
      let expenditure_category_id =
        this.$store.getters.getCurrentExpenditureCategory.id;
      let category_name =
        this.$store.getters.getCurrentExpenditureCategory.name;
      let payment_item_id_value =
        data.payment_item_id !== null && data.payment_item_id !== ""
          ? data.payment_item_id.value
          : "";
      let year_value =
        data.year !== null && data.year !== ""
          ? data.year.value
          : this.session_id;
      let url = `/api/protected/expenditure-categories/expenditure-items/download?expenditure_category_id=${expenditure_category_id}&status=${data.payment_status}&payment_item_id=${payment_item_id_value}&session_id=${year_value}&category_name=${category_name}`;
      let file_name = "Expenditure_Items.pdf";
      this.loading_download = this.downloadPdf(url, file_name);
    },

    filterItems(data) {
      let expenditure_category =
        this.$store.getters.getCurrentExpenditureCategory;
      this.$router.push({
        path: `/dashboard/expenditure-categories/${expenditure_category.id}/items`,
        query: {
          payment_item_id: data.payment_item_id.label,
          status: data.payment_status,
          session: data.year.label,
          t: new Date().getTime(),
        },
      });

      this.setFilterVariables(data);
      let payment_item_value =
        this.payment_item_id !== "" && this.payment_item_id !== null
          ? this.payment_item_id.value
          : "";
      this.fetchExpenditureItems(
        1,
        7,
        data.year,
        this.status,
        payment_item_value,
        ""
      );
    },

    deleteRow(data) {
      let payload = {
        url: `/api/protected/expenditure-categories/${data.expenditure_category.id}/expenditure-items/${data.id}`,
        msg: this.$t("app.deleteExpenditureItemFeedbackMsg"),
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
        let payment_item_value =
          this.payment_item_id !== "" && this.payment_item_id !== null
            ? this.payment_item_id.value
            : "";
        this.fetchExpenditureItems(1, 7, "", this.status, payment_item_value, "");
      });
    },

    setFilterVariables(data) {
      this.payment_item_id = data.payment_item_id;
      this.status = data.payment_status;
      this.session_id = data.year;
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
