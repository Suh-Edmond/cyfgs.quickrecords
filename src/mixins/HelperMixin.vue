<script>
import { LocalStorage } from 'quasar';
export default {
  data() {
    return {
      loading: false,
    }
  },
  computed: {

  },
  methods: {
    downloadPdf(url, file_name) {
      let payload = {
        status: "none",
        url: url,
        has_path_val: true,
        show_feedback: true,
        msg: "none",
        file_name: file_name,
        color: "default",
        error_msg: "Could not download pdf file",
        commit: "none",
        has_commit: false,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };

      this.loading = true;
      this.$store
        .dispatch("downloadPdf", payload)
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          Notify.create({
            type: "info",
            message: "Could not download pdf file",
            position: Platform.is.mobile ? "bottom-left" : "top-right",
          });
        });

      return this.loading
    },

    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name == "TREASURER"
      );
      return treasurer_role != undefined;
    },

    computeTotal(data) {
      let total = 0;
      data.forEach((ele) => {
        total += ele.amount_deposited
      })
      return total;
    }
  }
}
</script>
