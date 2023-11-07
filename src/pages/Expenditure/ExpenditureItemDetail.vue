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
        :columns="columns"
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
      >
      </CategoryTable>

      <div class="q-mt-md" v-if="getExpenditureItemDetails.length > 0">
        <q-card>
          <q-card-section>
            <div class="row q-ml-md">
              <label class="q-py-lg text-bold summary text-capitalize">{{
                $t("app.expenditureSummaryLabel")
              }}</label>
            </div>
            <div class="row q-ml-md">
              <div class="col-4 col-md-4 col-lg-4 col-xs-12 col-sm-4">
                <div class="q-mb-xs">
                  <label class="text-bold q-py-md detail_name"
                    >{{ $t("app.expenditureItemSummary") }}:</label
                  >
                </div>
                <div class="q-mb-xs">
                  <label class="text-bold q-py-md detail_name"
                    >{{ $t("app.estimatedAmount") }}:</label
                  >
                </div>
                <div class="q-mb-xs">
                  <label class="text-bold q-py-md detail_name"
                    >{{ $t("app.totalAmountGiven") }}:</label
                  >
                </div>
                <div class="q-mb-xs">
                  <label class="text-bold q-py-md detail_name"
                    >{{ $t("app.totalAmountSpent") }}:</label
                  >
                </div>
                <div class="q-mb-xs">
                  <label class="text-bold q-py-md detail_name"
                    >{{ $t("app.totalBalance") }}:</label
                  >
                </div>
                <div class="q-mb-xs">
                  <label class="text-bold q-py-md detail_name"
                    >{{ $t("app.netBalance") }}:<br />
                    <small class="text-italic"
                      >[ {{ $t("app.netBalance") }} =
                      {{ $t("app.formular") }} ]</small
                    >
                    <br />
                  </label>
                </div>
              </div>
              <div class="col-4 col-md-4 col-lg-4 col-xs-12 col-sm-4">
                <div class="q-mb-xs">
                  <label class="text-bold q-py-md detail_value"
                    >{{ getExpenditureItemName }}
                  </label>
                </div>
                <div class="q-mb-xs">
                  <label class="text-bold q-py-md detail_value"
                    >{{ Number(total_item_amount).toLocaleString() }} XAF</label
                  >
                </div>
                <div class="q-mb-xs">
                  <label class="text-bold q-py-md detail_value"
                    >{{
                      Number(getTotalAmountGiven).toLocaleString()
                    }}
                    XAF</label
                  >
                </div>
                <div class="q-mb-xs">
                  <label class="text-bold q-py-md detail_value"
                    >{{
                      Number(getTotalAmountSpent).toLocaleString()
                    }}
                    XAF</label
                  >
                </div>
                <div class="q-mb-xs">
                  <label class="text-bold q-py-md detail_value"
                    >{{ Number(getBalance).toLocaleString() }} XAF</label
                  >
                </div>
                <div class="q-mb-xs">
                  <label class="text-bold q-py-md detail_value"
                    >{{ Number(getNetBalance).toLocaleString() }} XAF</label
                  >
                </div>
              </div>
            </div>
            <div class="row q-mt-md q-mb-lg" v-if="total_balance < 0">
              <q-icon
                name="info"
                color="warning"
                size="sm"
                class="q-pr-md"
              ></q-icon>
              <label class="text-orange text-subtitle2">
                {{ $t("app.negativeExpenditureBalanceMsg") }}
              </label>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import FilterComponentVue from "src/components/FilterComponent.vue";

export default {
  mixins: [HelperMixinVue, ExpenditureItemDetailMixinVue],
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
    this.getExpenditureDetailsByItemId(1, 7, false);
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
      label: this.$t("app.delete"),
      message: this.$t("app.expenditureItemDetailDeleteMsg"),
      status: "",
      total_item_amount: 0,
      total_amount_given: 0,
      total_amount_spent: 0,
      total_balance: 0,
    };
  },
  computed: {
    getExpenditureItemDetails() {
      let data = [];
      if (this.$store.getters.getExpenditureItemDetails !== null) {
        this.$store.getters.getExpenditureItemDetails.data.forEach((ele) => {
          data.push({
            counter:
              this.$store.getters.getExpenditureItemDetails.data.indexOf(ele) +
              1,
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
          });
        });
      }
      return data;
    },

    getExpenditureItemName() {
      return this.$store.getters.getCurrentExpenditureItem != null
        ? this.$store.getters.getCurrentExpenditureItem.name
        : "";
    },

    validateDownload() {
      return this.getExpenditureItemDetails.length == 0;
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
      return this.$store.getters.getExpenditureItemDetails.total_amount_given;
    },

    getTotalAmountSpent() {
      return this.$store.getters.getExpenditureItemDetails.total_amount_spent;
    },

    getNetBalance() {
      return this.$store.getters.getExpenditureItemDetails.total_balance;
    },
  },

  methods: {
    getExpenditureDetailsByItemId(page, per_page) {
      let expenditure_item = this.$store.getters.getCurrentExpenditureItem;
      let payload = {
        url: `/api/protected/expenditure-items/${expenditure_item.id}/details?page=${page}&per_page=${per_page}&status=${this.status}`,
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
    },

    onRequest(props) {
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.getExpenditureDetailsByItemId(page, fetch_count, false);
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

      this.getExpenditureDetailsByItemId(1, 7);
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
        this.getExpenditureDetailsByItemId(1, 7, false);
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
  color: $grey8;
  text-decoration: underline;
}

.text-subtitle2 {
  font-size: small;
}
</style>
