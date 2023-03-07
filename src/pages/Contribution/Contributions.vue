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
    <div v-if="!checkTreasurerRole()">
      <div
        class="row q-ml-xs q-pt-md justify-between"
        :class="$q.screen.lg ? 'q-pa-md' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div>
          <q-btn
            :label="label_fetch"
            :color="color"
            :disabled="false"
            no-caps
            icon-right="filter_list"
            @click="openSearchBar()"
          >
          </q-btn>
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn
            :label="label_download"
            :loading="loading"
            :color="color_print"
            :disabled="getTableData == 0"
            no-caps
            icon-right="print"
            @click="downloadContributions()"
          ></q-btn>
        </div>
      </div>
      <!-- table for contributions -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue
            :columns="columns"
            :data="getTableData"
            :label="label"
            :message="message"
            :show_savings="false"
            :show_income_activity="false"
            :show_members="false"
            :show_member_savings="false"
            :show_contribution="true"
            :show_member_contribution="false"
            :total_contribution="total_contribution"
            @view-contribution="viewContribution"
            @edit-contribution="editContribution"
            :title="getTableTitleForSearchContributions"
          >
          </TableVue>
        </div>
      </div>
    </div>

    <!-- table for filtered savings so they can be approve/decline-->
    <div v-if="checkTreasurerRole()">
      <div
        class="row q-ml-xs q-pt-md justify-between"
        :class="$q.screen.lg ? 'q-pa-md' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div>
          <q-btn
            :label="label_fetch"
            :color="color"
            :disabled="false"
            no-caps
            icon-right="filter_list"
            @click="openSearchBar()"
          >
          </q-btn>
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn
            :label="label_download"
            :loading="loading"
            :color="color_print"
            :disabled="getFilteredContributions.length == 0"
            no-caps
            icon-right="print"
            @click="downloadContributions()"
          ></q-btn>
        </div>
      </div>

      <!-- table for filtered savings -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue
            :columns="columns"
            :data="getFilteredContributions"
            :label="label"
            :message="message"
            :show_savings="false"
            :show_income_activity="false"
            :show_members="false"
            :show_member_contribution="false"
            :show_contribution="true"
            :total_contribution="total_contribution"
            :title="getTableTitleForSearchContributions"
          >
          </TableVue>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableVue from "src/components/Table.vue";
import PaymentCategoryMixinVue from "src/mixins/PaymentCategoryMixin.vue";
import PaymentItemMixinVue from "src/mixins/PaymentItemMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import HelperMixinVue from 'src/mixins/HelperMixin.vue';
import { LocalStorage } from "quasar";

