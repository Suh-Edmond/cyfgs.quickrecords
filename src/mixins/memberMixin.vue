<script>
export default {
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {
    getOrganisationMembers(id) {
      let payload = {
        url: `/api/protected/organisations/${id}/users`,
        msg: "none",
        color: "default",
        status:"none",
        error_msg: "An Error occurred! Could not fetch users",
        has_commit: true,
        show_feedback:false,
        show_spinner:true,
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
    }
  }
}
</script>
