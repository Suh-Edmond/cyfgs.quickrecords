<script>
import CurrentYearMixin from "./CurrentYearMixin.vue";
export default {
  mixins: [CurrentYearMixin],
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    getOrganisationMemberSavings(id) {
      let session_id =
        this.getCurrentYear != null ? this.getCurrentYear.id : "";
      let payload = {
        url: `/api/protected/user-savings?organisation_id=${id}&session_id=${session_id}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: true,
        commit: "SET_ORGANISATION_MEMBERS_SAVINGS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    getMemberSavings(id, page, per_page, month, status) {
      let payload = {
        url: `/api/protected/user-savings/${id}?month=${month}&status=${status}&page=${page}&per_page=${per_page}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: true,
        commit: "SET_MEMBER_SAVINGS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    filterSaving(url) {
      let payload = {
        url: url,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: true,
        commit: "SET_ORGANISATION_MEMBERS_SAVINGS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.commit("SET_IS_FETCHING", true);
      this.loading = true;
      this.$store.dispatch("getRequest", payload).then((response) => {
        this.$store.commit("SET_PAGINATION", {
            sortBy: "name",
            descending: false,
            page: response.data.current_page,
            rowsPerPage: response.data.per_page,
            rowsNumber: response.data.total,
          });
      }).finally(() => {
        this.$store.commit("SET_IS_FETCHING", false);
        this.loading = false;
      });
    },

    getPaginatedOrganisationMemberSavings(
      id,
      page,
      per_page,
      month,
      session_id,
    ) {
      let payload = {
        url: `/api/protected/user-savings?organisation_id=${id}&session_id=${session_id}&page=${page}&per_page=${per_page}&month=${month}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        commit: "SET_ORGANISATION_MEMBERS_SAVINGS",
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
  },
};
</script>
