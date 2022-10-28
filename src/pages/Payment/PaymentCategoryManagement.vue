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
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
        <q-select
          v-model="year"
          outlined
          dense
          :options="years"
          label="Select year"
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
          :show_payment_category="true"
          :show_payment_item="false"
          :show_expenditure_category="false"
          :show_expenditure_item="false"
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
import { SessionStorage } from 'quasar';
export default {
  data() {
    return {
      not_found_msg:
        "Ooops!! No Payment Categories found. click the add button to add Payment Categories.",
      payment_categories: [{ id: "1" }],
      year: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
      search: null,
      label_fetch: "Filter",
      color: "primary",
      no_caps: true,
      loading: false,
      label_download:"Print",
      color_print:"positive",
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
        },
        {
          name: "action",
          label: "Action",
          field: "action",
        },
      ],
      data: [
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
      label: "Delete",
      message: "Are you sure you want to delete this Payment Category?",
      name:"Harvest ThanksGiven"
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
    showPaymentItems(data) {
      //make request
      SessionStorage.set("intermediate_tab", "Payment Items")
      SessionStorage.set("has_intermediate_tab", true)
      this.$emit("show-payment-items", data);
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
