<script>
export default {
  methods: {
    getExpenditureDetailsByItemId(id) {
      let payload = {
        url: `/api/protected/expenditure-items/${id}/details`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch payment categories",
        has_commit: true,
        show_feedback: false,
        show_spinner:true,
        commit: "SET_EXPENDITURE_ITEM_DETAIL",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {
      });
    },


  }
}
</script>
