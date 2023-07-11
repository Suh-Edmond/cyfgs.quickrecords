<script>
export default {
  data(){
    return {
        total: 0,
    }
  },
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

    getTotalYearlyExpenditures(id) {
      let payload = {
        url: `api/protected/expenditures_total?session_id=${id}`,
        msg: "msg",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch payment categories",
        has_commit: false,
        show_feedback: false,
        show_spinner:false,
        commit: "",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        if(res){
          this.total = res.data
        }
      });

      return this.total;
    }
  }
}
</script>
