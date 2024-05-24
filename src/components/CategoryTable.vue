<template>
  <div class="q-mb-xl">
    <!---------------------------------------------------MAIN TABLE COMPONENT------------------------------>
    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      :table-header-style="{ backgroundColor: '#213c65', color: '#FFFFFF' }"
      class="col-xs-12"
      :filter="filter"
      :loading="table_loading"
      :pagination.sync="getPagination"
      @request="onRequest"
      binary-state-sort
      flat
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <template v-slot:body="props">
        <!-- table body for payment category -->
        <q-tr :props="props" v-if="show_payment_category">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="code" :props="props">
            {{ props.row.code }}
          </q-td>
          <q-td key="item" :props="props">
            <q-btn
              unelevated
              color="primary"
              no-caps
              class="view_items"
              :style="$q.platform.is.mobile ? 'width:200px' : 'width:200px'"
              @click="showPaymentItems(props.row)"
              :to="{ name: 'payment_items', params: { id: props.row.id } }"
            >
              {{ props.row.item }}
              <span class="q-pl-md"
                ><q-icon name="visibility" size="xs"></q-icon
              ></span>
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
                  <q-list style="width: 180px">
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
                        <q-item-label class="details q-pl-lg">{{
                          $t("app.view")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDelete(props.row, 'PAYMENT_CATEGORY')"
                      v-if="checkPresidentOrAdminRole()"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="delete" size="xs" color="red" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-red q-pl-lg">{{
                          $t("app.delete")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>
            <q-btn
              unelevated
              color="primary"
              no-caps
              class="view_payment_category"
              @click="onViewPaymentCategory(props.row)"
              v-if="checkTreasurerRole()"
            >
              {{ $t("app.view") }}
              <span class="q-pl-md"
                ><q-icon name="visibility" size="xs"></q-icon
              ></span>
            </q-btn>
          </q-td>
        </q-tr>
        <!-- end of table body for payment category -->

        <!-- table body for payment items -->
        <q-tr :props="props" v-if="show_payment_item">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="amount" :props="props">
            {{ Number(props.row.amount).toLocaleString() }}
          </q-td>
          <q-td key="compulsory" :props="props">
            {{ props.row.compulsory === 1 ? "YES" : "NO" }}
          </q-td>
          <q-td key="frequency" :props="props">
            {{ formatConstants(props.row.frequency) }}
          </q-td>
          <q-td key="payment_item_type" :props="props">
            {{ formatConstants(props.row.payment_item_type) }}
          </q-td>
          <q-td key="reference" :props="props">
            <!-- button for view member -->
            <q-btn
              unelevated
              color="primary"
              no-caps
              class="view_items"
              :style="$q.platform.is.mobile ? 'width:200px' : 'width:150px'"
              @click="showReferences(props.row)"
              v-if="props.row.payment_item_type == 'A_MEMBER'"
            >
              {{ $t("app.viewMember") }}
              <span class="q-pl-md"
                ><q-icon name="visibility" size="xs"></q-icon
              ></span>
            </q-btn>

            <!-- button for view members -->
            <q-btn
              unelevated
              color="primary"
              no-caps
              class="view_items"
              @click="showReferences(props.row)"
              :style="$q.platform.is.mobile ? 'width:200px' : 'width:150px'"
              v-if="
                props.row.payment_item_type == 'GROUPED_MEMBERS' ||
                props.row.payment_item_type == 'MEMBERS_WITH_ROLES' ||
                props.row.payment_item_type == 'MEMBERS_WITHOUT_ROLES'
              "
            >
              {{ $t("app.viewMembers") }}
              <span class="q-pl-md"
                ><q-icon name="visibility" size="xs"></q-icon
              ></span>
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
                  <q-list style="width: 180px" bordered separator>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewPaymentItem(props.row)"
                      v-if="show_payment_item"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="visibility" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">{{
                          $t("app.view")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditPaymentItem(props.row)"
                      v-if="show_payment_item"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="edit" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">{{
                          $t("app.edit")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDelete(props.row, 'PAYMENT_ITEMS')"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="delete" size="xs" color="red" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-red">{{
                          $t("app.delete")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>
            <q-btn
              unelevated
              color="primary"
              no-caps
              class="view_items"
              @click="onViewPaymentItem(props.row)"
              v-if="checkTreasurerRole()"
            >
              {{ $t("app.view") }}
              <span class="q-pl-md"
                ><q-icon name="visibility" size="xs"></q-icon
              ></span>
            </q-btn>
          </q-td>
        </q-tr>
        <!-- end of table body for payment items -->

        <!-- table body for expenditure category -->
        <q-tr :props="props" v-if="show_expenditure_category">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="code" :props="props">
            {{ props.row.code }}
          </q-td>
          <q-td key="expenditure_items" :props="props">
            <q-btn
              unelevated
              color="primary"
              no-caps
              class="view_items"
              :style="$q.platform.is.mobile ? 'width:200px' : 'width:200px'"
              @click="showExpenditureItems(props.row)"
              :to="{ name: 'expenditure_items', params: { id: props.row.id } }"
            >
              {{ props.row.expenditure_items }}
              <span class="q-pl-md"
                ><q-icon name="visibility" size="xs"></q-icon
              ></span>
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
                  <q-list style="width: 180px">
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewExpenditureCategory(props.row)"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="visibility" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details q-pl-lg">{{
                          $t("app.view")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDelete(props.row, 'EXPENDITURE_CATEGORY')"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="delete" size="xs" color="red" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-red q-pl-lg">{{
                          $t("app.delete")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>
          </q-td>
        </q-tr>
        <!-- end of table body for expenditure category -->

        <!-- table body for expenditure items -->
        <q-tr :props="props" v-if="show_expenditure_item">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="amount" :props="props">
            {{ Number(props.row.amount).toLocaleString() }}
          </q-td>
          <q-td key="venue" :props="props">
            {{ props.row.venue }}
          </q-td>
          <q-td key="date" :props="props">
            {{ getFormatedDate(props.row.date) }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'PENDING'"
            class="text-info"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'APPROVED'"
            class="registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'DECLINED'"
            class="not_registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              no-caps
              dense
              unelevated
              color="primary"
              :label="$t('app.details')"
              v-if="checkTreasurerRole()"
              class="view q-mr-md"
              @click="showDetails(props.row)"
              :to="{ name: 'expenditure_detail', params: { id: props.row.id } }"
            >
              <q-icon name="visibility" size="xs" class="q-pl-md"></q-icon>
            </q-btn>
            <!-- approved btn for expenditure items -->
            <q-btn
              class="approve_btn"
              dense
              :label="$t('app.approve')"
              no-caps
              unelevated
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="
                checkTreasurerRole() &&
                props.row.approve == 'PENDING' &&
                props.row.has_no_pending_details
              "
            />
            <!-- decline btn for expenditure items -->
            <q-btn
              class="decline_btn q-ml-md"
              dense
              :label="$t('app.decline')"
              unelevated
              no-caps
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="
                checkTreasurerRole() &&
                props.row.approve == 'PENDING' &&
                props.row.has_no_pending_details
              "
            />

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
                  <q-list style="width: 180px" bordered separator>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewExpenditureItem(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="visibility" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">{{
                          $t("app.view")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditExpenditureItem(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="edit" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">{{
                          $t("app.edit")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewExpenditureItemDetails(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="info" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">{{
                          $t("app.details")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDelete(props.row, 'EXPENDITURE_ITEMS')"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="delete" size="xs" color="red" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-red">{{
                          $t("app.delete")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>
          </q-td>
        </q-tr>
        <!-- end of table body for expenditure items -->

        <!-- table body for expenditure item details -->
        <q-tr :props="props" v-if="show_expenditure_item_detail">
          <q-td key="is_selected" :props="props">
            <q-checkbox
              v-model="props.row.is_selected"
              v-if="props.row.approve == 'PENDING'"
              dense
              size="md"
              @input="computeTotal(props.row, $event)"
            />
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="amount_given" :props="props">
            {{ Number(props.row.amount_given).toLocaleString() }}
          </q-td>
          <q-td key="amount_spent" :props="props">
            {{ Number(props.row.amount_spent).toLocaleString() }}
          </q-td>
          <q-td key="balance" :props="props">
            {{ Number(props.row.balance).toLocaleString() }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'APPROVED'"
            class="text-positive"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'PENDING'"
            class="text-info"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'DECLINED'"
            class="text-orange"
          >
            {{ props.row.approve }}
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
                  <q-list style="width: 180px" bordered separator>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewItemDetail(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="visibility" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">{{
                          $t("app.view")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditExpenditureItemDetail(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="edit" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">{{
                          $t("app.edit")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDelete(props.row, 'EXPENDITURE_DETAILS')"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="delete" size="xs" color="red" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-red">{{
                          $t("app.delete")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>

            <!-- view expenditure item details -->
            <q-btn
              color="primary"
              class="viewPending"
              dense
              :label="$t('app.view')"
              no-caps
              unelevated
              @click="onViewExpenditureDetail(props.row)"
              v-if="checkTreasurerRole()"
            >
              <q-icon name="visibility" size="xs" class="q-pl-md"></q-icon>
            </q-btn>

            <!-- decline btn for expenditure item details -->
            <q-btn
              class="approve_btn q-mx-md"
              dense
              :label="$t('app.approve')"
              no-caps
              unelevated
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />

            <!-- approved btn for expenditure item details -->
            <q-btn
              class="decline_btn"
              dense
              :label="$t('app.decline')"
              unelevated
              no-caps
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />
          </q-td>
        </q-tr>
        <!-- end of table body for expenditure item details -->
      </template>

      <!-- slot for table headings -->
      <template v-slot:top-left>
        <div class="text-h5 title" v-show="show_payment_item">
          {{ $t("app.paymentCategory") }}: {{ title }}
        </div>
        <div
          class="text-h5 title"
          v-show="
            show_expenditure_item &&
            title != null &&
            !show_expenditure_item_name
          "
        >
          {{ title }}
        </div>
        <div class="text-h5 title" v-show="show_expenditure_item_name">
          {{ title }}
        </div>
        <div class="text-h5 title" v-show="show_expenditure_item_detail">
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
          :placeholder="$t('app.tableSearch')"
          :style="$q.platform.is.mobile ? 'width:88vw' : ''"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <!---------------------------------------------------END OF MAIN TABLE COMPONENT------------------------>

    <!----------------------------------------------------CONFIRM DELETE CATEGORY DIALOG--------------------->
    <div v-if="dialog">
      <ConfirmDialog
        :data="deleted_row"
        :msg="delete_msg"
        :type="type"
        :show_expenditure_category="show_expenditure_category"
        :show_payment_category="show_payment_category"
        :show_payment_item="show_payment_item"
        :show_expenditure_item="show_expenditure_item"
        :show_expenditure_item_detail="show_expenditure_item_detail"
        @cancel-dialog="cancelDialog"
        @delete-row="deleteRow"
      ></ConfirmDialog>
    </div>
    <!---------------------------------------------------END OF CONFIRM DELETE CATEGORY DIALOG--------------->

    <!--------------------------------------------------CONFIRM APPROVE/DECLINE A RECORD--------------------->
    <div v-if="show_approve_dialog">
      <q-dialog v-model="show_approve_dialog">
        <q-card class="approve_card q-px-md">
          <q-card-section>
            <div class="row q-pt-sm">
              <div class="col-md-12">
                <label for="msg">
                  <span class="text-weight-bold"
                    >{{ $t("app.doYouKnow") }} {{ chosen_state }}
                    {{ approve_msg }}</span
                  >
                </label>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              :class="chosen_state == 'Approve' ? 'approve' : 'decline'"
              size="md"
              :label="$t('app.cancel')"
              flat
              v-close-popup
              no-caps
              class="q-my-md"
            />
            <q-btn
              :class="chosen_state == 'Approve' ? 'approve' : 'decline'"
              size="md"
              :label="chosen_state"
              flat
              @click="onChangeRecordState()"
              v-close-popup
              no-caps
              class="q-my-md"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!--------------------------------------------------END OF CONFIRM APPROVE/DECLINE A RECORD-------------->
  </div>
</template>
<script>
import { LocalStorage } from "quasar";
import PaymentCategoryMixinVue from "src/mixins/PaymentCategoryMixin.vue";
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import moment from "moment";
import ConfirmDialog from "./ConfirmDialog.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";

export default {
  mixins: [
    PaymentCategoryMixinVue,
    expenditureItemMixinVue,
    ExpenditureItemDetailMixinVue,
    HelperMixin,
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
      show_confirm_dialog_detail: false,
      selectedRecords: [],
      expensesSet: new Set(),
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

    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").user_data.roles.find(
        (role) => role.name === "TREASURER"
      );
      return treasurer_role != undefined;
    },

    checkPresidentOrAdminRole() {
      let req_roles = ["ADMIN", "PRESIDENT"];
      const user_roles = LocalStorage.getItem("data").user_data.roles.map(
        (role) => role.name
      );
      return user_roles.includes(...req_roles);
    },

    showPaymentItems(data) {
      this.$emit("show-payment-items", data);
    },

    onViewPaymentCategory(categories) {
      let payload = {
        data: categories,
        tab: "Payment Categories",
      };
      this.$emit("update-payment-category", payload);
    },

    onViewPaymentItem(payment_item) {
      let payload = {
        data: payment_item,
        tab: "View Payment Item",
      };
      this.$store.dispatch("setUpdatedPaymentItem", payment_item);
      this.$emit("view-payment-item", payload);
    },

    onEditPaymentItem(payment_item) {
      let payload = {
        data: payment_item,
        tab: "Payment Items",
      };
      this.$store.dispatch("setUpdatedPaymentItem", payment_item);

      this.$emit("update-payment-item", payload);
    },

    showReferences(data) {
      this.$emit("show-references", data);
    },

    computeShowConfirmDialogDetail() {
      let show_confirm_dialog_detail = false;
      switch (this.type) {
        case "PAYMENT_CATEGORY":
          show_confirm_dialog_detail = true;
          break;
        case "PAYMENT_ITEMS":
          show_confirm_dialog_detail = true;
          break;
        case "EXPENDITURE_CATEGORY":
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
          this.delete_msg = this.$t("app.deletePaymentCategory");
          break;
        case "PAYMENT_ITEMS":
          this.delete_msg = this.$t("app.deletePaymentItem");
          break;
        case "EXPENDITURE_CATEGORY":
          this.delete_msg = this.$t("app.deleteExpenditureCategory");
          break;
        case "EXPENDITURE_ITEMS":
          this.delete_msg = this.$t("app.deleteExpenditureItem");
          break;
        case "EXPENDITURE_DETAILS":
          this.delete_msg = this.$t("app.deleteExpenditureItemDetail");
          break;
      }
    },

    deleteRow() {
      this.$emit("delete-row", this.deleted_row);
    },

    cancelDialog() {
      this.dialog = false;
      this.type = null;
      this.delete_msg = "";
      this.show_confirm_dialog_detail = false;
    },

    showExpenditureItems(expenditure_items) {
      this.$emit("show-expenditure-items", {
        expenditure_items,
      });
    },

    onViewExpenditureCategory(expenditure_category) {
      let payload = {
        data: expenditure_category,
        tab: "Expenditure Categories",
      };
      this.$emit("update-expenditure-category", payload);
    },

    onViewExpenditureItem(data) {
      let payload = {
        data: data,
        tab: "Expenditure Activity Information",
      };
      this.$store.dispatch("setUpdatedExpenditureItem", data);

      this.$emit("view-expenditure-item", payload);
    },

    onEditExpenditureItem(expenditure_item) {
      let payload = {
        data: expenditure_item,
        tab: "Expenditure Items",
      };
      this.$store.dispatch("setUpdatedExpenditureItem", expenditure_item);

      this.$emit("edit-expenditure-item", payload);
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
        tab: "Expenditure Item Detail Information",
      };
      this.$emit("view-expenditure-item-detail", payload);
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
        this.chosen_state == "Approve"
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
        `${this.chosen_state} ` +
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
          this.filterExpenditureItems(
            1,
            10,
            { value: this.$store.getters.getCurrentExpenditureCategory.id },
            "",
            "",
            ""
          );
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

    showDetails(data) {
      this.$store.dispatch(
        "setCurrentExpenditureCategory",
        data.expenditure_category_id
      );
      this.$store.dispatch("setExpenditureItemName", data.name);
      const intermediate_tabs = Array.from(
        this.$store.getters.getIntermediateTabs
      );

      intermediate_tabs.push({
        name: this.$t("app.details"),
        has_intermediate_tab: true,
      });

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);
    },

    checkIfExpendituredetailsStatus() {
      return this.$store.getters.getExpenditures.length > 0
        ? this.$store.getters.getExpenditures[0].expenditure_details.filter(
            (ele) => ele.approve == "PENDING"
          ).length == 0
        : false;
    },

    computeTotal(data, event) {
      if (event) {
        this.expensesSet.add(data);
      } else {
        this.expensesSet.delete(data);
      }
      this.$emit("showSelectedRecords", this.expensesSet);
    },
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
  font-size: 12px;
  align-items: center;
  text-transform: capitalize;
}

.view_payment_category {
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
}

.decline_btn {
  background-color: $orange;
  color: white;
  width: 5.5rem;
}

.view {
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
