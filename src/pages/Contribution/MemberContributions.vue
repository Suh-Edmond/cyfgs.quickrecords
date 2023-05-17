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

    <div v-if="!getLoadingState">
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
            no-caps
            icon-right="print"
            @click="downloadContributions"
          ></q-btn>
        </div>
      </div>
      <!-- table for contributions -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue
            :columns="columns"
            :data="getMemberContributions"
            :label="label"
            :message="message"
            :show_savings="false"
            :show_income_activity="false"
            :show_members="false"
            :show_contribution="false"
            :title="getTableTile"
            :total_contribution="getTotalMemberContribution"
            :total_balance="getTotalBalance"
            :show_member_contribution="true"
            @view-contribution="viewContribution"
            @edit-contribution="editContribution"
          >
          </TableVue>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableVue from "src/components/Table.vue";
import ContributionsMixin from "src/mixins/ContributionsMixin.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";
export default {
  mixins: [ContributionsMixin, HelperMixin],

  mounted() {
    this.getMemberContributionsByPaymentItem(
      this.$router.currentRoute.params.item_id,
      this.$router.currentRoute.params.id
    );
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
          name: "approve",
          align: "left",
          label: "Transaction Status",
          field: "approve",
          sortable: true,
        },
        {
          name: "action",
          label: "Action",
          align: "left",
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

    getTableTile() {
      let title = "";
      if (this.$store.getters.getMemberContributions.length != 0) {
        title = `${this.$store.getters.getMemberContributions[0].user_name} Contributions for ${this.$store.getters.getMemberContributions[0].payment_item_name}`;
      }
      return title;
    },

    //total by payment item
    getTotalMemberContribution() {
      let total = 0.0;
      this.$store.getters.getMemberContributions.forEach((ele) => {
        total += ele.amount_deposited;
      });
      return total;
    },

    //balance by payment item
    getTotalBalance() {
      let total = this.getTotalMemberContribution;
      let payment_item_amount =
        this.$store.getters.getMemberContributions.length > 0
          ? this.$store.getters.getMemberContributions[0].payment_item_amount
          : 0;
      return payment_item_amount - total;
    },

    getMemberContributions() {
      let data = [];
      this.$store.getters.getMemberContributions.forEach((ele) => {
        data.push({
          counter: this.$store.getters.getMemberContributions.indexOf(ele) + 1,
          amount_deposited: ele.amount_deposited,
          total_amount_deposited: ele.total_amount_deposited,
          id: ele.id,
          approve: ele.approve,
          balance: ele.balance,
          payment_item_amount: ele.payment_item_amount,
          payment_item_id: ele.payment_item_id,
          payment_item_complusory: ele.payment_item_compulsory,
          payment_item_name: ele.payment_item_name,
          payment_category: ele.payment_category,
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
      return data;
    },
  },
  methods: {
    viewContribution(data) {
      this.$emit("view-contribution", data);
    },
    editContribution(data) {
      this.$emit("edit-contribution", data);
    },

    downloadContributions() {
      let payment_item_id = this.$router.currentRoute.params.item_id;
      let user_id = this.$router.currentRoute.params.id;

      let url = `/api/protected/download-user-contributions?payment_item_id=${payment_item_id}&user_id=${user_id}`;

      let file_name =
        "Member's Contribution for "
        ".pdf";
      this.loading = this.downloadPdf(url, file_name);
    },
  },
  components: {
    TableVue,
  },
};
</script>

<style lang="scss" scoped></style>
