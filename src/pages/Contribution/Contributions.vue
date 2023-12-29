<template>
  <div class="q-pa-sm">
    <!------------------------------------------CONTRIBUTIONS VIEW FOR MEMBERS WITHOUT TREASURER ROLE----------------------------------- -->
    <div v-if="!checkTreasurerRole()">
      <div
        class="row q-ml-xs q-pt-md justify-between"
        :class="$q.screen.lg ? 'q-pa-md' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <q-btn
          :label="$t('app.filter')"
          :color="'primary'"
          :disabled="false"
          no-caps
          icon-right="filter_list"
          @click="openSearchBar()"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.print')"
          :loading="loading_download"
          :color="'positive'"
          :disabled="getTableData == 0"
          no-caps
          icon-right="print"
          @click="downloadContributions()"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        ></q-btn>
      </div>
      <!-- table for contributions -->
      <TableVue
        :class="$q.platform.is.desktop ? 'q-pt-sm q-px-sm' : ' q-px-sm q-pt-lg'"
        :columns="columns"
        :data="getTableData"
        :label="label"
        :message="message"
        :show_savings="false"
        :show_income_activity="false"
        :show_members="false"
        :show_member_savings="false"
        :show_contribution="true"
        :show_member_contribution="false"
        :total_contribution="computeTotalContributions"
        :title="getTableTitleForSearchContributions"
        :pagination="buildPaginatedObject"
        :table_loading="getFetchingState"
        @view-contribution="viewContribution"
        @edit-contribution="editContribution"
        @delete-row="deleteRow"
        @onRequest="onRequest"
      >
      </TableVue>

      <div class="q-mx-sm q-mt-md" v-if="getTableData.length > 0">
        <q-card>
          <div class="row q-pa-sm">
            <label
              class="q-py-sm text-bold summary text-capitalize text-underline"
              >{{ $t("app.expenditureSummaryLabel") }}</label
            >
          </div>
          <div class="row q-mb-lg q-gutter-md q-px-sm q-pb-lg">
            <div class="col-md-3">
              <div class="q-mb-xs">
                <label class="text-bold q-py-md detail_name"
                  >{{ $t("app.paymentItem") }}:</label
                >
              </div>
              <div class="q-mb-xs">
                <label class="text-bold q-py-md detail_name"
                  >{{ $t("app.amountContributed") }}:</label
                >
              </div>
            </div>
            <div class="col-md-3">
              <div class="q-mb-xs">
                <label class="text-bold q-py-md detail_name"
                  >{{ getPaymentItemName }}
                </label>
              </div>
              <div class="q-mb-xs">
                <label class="text-bold q-py-md detail_name"
                  >{{
                    Number(computeTotalContributions).toLocaleString()
                  }}
                  XAF</label
                >
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
    <!------------------------------------------END CONTRIBUTIONS VIEW FOR MEMBERS WITHOUT TREASURER ROLE----------------------------------- -->

    <!------------------------------------------CONTRIBUTIONS VIEW FOR MEMBERS WITH TREASURER ROLE----------------------------------- -->
    <div v-if="checkTreasurerRole()">
      <div
        :class="$q.screen.lg ? 'row q-pa-sm' : 'col q-gutter-sm q-px-sm'"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <q-btn
          :label="$t('app.filter')"
          :color="'primary'"
          :disabled="false"
          no-caps
          icon-right="filter_list"
          @click="openSearchBar()"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.print')"
          :loading="loading_download"
          :color="'positive'"
          :disabled="getFilteredContributions.length == 0"
          no-caps
          icon-right="print"
          @click="downloadContributions()"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        ></q-btn>
      </div>

      <!-- table for filtered savings -->
      <TableVue
        :class="$q.platform.is.desktop ? 'q-pt-sm q-px-sm' : ' q-px-sm q-pt-xl'"
        :columns="columns"
        :data="getFilteredContributions"
        :label="label"
        :message="message"
        :show_savings="false"
        :show_income_activity="false"
        :show_members="false"
        :show_member_contribution="false"
        :show_contribution="true"
        :total_contribution="computeTotalContributionsForFilteredRecord"
        :title="getTableTitleForSearchContributions"
        :pagination="getPagination"
        :table_loading="getFetchingState"
        @delete-row="deleteRow"
        @onRequest="onRequest"
      >
      </TableVue>
    </div>
    <!------------------------------------------CONTRIBUTIONS VIEW FOR MEMBERS WITH TREASURER ROLE----------------------------------- -->
  </div>
</template>

