<template>
  <q-page>
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-lg"
        v-if="getLoadingState && expenditure_category_id != null"
      />
    </div>

    <div>
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
            v-model="expenditure_category_id"
            outlined
            dense
            :options="expenditure_categories"
            label="Search expenditure category..."
            use-input
            input-debounce="0"
            clearable
            @filter="filterCategories"
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
            v-model="payment_item_id"
            outlined
            dense
            :options="filtered_items"
            label="Search Payment activity..."
            use-input
            input-debounce="0"
            clearable
            @filter="filterPaymentItems"
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
            v-model="year"
            outlined
            dense
            :options="years"
            label="Search Year..."
            use-input
            input-debounce="0"
            clearable
            @filter="filterYear"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 flex q-pl-md">
          <div>
            <q-btn
              label="Filter"
              color="primary"
              :disabled="validateFilter"
              no-caps
              :loading="loading_filter"
              icon-right="filter_list"
              @click="filterItems"
            >
            </q-btn>
          </div>
          <q-space />
          <div class="button q-pb-xs">
            <q-btn
              :label="'Print'"
              :loading="loading"
              :color="'positive'"
              :disabled="validateDownload"
              no-caps
              icon-right="print"
              @click="downloadExpenditureItems"
            ></q-btn>
          </div>
        </div>
      </div>
      <!-- table for expenditure items -->
      <div>
        <div class="row q-pt-sm">
          <div class="col-md-12 col-xs-12 col-sm-12">
            <CategoryTable
              :columns="columns"
              :data="getExpenditures"
              :label="label"
              :message="message"
              :title="getExpenditureCategoryName"
              :show_payment_category="false"
              :show_payment_item="false"
              :show_expenditure_category="false"
              :show_expenditure_item="true"
            >
            </CategoryTable>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import { SessionStorage } from "quasar";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import OrganisationMixin from "src/mixins/organisationMixin.vue";
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";
import PaymentItemMixinVue from "src/mixins/PaymentItemMixin.vue";
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";

export default {
  mixins: [
    PaymentItemMixinVue,
    CurrentYearMixinVue,
    OrganisationMixin,
    HelperMixinVue,
    ExpenditureItemDetailMixinVue,
    expenditureItemMixinVue,
  ],
  mounted() {
    this.fetchExpenditureCategories();
    this.getExpenditureCategoriesFromStore();
    if (this.getPaymentActivities.length == 0) {
      this.fetchPaymentActivities();
    }
    this.getPaymentActivitiesFromStore();
    if (this.getSessionsFromState.length == 0) {
      this.getSessions();
    }
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
          align: "left",
          label: "Estimated Amount (XAF)",
          field: "amount",
          sortable: true,
        },
        {
          name: "venue",
          align: "left",
          label: "Venue",
          field: "venue",
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "Date",
          field: "date",
          sortable: true,
        },
        {
          name: "approve",
          align: "left",
          label: "Transaction Status",
          field: "approve",
          sortable: true,
        },
        {
          name: "action",
          label: "Action",
          field: "action",
          sortable: true,
          align: "left",
        },
      ],
      data: [],
      label: "Delete",
      message: "Are you sure you want to delete this Expenditure Item?",
      expenditure_category_id: null,
      start_filter: false,
      filtered_items: [],
      expenditure_items: [],
      expenditure_categories: [],
      years: [],
      year: null,
      payment_item_id: null,
      loading_filter: false,
    };
  },
  computed: {
    validateFilter() {
      return (
        this.expenditure_category_id == null &&
        this.payment_item_id == null &&
        this.year == null
      );
    },

    validateDownload(){
      return this.getExpenditures.length == 0
    },
    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getExpenditures() {
      let data = [];
      if (this.$store.getters.getExpenditures != null) {
        this.$store.getters.getExpenditures.forEach((ele) => {
          data.push({
            counter: this.$store.getters.getExpenditures.indexOf(ele) + 1,
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
            show_state_action: this.checkIfExpendituredetailsStatus(
              ele.expenditure_details
            ),
          });
        });
      }
      return data;
    },

    getExpenditureCategoryName() {
      return this.$store.getters.getExpenditureCategory != null
        ? this.$store.getters.getExpenditureCategory.name
        : "";
    },
  },
  methods: {
    //this check to ensure if an expenditure item can be approve/decline
    //so the negation will be used
    checkIfExpendituredetailsStatus(data) {
      return data.filter((ele) => ele.approve == "PENDING").length == 0;
    },
    fetchExpenditureCategories() {
      let organisationId = this.getOrganisationId;
      let payload = {
        url: `/api/protected/organisations/${organisationId}/expenditure-categories`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch payment categories",
        has_commit: true,
        show_feedback: false,
        show_spinner: true,
        commit: "SET_EXPENDITURE_CATEGORIES",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    showExpenditureItem(data) {
      SessionStorage.set("intermediate_tab", "Expenditure Items");

      SessionStorage.set("has_intermediate_tab", true);

      this.$emit("show-expenditure-items", data);
    },


    getExpenditureCategoriesFromStore() {
      this.expenditure_categories = [];
      this.$store.getters.getExpenditureCategories.forEach((element) => {
        this.expenditure_categories.push({
          label: element.name,
          value: element.id,
        });
      });

      return this.expenditure_categories;
    },

    filterCategories(val, update, abort) {
      if (val < 2) {
        abort();
        return;
      }

      update(() => {
        this.expenditure_categories =
          this.getExpenditureCategoriesFromStore().filter((item) =>
            item.label.toLowerCase().includes(val.toLowerCase())
          );
        return this.expenditure_categories;
      });
    },

    getPaymentActivitiesFromStore() {
      this.filtered_items = [];
      this.$store.getters.getPaymentActivities.forEach((element) => {
        this.filtered_items.push({
          label: element.name,
          value: element.id,
        });
      });

      return this.filtered_items;
    },

    filterPaymentItems(val, update, abort) {
      if (val < 2) {
        abort();
        return;
      }

      update(() => {
        this.filtered_items = this.getPaymentActivitiesFromStore().filter(
          (item) => item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.filtered_items;
      });
    },

    filterYear(val, update, abort) {
      if (val < 2) {
        abort();
        return;
      }

      update(() => {
        this.years = this.getSessionsFromState.filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.years;
      });
    },
    filterItems() {
      let selected_expenditure_cat =
        this.expenditure_category_id != null
          ? this.expenditure_category_id.value
          : "";
      let selected_payment_item =
        this.payment_item_id != null ? this.payment_item_id.value : "";
      let session = this.year != null ? this.year.value : "";
      let payload = {
        status: "none",
        url: `/api/protected/expenditure_categories/expenditure_items/filter?expenditure_category_id=${selected_expenditure_cat}&payment_item_id=${selected_payment_item}&session_id=${session}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_EXPENDITURES",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.loading_filter = true;
      this.$store.dispatch("getRequest", payload).then(() => {
        this.loading_filter = false;
      });
    },

    downloadExpenditureItems() {
      let selected_expenditure_cat =
        this.expenditure_category_id != null
          ? this.expenditure_category_id.value
          : "";
      let selected_payment_item =
        this.payment_item_id != null ? this.payment_item_id.value : "";
      let session = this.year != null ? this.year.value : "";
      let  url =`/api/protected/expenditure_categories/expenditure_items/download?expenditure_category_id=${selected_expenditure_cat}&payment_item_id=${selected_payment_item}&session_id=${session}&status=`;
      let file_name = "Expenditure_Items.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },
  },
  components: {
    CategoryTable,
  },
};
</script>

<style lang="scss" scoped>
.search {
  cursor: pointer;
}
</style>
