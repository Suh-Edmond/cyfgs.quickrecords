<template>
  <div class="q-pa-sm">
    <div>
      <!-- contributions available -->
      <FilterComponentVue
        :show_member_contribution="true"
        :loading_download="loading_download"
        :disable_download_btn="validateDownload"
        @filter-member-contribution="filterMemberContribution"
        @download-member-contribution="downloadContributions"
      >
      </FilterComponentVue>
      <!-- table for contributions -->
      <TableVue
        :class="$q.platform.is.desktop ? 'q-pt-sm q-px-sm' : ' q-px-xs q-pt-lg'"
        :columns="columns"
        :data="getMemberContributions"
        :label="label"
        :message="message"
        :show_savings="false"
        :show_income_activity="false"
        :show_members="false"
        :show_contribution="false"
        :show_delete_contribution="true"
        :total_contribution="getTotalMemberContribution"
        :total_balance="getTotalBalance"
        :show_member_contribution="true"
        :pagination="pagination"
        :table_loading="table_loader"
        :title="getTableTitle"
        @view-contribution="viewContribution"
        @edit-contribution="editContribution"
        @delete-row="deleteRow"
        @onRequest="onRequest"
      >
      </TableVue>

      <div v-if="getMemberContributions.length > 0">
        <ContributionSummary
          :summary="getSummaryData"
          :is_expenditures="false"
        ></ContributionSummary>
      </div>
    </div>
  </div>
</template>

