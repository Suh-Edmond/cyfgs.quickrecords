<template>
  <q-page>
    <div>
      <!-- header for filter categories -->
      <FilterComponentVue
        :show_income_activity="true"
        :loading_download="loading_download"
        :disable_download_btn="validateDownload"
        @filter-income-activity="filterIncomeActivity"
        @download-income-activity="downloadIncomeActivity"
      >
      </FilterComponentVue>

      <!-- table for activities -->
      <TableVue
        :class="$q.platform.is.desktop ? 'q-pt-sm q-px-sm' : ' q-px-sm q-pt-lg'"
        :columns="columns"
        :data="getIncomeActivities"
        :label="label"
        :title="getTableTitle"
        :message="message"
        :show_savings="false"
        :show_income_activity="true"
        :show_contribution="false"
        :total_income="getTotalIncome"
        :show_members="false"
        :pagination="getPagination"
        :table_loading="getLoadingState"
        @edit-income-activity="editIncomeActivity"
        @view-income-activity="viewIncomeActivity"
        @delete-row="deleteRow"
        @onRequest="onRequest"
      >
      </TableVue>
    </div>
  </q-page>
</template>

<script>
import TableVue from "src/components/Table.vue";
import IncomeActivityMixinVue from "src/mixins/IncomeActivityMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import FilterComponentVue from "src/components/FilterComponent.vue";
import { LocalStorage } from "quasar";

export default {
  mixins: [IncomeActivityMixinVue, HelperMixinVue],
  beforeMount() {
    this.$store.commit("SET_PAGINATION", {
      sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 7,
      rowsNumber: 0,
    });
  },

  mounted() {
    const page = 1;
    const per_page = 7;
    this.getOrganisationIncomeActivities(
      this.$store.getters.getOrganisation.id,
      page,
      per_page
    );
  },

  data() {
    return {
      organisation_id: this.$store.getters.getOrganisation.id,
      payment_item_id: null,
      month: "",
      status: "",
      columns: [
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
      loading_download: false,
      session_id:""
    };
  },
  computed: {
    getTotalIncome() {
      return this.$store.getters.getIncomeActivities !== null
        ? this.$store.getters.getIncomeActivities.total_income
        : 0;
    },

    getTableTitle() {
      let month_name =
        this.month !== "" || null
          ? this.$t("app.forTheMonthOf") + this.month.label
          : "";
      return this.payment_item_id !== null || ""
        ? this.$t("app.incomeTitlePart") +
            `${this.payment_item_id.label}` +
            month_name
        : "";
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

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    validateDownload() {
      return this.getIncomeActivities.length == 0;
    },
  },
  methods: {
    onRequest(props) {
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      if (this.payment_item_id === null || "") {
        this.getOrganisationIncomeActivities(
          this.organisation_id,
          page,
          fetch_count
        );
      } else {
        let payload = {
          payment_item_id: this.payment_item_id,
          month: this.month,
          status: this.payment_status,
        };
        this.filterIncomeActivity(payload, page, fetch_count);
      }
    },

    editIncomeActivity(data) {
      this.$emit("edit-income-activity", data);
    },

    viewIncomeActivity(data) {
      this.$emit("view-income-activity", data);
    },

    filterIncomeActivity(payload_data, page, per_page) {
      this.payment_item_id = payload_data.payment_item_id;
      let item_id = this.payment_item_id !== null && this.payment_item_id !== "" ? this.payment_item_id.value : "";
      console.log(item_id);
      this.session_id = payload_data.year != null && payload_data.year != ""? payload_data.year.value : ""
      this.month = payload_data.month;
      let month_value = this.month !== "" ? this.month.value : "";
      let month_label = this.month !== "" ? this.month.label : "";
      this.status =
        payload_data.status !== "" && payload_data.status !== null
          ? payload_data.status
          : "";
      let page_num =
        this.payment_item_id !== null ||
        this.payment_item_id !== ""
          ? 1
          : page;
      let num_rows =
        this.payment_item_id !== null ||
        this.payment_item_id !== ""
          ? 7
          : per_page;

      this.$router.push({
        path: `/dashboard/income-activities?payment_item=${item_id}&month=${month_label}&status=${this.status}&session_id=${this.session_id}`,
        query: {
          payment_item: this.payment_item_id.label,
          month: month_label,
          status: this.status,
          t: new Date().getTime(),
        },
      });
      let payload = {
        status: "none",
        url: `/api/protected/organisations/income-activities/search?organisation_id=${this.organisation_id}&month=${month_value}&payment_item_id=${item_id}&session_id=${this.session_id}&status=${this.status}&page=${page_num}&per_page=${num_rows}`,
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
          this.$store.commit("SET_IS_FETCHING", false);
        });
    },

    downloadIncomeActivity(data) {
      let payment_item_value =
        data.payment_item_id != null && data.payment_item_id != ""
          ? data.payment_item_id.value
          : "";
      let payment_item_label =
        data.payment_item_id != null && data.payment_item_id != ""
          ? data.payment_item_id.label
          : "";
      let month =
        data.month != null && data.month != "" ? data.month.value : "";
      let status =
        data.status !== null && data.status !== "" ? data.status : "";
      let year = LocalStorage.getItem("data").current_session.year;
      let url = `/api/protected/organisations/income-activities/generate-pdf?organisation_id=${this.organisation_id}&month=${month}&payment_item_id=${payment_item_value}&status=${status}&payment_item_name=${payment_item_label}&year=${year}`;

      let file_name = "Organisation_Income_Activities.pdf";

      this.loading_download = this.downloadPdf(url, file_name);
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
    FilterComponentVue,
  },
};
</script>

<style lang="scss" scoped></style>
