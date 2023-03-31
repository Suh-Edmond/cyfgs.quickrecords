<template>
  <div class="q-pa-xs">
    <!-- table heading -->
    <div class="text-center">
      <label for="title" class="text-h5 heading">{{ heading }}</label>
    </div>
    <!-- table for incomes -->
    <q-table
      :data="income_data"
      :columns="income_columns"
      row-key="id"
      hide-pagination
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }"
      class="col-xs-12"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="amount" :props="props">
            {{ Number(props.row.amount).toLocaleString() }}
          </q-td>
        </q-tr>
      </template>

      <!-- slot for table headings -->
      <template v-slot:top-left>
        <div class="text-h6 title">
          {{ income_title }}
        </div>
      </template>
      <template v-slot:bottom>
        <q-tr>
          <q-th class="text-bold total_heading">
            Total Income:
          </q-th>
          <q-th class="text-bold total_income_value">
            {{ Number(total_income).toLocaleString() }} XAF
          </q-th>
        </q-tr>
      </template>
    </q-table>

    <!-- table for expenditures -->
    <q-table
      :data="expenditure_data"
      :columns="expenditure_columns"
      row-key="id"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }"
      class="col-xs-12"
      hide-pagination
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="amount_given" :props="props">
            {{ Number(props.row.amount_given).toLocaleString() }}
          </q-td>
          <q-td key="amount_spent" :props="props">
            {{ Number(props.row.amount_spent).toLocaleString() }}
          </q-td>
          <q-td key="balance" :props="props">
            {{ Number(props.row.balance).toLocaleString() }}
          </q-td>
        </q-tr>
      </template>

      <!-- slot for table headings -->
      <template v-slot:top-left>
        <div class="text-h6 title">
          {{ expenditure_title }}
        </div>
      </template>
      <template v-slot:bottom>
        <q-tr>
          <q-th class="text-bold total">
            Total:
          </q-th>
          <q-th class="text-bold total_given">
            {{ Number(total_amount_given).toLocaleString() }} XAF
          </q-th>
          <q-th class="text-bold total_spent">
            {{ Number(total_amount_spent).toLocaleString() }} XAF
          </q-th>
          <q-th class="text-bold balance">
            {{ Number(total_balance).toLocaleString() }} XAF
          </q-th>
        </q-tr>
        <div class="text-bold q-pt-lg q-pb-md">
          <div  class="q-pt-sm q-pb-md balance_details">
            Net Balance (Total income   -   Actual expenditure + Total balance): <span class="net_balance">{{ Number(net_balance).toLocaleString() }} XAF</span>
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>
<script>
export default {
  props: {
    income_columns: {
      type: Array,
      required: true,
    },
    income_data: {
      type: Array,
      required: true,
    },
    income_title: {
      required: false,
      type: String,
    },
    expenditure_columns: {
      type: Array,
      required: true,
    },
    expenditure_data: {
      type: Array,
      required: true,
    },
    expenditure_title: {
      required: false,
      type: String,
    },
    total_income:{
      required: false,
      type: Number,
    },
    total_amount_given:{
      required: false,
      type: Number,
    },
    total_amount_spent:{
      required: false,
      type: Number,
    },
    total_balance:{
      required: false,
      type: Number,
    },
    net_balance: {
      required: false,
      type: Number,
    },
    total_estimated_amount:{
      required: false,
      type: Number,
    },
    heading:{
      type: String,
      required:true
    },

  },

  data() {
    return {
      label_download: "Print",
      loading: false,
      color: "positive",
      no_caps: true,
      filter: "",
    };
  },
  computed: {

  },
  methods: {},
  components: {},
};
</script>
<style lang="scss" scoped>
.title {
  font-size: medium;
}

.total_income_value {
  padding-left: 31.2rem;
  font-size: 14px;
}
.total {
  padding-left: 7.6rem;
  font-size: 14px;
}
.total_given {
  padding-left: 16.8rem;
  font-size: 14px;
}

.total_spent {
  padding-left: 15.9rem;
  font-size: 14px;
}
.balance {
  padding-left: 16.5rem;
  font-size: 14px;
}
.balance_details {
  font-size: 14px;
}
.total_heading {
  padding-left: 11.5rem;
  font-size: 14px;
}
.net_balance {
  padding-left: 1rem;
}
.heading {
  font-family: "Roboto";
  font-style: normal;
  font-weight: bolder;
  font-size: 17px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $dark;
}
</style>
