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
        <tr style="padding: 5px; border: 1px solid black" class="table_header">
          <th style="padding: 1px; border: 1px solid black">{{$t('app.sn')}}</th>
          <th style="padding: 5px; border: 1px solid black">{{$t('name')}}</th>
          <th
            style="padding: 5px; border: 1px solid black"
            v-for="(column, index) in getTableColumns"
            :key="index"
          >
            {{ column.code }}
          </th>
          <th style="padding: 5px; border: 1px solid black">{{$t('app.expected')}}</th>
          <th style="padding: 5px; border: 1px solid black">{{$t('app.total')}}</th>
          <th style="padding: 5px; border: 1px solid black">{{$t('app.balance')}}</th>
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
            colspan="2"
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
            v-for="(column, index) in getTableColumns"
            :key="index"
          >
            {{ Number(column.total_amount_deposited).toLocaleString() }}
          </td>
          <td
            style="
              padding: 3px;
              font-weight: bold;
              border: 1px solid black;
              text-align: center;
            "
          >
            {{ Number(getTotalYearlExpected).toLocaleString() }}
          </td>
          <td
            style="
              padding: 3px;
              font-weight: bold;
              border: 1px solid black;
              text-align: center;
            "
          >
            {{ Number(getTotalYearlyContribution).toLocaleString() }}
          </td>
          <td style="padding: 3px; font-weight: bold; text-align: center">
            {{ Number(getTotalYearlyBalance).toLocaleString() }}
          </td>
        </tr>
      </table>
    </div>

    <div class="text-center q-my-lg">
      <label
        style="
          font-weight: bold;
          font-size: 0.8rem;
          text-align: center;
          text-transform: capitalize;
        "
        class="heading"
      >
        {{ $t("app.columnNames") }}
      </label>
    </div>
    <div style="margin-bottom: 40px">
      <table
        style="border: 1px solid black; border-collapse: collapse; width: 100%"
      >
        <tr style="padding: 5px; border: 1px solid black; font-size: smaller">
          <th style="padding: 1px; border: 1px solid black">Code</th>
          <th style="padding: 5px; border: 1px solid black">{{$t('app.name')}}</th>
          <th style="padding: 5px; border: 1px solid black">{{$t('app.memberSize')}}</th>
          <th style="padding: 5px; border: 1px solid black">{{$t('app.compulsory')}}</th>
          <th style="padding: 5px; border: 1px solid black">{{$t('app.type')}}</th>
          <th style="padding: 5px; border: 1px solid black">{{$t('app.frequency')}}</th>
          <th style="padding: 5px; border: 1px solid black">{{ $t('app.Amount') }} XAF</th>
          <th style="padding: 5px; border: 1px solid black">
            {{$t('app.paymentDuration')}}
          </th>
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
            {{ column.member_size }}
          </td>
          <td
            style="padding: 5px; border: 1px solid black"
            v-show="column.compulsory"
          >
            {{$t('app.yes')}}
          </td>
          <td
            style="padding: 5px; border: 1px solid black"
            v-show="!column.compulsory"
          >
            {{$t('app.no')}}
          </td>
          <td style="padding: 5px; border: 1px solid black">
            {{ formatConstants(column.type) }}
          </td>
          <td style="padding: 5px; border: 1px solid black">
            {{ formatConstants(column.frequency) }}
          </td>
          <td style="padding: 5px; border: 1px solid black">
            {{ Number(column.amount).toLocaleString() }}
          </td>
          <td style="padding: 5px; border: 1px solid black">
            <q-chip
              color="teal"
              text-color="white"
              v-for="ref in column.payment_durations"
              :key="ref.id"
              size="sm"
              >{{ ref }}</q-chip
            >
          </td>
        </tr>
      </table>
    </div>

    <div class="text-center q-my-md">
      <label
        style="
          font-weight: bold;
          font-size: 0.8rem;
          text-align: center;
          text-transform: capitalize;
        "
        class="heading"
      >
        {{ $t("app.summary") }}
      </label>
    </div>

    <div style="margin-bottom: 40px">
      <table
        style="border: 1px solid black; border-collapse: collapse; width: 100%"
      >
        <tr style="padding: 5px; border: 1px solid black; font-size: smaller">
          <th style="padding: 1px; border: 1px solid black">{{$t('app.sn')}}</th>
          <th style="padding: 5px; border: 1px solid black">
            {{$t('app.totalExpectedContribution')}}
          </th>
          <th style="padding: 5px; border: 1px solid black">
            {{$t('app.total-AmountContributed')}}
          </th>
          <th style="padding: 5px; border: 1px solid black">
            {{$t('app.totalBalanceContribution')}}
          </th>
        </tr>

        <tr style="border: 1px solid black; font-size: smaller">
          <td
            style="padding: 5px; border: 1px solid black"
            class="text-center text-weight-bold"
          >
            /
          </td>
          <td
            style="padding: 5px; border: 1px solid black"
            class="text-center text-weight-bold"
          >
            {{ Number(getTotalYearlExpected).toLocaleString() }}XAF
          </td>
          <td
            style="padding: 5px; border: 1px solid black"
            class="text-center text-weight-bold"
          >
            {{ Number(getTotalYearlyContribution).toLocaleString() }} XAF
          </td>
          <td
            style="padding: 5px; border: 1px solid black"
            class="text-center text-weight-bold"
          >
            {{ Number(getTotalYearlyBalance).toLocaleString() }} XAF
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
import HelperMixin from "src/mixins/HelperMixin.vue";
export default {
  mixins: [HelperMixin],
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
