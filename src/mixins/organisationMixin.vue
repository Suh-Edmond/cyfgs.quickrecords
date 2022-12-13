<script>

export default {
  data() {},
  computed: {
    getOrganisationId() {
      return this.$store.getters.getOrganisation.id
    },
  },
  methods: {
    getOrganisationInfo() {
      let payload = {
        status: "none",
        url: "/api/protected/organisation-info",
        has_path_val: true,
        show_feedback: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_ORGANISATION",
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
  }
};
</script>
>
