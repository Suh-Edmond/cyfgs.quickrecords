<script>
export default {
  data() {
    return {
      loading: false,
      percentage_contributions: [],
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

    filterMembersContributions(
      data,
      session_id,
      state,
      con_month,
      con_date,
      date_range,
      amount,
      page,
      per_page
    ) {
      let validate_data = this.validateSearchData(
        data,
        state,
        session_id,
        con_month,
        con_date,
        date_range
      );
      this.$store.commit("SET_IS_FETCHING", true);
      this.setSearchRoute(
        data,
        validate_data.status,
        validate_data.year,
        validate_data.month,
        validate_data.date,
        validate_data.range,
        amount
      );
      this.loading = true;
      let id =
        data.payment_item_id.value !== undefined
          ? data.payment_item_id.value
          : data.payment_item_id;
      let url = `/api/protected/organisations/contributions/search?payment_item_id=${id}&year=${validate_data.year}&month=${validate_data.month}&date=${validate_data.date}&range=${validate_data.range}&status=${validate_data.status}&page=${page}&per_page=${per_page}`;
      let payload = {
        url: url,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
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
      this.$store.dispatch(
        "setSearchContributionParams",
        this.setSearchedPayload(data)
      );
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.loading = false;
          this.$store.commit("SET_PAGINATION", {
            sortBy: "name",
            descending: false,
            page: response.data.current_page,
            rowsPerPage: response.data.per_page,
            rowsNumber: response.data.total,
          });
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
          this.$emit("close-right-drawer");
        });

      return this.loading;
    },

    getMemberContributionsByPaymentItem(
      payment_item_id,
      user_id,
      transaction_status,
      payment_status
    ) {
      let pageNum = 1;
      let perPage = 10;
      let payload = {
        status: "none",
        url: `/api/protected/contributions/payment-items/${payment_item_id}/users/${user_id}?page=${pageNum}&per_page=${perPage}&transaction_status=${transaction_status}&payment_status=${payment_status}`,
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

    getTotalContributionByYear(session_id) {
      this.total_contributions = 0;
      let payload = {
        status: "none",
        url: `/api/protected/contributions/yearly/total?session_id=${session_id}`,
        has_path_val: false,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_TOTAL_YEARLY_CONTRIBUTION",
        has_commit: true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.total_contributions = res.data;
      });

      return this.total_contributions;
    },

    setSearchedPayload(data) {
      return {
        item: data.payment_item_id,
        status: data.status,
        year: data.year,
        month: data.month,
        date: data.date,
        range: data.range,
      };
    },

    validateSearchData(data, state, session_id, month, date, range) {
      return {
        status: data.status !== undefined ? data.status : state,
        year: data.year !== undefined ? data.year : session_id,
        month: data.month !== undefined ? data.month : month,
        date: data.date !== undefined ? data.date : date,
        range: data.date_range !== undefined ? data.date_range : range,
      };
    },

    setSearchRoute(data, status, year, month, date, range, amount) {
      this.$router.push({
        path: `/dashboard/contributions`,
        query: {
          payment_item_id:
            data.payment_item_id != undefined
              ? data.payment_item_id.label
              : data.payment_item_id,
          status: status,
          year: year,
          month: month,
          date: date,
          range: range,
          payment_item_amount:
            data.payment_item_id != undefined
              ? data.payment_item_id.amount
              : amount,
          t: new Date().getTime(),
        },
      });
    },
  },
};
</script>
