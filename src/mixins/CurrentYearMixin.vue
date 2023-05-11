<script>
export default {
  data() {
    return {
    };
  },

  computed: {
    getCurrentYear(){
      return this.$store.getters.getCurrentYear;
    },

    getSessionsFromState() {
      let data = [];
      let current_session = this.$store.getters.getCurrentYear;
      this.$store.getters.getSessions.forEach((ele) => {
        if (ele.year == current_session.year && ele.id == current_session.id) {
          data.push({
            value: ele.id,
            label: ele.year + " Current",
          });
        } else {
          data.push({
            value: ele.id,
            label: ele.year,
          });
        }
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
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    getSessions(){
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
      this.$store
        .dispatch("getRequest", payload)
        .then(() => {
        })
    }
  },
};
</script>
