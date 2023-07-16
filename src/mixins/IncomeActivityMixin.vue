<script>


export default {

  methods: {
    getOrganisationIncomeActivities(organisation_id) {
      let payload = {
        url: `/api/protected/organisations/${organisation_id}/income-activities`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t('app.defaultErrorMsg'),
        has_commit: true,
        show_feedback: false,
        show_spinner:true,
        commit: "SET_INCOME_ACTIVITIES",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {

      });
    }
  }
}
</script>
