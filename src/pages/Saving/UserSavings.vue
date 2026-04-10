<template>
  <q-page>
    <div>
      <!----------------------------------------------------------------START OF USER SAVINGS-------------------------------------------------->
      <FilterComponentVue
        :show_filter_member_savings="true"
        :loading_download="loading_download"
        :disable_download_btn="validateDownload"
        @filter-member-savings="filterSavings"
        @download-member-savings="downloadSavings"
      >
      </FilterComponentVue>
      <!-------------------------------------------------------TABLE FOR USER SAVINGS---------------------------------------->
      <TableVue
        :class="$q.platform.is.desktop ? 'q-pt-sm q-px-sm' : ' q-px-sm q-pt-lg'"
        :columns="columns"
        :data="getMemberSavings"
        :label="label"
        :message="message"
        :title="''"
        :show_savings="false"
        :show_member_savings="true"
        :show_income_activity="false"
        :show_members="false"
        :show_contribution="false"
        :total_saving="getMemberTotalSaving"
        :pagination="pagination"
        :table_loading="getLoadingState"
        @fetch-member-saving="fetchMemberSaving"
        @view-member-saving="ViewMemberSaving"
        @edit-member-saving="editMemberSaving"
        @update-user-saving-history="updateUserSavingHistory"
        @onRequest="onRequest"
      >
      </TableVue>
      <!-------------------------------------------------------END TABLE FOR USER SAVINGS---------------------------------------->
    </div>
  </q-page>
</template>

<script>
import TableVue from "src/components/Table.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import FilterComponentVue from "src/components/FilterComponent.vue";
import { LocalStorage } from "quasar";
export default {
  mixins: [HelperMixinVue],

  mounted() {
    this.fetchMemberSaving();
  },

  data() {
    return {
      columns: [
        {
          name: "amount_deposited",
          align: "left",
          label: "Amount Deposited (XAF)",
          field: "amount_deposited",
        },
        {
          name: "amount_used",
          align: "left",
          label: "Amount Used (XAF)",
          field: "amount_used",
        },
        {
          name: "approve",
          align: "left",
          label: "Transaction Status",
          field: "approve",
        },
        {
          name: "date",
          align: "left",
          label: "Date Collected",
          field: "date",
        },
        {
          name: "action",
          label: "Action",
          field: "action",
          align: "left",
        },
      ],
      label: this.$t("app.delete"),
      message: this.$t("app.deleteSavingWarningMsg"),
      status: "",
      month: "",
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: this.$store.getters.getMemberSavings
          ? this.$store.getters.getMemberSavings.total
          : 0,
      },
      session_id: LocalStorage.getItem("data").current_session.id,
    };
  },
  computed: {
    getMemberSavings() {
      let data = [];
      if (this.$store.getters.getMemberSavings !== null) {
        this.$store.getters.getMemberSavings.data.forEach((ele) => {
          data.push({
            counter: this.$store.getters.getMemberSavings.data.indexOf(ele) + 1,
            name: ele.user_name,
            email: ele.email,
            telephone: ele.telephone,
            amount_deposited: ele.amount_deposited,
            amount_used: ele.amount_used,
            id: ele.id,
            approve: ele.approve,
            comment: ele.comment,
            type: "MEMBER_SAVINGS",
            user_id: ele.user_id,
            created_at: ele.created_at,
            updated_by: ele.updated_by,
            date: ele.created_at,
            user_name: ele.user_name,
          });
        });
      }
      return data;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getMemberTotalSaving() {
      return this.$store.getters.getMemberSavings !== null
        ? this.$store.getters.getMemberSavings.total_savings
        : 0;
    },

    validateDownload() {
      return this.getMemberSavings.length === 0;
    },
  },
  methods: {
    onRequest(props) {
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      let id = this.$route.params.id;
      this.getPaginatedData(id, page, fetch_count);
    },

    fetchMemberSaving() {
      this.getPaginatedData(this.$route.params.id, 1, 10);
    },

    getPaginatedData(id, page, fetch_count) {
      let searched_month = this.month ? this.month.value : "";
      let searched_status = this.status ? this.status : "";
      let payload = {
        url: `/api/protected/user-savings/${id}?month=${searched_month}&status=${searched_status}&page=${page}&per_page=${fetch_count}`,
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        commit: "SET_MEMBER_SAVINGS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store.commit("SET_MEMBER_SAVINGS", null);
      this.$store
        .dispatch("getRequest", payload)
        .then(() => {
          let data = this.$store.getters.getMemberSavings;
          if (data !== undefined) {
            this.pagination.page = data.current_page;
            this.pagination.rowsPerPage = data.per_page;
            this.pagination.rowsNumber = data.total;
          } else {
            this.pagination.page = 1;
            this.pagination.rowsPerPage = 10;
            this.pagination.rowsNumber = 10;
          }
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
        });

      return this.is_fetching;
    },

    ViewMemberSaving(data) {
      this.$emit("view-member-saving", data);
    },

    editMemberSaving(data) {
      this.$emit("edit-member-saving", data);
    },

    updateUserSavingHistory(data) {
      this.$emit("update-user-saving-history", data);
    },

    filterSavings(data) {
      this.$router.push({
        path: `/dashboard/members-savings/users/${this.$route.params.id}`,
        query: {
          status: data.payment_status,
          month: data.month.label ? data.month.label : "",
          t: new Date().getTime(),
        },
      });
      this.status = data.payment_status;
      this.month = data.month;
      this.getPaginatedData(this.$route.params.id, 1, 7);
    },

    downloadSavings(data) {
      let user_id = this.$route.params.id;
      let user_name =
        this.$store.getters.getMemberSavings !== undefined &&
        this.$store.getters.getMemberSavings !== null
          ? this.$store.getters.getMemberSavings.data[0].user_name
          : "";
      let status =
        data.payment_status !== "" && data.payment_status !== null
          ? data.payment_status
          : "";
      let month =
        (data.month !== null && data.month !== "") || null
          ? data.month.value
          : "";
      let url = `/api/protected/savings/download?user_id=${user_id}&status=${status}&session_id=${this.session_id}&month=${month}&name=${user_name}`;

      let file_name = "User_Savings.pdf";

      this.loading_download = this.downloadPdf(url, file_name);
    },
  },
  components: {
    TableVue,
    FilterComponentVue,
  },
};
</script>

<style lang="scss" scoped></style>
