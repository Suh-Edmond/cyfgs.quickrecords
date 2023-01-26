<template>
  <div class="q-pa-sm">
    <!-- spinner when fetching data -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-lg"
        v-if="loading_filter"
      />
    </div>
    <!-- no contributions available -->
    <!-- <NotFound :message="not_found_msg" v-if="getMembersContributionsByPaymentItem.length == 0"></NotFound> -->

    <div>
      <!-- contributions available -->
      <div
        class="row q-ml-xs q-gutter-md"
        :class="$q.screen.lg ? 'q-px-sm q-pb-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12">
          <q-select
            v-model="payment_category_id"
            outlined
            dense
            :options="getPaymentCategories"
            label="Payment Category"
            @input="fetchPaymentItems"
          />
        </div>
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12">
          <q-select
            v-model="payment_item_id"
            outlined
            dense
            :options="getPaymentItems"
            label="Payment Item"
            @input="getSelectedPaymentItem"
          />
          <small
            v-if="payment_category_id != null && !checkIsExistPaymentItem"
            class="noPaymentItems"
            >No Payment items found under this category</small
          >
        </div>
        <div class="col-md-1 col-lg-1 col-xs-12 col-sm-12">
          <q-select
            v-model="year"
            outlined
            dense
            :options="years"
            label="Year"
          />
        </div>
        <div class="col-md-1 col-lg-1 col-xs-12 col-sm-12">
          <q-select
            v-model="month"
            outlined
            dense
            :options="months"
            label="Month"
            input-debounce="0"
            @filter="filterMonths"
            use-input
            hide-selected
            fill-input
          />
        </div>
        <div class="col-md-1 col-lg-1 col-xs-12 col-sm-12">
          <q-select
            v-model="status"
            outlined
            dense
            :options="statuses"
            label="Status"
          />
        </div>
        <div
          class="col-md-1 col-lg-1 col-xs-12 col-sm-12"
          :style="$q.screen.lg ? 'margin-left:75px' : ''"
        >
          <q-btn
            :label="label_fetch"
            :loading="loading_filter"
            :color="color"
            :disabled="validateFilter"
            no-caps
            icon-right="filter_list"
            @click="filterContributions"
          >
          </q-btn>
        </div>
        <div
          class="col-md-1 col-lg-1 col-xs-12 col-sm-12"
          :style="$q.screen.lg ? 'margin-left:170px' : ''"
        >
          <q-btn
            :label="label_print"
            :loading="loading"
            :color="color_print"
            :disabled="false"
            no-caps
            icon-right="print"
          ></q-btn>
        </div>
      </div>
      <!-- table for contributions -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue
            :columns="columns"
            :data="filteredContributions"
            :label="label"
            :message="message"
            :show_savings="false"
            :show_income_activity="false"
            :show_members="false"
            :show_member_savings="false"
            :show_contribution="true"
            @view-contribution="viewContribution"
            @edit-contribution="editContribution"
            :title="setTableTitle"
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

export default {
  mixins: [PaymentCategoryMixinVue, PaymentItemMixinVue],

  mounted() {
    this.fetchCategories();
  },

  data() {
    return {
      not_found_msg:
        "Ooops!! No Contributions have been record, Click the add to record contribution.",
      label_print: "Print",
      color_print: "positive",
      payment_item_id: null,
      year: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
      label_fetch: "Filter",
      loading: false,
      color: "primary",
      no_caps: true,
      message: "Are you sure you want to delete this member's contribution ?",
      label: "Delete",
      month: null,
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      statuses: [
        "PENDING",
        "APPROVED",
        "UNAPPROVED",
        "INCOMPLETE",
        "COMPLETE",
        "ALL",
      ],
      status: null,
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
          label: "Status",
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
          label: "Status",
          field: "state",
          sortable: true,
        },
        {
          name: "action",
          label: "Action",
          field: "action",
          align:"left"
        },
      ],
      payment_category_id: null,
      start_filter: false,
      filteredContributions: [],
      loading_filter: false,
    };
  },
  computed: {
    validateFilter() {
      return this.payment_item_id !== null ? false : true;
    },

    getMembersContributionsByPaymentItem() {
      let data = [];

      if (this.$store.getters.getMembersContributionsByPaymentItem != null) {
        this.$store.getters.getMembersContributionsByPaymentItem.data.forEach(
          (ele) => {
            console.log(ele);
            data.push({
              counter:
                this.$store.getters.getMembersContributionsByPaymentItem.data.indexOf(
                  ele
                ) + 1,
              amount_deposited: ele.amount_deposited,
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
  },

  watch: {
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
  },

  methods: {
    filterMonths(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.months = this.months.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    viewContribution(data) {
      this.$emit("view-contribution", data);
    },

    editContribution(data) {
      this.$store.dispatch("setSelectedContribution", data.data);

      this.$emit("edit-contribution", data);
    },

    fetchPaymentItems() {
      this.getPaymentItemsByCategory(this.payment_category_id.value);
    },

    getSelectedPaymentItem() {
      let item = null;
      item = this.$store.getters.getPaymentItems.data.filter(
        (ele) => ele.id === this.payment_item_id.value
      );
      this.$store.dispatch("setCurrentPaymentItem", item[0]); //set the state with the first element from the filtered array
    },

    filterContributions() {
      this.setFilterUrl(
        this.payment_category_id.label,
        this.payment_item_id.label,
        this.year,
        this.month,
        this.status
      );

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

    setFilterUrl(payment_category, payment_item, year, month, status) {
      console.log(payment_category);
      if (payment_category != null && payment_item != null) {
        this.$router.push({
          path: `/dashboard/contributions`,
          query: { category: payment_category, item: payment_item },
        });
      }
      if (year != null) {
        this.$router.push({
          path: `/dashboard/contributions`,
          query: { category: payment_category, item: payment_item, year: year },
        });
      }
      if (month != null) {
        this.$router.push({
          path: `/dashboard/contributions`,
          query: {
            category: payment_category,
            item: payment_item,
            month: month,
          },
        });
      }
      if (status != null) {
        this.$router.push({
          path: `/dashboard/contributions`,
          query: {
            category: payment_category,
            item: payment_item,
            status: status,
          },
        });
      }
    },
  },
  components: {
    TableVue,
  },
};
</script>

<style lang="scss" scoped></style>
