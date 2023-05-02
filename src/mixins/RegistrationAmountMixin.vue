<script>
export default {
  methods: {
    getRegistrationAmount() {
      let payload = {
        status: "none",
        url: `/api/protected/registration_fees/current`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_REG_AMOUNT",
        has_commit: true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: null,
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then(() => {
        })
        .finally(() => {
        });
    },
  }
}
</script></script>
