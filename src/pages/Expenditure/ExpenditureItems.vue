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
      v-if="getExpenditureItems.length == 0 && !getLoadingState"
    ></NotFound>

    <div v-if="getExpenditureItems.length > 0 && !getLoadingState">
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
            v-model="payment_item_id"
            outlined
            dense
            :options="getPaymentActivities"
            label="Select payment activity"
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
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-md-6 col-lg-6 col-xs-12 col-sm-12 flex q-pl-md">
          <div>
            <q-btn
              label="Filter"
              color="primary"
              :disabled="validateFilter"
              no-caps
              icon-right="filter_list"
              @click="filterItems"
            >
            </q-btn>
          </div>
          <q-space />
          <div class="button q-pb-xs">
            <q-btn
              label="Print"
              :loading="loading"
              color="positive"
              :disabled="false"
              no-caps
              icon-right="print"
              @click="downloadExpenditureItems"

            ></q-btn>
          </div>
        </div>
      </div>


      <!-- table for categories -->
      <div>
        <div class="row q-pt-sm">
          <div class="col-md-12 col-xs-12 col-sm-12" v-show="!start_filter">
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
              @edit-expenditure-item="editExpenditureItem"
              @view-expenditure-item="viewExpenditureItem"
              @show-expenditure-item-details="showExpenditureItemDetails"
            >
            </CategoryTable>
          </div>

          <!-- table for filtered items -->
          <div class="col-md-12 col-xs-12 col-sm-12" v-show="start_filter">
            <CategoryTable
              :columns="columns"
              :data="filtered_items"
              :label="label"
              :message="message"
              :title="getTableTitle"
              :show_payment_category="false"
              :show_payment_item="false"
              :show_expenditure_category="false"
              :show_expenditure_item_name="true"
              :show_expenditure_item="true"
              @edit-expenditure-item="editExpenditureItem"
              @view-expenditure-item="viewExpenditureItem"
              @show-expenditure-item-details="showExpenditureItemDetails"
            >
            </CategoryTable>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import NotFound from "src/components/NotFound.vue";
import CategoryTable from "src/components/CategoryTable.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";

export default {
  mixins: [HelperMixinVue, ExpenditureItemDetailMixinVue],
  mounted() {
    this.getExpenditureItemsFromState();
    this.fetchPaymentActivities();
  },
  data() {
    return {
      search: null,
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
      statuses: ["PENDING", "APPROVED", "DECLINED", "ALL"],
      status: "",
      start_filter: false,
      filtered_items: [],
      payment_item_id:null
    };
  },
  computed: {
    validateFilter (){
      return this.payment_item_id == null;
    },
    getExpenditureItems() {
      let items = [];
      items = this.getExpenditureItemsFromState();
      return items;
    },

    getExpenditureCategoryName() {
      return this.$store.getters.getCurrentExpenditureCategory.name;
    },

    getTableTitle(){
      let title = ""
      if(this.payment_item_id != null){
        title = `Expenditures for ${this.payment_item_id.label}`
      }
      return title;
    },

    getNotFoundMsgForPaymentItems() {
      let title = "";
      if(this.$store.getters.getCurrentExpenditureCategory != null){
        title = `Ooops!! No Expenditure Items found for this Category [${this.$store.getters.getCurrentExpenditureCategory.name}]. Click the add button to add Expenditure Items.`;
      }
      return title
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getPaymentActivities() {
      let data = [];
      this.$store.getters.getPaymentActivities.forEach((ele) => {
        data.push({
          label: ele.name,
          value: ele.id,
          amount: ele.amount,
        });
      });
      return data;
    },
  },
  methods: {
    editExpenditureItem(data) {
      this.$store.dispatch("setUpdatedExpenditureItem", data.data);

      this.$store.dispatch("setEditState", true);

      this.$emit("edit-expenditure-item", data);
    },

    viewExpenditureItem(data) {
      console.log(data);
      this.$store.dispatch("setUpdatedExpenditureItem", data.data);

      this.$emit("view-expenditure-item", data);
    },

    showExpenditureItemDetails(data) {
      this.$store.dispatch("setCurrentExpenditureItem", {
        id: data.expenditure_item.id,
        name: data.expenditure_item.name,
      });

      this.getExpenditureDetailsByItemId(data.expenditure_item.id);

      const intermediate_tabs = Array.from(
        this.$store.getters.getIntermediateTabs
      );

      intermediate_tabs.push({
        name: "Expenditure Item Details",
        has_intermediate_tab: true,
      });

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);

      this.$emit("show-expenditure-item-details", data);
    },

    getExpenditureItemsFromState() {
      let data = [];
      this.$store.getters.getExpenditureItems.forEach((ele) => {
        data.push({
          counter: this.$store.getters.getExpenditureItems.indexOf(ele) + 1,
          name: ele.name,
          id: ele.id,
          amount: ele.amount,
          venue: ele.venue,
          date: ele.date,
          comment: ele.comment,
          approve: ele.approve,
          expenditure_category: ele.expenditure_category,
          created_at: ele.created_at,
          updated_at: ele.updated_at,
          updated_by: ele.updated_by,
          expenditure_details: ele.expenditure_details,
          total_amount_given: ele.total_amount_given,
          total_amount_spent: ele.total_amount_spent,
          total_balance: ele.total_balance,
          type: "EXPENDITURE_ITEMS",
          payment_item:ele.payment_item
        });
      });

      return data;
    },

    downloadExpenditureItems() {
      let expenditure_category_id =
        this.$store.getters.getCurrentExpenditureCategory.id;
      let payment_item_id = this.payment_item_id != null ? this.payment_item_id.value : "";
      let url = `/api/protected/expenditure-categories/expenditure-items/download?expenditure_category_id=${expenditure_category_id}&status=${this.status}&payment_item_id=${payment_item_id}`;
      let file_name = "Expenditure_Items.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    filterItems() {
      this.filtered_items = [];

      let expenditure_category =
        this.$store.getters.getCurrentExpenditureCategory;

      this.$router.push({
        path: `/dashboard/expenditure-categories/${expenditure_category.id}/items`,
        query: { payment_item_id: this.payment_item_id.label, status: this.status },
      });

      let payload = {
        url: `/api/protected/expenditure-items/payment-items/${this.payment_item_id.value}?status=${this.status}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch payment categories",
        has_commit: false,
        show_feedback: false,
        show_spinner: true,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.start_filter = true;
        if (res != undefined) {
          res.data.forEach((ele) => {
            this.filtered_items.push({
              counter: res.data.indexOf(ele) + 1,
              name: ele.name,
              id: ele.id,
              amount: ele.amount,
              venue: ele.venue,
              date: ele.date,
              comment: ele.comment,
              approve: ele.approve,
              expenditure_category_id: ele.expenditure_category_id,
              created_at: ele.created_at,
              updated_at: ele.updated_at,
              updated_by: ele.updated_by,
              expenditure_details: ele.expenditure_details,
              total_amount_given: ele.total_amount_given,
              total_amount_spent: ele.total_amount_spent,
              total_balance: ele.total_balance,
              type: "EXPENDITURE_ITEMS",
            });
          });
        }
      });

      return this.filtered_items;
    },

    fetchPaymentActivities() {
      let payload = {
        status: "none",
        url: `/api/protected/payment-items`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_PAYMENT_ACTIVITIES",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
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
