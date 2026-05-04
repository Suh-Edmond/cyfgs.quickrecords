<template>
  <div class="q-pa-md">
    <ClientsTable
      :data="data"
      :loading="loading"
      :columns="columns"
      :visibleColumns="visibleColumns"
    />
  </div>
</template>

<script>
import ClientsTable from "src/components/ClientsTable.vue";
import moment from "moment";
export default {
  mounted() {
    this.fetchClients();
  },
  data() {
    return {
      visibleColumns: [
        "name",
        "telephone",
        "email",
        "address",
        "region",
        "referral_code",
        "referred_code",
        "referral_count",
        "created_at",
        "updated_at",
        "updated_by",
        "subscription_status",
      ],
      columns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "telephone",
          align: "center",
          label: "Telephone",
          field: "telephone",
          sortable: true,
        },
        { name: "email", label: "Email", field: "email", sortable: true },
        { name: "address", label: "Address", field: "address", sortable: true },
        { name: "region", label: "Region", field: "region", sortable: true },
        {
          name: "referral_code",
          label: "Referral Code",
          field: "referral_code",
          sortable: true,
        },
        {
          name: "referred_code",
          label: "Referred Code",
          field: "referred_code",
          sortable: true,
        },
        {
          name: "referral_count",
          label: "Referral Count",
          field: "referral_count",
          sortable: true,
        },
        {
          name: "created_at",
          label: "Created At",
          field: "created_at",
          sortable: true,
        },
        {
          name: "updated_at",
          label: "Updated At",
          field: "updated_at",
          sortable: true,
        },
        {
          name: "updated_by",
          label: "Updated By",
          field: "updated_by",
          sortable: true,
        },
        {
          name: "subscription_plan",
          label: "Subscription Plan",
          field: "subscription_plan",
          sortable: true,
        },
        {
          name: "subscription_status",
          label: "Subscription Status",
          field: "subscription_status",
          sortable: true,
        },
        {
          name: "subscription_start_date",
          label: "Subscription Start Date",
          field: "subscription_start_date",
          sortable: true,
        },
        {
          name: "subscription_end_date",
          label: "Subscription End Date",
          field: "subscription_end_date",
          sortable: true,
        },
      ],
      data: [],
      loading: false,
    };
  },
  computed: {
    getData() {
      return this.data;
    },
  },
  methods: {
    fetchClients() {
      this.loading = true;
      let payload = {
        status: "none",
        url: `/api/protected/system-admin/fetch-organisations`,
        has_path_val: false,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "",
        has_commit: false,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: null,
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          console.log(response);
          this.data = response.data.map((ele) => {
            return {
              name: ele.name,
              telephone: ele.telephone,
              email: ele.email,
              address: ele.address,
              region: ele.region,
              referral_code: ele.referral_code,
              referred_code: ele.referred_code,
              referral_count: ele.referral_count,
              created_at: moment(ele.created_at).format("YYYY-MM-DD HH:mm:ss"),
              updated_at: moment(ele.updated_at).format("YYYY-MM-DD HH:mm:ss"),
              updated_by: ele.updated_by,
              subscription_plan: this.getSubscriptionPlan(ele.subscriptions[0]),
              subscription_status: this.getSubscriptionStatus(
                ele.subscriptions[0]
              ),
              subscription_start_date: this.formatSubscriptionStartDate(
                ele.subscriptions[0]
              ),
              subscription_end_date: this.formatSubscriptionEndDate(
                ele.subscriptions[0]
              ),
            };
          });
          this.loading = false;
        })
        .finally(() => {});
    },
    getSubscriptionPlan(data) {
      if (data != null && data != undefined) {
        return data.subscription_plan.billing_cycle;
      }
      return "-";
    },
    getSubscriptionStatus(data) {
      if (data != null && data.status != undefined) {
        return data.status;
      }
      return "-";
    },

    formatSubscriptionStartDate(data) {
      if (data != null && data != undefined) {
        return data.status === "active" || data.status === "past_due"
          ? moment(data.current_period_start_date).format("YYYY-MM-DD HH:mm:ss")
          : moment(data.trial_period_start_date).format("YYYY-MM-DD HH:mm:ss");
      }
      return "-";
    },

    formatSubscriptionEndDate(data) {
      if (data != null && data != undefined) {
        return data.status === "active" || data.status === "past_due"
          ? moment(data.current_period_end_date).format("YYYY-MM-DD HH:mm:ss")
          : moment(data.trial_period_end_date).format("YYYY-MM-DD HH:mm:ss");
      }
      return "-";
    },
  },
  components: {
    ClientsTable,
  },
};
</script>
