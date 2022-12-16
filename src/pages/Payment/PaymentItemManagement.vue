<template>
  <q-page>
    <NotFound :message="getNotFoundMsgForPaymentItems" v-if="getPaymentItems.length == 0"></NotFound>
    <!-- header for filter categories -->
    <div class="row q-ml-xs q-pt-xs" v-if="getPaymentItems.length > 0" :class="$q.screen.lg ? 'q-pa-sm' : ''" :style="
      $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
    ">
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
        <q-select v-model="status" outlined dense :options="statuses" label="Select Status" />
      </div>
      <q-space />
      <div class="button q-pb-xs">
        <ButtonVue :label="label_download" :loading="loading" :color="color_print" :disabled="false" :no_caps="no_caps"
          icon_right="print"></ButtonVue>
      </div>
    </div>
    <!-- table for categories -->
    <div class="row q-pt-sm" v-show="getPaymentItems.length > 0">
      <div class="col-md-12 col-xs-12 col-sm-12">
        <CategoryTable :columns="columns" :data="getPaymentItems" :label="label" :message="message" :name="name"
          :title="getPaymentCategoryName" @show-payment-items="showPaymentItems"
          @update-payment-category="updatePaymentCategory" :show_payment_category="false" :show_payment_item="true"
          @update-payment-item="updatePaymentItems" :show_expenditure_category="false" :show_expenditure_item="false">
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
  mounted() {
    this.getPaymentItemsFromState()
  },
  data() {
    return {
      not_found_msg:"",
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
      ],
      label: "Delete",
      message: "Are you sure you want to delete this Payment Item?",
      statuses: ["COMPLUSORY", "NOT COMPLUSORY"],
      status: null,
      name: "Harvest of Joyful Celebration 2022",
    };
  },
  computed: {
    getPaymentItems() {
      let items = this.getPaymentItemsFromState();
      return items;
    },

    getPaymentCategoryName() {
      return this.$store.getters.getCurrentPaymentCategory.name
    },

    getNotFoundMsgForPaymentItems() {
      return `Ooops!! No Payment Items found for Category ${this.$store.getters.getCurrentPaymentCategory.name}. Click the add button to add Payment Items.`;
    }

  },

  methods: {
    updatePaymentCategory(data) {
      this.$emit("update-payment-category", data);
    },


    showSearch() {
      this.start_search = !this.start_search;
    },


    showPaymentItems(data) {
      SessionStorage.set("intermediate_tab", "Payment Items");

      SessionStorage.set("has_intermediate_tab", true);

      this.$emit("show-payment-items", data);
    },
    updatePaymentItems(data) {
      this.$store.dispatch("setUpdatedPaymentItem", data.data);

      this.$emit("update-payment-item", data);
    },

    getPaymentItemsFromState() {
      let items = [];
      this.$store.getters.getPaymentItems.data?.forEach((ele) => {
          items.push({
            counter: this.$store.getters.getPaymentItems.data?.indexOf(ele) + 1,
            name: ele.name,
            amount: ele.amount,
            id: ele.id,
            complusory: ele.complusory,
            payment_category_id: ele.payment_category_id,
            description: ele.description,
            payment_category_name: ele.payment_category_name,
            type: 'PAYMENT_ITEMS'
          })
        })
      return items;
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