export default {
  mixins: [PaymentCategoryMixinVue, PaymentItemMixinVue, organisationMixinVue, HelperMixinVue],

  mounted() {
  },

  data() {
    return {
      label_print: "Print",
      color_print: "positive",
      payment_item_id: null,
      label_fetch: "Filter",
      label_download: "Print",
      loading: false,
      color: "primary",
      message: "Are you sure you want to delete this member's contribution ?",
      label: "Delete",
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
          name: "total_amount_deposited",
          align: "left",
          label: "Total Amount Deposited (XAF)",
          field: "total_amount_deposited",
        },
        {
          name: "balance",
          align: "left",
          label: "Balance (XAF)",
          field: "balance",
        },
        {
          name: "action",
          label: "Action",
          field: "action",
          align: "left",
        },
      ],
      start_filter: false,
      filteredContributions: [],
      loading_filter: false,
      total_contribution:0.0
    };
  },
  computed: {
    validateFilter() {
      return this.payment_item_id !== null ? false : true;
    },

    getTableData() {
      let data = [];
      if(this.getMembersContributionsByPaymentItem.length != 0) {
        data = this.getMembersContributionsByPaymentItem;
      }else {
        data = this.getFilteredContributions;
      }
      return data;
    },
    getMembersContributionsByPaymentItem() {
      let data = [];

      if (this.$store.getters.getMembersContributionsByPaymentItem != null) {
        this.$store.getters.getMembersContributionsByPaymentItem.data.forEach(
          (ele) => {
            this.total_contribution += ele.total_amount_deposited
            data.push({
              counter:
                this.$store.getters.getMembersContributionsByPaymentItem.data.indexOf(
                  ele
                ) + 1,
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
              organisation_id: ele.organisation_id,
              created_at: ele.created_at,
              updated_by: ele.updated_by,
              status: ele.status,
              user_id: ele.user_id,
              user_name: ele.user_name,
              user_telephone: ele.user_telephone,
            });
          }
        );
      }
      return data;
    },

    setTableTitle() {
      let name = "";
      let amount = 0;
      let title = "";
      if (this.$store.getters.getCurrentPaymentItem != null) {
        name = this.$store.getters.getCurrentPaymentItem.name;
        amount = this.$store.getters.getCurrentPaymentItem.amount;
      }
      if (
        this.$store.getters.getCurrentPaymentItem != null &&
        this.$store.getters.getCurrentContributionPaymentItem != null
      ) {
        title =
          `Contributions for ${name}, Amount Payable: ` +
          Number(amount).toLocaleString() +
          "  XAF";
      }
      return title;
    },

    checkIsExistPaymentItem() {
      return this.getPaymentItems.length > 0;
    },

    getFilteredContributions() {
      let data = [];
      if (this.$store.getters.getFilteredContributions != null) {
        this.$store.getters.getFilteredContributions.forEach((ele) => {
          this.total_contribution+=ele.total_amount_deposited
          data.push({
            counter: this.$store.getters.getFilteredContributions.indexOf(ele) + 1,
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
      }
      return data;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getTableTitleForSearchContributions() {
      return this.$store.getters.getSearchSavingParams != undefined
        ? `Members Contributions for ${this.$store.getters.getSearchSavingParams.payment_item_id.name}, Amount Payable:  ${Number(this.$store.getters.getSearchSavingParams.payment_item_id.amount).toLocaleString()} XAF`
        : "";
    },
  },

  watch: {

  },

  methods: {
    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name == "TREASURER"
      );
      return treasurer_role != undefined;
    },

    viewContribution(data) {
      this.$emit("view-contribution", data);
    },

    editContribution(data) {
      this.$store.dispatch("setSelectedContribution", data.data);

      this.$emit("edit-contribution", data);
    },

    getSelectedPaymentItem() {
      let item = null;
      item = this.$store.getters.getPaymentItems.data.filter(
        (ele) => ele.id === this.payment_item_id.value
      );
      this.$store.dispatch("setCurrentPaymentItem", item[0]); //set the state with the first element from the filtered array
    },

    filterContributions() {
      this.filteredContributions = [];
      let payload = {
        status: "none",
        url: `/api/protected/organisation/contributions/search?payment_item_id=${this.payment_item_id.value}&month=${this.month}&year=${this.year}&status=${this.status}`,
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
      this.loading_filter = true;
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          this.start_filter = true;

          res.data.data.forEach((ele) => {
            this.filteredContributions.push({
              counter: res.data.data.indexOf(ele) + 1,
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
        .finally(() => {
          this.loading_filter = false;
        });
    },

    openSearchBar() {
      let payload = {
        data: null,
        tab: "Search Members Contributions",
      };

      this.$emit("search-members-contribution", payload);
    },

    downloadContributions() {
      let payment_item_id = this.$store.getters.getSearchSavingParams.payment_item_id.id;
      let month = this.$store.getters.getSearchSavingParams.month;
      let year = this.$store.getters.getSearchSavingParams.year;
      let status = this.$store.getters.getSearchSavingParams.status
      let url = `/api/protected/download-contributions?payment_item_id=${payment_item_id}&month=${month}&year=${year}&status=${status}`;

      let file_name = "Member's Contribution for "+this.$store.getters.getSearchSavingParams.payment_item_id.name +".pdf";
      this.loading = this.downloadPdf(url, file_name);
    },
  },
  components: {
    TableVue,
  },
};
</script>

<style lang="scss" scoped>
</style>
