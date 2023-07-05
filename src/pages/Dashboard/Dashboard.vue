<template>
  <q-page>
    <div class="row">
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 q-px-xs">
        <q-card class="card" bordered @click="showStatistics('MEMBERSHIP')">
          <q-card-section>
            <div class="text-h6 text-capitalize text-center">Members</div>
          </q-card-section>

          <q-card-actions align="around" class="q-pb-sm">
            <div>
              <q-avatar color="positive" icon="groups" size="xl" text-color="white">
              </q-avatar>
            </div>
            <div>
              <label for="total" class="total">{{ getTotalMembers }}</label>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 q-px-xs">
        <q-card class="card" bordered @click="showStatistics('SAVINGS')">
          <q-card-section>
            <div class="text-h6 text-capitalize text-center">Savings</div>
          </q-card-section>

          <q-card-actions align="around" class="q-pb-sm">
            <div>
              <q-avatar color="pink-11" icon="savings" size="xl" text-color="white"></q-avatar>
            </div>
            <div>
              <label for="total" class="total">{{
                Number(getTotalMembersSavings).toLocaleString()
              }}
                XAF</label>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 q-px-xs">
        <q-card class="card" bordered @click="showStatistics('CONTRIBUTIONS')">
          <q-card-section>
            <div class="text-h6 text-capitalize text-center">Contributions</div>
          </q-card-section>

          <q-card-actions align="around" class="q-pb-sm">
            <div>
              <q-avatar color="indigo-11" icon="payments" size="xl" text-color="white"></q-avatar>
            </div>
            <div>
              <label for="total" class="total">100 XAF</label>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 q-px-xs">
        <q-card class="card" bordered @click="showStatistics('EXPENDITURES')">
          <q-card-section>
            <div class="text-h6 text-capitalize text-center">Expenditures</div>
          </q-card-section>

          <q-card-actions align="around" class="q-pb-sm">
            <div>
              <q-avatar color="teal-2" icon="data_exploration" size="xl" text-color="white"></q-avatar>
            </div>
            <div>
              <label for="total" class="total">100 XAF</label>
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div>
      <!-----------------------------------------------MEMBERSHIP STATISTICS--------------------------------------->
      <div class="row q-mx-sm q-mt-sm" v-show="statistics_type == 'MEMBERSHIP'">
        <div class="col-4 col-md-4 col-sm-12 col-xs-12 col-lg-4">
          <PieChartsVue></PieChartsVue>
        </div>
        <div class="col-8 col-md-8 col-sm-12 col-xs-12 col-lg-8">
          <BarChartVue></BarChartVue>
        </div>
      </div>
      <!--------------------------------------------END OF MEMBERSHIP STATISTICS----------------------------------->

      <!-----------------------------------------------SAVINGS STATISTICS--------------------------------------->
      <div class="row q-mx-sm q-mt-sm" v-show="statistics_type == 'SAVINGS'">
        <div class="col-4 col-md-4 col-sm-12 col-xs-12 col-lg-4">
          <PieChartsVue></PieChartsVue>
        </div>
        <div class="col-8 col-md-8 col-sm-12 col-xs-12 col-lg-8">
          <BarChartCom :chartData="chartData"></BarChartCom>
        </div>
      </div>
      <!--------------------------------------------END OF SAVINGS STATISTICS----------------------------------->

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
import BarChartCom from "src/components/charts/BarChartCom.vue";

export default {
  mixins: [
    CurrentYearMixinVue,
    organisationMixin,
    memberMixinVue,
    UserSavingMixin,
  ],
  mounted() {
    let organisation_id = this.$store.getters.getOrganisation != null ? this.$store.getters.getOrganisation.id : null;

    this.getOrganisationMembers(organisation_id);
    this.getOrganisationMemberSavings(organisation_id);


    if (this.getOrganisationId == "") {
      this.getOrganisationInfo();
    }
    if (this.getCurrentYear == null) {
      this.fetchCurrentYear();
    }
  },
  data() {
    return {
      statistics_type: "MEMBERSHIP",
      visible: false,
      show_statistics: false,
      chartData: {
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
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
  },
  methods: {
    showStatistics(type) {
      this.visible = true
      this.show_statistics = false
      setTimeout(() => {
        this.visible = false
        this.show_statistics = true
      }, 3000)
      return (this.statistics_type = type);
    },
  },
  components: {
    PieChartsVue,
    BarChartVue,
    // LineChartVue,
    BarChartCom
  },
};
</script>
<style lang="scss" scoped>
.card {
  cursor: pointer;
}

.text-h6 {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 29px;
  text-align: center;
  color: $primary;
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
