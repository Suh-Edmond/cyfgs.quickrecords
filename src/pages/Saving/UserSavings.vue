<template>
  <q-page>
    <div>
      <!----------------------------------------------------------------START OF USER SAVINGS-------------------------------------------------->
      <div
        class="row q-ml-xs q-pt-xs"
        :class="$q.screen.lg ? 'q-pa-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <q-select
            v-model="month"
            outlined
            dense
            :options="monthsOptions"
            :label="$t('app.searchMonth')"
            use-input
            input-debounce="0"
            clearable
            @filter="filterMonths"
            @input="stopSearch"
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
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-pl-md">
          <q-select
            v-model="status"
            outlined
            dense
            :options="statuses"
            :label="$t('app.selectStatusLabel')"
            clearable
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("app.noResults") }}</q-item-section
                >
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-md-6 col-lg-6 col-xs-12 col-sm-12 flex q-pl-md">
          <div>
            <q-btn
              :label="$t('app.filter')"
              :loading="is_fetching"
              :color="'primary'"
              :disabled="validateFilter"
              no-caps
              icon-right="filter_list"
              @click="filterSavings"
            >
            </q-btn>
          </div>
          <q-space />
          <div class="button">
            <q-btn
              :label="$t('app.print')"
              :loading="loading_download"
              color="positive"
              :disabled="false"
              no-caps
              icon-right="print"
              @click="downloadSavings"
            ></q-btn>
          </div>
        </div>
      </div>
      <!-------------------------------------------------------TABLE FOR USER SAVINGS---------------------------------------->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue
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
            :table_loading="table_loader"
            @fetch-member-saving="fetchMemberSaving"
            @view-member-saving="ViewMemberSaving"
            @edit-member-saving="editMemberSaving"
            @onRequest="onRequest"
          >
          </TableVue>
        </div>
      </div>
      <!-------------------------------------------------------END TABLE FOR USER SAVINGS---------------------------------------->
    </div>
  </q-page>
</template>

<script>
import TableVue from "src/components/Table.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import MonthsMixinVue from "src/mixins/MonthsMixin.vue";
export default {
  mixins: [HelperMixinVue, MonthsMixinVue],

  mounted() {
    this.fetchMemberSaving();
  },

  data() {
    return {
      columns: [
        {
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
        },
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
      statuses: ["PENDING", "APPROVED", "DECLINED", "ALL"],
      status: "",
      month: "",
      is_fetching: false,
      monthsOptions: [],
      table_loader: false,
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 7,
        rowsNumber:
          this.$store.getters.getMemberSavings !== null
            ? this.$store.getters.getMemberSavings.total
            : 0,
      },
      session_id: this.$store.getters.getCurrentYear.id,
      start_month_filtering: false,
    };
  },
  computed: {
    validateFilter() {
      return (
        (this.month === null || this.month === "") &&
        (this.status === null || this.status === "")
      );
    },
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
  },
  methods: {
    onRequest(props) {
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      let id = this.$route.params.id;
      this.getPaginatedData(id, page, fetch_count, false);
    },

    fetchMemberSaving(data) {
      this.getPaginatedData(this.$route.params.id, 1, 7, false);
    },

    getPaginatedData(id, page, fetch_count, is_filtering) {
      this.table_loader = true;
      this.is_fetching = is_filtering;
      let searched_month =
        this.month !== "" && this.status !== null ? this.month.value : "";
      let searched_status =
        this.status !== "" && this.status !== null ? this.status : "";
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
      this.$store.commit("SET_MEMBER_SAVINGS", null);
      this.$store
        .dispatch("getRequest", payload)
        .then(() => {
          const data = this.$store.getters.getMemberSavings;
          this.pagination.page = data.current_page;
          this.pagination.rowsPerPage = data.per_page;
          this.pagination.rowsNumber = data.total;
        })
        .finally(() => {
          this.table_loader = false;
          this.is_fetching = false;
        });

      return this.is_fetching;
    },

    ViewMemberSaving(data) {
      this.$emit("view-member-saving", data);
    },

    editMemberSaving(data) {
      this.$store.dispatch("setEditState", false);

      this.$emit("edit-member-saving", data);
    },

    filterSavings() {
      this.$router.push({
        path: `/dashboard/members-savings/users/`,
        query: {
          status: this.status,
          month: this.month,
          t: new Date().getTime(),
        },
      });
      this.getPaginatedData(this.$route.params.id, 1, 7, true);
    },

    downloadSavings() {
      let user_id = this.$route.params.id;
      let status = this.status !== "" || null ? this.status : "";
      let month = this.month !== "" || null ? this.month : "";
      let url = `/api/protected/savings/download?user_id=${user_id}&status=${status}&session_id=${this.session_id}&month=${month}`;

      let file_name = "User_Savings.pdf";

      this.loading_download = this.downloadPdf(url, file_name);
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

    stopSearch() {
      if (this.month !== "" || this.month !== null) {
        this.start_month_filtering = false;
      }
    },
  },
  components: {
    TableVue,
  },
};
</script>

<style lang="scss" scoped></style>
