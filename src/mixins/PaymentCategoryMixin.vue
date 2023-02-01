<script>

export default {
  data() {
    return {
    };
  },

  computed: {
    getPaymentCategories() {
      let data = [];
      this.$store.getters.getPaymentCategories.forEach((ele) => {
        data.push({
          label: ele.name,
          value: ele.id,
        });
      })

      return data;
    },

  },



  methods: {
    fetchCategories(organisation_id) {
      let payload = {
        url: `/api/protected/organisations/${organisation_id}/payment-categories`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch payment categories",
        has_commit: true,
        show_feedback: false,
        show_spinner:true,
        commit: "SET_PAYMENT_CATEGORIES",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {

      });
    },
  },
};
</script>
