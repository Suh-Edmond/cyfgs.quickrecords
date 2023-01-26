<template>
  <q-page>
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios color="primary" size="2em" class="q-mb-lg" v-if="getLoadingState" />
    </div>

    <NotFound :message="getNotFoundMsg" v-if="getExpenditureItemDetails.length == 0 && !getLoadingState"></NotFound>

    <div v-if="getExpenditureItemDetails.length > 0 && !getLoadingState">
      <!-- header for filter categories -->
      <div class="row q-ml-xs q-pt-xs" :class="$q.screen.lg ? 'q-pa-sm' : ''" :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      ">
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <q-select v-model="status" outlined dense :options="statuses" label="Select Status" @input="filterItems" />
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn :label="label_download" :loading="loading" :color="color_print" :disabled="false" no-caps
            icon-right="print" @click="downloadExpenditureItemDetails"></q-btn>
        </div>
      </div>
      <!-- table for categories -->
      <div>
        <div class="row q-pt-sm">
          <div class="col-md-12 col-xs-12 col-sm-12" v-show="!start_filter">
            <CategoryTable :columns="columns" :data="getExpenditureItemDetails" :label="label" :message="message"
              :title="getExpenditureItemName" :show_payment_category="false" :show_payment_item="false"
              :show_expenditure_category="false" :show_expenditure_item="false" :show_expenditure_item_detail="true"
              @edit-expenditure-item-detail="editExpenditureItemDetail">
            </CategoryTable>
          </div>

          <!-- table for filtered results -->
          <div class="col-md-12 col-xs-12 col-sm-12" v-show="start_filter">
            <CategoryTable :columns="columns" :data="filtered_items" :label="label" :message="message"
              :title="getExpenditureItemName" :show_payment_category="false" :show_payment_item="false"
              :show_expenditure_category="false" :show_expenditure_item="false" :show_expenditure_item_detail="true"
              @edit-expenditure-item-detail="editExpenditureItemDetail">
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

export default {
  mixins: [HelperMixinVue],
  data() {
    return {
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
          name: "amount_given",
          align: "center",
          label: "Amount Given (XAF)",
          field: "amount_given",
          sortable: true,
        },
        {
          name: "amount_spent",
          align: "center",
          label: "Amount Spent (XAF)",
          field: "amount_spent",
          sortable: true,
        },
        {
          name: "balance",
          align: "center",
          label: "Balance (XAF)",
          field: "balance",
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
      label: "Delete",
      message: "Are you sure you want to delete this Expenditure Item Detail?",
      statuses: [ "PENDING","APPROVED", "DECLINED", "ALL"],
      status: null,
      filtered_items: [],
    };
  },
  computed: {
    getExpenditureItemDetails() {
      let data = [];
      if (this.$store.getters.getExpenditureItemDetails != null) {
        this.$store.getters.getExpenditureItemDetails.data.forEach((ele) => {
          data.push({
            counter:
              this.$store.getters.getExpenditureItemDetails.data.indexOf(ele) + 1,
            name: ele.name,
            amount_given: ele.amount_given,
            amount_spent: ele.amount_spent,
            balance: ele.balance,
            type: "EXPENDITURE_DETAILS",
            id: ele.id,
            expenditure_item_id: ele.expenditure_item_id,
            comment: ele.comment,
            approve: ele.approve,
            created_at: ele.created_at,
            updated_at: ele.updated_at,
            updated_by: ele.updated_by,
            total_item_amount:
              this.$store.getters.getExpenditureItemDetails.total_item_amount,
            total_amount_given:
              this.$store.getters.getExpenditureItemDetails.total_amount_given,
            total_amount_spent:
              this.$store.getters.getExpenditureItemDetails.total_amount_spent,
            total_balance:
              this.$store.getters.getExpenditureItemDetails.total_balance,
          });
        });
      }
      return data;
    },

    getExpenditureItemName() {
      return this.$store.getters.getCurrentExpenditureItem.name;
    },

    getNotFoundMsg() {
      return `Ooops!! No Details has been recorded for this Expenditure Item [${this.getExpenditureItemName}]. Click the add button to add Expenditure Item Details.`;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },
  methods: {
    editExpenditureItemDetail(data) {
      this.$store.dispatch("setUpdatedExpenditureItemDetail", data.data);

      this.$store.dispatch("setEditState", true);

      this.$emit("edit-expenditure-item-detail", data);
    },

    downloadExpenditureItemDetails() {
      let expenditure_item_id =
        this.$store.getters.getCurrentExpenditureItem.id;
      let url = `/api/protected/expenditure-item-details/download?expenditure_item_id=${expenditure_item_id}&status=${this.status}`;
      let file_name = "Expenditure_Item_Details.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    filterItems() {
      let expenditure_category = this.$store.getters.getCurrentExpenditureCategory;
      let expenditure_item = this.$store.getters.getCurrentExpenditureItem;
      this.filtered_items = [];

      this.$router.push({
        path: `/dashboard/expenditure-categories/${expenditure_category.id}/items/${expenditure_item.id}/details`,
        query: {status: this.status },
      });

      let payload = {
        url: this.setFilterItemActionUrl(this.status, expenditure_item.id),
        msg: "none",
        color: "default",
        status: "none",
        error_msg:
          "An Error occurred! Could not fetch expenditure item details",
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
          res.data.data.forEach((ele) => {
            this.filtered_items.push({
              counter: res.data.data.indexOf(ele) + 1,
              name: ele.name,
              amount_given: ele.amount_given,
              amount_spent: ele.amount_spent,
              balance: ele.balance,
              type: "EXPENDITURE_DETAILS",
              id: ele.id,
              expenditure_item_id: ele.expenditure_item_id,
              comment: ele.comment,
              approve: ele.approve,
              created_at: ele.created_at,
              updated_at: ele.updated_at,
              updated_by: ele.updated_by,
              total_item_amount: res.data.data.total_item_amount,
              total_amount_given: res.data.data.total_amount_given,
              total_amount_spent: res.data.data.total_amount_spent,
              total_balance: res.data.data.total_balance,
            });
          });
        }
      });

      return this.filtered_items;
    },

    setFilterItemActionUrl(status, expenditure_item_id) {
      let url = "";
      if (status != "") {
        url = `/api/protected/expenditure-details?expenditure_item_id=${expenditure_item_id}&status=${this.status}`;
      } else {
        url = `/api/protected/expenditure-items/${expenditure_item_id}/details`;
      }
      return url;
    },
  },
  components: {
    NotFound,
    CategoryTable,
  },
};
</script>

<style lang="scss" scoped>

</style>
