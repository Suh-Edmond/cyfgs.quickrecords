<template>
  <div class="q-pa-sm">
    <!-- spinner when fetching data -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-lg"
        v-if="getLoadingState"
      />
    </div>

    <!-- report details available -->
    <div>
      <div
        class="row q-ml-xs q-pt-md justify-between"
        :class="$q.screen.lg ? 'q-pa-md' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div>
          <q-btn
            label="Filter"
            color="primary"
            :disabled="false"
            no-caps
            icon-right="filter_list"
            @click="openReportBar()"
          >
          </q-btn>
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn
            label="Print"
            :loading="loading"
            color="positive"
            :disabled="data.length == 0"
            no-caps
            icon-right="print"
            @click="downloadContributions()"
          ></q-btn>
        </div>
      </div>
      <!-- table for contributions -->
      <div class="row q-pt-sm" v-if="getActivityReportIncomeData.length > 0">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <ReportsTable
            :income_title="title"
            :income_columns="columns"
            :income_data="getActivityReportIncomeData"
            :expenditure_columns="expenditure_columns"
            :expenditure_data="getActivityReportExpenditureData"
            :expenditure_title="expenditure_title"
            :total_amount_given="computeTotalAmountGiven"
            :total_amount_spent="computeTotalAmountSpent"
            :net_balance="computeNetBalance"
            :total_balance="computeTotalBalance"
            :total_income="computeTotalIncome"
          >
          </ReportsTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReportsTable from "src/components/ReportsTable.vue";

export default {
  mounted() {},

  data() {
    return {
      payment_item_id: null,
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
          label: "Description",
          align: "left",
          field: "name",
        },
        {
          name: "amount",
          align: "left",
          label: "Amount Deposited (XAF)",
          field: "amount",
        },
      ],
      data: [],
      title: "Income Statement",
      expenditure_columns: [
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
          label: "Description",
          align: "left",
          field: "name",
        },
        {
          name: "amount_given",
          align: "left",
          label: "Amount Given (XAF)",
          field: "amount_given",
        },
        {
          name: "amount_spent",
          align: "left",
          label: "Amount Spent (XAF)",
          field: "amount_spent",
        },
        {
          name: "balance",
          align: "left",
          label: "Balance (XAF)",
          field: "balance",
        },
      ],
      expenditure_data: [],
      expenditure_title: "Expenditures/Disbursements",
    };
  },
  computed: {
    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getActivityReportIncomeData() {
      let data = [];
      if (this.$store.getters.getActivityReportData.length > 0) {
        this.$store.getters.getActivityReportData[0].forEach((ele) => {
          data.push({
            counter:
              this.$store.getters.getActivityReportData[0].indexOf(ele) + 1,
            name: ele.name,
            amount: ele.amount,
          });
        });
      }
      return data;
    },

    computeTotalIncome() {
      let total = 0;
      if (this.$store.getters.getActivityReportData.length > 0) {
        this.$store.getters.getActivityReportData[0].forEach((ele) => {
          total += parseFloat(ele.amount)
        });
      }
      return total
    },


    getActivityReportExpenditureData() {
      let data = [];
      if (this.$store.getters.getActivityReportData.length > 0) {
        this.$store.getters.getActivityReportData[1].forEach((ele) => {
          data.push({
            counter:
              this.$store.getters.getActivityReportData[1].indexOf(ele) + 1,
            name: ele.name,
            amount_given: ele.amount_given,
            amount_spent:ele.amount_spent,
            balance: ele.balance
          });
        });
      }
      return data;
    },
    computeTotalAmountGiven() {
      let total = 0;
      if (this.$store.getters.getActivityReportData.length > 0) {
        this.$store.getters.getActivityReportData[1].forEach((ele) => {
          total += ele.amount_given
        });
      }
      return total
    },
    computeTotalAmountSpent() {
      let total = 0;
      if (this.$store.getters.getActivityReportData.length > 0) {
        this.$store.getters.getActivityReportData[1].forEach((ele) => {
          total += ele.amount_spent
        });
      }
      return total
    },
    computeTotalBalance() {
      let total = 0;
      if (this.$store.getters.getActivityReportData.length > 0) {
        this.$store.getters.getActivityReportData[1].forEach((ele) => {
          total += ele.balance
        });
      }
      return total
    },

    computeNetBalance(){
      return (this.computeTotalIncome - this.computeTotalAmountSpent) + this.computeTotalBalance
    }
  },

  methods: {
    openReportBar() {
      let payload = {
        data: null,
        tab: "Generate Reports",
      };

      this.$emit("report-generation", payload);
    },

    downloadContributions() {
      let payment_item_id =
        this.$store.getters.getSearchSavingParams.payment_item_id.id;
      let month = this.$store.getters.getSearchSavingParams.month;
      let year = this.$store.getters.getSearchSavingParams.year;
      let status = this.$store.getters.getSearchSavingParams.status;
      let url = `/api/protected/download-contributions?payment_item_id=${payment_item_id}&month=${month}&year=${year}&status=${status}`;

      let file_name =
        "Member's Contribution for " +
        this.$store.getters.getSearchSavingParams.payment_item_id.name +
        ".pdf";
      this.loading = this.downloadPdf(url, file_name);
    },
  },
  components: {
    ReportsTable,
  },
};
</script>

<style lang="scss" scoped></style>
