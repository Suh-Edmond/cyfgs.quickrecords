<template>
  <q-page>
    <NotFound
      :message="not_found_msg"
      v-if="payment_categories.length == 0"
    ></NotFound>
    <!-- header for filter categories -->
    <div
      class="row q-ml-xs q-pt-xs"
      v-if="payment_categories.length > 0"
      :class="$q.screen.lg ? 'q-pa-sm' : ''"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
    >
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12" v-show="!start_search">
        <q-select
          v-model="year"
          outlined
          dense
          :options="years"
          label="Select year"
          v-show="!show_payment_items"
        />

        <q-select
          v-model="status"
          outlined
          dense
          :options="statuses"
          label="Select Status"
          v-show="show_payment_items"
        />
      </div>
      <div
        class="col-md-12 col-lg-12 col-xs-12 col-sm-12"
        v-show="start_search"
      >
        <q-input
          v-model="search"
          dense
          outlined
          type="search"
          placeholder="Type a name to search payment category..."
          v-show="start_search"
          clearable
        >
          <template v-slot:before>
            <q-icon name="close" round @click="showSearch" class="icon">
              <q-tooltip>Close Search</q-tooltip>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
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
    <!-- table for categories -->
    <div class="row q-pt-sm">
      <div class="col-md-12 col-xs-12 col-sm-12">
        <CategoryTable
          :payment_category_columns="payment_category_columns"
          :payment_categories_data="payment_categories_data"
          :title="getPaymentItem"
          :label="label"
          :payment_item_data="payment_item_data"
          :payment_item_columns="payment_item_columns"
          :on_del_msg_item="on_del_msg_item"
          :on_del_msg_cat="on_del_msg_cat"
          :show_payment_items="show_payment_items"
          @update-payment-category="updatePaymentCategory"
          @show-payment-items="showPaymentItems"
          @update-payment-item="updatePaymentItems"
        >
        </CategoryTable>
      </div>
    </div>
  </q-page>
</template>

<script>
import NotFound from "src/components/NotFound.vue";
import CategoryTable from "src/components/CategoryTable.vue";
import ButtonVue from "src/components/Button.vue";
export default {
  data() {
    return {
      not_found_msg:
        "Ooops!! No Payment Categories found. click the add button to add Payment Categories.",
      payment_categories: [{ id: "1" }],
      start_search: false,
      year: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
      search: null,
      label_fetch: "Filter",
      color: "primary",
      no_caps: true,
      loading: false,
      label_download:"Print",
      color_print:"positive",
      //categories
      payment_category_columns: [
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
      payment_categories_data: [
        {
          counter: 1,
          name: "Frozen Yogurt",
          item: "View Payment Items",
          action: "",
        },
        {
          counter: 2,
          name: "Ice cream sandwich",
          item: "View Payment Items",
          action: "",
        },
        {
          counter: 3,
          name: "Eclair",
          item: "View Payment Items",
          action: "",
        },
        {
          counter: 4,
          name: "Cupcake",
          item: "View Payment Items",
          action: "",
        },
        {
          counter: 5,
          name: "Gingerbread",
          item: "View Payment Items",
          action: "",
        },
        {
          counter: 6,
          name: "Jelly bean",
          item: "View Payment Items",
          action: "",
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
          action: "",
        },
        {
          counter: 10,
          name: "KitKat",
          item: "View Payment Items",
          action: "",
        },
      ],
      //items
      payment_item_columns: [
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
          name: "amount",
          align: "center",
          label: "Amount(XAF)",
          field: "amount",
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
      payment_item_data: [
        {
          counter: 1,
          name: "Frozen Yogurt",
          amount:50000,
          action: "",
        },
        {
          counter: 2,
          name: "Ice cream sandwich",
          amount:60000,
          action: "",
        },
        {
          counter: 3,
          name: "Eclair",
          amount:70000,
          action: "",
        },
        {
          counter: 4,
          name: "Cupcake",
          amount:50000,
          action: "",
        },
        {
          counter: 5,
          name: "Gingerbread",
          amount:20000,
          action: "",
        },
        {
          counter: 6,
          name: "Jelly bean",
          amount:50000,
          action: "",
        },
        {
          counter: 7,
          name: "Lollipop",
          amount:50000,
          action: "",
        },
        {
          counter: 8,
          name: "Honeycomb",
          amount:50000,
          action: "",
        },
        {
          counter: 9,
          name: "Donut",
          amount:50000,
          action: "",
        },
        {
          counter: 10,
          name: "KitKat",
          amount:50000,
          action: "",
        },
      ],
      title: "Payment Categories",
      payment_item_title: null,
      label: "Delete",
      on_del_msg_cat: "Are you sure you want to delete this Payment Category?",
      on_del_msg_item: "Are you sure you want to delete this Payment Item?",
      show_payment_items: false,
      statuses: ["COMPLUSORY", "NOT COMPLUSORY"],
      status: null,
    };
  },
  computed: {
    validateFilter() {
      return true;
    },
    getPaymentItem() {
      if (!this.show_payment_items) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.title = "Payment Categories";
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.title = "Harvest ThanksGiven > Harvest Thanksgiven 2022";
      }
      return this.title;
    },
  },
  methods: {
    updatePaymentCategory(data) {
      this.$emit("update-payment-category", data);
    },
    showSearch() {
      this.start_search = !this.start_search;
    },
    showPaymentItems(data) {
      //make request
      this.show_payment_items = !this.show_payment_items;
    },
    updatePaymentItems(data){
      this.$emit("update-payment-item", data);
    }
  },
  components: {
    NotFound,
    CategoryTable,
    ButtonVue
  },
};
</script>

<style lang="scss" scoped>
.search {
  cursor: pointer;
}
</style>
