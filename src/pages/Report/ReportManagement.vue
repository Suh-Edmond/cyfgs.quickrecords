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
            :label="$t('app.selectOptionGenerateReport')"
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
            @input="stopSearch"
          >
          <template v-slot:append v-if="start_filtering">
              <q-spinner color="primary" size="1.2em" :thickness="3" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> {{$t('app.noResults')}} </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div
          class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-pr-md' : ''"
        >
          <q-btn
            :label="$t('app.generateReport')"
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
            :label="$t('app.print')"
            :loading="loading"
            color="positive"
            :disabled="false"
            no-caps
            icon-right="print"
            @click="downloadReport()"
          ></q-btn>
        </div>
      </div>
      <!-- table for report by activity -->
      <div class="row q-pt-sm" v-if="show_activity_report">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <ActivityReportTable :heading="heading" :activity_report_data="activity_report_data">
          </ActivityReportTable>
        </div>
      </div>

      <!-- quarterly report table -->
      <div class="row q-pt-sm" v-if="show_quarterly_report">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <QuarterlyReportTable :heading="heading"> </QuarterlyReportTable>
        </div>
      </div>

      <!---------yearly reports table-->
      <div class="row q-pt-sm" v-if="show_yearly_report">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <YearlyReportTable :heading="heading"> </YearlyReportTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActivityReportTable from "src/components/ActivityReportTable.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";
import QuarterlyReportTable from "src/components/QuarterlyReportTable.vue";
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";
import YearlyReportTable from "src/components/YearlyReportTable.vue";

export default {
  mixins: [HelperMixin, CurrentYearMixinVue],
  mounted() {},

  data() {
    return {
      show_quarterly_report: false,
      show_activity_report: false,
      show_yearly_report:false,
      loading: false,
      group: null,
      options: [
        { label: this.$t('app.reportByPaymentItem'), value: 1 },
        { label: this.$t('app.reportByQuarter'), value: 2 },
        { label: this.$t('app.reportByYear'), value: 3 },
      ],
      label: this.$t('app.generateReport'),
      year: null,
      heading: null,
      is_fetching: false,
      option: null,
      selected_option_label: null,
      report_options: [],
      quarters: [
        { label: this.$t('app.firstQuarter'), value: "1" },
        { label: this.$t('app.secondQuarter'), value: "2" },
        { label: this.$t('app.thirdQuarter'), value: "3" },
        { label: this.$t('app.fourthQuarter'), value: "4" },
      ],
      incomes:[],
      activity_report_data:[],
      start_filtering:false,
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
            this.selected_option_label = this.$t('app.searchPaymentItem');
            break;
          case 2:
            this.selected_option_label = this.$t('app.selectQuarter');
            break;
          case 3:
            this.getSessionsFromState;
            this.selected_option_label = this.$t('app.selectYearLabel');
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
          this.show_quarterly_report = false
          this.show_yearly_report = false;
          this.generateActivityReport();
        break;
        case 2:
          this.show_activity_report = false;
          this.show_yearly_report = false;
          this.generateQuarterlyReport();
        break
        case 3:
          this.show_activity_report = false;
          this.show_quarterly_report = false;
          this.generatYearlyReport();
        break;
      }
    },

    generateActivityReport() {
      this.is_fetching = true;
       this.heading = this.$t('app.reportTitle')+`${this.group.label} ${this.getCurrentYear.year}`;
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
          this.activity_report_data = res.data
          this.show_activity_report = true;
        })
        .finally(() => {
          this.is_fetching = false;
        });
    },

    generateQuarterlyReport() {
      this.is_fetching = true;
      this.heading = this.$t('app.quarterReportTitle') +`${this.group.label} ${this.getCurrentYear.year}`;
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

    generatYearlyReport() {
      this.is_fetching = true;
      this.heading = this.$t('app.yearReportTitle') + `${this.getCurrentYear.year}`;
      let payload = {
        status: "none",
        url: `/api/protected/report/yearly/generate?year_id=${this.group.value}&year_label=${this.group.label}`,
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
          this.show_yearly_report = true;
        })
        .finally(() => {
          this.is_fetching = false;
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

    getQuarterlyIncome(data){
      this.data = [];
      return this.data = data;
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

    validateDownloadBtn(data) {
      return data.length < 0 ? true : false;
    },

    downloadReport() {
      let id = this.group != null ? this.group.value : "";
      let label = this.group != null ? this.group.label : "";
      this.loading = true;
      let url = "";
      let file_name = ""
       if (this.option.value == 1) {
        url = `/api/protected/activity/${id}/report/download?payment_actvity=${label}`;
        file_name = "Activity_Report.pdf";
      }
      else if(this.option.value == 2){
        url = `/api/protected/report/quarter/download?quarter=${this.group.value}`;
        file_name = "Quarterly_Report.pdf";
      }else {
        url = `/api/protected/report/yearly/download?year_id=${this.group.value}&year_label=${this.group.label}`
        file_name = "Yearly_Report.pdf";
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
        this.start_filtering = false;
        return;
      }
      update(() => {
        this.start_filtering = true;
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
        this.start_filtering = false;
        return;
      }

      update(() => {
        this.start_filtering = true;
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
        this.start_filtering = false;
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.report_options = this.getSessionsFromState.filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.report_options;
      });
    },

    stopSearch(){
      if(this.group != null) {
        this.start_filtering = false
      }
    }
  },
  components: {
    ActivityReportTable,
    QuarterlyReportTable,
    YearlyReportTable
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