<script>
import TableVue from "src/components/Table.vue";
import PaymentCategoryMixinVue from "src/mixins/PaymentCategoryMixin.vue";
import PaymentItemMixinVue from "src/mixins/PaymentItemMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import { LocalStorage } from "quasar";

export default {
  mixins: [
    PaymentCategoryMixinVue,
    PaymentItemMixinVue,
    organisationMixinVue,
    HelperMixinVue,
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

  mounted() {},

  data() {
    return {
      payment_item_id: null,
      loading: false,
      message: this.$t("app.deleteContributionWarningMsg"),
      label: this.$t("app.delete"),
      columns: [
        {
          name: "user_name",
          required: true,
          label: "Member's Name",
          align: "left",
          field: (row) => row.user_name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "total_amount_deposited",
          align: "left",
          label: "Total Amount Deposited (XAF)",
          field: "total_amount_deposited",
        },
        {
          name: "balance",
          align: "left",
          label: "Balance (XAF)",
          field: "balance",
        },
        {
          name: "approve", ///this has to be changed to approve word not state so it is consistent
          align: "left",
          label: "Transaction Status",
          field: "approve",
        },
        {
          name: "action",
          label: "Action",
          field: "action",
          align: "left",
        },
      ],
      start_filter: false,
      filteredContributions: [],
      loading_filter: false,
      loading_download: false,
    };
  },
  computed: {
    validateFilter() {
      return this.payment_item_id === null;
    },

    getTableData() {
      let data = [];
      if (this.getMembersContributionsByPaymentItem.length > 0) {
        data = this.getMembersContributionsByPaymentItem;
      } else {
        data = this.getFilteredContributions;
      }
      return data;
    },

    computeTotalContributions() {
      return this.$store.getters.getFilteredContributions !== null
        ? this.$store.getters.getFilteredContributions.total_amount
        : 0;
    },

    getMembersContributionsByPaymentItem() {
      let data = [];
      if (this.$store.getters.getMembersContributionsByPaymentItem != null) {
        this.$store.getters.getMembersContributionsByPaymentItem.data.forEach(
          (ele) => {
            data.push({
              counter:
                this.$store.getters.getMembersContributionsByPaymentItem.data.indexOf(
                  ele
                ) + 1,
              amount_deposited: ele.amount_deposited,
              total_amount_deposited: ele.total_amount_deposited,
              id: ele.id,
              approve: ele.approve,
              balance: ele.balance,
              payment_item_amount: ele.payment_item_amount,
              payment_item_id: ele.payment_item_id,
              payment_item_complusory: ele.payment_item_compulsory,
              payment_item_name: ele.payment_item_name,
              comment: ele.comment,
              code: ele.code,
              type: "MEMBERS_CONTRIBUTIONS",
              organisation_id: ele.organisation_id,
              created_at: ele.created_at,
              updated_by: ele.updated_by,
              status: ele.status,
              user_id: ele.user_id,
              user_name: ele.user_name,
              user_telephone: ele.user_telephone,
              session_id: ele.session_id,
            });
          }
        );
      }
      return data;
    },

    checkIsExistPaymentItem() {
      return this.getPaymentItems.length > 0;
    },

    getFilteredContributions() {
      let data = [];

      if (this.$store.getters.getFilteredContributions != null) {
        this.$store.getters.getFilteredContributions.data.forEach((ele) => {
          data.push({
            counter:
              this.$store.getters.getFilteredContributions.data.indexOf(ele) +
              1,
            amount_deposited: ele.amount_deposited,
            total_amount_deposited: ele.total_amount_deposited,
            id: ele.id,
            approve: ele.approve,
            balance: ele.balance,
            payment_item_amount: ele.payment_item_amount,
            payment_item_id: ele.payment_item_id,
            payment_item_complusory: ele.payment_item_complusory,
            payment_item_name: ele.payment_item_name,
            comment: ele.comment,
            code: ele.code,
            type: "MEMBERS_CONTRIBUTIONS",
            compulsory: ele.compulsory,
            created_at: ele.created_at,
            updated_by: ele.updated_by,
            status: ele.status,
            user_id: ele.user_id,
            user_name: ele.user_name,
            user_telephone: ele.user_telephone,
            session_id: ele.session_id,
          });
        });
      }
      return data;
    },

    computeTotalContributionsForFilteredRecord() {
      return this.$store.getters.getFilteredContributions !== null
        ? this.$store.getters.getFilteredContributions.total_amount
        : 0;
    },

    getTableTitleForSearchContributions() {
      let title = "";
      const payment_item = this.$store.getters.getSearchContributionParams;
      title =
        payment_item !== null
          ? this.$t("app.contributionPartTitle") + `${payment_item.item.label}`
          : "";
      return title;
    },

    getPaymentItemName() {
      const payment_item = this.$store.getters.getSearchContributionParams;
      return payment_item !== undefined && payment_item !== null
        ? payment_item.item.label
        : "";
    },

    buildPaginatedObject() {
      let paginatedObject = {
        sortBy: "name",
        descending: false,
        page:
          this.$store.getters.getFilteredContributions !== null
            ? this.$store.getters.getFilteredContributions.current_page
            : 1,
        rowsPerPage:
          this.$store.getters.getFilteredContributions !== null
            ? this.$store.getters.getFilteredContributions.per_page
            : 7,
        rowsNumber:
          this.$store.getters.getFilteredContributions !== null
            ? this.$store.getters.getFilteredContributions.total
            : 0,
      };
      return paginatedObject;
    },

    getFetchingState() {
      return this.$store.getters.getFetchingState;
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
  },

  watch: {},

  methods: {
    onRequest(props) {
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      const search_params = this.$store.getters.getSearchContributionParams;
      this.filterContributions(
        search_params.item.value,
        search_params.month,
        search_params.year,
        search_params.status,
        search_params.date,
        search_params.range,
        page,
        fetch_count
      );
    },

    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").user_data.roles.find(
        (role) => role.name == "TREASURER"
      );
      return treasurer_role != undefined;
    },

    viewContribution(data) {
      this.$emit("view-contribution", data);
    },

    editContribution(data) {
      this.$store.dispatch("setSelectedContribution", data.data);

      this.$emit("edit-contribution", data);
    },

    getSelectedPaymentItem() {
      let item = null;
      item = this.$store.getters.getPaymentItems.data.filter(
        (ele) => ele.id === this.payment_item_id.value
      );
      this.$store.dispatch("setCurrentPaymentItem", item[0]); //set the state with the first element from the filtered array
    },

    filterContributions(
      payment_item_id,
      month,
      year,
      status,
      date,
      date_range,
      page,
      per_page
    ) {
      let payload = {
        status: "none",
        url: `/api/protected/organisations/contributions/search?payment_item_id=${payment_item_id}&month=${month}&year=${year}&status=${status}&date=${date}&range=${date_range}&page=${page}&per_page=${per_page}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_FILTERED_CONTRIBUTIONS",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.$store.commit("SET_PAGINATION", {
            sortBy: "name",
            descending: false,
            page: response.data.current_page,
            rowsPerPage: response.data.per_page,
            rowsNumber: response.data.total,
          });
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
        });

      return;
    },

    openSearchBar() {
      let payload = {
        data: null,
        tab: this.$t("app.searchContribution"),
      };

      this.$emit("search-members-contribution", payload);
    },

    downloadContributions() {
      const payment_item_id =
        this.$store.getters.getSearchContributionParams !== null &&
        this.$store.getters.getSearchContributionParams !== undefined
          ? this.$store.getters.getSearchContributionParams.item.value
          : "";
      const payment_item_name =
        this.$store.getters.getSearchContributionParams != null &&
        this.$store.getters.getSearchContributionParams !== undefined
          ? this.$store.getters.getSearchContributionParams.item.label
          : "";
      let month =
        this.$store.getters.getSearchContributionParams !== null &&
        this.$store.getters.getSearchContributionParams !== undefined
          ? this.$store.getters.getSearchContributionParams.month
          : "";
      let year =
        this.$store.getters.getSearchContributionParams !== null &&
        this.$store.getters.getSearchContributionParams !== undefined
          ? this.$store.getters.getSearchContributionParams.year
          : "";
      let status =
        this.$store.getters.getSearchContributionParams !== null &&
        this.$store.getters.getSearchContributionParams !== undefined
          ? this.$store.getters.getSearchContributionParams.status
          : "";
      let url = `/api/protected/download-contributions?payment_item_id=${payment_item_id}&month=${month}&year=${year}&status=${status}&payment_item_name=${payment_item_name}`;

      let file_name =
        this.$t("app.memberContributionDownloadLabel") +
        payment_item_name +
        ".pdf";
      this.loading_download = this.downloadPdf(url, file_name);
    },

    deleteRow(data) {
      this.$emit("delete-row", data);
    },
  },
  components: {
    TableVue,
  },
};
</script>

<style lang="scss" scoped>
.detail_name {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $grey8;
}

.summary {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $grey8;
  text-decoration: underline;
}
</style>
