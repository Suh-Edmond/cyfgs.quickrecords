<script>
export default {
  data() {
    return {
      loading: false,
    }
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
    }
  }
}
</script>
