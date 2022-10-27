<template>
  <q-page>
    <NotFound
      :message="not_found_msg"
      v-if="payment_items.length == 0"
    ></NotFound>
    <!-- header for filter categories -->
    <div
      class="row q-ml-xs q-pt-xs"
      v-if="payment_items.length > 0"
      :class="$q.screen.lg ? 'q-pa-sm' : ''"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
    >
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
        <q-select
          v-model="status"
          outlined
          dense
          :options="statuses"
          label="Select Status"
        />
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
          :columns="columns"
          :data="data"
          :label="label"
          :message="message"
          :name="name"
          @show-payment-items="showPaymentItems"
          @update-payment-category="updatePaymentCategory"
          :show_payment_category="false"
          :show_payment_item="true"
          @update-payment-item="updatePaymentItem"
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
import { SessionStorage } from "quasar";
export default {
  data() {
    return {
      not_found_msg:
        "Ooops!! No Payment Items found for this Payment Category. click the add button to add Payment Items.",
      payment_items: [{"id":1}],
      search: null,
      label_fetch: "Filter",
      color: "primary",
      no_caps: true,
      loading: false,
      label_download: "Print",
      color_print: "positive",
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
      data: [
        {
          counter: 1,
          name: "Frozen Yogurt",
          amount: 50000,
          action: "",
        },
        {
          counter: 2,
          name: "Ice cream sandwich",
          amount: 60000,
          action: "",
        },
        {
          counter: 3,
          name: "Eclair",
          amount: 70000,
          action: "",
        },
        {
          counter: 4,
          name: "Cupcake",
          amount: 50000,
          action: "",
        },
        {
          counter: 5,
          name: "Gingerbread",
          amount: 20000,
          action: "",
        },
        {
          counter: 6,
          name: "Jelly bean",
          amount: 50000,
          action: "",
        },
        {
          counter: 7,
          name: "Lollipop",
          amount: 50000,
          action: "",
        },
        {
          counter: 8,
          name: "Honeycomb",
          amount: 50000,
          action: "",
        },
        {
          counter: 9,
          name: "Donut",
          amount: 50000,
          action: "",
        },
        {
          counter: 10,
          name: "KitKat",
          amount: 50000,
          action: "",
        },
      ],
      label: "Delete",
      message: "Are you sure you want to delete this Payment Item?",
      statuses: ["COMPLUSORY", "NOT COMPLUSORY"],
      status: null,
      name: "Harvest of Joyful Celebration 2022",
    };
  },
  computed: {
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
      SessionStorage.set("intermediate_tab", "Payment Items");
      SessionStorage.set("has_intermediate_tab", true);
      this.$emit("show-payment-items", data);
    },
    updatePaymentItems(data) {
      this.$emit("update-payment-item", data);
    },
    updatePaymentItem(data){
      this.$emit("update-payment-item", data);
    }
  },
  components: {
    NotFound,
    CategoryTable,
    ButtonVue,
  },
};
</script>

<style lang="scss" scoped>
.search {
  cursor: pointer;
}
</style>
