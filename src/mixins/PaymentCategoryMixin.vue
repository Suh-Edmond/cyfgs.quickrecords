<script>
import { LocalStorage } from "quasar";
import CurrentYearMixinVue from "./CurrentYearMixin.vue";
export default {
  mixins: [CurrentYearMixinVue],
  mounted() {},
  data() {
    return {};
  },

  computed: {
    getPaymentCategories() {
      let data = [];
      this.$store.getters.getPaymentCategories.forEach((ele) => {
        data.push({
          label: ele.name,
          value: ele.id,
        });
      });

      return data;
    },
  },

  methods: {
    fetchCategories(organisation_id, show_spinner) {
      let year = LocalStorage.getItem("data").current_session.year;
      let payload = {
        url: `/api/protected/organisation/payment-categories?organisation_id=${organisation_id}&year=${year}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: show_spinner,
        commit: "SET_PAYMENT_CATEGORIES",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    fetchOrganisationCategories(
      organisation_id,
      page,
      per_page,
      sort_by,
      year,
      filter
    ) {
      let search_filter = filter === undefined ? "" : filter;
      let payload = {
        url: `/api/protected/organisation/payment-categories?organisation_id=${organisation_id}&year=${year}&page=${page}&per_page=${per_page}&sort_by=${sort_by}&filter=${search_filter}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        commit: "SET_PAYMENT_CATEGORIES",
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
    },
  },
};
</script>
