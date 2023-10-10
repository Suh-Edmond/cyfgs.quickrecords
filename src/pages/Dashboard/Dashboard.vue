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
              {{ $t("app.memberLabel") }}
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
              {{ $t("app.savingtitle") }}
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
              {{ $t("app.contributionName") }}
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
                >{{
                  Number(getTotalYearlyContribution).toLocaleString()
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
              {{ $t("app.expenditureName") }}
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
                >{{
                  Number(getTotalYearlyExpenditure).toLocaleString()
                }}
                XAF</label
              >
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- <div> -->
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
      <div class="col-md-6 col-sm-12 col-xs-12 col-lg-6">
        <LineChart :chartData="lineChartData3"></LineChart>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12 col-lg-6">
        <LineChart :chartData="lineChartData4"></LineChart>
      </div>
    </div>

    <div class="row" v-if="statistics_type == 'CONTRIBUTIONS'">
      <div class="col-6 col-md-6 col-sm-12 col-xs-12 col-lg-6">
        <BarChartVue :chartData="barChartData1"></BarChartVue>
      </div>
      <div class="col-6 col-md-6 col-sm-12 col-xs-12 col-lg-6">
        <BarChartVue :chartData="barChartData2"></BarChartVue>
      </div>
    </div>
    <!--------------------------------------------END OF CONTRIBUTIONS STATISTICS----------------------------------->

    <!-----------------------------------------------EXPENDITURES STATISTICS--------------------------------------->
    <div class="row" v-if="statistics_type == 'EXPENDITURES'">
      <div class="col-6 col-md-6 col-sm-12 col-xs-12 col-lg-6">
        <LineChart :chartData="expenditureLineChartData1"></LineChart>
      </div>
      <div class="col-6 col-md-6 col-sm-12 col-xs-12 col-lg-6">
        <BarChartVue :chartData="expenditureBarChartData2"></BarChartVue>
      </div>
    </div>
    <!--------------------------------------------END OF EXPENDITURES STATISTICS----------------------------------->
    <!-- </div> -->
  </q-page>
</template>
<script>
import organisationMixin from "src/mixins/organisationMixin.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import UserSavingMixin from "src/mixins/UserSavingMixin.vue";
import PieChartsVue from "src/components/charts/PieCharts.vue";
import BarChartVue from "src/components/charts/BarChart.vue";
import LineChart from "src/components/charts/LineChart.vue";
import ContributionsMixin from "src/mixins/ContributionsMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import { LocalStorage } from "quasar";

export default {
  mixins: [
    organisationMixin,
    memberMixinVue,
    UserSavingMixin,
    ContributionsMixin,
    ExpenditureItemDetailMixinVue,
  ],
  mounted() {
    if (this.$store.getters.getOrganisation === null) {
      this.getOrganisationInfo();
    }
    const current_session =
      LocalStorage.getItem("data") !== undefined &&
      LocalStorage.getItem("data") !== null
        ? LocalStorage.getItem("data").current_session
        : {};
    this.$store.commit("SET_CURRENT_YEAR", current_session);
  },
  data() {
    return {
      loading: false,
      statistics_type: "MEMBERSHIP",
      visible: false,
      show_statistics: false,
      lineChartData1: {
        labels: [
          this.$t("app.januaryName"),
          this.$t("app.februaryName"),
          this.$t("app.marchName"),
          this.$t("app.aprilName"),
          this.$t("app.mayName"),
          this.$t("app.juneName"),
          this.$t("app.julyName"),
          this.$t("app.augustName"),
          this.$t("app.septemberName"),
          this.$t("app.octoberName"),
          this.$t("app.novemberName"),
          this.$t("app.decemberName"),
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
      lineChartData3: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "",
            data: [],
          },
        ],
      },
      lineChartData4: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "",
            data: [],
          },
        ],
      },
      total_expenditures: 0,
      expenditureLineChartData1: {
        labels: [
          this.$t("app.januaryName"),
          this.$t("app.februaryName"),
          this.$t("app.marchName"),
          this.$t("app.aprilName"),
          this.$t("app.mayName"),
          this.$t("app.juneName"),
          this.$t("app.julyName"),
          this.$t("app.augustName"),
          this.$t("app.septemberName"),
          this.$t("app.octoberName"),
          this.$t("app.novemberName"),
          this.$t("app.decemberName"),
        ],
        datasets: [
          {
            label: "",
            backgroundColor: "",
            data: [],
          },
        ],
      },
      expenditureBarChartData2: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "",
            data: [],
          },
        ],
      },
    };
  },
  computed: {
    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
    getTotalMembers() {
      return this.$store.getters.getMembers !== null
        ? this.$store.getters.getMembers.total
        : 0;
    },

    getTotalMembersSavings() {
      return this.$store.getters.getOrganisationMembersSavings !== null
        ? this.$store.getters.getOrganisationMembersSavings.total_savings
        : 0;
    },

    getChartData() {
      let data = {
        labels: [
          this.$t("app.registeredName"),
          this.$t("app.pendingName"),
          this.$t("app.declinedName"),
          this.$t("app.nonRegisteredName"),
        ],
        datasets: [
          {
            backgroundColor: ["#27ae60", "#2d9cdb", "#f2994a", "#fe1915"],
            data: this.$store.getters.getPieChartData,
          },
        ],
      };
      return data;
    },

    getApprovedUsers() {
      let approved_users = [];
      this.$store.getters.getBarChartData.forEach((ele) =>
        approved_users.push(ele[0])
      );
      return approved_users;
    },

    getPendingUsers() {
      let pending_users = [];
      this.$store.getters.getBarChartData.forEach((ele) =>
        pending_users.push(ele[1])
      );
      return pending_users;
    },

    getDeclineUsers() {
      let decline_users = [];
      this.$store.getters.getBarChartData.forEach((ele) =>
        decline_users.push(ele[2])
      );
      return decline_users;
    },

    getBarData() {
      let data = {
        labels: [
          this.$t("app.januaryName"),
          this.$t("app.februaryName"),
          this.$t("app.marchName"),
          this.$t("app.aprilName"),
          this.$t("app.mayName"),
          this.$t("app.juneName"),
          this.$t("app.julyName"),
          this.$t("app.augustName"),
          this.$t("app.septemberName"),
          this.$t("app.octoberName"),
          this.$t("app.novemberName"),
          this.$t("app.decemberName"),
        ],
        datasets: [
          {
            label: this.$t("app.registeredMembersMsg"),
            backgroundColor: "#27ae60",
            data: this.getApprovedUsers,
          },
          {
            label: this.$t("app.pendingMembersMsg"),
            backgroundColor: "#2d9cdb",
            data: this.getPendingUsers,
          },
          {
            label: this.$t("app.notDeclinedMembersMsg"),
            backgroundColor: "#f2994a",
            data: this.getDeclineUsers,
          },
        ],
      };
      return data;
    },

    getTotalYearlyContribution() {
      return this.$store.getters.getTotalYearlyContribution;
    },

    getTotalYearlyExpenditure() {
      return this.$store.getters.getTotalYearlyExpenditure;
    },
  },
  methods: {
    showStatistics(type) {
      let organisation_id =
        this.$store.getters.getOrganisation != null
          ? this.$store.getters.getOrganisation.id
          : null;
      let current_session_id =
        this.$store.getters.getCurrentYear != null ||
        this.$store.getters.getCurrentYear != undefined
          ? this.$store.getters.getCurrentYear.id
          : "";
      switch (type) {
        case "MEMBERSHIP":
          this.statistics_type = "MEMBERSHIP";
          this.getUserByRegistrationStatus(organisation_id);
          this.getUserByRegistration(organisation_id);
          this.getOrganisationMemberSavings(organisation_id, 1, 5);
          this.getTotalContributionByYear(current_session_id);
          this.getTotalYearlyExpenditures(current_session_id);
          break;
        case "SAVINGS":
          this.statistics_type = "SAVINGS";
          this.getSavingsStatistics();
          break;
        case "CONTRIBUTIONS":
          this.statistics_type = "CONTRIBUTIONS";
          this.getPercentageContributionsBySession(current_session_id);
          break;
        case "EXPENDITURES":
          this.statistics_type = "EXPENDITURES";
          this.getYearlyExpenditureStatistics(
            this.$store.getters.getCurrentYear.id
          );
          break;
      }
    },

    setSavingStatistics(monthly_savings, yearly_savings, status_stat) {
      this.lineChartData1.labels = [
        this.$t("app.januaryName"),
        this.$t("app.februaryName"),
        this.$t("app.marchName"),
        this.$t("app.aprilName"),
        this.$t("app.mayName"),
        this.$t("app.juneName"),
        this.$t("app.julyName"),
        this.$t("app.augustName"),
        this.$t("app.septemberName"),
        this.$t("app.octoberName"),
        this.$t("app.novemberName"),
        this.$t("app.decemberName"),
      ];
      this.lineChartData1.datasets[0].label = this.$t("app.monthlySavingsMsg");
      this.lineChartData1.datasets[0].backgroundColor = "#ff80ab";
      this.lineChartData1.datasets[0].data = monthly_savings;

      this.lineChartData2.labels = [];
      this.lineChartData2.datasets[0].data = [];
      this.lineChartData2.datasets[0].label = this.$t("app.yearlySavingMsg");
      this.lineChartData2.datasets[0].backgroundColor = "#ff80ab";
      yearly_savings.forEach((saving) => {
        this.lineChartData2.datasets[0].data.push(saving.amount);
        this.lineChartData2.labels.push(saving.year);
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
      let session_id = this.$store.getters.getCurrentYear.id;
      let payload = {
        url: `/api/protected/savings/statistics?session_id=${session_id}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
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

    setContributionStatistics(percentages) {
      if (percentages.length > 0) {
        this.lineChartData3.labels = percentages[0].percentages_data.map(
          (ele) => ele.name
        );
        this.lineChartData3.datasets[0].label = this.$t("app.numOfMembers");
        this.lineChartData3.datasets[0].backgroundColor = "#8c9eff";
        this.lineChartData3.datasets[0].data =
          percentages[0].percentages_data.map((ele) => ele.contributors);

        this.lineChartData4.labels = percentages[0].percentages_data.map(
          (ele) => ele.name
        );
        this.lineChartData4.datasets[0].label = this.$t(
          "app.amountContributedMsg"
        );
        this.lineChartData4.datasets[0].backgroundColor = "#8c9eff";
        this.lineChartData4.datasets[0].data =
          percentages[0].percentages_data.map((ele) => ele.percentage);

        this.barChartData1.labels = [
          "YEARLY",
          "QUARTERLY",
          "MONTHLY",
          "ONE_TIME",
        ];
        (this.barChartData1.datasets[0].label = this.$t(
          "app.avgContributionFrequencyMsg"
        )),
          (this.barChartData1.datasets[0].backgroundColor = "#8c9eff");
        this.barChartData1.datasets[0].data = percentages[1].avg_by_frequency;

        this.barChartData2.labels = [
          "ALL_MEMBERS",
          "A_MEMBER",
          "MEMBERS_WITH_ROLES",
          "MEMBERS_WITHOUT_ROLES",
          "GROUPED_MEMBERS",
        ];
        (this.barChartData2.datasets[0].label = this.$t(
          "app.avgContributionsByPaymentTypeMsg"
        )),
          (this.barChartData2.datasets[0].backgroundColor = "#8c9eff");
        this.barChartData2.datasets[0].data = percentages[2].avg_by_type;
      }
    },

    getPercentageContributionsBySession(session_id) {
      let payload = {
        status: "none",
        url: `/api/protected/contributions_statistics?session_id=${session_id}`,
        has_path_val: false,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.setContributionStatistics(res.data);
      });
    },

    setExpenditureStatistics(data) {
      this.expenditureLineChartData1.labels = [
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
      this.expenditureLineChartData1.datasets[0].label = this.$t(
        "app.monthlyExpenditureMsg"
      );
      this.expenditureLineChartData1.datasets[0].backgroundColor = "#b2dfdb";
      this.expenditureLineChartData1.datasets[0].data = data.monthly_expenses;

      this.expenditureBarChartData2.labels = data.expenses_by_items.map(
        (ele) => ele.name
      );
      this.expenditureBarChartData2.datasets[0].label = this.$t(
        "app.expenditureByPaymentType"
      );
      this.expenditureBarChartData2.datasets[0].backgroundColor = "#b2dfdb";
      this.expenditureBarChartData2.datasets[0].data =
        data.expenses_by_items.map((ele) => ele.amount);
    },

    getYearlyExpenditureStatistics(id) {
      let payload = {
        status: "none",
        url: `/api/protected/expenditure_statistics?session_id=${id}`,
        has_path_val: false,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "",
        has_commit: false,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.setExpenditureStatistics(res.data);
      });
    },

    getTotalYearlyExpenditures(id) {
      let payload = {
        url: `/api/protected/expenditures_total?session_id=${id}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch payment categories",
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        has_path_val: false,
        commit: "SET_TOTAL_YEARLY_EXPENDITURE",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
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
