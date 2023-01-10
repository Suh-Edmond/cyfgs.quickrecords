<script>
export default {
  data() {
    return {

    }
  },

  computed : {

  },

  methods : {
    getMembersContributionsByPaymentItem(id) {
      let payload = {
        status: "none",
        url: `/api/protected/contributions/payment-items/${id}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner:true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_MEMBERS_CONTRIBUTIONS_PER_ITEM",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => { });
    }
  }
}
</script>
