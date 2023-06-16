<template>
  <div class="q-px-sm">
    <!-- report details available -->
    <div>
      <div
        class="row q-ml-xs justify-between"
        :class="$q.screen.lg ? 'q-pa-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div
          class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-pr-md' : ''"
        >
          <q-select
            v-model="option"
            outlined
            dense
            :options="options"
            label="Select an option to Generate Report"
            @input="selectedOption"
            clearable
          />
        </div>
        <div
          class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-pr-md' : ''"
        >
          <q-select
            v-model="group"
            outlined
            dense
            :options="report_options"
            :label="selected_option_label"
            input-debounce="0"
            use-input
            clearable
            @filter="filterOptions"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div
          class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-pr-md' : ''"
        >
          <q-btn
            label="Generate Report"
            color="primary"
            @click="generateReport"
            no-caps
            class="full-width"
            :disabled="validateGenerateReport"
            :loading="is_fetching"
          >
          </q-btn>
        </div>
        <div
          class="button q-pb-xs col-md-3 col-lg-3 col-xs-12 col-sm-12 flex justify-end"
        >
          <q-btn
            label="Print"
            :loading="loading"
            color="positive"
            :disabled="income_per_activity.length < 0"
            no-caps
            icon-right="print"
            @click="downloadReport()"
          ></q-btn>
        </div>
      </div>
      <!-- table for report by activity -->
      <div class="row q-pt-sm" v-if="show_activity_report">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <ReportsTable
            :income_title="title"
            :income_columns="columns"
            :income_data="income_per_activity"
            :expenditure_columns="expenditure_columns"
            :expenditure_data="expenditures_per_activity"
            :expenditure_title="expenditure_title"
            :total_amount_given="total_amount_given"
            :total_amount_spent="total_amount_spent"
            :net_balance="net_balance"
            :total_balance="total_balance"
            :total_income="total_income"
            :heading="heading"
            :total_estimated_amount="total_estimated_amount"
          >
          </ReportsTable>
        </div>
      </div>

      <!-- quarterly report table -->
      <div class="row q-pt-sm" v-if="show_quarterly_report">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <QuarterlyReportTable :heading="heading"> </QuarterlyReportTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReportsTable from "src/components/ReportsTable.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";
import QuarterlyReportTable from "src/components/QuarterlyReportTable.vue";
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";

