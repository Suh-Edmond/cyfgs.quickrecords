<template>
  <q-page>
    <div v-if="!checkTreasurerRole()">
      <!--------------------------------------------------------START OF SAVINGS--------------------------------------->
      <div>
       <FilterComponentVue
       :show_savings_non_treasurer="true"
       :loading_download="loading_download"
        :disable_download_btn="validateDownload"
        @filter-savings="filterSavings"
        @download-savings="downloadMembersSavings"
       >
        </FilterComponentVue>

        <!--------------------------------------------------------START OF TABLE TO DISPLAY SAVINGS-------------------------->
        <div class="row q-pt-sm">
          <div class="col-md-12 col-xs-12 col-sm-12">
            <TableVue
              :columns="columns"
              :data="getMembersSavings"
              :label="label"
              :message="message"
              :show_savings="true"
              :show_income_activity="false"
              :show_members="false"
              :total_saving="getTotalMembersSavings"
              :show_contribution="false"
              :pagination="getPagination"
              :table_loading="getLoadingState"
              @edit-member-saving="editMemberSaving"
              @onRequest="onRequest"
            >
            </TableVue>
          </div>
        </div>
        <!---------------------------------------------------------END OF TABLE OF SAVINGS------------------------------------>
      </div>
      <!---------------------------------------------------------END OF SAVINGS---------------------------------------->
    </div>

    <!----------------------------------------------------------SAVINGS TO BE APPROVE/DECLINE------------------------->
    <div v-if="checkTreasurerRole()">

      <FilterComponentVue
       :show_savings_treasurer="true"
       :loading_download="loading_download"
        :disable_download_btn="validateDownload"
        @search-savings="searchSavings"
        @download-savings="downloadMembersSavings"
       >
        </FilterComponentVue>
      <!-- table for filtered savings -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue
            :columns="columns"
            :data="getMembersSavings"
            :label="label"
            :message="message"
            :show_savings="true"
            :show_income_activity="false"
            :show_members="false"
            :total_saving="getTotalMembersSavings"
            :show_contribution="false"
            :pagination="getPagination"
            :table_loading="getLoadingState"
            @view-member-saving="ViewMemberSaving"
            @onRequest="onRequest"
          >
          </TableVue>
        </div>
      </div>
    </div>
    <!------------------------------------------------------------END OF SAVINGS TO BE APPROVED / DECLINED------------->
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";
import TableVue from "src/components/Table.vue";
import UserSavingMixinVue from "src/mixins/UserSavingMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";
import MonthsMixinVue from "src/mixins/MonthsMixin.vue";
import FilterComponentVue from "src/components/FilterComponent.vue";
export default {
  mixins: [
    UserSavingMixinVue,
    HelperMixinVue,
    CurrentYearMixinVue,
    MonthsMixinVue,
  ],
  beforeMount(){
    this.$store.commit("SET_PAGINATION", {
      sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 7,
      rowsNumber: 0,
    });
  },

  mounted() {
    this.getPaginatedOrganisationMemberSavings(
      this.organisation_id,
      1,
      7,
      "",
      this.session_id,
    );
    this.getSessions();
  },
  data() {
    return {
      year: "",
      month: "",
      columns: [
        {
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
        },
        {
          name: "user_name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.user_name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "email",
          align: "left",
          label: "Email",
          field: "email",
        },
        {
          name: "telephone",
          align: "left",
          label: "Telephone Number",
          field: "telephone",
        },
        {
          name: "total_amount",
          align: "left",
          label: "Total Amount Saved (XAF)",
          field: "total_amount",
        },
        {
          name: "action",
          label: "Action",
          align: "left",
          field: "action",
        },
      ],
      label: this.$t("app.delete"),
      message: this.$t("app.deleteSavingWarningMsg"),
      organisation_id: this.$store.getters.getOrganisation.id,
      session_id: this.$store.getters.getCurrentYear.id,
      loading_download: false,
    };
  },
  computed: {
    getTotalMembersSavings() {
      return this.$store.getters.getOrganisationMembersSavings != null
        ? this.$store.getters.getOrganisationMembersSavings.total_savings
        : 0;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getMembersSavings() {
      let data = [];
      if (this.$store.getters.getOrganisationMembersSavings !== null) {
        this.$store.getters.getOrganisationMembersSavings.data.forEach(
          (ele) => {
            data.push({
              counter:
                this.$store.getters.getOrganisationMembersSavings.data.indexOf(
                  ele
                ) + 1,
              user_name: ele.user_name,
              email: ele.email,
              telephone: ele.telephone,
              total_amount: ele.total_amount,
              id: ele.id,
              approve: ele.approve,
              comment: ele.comment,
              type: "MEMBERS_SAVINGS",
              user_id: ele.user_id,
              created_at: ele.created_at,
              updated_by: ele.updated_by,
              amount_deposited: ele.amount_deposited,
              amount_used: ele.amount_used,
            });
          }
        );
      }
      return data;
    },

    validateDownload(){
      return this.getMembersSavings.length == 0
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
  watch: {
  },
  methods: {
    onRequest(props) {
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.table_loader = true;
      if (this.year === "" || null) {
        this.getPaginatedOrganisationMemberSavings(
          this.organisation_id,
          page,
          fetch_count,
          "",
          this.session_id,
        );
      } else {
        this.filterSavings();
      }
    },

    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").user_data.roles.find(
        (role) => role.name == "TREASURER"
      );
      return treasurer_role != undefined;
    },

    editMemberSaving(data) {
      this.$emit("edit-member-saving", data);
    },

    downloadMembersSavings(data) {
      let session = data.year !== "" ? data.year.value : this.session_id;
      let month =
        data.month === "" || data.month === null ? "" : data.month.value;

      let url = `/api/protected/organisation-savings/download?organisation_id=${this.organisation_id}&session_id=${session}&month=${month}`;

      let file_name = "Organisation_Savings.pdf";

      this.loading_download = this.downloadPdf(url, file_name);
    },

    searchSavings() {
      let payload = {
        data: null,
        tab: "Search Savings",
      };

      this.$emit("search-member-saving", payload);
    },

    filterSavings(data) {
      let month =
        data.month !== "" && data.month !== null ? data.month.value : "";
      let session =
        data.year !== "" && data.year !== null
          ? data.year.value
          : this.session_id;
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: {
          month: month,
          year: data.year.label,
          t: new Date().getTime(),
        },
      });
      this.getPaginatedOrganisationMemberSavings(
        this.organisation_id,
        this.pagination.page,
        this.pagination.rowsPerPage,
        month,
        session,
      );
    },

    ViewMemberSaving(data) {
      this.$emit("view-member-saving", data);
    },
  },
  components: {
    TableVue,
    FilterComponentVue
  },
};
</script>

<style lang="scss" scoped></style>
