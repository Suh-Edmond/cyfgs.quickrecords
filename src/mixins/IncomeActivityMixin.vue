<script>


export default {

  methods: {
    // getOrganisationIncomeActivities(organisation_id) {
    //   let payload = {
    //     url: `/api/protected/organisations/${organisation_id}/income-activities`,
    //     msg: "none",
    //     color: "default",
    //     status: "none",
    //     error_msg: this.$t('app.defaultErrorMsg'),
    //     has_commit: true,
    //     show_feedback: false,
    //     show_spinner:true,
    //     commit: "SET_INCOME_ACTIVITIES",
    //     to_be_store_data: {
    //       required: false,
    //       has_value: false,
    //       data: [],
    //     },
    //   };
    //   this.$store.dispatch("getRequest", payload).then(() => {

    //   });
    // },

    getOrganisationIncomeActivities(organisation_id, page, per_page, filter) {
      let payload = {
        url: `/api/protected/organisations/${organisation_id}/income-activities?page=${page}&per_page=${per_page}&filter=${filter}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        commit: "SET_INCOME_ACTIVITIES",
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
        });
    }
  }
}
</script>