export default {
  mixins: [HelperMixin, CurrentYearMixinVue],
  mounted() {},

  data() {
    return {
      show_quarterly_report: false,
      show_activity_report: false,
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
          label: "Amount (XAF)",
          field: "amount",
        }
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
      group: null,
      options: [
        { label: "By Activity/Event", value: 1 },
        { label: "Quaterly (3 months)", value: 2 },
        { label: "Yearly (12 months)", value: 3 },
      ],
      label: "Generate Report",
      year: null,
      income_per_activity: [],
      expenditures_per_activity: [],
      total_income: 0.0,
      total_amount_given: 0.0,
      total_amount_spent: 0.0,
      total_balance: 0.0,
      net_balance: 0.0,
      heading: null,
      is_fetching: false,
      total_estimated_amount: 0.0,
      option: null,
      selected_option_label: null,
      report_options: [],
      quarters: [
        { label: "January - March", value: "1" },
        { label: "April - June", value: "2" },
        { label: "July - September", value: "3" },
        { label: "October - December", value: "4" },
      ],
      incomes:[],
    };
  },
  computed: {
    validateGenerateReport() {
      return this.option == null || this.group == null ? true : false;
    },
  },

  methods: {
    selectedOption() {
      if (this.option != null) {
        switch (this.option.value) {
          case 1:
            this.getPaymentItems();
            this.selected_option_label = "Select Activity";
            break;
          case 2:
            this.selected_option_label = "Select Quarter";
            break;
          case 3:
            this.getSessionsFromState;
            this.selected_option_label = "Select Year";
            break;
        }
      }
    },

    getPaymentItems() {
      let payload = {
        status: "none",
        url: `/api/protected/payment-items`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_PAYMENT_ACTIVITIES",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    getPaymentActivitiesFromStatus() {
      let activities = [];
      this.$store.getters.getPaymentActivities.forEach((ele) => {
        activities.push({
          label: ele.name,
          value: ele.id,
          amount: ele.amount,
        });
      });
      return activities;
    },

    generateReport() {
      switch(this.option.value){
        case 1:
          this.generateActivityReport();
        break;
        case 2:
          this.generateQuarterlyReport();
        break
      }
    },

    generateActivityReport() {
      this.is_fetching = true;
      (this.income_per_activity = []),
        (this.expenditures_per_activity = []),
        (this.total_income = 0.0);
      this.total_amount_given = 0.0;
      this.total_amount_spent = 0.0;
      this.total_balance = 0.0;
      this.net_balance = 0.0;
      let payload = {
        status: "none",
        url: `/api/protected/activity/${this.group.value}/generate-report`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          if (res.data.length > 0) {
            this.heading = `Financial Report for ${this.group.label}`;
            this.getActivityReportIncomeData(res.data[0]);
            this.computeTotalIncome(res.data[0]);
            this.getActivityReportExpenditureData(res.data[1]);
            this.computeTotalAmountGiven(res.data[1]);
            this.computeTotalAmountSpent(res.data[1]);
            this.computeTotalBalance(res.data[1]);
            this.computeNetBalance();
            this.validateDownloadBtn(res.data);
            this.total_estimated_amount = res.data[2];
          }
          this.show_activity_report = true;
        })
        .finally(() => {
          this.is_fetching = false;
        });
    },

    generateQuarterlyReport() {
      this.is_fetching = true;
      this.heading = `Quarterly Report from  ${this.group.label} ${this.getCurrentYear.year}`;
      let payload = {
        status: "none",
        url: `/api/protected/generate-quarterly-report?quarter=${this.group.value}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_REPORT_DATA",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then(() => {
          this.show_quarterly_report = true;
        })
        .finally(() => {
          this.is_fetching = false;
        });
        return this.data;
    },

    getActivityReportIncomeData(data) {
      data.forEach((ele) => {
        this.income_per_activity.push({
          counter: data.indexOf(ele) + 1,
          name: ele.name,
          amount: ele.amount,
        });
      });
      return this.income_per_activity;
    },

    getQuarterlyIncome(data){
      this.data = [];
      return this.data = data;
    },

    computeTotalIncome(data) {
      data.forEach((ele) => {
        this.total_income += parseFloat(ele.amount);
      });
      return this.total_income;
    },

    getActivityReportExpenditureData(data) {
      data.forEach((ele) => {
        this.expenditures_per_activity.push({
          counter: data.indexOf(ele) + 1,
          name: ele.name,
          amount_given: ele.amount_given,
          amount_spent: ele.amount_spent,
          balance: ele.balance,
        });
      });
      return this.expenditures_per_activity;
    },

    computeTotalAmountGiven(data) {
      data.forEach((ele) => {
        this.total_amount_given += ele.amount_given;
      });
      return this.total_amount_given;
    },

    computeTotalAmountSpent(data) {
      data.forEach((ele) => {
        this.total_amount_spent += ele.amount_spent;
      });
      return this.total_amount_spent;
    },

    computeTotalBalance(data) {
      data.forEach((ele) => {
        this.total_balance += ele.balance;
      });
      return this.total_balance;
    },

    computeNetBalance() {
      return (this.net_balance =
        this.total_income - this.total_amount_spent + this.total_balance);
    },

    validateDownloadBtn(data) {
      return data.length < 0 ? true : false;
    },

    downloadReport() {
      let id = this.group != null ? this.group.value : "";
      let label = this.group != null ? this.group.label : "";
      this.loading = true;
      let url = "";
      let file_name = ""
      if (this.group == 1) {
        url = `/api/protected/activity/${id}/report/download?payment_actvity=${label}`;
        file_name = "Activity_Report.pdf";
      }
      if(this.group.value == 2){
        url = `/api/protected/report/quarter/download?quarter=${this.group.value}`;
        file_name = "Quarterly_Report.pdf";
      }
      this.loading = this.downloadPdf(url, file_name);
      return this.loading;
    },

    filterOptions(val, update, abort) {
      switch (this.option.value) {
        case 1:
          this.filterPaymentItems(val, update, abort);
          break;
        case 2:
          this.options = this.filterQuarters(val, update, abort);
          break;
        case 3:
          this.options = this.filterYears(val, update, abort);
          break;
      }
      return this.options;
    },

    filterPaymentItems(val, update, abort) {
      if (val < 1) {
        abort();
        return;
      }
      update(() => {
        this.report_options = this.getPaymentActivitiesFromStatus().filter(
          (item) => item.label.toLowerCase().includes(val.toLowerCase())
        );
      });

      return this.report_options;
    },

    filterQuarters(val, update, abort) {
      this.report_options = [];
      if (val < 1) {
        abort();
        return;
      }

      update(() => {
        this.report_options = this.quarters.filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.report_options;
      });
    },

    filterYears(val, update, abort) {
      this.report_options = [];
      if (val < 1) {
        abort();
        return;
      }

      update(() => {
        this.report_options = this.getSessionsFromState.filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.report_options;
      });
    },
  },
  components: {
    ReportsTable,
    QuarterlyReportTable,
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  align-items: center;
  letter-spacing: 0.1em;
  color: $grey5;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.form_button {
  width: 100%;
}

.separator {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  align-items: center;
  letter-spacing: 0.1em;
  color: $grey5;
  margin-top: 1.3rem;
}
</style>
