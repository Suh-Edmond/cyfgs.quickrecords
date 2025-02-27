<template>
  <q-page>
    <div>
      <!-- header for filter categories -->
      <FilterComponentVue
        :show_member_filters="false"
        :show_categories="false"
        :show_filter_expenditure_items_details="true"
        :loading_download="loading_download"
        :disable_download_btn="validateDownload"
        @filter-expenditure-item-details="filterItems"
        @download-expenditure-item-details="downloadExpenditureItemDetails"
      >
      </FilterComponentVue>
      <!-- table for categories -->
      <CategoryTable
        :class="$q.platform.is.desktop ? 'q-pt-sm q-px-sm' : ' q-px-sm q-pt-xl'"
        :columns="getTableColumns"
        :data="getExpenditureItemDetails"
        :label="label"
        :message="message"
        :title="getExpenditureItemName"
        :show_payment_category="false"
        :show_payment_item="false"
        :show_expenditure_category="false"
        :show_expenditure_item="false"
        :show_expenditure_item_detail="true"
        :expenditure_item_amount="total_item_amount"
        :total_amount_given="total_amount_given"
        :total_amount_spent="total_amount_spent"
        :balance="total_balance"
        :total_balance="total_balance"
        :pagination="getPagination"
        :table_loading="getLoadingState"
        @edit-expenditure-item-detail="editExpenditureItemDetail"
        @view-expenditure-item-detail="viewExpenditureItemDetail"
        @delete-row="onDeleteRow"
        @onRequest="onRequest"
        @fetch-expenditure-details="fetchExpenditureDetailsUponBulkValidation"
      >
      </CategoryTable>

      <div class="q-mt-xs" v-if="expenditure_item_details.length > 0">
        <ContributionSummary
          :is_expenditures="true"
          :summary="getSummaryData"
        ></ContributionSummary>
      </div>
    </div>
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import FilterComponentVue from "src/components/FilterComponent.vue";
import ContributionSummary from "src/components/ContributionSummary.vue";
import { LocalStorage } from "quasar";

