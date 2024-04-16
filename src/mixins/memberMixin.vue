<script>
export default {
  data() {
    return {};
  },
  computed: {
    getMembers() {
      let data = [];
      if (this.$store.getters.getMembers !== null && this.$store.getters.getMembers.data !== undefined) {
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
          });
        });
      }
      return data;
    },
  },
  methods: {
    filterOrganisationMembers(id, show_spinner, page, rowsPerPage, sort_by, year, filter, has_register, gender) {
      let payload = {
        url: `/api/protected/organisations/filter-users?organisation_id=${id}&has_register=${has_register}&gender=${gender}&year=${year}&page=${page}&per_page=${rowsPerPage}&sort_by=${sort_by}&filter=${filter}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: show_spinner,
        commit: "SET_MEMBERS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          if (response.success) {
            this.$store.commit("SET_PAGINATION", {
              sortBy: "name",
              descending: false,
              page: response.data.current_page,
              rowsPerPage: response.data.per_page,
              rowsNumber: response.data.total,
            });
          }
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
        });
    },

    getMemberProfile(id) {
      let payload = {
        url: `/api/protected/organisations/users/${id}`,
        data: "",
        status: "none",
        show_feedback: false,
        msg: "none",
        color: "default",
        show_spinner: true,
        error_msg: "default",
        commit: "SET_CURRENT_MEMBER",
        has_commit: true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then(() => {})
        .catch((e) => {});
    },

    getUserByRegistrationStatus(organisation_id, session_id) {
      let payload = {
        status: "none",
        url: `/api/protected/organisations/registered_users?organisation_id=${organisation_id}&session_id=${session_id}`,
        has_path_val: true,
        show_feedback: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_BAR_CHART_DATA",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    getUserByRegistration(organisation_id, session_id) {
      let payload = {
        status: "none",
        url: `/api/protected/organisations/users?organisation_id=${organisation_id}&session_id=${session_id}`,
        has_path_val: true,
        show_feedback: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_PIE_CHART_DATA",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {});
    },

    getOrganisationMembers(organisation_id){
      let payload = {
        url: `/api/protected/organisations/${organisation_id}/users`,
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
      this.$store
        .dispatch("getRequest", payload)
        .then(() => {

        })
        .finally(() => {
        });
    }
  },
};
</script>
