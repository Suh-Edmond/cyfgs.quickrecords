<template>
  <q-page>
    <div>
      <!-- header for filter members -->
      <div
        class="row q-ml-xs"
        :class="$q.screen.lg ? 'q-pa-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div
          class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-pr-md' : ''"
        >
          <q-select
            v-model="year"
            outlined
            dense
            :options="getSessions"
            :label="$t('app.selectYearLabel')"
            clearable
          >
            <template v-slot:append v-if="start_year_filtering">
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
        <div
          class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-pr-md' : ''"
        >
          <q-select
            v-model="has_register"
            outlined
            dense
            :options="registrationStatuses"
            :label="$t('app.selectStatusLabel')"
            clearable
          >
            <template v-slot:append v-if="start_status_filtering">
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
        <div
          class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-pr-md' : ''"
        >
          <q-select
            v-model="gender"
            outlined
            dense
            :options="genders"
            :label="$t('app.selectGenderLabel')"
            clearable
          >
            <template v-slot:append v-if="start_gender_filtering">
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
        <div class="flex col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <div :class="$q.screen.lg ? 'q-pr-md' : ''">
            <q-btn
              :label="$t('app.filter')"
              :loading="loading_filter"
              color="primary"
              :disabled="validateFilter"
              @click="filterMembers"
              no-caps
              icon-right="filter_list"
            >
            </q-btn>
          </div>
          <q-space />
          <div>
            <q-btn
              :label="$t('app.print')"
              :loading="loading_download"
              color="positive"
              :disabled="false"
              no-caps
              icon-right="print"
              @click="downloadMembers"
            ></q-btn>
          </div>
        </div>
      </div>
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
    this.getPaginatedOrganisationMembers(id, page, per_page, "name", false);
    this.getRegistrationAmount();
    this.fetchSessions();
  },
  data() {
    return {
      year: "",
      has_register: "",
      start_filter: false,
      filter: "",
      genders: ["MALE", "FEMALE", "ALL", "OTHER"],
      registrationStatuses: [
        "REGISTERED",
        "NOT_REGISTERED",
        "PENDING",
        "DECLINED",
        "ALL",
      ],
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
      loading_filter: false,
      loading_download: false,
      start_gender_filtering: false,
      start_status_filtering: false,
      start_year_filtering: false,
    };
  },
  computed: {
    validateFilter() {
      return (
        (this.has_register === "" || this.has_register === null) &&
        (this.year === "" || this.year === null) &&
        (this.gender === "" || this.gender === null)
      );
    },

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

    getSessions() {
      let data = [];
      let current_session = this.$store.getters.getCurrentYear;
      this.$store.getters.getSessions.forEach((ele) => {
        if (ele.year == current_session.year && ele.id == current_session.id) {
          data.push({
            value: ele.id,
            label: ele.year + " Current Year",
          });
        } else {
          data.push({
            value: ele.id,
            label: ele.year,
          });
        }
      });

      return data;
    },
  },

  methods: {
    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.getPaginatedOrganisationMembers(
        this.organisation_id,
        page,
        fetch_count,
        sortBy,
        false
      );
    },

    getPaginatedOrganisationMembers(
      id,
      page,
      rowsPerPage,
      sort_by,
      is_filtering
    ) {
      let year_id = this.year !== null ? this.year.value : "";
      let payload = {
        url: `/api/protected/organisations/filter-users?organisation_id=${id}&has_register=${this.has_register}&gender=${this.gender}&year=${year_id}&page=${page}&per_page=${rowsPerPage}&sort_by=${sort_by}`,
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
      this.loading_filter = is_filtering;
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
          this.loading_filter = false;
        });

      return this.loading_filter;
    },

    registerMember(data) {
      this.$emit("register-member", data);
    },

    filterMembers() {
      this.$router.push({
        path: "/dashboard/members",
        query: {
          has_register: this.has_register,
          year: this.year.label,
          gender: this.gender,
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
        sort_by,
        true
      );
    },

    downloadMembers() {
      let url = `/api/protected/organisations/download-users?organisation_id=${this.organisation_id}&has_register=${this.has_register}&gender=${this.gender}&year=${this.year}`;
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

    fetchSessions() {
      let payload = {
        status: "none",
        url: `/api/protected/sessions`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_SESSIONS",
        has_commit: true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    filterYears(val, update, abort) {
      if (val.length < 1) {
        this.start_year_filtering = false;
        abort();
        return;
      }
      if (this.year == "") {
        this.years = this.getSessionsFromState;
      }
      update(() => {
        this.start_year_filtering = true;
        this.years = this.getSessionsFromState.filter((v) =>
          v.label.toLowerCase().includes(val.toLowerCase())
        );
      });
    },

    stopSearch(){
      if(this.year !== "" || this.year !== null){
        this.start_year_filtering = false;
      }
      if(this.has_register !== "" || this.has_register !== null){
        this.start_status_filtering = false;
      }
      if(this.gender !== "" || this.gender !== null) {
        this.start_gender_filtering = false;
      }
    }
  },

  components: {
    TableVue,
  },
};
</script>
<style lang="scss" scoped></style>