<script>
  import TableVue from "src/components/Table.vue";
  import ContributionsMixin from "src/mixins/ContributionsMixin.vue";
  import HelperMixin from "src/mixins/HelperMixin.vue";
  import FilterComponentVue from "src/components/FilterComponent.vue";
  import ContributionSummary from "src/components/ContributionSummary.vue";

  export default {
  mixins: [ContributionsMixin, HelperMixin],

  mounted() {
    const page = 1;
    const per_page = 10;
    this.getMemberContributionsByPaymentItem(
      this.$router.currentRoute.params.item_id,
      this.$router.currentRoute.params.id,
      page,
      per_page,
      "",
      ""
    );
  },
  data() {
    return {
      label_print: this.$t("app.print"),
      color_print: "positive",
      label_fetch_user: this.$t("app.filter"),
      loading: false,
      color: "primary",
      no_caps: true,
      message: this.$t("app.deleteContributionWarningMsg"),
      label: this.$t("app.delete"),
      title: "",
      columns: [
        {
          name: "quarterly_name",
          required: true,
          label: "Quarter/Month",
          align: "left",
          field: "quarterly_name",
        },
        {
          name: "amount_deposited",
          align: "left",
          label: "Amount Deposited (XAF)",
          field: "amount_deposited",
        },
        {
          name: "balance",
          align: "left",
          label: "Balance (XAF)",
          field: "balance",
        },
        {
          name: "status",
          align: "left",
          label: "Payment Status",
          field: "status",
        },
        {
          name: "date",
          align: "left",
          label: "Payment Date",
          field: "date",
        },
        {
          name: "approve",
          align: "left",
          label: "Transaction Status",
          field: "approve",
          sortable: true,
        },
        {
          name: "action",
          label: "Action",
          align: "left",
          field: "action",
        },
      ],
      data: [],
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      },
      table_loader: false,
      transaction_status: "",
      payment_status: "",
    };
  },
  computed: {
    getTotalMemberContribution() {
      return this.$store.getters.getMemberContributions !== null
        ? this.$store.getters.getMemberContributions.total_amount
        : 0;
    },

    getTotalBalance() {
      return this.$store.getters.getMemberContributions !== null
        ? this.$store.getters.getMemberContributions.total_balance
        : 0;
    },

    getTotalAmountPayable() {
      return this.$store.getters.getMemberContributions !== null
        ? this.$store.getters.getMemberContributions.total_amount_payable
        : 0;
    },

    getTableTitle() {
      let title = "";
      let user_name =
        this.$store.getters.getMemberContributions !== null &&
        this.$store.getters.getMemberContributions.data.length > 0
          ? this.$store.getters.getMemberContributions.data[0].user_name
          : "";
      let payment_item_name =
        this.$store.getters.getSearchContributionParams !== null
          ? this.$store.getters.getSearchContributionParams.item.label
          : "";
      return (title =
        user_name +
        ` ` +
        this.$t("app.partContributionTitle") +
        ` ${payment_item_name}`);
    },

    getMemberContributions() {
      let data = [];
      if (this.$store.getters.getMemberContributions !== null) {
        this.$store.getters.getMemberContributions.data.forEach((ele) => {
          data.push({
            counter:
              this.$store.getters.getMemberContributions.data.indexOf(ele) + 1,
            amount_deposited: ele.amount_deposited,
            total_amount_deposited: ele.total_amount_deposited,
            id: ele.id,
            approve: ele.approve,
            balance: ele.balance,
            payment_item_amount: ele.payment_item_amount,
            payment_item_id: ele.payment_item_id,
            payment_item_complusory: ele.payment_item_compulsory,
            payment_item_name: ele.payment_item_name,
            payment_category: ele.payment_category,
            comment: ele.comment,
            code: ele.code,
            type: "MEMBERS_CONTRIBUTIONS",
            complusory: ele.complusory,
            created_at: ele.created_at,
            updated_by: ele.updated_by,
            status: ele.status,
            user_id: ele.user_id,
            user_name: ele.user_name,
            user_telephone: ele.user_telephone,
            quarterly_name: ele.quarterly_name,
            month_name: ele.month_name,
            payment_item_frequency: ele.payment_item_frequency,
          });
        });
      }
      return data;
    },

    validateDownload() {
      return this.getMemberContributions.length === 0;
    },

    getPaymentItemName() {
      return this.$store.getters.getMemberContributions !== null
        ? this.$store.getters.getMemberContributions.data[0].payment_item_name
        : "";
    },

    getPaymentItemFrequency() {
      return this.$store.getters.getMemberContributions !== null
        ? this.$store.getters.getMemberContributions.data[0]
            .payment_item_frequency
        : "";
    },

    getPaymentItemAmount() {
      return this.$store.getters.getMemberContributions !== null
        ? this.$store.getters.getMemberContributions.data[0].payment_item_amount
        : "";
    },

    getUnPaidDurations() {
      return this.$store.getters.getMemberContributions !== null
        ? this.$store.getters.getMemberContributions.unpaid_durations
        : "";
    },

    getSummaryData() {
      const data = this.$store.getters.getMemberContributions;
      return {
        expect_contribution: data.total_amount_payable,
        amount_contributed: data.total_amount,
        balance: data.total_balance,
        percentage: data.percentage,
        payment_durations: data.payment_durations,
        frequency: data.payment_item.frequency,
        member_size: data.member_size,
      };
    },
  },
  methods: {
    viewContribution(data) {
      this.$emit("view-contribution", data);
    },

    editContribution(data) {
      this.$emit("edit-contribution", data);
    },

    downloadContributions() {
      let payment_item_id = this.$router.currentRoute.params.item_id;
      let user_id = this.$router.currentRoute.params.id;
      let payment_item_name =
        this.$store.getters.getSearchContributionParams !== undefined &&
        this.$store.getters.getSearchContributionParams !== null
          ? this.$store.getters.getSearchContributionParams.item.label
          : "";
      let payment_item_frequency =
        this.$store.getters.getSearchContributionParams !== undefined &&
        this.$store.getters.getSearchContributionParams !== null
          ? this.$store.getters.getSearchContributionParams.item.frequency
          : "";
      let payment_item_amount =
        this.$store.getters.getSearchContributionParams !== undefined &&
        this.$store.getters.getSearchContributionParams !== null
          ? this.$store.getters.getSearchContributionParams.item.amount
          : "";
      let payment_item_created_at =
        this.$store.getters.getSearchContributionParams !== undefined &&
        this.$store.getters.getSearchContributionParams !== null
          ? this.$store.getters.getSearchContributionParams.item.created_at
          : "";
      let user_name =
        this.$store.getters.getMemberContributions !== undefined &&
        this.$store.getters.getMemberContributions !== null
          ? this.$store.getters.getMemberContributions.data[0].user_name
          : "";

      let url = `/api/protected/users/contributions/download?payment_item_id=${payment_item_id}
      &user_id=${user_id}&user_name=${user_name}&payment_item_name=${payment_item_name}&payment_item_amount=${payment_item_amount}&payment_item_frequency=${payment_item_frequency}&payment_item_created_at=${payment_item_created_at}`;

      let file_name = "Contributions Details.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    deleteRow(data) {
      let payload = {
        url: `/api/protected/contributions/${data.id}`,
        msg: this.$t("app.deleteContributionSuccessMsg"),
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
        this.getMemberContributionsByPaymentItem(
          data.payment_item_id,
          data.user_id,
          1,
          10,
          this.transaction_status,
          this.payment_status
        );
      });
    },

    getMemberContributionsByPaymentItem(
      payment_item_id,
      user_id,
      page,
      per_page,
      transaction_status,
      payment_status
    ) {
      let payload = {
        status: "none",
        url: `/api/protected/contributions/payment-items/${payment_item_id}/users/${user_id}?page=${page}&per_page=${per_page}&transaction_status=${transaction_status}&payment_status=${payment_status}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_MEMBER_CONTRIBUTIONS",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.commit("SET_MEMBER_CONTRIBUTIONS", null);
      this.table_loader = true;
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.pagination.page = response.data.current_page;
          this.pagination.rowsPerPage = response.data.per_page;
          this.pagination.rowsNumber = response.data.total;
        })
        .finally(() => {
          this.table_loader = false;
        });
    },

    onRequest(props) {
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      const params = this.$route.params;
      this.getMemberContributionsByPaymentItem(
        params.item_id,
        params.id,
        page,
        fetch_count,
        this.transaction_status,
        this.payment_status
      );
    },

    filterMemberContribution(data) {
      this.transaction_status = data.transaction_status;
      this.payment_status = data.payment_status;
      this.getMemberContributionsByPaymentItem(
        this.$router.currentRoute.params.item_id,
        this.$router.currentRoute.params.id,
        1,
        10,
        this.transaction_status,
        this.payment_status
      );
    },
  },

  components: {
    TableVue,
    FilterComponentVue,
    ContributionSummary,
  },
};
</script>

<style lang="scss" scoped>
.summary_label {
  color: $grey5;
}

.summary_value {
  color: $grey8;
}

.summary {
  text-decoration: underline;
}
</style>