export default {
  mixins: [HelperMixinVue, ExpenditureItemDetailMixinVue],
  beforeMount() {
    this.$store.commit("SET_PAGINATION", {
      sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });
  },

  mounted() {
    this.getExpenditureDetailsByItemId(1, 10, "", "");
  },

  data() {
    return {
      selected: [],
      loading_download: false,
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
          name: "amount_given",
          align: "left",
          label: "Amount Given (XAF)",
          field: "amount_given",
          sortable: true,
        },
        {
          name: "amount_spent",
          align: "left",
          label: "Amount Spent (XAF)",
          field: "amount_spent",
          sortable: true,
        },
        {
          name: "balance",
          align: "left",
          label: "Balance (XAF)",
          field: "balance",
          sortable: true,
        },
        {
          name: "approve",
          align: "left",
          label: "Status",
          field: "approve",
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
      columns_admin_expenditure_item_details: [
        {
          name: "is_selected",
          label: "",
          field: "is_selected",
          sortable: true,
          align: "left",
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
          name: "amount_given",
          align: "left",
          label: "Amount Given (XAF)",
          field: "amount_given",
          sortable: true,
        },
        {
          name: "amount_spent",
          align: "left",
          label: "Amount Spent (XAF)",
          field: "amount_spent",
          sortable: true,
        },
        {
          name: "balance",
          align: "left",
          label: "Balance (XAF)",
          field: "balance",
          sortable: true,
        },
        {
          name: "approve",
          align: "left",
          label: "Status",
          field: "approve",
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
      label: this.$t("app.delete"),
      message: this.$t("app.expenditureItemDetailDeleteMsg"),
      status: "",
      total_item_amount: 0,
      total_amount_given: 0,
      total_amount_spent: 0,
      total_balance: 0,
      expenditure_item_details: [],
    };
  },
  computed: {
    isAdminOrTreasurer() {
      const istreasurer = LocalStorage.getItem("data")
        .user_data.roles.map((role) => role.name)
        .find((role) => role == "TREASURER" || role == "ADMIN");
      return istreasurer != undefined;
    },
    getTableColumns() {
      return this.isAdminOrTreasurer
        ? this.columns_admin_expenditure_item_details
        : this.columns;
    },

    getExpenditureItemName() {
      return this.$store.getters.getCurrentExpenditureItem != null
        ? this.$store.getters.getCurrentExpenditureItem.name
        : "";
    },

    validateDownload() {
      return this.expenditure_item_details.length == 0;
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

    getBalance() {
      return this.getTotalAmountGiven - this.getTotalAmountSpent;
    },

    getTotalAmountGiven() {
      return this.total_amount_given;
    },

    getTotalAmountSpent() {
      return this.total_amount_spent;
    },

    getNetBalance() {
      return this.total_balance;
    },

    getSummaryData() {
      let summary = {
        estimated_amount: this.total_item_amount,
        amount_given: this.getTotalAmountGiven,
        amount_spent: this.getTotalAmountSpent,
        balance: this.getBalance,
        net_balance: this.getNetBalance,
      };

      return summary;
    },

    getExpenditureItemDetails() {
      let details = [];
      const data = this.$store.getters.getExpenditureItemDetails;
      if (data != null) {
        details = this.generateExpenditureItemDetailResponse(data);
      } else {
        details = this.expenditure_item_details;
      }
      return details;
    },
  },

  methods: {
    getExpenditureDetailsByItemId(page, per_page, type, filter) {
      this.expenditure_item_details = [];
      let search_filter = filter === undefined ? "" : filter;
      let expenditure_item = this.$store.getters.getCurrentExpenditureItem;
      let payload = {
        url: `/api/protected/expenditure-items/${expenditure_item.id}/details?page=${page}&per_page=${per_page}&status=${this.status}&filter=${search_filter}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        commit: "SET_EXPENDITURE_ITEM_DETAIL",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          if (response.success) {
            response.data.data.forEach((ele) => {
              this.expenditure_item_details.push({
                counter: response.data.data.indexOf(ele) + 1,
                name: ele.name,
                amount_given: ele.amount_given,
                amount_spent: ele.amount_spent,
                balance: ele.balance,
                type: "EXPENDITURE_DETAILS",
                id: ele.id,
                expenditure_item_id: ele.expenditure_item_id,
                comment: ele.comment,
                approve: ele.approve,
                created_at: ele.created_at,
                updated_at: ele.updated_at,
                updated_by: ele.updated_by,
                is_selected: ele.is_selected,
              });
            });
            this.$store.commit("SET_PAGINATION", {
              sortBy: "name",
              descending: false,
              page: response.data.current_page,
              rowsPerPage: response.data.per_page,
              rowsNumber: response.data.total,
            });
            this.total_amount_given = response.data.total_amount_given;
            this.total_amount_spent = response.data.total_amount_spent;
            this.total_item_amount = response.data.total_item_amount;
            this.total_balance = response.data.total_balance;
          }
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
        });

      return this.expenditure_item_details;
    },

    onRequest(props) {
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      const filter = props.filter;
      this.getExpenditureDetailsByItemId(page, fetch_count, false, filter);
    },

    editExpenditureItemDetail(data) {
      this.$store.dispatch("setUpdatedExpenditureItemDetail", data.data);
      this.$emit("edit-expenditure-item-detail", data);
    },

    viewExpenditureItemDetail(data) {
      this.$store.dispatch("setUpdatedExpenditureItemDetail", data.data);
      this.$emit("view-expenditure-item-detail", data);
    },

    downloadExpenditureItemDetails(data) {
      let expenditure_item_id =
        this.$store.getters.getCurrentExpenditureItem.id;
      let expenditure_item_name =
        this.$store.getters.getCurrentExpenditureItem.name;

      let url = `/api/protected/expenditure-item-details/download?expenditure_item_id=${expenditure_item_id}&status=${data.payment_status}&expenditure_item_name=${expenditure_item_name}`;
      let file_name = "Expenditure_Item_Details.pdf";
      this.loading_download = this.downloadPdf(url, file_name);
    },

    filterItems(data) {
      let expenditure_category =
        this.$store.getters.getCurrentExpenditureCategory;
      let expenditure_item = this.$store.getters.getCurrentExpenditureItem;
      this.status = data.payment_status;
      this.$router.push({
        path: `/dashboard/expenditure-categories/${expenditure_category.id}/items/${expenditure_item.id}/details`,
        query: { status: data.payment_status, t: new Date().getTime() },
      });

      this.getExpenditureDetailsByItemId(1, 10, false, "");
    },

    onDeleteRow(data) {
      let payload = {
        url: `/api/protected/expenditure-item-details/${data.id}`,
        msg: this.$t("app.expenditureItemDetailDeletedSuccessMsg"),
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
        this.getExpenditureDetailsByItemId(1, 10, false, "");
      });
    },

    fetchExpenditureDetailsUponBulkValidation() {
      this.getExpenditureDetailsByItemId(1, 10, "", "");
    },

    generateExpenditureItemDetailResponse(response) {
      this.expenditure_item_details = [];
      response.data.forEach((ele) => {
        this.expenditure_item_details.push({
          counter: response.data.indexOf(ele) + 1,
          name: ele.name,
          amount_given: ele.amount_given,
          amount_spent: ele.amount_spent,
          balance: ele.balance,
          type: "EXPENDITURE_DETAILS",
          id: ele.id,
          expenditure_item_id: ele.expenditure_item_id,
          comment: ele.comment,
          approve: ele.approve,
          created_at: ele.created_at,
          updated_at: ele.updated_at,
          updated_by: ele.updated_by,
          is_selected: ele.is_selected,
        });
      });
      this.$store.commit("SET_PAGINATION", {
        sortBy: "name",
        descending: false,
        page: response.current_page,
        rowsPerPage: response.per_page,
        rowsNumber: response.total,
      });
      this.total_amount_given = response.total_amount_given;
      this.total_amount_spent = response.total_amount_spent;
      this.total_item_amount = response.total_item_amount;
      this.total_balance = response.total_balance;
      this.expenditure_item_name = response.expenditure_item_name;

      return this.expenditure_item_details;
    },
  },
  components: {
    CategoryTable,
    FilterComponentVue,
    ContributionSummary,
  },
};
</script>

<style lang="scss" scoped>
.detail_name {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  color: $grey5;
}
.detail_value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  color: $grey8;
}
.summary {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: $grey8;
  text-decoration: underline;
}

.text-subtitle2 {
  font-size: small;
}
</style>
