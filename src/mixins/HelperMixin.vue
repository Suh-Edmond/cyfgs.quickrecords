<script>
import { LocalStorage } from "quasar";
export default {
  data() {
    return {
      loading_download: false,
      registration_statuses: new Map([
        ["Registered", "REGISTERED"],
        ["Non-registered", "NOT_REGISTERED"],
        ["Pending", "PENDING"],
        ["Declined", "DECLINED"],
        ["All", "ALL"],
        ["Active", "ACTIVE"],
        ["In-active", "IN_ACTIVE"],
      ]),
      payment_items_type: new Map([
        ["All Members", "ALL_MEMBERS"],
        ["A Member", "A_MEMBER"],
        ["Members with roles", "MEMBERS_WITH_ROLES"],
        ["Members without roles", "MEMBERS_WITHOUT_ROLES"],
        ["Grouped members", "GROUPED_MEMBERS"],
        ["All", "ALL"],
      ]),
      payment_frequencies: new Map([
        ["Yearly", "YEARLY"],
        ["Monthly", "MONTHLY"],
        ["One-time", "ONE_TIME"],
        ["All", "ALL"],
      ]),
      payment_states: new Map([
        ["Pending", "PENDING"],
        ["Approved", "APPROVED"],
        ["Declined", "DECLINED"],
        ["All", "ALL"],
      ]),
      transaction_statuses: new Map([
        ["Incomplete", "INCOMPLETE"],
        ["Complete", "COMPLETE"],
        ["All", "ALL"],
      ]),
      genders_list: new Map([
        ["Male", "MALE"],
        ["Female", "FEMALE"],
        ["All", "ALL"],
        ["Other", "OTHER"],
      ]),
      payment_item_states: new Map([
        ["Active", "active"],
        ["Expired", "expired"],
        ["All", "ALL"],
      ]),
      compulsory_list: new Map([
        ["Compulsory", { name: "Compulsory", value: 1 }],
        ["Not Compulsory", { name: "Not Compulsory", value: 0 }],
        ["All", { name: "All", value: "ALL" }],
      ]),
    };
  },
  computed: {},
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
        error_msg: this.$t("app.downloadFileErrorMsg"),
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
            message: this.$t("app.downloadFileErrorMsg"),
            position: Platform.is.mobile ? "bottom-left" : "top-right",
          });
        });

      return this.loading_download;
    },

    checkTreasurerRoleOnly() {
      const auth_role = LocalStorage.getItem("data").user_data.roles;
      const istreasurer_only = LocalStorage.getItem("data")
        .user_data.roles.map((role) => role.name)
        .filter(
          (role) =>
            (role == "MEMBER" || role == "TREASURER") &&
            (role != "ADMIN" || role != "FINANCIAL_SECRETARY")
        );
      return istreasurer_only.length == auth_role.length;
    },

    canValidateTransaction() {
      const istreasurer = LocalStorage.getItem("data")
        .user_data.roles.map((role) => role.name)
        .find((role) => role == "TREASURER" || role == "ADMIN");
      return istreasurer != undefined;
    },

    computeTotal(data) {
      let total = 0;
      data.forEach((ele) => {
        total += ele.amount_deposited;
      });
      return total;
    },

    formatConstants(data) {
      return data.replaceAll("_", " ");
    },

    indexRegistrationStatus(status) {
      return status != "" && status != "undefined" && status != null
        ? this.registration_statuses.get(status)
        : "";
    },
    indexPaymentItemType(type) {
      return type != "" && type != "undefined" && type != null
        ? this.payment_items_type.get(type)
        : "";
    },
    indexPaymentFrequency(frequency) {
      return frequency != "" && frequency != "undefined" && frequency != null
        ? this.payment_frequencies.get(frequency)
        : "";
    },
    indexPaymentStatus(status) {
      return status != "" && status != "undefined" && status != null
        ? this.payment_states.get(status)
        : "";
    },
    indexTransactionStatus(status) {
      return status != "" && status != "undefined" && status != null
        ? this.transaction_statuses.get(status)
        : "";
    },
    indexGender(sex) {
      return sex != "" && sex !== "undefined" && sex != null
        ? this.genders_list.get(sex)
        : "";
    },
    indexPaymentItemStates(state) {
      return state != "" && state != "undefined" && state != null
        ? this.payment_item_states.get(state)
        : "";
    },
    indexCompulsory(state) {
      return state != "" && state != "undefined" && state != null
        ? this.compulsory_list.get(state)
        : "";
    },
  },
};
</script>
