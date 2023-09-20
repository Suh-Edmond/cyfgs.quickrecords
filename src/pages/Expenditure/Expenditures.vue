<template>
  <q-page>
    <div>
      <!-- header for filter categories -->
      <div class="row q-ml-xs q-pt-xs" :class="$q.screen.lg ? 'q-pa-sm' : ''" :style="$q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        ">
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <q-select v-model="expenditure_category_id" outlined dense :options="expenditure_categories"
            :label="$t('app.searchExpenditureCategory')" use-input input-debounce="0" clearable @filter="filterCategories"
            @input="stopSearch">
            <template v-slot:append v-if="start_filtering_expenditure_category">
              <q-spinner color="primary" size="1.2em" :thickness="3" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("app.noResults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-pl-md">
          <q-select v-model="payment_item_id" outlined dense :options="filtered_items"
            :label="$t('app.searchPaymentItem')" use-input input-debounce="0" clearable @filter="filterPaymentItems"
            @input="stopSearch">
            <template v-slot:append v-if="start_filtering_payment_item">
              <q-spinner color="primary" size="1.2em" :thickness="3" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">{{ $t("app.noResults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-pl-md">
          <q-select v-model="year" outlined dense :options="years" :label="$t('app.searchYear')" use-input
            input-debounce="0" clearable @filter="filterYear" @input="stopSearch">
            <template v-slot:append v-if="start_filtering_year">
              <q-spinner color="primary" size="1.2em" :thickness="3" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("app.noResults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 flex q-pl-md">
          <div>
            <q-btn :label="$t('app.filter')" color="primary" :disabled="validateFilter" no-caps :loading="loading_filter"
              icon-right="filter_list" @click="filterExpenditureItems(1, 7)">
            </q-btn>
          </div>
          <q-space />
          <div class="button q-pb-xs">
            <q-btn :label="$t('app.print')" :loading="loading" :color="'positive'" :disabled="validateDownload" no-caps
              icon-right="print" @click="downloadExpenditureItems"></q-btn>
          </div>
        </div>
      </div>
      <!-- table for expenditure items -->
      <div>
        <div class="row q-pt-sm">
          <div class="col-md-12 col-xs-12 col-sm-12">
            <CategoryTable :columns="columns" :data="getExpenditures" :label="label" :message="message"
              :title="table_title" :show_payment_category="false" :show_payment_item="false"
              :show_expenditure_category="false" :show_expenditure_item="true" :pagination="getPagination"
              :table_loading="getLoadingState" @onRequest="onRequest">
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
    this.fetchPaymentActivities();
    this.getPaymentActivitiesFromStore();
    this.getSessions();
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
      label: this.$t("app.delete"),
      message: this.$t("app.deleteExpenditureItemWarningMsg"),
      expenditure_category_id: null,
      start_filter: false,
      filtered_items: [],
      expenditure_items: [],
      expenditure_categories: [],
      years: [],
      year: null,
      payment_item_id: null,
      loading_filter: false,
      start_filtering_expenditure_category: false,
      start_filtering_payment_item: false,
      start_filtering_year: false,
      table_title: "Expenditures",
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 7,
        rowsNumber: 0,
      },
      table_loader: false,
    };
  },
  computed: {
    validateFilter() {
      return (
        this.expenditure_category_id === null || this.expenditure_category_id === ""
      );
    },

    validateDownload() {
      return this.getExpenditures.length == 0;
    },

    getExpenditures() {
      let data = [];
      if (this.$store.getters.getExpenditures != null) {
        this.$store.getters.getExpenditures.data.forEach((ele) => {
          data.push({
            counter: this.$store.getters.getExpenditures.data.indexOf(ele) + 1,
            name: ele.name,
            id: ele.id,
            amount: ele.amount,
            venue: ele.venue,
            date: ele.date,
            comment: ele.comment,
            approve: ele.approve,
            expenditure_category_id: ele.expenditure_category,
            created_at: ele.created_at,
            updated_at: ele.updated_at,
            updated_by: ele.updated_by,
            expenditure_details: ele.expenditure_details,
            total_amount_given: ele.total_amount_given,
            total_amount_spent: ele.total_amount_spent,
            total_balance: ele.total_balance,
            type: "EXPENDITURE_ITEMS",
            has_no_pending_details: ele.has_no_pending_details,
          });
        });
      }
      return data;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getPagination() {
      let paginate_object = {
        sortBy: this.$store.getters.getPagination.sortBy,
        descending: this.$store.getters.getPagination.descending,
        page: this.$store.getters.getPagination.page,
        rowsPerPage: this.$store.getters.getPagination.rowsPerPage,
        rowsNumber: this.$store.getters.getPagination.rowsNumber,
      };

      return paginate_object;
    },
  },
  methods: {
    fetchExpenditureCategories() {
      let organisationId = this.getOrganisationId;
      let payload = {
        url: `/api/protected/expenditure-categories-all?organisation_id=${organisationId}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.expenditureErrorMsg"),
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
      this.$store.dispatch("getRequest", payload).then(() => {

      }).finally(() => {
      });
    },

    showExpenditureItem(data) {
      SessionStorage.set(
        "intermediate_tab",
        this.$t("app.expenditureItemLabel")
      );

      SessionStorage.set("has_intermediate_tab", true);

      this.$emit("show-expenditure-items", data);
    },

    getExpenditureCategoriesFromStore() {
      this.expenditure_categories = [];
      if (this.$store.getters.getExpenditureCategories !== null) {
        this.$store.getters.getExpenditureCategories.forEach((element) => {
          this.expenditure_categories.push({
            label: element.name,
            value: element.id,
          });
        });
      }

      return this.expenditure_categories;
    },

    filterCategories(val, update, abort) {
      if (val < 2) {
        abort();
        this.start_filtering_expenditure_category = false;
        return;
      }

      update(() => {
        this.start_filtering_expenditure_category = true;
        this.expenditure_categories =
          this.getExpenditureCategoriesFromStore().filter((item) =>
            item.label.toLowerCase().includes(val.toLowerCase())
          );
        return this.expenditure_categories;
      });
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
      this.$store.dispatch("getRequest", payload).then(() => {

      }).finally(() => {
      });
    },

    getPaymentActivitiesFromStore() {
      this.filtered_items = [];
      if (this.$store.getters.getPaymentActivities !== null) {
        this.$store.getters.getPaymentActivities.forEach((element) => {
          this.filtered_items.push({
            label: element.name,
            value: element.id,
          });
        });
      }

      return this.filtered_items;
    },

    filterPaymentItems(val, update, abort) {
      if (val < 2) {
        abort();
        this.start_filtering = false;
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.filtered_items = this.getPaymentActivitiesFromStore().filter(
          (item) => item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.filtered_items;
      });
    },

    filterYear(val, update, abort) {
      if (val < 2) {
        abort();
        this.start_filtering = false;
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.years = this.getSessionsFromState.filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.years;
      });
    },

    filterExpenditureItems(page, fetch_count) {
      let selected_expenditure_cat =
        this.expenditure_category_id != null
          ? this.expenditure_category_id.value
          : "";
      let selected_payment_item = this.payment_item_id !== null && this.payment_item_id !== "" ? this.payment_item_id.value : "";
      let session = this.year !== null && this.year !== "" ? this.year.value : this.$store.getters.getCurrentYear.id;

      let payload = {
        status: "none",
        url: `/api/protected/expenditure_categories/expenditure_items/filter?expenditure_category_id=${selected_expenditure_cat}&payment_item_id=${selected_payment_item}&session_id=${session}&page=${page}&per_page=${fetch_count}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
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
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.$store.commit("SET_PAGINATION", {
            sortBy: "name",
            descending: false,
            page: response.data.current_page,
            rowsPerPage: response.data.per_page,
            rowsNumber: response.data.total,
          });
        })
        .finally(() => {
          this.loading_filter = false;
          this.$store.commit("SET_IS_FETCHING", false);
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
      let url = `/api/protected/expenditure_categories/expenditure_items/download?expenditure_category_id=${selected_expenditure_cat}&payment_item_id=${selected_payment_item}&session_id=${session}&status=`;
      let file_name = "Expenditure_Items.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    stopSearch() {
      if (this.expenditure_category_id != null) {
        this.start_filtering_expenditure_category = false;
      }
      if (this.year != null) {
        this.start_filtering_year = false;
      }
      if (this.payment_item_id != null) {
        this.start_filtering_payment_item = false;
      }
    },

    onRequest(props) {
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.filterExpenditureItems(page, fetch_count);
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
