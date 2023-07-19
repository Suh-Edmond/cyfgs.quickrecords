<template>
  <q-page>
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-lg"
        v-if="getLoadingState"
      />
    </div>

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
              :expenditure_item_amount="getExpenditureItemAmount"
              :total_amount_given="getTotalAmountGiven"
              :total_amount_spent="getTotalAmountSpent"
              :balance="getBalance"
              :total_balance="getTotalBalance"
              @edit-expenditure-item-detail="editExpenditureItemDetail"
              @view-expenditure-item-detail="viewExpenditureItemDetail"
              @delete-row="onDeleteRow"
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
      label: this.$t('app.delete'),
      message: this.$t('app.expenditureItemDetailDeleteMsg'),
      statuses: ["PENDING", "APPROVED", "DECLINED", "ALL"],
      status: "",
      filtered_items: [],
      total_item_amount: 0,
      total_amount_given: 0,
      total_amount_spent: 0,
      total_balance: 0,
      is_fetching: false,
    };
  },
  computed: {
    validateFilter() {
      return this.status == null;
    },
    getExpenditureItemDetails() {
      let data = [];
      if (this.filtered_items.length == 0 && !this.start_filter) {
        if (this.$store.getters.getExpenditureItemDetails != null) {
          this.$store.getters.getExpenditureItemDetails[0].forEach((ele) => {
            data.push({
              counter:
                this.$store.getters.getExpenditureItemDetails[0].indexOf(ele) +
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
      } else {
        data = this.filtered_items;
      }
      return data;
    },

    getExpenditureItemName() {
      return this.$store.getters.getCurrentExpenditureItem != null
        ? this.$store.getters.getCurrentExpenditureItem.name
        : "";
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getExpenditureItemAmount() {
      let total = 0;
      if (
        this.$store.getters.getExpenditureItemDetails != null && this.$store.getters.getExpenditureItemDetails.length > 0 &&
        !this.start_filter
      ) {
        total =
          this.$store.getters.getExpenditureItemDetails[2]
            .expenditure_item_amount;
      } else {
        if (this.filtered_items.length > 0) {
          total = this.total_item_amount;
        }
      }
      return total;
    },

    getTotalAmountGiven() {
      let total = 0;
      if (
        this.$store.getters.getExpenditureItemDetails.length > 0 &&
        !this.start_filter
      ) {
        total =
          this.$store.getters.getExpenditureItemDetails[3].total_amount_given;
      } else {
        if (this.filtered_items.length > 0) {
          total = this.total_amount_given;
        }
      }
      return total;
    },

    getTotalAmountSpent() {
      let total = 0;
      if (
        this.$store.getters.getExpenditureItemDetails.length > 0 &&
        !this.start_filter
      ) {
        total =
          this.$store.getters.getExpenditureItemDetails[4].total_amount_spent;
      } else {
        if (this.filtered_items.length > 0) {
          total = this.total_amount_spent;
        }
      }
      return total;
    },

    getBalance() {
      return this.getTotalAmountGiven - this.getTotalAmountSpent;
    },

    getTotalBalance() {
      let total = 0;
      if (
        this.$store.getters.getExpenditureItemDetails.length > 0 &&
        !this.start_filter
      ) {
        total = this.$store.getters.getExpenditureItemDetails[5].balance;
      } else {
        if (this.filtered_items.length > 0) {
          total = this.total_balance;
        }
      }
      return total;
    },

    validateDownload() {
      return this.getExpenditureItemDetails.length == 0;
    },
  },
  methods: {
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
      this.is_fetching = true;
      let expenditure_category =
        this.$store.getters.getCurrentExpenditureCategory;
      let expenditure_item = this.$store.getters.getCurrentExpenditureItem;
      this.filtered_items = [];

      this.$router.push({
        path: `/dashboard/expenditure-categories/${expenditure_category.id}/items/${expenditure_item.id}/details`,
        query: { status: this.status },
      });

      let payload = {
        url: this.setFilterItemActionUrl(this.status, expenditure_item.id),
        msg: "none",
        color: "default",
        status: "none",
        error_msg:this.$t('app.defaultErrorMsg'),
        has_commit: false,
        show_feedback: false,
        show_spinner: true,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          this.start_filter = true;
          if (res != undefined) {
            this.total_item_amount = res.data[2].total_item_amount;
            this.total_amount_given = res.data[3].total_amount_given;
            this.total_amount_spent = res.data[4].total_amount_spent;
            this.total_balance = res.data[5].total_balance;
            res.data[0].forEach((ele) => {
              this.filtered_items.push({
                counter: res.data[0].indexOf(ele) + 1,
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
        })
        .finally(() => {
          this.is_fetching = false;
        });

      return this.filtered_items;
    },

    setFilterItemActionUrl(status, expenditure_item_id) {
      let url = "";
      if (status != "") {
        url = `/api/protected/expenditure-details?expenditure_item_id=${expenditure_item_id}&status=${this.status}`;
      } else {
        url = `/api/protected/expenditure-items/${expenditure_item_id}/details`;
      }
      return url;
    },

    onDeleteRow(data) {
      let payload = {
        url: `/api/protected/expenditure-item-details/${data.id}`,
        msg: this.$t('app.expenditureItemDetailDeletedSuccessMsg'),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg:this.$t('app.defaultErrorMsg'),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("deleteRequest", payload).then(() => {
        this.getExpenditureDetailsByItemId(data.expenditure_item_id.id);
      });
    },
  },
  components: {
    CategoryTable,
  },
};
</script>

<style lang="scss" scoped></style>
