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
            @input="filterItems"
          />
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn
            :label="$t('app.print')"
            :loading="loading"
            :color="'positive'"
            :disabled="false"
            no-caps
            icon-right="print"
            @click="downloadExpenditureItemDetails"
          ></q-btn>
        </div>
      </div>
      <!-- table for categories -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12" v-show="!start_filter">
          <CategoryTable
            :columns="columns"
            :data="getExpenditureDetails"
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
            @view-expenditure-item-detail="viewExpenditureItemDetail"
          >
          </CategoryTable>
        </div>

        <!-- table for filtered results -->
        <div class="col-md-12 col-xs-12 col-sm-12" v-show="start_filter">
          <CategoryTable
            :columns="columns"
            :data="filtered_items"
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
            @view-expenditure-item-detail="viewExpenditureItemDetail"
          >
          </CategoryTable>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";

export default {
  mixins: [HelperMixinVue],

  mounted() {},

  data() {
    return {
      start_filter: false,
      color: "primary",
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
          label: "Transaction Status",
          field: "approve",
          sortable: true,
        },
        {
          name: "action",
          label: "Action",
          field: "action",
          sortable: true,
          align: "left",
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      label: this.$t("app.delete"),
      message: "",
      statuses: ["PENDING", "APPROVED", "DECLINED", "ALL"],
      status: null,
      filtered_items: [],
      show_spinner: false,
    };
  },
  computed: {
    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
    getExpenditureItemName() {
      return this.$store.getters.getExpenditureItemName;
    },

    getExpenditureItemAmount() {
      return this.$store.getters.getExpenditureItemDetails != null && this.$store.getters.getExpenditureItemDetails.length > 0 ? this.$store.getters.getExpenditureItemDetails[2]
        .expenditure_item_amount : 0;
    },

    getTotalAmountGiven() {
      return this.$store.getters.getExpenditureItemDetails != null && this.$store.getters.getExpenditureItemDetails.length > 0 ? this.$store.getters.getExpenditureItemDetails[3]
        .total_amount_given : 0;
    },

    getTotalAmountSpent() {
      return this.$store.getters.getExpenditureItemDetails != null && this.$store.getters.getExpenditureItemDetails.length > 0 ? this.$store.getters.getExpenditureItemDetails[4]
        .total_amount_spent : 0;
    },

    getBalance() {
      return this.getTotalAmountGiven - this.getTotalAmountSpent;
    },

    getTotalBalance() {
      return this.$store.getters.getExpenditureItemDetails != null && this.$store.getters.getExpenditureItemDetails.length > 0 ? this.$store.getters.getExpenditureItemDetails[5].total_balance : 0;
    },

    getExpenditureDetails() {
      let data = [];
       if (this.$store.getters.getExpenditureItemDetails != null && this.$store.getters.getExpenditureItemDetails.length > 0) {
          this.$store.getters.getExpenditureItemDetails[0].forEach((ele) => {
              data.push({
                counter: this.$store.getters.getExpenditureItemDetails[0].indexOf(ele) + 1,
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
  },
  methods: {
    downloadExpenditureItemDetails() {
      let expenditure_item_id = this.$router.currentRoute.params.id;
      let url = `/api/protected/expenditure-item-details/download?expenditure_item_id=${expenditure_item_id}&status=${this.status}`;
      let file_name = "Expenditure_Item_Details.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    filterItems() {
      this.start_filter = true;
      this.show_spinner = true;
      let expenditure_item_id = this.$router.currentRoute.params.id;

      this.$router.push({
        path: `/dashboard/expenditures/${expenditure_item_id}/details`,
        query: { status: this.status },
      });

      if (this.status == "ALL") {
        this.filtered_items = this.getExpenditureDetails;
      } else {
        const items = this.getExpenditureDetails.filter(
          (item) => item.approve == this.status
        );
        this.filtered_items = items;
      }
      this.filtered_items = Array.from(this.filtered_items);
      this.show_spinner = false;
      return this.filtered_items;
    },

    viewExpenditureItemDetail(data) {
      this.$store.dispatch("setUpdatedExpenditureItemDetail", data.data);
      this.$emit("view-expenditure-item-detail", data);
    },
  },
  components: {
    CategoryTable,
  },
};
</script>

<style lang="scss" scoped></style>
