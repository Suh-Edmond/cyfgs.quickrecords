<script>
export default {
  data() {
    return {
      total: 0,
      expenditure_statistics: null,
    };
  },
  methods: {
    getExpenditureDetailsByItemId(id, page, per_page) {
      let payload = {
        url: `/api/protected/expenditure-items/${id}/details?page=${page}&per_page=${per_page}&status=`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        show_feedback: false,
        show_spinner: false,
        commit: "",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
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

            this.$store.commit("SET_EXPENDITURE_ITEM_DETAIL", response.data);
          }
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
        });
    },

    getTotalYearlyExpenditures(id) {
      let payload = {
        url: `/api/protected/expenditures_total?session_id=${id}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        commit: "SET_TOTAL_YEARLY_EXPENDITURE",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {});
    },
  },
};
</script>
