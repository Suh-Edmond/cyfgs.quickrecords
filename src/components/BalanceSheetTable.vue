<template>
  <div class="q-pa-sm report">
    <div class="header q-mt-lg">
      <ReportHead></ReportHead>
    </div>

    <div class="q-pt-xl text-center text-bold">
      <label for="title" class="heading">{{ heading }}</label>
    </div>
    <div class="q-pt-md row q-mb-xs">
      <table
        style="border: 1px solid black; border-collapse: collapse; width: 100%"
      >
        <tr style="padding: 7px; border: 1px solid black" class="table_header">
          <th style="padding: 1px; border: 1px solid black">S/N</th>
          <th style="padding: 7px; border: 1px solid black">Names</th>
          <th
            style="padding: 7px; border: 1px solid black"
            v-for="(column, index) in getTableColumns"
            :key="index"
          >
            {{ column.code }}
          </th>
          <th style="padding: 7px; border: 1px solid black">Expected XAF</th>
          <th style="padding: 7px; border: 1px solid black">Total XAF</th>
          <th style="padding: 7px; border: 1px solid black">Balance XAF</th>
        </tr>
        <tr
          style="border: 1px solid black; font-size: smaller"
          v-for="(value, index) in getTableData"
          :key="index"
        >
          <td style="padding: 5px">{{ index + 1 }}</td>
          <td style="border: 1px solid black; padding: 3px; text-align: center">
            {{ value.member_info.name }}
          </td>

          <td
            style="border: 1px solid black; padding: 3px; text-align: center"
            v-for="(contribution, i) in value.contributions"
            :key="i"
          >
            {{ Number(contribution.amount_deposited).toLocaleString() }}
          </td>

          <td style="border: 1px solid black; padding: 3px; text-align: center">
            {{ Number(value.expected_amount).toLocaleString() }}
          </td>
          <td style="border: 1px solid black; padding: 3px; text-align: center">
            {{ Number(value.total_contribution).toLocaleString() }}
          </td>
          <td style="border: 1px solid black; padding: 3px; text-align: center">
            {{ Number(value.total_balance).toLocaleString() }}
          </td>
        </tr>
        <tr style="padding: 12px; border: 1px solid black; font-size: smaller">
          <td
            style="
              border: 1px solid black;
              text-align: center;
              padding: 1px;
              font-weight: bold;
            "
            :colspan="getColumnSpan"
          >
            Tally
          </td>
          <td
            style="
              padding: 3px;
              font-weight: bold;
              border: 1px solid black;
              text-align: center;
            "
          >
            {{ Number(getTotalYearlExpected).toLocaleString() }} XAF
          </td>
          <td
            style="
              padding: 3px;
              font-weight: bold;
              border: 1px solid black;
              text-align: center;
            "
          >
            {{ Number(getTotalYearlyContribution).toLocaleString() }} XAF
          </td>
          <td style="padding: 3px; font-weight: bold; text-align: center">
            {{ Number(getTotalYearlyBalance).toLocaleString() }} XAF
          </td>
        </tr>
      </table>
    </div>

    <div style="width: 40%">
      <h6
        style="
          font-weight: bold;
          font-size: 0.8rem;
          text-align: center;
          text-transform: capitalize;
          border-bottom: 1px solid black;
        "
      >
        {{ $t("app.columnNames") }}
      </h6>
    </div>
    <div style="margin-bottom: 40px">
      <table
        style="border: 1px solid black; border-collapse: collapse; width: 40%"
      >
        <tr style="padding: 5px; border: 1px solid black; font-size: smaller">
          <th style="padding: 1px; border: 1px solid black">S/N</th>
          <th style="padding: 5px; border: 1px solid black">Names</th>
          <th style="padding: 5px; border: 1px solid black">Amount XAF</th>
          <th style="padding: 5px; border: 1px solid black">Compulsory</th>
        </tr>

        <tr
          style="border: 1px solid black; font-size: smaller"
          v-for="(column, index) in getTableColumns"
          :key="index"
        >
          <td style="padding: 5px; border: 1px solid black">
            {{ column.code }}
          </td>
          <td style="padding: 5px; border: 1px solid black">
            {{ column.name }}
          </td>
          <td style="padding: 5px; border: 1px solid black">
            {{ Number(column.amount).toLocaleString() }}
          </td>
          <td
            style="padding: 5px; border: 1px solid black"
            v-show="column.compulsory"
          >
            YES
          </td>
          <td
            style="padding: 5px; border: 1px solid black"
            v-show="!column.compulsory"
          >
            NO
          </td>
        </tr>
      </table>
    </div>

    <!-----------------------------------------------------------------------------DETAILS REPORT PRESENTERS------------------------------------------------------------>
    <div class="row q-mt-lg">
      <div class="col-md-1 col-sm-1 col-xs-1"></div>
      <div class="col-md-10 col-xs-12 col-sm-12">
        <div class="q-my-lg text-center">
          <label
            for="income"
            class="admin_title text-uppercase text-weight-bold"
            >{{ $t("app.presentedBy") }}</label
          >
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
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },

  computed: {
    getTableColumns() {
      return this.data.column_names;
    },

    getTableData() {
      return this.data.members_contributions;
    },

    getTotalYearlyContribution() {
      return this.data.total_yearly_contribution;
    },

    getTotalYearlyBalance() {
      return this.data.total_yearly_balance;
    },

    getTotalYearlExpected() {
      return this.data.total_year_expected_amount;
    },

    getColumnSpan() {
      return 5 + this.data.column_names.length - 3;
    },

    getPresident() {
      return this.data.president;
    },

    getTreasurer() {
      return this.data.treasurer;
    },

    getFinancialSecretary() {
      return this.data.fin_sec;
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

.table_header {
  background-color: $primary;
  color: $white1;
  font-size: 0.8rem;
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
