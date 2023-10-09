<script>
export default {
  methods: {
    getAllRoles() {
       let payload = {
        url: `/api/protected/roles`,
        msg: "none",
        color: "default",
        status:"none",
        error_msg: this.$t('app.defaultErrorMsg'),
        has_commit: true,
        show_spinner:true,
        commit: "SET_ROLES",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {
      }).finally(() => {
      })
    }
  }

}
</script></script>
