<template>
  <q-page>
    <div>
      <!-- header for filter members -->
      <FilterComponentVue
        :show_member_filters="true"
        :loading_download="loading_download"
        :disable_download_btn="validateDownloadBtn"
        @filter-members="filterMembers"
        @download-members="downloadMembers"
      >
      </FilterComponentVue>

      <!-- table for members -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue
            :columns="columns"
            :data="getMembers"
            :label="label"
            :message="message"
            :show_savings="false"
            :show_income_activity="false"
            :show_members="true"
            :show_contribution="false"
            :pagination="getPagination"
            :total_members="computeTotalMembership"
            :table_loading="getLoadingState"
            @fetch-members="onFetchMembers"
            @register-member="registerMember"
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
import memberMixin from "src/mixins/memberMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import FilterComponentVue from "src/components/FilterComponent.vue";

export default {
  mixins: [memberMixin, organisationMixinVue, HelperMixinVue],

  mounted() {
    this.$store.commit("SET_PAGINATION", {
      sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });
    this.getPaginatedOrganisationMembers(
      this.organisation_id,
      1,
      10,
      "name",
      "",
      this.has_register,
      this.gender
    );
    this.getRegistrationAmount();
  },
  data() {
    return {
      year: "",
      has_register: "",
      filter: "",
      gender: "",
      message: this.$t("app.deleteMemberWarningMsg"),
      label: this.$t("app.delete"),
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
          name: "gender",
          align: "left",
          label: "Gender",
          field: "gender",
          sortable: true,
        },
        {
          name: "telephone",
          align: "left",
          label: "Telephone",
          field: "telephone",
          sortable: true,
        },
        {
          name: "has_register",
          align: "left",
          label: "Registeration Status",
          field: "has_register",
          sortable: true,
        },
        {
          name: "approve",
          align: "left",
          label: "Payment Status",
          field: "approve",
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: "Status",
          field: "status",
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
      organisation_id: this.$store.getters.getOrganisation.id,
      loading_download: false,
    };
  },
  computed: {
    getMembers() {
      let data = [];
      if (
        this.$store.getters.getMembers !== null &&
        this.$store.getters.getMembers.data !== undefined
      ) {
        this.$store.getters.getMembers.data.forEach((member) => {
          data.push({
            counter: this.$store.getters.getMembers.data.indexOf(member) + 1,
            name: member.name,
            telephone: member.telephone,
            gender: member.gender,
            address: member.address,
            occupation: member.occupation,
            id: member.id,
            email: member.email,
            organisation_id: member.organisation_id,
            has_register: member.has_register,
            has_paid: member.has_paid,
            type: "MEMBERS",
            approve: member.approve,
            year: member.year,
            roles: member.roles,
            created_at: member.created_at,
            updated_at: member.updated_at,
            picture: member.picture,
            session_id: member.session_id,
            status: member.status,
          });
        });
      }
      return data;
    },

    computeTotalMembership() {
      return this.$store.getters.getMembers !== null
        ? this.$store.getters.getMembers.total
        : 0;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getTotalPages() {
      return this.$store.getters.getMembers.last_page;
    },

    validateDownloadBtn() {
      return this.getMembers < 0;
    },

    getPagination() {
      let paginate_object = {
        sortBy: "name",
        descending: this.$store.getters.getPagination.descending,
        page: this.$store.getters.getPagination.page,
        rowsPerPage: this.$store.getters.getPagination.rowsPerPage,
        rowsNumber: this.$store.getters.getPagination.rowsNumber,
      };

      return paginate_object;
    },
  },

  methods: {
    onRequest(props) {
      const { page, rowsPerPage, sortBy } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      const filter = props.filter;
      this.getPaginatedOrganisationMembers(
        this.organisation_id,
        page,
        fetch_count,
        sortBy,
        filter,
        this.gender,
        this.has_register
      );
    },

    getPaginatedOrganisationMembers(
      id,
      page,
      rowsPerPage,
      sort_by,
      filter,
      has_register,
      gender
    ) {
      let year_value =
        this.year !== null && this.year !== "" ? this.year.value : "";
      this.filterOrganisationMembers(
        id,
        false,
        page,
        rowsPerPage,
        sort_by,
        year_value,
        filter,
        has_register,
        gender
      );
    },

    registerMember(data) {
      this.$emit("register-member", data);
    },

    filterMembers(data) {
      this.setFilterVariables(data);
      this.$router.push({
        path: "/dashboard/members",
        query: {
          has_register: data.has_register,
          year: data.year.label,
          gender: data.gender,
          t: new Date().getTime(),
        },
      });
      this.getPaginatedOrganisationMembers(
        this.organisation_id,
        1,
        10,
        "name",
        "",
        this.has_register,
        this.gender
      );
    },

    downloadMembers(data) {
      this.setFilterVariables(data);
      let year_value =
        this.year !== null && this.year !== "" ? this.year.value : "";
      let url = `/api/protected/organisations/download-users?organisation_id=${this.organisation_id}&has_register=${this.has_register}&gender=${this.gender}&year=${year_value}?page=&per_page=`;
      let file_name = "Organisation_Members.pdf";
      this.loading_download = this.downloadPdf(url, file_name);
    },

    onFetchMembers() {
      this.getPaginatedOrganisationMembers(
        this.organisation_id,
        1,
        10,
        "name",
        false,
        "",
        this.has_register,
        this.gender
      );
    },

    deleteRow(data) {
      let payload = {
        url: `/api/protected/users/${data.id}`,
        msg: this.$t("app.deleteMemberFeedbackMsg"),
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
        this.getPaginatedOrganisationMembers(
          this.organisation_id,
          1,
          10,
          "name",
          false,
          "",
          this.has_register,
          this.gender
        );
      });
    },

    setFilterVariables(data) {
      this.has_register = data.has_register;
      this.year = data.year;
      this.gender = data.gender;
    },

    getRegistrationAmount() {
      let payload = {
        status: "none",
        url: `/api/protected/registration_fees/current`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_REG_AMOUNT",
        has_commit: true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: null,
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then(() => {})
        .finally(() => {});
    },
  },

  components: {
    TableVue,
    FilterComponentVue,
  },
};
</script>
<style lang="scss" scoped></style>
