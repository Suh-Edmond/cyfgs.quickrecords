<script>
export default {
  data() {
    return {
      loading: false,
    };
  },

  computed: {},

  methods: {
    getSponsorships(payment_item_id) {
      let payload = {
        status: "none",
        url: `/api/protected/activity-supports/payment-items/${payment_item_id}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_SPONSORSHIPS",
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
  },
};
</script>
