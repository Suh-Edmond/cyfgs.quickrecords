<template>
  <div class="q-pa-xs">
    <!---------------------------------------------------MAIN TABLE COMPONENT------------------------------>
    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }"
      class="col-xs-12"
      :filter="filter"
      :loading="table_loading"
      :pagination.sync="getPagination"
      @request="onRequest"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>



      <!-- slot for table headings -->
      <template v-slot:top-left>
        <div class="text-h5 title">
          {{ title }}
        </div>
      </template>

      <!-- slot for search table data -->
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          :class="
            $q.screen.md
              ? 'text-h6-sm q-mb-sm q-mt-sm full-width'
              : 'text-h6-sm'
          "
          v-model="filter"
          placeholder="Search category..."
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <!---------------------------------------------------END OF MAIN TABLE COMPONENT------------------------>

    <!-----------------------------------------------------------END OF TABLE FOR EXPENDITURE ITEM DETAILS------------------------------------------->
  </div>
</template>
<script>
import { LocalStorage } from "quasar";
import PaymentCategoryMixinVue from "src/mixins/PaymentCategoryMixin.vue";
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import moment from "moment";

export default {
  mixins: [
    PaymentCategoryMixinVue,
    expenditureItemMixinVue,
    ExpenditureItemDetailMixinVue,
  ],

  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    title: {
      required: false,
      type: String,
    },
    label: {
      required: false,
      type: String,
    },
    message: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    expenditure_item_amount: {
      type: Number,
      required: false,
    },
    total_amount_given: {
      type: Number,
      required: false,
    },
    total_amount_spent: {
      type: Number,
      required: false,
    },
    balance: {
      type: Number,
      required: false,
    },
    total_balance: {
      type: Number,
      required: false,
    },
    show_expenditure_item_name: {
      type: Boolean,
      required: false,
    },
    pagination: {
      required: true,
      type: Object,
    },
    table_loading: {
      required: false,
      type: Boolean,
    },
  },

  data() {
    return {
      loading: false,
      dialog: false,
      show_approve_dialog: false,
      deleted_row: null,
      showTable: true,
      filter: "",
      approve_data: null,
      approve_msg: null,
      type: null,
      delete_msg: "",
      selected:[]
    };
  },
  computed: {
    getPagination: {
      get() {
        return this.pagination;
      },
      set(pagination) {
        return pagination;
      },
    },
  },
  methods: {
    onRequest(props) {
      this.$emit("onRequest", props);
    },

    getFormatedDate(date) {
      return moment(date).format("MMMM Do YYYY");
    },

    onViewExpenditureDetail(data) {
      let payload = {
        data: data,
        tab: "Expenditure Item Detail Information",
      };
      this.$emit("view-expenditure-item-detail", payload);
    },

    onApprovedRecord(row, state) {
      this.show_approve_dialog = true;
      this.approve_data = row;
      this.chosen_state = state;
      this.setApproveWarningMsgByType(row);
    },

    onDeclineRecord(row, state) {
      this.show_approve_dialog = true;
      this.approve_data = row;
      this.chosen_state = state;
      this.setApproveWarningMsgByType(row);
    },

    setApproveUrlBaseOnType(data) {
      let url = "";
      let type =
        this.chosen_state === "Approve"
          ? this.$t("app.approveLabel")
          : this.$t("app.declineLabel");
      switch (data.type) {
        case "EXPENDITURE_ITEMS":
          url = `/api/protected/expenditure-items/${data.id}/approve?type=${type}`;
          break;
        case "EXPENDITURE_DETAILS":
          url = `/api/protected/expenditure-details/${data.id}/approve?type=${type}`;
          break;
      }
      return url;
    },

    setApproveFeedbackMsg() {
      let msg =
        this.$t("app.recordWas") +
        `${this.chosen_state}` +
        this.$t("app.successfull");
      return msg;
    },

    setApproveWarningMsgByType(data) {
      let date = "";
      switch (data.type) {
        case "EXPENDITURE_ITEMS":
          date = moment(data.date).format("MMMM Do YYYY");
          this.approve_msg =
            ` ${data.amount}  ` +
            this.$t("app.approveExpenditureItemPartMsg") +
            ` ${data.name} ` +
            this.$t("app.on") +
            ` ${date} ` +
            this.$t("app.at") +
            ` ${data.venue} ?`;
          break;
        case "EXPENDITURE_DETAILS":
          date = moment(data.created_at).format("MMMM Do YYYY");
          this.approve_msg =
            ` ${data.amount_given} ` +
            this.$t("app.approveDetail") +
            ` ${data.name} ` +
            this.$t("app.on") +
            ` ${date} ?`;
          break;
      }

      return this.approve_msg;
    },

    callFetchDataAfterApproveAction(data) {
      switch (data.type) {
        case "EXPENDITURE_ITEMS":
          this.fetchExpenditureItems(1, 7, "", "", "");
          break;
        case "EXPENDITURE_DETAILS":
          this.getExpenditureDetailsByItemId(data.expenditure_item_id, 1, 7);
          break;
      }
    },

    onChangeRecordState() {
      let payload = {
        url: this.setApproveUrlBaseOnType(this.approve_data),
        msg: this.setApproveFeedbackMsg(this.approve_data),
        data: null,
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store
        .dispatch("putRequest", payload)
        .then((res) => {
          if (res.success) {
            this.callFetchDataAfterApproveAction(this.approve_data);
          }
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
        });
    },
  },
  components: {},
};
</script>
<style lang="scss" scoped>
.button {
  text-align: end;
}

.menu_icon {
  cursor: pointer;
}

.edit {
  color: $grey5;
}

.details {
  color: $primary;
}

.warning_image {
  color: yellow;
}

.view_items {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  align-items: center;
  text-transform: capitalize;
}

.field_total {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 25px;
  align-items: center;
  letter-spacing: 0.01em;
  text-transform: capitalize;
  color: $dark;
}

.title {
  // font-size: small;
  font-size: 15px;
  font-weight: 500;
  color: $grey8;
}

.dialog_button {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.approve_btn {
  background-color: $secondary;
  color: white;
  width: 5.5rem;
}

.approve_card {
  width: 25rem;
  // padding: 0.7rem;
}

.decline_btn {
  background-color: $orange;
  color: white;
  margin-right: 4.5rem;
  width: 5.5rem;
}

.view {
  margin-right: 4.5rem;
  width: 6rem;
}

.viewExpenditureItem {
  width: 5.5rem;
  margin-left: 5rem;
}

.viewPending {
  width: 5.5rem;
}

.approve {
  color: $secondary;
}

.decline {
  color: $orange;
}

.total_label {
  font-size: 13px;
  padding-left: 5.5rem;
}

.total {
  font-size: 13px;
  padding-left: 6rem;
}

.total_given {
  font-size: 13px;
  padding-left: 12rem;
}

.amount_given {
  font-size: 13px;
  padding-left: 7rem;
  padding-right: 250px;
}

.total_spent {
  font-size: 13px;
  padding-left: 15rem;
}

.summary {
  font-size: 15px;
}

.amount_spent {
  font-size: 13px;
  padding-left: 13.5rem;
}

.balance {
  padding-left: 13.4rem;
  font-size: 13px;
}

.message {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.delete_item_name {
  padding-left: 1.8rem;
}

.detail_name {
  padding-left: 4.3rem;
}

.net_balance {
  margin-left: 4.6rem;
}

.expenditure_amount {
  padding-left: 1rem;
}

.not_registered {
  color: $orange;
}

.registered {
  color: $secondary;
}
</style>
