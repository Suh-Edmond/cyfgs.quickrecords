<template>
  <div class="q-pa-sm">
    <!-- spinner when fetching data -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-lg"
        v-if="getLoadingState"
      />
    </div>


    <!-- contributions available -->
    <div
      class="row justify-end"
      :class="$q.screen.lg ? 'q-pa-sm' : ''"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
    >
      <div>
        <q-btn
          :label="label_print"
          :loading="loading"
          :color="color_print"
          no_caps
          icon-right="print"
        ></q-btn>
      </div>
    </div>
    <!-- table for contributions -->
    <div class="row q-pt-sm">
      <div class="col-md-12 col-xs-12 col-sm-12">
        <TableVue
          :columns="columns"
          :data="data"
          :label="label"
          :message="message"
          :show_savings="false"
          :show_income_activity="false"
          :show_members="false"
          :show_contribution="false"
          :title="title"
          :show_member_contribution="true"
          @view-contribution="viewContribution"
          @edit-contribution="editContribution"
        >
        </TableVue>
      </div>
    </div>
  </div>
</template>

<script>
import TableVue from "src/components/Table.vue";
export default {
  mounted() {
    this.getMembersContributions(this.$router.currentRoute.params.item_id, this.$router.currentRoute.params.id);
  },
  data() {
    return {
      label_print: "Print",
      color_print: "positive",
      label_fetch_user: "Filter",
      loading: false,
      color: "primary",
      no_caps: true,
      message: "Are you sure you want to delete this member's contribution ?",
      label: "Delete",
      title: "",
      columns: [
        {
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
        },
        {
          name: "user_name",
          required: true,
          label: "Member's Name",
          align: "left",
          field: (row) => row.user_name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "amount_deposited",
          align: "left",
          label: "Amount Deposited (XAF)",
          field: "amount_deposited",
        },
        {
          name: "balance",
          align: "left",
          label: "Balance (XAF)",
          field: "balance",
        },
        {
          name: "status",
          align: "left",
          label: "Payment Status",
          field: "status",
        },
        {
          name: "date",
          align: "left",
          label: "Date",
          field: "date",
        },
        {
          name: "state",
          align: "left",
          label: "Transaction Status",
          field: "state",
          sortable: true,
        },
        {
          name: "action",
          label: "Action",
          field: "action",
        },
      ],
      data: [],
    };
  },
  computed: {
    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },
  methods: {
    getMembersContributions(payment_item_id, user_id) {
      let payload = {
        status: "none",
        url: `/api/protected/contributions/payment-items/${payment_item_id}/users/${user_id}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          this.title = `${res.data[0].user_name} Contributions for ${res.data[0].payment_item_name}`
          res.data.forEach((ele) => {
            this.data.push({
              counter: res.data.indexOf(ele) + 1,
              amount_deposited: ele.amount_deposited,
              total_amount_deposited:ele.total_amount_deposited,
              id: ele.id,
              approve: ele.approve,
              balance: ele.balance,
              payment_item_amount: ele.payment_item_amount,
              payment_item_id: ele.payment_item_id,
              payment_item_complusory: ele.payment_item_complusory,
              payment_item_name: ele.payment_item_name,
              comment: ele.comment,
              code: ele.code,
              type: "MEMBERS_CONTRIBUTIONS",
              complusory: ele.complusory,
              created_at: ele.created_at,
              updated_by: ele.updated_by,
              status: ele.status,
              user_id: ele.user_id,
              user_name: ele.user_name,
              user_telephone: ele.user_telephone,
            });
          });
        })
        return this.data
    },

    viewContribution(data) {
      this.$emit("view-contribution", data);
    },
    editContribution(data) {
      this.$emit("edit-contribution", data);
    },
  },
  components: {
    TableVue,
  },
};
</script>

<style lang="scss" scoped></style>
