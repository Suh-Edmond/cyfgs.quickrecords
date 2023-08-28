<script>
export default {
  data() {
    return {
      total: 0,
      expenditure_statistics: null,
    };
  },
  methods: {
    getExpenditureDetailsByItemId(id) {
      let payload = {
        url: `/api/protected/expenditure-items/${id}/details`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: true,
        commit: "SET_EXPENDITURE_ITEM_DETAIL",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
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
