<template>
  <q-page>
    <NotFound :message="not_found_msg" v-if="savings.length == 0"></NotFound>
    <!-- header for filter categories -->
    <div
      class="row q-ml-xs q-pt-xs"
      v-if="savings.length > 0"
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
    <!-- table for savings -->
    <div class="row q-pt-sm">
      <div class="col-md-12 col-xs-12 col-sm-12">
        <TableVue
          :columns="columns"
          :data="data"
          :label="label"
          :message="message"
          :name="name"
          :show_savings="true"
          :show_income_activity="false"
          :show_members="false"
          :show_contribution="false"
          @edit-member-saving="editMemberSaving"
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
        "Ooops!! No Savings has been recorded. click the add button to add saving.",
      savings: [{}],
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
          name: "email",
          align: "left",
          label: "Email",
          field: "email",
        },
        {
          name: "telephone",
          align: "left",
          label: "Telephone Number",
          field: "telephone",
        },
        {
          name: "amount_deposited",
          align: "left",
          label: "Amount Deposited (XAF)",
          field: "amount_deposited",
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
          email: "emailgmail.com",
          telephone: "34582390234",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 2,
          name: "Ice cream sandwich",
          email: "emailgmail.com",
          telephone: "34582390234",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 3,
          name: "Eclair",
          email: "emailgmail.com",
          telephone: "34582390234",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 4,
          name: "Cupcake",
          email: "email@gmail.com",
          telephone: "674009983",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 5,
          name: "Gingerbread",
          email: "email@gmail.com",
          telephone: "674009983",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 6,
          name: "Jelly bean",
          email: "email@gmail.com",
          telephone: "674009983",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 7,
          email: "email@gmail.com",
          telephone: "674009983",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 8,
          name: "Honeycomb",
          email: "emailgmail.com",
          telephone: "674009983",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 9,
          name: "Donut",
          email: "emailgmail.com",
          telephone: "674009983",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 10,
          name: "KitKat",
          email: "emailgmail.com",
          telephone: "674009983",
          amount_deposited: 50000,
          action: "",
        },
      ],
      label: "Delete",
      message: "Are you sure you want to delete this Member Saving?",
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
    editMemberSaving(data){
      this.$emit("edit-member-saving", data)
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
