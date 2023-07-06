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
                >100 XAF</label
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
          <BarChartVue></BarChartVue>
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

export default {
  mixins: [
    CurrentYearMixinVue,
    organisationMixin,
    memberMixinVue,
    UserSavingMixin,
  ],
  mounted() {
    let organisation_id =
      this.$store.getters.getOrganisation != null
        ? this.$store.getters.getOrganisation.id
        : null;

    this.getOrganisationMembers(organisation_id);
    this.getOrganisationMemberSavings(organisation_id);

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
          this.getUserByRegistrationStatus(organisation_id);
          this.getUserByRegistration(organisation_id);
          break;
        case "SAVINGS":
          this.statistics_type = "SAVINGS";
          this.getSavingsStatistics();
          break;
        case "CONTRIBUTIONS":
          this.statistics_type = "CONTRIBUTIONS";
          break;
        case "EXPENDITURES":
          this.statistics_type = "EXPENDITURES";
          break;
      }
    },

    setSavingStatistics(monthly_savings, yearly_savings, status_stat) {
      this.statistics_type = "SAVINGS";

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
  background-color:  #b2dfdb;
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
