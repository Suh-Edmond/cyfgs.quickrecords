<script>
export default {
  data() {
    return {
    };
  },

  computed: {
    getCurrentYear(){
      return this.$store.getters.getCurrentYear;
    }
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
  },
};
</script>
