<template>
  <q-page>
    <NotFound :message="not_found_msg" v-if="payment_categories.length == 0 "></NotFound>
    <!-- header for filter categories -->
    <div class="row q-ml-xs q-pt-xs" v-if="payment_categories.length > 0" :class="$q.screen.lg ? 'q-pa-sm' : ''" :style="
    $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''">
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12" v-show="!start_search">
        <q-select v-model="year" outlined dense :options="years" label="Select year" />
      </div>
    </div>
    <!-- table for categories -->
    <div class="row q-pt-sm">
      <div class="col-md-12 col-xs-12 col-sm-12">
        <CategoryTable :columns="columns" :data="data" :title="table_title" :label="label" :message="message" @update-payment-category="updatePaymentCategory">
        </CategoryTable>
      </div>
    </div>
  </q-page>
</template>

<script>
import NotFound from "src/components/NotFound.vue";
import CategoryTable from "src/components/CategoryTable.vue";
export default {
  data() {
    return {
      not_found_msg: "Ooops!! No Payment Categories found. click the add button to add Payment Categories.",
      payment_categories: [{ "id": "1" }],
      start_search: false,
      year: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
      search: null,
      label_fetch: "Filter",
      color: "primary",
      no_caps: true,
      loading: false,
      columns: [
        {
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
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
          name: "item",
          align: "center",
          label: "",
          field: "item",
          sortable: true,
        },
        {
          name: "action",
          label: "Action",
          field: "action",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      data: [
        {
          counter: 1,
          name: "Frozen Yogurt",
          item: "View Payment Items",
          iron: "",
        },
        {
          counter: 2,
          name: "Ice cream sandwich",
          item: "View Payment Items",
          iron: "",
        },
        {
          counter: 3,
          name: "Eclair",
          item: "View Payment Items",
          iron: "",
        },
        {
          counter: 4,
          name: "Cupcake",
          item: "View Payment Items",
          iron: "",
        },
        {
          counter: 5,
          name: "Gingerbread",
          item: "View Payment Items",
          iron: "",
        },
        {
          counter: 6,
          name: "Jelly bean",
          item: "View Payment Items",
          iron: "",
        },
        {
          counter: 7,
          name: "Lollipop",
          item: "View Payment Items",
          action: "",
        },
        {
          counter: 8,
          name: "Honeycomb",
          item: "View Payment Items",
          action: "",
        },
        {
          counter: 9,
          name: "Donut",
          item: "View Payment Items",
          iron: "",
        },
        {
          counter: 10,
          name: "KitKat",
          item: "View Payment Items",
          iron: "",
        },
      ],
      table_title: "Payment Categories",
      label: "Delete",
      message:"Are you sure you want to delete this Category?"
    }
  },
  computed: {
    validateFilter() {
      return true;
    }
  },
  methods: {
    showSearch() {

    },
    updatePaymentCategory(data) {
      this.$emit("update-payment-category", data);
    },
  },
  components: {
    NotFound,
    CategoryTable
  },
}
</script>

<style lang="scss" scoped>

</style>
