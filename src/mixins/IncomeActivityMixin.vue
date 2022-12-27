<script>
import organisationMixinVue from "./organisationMixin.vue";


export default {
  mixins: [organisationMixinVue],
  methods: {
    getOrganisationIncomeActivities() {
      let organisationId = this.getOrganisationId;
      let payload = {
        url: `/api/protected/organisations/${organisationId}/income-activities`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch income activities",
        has_commit: true,
        show_feedback: false,
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
