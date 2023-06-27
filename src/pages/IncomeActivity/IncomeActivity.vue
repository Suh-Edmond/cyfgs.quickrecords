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
            label="Search payment item..."
            input-debounce="0"
            use-input
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
            v-model="month"
            outlined
            dense
            :options="monthsOptions"
            label="Search month..."
            input-debounce="0"
            @filter="filterMonths"
            use-input
            clearable
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
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 flex q-pl-md">
          <div>
            <q-btn
              label="Filter"
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
              label="Print"
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
            @edit-income-activity="editIncomeActivity"
            @view-income-activity="viewIncomeActivity"
            @delete-row="deleteRow"
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
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export default {
  mixins: [IncomeActivityMixinVue, HelperMixinVue],

  mounted() {
    let organisation = this.$store.getters.getOrganisation;
    this.getOrganisationIncomeActivities(organisation.id);

    if (this.$store.getters.getPaymentActivities.length == 0) {
      this.fetchPaymentActivities(); //fetch from endpoint
    }
    this.getPaymentActivitiesFromStatus();

  },

  data() {
    return {
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
      label: "Delete",
      message: "Are you sure you want to delete this Income Activity ?",
      filteredActivities: [],
      start_filter: false,
      loading: false,
      total_income_amount: 0,
      payment_items: [],
    };
  },
  computed: {
    validateFilter() {
      return this.payment_item_id == null;
    },

    getTotalIncome() {
      let total = 0;
      if (this.filteredActivities.length == 0 && !this.start_filter) {
        if (this.$store.getters.getIncomeActivities != null) {
          this.$store.getters.getIncomeActivities.forEach((ele) => {
            total += ele.amount;
          });
        }
      } else {
        this.filteredActivities.forEach((ele) => {
          total += ele.amount;
        });
      }
      return total;
    },

    getTableTitle() {
      let title = "";
      if (this.filteredActivities.length > 0) {
        if (this.payment_item_id != null) {
          title = `Income Raised for ${this.filteredActivities[0].payment_item.name}`;
        } else {
          title = `Income Raised for the month of ${this.month}`;
        }
      }
      return title;
    },

    getIncomeActivities() {
      let data = [];
      if (this.filteredActivities.length == 0 && !this.start_filter) {
        if (this.$store.getters.getIncomeActivities != null) {
          this.$store.getters.getIncomeActivities.forEach((ele) => {
            data.push({
              counter: this.$store.getters.getIncomeActivities.indexOf(ele) + 1,
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
      } else {
        data = this.filteredActivities;
      }
      return data;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    validateDownload()
    {
      return this.getIncomeActivities.length == 0
    }
  },
  methods: {
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

    filterMonths(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      if (this.month == "") {
        this.monthsOptions = months;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.monthsOptions = months.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    editIncomeActivity(data) {
      this.$emit("edit-income-activity", data);
    },

    viewIncomeActivity(data) {
      this.$emit("view-income-activity", data);
    },

    filterIncomeActivity() {
      this.filteredActivities = [];
      this.total_income_amount = 0;

      let id = this.$store.getters.getOrganisation.id;
      let payment_item_name =
        this.payment_item_id != null ? this.payment_item_id.label : "";
      let payment_item_value =
        this.payment_item_id != null ? this.payment_item_id.value : "";

      this.$router.push({
        path: `/dashboard/income-activities?payment_item=${payment_item_name}&month=${this.month}&status=${this.status}`,
        query: {
          payment_item: payment_item_name,
          month: this.month,
          status: this.status,
        },
      });

      let payload = {
        status: "none",
        url: `/api/protected/organisations/income-activities/search?organisation_id=${id}&month=${this.month}&payment_item_id=${payment_item_value}&status=${this.status}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.loading_filter = true;
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          this.loading_filter = false;
          this.start_filter = true;

          res.data.forEach((ele) => {
            this.total_income_amount += ele.amount;
            this.filteredActivities.push({
              counter: res.data.indexOf(ele) + 1,
              name: ele.name,
              amount: ele.amount,
              id: ele.id,
              approve: ele.approve,
              description: ele.description,
              type: "INCOME_ACTIVITIES",
              date: ele.date,
              venue: ele.venue,
              organisation_id: ele.organisation_id,
              payment_item: ele.payment_item,
              created_at: ele.created_at,
              updated_by: ele.updated_by,
            });
          });
        })
        .finally(() => {
          this.loading_filter = false;
        });
    },

    downloadIncomeActivity() {
      const id = this.$store.getters.getOrganisation.id;
      let payment_item_id =
        this.payment_item_id != null ? this.payment_item_id.value : "";

      let url = `/api/protected/organisations/income-activities/generate-pdf?organisation_id=${id}&month=${this.month}&payment_item_id=${payment_item_id}&status=${this.status}`;

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
        msg: `Income Activity deleted successfully`,
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("deleteRequest", payload).then(() => {
        this.getOrganisationIncomeActivities(data.organisation_id);
      });
    },
  },
  components: {
    TableVue,
  },
};
</script>

<style lang="scss" scoped></style>
