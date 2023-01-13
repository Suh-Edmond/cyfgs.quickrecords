<template>
  <q-page>
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-lg"
        v-if="getLoadingState"
      />
    </div>

    <NotFound
      :message="getNotFoundMsgForPaymentItems"
      v-if="getPaymentItems.length == 0 && !getLoadingState"
    ></NotFound>

    <div v-if="getPaymentItems.length > 0 && !getLoadingState">
      <!-- header for filter categories -->
      <div
        class="row q-ml-xs q-pt-xs"
        :class="$q.screen.lg ? 'q-pa-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <q-select
            v-model="is_complusory"
            outlined
            dense
            :options="statuses"
            label="Select Status"
            @input="filterPaymentItems"
          />
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn
            :label="label_download"
            :loading="loading"
            :color="color_print"
            :disabled="false"
            no-caps
            icon-right="print"
            @click="downloadItems"
          ></q-btn>
        </div>
      </div>
      <!-- table for categories -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12" v-show="!start_filter">
          <CategoryTable
            :columns="columns"
            :data="getPaymentItems"
            :label="label"
            :message="message"
            :title="getPaymentCategoryName"
            @show-payment-items="showPaymentItems"
            @update-payment-category="updatePaymentCategory"
            :show_payment_category="false"
            :show_payment_item="true"
            @update-payment-item="updatePaymentItems"
            :show_expenditure_category="false"
            :show_expenditure_item="false"
          >
          </CategoryTable>
        </div>

        <div class="col-md-12 col-xs-12 col-sm-12" v-show="start_filter">
          <CategoryTable
            :columns="columns"
            :data="filteredPaymentItems"
            :label="label"
            :message="message"
            :title="getPaymentCategoryName"
            @show-payment-items="showPaymentItems"
            @update-payment-category="updatePaymentCategory"
            :show_payment_category="false"
            :show_payment_item="true"
            @update-payment-item="updatePaymentItems"
            :show_expenditure_category="false"
            :show_expenditure_item="false"
          >
          </CategoryTable>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import NotFound from "src/components/NotFound.vue";
import CategoryTable from "src/components/CategoryTable.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";

export default {
  mixins: [HelperMixinVue],
  mounted() {
    this.getPaymentItemsFromState();
  },
  data() {
    return {
      not_found_msg: "",
      search: null,
      start_filter: false,
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
      data: [],
      label: "Delete",
      message: "Are you sure you want to delete this Payment Item?",
      statuses: ["COMPLUSORY", "NOT COMPLUSORY"],
      is_complusory: null,
      filteredPaymentItems: [],
    };
  },
  computed: {
    getPaymentItems() {
      let items = this.getPaymentItemsFromState();
      return items;
    },

    getPaymentCategoryName() {
      return this.$store.getters.getCurrentPaymentCategory.name;
    },

    getNotFoundMsgForPaymentItems() {
      return `Ooops!! No Payment Items found for Category [${this.$store.getters.getCurrentPaymentCategory.name}]. Click the add button to add Payment Items.`;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },

  methods: {
    updatePaymentCategory(data) {
      this.$emit("update-payment-category", data);
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
      if (this.$store.getters.getPaymentItems) {
        this.$store.getters.getPaymentItems.data.forEach((ele) => {
          items.push({
            counter: this.$store.getters.getPaymentItems.data.indexOf(ele) + 1,
            name: ele.name,
            amount: ele.amount,
            id: ele.id,
            complusory: ele.complusory,
            payment_category_id: ele.payment_category_id,
            description: ele.description,
            payment_category_name: ele.payment_category_name,
            type: "PAYMENT_ITEMS",
          });
        });
      }
      return items;
    },

    downloadItems() {
      let id = this.$store.getters.getCurrentPaymentCategory.id;
      let url = `/api/protected/download-payment-items?payment_category_id=${id}`;
      let file_name = "Payment_Items.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    filterPaymentItems() {
      let id = this.$store.getters.getCurrentPaymentCategory.id;
      this.$router.push({
        path: `/dashboard/payment-categories/${id}/items`,
        query: { status: this.is_complusory },
      });

      this.filteredPaymentItems = [];
      let is_complusory = this.is_complusory == "COMPLUSORY" ? 1 : 0; //1 means true and 0 means false
      let payload = {
        url: `/api/protected/filter-payment-items?payment_category_id=${id}&complusory=${is_complusory}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch payment categories",
        has_commit: false,
        show_feedback: false,
        show_spinner:true,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.start_filter = true;
        res.data.data.forEach((ele) => {
          this.filteredPaymentItems.push({
            counter: res.data.data.indexOf(ele) + 1,
            name: ele.name,
            amount: ele.amount,
            id: ele.id,
            complusory: ele.complusory,
            payment_category_id: ele.payment_category_id,
            description: ele.description,
            payment_category_name: ele.payment_category_name,
            type: "PAYMENT_ITEMS",
          });
        });
      });
    },
  },
  components: {
    NotFound,
    CategoryTable,
  },
};
</script>

<style lang="scss" scoped>
.search {
  cursor: pointer;
}
</style>
