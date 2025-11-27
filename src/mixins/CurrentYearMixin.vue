<script>
import { LocalStorage } from 'quasar';
export default {
  data() {
    return {};
  },

  computed: {

    getSessionsFromState() {
      let data = [];
      this.$store.getters.getSessions.forEach((ele) => {
        data.push({
          value: ele.id,
          label: ele.year,
        });
      });

      return data;
    },
  },

  methods: {
    fetchCurrentYear() {
      let payload = {
        status: "none",
        url: `/api/protected/sessions/current`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_CURRENT_YEAR",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        return res;
      });
    },

    getSessions() {
      let payload = {
        status: "none",
        url: `/api/protected/sessions`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_SESSIONS",
        has_commit: true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },
    getCurrentYear() {
      return LocalStorage.getItem("data").current_session.id;
    }
  },
};
</script>
