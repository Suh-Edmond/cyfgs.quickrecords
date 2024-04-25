<template>
  <div class="q-px-sm">
    <div
      class="row flex justify-between q-pa-sm q-mb-md"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_hint"
    >
      <div class="hint_text_color q-pt-sm">
        {{ $t("app.generateReportHint") }}
      </div>
      <div>
        <q-btn flat round class="close_color" icon="close" @click="closeHint" />
      </div>
    </div>
    <!-- report details available -->
    <div>
      <!-- header for filter sponsors -->
      <FilterComponentVue
        :show_report="true"
        :loading_download="loading_download"
        :disable_download_btn="validateDownloadBtn"
        @generate-report="generateReport"
        @download-report="downloadReport"
      >
      </FilterComponentVue>

      <div class="flex flex-center q-mt-lg" v-if="getLoadingState">
        <q-spinner color="primary" size="3em" />
      </div>
      <!-- table for report by activity -->
      <div class="row q-pt-sm" v-if="show_activity_report">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <ActivityReportTable
            :heading="heading"
            :activity_report_data="activity_report_data"
          >
          </ActivityReportTable>
        </div>
      </div>

      <!-- quarterly report table -->
      <div class="row q-pt-sm" v-if="show_quarterly_report && !getLoadingState">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <QuarterlyReportTable :heading="heading"> </QuarterlyReportTable>
        </div>
      </div>

      <!---------yearly reports table-->
      <div class="row q-pt-sm" v-if="show_yearly_report && !getLoadingState">
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
import FilterComponentVue from "src/components/FilterComponent.vue";
import { LocalStorage } from "quasar";

export default {
  mixins: [HelperMixin, CurrentYearMixinVue],
  mounted() {
    if(this.$store.getters.getCurrentYear == null || this.$store.getters.getCurrentYear == undefined){
        this.fetchCurrentYear()
    }
  },

  data() {
    return {
      show_quarterly_report: false,
      show_activity_report: false,
      show_yearly_report: false,
      loading_download: false,
      group: null,
      options: [],
      label: this.$t("app.generateReport"),
      year: this.$store.getters.getCurrentYear.year,
      heading: null,
      is_fetching: false,
      option: null,
      selected_option_label: null,
      report_options: [],
      incomes: [],
      activity_report_data: [],
      organisation_id: this.$store.getters.getOrganisation.id,
      session_id: this.$store.getters.getCurrentYear,
      show_hint: true,
    };
  },
  computed: {
    validateDownloadBtn(data) {
      return data.length < 0 ? true : false;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },

  methods: {
    closeHint() {
      return (this.show_hint = false);
    },

    generateReport(data) {
      switch (data.report_option.value) {
        case 1:
          this.show_quarterly_report = false;
          this.show_yearly_report = false;
          this.generateActivityReport(data);
          break;
        case 2:
          this.show_activity_report = false;
          this.show_yearly_report = false;
          this.generateQuarterlyReport(data);
          break;
        case 3:
          this.show_activity_report = false;
          this.show_quarterly_report = false;
          this.generatYearlyReport(data);
          break;
      }
    },

    generateActivityReport(data) {
      this.heading =
        this.$t("app.reportTitle") + `${data.group.label}`;
      let payload = {
        status: "none",
        url: `/api/protected/activity/${data.group.value}/generate-report?organisation_id=${this.organisation_id}`,
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
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          this.activity_report_data = res.data;
          this.show_activity_report = true;
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
        });
    },

    generateQuarterlyReport(data) {
      this.heading =
        this.$t("app.quarterReportTitle") + `${data.group.label} ${this.year}`;
      let payload = {
        status: "none",
        url: `/api/protected/generate-quarterly-report?quarter=${data.group.value}&organisation_id=${this.organisation_id}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
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
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store
        .dispatch("getRequest", payload)
        .then(() => {
          this.show_quarterly_report = true;
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
        });
      return this.data;
    },

    generatYearlyReport(data) {
      this.heading = this.$t("app.yearReportTitle") + `${this.year}`;
      let payload = {
        status: "none",
        url: `/api/protected/report/yearly/generate?year_id=${data.group.value}&year_label=${data.group.label}&organisation_id=${this.organisation_id}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
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
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store
        .dispatch("getRequest", payload)
        .then(() => {
          this.show_yearly_report = true;
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
        });
    },

    downloadReport(data) {
      let id = data.group != null && data.group != "" ? data.group.value : "";
      let label =
        data.group != null && data.group != "" ? data.group.label : "";
      this.loading = true;
      let url = "";
      let file_name = "";
      if (data.report_option.value == 1) {
        url = `/api/protected/activity/${id}/report/download?payment_activity=${label}&year=${this.year}`;
        file_name = "Activity_Report.pdf";
      } else if (data.report_option.value == 2) {
        url = `/api/protected/report/quarter/download?quarter=${data.group.value}&year=${this.year}&organisation_id=${this.organisation_id}`;
        file_name = "Quarterly_Report.pdf";
      } else {
        url = `/api/protected/report/yearly/download?year_id=${data.group.value}&year_label=${data.group.label}&year=${this.year}&organisation_id=${this.organisation_id}`;
        file_name = "Yearly_Report.pdf";
      }
      this.loading_download = this.downloadPdf(url, file_name);
      return this.loading_download;
    },
  },
  components: {
    ActivityReportTable,
    QuarterlyReportTable,
    YearlyReportTable,
    FilterComponentVue,
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

.hint_text_color {
  color: $grey8;
}

.close_color {
  color: $grey8;
}
</style>
