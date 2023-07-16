<script>
export default {
  data() {
    return {

    }
  },
  computed: {
    getMembers() {
      let data = [];
      this.$store.getters.getMembers.forEach((member) => {
        data.push({
          counter: this.$store.getters.getMembers.indexOf(member) + 1,
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
      return data;
    }
  },
  methods: {
    getOrganisationMembers(id, show_spinner) {
      let payload = {
        url: `/api/protected/organisations/${id}/users`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t('app.defaultErrorMsg'),
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
      this.$store.dispatch("getRequest", payload).then(() => {
      }).finally(() => {
      })
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
        .then(() => { })
        .catch((e) => { });
    },

    getUserByRegistrationStatus(organisation_id) {
      let payload = {
        status: "none",
        url: `/api/protected/organisations/registered_users?organisation_id=${organisation_id}`,
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
      this.$store.dispatch("getRequest", payload).then(() => {
      });
    },

    getUserByRegistration(organisation_id){
      let payload = {
        status: "none",
        url: `/api/protected/organisations/users?organisation_id=${organisation_id}`,
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
      this.$store.dispatch("getRequest", payload).then((res) => {

      });
    }
  }
}
</script>
