<template>
  <q-page>
    <NotFound :message="not_found_msg" v-if="income_activities.length == 0"></NotFound>
    <!-- header for filter categories -->
    <div
      class="row q-ml-xs q-pt-xs"
      v-if="income_activities.length > 0"
      :class="$q.screen.lg ? 'q-pa-sm' : ''"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
    >
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
        <q-select
          v-model="year"
          outlined
          dense
          :options="years"
          label="Select year"
          input-debounce="0"
          @filter="filterYears"
          use-input
          hide-selected
          fill-input
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-pl-md">
        <q-select
          v-model="month"
          outlined
          dense
          :options="months"
          label="Select month"
          input-debounce="0"
          @filter="filterMonths"
          use-input
          hide-selected
          fill-input
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-pl-md">
        <q-select
          v-model="status"
          outlined
          dense
          :options="statuses"
          label="Select status"
          input-debounce="0"
          @filter="filterStatus"
          use-input
          hide-selected
          fill-input
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 flex q-pl-md">
        <div>
          <ButtonVue
            :label="label_fetch"
            :loading="loading"
            :color="color"
            :disabled="validateFilter"
            :no_caps="no_caps"
            icon_right="filter_list"
          >
          </ButtonVue>
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <ButtonVue
            :label="label_download"
            :loading="loading"
            :color="color_print"
            :disabled="false"
            :no_caps="no_caps"
            icon_right="print"
          ></ButtonVue>
        </div>
      </div>
    </div>
    <!-- table for categories -->
    <div class="row q-pt-sm">
      <div class="col-md-12 col-xs-12 col-sm-12">
        <TableVue
          :columns="columns"
          :data="data"
          :label="label"
          :message="message"
          :name="name"
          :show_savings="false"
          :show_income_activity="true"
          :show_members="false"
          @edit-income-activity="editIncomeActivity"
          @view-income-activity="viewIncomeActivity"
        >
        </TableVue>
      </div>
    </div>
  </q-page>
</template>

<script>
import NotFound from "src/components/NotFound.vue";
import TableVue from "src/components/Table.vue";
import ButtonVue from "src/components/Button.vue";
export default {
  data() {
    return {
      not_found_msg:
        "Ooops!! No Income Activity has been recorded. click the add button to add income activity.",
      income_activities: [{}],
      year: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
      month: null,
      months: [
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
      statuses: ["APPROVED", "UNAPPROVED"],
      status: null,
      search: null,
      label_fetch: "Filter",
      color: "primary",
      no_caps: true,
      loading: false,
      label_download: "Print",
      color_print: "positive",
      columns: [
        {
          name: "id",
          required: true,
          label: "S/N",
          align: "left",
          field: "id",
        },
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "amount",
          align: "left",
          label: "Amount (XAF)",
          field: "amount",
        },
        {
          name: "date",
          align: "left",
          label: "Date",
          field: "date",
        },
        {
          name: "venue",
          align: "left",
          label: "Venue",
          field: "venue",
        },
        {
          name: "action",
          label: "Action",
          field: "action",
        },
      ],
      data: [
        {
          id: 1,
          name: "Frozen Yogurt",
          venue: "Sandpit Bakweri Town",
          date: "2023/01/09",
          amount: 50000,
          action: "",
        },
        {
          id: 2,
          name: "Ice cream sandwich",
          venue: "Sandpit Bakweri Town",
          date: "2023/01/09",
          amount: 50000,
          action: "",
        },
        {
          id: 3,
          name: "Eclair",
          venue: "Sandpit Bakweri Town",
          date: "2023/01/09",
          amount: 50000,
          action: "",
        },
        {
          id: 4,
          name: "Cupcake",
          venue: "Molyko Buea",
          date: "2022/09/12",
          amount: 50000,
          action: "",
        },
        {
          id: 5,
          name: "Gingerbread",
          venue: "Molyko Buea",
          date: "2022/09/12",
          amount: 50000,
          action: "",
        },
        {
          id: 6,
          name: "Jelly bean",
          venue: "Molyko Buea",
          date: "2022/09/12",
          amount: 50000,
          action: "",
        },
        {
          id: 7,
          name:"Jelly Brown",
          venue: "Molyko Buea",
          date: "2022/09/12",
          amount: 50000,
          action: "",
        },
        {
          id: 8,
          name: "Honeycomb",
          venue: "Sandpit Bakweri Town",
          date: "2022/09/12",
          amount: 50000,
          action: "",
        },
        {
          id: 9,
          name: "Donut",
          venue: "Sandpit Bakweri Town",
          date: "2022/09/12",
          amount: 50000,
          action: "",
        },
        {
          id: 10,
          name: "KitKat",
          venue: "Sandpit Bakweri Town",
          date: "2022/09/12",
          amount: 50000,
          action: "",
        },
      ],
      label: "Delete",
      message: "Are you sure you want to delete this Income Activity ?",
      name: "Harvest ThanksGiven",
    };
  },
  computed: {
    validateFilter() {
      return this.year !== null || this.month !== null || this.status !== null
        ? false
        : true;
    },
  },
  methods: {
    filterYears(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.years = this.years.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterMonths(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.months = this.months.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterStatus(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.statuses = this.statuses.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    editIncomeActivity(data){
      this.$emit("edit-income-activity", data)
    },
    viewIncomeActivity(data){
      console.log(data);
      this.$emit("view-income-activity", data);
    }
  },
  components: {
    NotFound,
    TableVue,
    ButtonVue,
  },
};
</script>

<style lang="scss" scoped>
.search {
  cursor: pointer;
}
</style>
