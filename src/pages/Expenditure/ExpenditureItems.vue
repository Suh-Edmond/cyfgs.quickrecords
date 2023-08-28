<template>
  <q-page>
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
            v-model="payment_item_id"
            outlined
            dense
            :options="filtered_payment_items"
            :label="$t('app.searchPaymentItem')"
            input-debounce="0"
            use-input
            clearable
            @filter="filterPaymentItems"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"
                  >{{ $t("app.notResults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-pl-md">
          <q-select
            v-model="session"
            outlined
            dense
            :options="years"
            :label="$t('app.searchYear')"
            use-input
            input-debounce="0"
            clearable
            @filter="filterYears"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"
                  >{{ $t("app.notResults") }}
                </q-item-section>
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
            :label="$t('app.selectStatusLabel')"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"
                  >{{ $t("app.notResults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 flex q-pl-md">
          <div>
            <q-btn
              :label="$t('app.filter')"
              color="primary"
              :disabled="validateFilter"
              no-caps
              icon-right="filter_list"
              @click="filterItems"
              :loading="is_fetching"
            >
            </q-btn>
          </div>
          <q-space />
          <div class="button q-pb-xs">
            <q-btn
              :label="$t('app.print')"
              :loading="loading"
              color="positive"
              :disabled="validateDownload"
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
          <div class="col-md-12 col-xs-12 col-sm-12">
            <CategoryTable
              :columns="columns"
              :data="getExpenditureItems"
              :label="label"
              :message="message"
              :title="getTableTitle"
              :show_payment_category="false"
              :show_payment_item="false"
              :show_expenditure_category="false"
              :show_expenditure_item="true"
              :pagination="pagination"
              :table_loading="table_loader"
              @edit-expenditure-item="editExpenditureItem"
              @view-expenditure-item="viewExpenditureItem"
              @show-expenditure-item-details="showExpenditureItemDetails"
              @delete-row="deleteRow"
              @onRequest="onRequest"
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
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";
import CurrentYearMixin from "src/mixins/CurrentYearMixin.vue";

export default {
  mixins: [
    HelperMixinVue,
    ExpenditureItemDetailMixinVue,
    expenditureItemMixinVue,
    CurrentYearMixin,
  ],
  mounted() {
    this.fetchExpenditureItems(1, 2, false);
    this.fetchPaymentActivities();
    this.getPaymentItemsFromStore();
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
          name: "action",
          label: "Action",
          field: "action",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      data: [],
      label: this.$t("app.delete"),
      message: this.$t("app.deleteExpenditureItemWarningMsg"),
      statuses: ["PENDING", "APPROVED", "DECLINED", "ALL"],
      status: "",
      payment_item_id: null,
      session: "",
      filtered_payment_items: [],
      years: [],
      is_fetching: false,
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 2,
        rowsNumber: 0,
      },
      table_loader: false,
      session_id: this.$store.getters.getCurrentYear.id,
    };
  },
  computed: {
    validateFilter() {
      return this.payment_item_id == null;
    },
    getExpenditureItems() {
      let data = [];
      if (this.$store.getters.getExpenditureItems !== null) {
        this.$store.getters.getExpenditureItems.data.forEach((ele) => {
          data.push({
            counter:
              this.$store.getters.getExpenditureItems.data.indexOf(ele) + 1,
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
            total_amount_given: ele.total_amount_given,
            total_amount_spent: ele.total_amount_spent,
            total_balance: ele.total_balance,
            type: "EXPENDITURE_ITEMS",
            payment_item: ele.payment_item,
          });
        });
      }
      return data;
    },

    getTableTitle() {
      let title = "";
      if (this.payment_item_id !== null && this.payment_item_id !== "") {
        title = this.$t(
          "app.expenditureItemTitlePartName"
        )+`${this.payment_item_id.label}`;
      }else {
        title = this.$store.getters.getCurrentExpenditureCategory.name;
      }
      return title;
    },

    validateDownload() {
      return this.getExpenditureItems.length == 0;
    },
  },
  methods: {
    onRequest(props) {
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.fetchExpenditureItems(page, fetch_count, false);
    },

    fetchExpenditureItems(page, per_page, is_filtering) {
      let category = this.$store.getters.getCurrentExpenditureCategory;
      let session_id =
        this.session !== "" && this.session !== null
          ? this.session.value
          : this.session_id;
      let status_value =
        this.status !== "" && this.status !== null ? this.status : "";
      let payment_item_id =
        this.payment_item_id !== "" && this.payment_item_id !== null
          ? this.payment_item_id.value
          : "";

      let payload = {
        status: "none",
        url: `/api/protected/expenditure-categories/${category.id}/expenditure-items?status=${status_value}&session_id=${session_id}&payment_item_id=${payment_item_id}&page=${page}&per_page=${per_page}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_EXPENDITURE_ITEMS",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.table_loader = true;
      this.is_fetching = is_filtering;
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.pagination.page = response.data.current_page;
          this.pagination.rowsNumber = response.data.total;
          this.pagination.rowsPerPage = response.data.per_page;
        })
        .finally(() => {
          this.table_loader = false;
          this.is_fetching = false;
        });
    },

    editExpenditureItem(data) {
      this.$store.dispatch("setUpdatedExpenditureItem", data.data);
      this.$emit("edit-expenditure-item", data);
    },

    viewExpenditureItem(data) {
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
        name: this.$t("app.expenditureItemDetailLabel"),
        has_intermediate_tab: true,
      });

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);

      this.$emit("show-expenditure-item-details", data);
    },

    downloadExpenditureItems() {
      let expenditure_category_id =
        this.$store.getters.getCurrentExpenditureCategory.id;
      let payment_item_id =
        this.payment_item_id != null ? this.payment_item_id.value : "";
      let session_id = this.session != "" ? this.session.value : "";
      let url = `/api/protected/expenditure-categories/expenditure-items/download?expenditure_category_id=${expenditure_category_id}&status=${this.status}&payment_item_id=${payment_item_id}&session_id=${session_id}`;
      let file_name = "Expenditure_Items.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    filterItems() {
      let expenditure_category =
        this.$store.getters.getCurrentExpenditureCategory;
      let session_label =
        this.session !== "" && this.session !== null ? this.session.label : "";
      this.$router.push({
        path: `/dashboard/expenditure-categories/${expenditure_category.id}/items`,
        query: {
          payment_item_id: this.payment_item_id.label,
          status: this.status,
          session: session_label,
          t: new Date().getTime(),
        },
      });

      this.fetchExpenditureItems(1, 3, true);
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

    getPaymentItemsFromStore() {
      this.filtered_payment_items = [];
      if (this.$store.getters.getPaymentActivities !== null) {
        this.$store.getters.getPaymentActivities.forEach((ele) => {
          this.filtered_payment_items.push({
            label: ele.name,
            value: ele.id,
            amount: ele.amount,
          });
        });
      }
      return this.filtered_payment_items;
    },

    deleteRow(data) {
      let payload = {
        url: `/api/protected/expenditure-categories/${data.expenditure_category.id}/expenditure-items/${data.id}`,
        msg: this.$t("app.deleteExpenditureItemFeedbackMsg"),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("deleteRequest", payload).then(() => {
        this.fetchExpenditureItems(1, 2, false);
      });
    },

    filterPaymentItems(val, update, abort) {
      if (val < 1) {
        abort();
        return;
      }

      update(() => {
        this.filtered_payment_items = this.getPaymentItemsFromStore().filter(
          (item) => item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.filtered_payment_items;
      });
    },

    filterYears(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      if (this.year == "") {
        this.years = this.getSessionsFromState;
      }
      update(() => {
        this.years = this.getSessionsFromState.filter((v) =>
          v.label.toLowerCase().includes(val.toLowerCase())
        );
      });
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
