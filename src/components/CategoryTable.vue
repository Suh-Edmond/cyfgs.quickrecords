<template>
  <div class="q-pa-xs">
    <!-- table element -->
    <q-table
      :data="data"
      :columns="columns"
      row-key="id"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }"
      class="col-xs-12"
      :filter="filter"
      :pagination.sync="pagination"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="complusory" :props="props" v-if="show_payment_item">
            {{ props.row.complusory }}
          </q-td>
          <q-td key="item" :props="props" v-if="show_payment_category">
            <q-btn
              flat
              class="view_items"
              @click="showPaymentItems(props.row)"
              :to="{ name: 'payment_items', params: { id: props.row.id } }"
            >
              {{ props.row.item }}
            </q-btn>
          </q-td>
          <q-td
            key="expenditure_items"
            :props="props"
            v-if="show_expenditure_category"
          >
            <q-btn
              flat
              class="view_items"
              @click="showExpenditureItems(props.row)"
              :to="{
                name: 'expenditure_items',
                params: { id: props.row.id },
              }"
            >
              {{ props.row.expenditure_items }}
            </q-btn>
          </q-td>
          <q-td
            key="amount"
            :props="props"
            v-if="show_payment_item || show_expenditure_item"
          >
            {{ Number(props.row.amount).toLocaleString() }}
          </q-td>
          <q-td
            key="amount_given"
            :props="props"
            v-if="show_expenditure_item_detail"
          >
            {{ Number(props.row.amount_given).toLocaleString() }}
          </q-td>
          <q-td
            key="amount_spent"
            :props="props"
            v-if="show_expenditure_item_detail"
          >
            {{ Number(props.row.amount_spent).toLocaleString() }}
          </q-td>
          <q-td
            key="balance"
            :props="props"
            v-if="show_expenditure_item_detail"
          >
            {{ Number(props.row.balance).toLocaleString() }}
          </q-td>
          <q-td key="venue" :props="props" v-if="show_expenditure_item">
            {{ props.row.venue }}
          </q-td>
          <q-td key="date" :props="props" v-if="show_expenditure_item">
            {{ getFormatedDate(props.row.date) }}
          </q-td>
          <q-td
            key="state"
            :props="props"
            v-if="(show_expenditure_item || show_expenditure_item_detail)"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="action" :props="props">
            <!-- buttons for edit, view and delete table data row -->
            <q-btn
              flat
              round
              v-if="
                (show_expenditure_item || show_payment_category || show_payment_item||
                  show_expenditure_category ||
                  show_expenditure_item_detail) &&
                !checkTreasurerRole()
              "
            >
              <q-icon
                name="more_vert"
                size="xs"
                color="primary"
                class="menu_icon"
                clickable
              >
                <q-menu>
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewCategory(props.row)"
                      v-if="show_payment_category"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="visibility" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">View</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewPaymentItem(props.row)"
                      v-if="show_payment_item"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="visibility" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">View</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewExpenditureCategory(props.row)"
                      v-if="show_expenditure_category"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="visibility" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">View</q-item-label>
                      </q-item-section>
                    </q-item>
                    <!-- view expenditure item -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewExpenditureItem(props.row)"
                      v-if="show_expenditure_item"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="visibility" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">View</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator v-if="show_expenditure_item" />
                    <!-- edit expenditure item -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditExpenditureItem(props.row)"
                      v-if="show_expenditure_item"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="edit" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">Edit</q-item-label>
                      </q-item-section>
                    </q-item>


                    <!-- show all details for expenditures -->
                    <q-separator v-if="show_expenditure_item" />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewExpenditureItemDetails(props.row)"
                      v-if="show_expenditure_item"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="info" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">Details</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewItemDetail(props.row)"
                      v-if="show_expenditure_item_detail"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="visibility" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">View</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator v-if="show_expenditure_item_detail" />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditExpenditureItemDetail(props.row)"
                      v-if="show_expenditure_item_detail"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="edit" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">Edit</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDelete(props.row)"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="delete" size="xs" color="red" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-red">Delete</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>

            <!-- buttons for view details, approve and decline row data -->
            <q-btn
              no-caps
              dense
              color="teal"
              padding="5px 7px"
              label="View more"
              v-if="show_expenditure_item && checkTreasurerRole()"
              class="view"
              @click="showDetails(props.row)"
              :to="{ name: 'expenditure_detail', params: { id: props.row.id } }"
            />

            <q-btn
              class="decline_btn"
              dense
              size="md"
              padding="5px 7px"
              label="Decline"
              no-caps
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="
                (show_expenditure_item || show_expenditure_item_detail) &&
                checkTreasurerRole() &&
                props.row.approve == 'PENDING'
              "
            />

            <q-btn
              class="approve_btn"
              dense
              size="md"
              padding="5px 7px"
              label="Approve"
              no-caps
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="
                (show_expenditure_item || show_expenditure_item_detail) &&
                checkTreasurerRole() &&
                props.row.approve == 'PENDING'
              "
            />
          </q-td>
        </q-tr>
      </template>

      <!-- slot for table headings -->
      <template v-slot:top-left>
        <div class="text-h6 title" v-show="show_payment_item">
          Payment Category: {{ title }}
        </div>
        <div
          class="text-h6 title"
          v-show="show_expenditure_item && title != null && !show_expenditure_item_name"
        >
          Expenditure Category: {{ title }}
        </div>
        <div
          class="text-h6 title"
          v-show="show_expenditure_item_name"
        >
          {{ title }}
        </div>
        <div class="text-h6 title" v-show="show_expenditure_item_detail">
          Expenditure Item: {{ title }}
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

    <!-- slots for totals -->
    <q-card v-if="show_expenditure_item_detail">
      <q-card-section>
        <div class="text-bold">
           <div class="q-pb-sm">
            Total Expenditure Item Amount: {{ expenditure_item_amount }} XAF
           </div>
           <div class="q-pb-sm">
            Total Amount Given: {{ total_amount_given }} XAF
           </div>
           <div class="q-pb-sm">
            Total Amount Spent: {{ total_amount_spent }} XAF
           </div>
           <div class="q-pb-sm">
            Total Balance: {{ balance }} XAF
           </div>
        </div>
      </q-card-section>
    </q-card>


    <!-- confirmation delete category dialog -->
    <q-dialog v-model="dialog" v-if="dialog">
      <q-card>
        <q-card-section>
          <div>
            <label class="q-ml-sm text-dark">{{ message }}</label>
          </div>
          <div class="text-weight-bold text-center">{{ deleted_row.name }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            :label="label_cancel"
            :color="'primary'"
            :disabled="false"
            :loading="loading"
            :no_caps="false"
            v-close-popup
            :flat="true"
          ></q-btn>
          <q-btn
            :label="label"
            :color="'primary'"
            :disabled="false"
            :loading="loading"
            :no_caps="false"
            v-close-popup
            @click="deletedRow(deleted_row)"
            :flat="true"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- confirmation dialog for approve and decline row data -->
    <q-dialog v-model="show_approve_dialog" v-if="show_approve_dialog">
      <q-card class="approve_card">
        <q-card-section>
          <div class="row">
            <div class="col-md-12">
              <label for="msg">
                <span class="text-weight-bold"
                  >Do you want to {{ chosen_state }} {{ approve_msg }}</span
                >
              </label>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            :class="chosen_state == 'Approve' ? 'approve' : 'decline'"
            size="md"
            label="Cancel"
            flat
            v-close-popup
          />
          <q-btn
            :class="chosen_state == 'Approve' ? 'approve' : 'decline'"
            size="md"
            :label="chosen_state"
            flat
            @click="onChangeRecordState()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
    show_payment_category: {
      type: Boolean,
      required: false,
    },
    show_payment_item: {
      type: Boolean,
      required: false,
    },
    show_expenditure_category: {
      type: Boolean,
      required: false,
    },
    show_expenditure_item: {
      type: Boolean,
      required: false,
    },
    show_expenditure_item_detail: {
      type: Boolean,
      required: false,
    },
    expenditure_item_amount: {
      type: Number,
      required:false
    },
    total_amount_given: {
      type: Number,
      required:false
    },
    total_amount_spent :{
      type: Number,
      required:false
    },
    balance: {
      type: Number,
      required:false
    },
    show_expenditure_item_name:{
      type: Boolean,
      required:false
    }
  },

  data() {
    return {
      label_download: "Print",
      loading: false,
      color: "positive",
      no_caps: true,
      dialog: false,
      show_approve_dialog: false,
      deleted_row: null,
      showTable: true,
      label_cancel: "Cancel",
      filter: "",
      approve_data: null,
      pagination: {
        rowsPerPage: 15, // current rows per page being displayed
      },
      approve_msg: null,
    };
  },
  computed: {

  },
  methods: {
    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name == "TREASURER"
      );
      return treasurer_role != undefined;
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

    onChangeRecordState() {
      let payload = {
        url: this.setApproveUrlBaseOnType(this.approve_data),
        msg: this.setApproveFeedbackMsg(this.approve_data),
        data: null,
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("putRequest", payload).then((res) => {
        if (res.status == 200) {
          this.callFetchDataAfterApproveAction(this.approve_data);
        }
      });
    },

    onViewCategory(categories) {
      let payload = {
        data: categories,
        tab: "Payment Categories",
      };
      this.$emit("update-payment-category", payload);
    },

    onViewPaymentItem(payment_items) {
      let payload = {
        data: payment_items,
        tab: "Payment Items",
      };
      this.$emit("update-payment-item", payload);
    },

    onDelete(row) {
      this.deleted_row = row;
      this.dialog = true;
    },

    showPaymentItems(payment_items) {
      this.$emit("show-payment-items", { payment_items});
    },

    showExpenditureItems(expenditure_items) {

      this.$emit("show-expenditure-items", {
        expenditure_items,
      });
    },

    onViewExpenditureItemDetails(expenditure_item) {
      let has_intermediate_tab = true;
      let category = this.$store.getters.getCurrentExpenditureCategory;
      this.$router.push({
        name: "expenditure_item_details",
        params: { id: category.id, item_id: expenditure_item.id },
      });
      this.$emit("show-expenditure-item-details", {
        expenditure_item,
        has_intermediate_tab,
      });
    },

    onViewExpenditureCategory(expenditure_category) {
      let payload = {
        data: expenditure_category,
        tab: "Expenditure Categories",
      };
      this.$emit("update-expenditure-category", payload);
    },

    onEditExpenditureItem(expenditure_item) {
      let payload = {
        data: expenditure_item,
        tab: "Expenditure Items",
      };
      this.$emit("edit-expenditure-item", payload);
    },

    onEditExpenditureItemDetail(expenditure_item_detail) {
      let payload = {
        data: expenditure_item_detail,
        tab: "Expenditure Item Details",
      };
      this.$emit("edit-expenditure-item-detail", payload);
    },

    onViewItemDetail(data) {
      let payload = {
        data: data,
        tab: "Expenditure Activity Detail Information",
      };
      this.$emit("view-expenditure-item-detail", payload);
    },

    deletedRow(deleted_data) {
      let payload = {
        url: this.setDeletedUrlBaseOnType(deleted_data),
        msg: this.setDeleteFeedbackMsg(deleted_data),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("deleteRequest", payload).then(() => {
        this.callFetchDataBaseOnType(deleted_data);
      });
    },

    setDeletedUrlBaseOnType(row) {
      let url = "";
      switch (row.type) {
        case "PAYMENT_CATEGORY":
          url = `/api/protected/organisations/${row.organisation_id}/payment-categories/${row.id}`;
          break;
        case "PAYMENT_ITEMS":
          url = `/api/protected/payment-categories/${row.payment_category_id}/payment-items/${row.id}`;
          break;
        case "EXPENDITURE_CATEGORY":
          url = `/api/protected/organisations/${row.organisation_id}/expenditure-categories/${row.id}`;
          break;
        case "EXPENDITURE_ITEMS":
          url = `/api/protected/expenditure-categories/${row.expenditure_category_id}/expenditure-items/${row.id}`;
          break;
        case "EXPENDITURE_DETAILS":
          url = `/api/protected/expenditure-item-details/${row.id}`;
          break;
      }
      return url;
    },

    setDeleteFeedbackMsg(row) {
      let msg = "";
      switch (row.type) {
        case "PAYMENT_CATEGORY":
          msg = `Payment Category deleted successfully`;
          break;
        case "PAYMENT_ITEMS":
          msg = `Payment Item deleted successfully`;
          break;
        case "EXPENDITURE_CATEGORY":
          msg = `Expenditure Category deleted successfully`;
          break;
        case "EXPENDITURE_ITEMS":
          msg = `Expenditure Item deleted successfully`;
          break;
        case "EXPENDITURE_DETAILS":
          msg = `Expenditure Item detail deleted successfully`;
          break;
      }

      return msg;
    },

    callFetchDataBaseOnType(row) {
      switch (row.type) {
        case "PAYMENT_CATEGORY":
          this.fetchCategories(false);
          break;

        case "PAYMENT_ITEMS":
          this.getPaymentItemsByCategory(row.payment_category_id);
          break;

        case "EXPENDITURE_CATEGORY":
          this.fetchExpenditureCategories(row.organisation_id);
          break;

        case "EXPENDITURE_ITEMS":
          this.getExpenditureItemsByCategory();
          break;

        case "EXPENDITURE_DETAILS":
          this.getExpenditureDetailsByItemId(row.expenditure_item_id);
          break;
      }
    },

    getPaymentItemsByCategory(id) {
      let payload = {
        status: "none",
        url: `/api/protected/payment-categories/${id}/payment-items`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_PAYMENT_ITEMS",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    fetchExpenditureCategories(organisation_id) {
      let payload = {
        url: `/api/protected/organisations/${organisation_id}/expenditure-categories`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch payment categories",
        has_commit: true,
        show_feedback: false,
        show_spinner: true,
        commit: "SET_EXPENDITURE_CATEGORIES",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
    },

    getFormatedDate(date) {
      return moment(date).format("MMMM Do YYYY");
    },

    setApproveUrlBaseOnType(data) {
      let url = "";
      let type = this.chosen_state == "Approve" ? "APPROVED" : "DECLINED";
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
      let msg = `Record was ${this.chosen_state} successfully`;
      return msg;
    },

    setApproveWarningMsgByType(data) {
      let date = "";
      switch (data.type) {
        case "EXPENDITURE_ITEMS":
          date = moment(data.date).format("MMMM Do YYYY");
          this.approve_msg = ` ${data.amount}  F CFA Expenditure for ${data.name} on the ${date} at ${data.venue} ?`;
          break;
        case "EXPENDITURE_DETAILS":
          date = moment(data.created_at).format("MMMM Do YYYY");
          this.approve_msg = ` ${data.amount_given} F CFA Spent for ${data.name} on the ${date} ?`;
          break;
      }

      return this.approve_msg;
    },

    callFetchDataAfterApproveAction(data) {
      switch(data.type) {
        case "EXPENDITURE_ITEMS":
          this.getExpendituresByCategory(data.expenditure_category_id);
        break;
        case "EXPENDITURE_DETAILS":
          this.getExpenditureDetailsByItemId(data.expenditure_item_id);
        break;
      }
    },

    showDetails(data) {
      this.$store.dispatch("setExpenditureItemName", data.name);
      this.getExpenditureDetailsByItemId(data.id);
    },

    onViewExpenditureItem(data) {
      let payload = {
        data: data,
        tab: "Expenditure Activity Information",
      };
      this.$emit("view-expenditure-item", payload);
    }
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
  font-size: 13px;
  line-height: 25px;
  align-items: center;
  letter-spacing: 0.01em;
  text-transform: capitalize;
  color: $primary;
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
  font-size: small;
}

.dialog_button {
  font-size: 9px;
  font-weight: 300;
}

.approve_btn {
  background-color: $secondary;
  color: white;
}
.approve_card {
  width: 30rem;
  padding: 0.7rem;
}
.decline_btn {
  background-color: $orange;
  color: white;
  margin-right: 4.5rem;
}
.view {
  margin-right: 4.5rem;
}
.approve {
  color: $secondary;
}

.decline {
  color: $orange;
}
</style>
