<template>
  <q-page>
    <!--------------------------------------------------TABLE FOR EXPENDITURE DETAILS---------------------------------------->
    <div>
      <div
        :class="$q.screen.lg ? 'row q-gutter-sm q-pb-sm' : 'row q-gutter-sm q-pb-sm'"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <q-select
          class="col-10 col-md"
          v-model="status"
          outlined
          dense
          :options="statuses"
          :label="$t('app.selectStatusLabel')"
        />
        <div
          class="col-2 col-md flex"
          :class="$q.platform.is.desktop ? 'q-pl-md' : ''"
        >
          <q-btn
            :label="$t('app.filter')"
            color="primary"
            :disabled="validateFilter"
            no-caps
            icon-right="filter_list"
            @click="filterItems"
            :loading="is_fetching"
            class="q-my-xs"
            size="sm"
          >
          </q-btn>
          <q-space />
          <q-btn
            :label="$t('app.download')"
            :loading="loading_download"
            :color="'positive'"
            :disabled="false"
            no-caps
            icon-right="download"
            @click="downloadExpenditureItemDetails"
            class="q-my-xs"
            size="sm"
          ></q-btn>
        </div>
      </div>

      <CategoryTable
        :class="$q.platform.is.desktop ? 'q-pt-sm q-px-sm' : ' q-px-sm q-pt-xl'"
        :columns="columns"
        :data="getExpenditureItemDetails"
        :label="label"
        :message="message"
        :title="getTableTitle"
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
      >
      </CategoryTable>
    </div>

    <div class="q-mt-sm" v-if="expenditure_item_details.length > 0">
      <ContributionSummary
        :summary="getSummaryData"
        :is_expenditures="true"
      ></ContributionSummary>
    </div>
  </q-page>
</template>

<script>
  import CategoryTable from "src/components/CategoryTable.vue";
  import HelperMixinVue from "src/mixins/HelperMixin.vue";
  import ContributionSummary from "src/components/ContributionSummary.vue";

  export default {
  mixins: [HelperMixinVue],

  mounted() {
    this.getExpenditureDetailsByItemId(1, 10, false, this.$route.params.id);
  },

  data() {
    return {
      start_filter: false,
      color: "primary",
      loading_download: false,
      columns: [
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
          label: this.$t("app.nameLabel"),
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "amount_given",
          align: "left",
          label: this.$t("app.amountGivenLabel") + "(XAF)",
          field: "amount_given",
          sortable: true,
        },
        {
          name: "amount_spent",
          align: "left",
          label: this.$t("app.amountSpent") + "(XAF)",
          field: "amount_spent",
          sortable: true,
        },
        {
          name: "balance",
          align: "left",
          label: this.$t("app.balance"),
          field: "balance",
          sortable: true,
        },
        {
          name: "approve",
          align: "left",
          label: this.$t("app.transactionStatus"),
          field: "approve",
          sortable: true,
        },
        {
          name: "action",
          label: this.$t("app.action"),
          field: "action",
          sortable: true,
          align: "left",
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      label: this.$t("app.delete"),
      message: "",
      statuses: ["Pending", "Approved", "Declined", "All"],
      status: "",
      filtered_items: [],
      show_spinner: false,
      selected: false,
      approve_state: false,
      total_item_amount: 0,
      total_amount_given: 0,
      total_amount_spent: 0,
      total_balance: 0,
      is_fetching: false,
      expenditure_item_id: this.$route.params.id,
      expenditure_item_details: [],
      expenditure_item_name: "",
    };
  },
  computed: {
    validateFilter() {
      return this.status === "";
    },

    validateDownload() {
      return this.expenditure_item_details.length === 0;
    },

    getBalance() {
      return this.total_amount_given - this.total_amount_spent;
    },

    getPagination() {
      return {
        sortBy: this.$store.getters.getPagination.sortBy,
        descending: this.$store.getters.getPagination.descending,
        page: this.$store.getters.getPagination.page,
        rowsPerPage: this.$store.getters.getPagination.rowsPerPage,
        rowsNumber: this.$store.getters.getPagination.rowsNumber,
      };
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getTableTitle() {
      return this.expenditure_item_details.length > 0
        ? this.expenditure_item_name
        : "";
    },

    getSummaryData() {
      return {
        estimated_amount: this.total_item_amount,
        amount_given: this.total_amount_given,
        amount_spent: this.total_amount_spent,
        balance: this.getBalance,
        net_balance: this.getBalance,
      };
    },

    getExpenditureItemDetails() {
      let details = [];
      const data = this.$store.getters.getExpenditureItemDetails;
      if (data !== null) {
        details = this.generateExpenditureItemDetailResponse(data);
      } else {
        details = this.expenditure_item_details;
      }
      return details;
    },
  },
  methods: {
    getExpenditureDetailsByItemId(
      page,
      per_page,
      is_filtering,
      expenditure_item_id
    ) {
      let payment_status =
        this.status !== "" && this.status != null
          ? this.indexPaymentStatus(this.status)
          : "";
      let payload = {
        url: `/api/protected/expenditure-items/${expenditure_item_id}/details?page=${page}&per_page=${per_page}&status=${payment_status}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        show_feedback: false,
        show_spinner: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.is_fetching = is_filtering;
      this.expenditure_item_details = [];
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
            this.expenditure_item_name = response.data.expenditure_item_name;
          }
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
          this.is_fetching = false;
        });
      return this.expenditure_item_details;
    },

    onRequest(props) {
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.getExpenditureDetailsByItemId(
        page,
        fetch_count,
        false,
        this.expenditure_item_id
      );
    },

    downloadExpenditureItemDetails() {
      let expenditure_item_id = this.$router.currentRoute.params.id;
      let url = `/api/protected/expenditure-item-details/download?expenditure_item_id=${expenditure_item_id}&status=${this.indexPaymentStatus(
        this.status
      )}`;
      let file_name = "Expenditure_Item_Details.pdf";
      this.loading_download = this.downloadPdf(url, file_name);
    },

    filterItems() {
      this.$router.push({
        path: `/dashboard/expenditures/${this.expenditure_item_id}/details`,
        query: { status: this.status, t: new Date().getTime() },
      });

      this.getExpenditureDetailsByItemId(1, 10, true, this.expenditure_item_id);
    },

    editExpenditureItemDetail(data) {
      this.$store.dispatch("setUpdatedExpenditureItemDetail", data.data);
      this.$emit("edit-expenditure-item-detail", data);
    },

    viewExpenditureItemDetail(data) {
      this.$store.dispatch("setUpdatedExpenditureItemDetail", data.data);
      this.$emit("view-expenditure-item-detail", data);
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
        this.getExpenditureDetailsByItemId(
          1,
          10,
          false,
          this.expenditure_item_id
        );
      });
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
    ContributionSummary,
  },
};
</script>

<style lang="scss" scoped></style>
