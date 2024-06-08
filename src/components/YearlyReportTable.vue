<template>
  <div class="q-pa-sm report">
    <!---------START OF REPORT HEADER------------>
    <div class="header">
      <ReportHead></ReportHead>
    </div>
    <!---------END OF REPORT HEADER----------->

    <!----------START OF REPORT HEADING-------------------------------->
    <div class="q-pt-xl text-center text-bold">
      <div>
        <label for="title" class="heading">{{ heading }}</label>
      </div>
    </div>
    <!--------------END OF REPORT HEADER---------------------------->

    <!----------------------------------------------------------------------------------START OF INCOME----------------------------------------------------->
    <div class="row q-mt-md">
      <div class="col-1 col-md-1 col-sm-12 col-xs-12"></div>
      <div class="col-10 col-md-10 col-sm-12 col-xs-12">
        <div class="text-center q-pt-md">
          <label for="income" class="income_heading"
            >{{ $t("app.income") }} (XAF)</label
          >
        </div>

        <!---------------------------------------------------------------------START OF INCOME LIST---------------------------------------------------------->
        <div class="q-mt-md">
          <!----------------------------TABLE TITLE----------------------------->
          <div class="row table_header">
            <div class="col-1 col-md-1 columns text-bold">
              {{ $t("app.sn") }}
            </div>
            <div class="col-5 col-md-5 columns text-bold text-left">
              {{ $t("app.descriptionActivity") }}
            </div>
            <div class="col-2 col-md-2 columns text-bold">
              {{ $t("app.amount") }}
            </div>
            <div class="col-2 col-md-2 columns text-bold">
              {{ $t("app.subtotal") }}
            </div>
            <div class="col-2 col-md-2 columns text-bold">
              {{ $t("app.total") }}
            </div>
          </div>
          <!----------------------------END OF TABLE TITLE-------------------------->

          <!----------------------------START OF AMOUNT BROUGHT FORWARD------------->
          <div class="row">
            <div class="col-1 col-md-1 column_details text-bold">BBF</div>
            <div class="col-md-5 column_details text-bold text-left">
              {{ $t("app.balanceBrought") }}
            </div>
            <div class="col-md-2 column_details"></div>
            <div class="col-md-2 column_details"></div>
            <div class="col-md-2 column_details_end text-bold">
              {{ Number(getBalanceBF).toLocaleString() }}
            </div>
          </div>

          <!-----------------------------END OF AMOUNT BROUGHT FORWARD----------------->

          <!----------------------------------------------------------START OF CATEGORIES OF INCOME--------------------------------------------------->
          <div v-for="(income, index) in getQuarterlyIncome" :key="index">
            <div class="row">
              <div class="col-md-1 column_details text-bold">
                {{ income.code }}
              </div>
              <div class="col-md-5 column_details text-bold text-left">
                {{ income.name }}
              </div>
              <div class="col-md-2 column_details"></div>
              <div class="col-md-2 column_details"></div>
              <div
                class="col-md-2 column_details_end text-bold"
                v-if="income.items.length == 0"
              >
                {{ Number(income.total).toLocaleString() }}
              </div>
              <div
                class="col-md-2 column_details_end"
                v-if="income.items.length > 0"
              ></div>
            </div>

            <!-----------------------------------------START OF ACTIVITIES UNDER A CATEGORY--------------------------------->
            <div v-for="(value, index) in income.items" :key="index">
              <div class="row">
                <div class="col-md-1 column_details text-bold">
                  {{ income.code }}.{{ value.code }}
                </div>
                <div class="col-md-5 column_details text-bold text-left">
                  {{ value.name }}
                </div>
                <div class="col-md-2 column_details"></div>
                <div class="col-md-2 column_details"></div>
                <div class="col-md-2 column_details_end"></div>
              </div>

              <!------------------------------------------START OF ITEMS UNDER AN ACTICITY------------------------------------------->
              <div v-for="(item, index) in value.items" :key="index">
                <!-------------------------------------------START OF ITEMS WHOSE NAME AND AMOUNT ARE NOT NULL----------------------------------------->
                <div
                  class="row"
                  v-if="
                    item.name != getCurrentYear.year &&
                    item.id != null &&
                    item.year != null
                  "
                >
                  <div class="col-md-1 column_details text-bold">
                    {{ income.code }}.{{ value.code }}.{{ index + 1 }}
                  </div>
                  <div class="col-md-5 column_details">
                    {{ item.name }}
                  </div>
                  <div class="col-md-2 column_details">
                    {{ Number(item.amount).toLocaleString() }}
                  </div>
                  <div class="col-md-2 column_details"></div>
                  <div class="col-md-2 column_details_end"></div>
                </div>
                <!-------------------------------------------END OF ITEMS WHOSE NAME AND AMOUNT ARE NOT NULL----------------------------------------------->

                <!-------------------------------------------START OF ITEMS WHOSE NAME HAS BEEN SET TO CURRENT YEAR FOR IDENTIFICATION PURPOSE-------------->
                <div
                  class="row"
                  v-if="
                    item.name == getCurrentYear.year &&
                    item.id != null &&
                    item.year != null
                  "
                >
                  <div class="col-md-1 column_details text-bold">
                    {{ income.code }}.{{ value.code }}.{{ index + 1 }}
                  </div>
                  <div class="col-md-5 column_details">
                    {{ $t("app.memberContributionMsg") }}
                  </div>
                  <div class="col-md-2 column_details">
                    {{ Number(item.amount).toLocaleString() }}
                  </div>
                  <div class="col-md-2 column_details"></div>
                  <div class="col-md-2 column_details_end"></div>
                </div>
                <!-------------------------------------------END OF ITEMS WHOSE NAME HAS BEEN SET TO CURRENT YEAR FOR IDENTIFICATION PURPOSE-------------->

                <!-------------------------------------------START OF ITEMS WHOSE AMOUNT IS NULLL------------------------------------->
                <div
                  class="row"
                  v-if="
                    item.name == null && item.id == null && item.year == null
                  "
                >
                  <div class="col-md-1 column_details text-bold">
                    {{ income.code }}.{{ value.code }}.{{ index + 1 }}
                  </div>
                  <div class="col-md-5 column_details">
                    {{ $t("app.memberContributionMsg") }}
                  </div>
                  <div class="col-md-2 column_details">
                    {{ Number(item.amount).toLocaleString() }}
                  </div>
                  <div class="col-md-2 column_details"></div>
                  <div class="col-md-2 column_details_end"></div>
                </div>
                <!-------------------------------------------END OF ITEMS WHOSE AMOUNT IS NULL----------------------------------------->
              </div>
              <!-----------------------------------------------END OF ITEMS UNDER AN ACTIVITY--------------------------------------------->

              <!---------------------------------------------START OF ACTIVITY SUB-TOTAL------------------------------------------------->
              <div class="row">
                <div class="col-md-1 column_details text-bold">
                  {{ income.code }}.{{ value.code }}
                </div>
                <div class="col-md-5 column_details text-bold text-left"></div>
                <div class="col-md-2 column_details"></div>
                <div class="col-md-2 column_details text-bold">
                  {{ Number(value.total).toLocaleString() }}
                </div>
                <div class="col-md-2 column_details_end"></div>
              </div>
              <!--------------------------------------------END OF ACTIVITY SUB-TOTAL--------------------------------------------------->
            </div>
            <!----------------------------------------------END OF ACTIVITIES UNDER A CATEGORY------------------------------------------>
            <div class="row" v-if="income.items.length > 0">
              <div class="col-md-1 column_details text-bold">
                {{ income.code }}
              </div>
              <div class="col-md-5 column_details text-bold text-left">
                {{ $t("app.total") }}
              </div>
              <div class="col-md-2 column_details"></div>
              <div class="col-md-2 column_details text-bold">
                <!-- {{ Number(income.total).toLocaleString() }} -->
              </div>
              <div class="col-md-2 column_details_end text-bold">
                {{ Number(income.total).toLocaleString() }}
              </div>
            </div>
          </div>
          <!------------------------------------------------END OF CATEGORIES OF INCOME-------------------------------------------------->

          <!-------------------------------------------------------START OF INCOME TALLY----------------------------------------------------->
          <div class="row">
            <div class="col-md-1 column_details"></div>
            <div
              class="col-md-5 column_details text-bold text-left text-uppercase"
            >
              {{ $t("app.totalIncome") }}
            </div>
            <div class="col-md-2 column_details"></div>
            <div class="col-md-2 column_details text-bold">
              <!-- {{ Number(getTotalIncome).toLocaleString() }} -->
            </div>
            <div class="col-md-2 column_details_end text-bold">
              {{ Number(getTotalIncome).toLocaleString() }}
            </div>
          </div>
          <!------------------------------------------------------END OF INCOME TALLY------------------------------------------------------------------>
        </div>

        <!---------------------------------------------------------------------END OF INCOME LIST------------------------------------------------------------>
      </div>
      <div class="col-1 col-md-1 col-sm-12 col-xs-"></div>
    </div>
    <!---------------------------------------------------------------------------------END OF INCOME-------------------------------------------------------->

    <!----------------------------------------------------------------------------------START OF EXPENDITURES----------------------------------------------------->
    <div class="row q-mt-xl">
      <div class="col-1 col-md-1 col-sm-12 col-xs-12"></div>
      <div class="col-10 col-md-10 col-sm-12 col-xs-12">
        <div class="text-center">
          <label for="income" class="income_heading">
            {{ $t("app.expenditures") }} (XAF)</label
          >
        </div>

        <!---------------------------------------------------------------------START OF EXPENDITURES LIST---------------------------------------------------------->
        <div class="q-mt-md">
          <!----------------------------TABLE TITLE----------------------------->
          <div class="row table_header">
            <div class="col-1 col-md-1 columns text-bold">
              {{ $t("app.sn") }}
            </div>
            <div class="col-5 col-md-5 columns text-bold text-left">
              {{ $t("app.descriptionActivity") }}
            </div>
            <div class="col-2 col-md-2 columns text-bold">
              {{ $t("app.amount") }}
            </div>
            <div class="col-2 col-md-2 columns text-bold">
              {{ $t("app.subtotal") }}
            </div>
            <div class="col-2 col-md-2 columns text-bold">
              {{ $t("app.total") }}
            </div>
          </div>
          <!----------------------------END OF TABLE TITLE-------------------------->

          <!----------------------------------------------------------START OF CATEGORIES OF EXPENDITURES--------------------------------------------------->
          <div
            v-for="(expenditures, index) in getQuarterlyExpenditure"
            :key="index"
          >
            <div class="row">
              <div class="col-md-1 column_details text-bold">
                {{ expenditures.code }}
              </div>
              <div
                class="col-md-5 column_details"
                style="font-weight: bold; text-align: left"
              >
                {{ expenditures.name }}
              </div>
              <div class="col-md-2 column_details"></div>
              <div class="col-md-2 column_details"></div>
              <div class="col-md-2 column_details_end"></div>
            </div>

            <!-----------------------------------------START OF ACTIVITIES UNDER A CATEGORY--------------------------------->
            <div v-for="(value, index) in expenditures.items" :key="index">
              <div v-if="value.items.length > 0">
                <div class="row">
                  <div class="col-md-1 column_details text-bold">
                    {{ expenditures.code }}.{{ value.code }}
                  </div>
                  <div
                    class="col-md-5 column_details"
                    style="font-weight: bold; text-align: left"
                  >
                    {{ value.name }}
                  </div>
                  <div class="col-md-2 column_details"></div>
                  <div class="col-md-2 column_details"></div>
                  <div class="col-md-2 column_details_end"></div>
                </div>

                <!------------------------------------------START OF ITEMS UNDER AN ACTICITY------------------------------------------->
                <div v-for="(item, index) in value.items" :key="index">
                  <div class="row">
                    <div class="col-md-1 column_details text-bold">
                      {{ expenditures.code }}.{{ value.code }}.{{ index + 1 }}
                    </div>
                    <div class="col-md-5 column_details">
                      {{ item.name }}
                    </div>
                    <div class="col-md-2 column_details">
                      {{ Number(item.amount_spent).toLocaleString() }}
                    </div>
                    <div class="col-md-2 column_details"></div>
                    <div class="col-md-2 column_details_end"></div>
                  </div>
                </div>
                <!-----------------------------------------------END OF ITEMS UNDER AN ACTIVITY--------------------------------------------->

                <!---------------------------------------------START OF ACTIVITY SUB-TOTAL------------------------------------------------->
                <div class="row">
                  <div class="col-md-1 column_details text-bold">
                    {{ expenditures.code }}.{{ value.code }}
                  </div>
                  <div
                    class="col-md-5 column_details text-left text-bold"
                  ></div>
                  <div class="col-md-2 column_details"></div>
                  <div class="col-md-2 column_details text-bold">
                    {{ Number(value.total).toLocaleString() }}
                  </div>
                  <div class="col-md-2 column_details_end"></div>
                </div>
                <!--------------------------------------------END OF ACTIVITY SUB-TOTAL--------------------------------------------------->
              </div>
            </div>
            <!----------------------------------------------END OF ACTIVITIES UNDER A CATEGORY------------------------------------------>
            <div class="row" v-if="expenditures.items.length > 0">
              <div class="col-md-1 column_details text-bold">
                {{ expenditures.code }}
              </div>
              <div class="col-md-5 column_details text-bold text-left">
                {{ $t("app.total") }}
              </div>
              <div class="col-md-2 column_details"></div>
              <div class="col-md-2 column_details text-bold"></div>
              <div class="col-md-2 column_details_end text-bold">
                {{ Number(expenditures.total).toLocaleString() }}
              </div>
            </div>
          </div>
          <!------------------------------------------------END OF CATEGORIES OF EXPENDITURES-------------------------------------------------->

          <!-------------------------------------------------------START OF EXPENDITURES TALLY----------------------------------------------------->
          <div class="row">
            <div class="col-md-1 column_details"></div>
            <div
              class="col-md-5 column_details text-left text-bold text-uppercase"
            >
              {{ $t("app.totalExpenditure") }}
            </div>
            <div class="col-md-2 column_details"></div>
            <div class="col-md-2 column_details text-bold"></div>
            <div class="col-md-2 column_details_end text-bold">
              {{ Number(getTotalExpenditure).toLocaleString() }}
            </div>
          </div>
          <!------------------------------------------------------END OF EXPENDITURES TALLY------------------------------------------------------------------>
        </div>

        <!---------------------------------------------------------------------END OF EXPENDITURES LIST------------------------------------------------------------>
      </div>
      <div class="col-1 col-md-1 col-sm-12 col-xs-"></div>
    </div>
    <!---------------------------------------------------------------------------------END OF EXPENDITURES------------------------------------------------------>

    <!-----------------------------------------------------------------------------SUMMARY OF REPORT------------------------------------------------------------>
    <div class="row q-mt-lg">
      <div class="col-md-1 col-sm-1 col-xs-1"></div>
      <div class="col-md-10 col-xs-12 col-sm-12">
        <div class="q-my-md text-center">
          <label for="income" class="summary"
            >{{ $t("app.summary") }} (XAF)</label
          >
        </div>
        <div class="row table_header">
          <div class="col-1 col-md-1 columns text-bold text-left">
            {{ $t("app.sn") }}
          </div>
          <div class="col-7 col-md-7 columns text-bold text-left">
            {{ $t("app.description") }}
          </div>
          <div class="col-4 col-md-4 columns text-bold text-left">
            {{ $t("app.total") }}
          </div>
        </div>
        <div class="row summary_row_first">
          <div class="col-md-1 summary_column_details text-bold">S1</div>
          <div
            class="col-md-7 summary_column_details text-bold text-left text-uppercase"
          >
            {{ $t("app.totalIncome") }}
          </div>
          <div class="col-md-4 summary_column_details text-bold">
            {{ Number(getTotalIncome).toLocaleString() }}
          </div>
        </div>
        <div class="row summary_row">
          <div class="col-md-1 summary_column_details text-bold">S3</div>
          <div
            class="col-md-7 summary_column_details text-bold text-left text-uppercase"
          >
            {{ $t("app.totalExpenditure") }}
          </div>
          <div class="col-md-4 summary_column_details text-bold">
            {{ Number(getTotalExpenditure).toLocaleString() }}
          </div>
        </div>
        <div class="row summary_row">
          <div class="col-md-1 summary_column_details text-bold">S3</div>
          <div
            class="col-md-7 summary_column_details text-bold text-left text-uppercase"
          >
            {{ $t("app.totalBalance") }}
          </div>
          <div class="col-md-4 summary_column_details text-bold">
            {{ Number(getTotalBalance).toLocaleString() }}
          </div>
        </div>
      </div>
      <div class="col-md-1 col-sm-1 col-xs-1"></div>
    </div>
    <!-----------------------------------------------------------------------------SUMMARY OF SUMMARY OF REPORT------------------------------------------------->

    <!-----------------------------------------------------------------------------DETAILS REPORT PRESENTERS------------------------------------------------------------>
    <div class="row q-mt-lg">
      <div class="col-md-1 col-sm-1 col-xs-1"></div>
      <div class="col-md-10 col-xs-12 col-sm-12">
        <div class="q-my-lg text-center">
          <label for="income" class="summary text-uppercase">{{
            $t("app.presentedBy")
          }}</label>
        </div>
        <div class="flex justify-between">
          <div
            class="col-md-6 text-bold text-center text-uppercase admin_details"
          >
            <div>
              <label for="name" class="admin_title"
                >{{ $t("app.finSec") }} </label
              ><br />
              <span
                class="admin_name"
                v-for="fin_sec in getFinancialSecretary"
                :key="fin_sec.index"
                >{{ fin_sec.name }}<br
              /></span>
            </div>
            <br />
            <div>
              <label for="name" class="sign">{{ $t("app.sign") }} </label>
              <hr class="q-mt-lg" />
            </div>
          </div>
          <div
            class="col-md-6 text-bold text-center text-uppercase admin_details"
          >
            <div>
              <label for="name" class="admin_title">{{
                $t("app.treasurer")
              }}</label
              ><br />
              <span
                class="admin_name"
                v-for="treasurer in getTreasurer"
                :key="treasurer.index"
              >
                {{ treasurer.name }}<br
              /></span>
            </div>
            <br />
            <div>
              <label for="name" class="sign">{{ $t("app.sign") }} </label>
              <hr class="q-mt-lg" />
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <div
            class="col-md-12 text-bold text-center text-uppercase admin_details"
          >
            <div>
              <label for="name" class="admin_title">{{
                $t("app.president")
              }}</label
              ><br />
              <span
                class="admin_name"
                v-for="president in getPresident"
                :key="president.index"
              >
                {{ president.name }}<br />
              </span>
            </div>
            <br />
            <div>
              <label for="name" class="sign">{{ $t("app.sign") }} </label>
              <hr class="q-mt-lg" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-1 col-sm-1 col-xs-1"></div>
    </div>
    <!--------------------------------------------------------------------------END OF DETAILS OF PRESENTERS------------------------------------------------->
  </div>
