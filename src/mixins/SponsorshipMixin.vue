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
      this.$store.dispatch("getRequest", payload).then((response) => {});
    },

    getAllSponsorships(page, per_page, payment_item_id, status_value) {
      let payload = {
        status: "none",
        url: `/api/protected/sponsorships?page=${page}&per_page=${per_page}&payment_item_id=${payment_item_id}&status=${status_value}`,
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
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store.dispatch("getRequest", payload).then((response) => {
        this.$store.commit("SET_PAGINATION", {
            sortBy: "name",
            descending: false,
            page: response.data.current_page,
            rowsPerPage: response.data.per_page,
            rowsNumber: response.data.total,
          });
      }).finally(() => {
        this.$store.commit("SET_IS_FETCHING", false);
      });
    },
  },
};
</script>
