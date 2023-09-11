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
        url: `/api/protected/expenditure-categories/${category.id}/expenditure-items?status=ALL`,
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
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store.dispatch("getRequest", payload).then((response) => {
        if (response.success) {
            this.$store.commit("SET_PAGINATION", {
              sortBy: "name",
              descending: false,
              page: response.data.current_page,
              rowsPerPage: response.data.per_page,
              rowsNumber: response.data.total,
            });
          }
      }).finally(() => {
        this.$store.commit("SET_IS_FETCHING", false);
      });
    },

    getExpendituresByCategory(expenditure_category_id) {
      let payload = {
        status: "none",
        url: `/api/protected/expenditure-categories/${expenditure_category_id}/expenditure-items?status=ALL`,
        has_path_val: true,
        show_feedback: false,
        show_spinner:true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_EXPENDITURES",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => { });
    },

    fetchExpenditureItems(page, per_page, year_value, status, payment_item_value) {
      let category = this.$store.getters.getCurrentExpenditureCategory;
      let session_value =
        year_value == ""
          ? this.$store.getters.getCurrentYear.id
          : year_value.value;
      let payload = {
        status: "none",
        url: `/api/protected/expenditure-categories/${category.id}/expenditure-items?status=${status}&session_id=${session_value}&payment_item_id=${payment_item_value}&page=${page}&per_page=${per_page}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
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
    },

  }
}
</script>
