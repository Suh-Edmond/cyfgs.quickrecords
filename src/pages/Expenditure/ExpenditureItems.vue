<template>
  <q-page>
    <NotFound
      :message="getNotFoundMsgForPaymentItems"
      v-if="getExpenditureItems.length == 0"
    ></NotFound>
    <!-- header for filter categories -->
    <div
      class="row q-ml-xs q-pt-xs"
      v-if="getExpenditureItems.length > 0"
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
        <q-btn
          :label="label_download"
          :loading="loading"
          :color="color_print"
          :disabled="false"
          no-caps
          icon-right="print"
        ></q-btn>
      </div>
    </div>
    <!-- table for categories -->
    <div v-if="getExpenditureItems.length > 0">
      <div class="row q-pt-sm">
      <div class="col-md-12 col-xs-12 col-sm-12">
        <CategoryTable
          :columns="columns"
          :data="getExpenditureItems"
          :label="label"
          :message="message"
          :title="getExpenditureCategoryName"
          :show_payment_category="false"
          :show_payment_item="false"
          :show_expenditure_category="false"
          :show_expenditure_item="true"
          @show-expenditure-items="showExpenditureItem"
          @edit-expenditure-item="editExpenditureItem"
          @show-expenditure-item-details="showExpenditureItemDetails"
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
import { SessionStorage } from "quasar";

export default {
  mounted() {
    this.getExpenditureItemsFromState();
  },
  data() {
    return {
      search: null,
      label_fetch: "Filter",
      color: "primary",
      no_caps: true,
      loading: false,
      label_download: "Print",
      color_print: "positive",
      title:"Harvest ThanksGiven",// this title should be the category name
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
          label: "Amount (XAF)",
          field: "amount",
          sortable: true,
        },
        {
          name: "venue",
          align: "center",
          label: "Venue",
          field: "venue",
          sortable: true,
        },
        {
          name: "date",
          align: "center",
          label: "Date",
          field: "date",
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
      message: "Are you sure you want to delete this Expenditure Item?",
      statuses: ["APPROVED", "UNAPPROVED"],
      status: null,
    };
  },
  computed: {
    getExpenditureItems() {
      let items = [];
      items = this.getExpenditureItemsFromState();
      return items;
    },

    getExpenditureCategoryName() {
      return this.$store.getters.getCurrentExpenditureCategory.name;
    },

    getNotFoundMsgForPaymentItems() {
      return `Ooops!! No Expenditure Items found for this Category [${this.$store.getters.getCurrentExpenditureCategory?.name}]. Click the add button to add Expenditure Items.`;
    },
  },
  methods: {
    showExpenditureItem(data){
      SessionStorage.set("intermediate_tab", "Expenditure Items");

      SessionStorage.set("has_intermediate_tab", true);

      this.$emit("show-expenditure-items", data);
    },

    editExpenditureItem(data) {
      this.$emit("edit-expenditure-item", data)
    },

    showExpenditureItemDetails(data){
      SessionStorage.set("intermediate_tab2", "Expenditure Item Details");

      SessionStorage.set("has_intermediate_tab2", true);

      this.$emit("show-expenditure-item-details", data);
    },

    getExpenditureItemsFromState() {
      let data = []
      this.$store.getters.getExpenditureItems?.forEach((ele) => {
        data.push({
          counter: this.$store.getters.getExpenditureItems?.indexOf(ele) + 1,
          name: ele.name,
          id: ele.id,
          amount:ele.amount,
          venue:ele.venue,
          date: ele.date,
          comment:ele.comment,
          approve:ele.approve,
          expenditure_category_id: ele.expenditure_category_id,
          created_at:ele.created_at,
          updated_at:ele.updated_at,
          updated_by:ele.updated_by,
          expenditure_details:ele.expenditure_details,
          total_amount_given:ele.total_amount_given,
          total_amount_spent:ele.total_amount_spent,
          total_balance:ele.total_balance,
          type:"EXPENDITURE_ITEMS"
        })
      })

      return data;
    }
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
