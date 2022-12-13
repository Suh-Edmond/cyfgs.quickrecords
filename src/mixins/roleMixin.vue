<script>
export default {
  methods: {
    getAllRoles() {
      let roles = [];
      let payload = {
        url: `/api/protected/roles`,
        msg: "none",
        color: "default",
        status:"none",
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        res.data.forEach(element => {
            roles.push({
              name : element.name,
              id: element.id
            })
        });
        this.$store.dispatch("setRoles", roles);
      }).finally(() => {
      })
    }
  }

}
</script></script>
