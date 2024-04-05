<script>
export default {
  data() {},

  computed: {
    getPaymentItems() {
      let items = [];
      if (this.$store.getters.getPaymentItems != null) {
        this.$store.getters.getPaymentItems.data.forEach((ele) => {
          items.push({
            label: ele.name,
            value: ele.id,
          });
        });
      }

      return items;
    },

    getPaymentActivities() {
      let data = [];
      this.$store.getters.getPaymentActivities.forEach((ele) => {
        data.push({
          label: ele.name,
          value: ele.id,
          amount: ele.amount,
        });
      });
      return data;
    },
  },

  methods: {
    getPaymentItemsByCategory(id) {
      let payload = {
        status: "none",
        url: `/api/protected/payment-categories/${id}/payment-items`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_PAYMENT_ITEMS",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          if (response.success) {
            this.$store.commit("SET_PAGINATION", {
              sortBy: "name",
              descending: false,
              page: response.data.current_page,
              rowsPerPage: response.data.per_page,
              rowsNumber: response.data.total,
            });
          }
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
        });
    },

    //payment activities also called payment items
    fetchPaymentActivities() {
      let payload = {
        status: "none",
        url: `/api/protected/payment-items`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_PAYMENT_ACTIVITIES",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    getPaymentActivitiesFromStatus() {
      let payment_items = [];
      this.$store.getters.getPaymentActivities.forEach((ele) => {
        payment_items.push({
          label: ele.name,
          value: ele.id,
          amount: ele.amount,
        });
      });
      return payment_items;
    },
  },
};
</script>
