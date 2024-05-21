<template>
  <q-page>
    <!--------------------------------------------------TABLE FOR EXPENDITURE DETAILS---------------------------------------->
    <div>
      <div
        :class="$q.screen.lg ? 'row q-pa-sm' : 'col q-gutter-sm q-px-sm'"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <q-select
          class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
          v-model="status"
          outlined
          dense
          :options="statuses"
          :label="$t('app.selectStatusLabel')"
        />
        <div
          class="col-md-9 col-lg-9 col-xs-12 col-sm-12 flex"
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
            :size="$q.platform.is.mobile ? 'sm' : 'md'"
          >
          </q-btn>
          <q-space />
          <q-btn
            :label="$t('app.print')"
            :loading="loading_download"
            :color="'positive'"
            :disabled="false"
            no-caps
            icon-right="print"
            @click="downloadExpenditureItemDetails"
            :size="$q.platform.is.mobile ? 'sm' : 'md'"
          ></q-btn>
        </div>
      </div>

      <CategoryTable
        :class="$q.platform.is.desktop ? 'q-pt-sm q-px-sm' : ' q-px-sm q-pt-xl'"
        :columns="columns"
        :data="expenditure_item_details"
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
        @showSelectedRecords="showSelectedRecords"
      >
      </CategoryTable>

      <!----------------------------------------------MULTIPLE APPROVAL/DECLINE OF RECORDS------------------------------->
      <q-card v-if="canShowBulkApproval" class="q-my-md q-mx-md">
        <q-card-section>
          <div class="flex justify-end">
            <q-btn
              class="approve_btn q-mx-md q-pa-xs"
              dense
              :label="$t('app.approveAll')"
              no-caps
              @click="onShowSelectedRecordsDialog('Approve')"
            />

            <q-btn
              class="decline_btn q-pa-xs q-mr-xl"
              dense
              :label="$t('app.declineAll')"
              no-caps
              @click="onShowSelectedRecordsDialog('Decline')"
            />
          </div>
        </q-card-section>
      </q-card>
      <!----------------------------------------------END OF MULTIPLE APPROVAL/DECLINE OF RECORDS----------------------->
    </div>

    <!-------------------------------------------DIALOG TO APPROVE/DECLINE PAYMENT------------------->
    <q-dialog v-model="show_payment_dialog">
      <q-card style="min-width: 600px" class="q-pa-xs">
        <q-card-section class="row items-center q-pb-sm">
          <div
            class="text-h6 confirm_payment_title"
            :class="type == 'Approve' ? 'text-secondary' : 'text-orange'"
          >
            {{ type }} {{ $t("app.partConfirmationMsg") }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div>
            <q-markup-table flat>
              <thead>
                <tr class="text-weight-bold">
                  <th class="text-left text-weight-bold">{{ $t("app.sn") }}</th>
                  <th class="text-left text-weight-bold">
                    {{ $t("app.nameLabel") }}
                  </th>
                  <th class="text-left text-weight-bold">
                    {{ $t("app.amountGivenLabel") }}
                  </th>
                  <th class="text-left text-weight-bold">
                    {{ $t("app.amountSpent") }}
                  </th>
                  <th class="text-left text-weight-bold">
                    {{ $t("app.balance") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selectedRecords" :key="index">
                  <td class="text-left">{{ index + 1 }}</td>
                  <td class="text-left">{{ item.name }}</td>
                  <td class="text-left">
                    {{ Number(item.amount_given).toLocaleString() }}
                  </td>
                  <td class="text-left">
                    {{ Number(item.amount_spent).toLocaleString() }}
                  </td>
                  <td class="text-left">
                    {{ Number(item.balance).toLocaleString() }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-weight-bold">
                    {{ $t("app.total") }}
                  </td>
                  <td class="text-left"></td>
                  <td class="text-left text-weight-bold">
                    {{ Number(computeRunningAmountGiven()).toLocaleString() }}
                    XAF
                  </td>
                  <td class="text-left text-weight-bold">
                    {{ Number(computeRunningAmountSpent()).toLocaleString() }}
                    XAF
                  </td>
                  <td class="text-left text-weight-bold">
                    {{ Number(computeRunningBalance()).toLocaleString() }} XAF
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </q-card-section>

        <q-card-section class="q-mb-md">
          <div class="flex justify-end">
            <q-btn
              class="form_button"
              :label="type == 'Approve' ? $t('app.approve') : $t('app.decline')"
              :loading="loading_payment"
              :color="type == 'Approve' ? 'secondary' : 'orange'"
              :disabled="false"
              no-caps
              @click="onConfirmPayment"
            >
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-------------------------------------------END OF DIALOG TO APPROVE/DECLINE PAYMENT------------>
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";

export default {
  mixins: [HelperMixinVue],

  mounted() {
    this.getExpenditureDetailsByItemId(1, 7, false, this.$route.params.id);
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
      statuses: ["PENDING", "APPROVED", "DECLINED", "ALL"],
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
      selectedRecords: new Set(),
      loading_payment: false,
      show_payment_dialog: false,
      type: "",
      expenditure_item_name: "",
    };
  },
  computed: {
    validateFilter() {
      return this.status === "";
    },

    validateDownload() {
      return this.expenditure_item_details.length == 0;
    },

    getBalance() {
      return this.total_amount_given - this.total_amount_spent;
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

    canShowBulkApproval() {
      return this.selectedRecords.size > 0;
    },

    getTableTitle() {
      return this.expenditure_item_details.length > 0
        ? this.$t("app.expensesFor") + this.expenditure_item_name
        : "";
    },

    getSummaryData() {
      let summary = {
        estimated_amount: this.total_item_amount,
        amount_given: this.total_amount_given,
        amount_spent: this.total_amount_spent,
        balance: this.getBalance,
        net_balance: this.getBalance,
      };

      return summary;
    },
  },
  methods: {
    getExpenditureDetailsByItemId(
      page,
      per_page,
      is_filtering,
      expenditure_item_id
    ) {
      let payload = {
        url: `/api/protected/expenditure-items/${expenditure_item_id}/details?page=${page}&per_page=${per_page}&status=${this.status}`,
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
      let url = `/api/protected/expenditure-item-details/download?expenditure_item_id=${expenditure_item_id}&status=${this.status}`;
      let file_name = "Expenditure_Item_Details.pdf";
      this.loading_download = this.downloadPdf(url, file_name);
    },

    filterItems() {
      this.$router.push({
        path: `/dashboard/expenditures/${this.expenditure_item_id}/details`,
        query: { status: this.status, t: new Date().getTime() },
      });

      this.getExpenditureDetailsByItemId(1, 7, true, this.expenditure_item_id);
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
          7,
          false,
          this.expenditure_item_id
        );
      });
    },

    showSelectedRecords(records) {
      return (this.selectedRecords = records);
    },

    computeRunningAmountGiven() {
      let total = 0;
      this.selectedRecords.forEach((ele) => {
        total += ele.amount_given;
      });
      return total;
    },

    computeRunningAmountSpent() {
      let total = 0;
      this.selectedRecords.forEach((ele) => {
        total += ele.amount_spent;
      });
      return total;
    },

    computeRunningBalance() {
      let total = 0;
      this.selectedRecords.forEach((ele) => {
        total += ele.balance;
      });
      return total;
    },

    onShowSelectedRecordsDialog(type) {
      this.show_payment_dialog = true;
      return (this.type = type);
    },

    setApproveFeedbackMsg() {
      let msg =
        this.$t("app.recordWas") + `${this.type}` + this.$t("app.successfull");
      return msg;
    },

    setRequestData() {
      let data = [];
      this.selectedRecords.forEach((ele) => {
        data.push({
          id: ele.id,
          type: this.type === "Approve" ? "APPROVED" : "DECLINED",
        });
      });

      return data;
    },

    onConfirmPayment() {
      let payload = {
        url: `/api/protected/expenditure-details/bulk_approve`,
        msg: this.setApproveFeedbackMsg(),
        data: this.setRequestData(),
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
      this.loading_payment = true;
      this.$store
        .dispatch("putRequest", payload)
        .then((res) => {
          if (res.success) {
            this.getExpenditureDetailsByItemId(
              1,
              7,
              false,
              this.$route.params.id
            );
          }
        })
        .finally(() => {
          this.show_payment_dialog = false;
          this.loading_payment = false;
          this.selectedRecords = new Set();
        });
    },
  },
  components: {
    CategoryTable,
  },
};
</script>

<style lang="scss" scoped>
.tableHead {
  background-color: "#5384ae";
  color: "#FFFFFF";
}

.viewExpenditureItem {
  width: 5.5rem;
  margin-left: 1rem;
}

.viewPending {
  width: 5.5rem;
}

.approve_btn {
  background-color: $secondary;
  color: white;
  width: 6rem;
}

.decline_btn {
  background-color: $orange;
  color: white;
  width: 6.5rem;
}

.detail_name {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: $grey5;
}

.detail_value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: $grey8;
}

.summary {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 11px;
  color: $grey8;
  text-decoration: underline;
}

.confirm_payment_title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 24px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
  // color: $primary;
}
</style>
