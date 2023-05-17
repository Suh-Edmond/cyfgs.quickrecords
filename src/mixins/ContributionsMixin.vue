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

    filterMembersContributions(data, session_id, state, con_month, con_date, date_range, amount) {
      let status = data.status != undefined ? data.status : state;
      let year = data.year != undefined ? data.year : session_id;
      let month = data.month != undefined ? data.month : con_month;
      let date = data.date != undefined ? data.date : con_date;
      let range = data.date_range != undefined ? data.date_range : date_range;

      this.$router.push({
        path: `/dashboard/contributions`,
        query: {
          payment_item_id:
            data.payment_item_id != undefined ? data.payment_item_id.label : data.payment_item_id,
          status: status,
          year: year,
          month: month,
          date: date,
          range: range,
          payment_item_amount:data.payment_item_id != undefined ? data.payment_item_id.amount : amount
        },
      });
      this.loading = true;
      let id =
        data.payment_item_id.value != undefined
          ? data.payment_item_id.value
          : data.payment_item_id;
      let url = `/api/protected/organisations/contributions/search?payment_item_id=${id}&year=${year}&month=${month}&date=${date}&range=${range}&status=${status}`;
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
      });

      return this.loading;
    },

    getMemberContributionsByPaymentItem(payment_item_id, user_id) {
      let payload = {
        status: "none",
        url: `/api/protected/contributions/payment-items/${payment_item_id}/users/${user_id}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_MEMBER_CONTRIBUTIONS",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },
  },
};
</script>
