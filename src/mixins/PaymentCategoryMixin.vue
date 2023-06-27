<script>
import CurrentYearMixinVue from './CurrentYearMixin.vue';
export default {
  mixins:[CurrentYearMixinVue],
  mounted(){
    this.fetchCurrentYear();
  },
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
    fetchCategories(organisation_id, show_spinner) {
      let year = this.$store.getters.getCurrentYear != null ? this.$store.getters.getCurrentYear.year: null;
      let payload = {
        url: `/api/protected/organisation/payment-categories?organisation_id=${organisation_id}&year=${year}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch payment categories",
        has_commit: true,
        show_feedback: false,
        show_spinner:show_spinner,
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
