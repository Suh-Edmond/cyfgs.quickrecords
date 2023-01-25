<script>
import organisationMixinVue from "./organisationMixin.vue";

export default {
  mixins: [organisationMixinVue],
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    getOrganisationMemberSavings() {
      let id = this.getOrganisationId;
      let payload = {
        url: `/api/protected/organisations/${id}/user-savings`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch members savings",
        has_commit: true,
        show_feedback: false,
        show_spinner: true,
        commit: "SET_ORGANISATION_MEMBERS_SAVINGS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    getMemberSavings(id) {
      let payload = {
        url: `/api/protected/user-savings/${id}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch member savings",
        has_commit: true,
        show_feedback: false,
        show_spinner: true,
        commit: "SET_MEMBER_SAVINGS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    filterSaving(url) {
      let payload = {
        url: url,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch members savings",
        has_commit: true,
        show_feedback: false,
        show_spinner: true,
        commit: "SET_SAVINGS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };

      this.$store.dispatch("getRequest", payload).then(() => {
      });
    },
  },
};
</script>
