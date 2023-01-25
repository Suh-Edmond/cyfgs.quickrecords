<script>
export default {
  data() {
    return {

    }
  },

  methods: {
    getExpenditureItemsByCategory(){
      let category = this.$store.getters.getCurrentExpenditureCategory;
      let payload = {
        status: "none",
        url: `/api/protected/expenditure-categories/${category.id}/expenditure-items?status=PENDING`,//using status 0 which is the unapproved
        has_path_val: true,
        show_feedback: false,
        show_spinner:true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_EXPENDITURE_ITEMS",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => { });
    }
  }
}
</script>
