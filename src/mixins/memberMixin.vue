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
        error_msg: "An Error occurred! Please try again",
        has_commit: true,
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
