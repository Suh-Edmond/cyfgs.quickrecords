<template>
  <q-page>
    <NotFound
      :message="not_found_msg"
      v-if="getIncomeActivities.length == 0"
    ></NotFound>
    <!-- header for filter categories -->
    <div
      class="row q-ml-xs q-pt-xs"
      v-if="getIncomeActivities.length > 0"
      :class="$q.screen.lg ? 'q-pa-sm' : ''"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
    >
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
        <q-select
          v-model="year"
          outlined
          dense
          :options="years"
          label="Select year"
          input-debounce="0"
          @filter="filterYears"
          use-input
          hide-selected
          fill-input
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
          :options="months"
          label="Select month"
          input-debounce="0"
          @filter="filterMonths"
          use-input
          hide-selected
          fill-input
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
          input-debounce="0"
          @filter="filterStatus"
          use-input
          hide-selected
          fill-input
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
            :label="label_fetch"
            :loading="loading_filter"
            :color="color"
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
            :label="label_download"
            :loading="loading"
            :color="color_print"
            :disabled="false"
            no-caps
            icon-right="print"
            @click="downloadIncomeActivity"
          ></q-btn>
        </div>
      </div>
    </div>
    <!-- table for activities -->
    <div class="row q-pt-sm" v-if="!start_filter">
      <div class="col-md-12 col-xs-12 col-sm-12">
        <TableVue
          :columns="columns"
          :data="getIncomeActivities"
          :label="label"
          :message="message"
          :show_savings="false"
          :show_income_activity="true"
          :show_contribution="false"
          :show_members="false"
          @edit-income-activity="editIncomeActivity"
          @view-income-activity="viewIncomeActivity"
        >
        </TableVue>
      </div>
    </div>

    <!-- table for filtered activities -->
    <div class="row q-pt-sm" v-if="start_filter">
      <div class="col-md-12 col-xs-12 col-sm-12">
        <TableVue
          :columns="columns"
          :data="filteredActivities"
          :label="label"
          :message="message"
          :show_savings="false"
          :show_income_activity="true"
          :show_contribution="false"
          :show_members="false"
          @edit-income-activity="editIncomeActivity"
          @view-income-activity="viewIncomeActivity"
        >
        </TableVue>
      </div>
    </div>
  </q-page>
</template>

<script>
import NotFound from "src/components/NotFound.vue";
import TableVue from "src/components/Table.vue";
import IncomeActivityMixinVue from "src/mixins/IncomeActivityMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";

export default {
  mixins: [IncomeActivityMixinVue, organisationMixinVue, HelperMixinVue],

  mounted() {
    this.getOrganisationIncomeActivities();
  },

  data() {
    return {
      not_found_msg:
        "Ooops!! No Income Activity has been recorded. Click the add button to add income activity.",
      year: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
      month: null,
      months: [
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
      ],
      statuses: ["APPROVED", "UNAPPROVED", "ALL"],
      status: null,
      search: null,
      label_fetch: "Filter",
      color: "primary",
      no_caps: true,
      loading_filter: false,
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
          name: "action",
          label: "Action",
          field: "action",
        },
      ],
      label: "Delete",
      message: "Are you sure you want to delete this Income Activity ?",
      filteredActivities: [],
      start_filter: false,
      loading: false,
    };
  },
  computed: {
    validateFilter() {
      return this.year !== null || this.month !== null || this.status !== null
        ? false
        : true;
    },

    getIncomeActivities() {
      let data = [];

      if (this.$store.getters.getIncomeActivities != null) {
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
            organisation_id: ele.organisation_id,
            created_at: ele.created_at,
            updated_by: ele.updated_by,
          });
        });
      }
      return data;
    },
  },
  methods: {
    filterYears(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.years = this.years.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterMonths(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.months = this.months.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    filterStatus(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.statuses = this.statuses.filter(
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
      let id = this.getOrganisationId;
      let payload = {
        status: "none",
        url: `/api/protected/organisations/income-activities/search?organisation_id=${id}&month=${this.month}&year=${this.year}&status=${this.status}`,
        has_path_val: true,
        show_feedback: false,
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

          res.data.data.forEach((ele) => {
            this.filteredActivities.push({
              counter: res.data.data.indexOf(ele) + 1,
              name: ele.name,
              amount: ele.amount,
              id: ele.id,
              approve: ele.approve,
              description: ele.description,
              type: "INCOME_ACTIVITIES",
              date: ele.date,
              venue: ele.venue,
              organisation_id: ele.organisation_id,
              created_at: ele.created_at,
              updated_by: ele.updated_by,
            });
          });
        })
        .finally(() => {
          this.year = null;
          this.month = null;
          this.status = null;
          this.loading_filter = false;
        });
    },

    downloadIncomeActivity() {
      let id = this.getOrganisationId;

      let url = `/api/protected/organisations/income-activities/generate-pdf?organisation_id=${id}`;

      let file_name = "Organisation_Income_Activities.pdf";

      this.loading = this.downloadPdf(url, file_name);
    },
  },
  components: {
    NotFound,
    TableVue,
  },
};
</script>

<style lang="scss" scoped>
</style>
