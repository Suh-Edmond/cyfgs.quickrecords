<script>
export default {
  data() {
    return {
      loading: false,
    };
  },

  computed: {},

  methods: {
    getMembersContributionsByPaymentItem(id) {
      let payload = {
        status: "none",
        url: `/api/protected/contributions/payment-items/${id}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
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
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    filterMembersContributions(data) {
      this.$router.push({
        path: `/dashboard/contributions`,
        query: {
          organisation_id: data.organisation_id,
          payment_item_id: data.payment_item_id.label,
          status: data.status,
          year: data.year,
          month: data.month,
          date: data.date,
          range: data.date_range,
        },
      });
      this.loading = true;
      let url = `/api/protected/organisations/contributions/search?organisation_id=${data.organisation_id}&payment_item_id=${data.payment_item_id.value}&year=${data.year}&month=${data.month}&date=${data.date}&range=${data.date_range}&status=${data.status}`;
      let payload = {
        url: url,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch members contributions",
        has_commit: true,
        show_feedback: false,
        show_spinner: true,
        commit: "SET_FILTERED_CONTRIBUTIONS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };

      this.$store.dispatch("getRequest", payload).then(() => {
        this.loading = false;
        this.$store.dispatch("setSearchSavingsParams", {
          organisation_id: data.organisation_id,
          year: data.year,
          payment_category_id: data.payment_category_id,
          payment_item_id: data.payment_category_id,
          month: data.month,
          date: data.date,
          range: data.date_range,
          status: data.status,
        });
      });

      return this.loading;
    },
  },
};
</script>
