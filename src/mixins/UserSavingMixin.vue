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
        url: `/api/protected/savings?organisation_id=${id}&session_id=${session_id}`,
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
        commit: "SET_SAVINGS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading = true;
      this.$store.dispatch("getRequest", payload).then(() => {
        this.loading = false;
      });
    },
  },
};
</script>
