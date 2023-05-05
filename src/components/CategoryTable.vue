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
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">

        <!-- table body for payment category -->
        <q-tr :props="props" v-if="show_payment_category">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
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
          <q-td key="action" :props="props">
            <!-- buttons for edit, view and delete table data row -->
            <q-btn flat round v-if="!checkTreasurerRole()">
              <q-icon
                name="menu"
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
                      @click="onViewPaymentCategory(props.row)"
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
                    <q-separator />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDelete(props.row, 'PAYMENT_CATEGORY')"
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
          </q-td>
        </q-tr>
        <!-- end of table body for payment category -->



        <!-- table body for payment items -->
        <q-tr :props="props" v-if="show_payment_item">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="amount" :props="props">
            {{ Number(props.row.amount).toLocaleString() }}
          </q-td>
          <q-td key="compulsory" :props="props">
            {{ props.row.compulsory == 1 ? "YES" : "NO" }}
          </q-td>
          <q-td key="payment_item_type" :props="props">
            {{ props.row.payment_item_type }}
          </q-td>
          <q-td key="frequency" :props="props">
            {{ props.row.frequency }}
          </q-td>
          <q-td key="action" :props="props">
            <!-- buttons for edit, view and delete table data row -->
            <q-btn flat round v-if="!checkTreasurerRole()">
              <q-icon
                name="menu"
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
                    <q-separator />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDelete(props.row, 'PAYMENT_ITEMS')"
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
          </q-td>
        </q-tr>
        <!-- end of table body for payment items -->

      </template>

      <!-- slot for table headings -->
      <template v-slot:top-left>
        <div class="text-h6 title" v-show="show_payment_item">
          Payment Category: {{ title }}
        </div>
        <div
          class="text-h6 title"
          v-show="
            show_expenditure_item &&
            title != null &&
            !show_expenditure_item_name
          "
        >
          Expenditure Category: {{ title }}
        </div>
        <div class="text-h6 title" v-show="show_expenditure_item_name">
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

      <template v-slot:bottom>
        <q-tr v-if="show_expenditure_item_detail">
          <q-td
            class="text-bold"
            :class="checkTreasurerRole() ? 'total' : 'total_label'"
          >
            Total:
          </q-td>
          <q-td
            class="text-bold"
            :class="checkTreasurerRole() ? 'amount_given' : 'total_given'"
          >
            {{ Number(total_amount_given).toLocaleString() }} XAF
          </q-td>

          <q-td
            class="text-bold"
            :class="checkTreasurerRole() ? 'amount_spent' : 'total_spent'"
          >
            {{ Number(total_amount_spent).toLocaleString() }} XAF
          </q-td>

          <q-td
            class="text-bold"
            :class="checkTreasurerRole() ? 'balance_treasurer_view' : 'balance'"
          >
            {{ Number(balance).toLocaleString() }} XAF
          </q-td>
        </q-tr>
        <div class="text-bold q-pt-sm" v-if="show_expenditure_item_detail">
          <div
            class="q-pt-md q-pb-xs text-info"
            :class="
              checkTreasurerRole()
                ? 'balance_details_treasurer'
                : 'balance_details'
            "
            v-if="checkTreasurerRole()"
          >
            NB: Only APPROVED records are used for calculating balances
          </div>
          <div
            class="q-pt-md q-pb-xs"
            :class="
              checkTreasurerRole()
                ? 'balance_details_treasurer'
                : 'balance_details'
            "
          >
            Estimated Expenditure Amount:
            <span class="expenditure_amount"
              >{{ Number(expenditure_item_amount).toLocaleString() }} XAF</span
            >
          </div>
          <div
            class="q-pt-sm q-pb-lg"
            :class="
              checkTreasurerRole()
                ? 'balance_details_treasurer'
                : 'balance_details'
            "
          >
            Net Balance (Estimated Expenditure Amount - Amount Spent + Total
            balance):
            <span class="net_balance"
              >{{ Number(total_balance).toLocaleString() }} XAF</span
            >
          </div>
        </div>
      </template>
    </q-table>

    <!-- confirmation delete category dialog -->
    <div v-if="dialog">
      <ConfirmDialog
        :data="deleted_row"
        :msg="delete_msg"
        :type="type"
        :show_expenditure_category="computeShowConfirmDialogDetail()"
        :show_payment_category="computeShowConfirmDialogDetail()"
        :show_payment_item="computeShowConfirmDialogDetail()"
        @cancel-dialog="cancelDialog"
        @delete-row="deleteRow"
      ></ConfirmDialog>
    </div>

  </div>
</template>
<script>
import { LocalStorage } from "quasar";
import PaymentCategoryMixinVue from "src/mixins/PaymentCategoryMixin.vue";
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import moment from "moment";
import ConfirmDialog from "./ConfirmDialog.vue";

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
      pagination: {
        rowsPerPage: 15, // current rows per page being displayed
      },
      approve_msg: null,
      type: null,
      delete_msg: "",
      show_confirm_dialog_detail: false,
    };
  },
  computed: {},
  methods: {
    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name == "TREASURER"
      );
      return treasurer_role != undefined;
    },


    showPaymentItems(data){
      this.$emit("show-payment-items", { data });
    },


    onViewPaymentCategory(categories) {
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


    computeShowConfirmDialogDetail() {
      let show_confirm_dialog_detail = false;
      switch (this.type) {
        case "PAYMENT_CATEGORY":
          show_confirm_dialog_detail = true;
          break;
        case "PAYMENT_ITEM":
          show_confirm_dialog_detail = true;
          break;
      }
      return show_confirm_dialog_detail;
    },


    onDelete(row, type) {
      this.deleted_row = row;
      this.dialog = true;
      this.type = type;
      switch (this.type) {
        case "PAYMENT_CATEGORY":
          this.delete_msg =
            "Are you sure you want to delete this Payment Category?";
          break;
        case "PAYMENT_ITEM":
          this.delete_msg =
            "Are you sure you want to delete this Payment Item?";
          break;
      }
    },


    deleteRow(){
      this.$emit("delete-row", this.deleted_row);
    },

    cancelDialog(){
      this.dialog = false;
      this.type = null;
      this.delete_msg = "";
      this.show_confirm_dialog_detail = false
    }
  },
  components: {
    ConfirmDialog,
  },
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
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
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

.total_label {
  font-size: 13px;
  padding-left: 6rem;
}
.total {
  font-size: 13px;
  padding-left: 4.8rem;
}
.total_given {
  font-size: 13px;
  padding-left: 20.8rem;
}
.amount_given {
  font-size: 13px;
  padding-left: 13rem;
}
.total_spent {
  font-size: 13px;
  padding-left: 14.4rem;
}

.amount_spent {
  font-size: 13px;
  padding-left: 8.9rem;
}

.balance {
  padding-left: 12.8rem;
  font-size: 13px;
}

.balance_treasurer_view {
  padding-left: 7.8rem;
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

.balance_details {
  font-size: 13px;
  padding-left: 6rem;
}

.balance_details_treasurer {
  font-size: 13px;
  padding-left: 5rem;
}
.net_balance {
  padding-left: 1rem;
}

.expenditure_amount {
  padding-left: 17.8rem;
}
</style>
