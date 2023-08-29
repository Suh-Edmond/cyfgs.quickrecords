<template>
  <q-page>
    <div>
      <!-- header for filter categories -->
      <div
        class="row q-ml-xs q-pt-xs"
        :class="$q.screen.lg ? 'q-pa-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <q-select
            v-model="status"
            outlined
            dense
            :options="statuses"
            :label="$t('app.selectStatusLabel')"
          />
        </div>
        <div class="q-pl-lg col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <q-btn
            :label="$t('app.filter')"
            color="primary"
            :disabled="validateFilter"
            no-caps
            icon-right="filter_list"
            @click="filterItems"
            :loading="is_fetching"
          >
          </q-btn>
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn
            :label="$t('app.print')"
            :loading="loading"
            color="positive"
            :disabled="validateDownload"
            no-caps
            icon-right="print"
            @click="downloadExpenditureItemDetails"
          ></q-btn>
        </div>
      </div>
      <!-- table for categories -->
      <div>
        <div class="row q-pt-sm">
          <div class="col-md-12 col-xs-12 col-sm-12">
            <CategoryTable
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
              :pagination="pagination"
              :table_loading="table_loader"
              @edit-expenditure-item-detail="editExpenditureItemDetail"
              @view-expenditure-item-detail="viewExpenditureItemDetail"
              @delete-row="onDeleteRow"
              @onRequest="onRequest"
            >
            </CategoryTable>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";

export default {
  mixins: [HelperMixinVue, ExpenditureItemDetailMixinVue],
  mounted() {
    this.getExpenditureDetailsByItemId(1, 7, false);
  },

  data() {
    return {
      start_filter: false,
      loading: false,
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
      statuses: ["PENDING", "APPROVED", "DECLINED", "ALL"],
      status: "",
      total_item_amount: 0,
      total_amount_given: 0,
      total_amount_spent: 0,
      total_balance: 0,
      is_fetching: false,
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 7,
        rowsNumber: 0,
      },
      table_loader: false,
    };
  },
  computed: {
    validateFilter() {
      return this.status === "";
    },
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
  },

  methods: {
    getExpenditureDetailsByItemId(page, per_page, is_filtering) {
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
      this.table_loader = true;
      this.is_fetching = is_filtering;
      this.$store.commit("SET_EXPENDITURE_ITEM_DETAIL", null);
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.pagination.page = response.data.current_page;
          this.pagination.rowsNumber = response.data.total;
          this.pagination.rowsPerPage = response.data.per_page;
          this.total_amount_given = response.data.total_amount_given;
          this.total_amount_spent = response.data.total_amount_spent;
          this.total_item_amount = response.data.total_item_amount;
          this.total_balance = response.data.total_balance;
        })
        .finally(() => {
          this.table_loader = false;
          this.is_fetching = false;
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

    downloadExpenditureItemDetails() {
      let expenditure_item_id =
        this.$store.getters.getCurrentExpenditureItem.id;
      let url = `/api/protected/expenditure-item-details/download?expenditure_item_id=${expenditure_item_id}&status=${this.status}`;
      let file_name = "Expenditure_Item_Details.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    filterItems() {
      let expenditure_category =
        this.$store.getters.getCurrentExpenditureCategory;
      let expenditure_item = this.$store.getters.getCurrentExpenditureItem;

      this.$router.push({
        path: `/dashboard/expenditure-categories/${expenditure_category.id}/items/${expenditure_item.id}/details`,
        query: { status: this.status, t: new Date().getTime() },
      });

      this.getExpenditureDetailsByItemId(1, 7, true);
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
  },
};
</script>

<style lang="scss" scoped></style>
