<script>
import organisationMixinVue from "./organisationMixin.vue";

export default {
  mixins: [organisationMixinVue],
  data() {
    return {
    };
  },
  methods: {
    fetchExpenditureCategories() {
      let organisationId = this.getOrganisationId;
      let payload = {
        url: `/api/protected/organisations/${organisationId}/expenditure-categories`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch payment categories",
        has_commit: true,
        show_feedback: false,
        show_spinner:true,
        commit: "SET_EXPENDITURE_CATEGORIES",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {

      });
    },
  },
};
</script>
