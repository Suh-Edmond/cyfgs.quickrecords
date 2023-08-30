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
            :pagination="pagination"
            :total_members="computeTotalMembership"
            :table_loading="loading"
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
import RegistrationAmountMixinVue from "src/mixins/RegistrationAmountMixin.vue";
import FilterComponentVue from "src/components/FilterComponent.vue";

export default {
  mixins: [
    memberMixin,
    organisationMixinVue,
    HelperMixinVue,
    RegistrationAmountMixinVue,
  ],

  mounted() {
    let id = this.getOrganisationId;
    const per_page = 7;
    const page = 1;
    this.getPaginatedOrganisationMembers(id, page, per_page, "name");
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
          name: "year",
          align: "left",
          label: "Year",
          field: "year",
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
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 7,
        rowsNumber: 0,
      },
      loading: false,
      organisation_id: this.$store.getters.getOrganisation.id,
      loading_download: false,
    };
  },
  computed: {
    getMembers() {
      let data = [];
      if (this.$store.getters.getMembers !== null) {
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
  },

  methods: {
    onRequest(props) {
      const { page, rowsPerPage, sortBy } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.getPaginatedOrganisationMembers(
        this.organisation_id,
        page,
        fetch_count,
        sortBy
      );
    },

    getPaginatedOrganisationMembers(id, page, rowsPerPage, sort_by) {
      let payload = {
        url: `/api/protected/organisations/filter-users?organisation_id=${id}&has_register=${this.has_register}&gender=${this.gender}&year=${this.year.value}&page=${page}&per_page=${rowsPerPage}&sort_by=${sort_by}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        commit: "SET_MEMBERS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading = true;
      this.$store.commit("SET_MEMBERS", null);
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.pagination.rowsNumber = response.data.total;
          this.pagination.page = response.data.current_page;
          this.pagination.rowsPerPage = response.data.per_page;
        })
        .finally(() => {
          this.loading = false;
        });
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
      const page = 1;
      const per_page = 7;
      const sort_by = "name";
      this.getPaginatedOrganisationMembers(
        this.organisation_id,
        page,
        per_page,
        sort_by
      );
    },

    downloadMembers(data) {
      this.setFilterVariables(data);
      let url = `/api/protected/organisations/download-users?organisation_id=${this.organisation_id}&has_register=${this.has_register}&gender=${this.gender}&year=${this.year.value}`;
      let file_name = "Organisation_Members.pdf";
      this.loading_download = this.downloadPdf(url, file_name);
    },

    onFetchMembers() {
      this.getPaginatedOrganisationMembers(
        this.organisation_id,
        1,
        7,
        "name",
        false
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
        let page = 1;
        let per_page = 7;
        let sort_by = "name";
        this.getPaginatedOrganisationMembers(
          this.organisation_id,
          page,
          per_page,
          sort_by,
          false
        );
      });
    },

    setFilterVariables(data) {
      this.has_register = data.has_register;
      this.year = data.year;
      this.gender = data.gender;
    },
  },

  components: {
    TableVue,
    FilterComponentVue,
  },
};
</script>
<style lang="scss" scoped></style>
