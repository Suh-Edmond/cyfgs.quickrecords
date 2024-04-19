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
        error_msg: this.$t('app.defaultErrorMsg'),
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

    fetchOrganisationExpenditureCategories(organisation_id, page, per_page, sort_by, year, filter) {
      let payload = {
        url: `/api/protected/organisations/${organisation_id}/expenditure-categories?year=${year}&page=${page}&per_page=${per_page}&sort_by=${sort_by}&filter=${filter}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        commit: "SET_EXPENDITURE_CATEGORIES",
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
          }
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
        });
    }
  },
};
</script>
