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
        <label class="heading">{{ heading }}</label>
      </div>
    </div>
    <!--------------END OF REPORT HEADER---------------------------->

    <!----------------------------------------------------------------------------------START OF INCOME----------------------------------------------------->
    <div class="row q-mt-md">
      <div class="col-1 col-md-1 col-sm-12 col-xs-12"></div>
      <div class="col-10 col-md-10 col-sm-12 col-xs-12">
        <div class="text-center q-pt-md">
          <label class="income_heading"
            >{{ $t("app.income") }} (XAF)</label
          >
        </div>
        <div class="q-mt-md">
          <!-------------------------------------------------------------------TABLE TITLE------------------------------------------------------------------>
          <div class="row table_header">
            <div class="col-1 col-md-1 columns text-bold">
              {{ $t("app.sn") }}
            </div>
            <div class="col-6 col-md-6 columns text-bold text-center">
              {{ $t("app.description") }}
            </div>
            <div class="col-5 col-md-5 column_details_end text-bold">
              {{ $t("app.amount") }}
            </div>
          </div>
          <!---------------------------------------------------------------------END OF TABLE TITLE--------------------------------------------------------------------------->

          <!-----------------------------------------------------------START OF INCOME LIST------------------------------------------------->
          <div class="row" v-for="(income, index) in getIncomes" :key="index">
            <div class="col-1 col-md-1 column_details text-bold">
              I.{{ index + 1 }}
            </div>
            <div class="col-md-6 column_details text-medium text-left">
              {{ income.name }}
            </div>
            <div class="col-md-5 column_details_end">
              {{ Number(income.amount).toLocaleString() }}
            </div>
          </div>
          <!-----------------------------------------------------------END OF INCOME LIST--------------------------------------------------->

          <!-------------------------------------------------------START OF INCOME TALLY----------------------------------------------------->
          <div class="row">
            <div class="col-md-1 column_details"></div>
            <div
              class="col-md-6 column_details text-bold text-left text-uppercase"
            >
              {{ $t("app.totalIncome") }}
            </div>
            <div class="col-md-5 column_details_end text-bold">
              {{ Number(getTotalIncome).toLocaleString() }}
            </div>
          </div>
          <!------------------------------------------------------END OF INCOME TALLY------------------------------------------------------------------>
        </div>
      </div>
      <div class="col-1 col-md-1 col-sm-12 col-xs-"></div>
    </div>
    <!---------------------------------------------------------------------------------END OF INCOME-------------------------------------------------------->

    <!----------------------------------------------------------------------------------START OF EXPENDITURE----------------------------------------------------->
    <div class="row q-mt-md">
      <div class="col-1 col-md-1 col-sm-12 col-xs-12"></div>
      <div class="col-10 col-md-10 col-sm-12 col-xs-12">
        <div class="text-center q-pt-md">
          <label class="income_heading"
            >{{ $t("app.expenditures") }} (XAF)</label
          >
        </div>
        <div class="q-mt-md">
          <!-------------------------------------------------------------------TABLE TITLE------------------------------------------------------------------>
          <div class="row table_header">
            <div class="col-1 col-md-1 columns text-bold">
              {{ $t("app.sn") }}
            </div>
            <div class="col-5 col-md-5 columns text-bold text-center">
              {{ $t("app.description") }}
            </div>
            <div class="col-2 col-md-2 columns text-bold">
              {{ $t("app.amountGivenLabel") }}
            </div>
            <div class="col-2 col-md-2 columns text-bold">
              {{ $t("app.amountSpent") }}
            </div>
            <div class="col-2 col-md-2 column_details_end text-bold">
              {{ $t("app.balance") }}
            </div>
          </div>
          <!---------------------------------------------------------------------END OF TABLE TITLE--------------------------------------------------------------------------->

          <!-----------------------------------------------------------START OF EXPENDITURE LIST------------------------------------------------->
          <div
            class="row"
            v-for="(expenditure, index) in getExpenditures"
            :key="index"
          >
            <div class="col-1 col-md-1 column_details text-bold">
              E.{{ index + 1 }}
            </div>
            <div class="col-md-5 column_details text-medium text-left">
              {{ expenditure.name }}
            </div>
            <div class="col-md-2 column_details text-medium text-left">
              {{ Number(expenditure.amount_given).toLocaleString() }}
            </div>
            <div class="col-md-2 column_details text-medium text-left">
              {{ Number(expenditure.amount_spent).toLocaleString() }}
            </div>
            <div class="col-md-2 column_details_end text-left">
              {{ Number(expenditure.balance).toLocaleString() }}
            </div>
          </div>
          <!-----------------------------------------------------------END OF EXPENDITURE LIST--------------------------------------------------->

          <!-------------------------------------------------------START OF EXPENDITURE TALLY----------------------------------------------------->
          <div class="row">
            <div class="col-md-1 column_details"></div>
            <div
              class="col-md-5 column_details text-bold text-left text-uppercase"
            >
              {{ $t("app.totalExpenditure") }}
            </div>
            <div class="col-md-2 column_details text-bold text-left">
              {{ Number(getTotalAmountGiven).toLocaleString() }}
            </div>
            <div class="col-md-2 column_details text-bold text-left">
              {{ Number(getTotalAmountSpent).toLocaleString() }}
            </div>
            <div class="col-md-2 column_details_end text-bold text-left">
              {{ Number(getBalance).toLocaleString() }}
            </div>
          </div>
          <!------------------------------------------------------END OF EXPENDITURE TALLY------------------------------------------------------------------>
        </div>
      </div>
      <div class="col-1 col-md-1 col-sm-12 col-xs-"></div>
    </div>
    <!---------------------------------------------------------------------------------END OF EXPENDITURE-------------------------------------------------------->

    <!----------------------------------------------------------------------------------START OF SUMMARY----------------------------------------------------->
    <div class="row q-mt-md">
      <div class="col-1 col-md-1 col-sm-12 col-xs-12"></div>
      <div class="col-10 col-md-10 col-sm-12 col-xs-12">
        <div class="text-center q-pt-md">
          <label for="income" class="income_heading"
            >{{ $t("app.summary") }} (XAF)</label
          >
        </div>
        <div class="q-mt-md">
          <!-------------------------------------------------------------------TABLE TITLE------------------------------------------------------------------>
          <div class="row table_header">
            <div class="col-1 col-md-1 columns text-bold">S/N</div>
            <div class="col-md-6 columns text-bold text-left">Description</div>
            <div class="col-md-5 columns text-bold">{{ $t("app.amount") }}</div>
          </div>
          <!---------------------------------------------------------------------END OF TABLE TITLE--------------------------------------------------------------------------->

          <div class="row">
            <div class="col-1 col-md-1 column_details text-bold">S.1</div>
            <div
              class="col-md-6 column_details text-bold text-uppercase text-left"
            >
              {{ $t("app.totalIncome") }}
            </div>
            <div class="col-md-5 column_details_end text-bold text-left">
              {{ Number(getTotalIncome).toLocaleString() }}
            </div>
          </div>

          <div class="row">
            <div class="col-1 col-md-1 column_details text-bold">S.2</div>
            <div
              class="col-md-6 column_details text-bold text-uppercase text-left"
            >
              {{ $t("app.totalExpenditureLabel") }}
            </div>
            <div class="col-md-5 column_details_end text-bold text-left">
              {{ Number(getTotalExpenditure).toLocaleString() }}
            </div>
          </div>

          <div class="row">
            <div class="col-1 col-md-1 column_details text-bold">S.3</div>
            <div
              class="col-md-6 column_details text-bold text-uppercase text-left"
            >
              {{ $t("app.totalBalance") }}
            </div>
            <div class="col-md-5 column_details_end text-bold text-left">
              {{ Number(getTotalBalance).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-1 col-md-1 col-sm-12 col-xs-"></div>
    </div>
    <!---------------------------------------------------------------------------------END OF SUMMARY-------------------------------------------------------->

    <!-----------------------------------------------------------------------------DETAILS REPORT PRESENTERS------------------------------------------------------------>
    <div class="row q-mt-lg q-mb-xl">
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
export default {
  props: {
    heading: {
      type: String,
      required: true,
    },
    activity_report_data: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      label_download: this.$t("app.print"),
      loading: false,
      color: "positive",
      no_caps: true,
      filter: "",
    };
  },
  computed: {
    getIncomes() {
      return this.activity_report_data[0];
    },

    getTotalIncome() {
      return this.activity_report_data[2].total_income;
    },

    getExpenditures() {
      return this.activity_report_data[1];
    },

    getTotalAmountGiven() {
      return this.activity_report_data[3].total_amount_given;
    },

    getTotalAmountSpent() {
      return this.activity_report_data[4].total_amount_spent;
    },

    getBalance() {
      return this.activity_report_data[5].balance;
    },
    getTotalExpenditure() {
      return this.activity_report_data[4].total_amount_spent;
    },

    getTotalBalance() {
      return this.activity_report_data[6].total_balance;
    },

    getPresident() {
      return this.activity_report_data[7].president;
    },

    getFinancialSecretary() {
      return this.activity_report_data[8].fin_sec;
    },

    getTreasurer() {
      return this.activity_report_data[9].treasurer;
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
  border: 2px dashed $grey5;
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
  border-bottom: 2px solid #000;
}

.admin_name {
  font-size: 0.7rem;
  min-width: 25%;
}

.admin_title {
  font-size: 0.7rem;
  text-decoration: underline;
}
.admin_details {
  min-width: 25%;
}

.sign {
  font-size: 0.7rem;
}
</style>
