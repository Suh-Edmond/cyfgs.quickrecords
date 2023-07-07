<template>
  <q-page>
    <div class="row">
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 q-px-xs">
        <q-card
          :class="statistics_type == 'MEMBERSHIP' ? 'members_card' : 'card'"
          bordered
          @click="showStatistics('MEMBERSHIP')"
        >
          <q-card-section>
            <div
              :class="
                statistics_type == 'MEMBERSHIP' ? 'text-h6-active' : 'text-h6'
              "
            >
              Members
            </div>
          </q-card-section>

          <q-card-actions align="around" class="q-pb-sm">
            <div>
              <q-avatar
                color="positive"
                icon="groups"
                size="xl"
                text-color="white"
              >
              </q-avatar>
            </div>
            <div>
              <label
                for="total"
                :class="
                  statistics_type == 'MEMBERSHIP' ? 'total-active' : 'total'
                "
                >{{ getTotalMembers }}</label
              >
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 q-px-xs">
        <q-card
          :class="statistics_type == 'SAVINGS' ? 'saving_card' : 'card'"
          bordered
          @click="showStatistics('SAVINGS')"
        >
          <q-card-section>
            <div
              :class="
                statistics_type == 'SAVINGS' ? 'text-h6-active' : 'text-h6'
              "
            >
              Savings
            </div>
          </q-card-section>

          <q-card-actions align="around" class="q-pb-sm">
            <div>
              <q-avatar
                color="pink-11"
                icon="savings"
                size="xl"
                text-color="white"
              ></q-avatar>
            </div>
            <div>
              <label
                for="total"
                :class="statistics_type == 'SAVINGS' ? 'total-active' : 'total'"
                >{{
                  Number(getTotalMembersSavings).toLocaleString()
                }}
                XAF</label
              >
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 q-px-xs">
        <q-card
          :class="
            statistics_type == 'CONTRIBUTIONS' ? 'contribution_card' : 'card'
          "
          bordered
          @click="showStatistics('CONTRIBUTIONS')"
        >
          <q-card-section>
            <div
              :class="
                statistics_type == 'CONTRIBUTIONS'
                  ? 'text-h6-active'
                  : 'text-h6'
              "
            >
              Contributions
            </div>
          </q-card-section>

          <q-card-actions align="around" class="q-pb-sm">
            <div>
              <q-avatar
                color="indigo-11"
                icon="payments"
                size="xl"
                text-color="white"
              ></q-avatar>
            </div>
            <div>
              <label
                for="total"
                :class="
                  statistics_type == 'CONTRIBUTIONS' ? 'total-active' : 'total'
                "
                >{{ Number(total_contributions).toLocaleString() }} XAF</label
              >
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 q-px-xs">
        <q-card
          :class="
            statistics_type == 'EXPENDITURES' ? 'expenditures_card' : 'card'
          "
          bordered
          @click="showStatistics('EXPENDITURES')"
        >
          <q-card-section>
            <div
              :class="
                statistics_type == 'EXPENDITURES' ? 'text-h6-active' : 'text-h6'
              "
            >
              Expenditures
            </div>
          </q-card-section>

          <q-card-actions align="around" class="q-pb-sm">
            <div>
              <q-avatar
                color="teal-2"
                icon="data_exploration"
                size="xl"
                text-color="white"
              ></q-avatar>
            </div>
            <div>
              <label
                for="total"
                :class="
                  statistics_type == 'EXPENDITURES' ? 'total-active' : 'total'
                "
                >100 XAF</label
              >
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div>
      <!-----------------------------------------------MEMBERSHIP STATISTICS--------------------------------------->
      <div class="row q-mx-sm q-mt-sm" v-if="statistics_type == 'MEMBERSHIP'">
        <div class="col-4 col-md-4 col-sm-12 col-xs-12 col-lg-4">
          <PieChartsVue :chart-data="getChartData"></PieChartsVue>
        </div>
        <div class="col-8 col-md-8 col-sm-12 col-xs-12 col-lg-8">
          <BarChartVue :chartData="getBarData"></BarChartVue>
        </div>
      </div>
      <!--------------------------------------------END OF MEMBERSHIP STATISTICS----------------------------------->

      <!-----------------------------------------------SAVINGS STATISTICS--------------------------------------->
      <div class="row" v-if="statistics_type == 'SAVINGS'">
        <div class="col-md-2 col-sm-12 col-xs-12 col-lg-2">
          <PieChartsVue :chart-data="pieChartData"></PieChartsVue>
        </div>
        <div class="col-5 col-md-5 col-sm-12 col-xs-12 col-lg-5">
          <LineChart :chartData="lineChartData1"></LineChart>
        </div>
        <div class="col-5 col-md-5 col-sm-12 col-xs-12 col-lg-5">
          <LineChart :chartData="lineChartData2"></LineChart>
        </div>
      </div>
      <!--------------------------------------------END OF SAVINGS STATISTICS----------------------------------->

      <!-----------------------------------------------CONTRIBUTIONS STATISTICS--------------------------------------->
      <div class="row" v-if="statistics_type == 'CONTRIBUTIONS'">
        <div class="col-6 col-md-6 col-sm-12 col-xs-12 col-lg-6">
          <LineChart :chartData="lineChartData1"></LineChart>
        </div>
        <div class="col-6 col-md-6 col-sm-12 col-xs-12 col-lg-6">
          <LineChart :chartData="lineChartData2"></LineChart>
        </div>
      </div>

      <div class="row" v-if="statistics_type == 'CONTRIBUTIONS'">
        <div class="col-4 col-md-4 col-sm-12 col-xs-12 col-lg-4">
          <BarChartVue :chartData="barChartData1"></BarChartVue>
        </div>
        <div class="col-8 col-md-8 col-sm-12 col-xs-12 col-lg-8">
          <BarChartVue :chartData="barChartData2"></BarChartVue>
        </div>
      </div>
      <!--------------------------------------------END OF CONTRIBUTIONS STATISTICS----------------------------------->

      <!-----------------------------------------------EXPENDITURES STATISTICS--------------------------------------->
      <div class="row" v-if="statistics_type == 'EXPENDITURES'">
        <div class="col-md-2 col-sm-12 col-xs-12 col-lg-2">
          <PieChartsVue :chart-data="pieChartData"></PieChartsVue>
        </div>
        <div class="col-5 col-md-5 col-sm-12 col-xs-12 col-lg-5">
          <LineChart :chartData="lineChartData1"></LineChart>
        </div>
        <div class="col-5 col-md-5 col-sm-12 col-xs-12 col-lg-5">
          <LineChart :chartData="lineChartData2"></LineChart>
        </div>
      </div>
      <!--------------------------------------------END OF EXPENDITURES STATISTICS----------------------------------->
    </div>
  </q-page>