</template>
<script>
import ReportHead from "./ReportHead.vue";
import { LocalStorage } from "quasar";
export default {
  mixins: [],
  props: {
    heading: {
      type: String,
      required: true,
    },
  },
  mounted() {},
  data() {
    return {
      loading: false,
      color: "positive",
      no_caps: true,
      filter: "",
      data: [],
      title: "",
    };
  },
  computed: {
    getQuarterlyIncome() {
      return this.$store.getters.getReportData[0];
    },
    getQuarterlyExpenditure() {
      return this.$store.getters.getReportData[1];
    },

    getTotalIncome() {
      return this.$store.getters.getReportData[2].total_income;
    },

    getTotalExpenditure() {
      return this.$store.getters.getReportData[3].total_expenditure;
    },

    getBalanceBF() {
      return this.$store.getters.getReportData[4].bal_brought_forward;
    },

    getTotalBalance() {
      return this.getTotalIncome - this.getTotalExpenditure;
    },

    getPresident() {
      return this.$store.getters.getReportData[5].president;
    },

    getTreasurer() {
      return this.$store.getters.getReportData[6].treasurer;
    },

    getFinancialSecretary() {
      return this.$store.getters.getReportData[7].fin_sec;
    },
    getCurrentYear() {
      return LocalStorage.getItem("data").current_session;
    },
  },
  methods: {},
  components: {
    ReportHead,
  },
};
</script>
<style lang="scss" scoped>
.report {
  margin-top: 20px;
  margin-bottom: 5px;
  border: 0.01rem dashed $grey5;
  border-radius: 15px;
  border-style: dashed;
}
.heading {
  font-family: "Roboto";
  font-style: normal;
  font-weight: bold;
  font-size: 0.9rem;
  color: $dark;
  border-bottom: 0.01rem solid #000;
}

