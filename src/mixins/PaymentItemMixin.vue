<script>
export default {
  data() {

  },
  methods: {
    getPaymentItemsByCategory() {
      return this.$store.getters.getCurrentPaymentCategory
    }
  }
}
</script>