</template>
<script>
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";
import organisationMixin from "src/mixins/organisationMixin.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import UserSavingMixin from "src/mixins/UserSavingMixin.vue";
import PieChartsVue from "src/components/charts/PieCharts.vue";
import BarChartVue from "src/components/charts/BarChart.vue";
import LineChart from "src/components/charts/LineChart.vue";
import ContributionsMixin from "src/mixins/ContributionsMixin.vue";

export default {
  mixins: [
    CurrentYearMixinVue,
    organisationMixin,
    memberMixinVue,
    UserSavingMixin,
    ContributionsMixin,
  ],
  mounted() {
    if (this.getOrganisationId == "") {
      this.getOrganisationInfo();
    }
    if (this.getCurrentYear == null) {
      this.fetchCurrentYear();
    }
    this.getSessions();
  },
  data() {
    return {
      statistics_type: "MEMBERSHIP",
      visible: false,
      show_statistics: false,
      lineChartData1: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "",
            backgroundColor: "",
            data: [],
          },
        ],
      },
      lineChartData2: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "",
            data: [],
          },
        ],
      },
      pieChartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: "",
            data: [],
          },
        ],
      },
      barChartData1: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "",
            data: [],
          },
        ],
      },
      barChartData2: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "",
            data: [],
          },
        ],
      },
      total_contributions: 0,
    };
  },
  computed: {
    getTotalMembers() {
      return this.getMembers.length;
    },
    getTotalMembersSavings() {
      return this.$store.getters.getOrganisationMembersSavings != null
        ? this.$store.getters.getOrganisationMembersSavings.total_savings
        : 0;
    },
    getChartData() {
      let data = {
        labels: ["Registered", "Pending", "Not-Registered"],
        datasets: [
          {
            backgroundColor: ["#27ae60", "#2d9cdb", "#f2994a"],
            data: this.$store.getters.getPieChartData,
          },
        ],
      };
      return data;
    },
    getBarData() {
      let data = {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Registered Members",
            backgroundColor: "#27ae60",
            data: this.$store.getters.getBarChartData,
          },
        ],
      };
      return data;
    },
  },
  methods: {
    showStatistics(type) {
      let organisation_id =
        this.$store.getters.getOrganisation != null
          ? this.$store.getters.getOrganisation.id
          : null;
      switch (type) {
        case "MEMBERSHIP":
          this.statistics_type = "MEMBERSHIP";
          let current_session_id = this.getCurrentYear.id;
          this.total_contributions =
            this.getTotalContributionByYear(current_session_id);
          this.getUserByRegistrationStatus(organisation_id);
          this.getUserByRegistration(organisation_id);
          this.getOrganisationMembers(organisation_id);
          this.getOrganisationMemberSavings(organisation_id);
          break;
        case "SAVINGS":
          this.statistics_type = "SAVINGS";
          this.getSavingsStatistics();
          break;
        case "CONTRIBUTIONS":
          this.statistics_type = "CONTRIBUTIONS";
          this.setContributionStatistics();
          break;
        case "EXPENDITURES":
          this.statistics_type = "EXPENDITURES";
          break;
      }
    },

    setSavingStatistics(monthly_savings, yearly_savings, status_stat) {
      this.resetData();
      this.lineChartData1.labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      this.lineChartData1.datasets[0].label = "Monthly Savings";
      this.lineChartData1.datasets[0].backgroundColor = "#ff80ab";
      this.lineChartData1.datasets[0].data = monthly_savings;

      this.lineChartData2.labels = [];
      this.lineChartData2.datasets[0].label = "Yearly Savings";
      this.lineChartData2.datasets[0].backgroundColor = "#ff80ab";
      this.lineChartData2.datasets[0].data = yearly_savings;
      this.$store.getters.getSessions.forEach((session) => {
        this.lineChartData2.labels.push(session.year);
      });

      this.pieChartData.labels = ["PENDING", "APPROVED", "DECLINED"];
      this.pieChartData.datasets[0].backgroundColor = [
        "#2d9cdb",
        "#27ae60",
        "#f2994a",
      ];
      this.pieChartData.datasets[0].data = status_stat;
    },

    getSavingsStatistics() {
      let session_id = this.getCurrentYear.id;
      let payload = {
        url: `/api/protected/savings/statistics?session_id=${session_id}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch member savings",
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
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.setSavingStatistics(
          res.data.monthly_stat,
          res.data.yearly_stat,
          res.data.status_stat
        );
      });
    },

    setContributionStatistics() {
      this.resetData();
      this.lineChartData1.labels = ["Operation 1000", "Rally", "Cometogether"];
      this.lineChartData1.datasets[0].label = "Number of Members";
      this.lineChartData1.datasets[0].backgroundColor = "#8c9eff";
      this.lineChartData1.datasets[0].data = [56, 78, 100];

      this.lineChartData2.labels = ["Operation 1000", "Rally", "Cometogether"];
      this.lineChartData2.datasets[0].label = "Total Amount Contributed";
      this.lineChartData2.datasets[0].backgroundColor = "#8c9eff";
      this.lineChartData2.datasets[0].data = [50000, 65000, 40000];

      this.barChartData1.labels = [
        "YEARLY",
        "QUARTERLY",
        "ONE_TIME",
        "MONTHLY",
      ];
      (this.barChartData1.datasets[0].label =
        "Percentage Contributions By Payment Frequency"),
        (this.barChartData1.datasets[0].backgroundColor = "#8c9eff");
      this.barChartData1.datasets[0].data = [];

      this.barChartData2.labels = [
        "ALL_MEMBERS",
        "A_MEMBER",
        "MEMBERS_WITH_ROLES",
        "MEMBERS_WITHOUT_ROLES",
        "GROUPED_MEMBERS",
      ];
      (this.barChartData2.datasets[0].label =
        "Percentage Contributions By Payment Type"),
        (this.barChartData2.datasets[0].backgroundColor = "#8c9eff");
      this.barChartData2.datasets[0].data = [];
    },

    resetData() {
      this.lineChartData1.labels = [];
      this.lineChartData1.datasets[0].label = "";
      this.lineChartData1.datasets[0].backgroundColor = "";
      this.lineChartData1.datasets[0].data = [];

      this.lineChartData2.labels = [];
      this.lineChartData2.datasets[0].label = "";
      this.lineChartData2.datasets[0].backgroundColor = "";
      this.lineChartData2.datasets[0].data = [];

      this.barChartData1.labels = [];
      this.barChartData1.datasets[0].backgroundColor = "";
      this.barChartData1.datasets[0].data = [];

      this.barChartData2.labels = [];
      (this.barChartData2.datasets[0].label = ""),
        (this.barChartData2.datasets[0].backgroundColor = "");
      this.barChartData2.datasets[0].data = [];
    },
  },
  components: {
    PieChartsVue,
    BarChartVue,
    LineChart,
  },
};
</script>
<style lang="scss" scoped>
.card {
  cursor: pointer;
}

.saving_card {
  background-color: #ff80ab;
  cursor: pointer;
  color: white;
}

.members_card {
  background-color: #27ae60;
  cursor: pointer;
  color: white;
}

.contribution_card {
  cursor: pointer;
  color: white;
  background-color: #8c9eff;
}

.expenditures_card {
  cursor: pointer;
  color: white;
  background-color: #b2dfdb;
}

.text-h6 {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 29px;
  text-align: center;
  color: $primary;
  text-transform: capitalize;
}

.text-h6-active {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 29px;
  text-align: center;
  color: $white1;
  text-transform: capitalize;
}

.heading {
  text-align: center;
}

.total {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  text-align: center;
  color: $primary;
}

.total-active {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  text-align: center;
  color: $white1;
}

.card_icon {
  color: $grey5;
}

.card_statistics {
  height: 57vh;
}

.card_statistics_header {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 29px;
  letter-spacing: 0.005em;
  color: #5384ae;
}

.card_statistics_info {
  background-color: $blue1;
  width: 3rem;
  height: 50vh;
}

.amount {
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.005em;
  color: #5384ae;
}

.chart_heading {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bolder;
  font-size: 17px;
  text-align: center;
  color: $grey8;
  text-decoration: underline;
}

.loading_label {
  color: $primary;
}
</style>
