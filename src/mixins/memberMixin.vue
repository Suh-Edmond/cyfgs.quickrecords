<script>
export default {
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {
    getOrganisationMembers(id, show_spinner) {
      let payload = {
        url: `/api/protected/organisations/${id}/users`,
        msg: "none",
        color: "default",
        status:"none",
        error_msg: "An Error occurred! Could not fetch users",
        has_commit: true,
        show_feedback:false,
        show_spinner:show_spinner,
        commit: "SET_MEMBERS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$emit("start-loading", true);
      this.$store.dispatch("getRequest", payload).then(() => {
      }).finally(() => {
        this.$emit("start-loading", false);
      })
    },

    getMemberProfile(id) {
      console.log(id);
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
  }
}
</script>