.income_heading {
  font-family: "Roboto";
  font-style: normal;
  font-weight: bold;
  font-size: 0.7rem;
  color: $dark;
  border-bottom: 0.01rem solid black;
}

.table_header {
  background-color: $primary;
  color: $white1;
  font-size: 0.8rem;
}

.columns {
  padding: 5px;
  border-top: 0.01rem solid black;
  border-bottom: 0.01rem solid black;
  border-left: 0.01rem solid black;
  border-right: 0.01rem solid black;
  border-color: $white1;
  font-size: 0.7rem;
}

.column_details_end {
  padding: 5px;
  border-bottom: 0.01rem solid black;
  border-left: 0.01rem solid black;
  border-color: $dark;
  border-right: 0.01rem solid black;
  font-size: 0.7rem;
}

.column_details {
  padding: 5px;
  border-bottom: 0.01rem solid black;
  border-left: 0.01rem solid black;
  border-color: $dark;
  font-size: 0.7rem;
}

.summary {
  font-family: "Roboto";
  font-style: normal;
  font-weight: bold;
  font-size: 0.7rem;
  color: $dark;
  border-bottom: 0.01rem solid #000;
}

.summary_row {
  font-size: 0.7rem;
  border-bottom: 0.01rem solid black;
  border-left: 0.01rem solid #000;
  border-right: 0.01rem solid #000;
}
.summary_row_first {
  font-size: 0.7rem;
  border-top: 0.01rem solid black;
  border-bottom: 0.01rem solid black;
  border-left: 0.01rem solid #000;
  border-right: 0.01rem solid #000;
}
.summary_column_details {
  font-size: 0.7rem;
  border-left: 0.01rem solid #000;
  border-right: 0.01rem solid #000;
  padding: 4px;
}

.admin_name {
  font-size: 0.7rem;
  min-width: 25%;
}
.admin_details {
  min-width: 25%;
}

.admin_title {
  font-size: 0.7rem;
  text-decoration: underline;
}

.sign {
  font-size: 0.7rem;
}
</style>
