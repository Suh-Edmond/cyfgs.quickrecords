<template>
  <div class="q-px-sm">
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
        class="row q-ml-xs justify-between"
        :class="$q.screen.lg ? 'q-pa-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div>
          <q-btn
            label="Filter"
            color="primary"
            @click="showReportMenuBar"
            no-caps
            icon-right="filter_list"
          >
          </q-btn>
        </div>
        <!-- menu for report generation -->
        <div>
          <q-menu v-model="show_menu" anchor="top right">
            <q-card class="q-px-sm">
              <q-card-section>
                <div>
                  <label for="title" class="title"
                    >Select an option to Generate Report</label
                  >
                </div>
                <div class="q-pt-sm">
                  <q-option-group
                    :options="options"
                    type="radio"
                    v-model="group"
                    @input="selectedOption"
                  />
                </div>
                <!-- report generation by activity -->
                <div v-if="group == 1" class="q-pt-sm">
                  <div class="q-mb-md">
                    <label for="name" class="form_field"
                      >Select Activity or Event to Generate Report
                    </label>
                    <q-select
                      outlined
                      dense
                      v-model="activity"
                      placeholder="Type name to search..."
                      :options="payment_items"
                      input-debounce="0"
                      class="q-mt-md"
                    >
                    </q-select>
                  </div>

                  <div>
                    <q-btn
                      class="form_button q-mb-md"
                      :label="label"
                      :loading="is_fetching"
                      :color="color"
                      @click="generateReport"
                      :no_caps="no_caps"
                    >
                      <q-icon
                        name="arrow_forward"
                        size="xs"
                        class="q-pl-lg"
                      ></q-icon>
                    </q-btn>
                  </div>
                </div>

                <!-- quaterly report generation  -->
                <div v-if="group == 2" class="q-pt-md">
                  <div>
                    <q-btn
                      class="form_button q-mb-md"
                      :label="label"
                      :loading="loading"
                      :color="color"
                      :disabled="group != 2"
                      :no_caps="no_caps"
                    >
                      <q-icon
                        name="arrow_forward"
                        size="xs"
                        class="q-pl-lg"
                      ></q-icon>
                    </q-btn>
                  </div>
                </div>

                <!-- mid-year report generation  -->
                <div v-if="group == 3" class="q-pt-md">
                  <div>
                    <q-btn
                      class="form_button q-mb-md"
                      :label="label"
                      :loading="loading"
                      :color="color"
                      :disabled="group != 3"
                      :no_caps="no_caps"
                    >
                      <q-icon
                        name="arrow_forward"
                        size="xs"
                        class="q-pl-lg"
                      ></q-icon>
                    </q-btn>
                  </div>
                </div>

                <!-- yearly report generation  -->
                <div v-if="group == 4" class="q-pt-md">
                  <div class="q-mb-md">
                    <label for="name" class="form_field"
                      >Select Year to Generate Report
                    </label>
                    <q-select
                      outlined
                      dense
                      v-model="year"
                      placeholder="Type name to search..."
                      :options="years"
                      input-debounce="0"
                      class="q-mt-md"
                    >
                    </q-select>
                  </div>

                  <div>
                    <q-btn
                      class="form_button q-mb-md"
                      :label="label"
                      :loading="loading"
                      :color="color"
                      :disabled="group != 4"
                      :no_caps="no_caps"
                    >
                      <q-icon
                        name="arrow_forward"
                        size="xs"
                        class="q-pl-lg"
                      ></q-icon>
                    </q-btn>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-menu>
        </div>
        <q-space />
        <div class="button q-pb-xs">
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
      <!-- table for contributions -->
      <div class="row q-pt-sm" v-if="income_per_activity.length > 0">
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
    </div>
  </div>
</template>

<script>
import ReportsTable from "src/components/ReportsTable.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";

export default {
  mixins:[HelperMixin],
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
      group: null,
      options: [
        { label: "By Activity/Event", value: 1 },
        { label: "Quaterly (3 months)", value: 2 },
        { label: "Mid-Year (6 months)", value: 3 },
        { label: "Yearly (12 months)", value: 4 },
      ],
      no_caps: false,
      color: "primary",
      label: "Generate Report",
      activity: null,
      payment_items: [],
      years: ["2020", "2021", "2022", "2023", "2024"],
      year: null,
      income_per_activity: [],
      expenditures_per_activity: [],
      total_income: 0.0,
      total_amount_given: 0.0,
      total_amount_spent: 0.0,
      total_balance: 0.0,
      net_balance: 0.0,
      heading: null,
      show_menu: false,
      is_fetching:false,
      total_estimated_amount:0.0,
    };
  },
  computed: {
    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },

  methods: {
    validateForm() {
      return false;
    },

    showReportMenuBar() {
      return (this.show_menu = true);
    },

    selectedOption() {
      switch (this.group) {
        case 1:
          this.getPaymentItems();
          break;
      }
    },

    getPaymentItems() {
      this.payment_items = [];
      let payload = {
        status: "none",
        url: `/api/protected/payment-items`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
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
      this.$store.dispatch("getRequest", payload).then((res) => {
        if (res.success) {
          res.data.forEach((ele) => {
            this.payment_items.push({
              label: ele.name,
              value: ele.id,
            });
          });
        }
      });

      return this.payment_items;
    },

    generateReport() {
      this.is_fetching = true;
      this.income_per_activity = [],
      this.expenditures_per_activity = [],
      this.total_income= 0.0;
      this.total_amount_given= 0.0;
      this.total_amount_spent= 0.0;
      this.total_balance= 0.0;
      this.net_balance= 0.0;
      let payload = {
        status: "none",
        url: `/api/protected/activity/${this.activity.value}/generate-report`,
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
            this.heading = `Financial Report for ${this.activity.label}`;
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
        })
        .finally(() => {
          this.is_fetching = false;
          this.show_menu = false;
        });
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
      this.loading_print = true;
      let url = ""
      if(this.group == 1){
        url = `/api/protected/activity/${this.activity.value}/report/download?payment_actvity=${this.activity.label}`
      }
      let file_name = "Activity_Report.pdf";
      this.loading_print = this.downloadPdf(url, file_name);
      return this.loading_print;
    }
  },
  components: {
    ReportsTable,
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
