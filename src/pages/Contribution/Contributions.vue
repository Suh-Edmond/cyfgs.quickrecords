<template>
  <div class="q-pa-sm">
    <!-- no contributions available -->
    <NotFound :message="not_found_msg" v-if="contributions.length == 0"></NotFound>
    <!-- contributions available -->
    <div class="row q-ml-xs" v-if="contributions.length > 0" :class="$q.screen.lg ? 'q-pa-sm' : ''" :style="
      $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
    ">
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-pr-md' : ''">
        <q-select v-model="payment_category_item_id" outlined dense :options="payment_items"
          label="Select payment item" />
      </div>
      <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-pr-md' : ''">
        <q-select v-model="year" outlined dense :options="years" label="Select year" />
      </div>
      <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-pr-md' : ''">
        <q-select v-model="month" outlined dense :options="months" label="Select month" input-debounce="0"
          @filter="filterMonths" use-input hide-selected fill-input />
      </div>
      <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-pr-md' : ''">
        <q-select v-model="status" outlined dense :options="statuses" label="Select status" />
      </div>
      <div :class="$q.screen.lg ? 'q-pr-md' : ''">
        <ButtonVue :label="label_fetch_user" :loading="loading" :color="color" :disabled="validateFilter"
          :no_caps="no_caps" icon_right="filter_list">
        </ButtonVue>
      </div>
      <div :style="$q.screen.lg ? 'margin-left:76px' : ''">
        <ButtonVue :label="label_print" :loading="loading" :color="color_print" :disabled="false" :no_caps="no_caps"
          icon_right="print" size="sm"></ButtonVue>
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
          :show_savings="false"
          :show_income_activity="false"
          :show_members="false"
          :show_member_savings="false"
          :show_contribution="true"
          :member_name="member_name"
          @view-contribution="viewContribution"
          @edit-contribution="editContribution"
        >
        </TableVue>
      </div>
    </div>
  </div>
</template>

<script>
import NotFound from "src/components/NotFound.vue";
import TableVue from "src/components/Table.vue";
import ButtonVue from "src/components/Button.vue";
export default {
  data() {
    return {
      contributions: [{}],
      not_found_msg:
        "Ooops!! No Contributions have been record, click the add to record contribution.",
      label_print: "Print",
      color_print: "positive",
      payment_category_item_id: null,
      year: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
      label_fetch_user: "Filter",
      loading: false,
      color: "primary",
      no_caps: true,
      payment_items: [],
      message: "Are you sure you want to delete this member's contribution ?",
      label: "Delete",
      name:"test",
      month: null,
      member_name:"Name: Suh Edmond, Amount Paid: 500 XAF",
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
      statuses: ["INCOMPLETE", "COMPLETE"],
      status: null,
      search: null,
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
          label: "Amount Deposited (XAF)",
          field: "amount",
        },
        {
          name: "status",
          align: "left",
          label: "Status",
          field: "status",
        },
        {
          name: "date",
          align: "left",
          label: "Date",
          field: "date",
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
          status: "APPROVED",
          date: "2022/01/09",
          amount: 50000,
          action: "",
        },
        {
          id: 2,
          name: "Ice cream sandwich",
          status: "APPROVED",
          date: "2022/01/09",
          amount: 50000,
          action: "",
        },
        {
          id: 3,
          name: "Eclair",
          status: "APPROVED",
          date: "2022/01/09",
          amount: 50000,
          action: "",
        },
        {
          id: 4,
          name: "Cupcake",
          status: "UNAPPROVED",
          date: "2022/02/02",
          amount: 50000,
          action: "",
        },
        {
          id: 5,
          name: "Gingerbread",
          status: "UNAPPROVED",
          date: "2022/02/02",
          amount: 50000,
          action: "",
        },
        {
          id: 6,
          name: "Jelly bean",
          status: "UNAPPROVED",
          date: "2022/02/02",
          amount: 50000,
          action: "",
        },
        {
          id: 7,
          status: "UNAPPROVED",
          date: "2022/02/02",
          amount: 50000,
          action: "",
        },
        {
          id: 8,
          name: "Honeycomb",
          status: "APPROVED",
          date: "2022/02/02",
          amount: 50000,
          action: "",
        },
        {
          id: 9,
          name: "Donut",
          status: "APPROVED",
          date: "2022/02/02",
          amount: 50000,
          action: "",
        },
        {
          id: 10,
          name: "KitKat",
          status: "APPROVED",
          date: "2022/02/02",
          amount: 50000,
          action: "",
        },
      ],
    }
  },
  computed: {
    validateFilter() {
      return this.payment_category_item_id !== null || this.month !== null || this.year !== null || this.status !== null ? false : true;
    }
  },
  methods: {
    filterMonths(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.months = this.months.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    viewContribution(data){
      this.$emit('view-contribution', data)
    },
    editContribution(data){
      this.$emit("edit-contribution", data);
    }
  },
  components: {
    NotFound,
    ButtonVue,
    TableVue
  }
}
</script>

<style lang="scss" scoped>

</style>
