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
          <label for="income" class="income_heading">{{$t('app.income')}} (XAF)</label>
        </div>
        <div class="q-mt-md">
          <!-------------------------------------------------------------------TABLE TITLE------------------------------------------------------------------>
          <div class="row table_header">
            <div class="col-1 col-md-1 columns text-bold">{{$t('app.sn')}}</div>
            <div class="col-6 col-md-6 columns text-bold text-center">
              {{$t('app.description')}}
            </div>
            <div class="col-5 col-md-5 column_details_end text-bold">
              {{$t('app.amount')}}
            </div>
          </div>
          <!---------------------------------------------------------------------END OF TABLE TITLE--------------------------------------------------------------------------->

          <!-----------------------------------------------------------START OF INCOME LIST------------------------------------------------->
          <div class="row" v-for="(income, index) in getIncomes" :key="index">
            <div class="col-1 col-md-1 column_details text-bold">
              I.{{ index + 1 }}
            </div>
            <div class="col-md-6 column_details text-medium text-center">
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
              class="col-md-6 column_details text-bold text-center text-uppercase"
            >
              {{$t('app.totalIncome')}}
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
          <label for="income" class="income_heading"
            >{{$t('app.expenditures')}} (XAF)</label
          >
        </div>
        <div class="q-mt-md">
          <!-------------------------------------------------------------------TABLE TITLE------------------------------------------------------------------>
          <div class="row table_header">
            <div class="col-1 col-md-1 columns text-bold">{{$t('app.sn')}}</div>
            <div class="col-5 col-md-5 columns text-bold text-center">
              {{$t('app.description')}}
            </div>
            <div class="col-2 col-md-2 columns text-bold">{{$t('app.amountGivenLabel')}}</div>
            <div class="col-2 col-md-2 columns text-bold">{{$t('app.amountSpent')}}</div>
            <div class="col-2 col-md-2 column_details_end text-bold">
              {{$t('app.balance')}}
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
            <div class="col-md-5 column_details text-medium text-center">
              {{ expenditure.name }}
            </div>
            <div class="col-md-2 column_details text-medium text-center">
              {{ Number(expenditure.amount_given).toLocaleString() }}
            </div>
            <div class="col-md-2 column_details text-medium text-center">
              {{ Number(expenditure.amount_spent).toLocaleString() }}
            </div>
            <div class="col-md-2 column_details_end text-center">
              {{ Number(expenditure.balance).toLocaleString() }}
            </div>
          </div>
          <!-----------------------------------------------------------END OF EXPENDITURE LIST--------------------------------------------------->

          <!-------------------------------------------------------START OF EXPENDITURE TALLY----------------------------------------------------->
          <div class="row">
            <div class="col-md-1 column_details"></div>
            <div
              class="col-md-5 column_details text-bold text-center text-uppercase"
            >
              {{$t('app.totalExpenditure')}}
            </div>
            <div class="col-md-2 column_details text-bold text-center">
              {{ Number(getTotalAmountGiven).toLocaleString() }}
            </div>
            <div class="col-md-2 column_details text-bold text-center">
              {{ Number(getTotalAmountSpent).toLocaleString() }}
            </div>
            <div class="col-md-2 column_details_end text-bold text-center">
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
          <label for="income" class="income_heading">{{$t('app.summary')}} (XAF)</label>
        </div>
        <div class="q-mt-md">
          <!-------------------------------------------------------------------TABLE TITLE------------------------------------------------------------------>
          <div class="row table_header">
            <div class="col-1 col-md-1 columns text-bold">S/N</div>
            <div class="col-md-6 columns text-bold text-center">
              Description
            </div>
            <div class="col-md-5 columns text-bold">{{$t('app.amount')}}</div>
          </div>
          <!---------------------------------------------------------------------END OF TABLE TITLE--------------------------------------------------------------------------->

          <div class="row">
            <div class="col-1 col-md-1 column_details text-bold">S.1</div>
            <div
              class="col-md-6 column_details text-bold text-uppercase text-center"
            >
             {{$t('app.totalIncome')}}
            </div>
            <div class="col-md-5 column_details_end text-bold text-center">
              {{ Number(getTotalIncome).toLocaleString() }}
            </div>
          </div>

          <div class="row">
            <div class="col-1 col-md-1 column_details text-bold">S.2</div>
            <div
              class="col-md-6 column_details text-bold text-uppercase text-center"
            >
              {{$t('app.totalExpenditureLabel')}}
            </div>
            <div class="col-md-5 column_details_end text-bold text-center">
              {{ Number(getTotalExpenditure).toLocaleString() }}
            </div>
          </div>

          <div class="row">
            <div class="col-1 col-md-1 column_details text-bold">S.3</div>
            <div
              class="col-md-6 column_details text-bold text-uppercase text-center"
            >
              {{$t('app.totalBalance')}}
            </div>
            <div class="col-md-5 column_details_end text-bold text-center">
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
          <label for="income" class="summary text-uppercase">{{$t('app.presentedBy')}}:</label>
        </div>
        <div class="flex justify-between">
          <div class="col-md-6 text-bold text-center text-uppercase admin_details">
            <div>
              <label for="name">{{$t('app.finSec')}} </label><br/>
              <span class="admin_name">{{getFinancialSecretary.name}}</span>
            </div>
            <br/>
            <div>
              <label for="name">{{$t('app.sign')}} </label>
              <hr class="q-mt-lg"/>
            </div>
          </div>
          <div class="col-md-6 text-bold text-center text-uppercase admin_details">
            <div>
              <label for="name">{{$t('app.treasurer')}}</label><br/>
              <span class="admin_name">{{getTreasurer.name}}</span>
            </div>
            <br/>
            <div>
              <label for="name">{{$t('app.sign')}} </label>
              <hr class="q-mt-lg"/>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <div class="col-md-12 text-bold text-center text-uppercase admin_details">
            <div>
              <label for="name">{{$t('app.president')}}</label><br/>
              <span class="admin_name">{{getPresident.name}}</span>
            </div>
            <br/>
            <div>
              <label for="name">{{$t('app.sign')}} </label>
              <hr class="q-mt-lg"/>
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
      label_download: this.$t('app.print'),
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

    getPresident(){
      return this.activity_report_data[7].president
    },

    getFinancialSecretary(){
      return this.activity_report_data[8].fin_sec
    },

    getTreasurer(){
      return this.activity_report_data[9].treasurer
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
  font-size: 17px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $dark;
  border-bottom: 2px solid #000;
}

.income_heading {
  font-family: "Roboto";
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  letter-spacing: 0.01em;
  color: $dark;
  border-bottom: 2px solid black;
}

.table_header {
  border: 1px solid black;
  background-color: $primary;
  color: $white1;
  border-color: $white1;
}

.columns {
  padding: 12px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black;
  border-color: $white1;
}

.column_details_end {
  padding: 8px;
  border-bottom: 2px solid black;
  border-left: 2px solid black;
  border-color: $dark;
  border-right: 2px solid black;
}

.column_details {
  padding: 8px;
  border-bottom: 2px solid black;
  border-left: 2px solid black;
  border-color: $dark;
}

.summary {
  font-family: "Roboto";
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  letter-spacing: 0.01em;
  color: $dark;
  border-bottom: 2px solid #000;
}

.summary_row {
  border-bottom: 2px solid black;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
}
.summary_row_first {
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
}
.summary_column_details {
  border-left: 1px solid #000;
  border-right: 1px solid #000;
  padding: 8px;
}

.admin_name {
  text-decoration: underline;
  min-width: 25%;
}
.admin_details {
  min-width: 25%;
}
</style>
