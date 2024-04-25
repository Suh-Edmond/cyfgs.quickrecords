<script>
import { LocalStorage } from 'quasar';
export default {
  data() {
    return {
      loading_download: false,
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
        error_msg:this.$t('app.downloadFileErrorMsg'),
        commit: "none",
        has_commit: false,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };

      this.loading_download = true;
      this.$store
        .dispatch("downloadPdf", payload)
        .then(() => {
          this.loading_download = false;
        })
        .catch(() => {
          Notify.create({
            type: "info",
            message: this.$t('app.downloadFileErrorMsg'),
            position: Platform.is.mobile ? "bottom-left" : "top-right",
          });
        });

      return this.loading_download
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
    },

    formatConstants(data){
      return data.replace("_", " ");
    }
  }
}
</script>
