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
            :options="payment_items"
            :label="$t('app.searchPaymentItem')"
            input-debounce="0"
            use-input
            clearable
            @filter="filterPaymentItems"
            @input="stopSearch"
          >
            <template v-slot:append v-if="start_filtering">
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
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-pl-sm">
          <q-select
            v-model="month"
            outlined
            dense
            :options="monthsOptions"
            :label="$t('app.searchMonth')"
            input-debounce="0"
            @filter="filterMonths"
            @input="stopSearch"
            use-input
            clearable
          >
            <template v-slot:append v-if="start_month_filtering">
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
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-pl-sm">
          <q-select
            v-model="status"
            outlined
            dense
            :options="statuses"
            clearable
            :label="$t('app.selectStatusLabel')"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("app.noResults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 flex q-pl-sm">
          <div>
            <q-btn
              :label="$t('app.filter')"
              :loading="loading_filter"
              color="primary"
              :disabled="validateFilter"
              no-caps
              icon-right="filter_list"
              @click="filterIncomeActivity"
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
              @click="downloadIncomeActivity"
            ></q-btn>
          </div>
        </div>
      </div>
      <!-- table for activities -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue
            :columns="columns"
            :data="getIncomeActivities"
            :label="label"
            :message="message"
            :show_savings="false"
            :show_income_activity="true"
            :show_contribution="false"
            :total_income="getTotalIncome"
            :show_members="false"
            :pagination="pagination"
            :table_loading="table_loader"
            @edit-income-activity="editIncomeActivity"
            @view-income-activity="viewIncomeActivity"
            @delete-row="deleteRow"
            @onRequest="onRequest"
          >
          </TableVue>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import TableVue from "src/components/Table.vue";
import IncomeActivityMixinVue from "src/mixins/IncomeActivityMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import MonthsMixinVue from "src/mixins/MonthsMixin.vue";

export default {
  mixins: [IncomeActivityMixinVue, HelperMixinVue, MonthsMixinVue],

  mounted() {
    const page = 1;
    const per_page = 3;
    this.getOrganisationIncomeActivities(
      this.$store.getters.getOrganisation.id,
      page,
      per_page
    );

    if (this.$store.getters.getPaymentActivities.length == 0) {
      this.fetchPaymentActivities(); //fetch from endpoint
    }
    this.getPaymentActivitiesFromStatus();
  },

  data() {
    return {
      organisation_id: this.$store.getters.getOrganisation.id,
      payment_item_id: null,
      month: "",
      monthsOptions: [],
      statuses: ["PENDING", "APPROVED", "DECLINED", "ALL"],
      status: "",
      loading_filter: false,
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
          label: "Amount (XAF)",
          field: "amount",
        },
        {
          name: "date",
          align: "left",
          label: "Date",
          field: "date",
        },
        {
          name: "venue",
          align: "left",
          label: "Venue",
          field: "venue",
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
          align: "left",
        },
      ],
      label: this.$t("app.delete"),
      message: this.$t("app.deleteIncomeActvityWarningMsg"),
      filteredActivities: [],
      start_filter: false,
      loading: false,
      total_income_amount: 0,
      payment_items: [],
      start_filtering: false,
      start_month_filtering: false,
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 3,
        rowsNumber: 0,
      },
      table_loader: false,
    };
  },
  computed: {
    validateFilter() {
      return this.payment_item_id == null;
    },

    getTotalIncome() {
      return this.$store.getters.getIncomeActivities !== null
        ? this.$store.getters.getIncomeActivities.total
        : 0;
    },

    getTableTitle() {
      let title = "";
      if (this.filteredActivities.length > 0) {
        if (this.payment_item_id != null) {
          title =
            this.$t("app.incomeTitlePart") +
            `${this.filteredActivities[0].payment_item.name}`;
        } else {
          title = this.$t("app.incomeTitle") + `${this.month}`;
        }
      }
      return title;
    },

    getIncomeActivities() {
      let data = [];
      if (this.$store.getters.getIncomeActivities !== null) {
        this.$store.getters.getIncomeActivities.data.forEach((ele) => {
          data.push({
            counter:
              this.$store.getters.getIncomeActivities.data.indexOf(ele) + 1,
            name: ele.name,
            amount: ele.amount,
            id: ele.id,
            approve: ele.approve,
            description: ele.description,
            type: "INCOME_ACTIVITIES",
            date: ele.date,
            venue: ele.venue,
            payment_item: ele.payment_item,
            organisation_id: ele.organisation_id,
            created_at: ele.created_at,
            updated_by: ele.updated_by,
          });
        });
      }
      return data;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    validateDownload() {
      return this.getIncomeActivities.length == 0;
    },
  },
  methods: {
    getOrganisationIncomeActivities(organisation_id, page, per_page) {
      this.table_loader = true;
      let payload = {
        url: `/api/protected/organisations/${organisation_id}/income-activities?page=${page}&per_page=${per_page}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        commit: "SET_INCOME_ACTIVITIES",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.pagination.rowsNumber = response.data.total;
          this.pagination.page = response.data.current_page;
          this.pagination.rowsPerPage = response.data.per_page;
        })
        .finally(() => {
          this.table_loader = false;
        });
    },

    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.$store.commit("SET_INCOME_ACTIVITIES", null);
      if (this.payment_item_id === null || "") {
        this.getOrganisationIncomeActivities(
          this.organisation_id,
          page,
          fetch_count
        );
      } else {
        this.filterIncomeActivity(page, fetch_count);
      }
    },

    getPaymentActivitiesFromStatus() {
      this.payment_items = [];
      this.$store.getters.getPaymentActivities.forEach((ele) => {
        this.payment_items.push({
          label: ele.name,
          value: ele.id,
          amount: ele.amount,
        });
      });
      return this.payment_items;
    },

    filterPaymentItems(val, update, abort) {
      if (val < 1) {
        this.start_filtering = false;
        abort();
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.payment_items = this.getPaymentActivitiesFromStatus().filter(
          (item) => item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.payment_items;
      });
    },

    stopSearch() {
      if (this.payment_item_id != null) {
        this.start_filtering = false;
      }
      if (this.month != "") {
        this.start_month_filtering = false;
      }
    },

    filterMonths(val, update, abort) {
      if (val.length < 1) {
        this.start_month_filtering = false;
        abort();
        return;
      }
      if (this.month == "") {
        this.monthsOptions = this.getMonths;
      }
      update(() => {
        this.start_month_filtering = true;
        const needle = val.toLowerCase();
        this.monthsOptions = this.getMonths.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    editIncomeActivity(data) {
      this.$emit("edit-income-activity", data);
    },

    viewIncomeActivity(data) {
      this.$emit("view-income-activity", data);
    },

    filterIncomeActivity(page, per_page) {
      let payment_item_name =
        this.payment_item_id != null ? this.payment_item_id.label : "";
      let payment_item_value =
        this.payment_item_id != null ? this.payment_item_id.value : "";
      let month =
        this.month !== "" && this.month !== null ? this.month.value : "";
      let page_num = this.payment_item_id !== null || "" ? 1 : page;
      let num_rows = this.payment_item_id !== null || "" ? 3 : per_page;

      this.$router.push({
        path: `/dashboard/income-activities?payment_item=${payment_item_name}&month=${month}&status=${this.status}`,
        query: {
          payment_item: payment_item_name,
          month: this.month.label,
          status: this.status,
          t: new Date().getTime(),
        },
      });
      let payload = {
        status: "none",
        url: `/api/protected/organisations/income-activities/search?organisation_id=${this.organisation_id}&month=${month}&payment_item_id=${payment_item_value}&status=${this.status}&page=${page_num}&per_page=${num_rows}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_INCOME_ACTIVITIES",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.table_loader = true;
      this.loading_filter = true;
      this.$store.commit("SET_INCOME_ACTIVITIES", null);
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.pagination.rowsNumber = response.data.total;
          this.pagination.page = response.data.current_page;
          this.pagination.rowsPerPage = response.data.per_page;
        })
        .finally(() => {
          this.table_loader = false;
          this.loading_filter = false;
        });
    },

    downloadIncomeActivity() {
      let payment_item_id =
        this.payment_item_id != null ? this.payment_item_id.value : "";

      let url = `/api/protected/organisations/income-activities/generate-pdf?organisation_id=${this.organisation_id}&month=${this.month}&payment_item_id=${payment_item_id}&status=${this.status}`;

      let file_name = "Organisation_Income_Activities.pdf";

      this.loading = this.downloadPdf(url, file_name);
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

    deleteRow(data) {
      let payload = {
        url: `/api/protected/income-activities/${data.id}`,
        msg: this.$t("app.deleteIncomeSuccessMsg"),
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
        this.getOrganisationIncomeActivities(data.organisation_id, 1, 3);
      });
    },
  },
  components: {
    TableVue,
  },
};
</script>

<style lang="scss" scoped></style>
