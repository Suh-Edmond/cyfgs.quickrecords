<template>
  <q-page>
    <div>
      <!-------------------------------------------------HEADER FOR PAYMENT ITEMS-------------------------------->
      <div
        class="row q-ml-xs"
        :class="$q.screen.lg ? 'q-pa-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12">
          <q-select
            v-model="is_compulsory"
            outlined
            dense
            :options="statuses"
            :label="$t('app.selectStatusLabel')"
            clearable
          />
        </div>
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 q-pl-sm">
          <q-select
            v-model="type"
            outlined
            dense
            :options="payment_item_types"
            :label="$t('app.selectPaymentType')"
            clearable
          />
        </div>
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 q-pl-sm">
          <q-select
            v-model="frequency"
            outlined
            dense
            :options="frequencies"
            :label="$t('app.selectFrequency')"
            clearable
          />
        </div>
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 q-pl-sm">
          <q-select
            v-model="state"
            outlined
            dense
            :options="states"
            clearable
            :label="$t('app.selectState')"
          />
        </div>
        <div class="col-md-4 col-lg-4 col-xs-12 col-sm-12 flex q-pl-sm">
          <div>
            <q-btn
              :label="$t('app.filter')"
              :loading="loading"
              color="primary"
              :disabled="validateFilter"
              @click="filterPaymentItems"
              no-caps
              icon-right="filter_list"
            >
            </q-btn>
          </div>
          <q-space />
          <div>
            <q-btn
              :label="$t('app.print')"
              :loading="loading_download"
              color="positive"
              :disabled="validateDownload"
              no-caps
              icon-right="print"
              @click="downloadItems"
            ></q-btn>
          </div>
        </div>
      </div>
      <!------------------------------------------------END OF HEADER------------------------------------------->

      <!-----------------------------------------------TABLE FOR PAYMENT ITEMS-->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <CategoryTable
            :columns="columns"
            :data="getPaymentItemsFromState"
            :label="label"
            :message="message"
            :title="getPaymentCategoryName"
            :show_payment_category="false"
            :show_payment_item="true"
            :show_expenditure_category="false"
            :show_expenditure_item="false"
            :pagination="pagination"
            :table_loading="table_loader"
            @fetch-payment-items="fetchPaymentItems"
            @update-payment-item="updatePaymentItems"
            @delete-row="deleteRow"
            @update-payment-category="updatePaymentCategory"
            @show-references="showReferences"
            @view-payment-item="viewPaymentItem"
            @onRequest="onRequest"
          >
          </CategoryTable>
        </div>
      </div>
      <!------------------------------------------------END OF TABLE PAYMENT ITEMS-------------------------------->
    </div>

    <!-------------------------------------------------DAILOG FOR MEMBERS UNDER A PAYMENT ITEM------------------->
    <div v-if="show_reference_dialog">
      <q-dialog v-model="show_reference_dialog">
        <q-card>
          <q-card-section class="bg-primary">
            <label class="text-white toolbar_title">
              {{ $t("app.memberLabel") }}
            </label>
          </q-card-section>
          <q-card-section>
            <div>
              <q-list style="width: 400px">
                <q-item
                  v-for="reference in references"
                  :key="reference.id"
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white">
                      {{ getFirstLetter(reference.name) }}
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ reference.name }}</q-item-label>
                    <q-item-label caption lines="1">{{
                      reference.telephone
                    }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-icon
                      name="delete"
                      color="red"
                      size="xs"
                      @click="removeReference(reference)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-pa-lg">
            <q-btn
              :label="$t('app.ok')"
              v-close-popup
              color="primary"
              size="md"
              @click="fetchPaymentItems(false, 1, 7, 'name')"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!--------------------------------------------------END OF DIALOG------------------------------------------>

    <!--------------------------------------------------DELETE ITEM DIALOG------------------------------------>
    <div v-if="show_delete_dialog">
      <ConfirmDialog
        :data="deleted_row"
        :msg="delete_msg"
        :type="type"
        :show_member="true"
        @cancel-dialog="cancelDialog"
        @delete-row="removeMember"
      ></ConfirmDialog>
    </div>
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import ConfirmDialog from "src/components/ConfirmDialog.vue";

export default {
  mixins: [HelperMixinVue],

  mounted() {
    this.fetchPaymentItems(false, 1, 7, "name");
  },
  data() {
    return {
      loading: false,
      columns: [
        {
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
        },
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
          name: "amount",
          align: "left",
          label: "Amount(XAF)",
          field: "amount",
          sortable: true,
        },
        {
          name: "compulsory",
          required: true,
          label: "Compulsory",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "frequency",
          required: true,
          label: "Frequency",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "payment_item_type",
          required: true,
          label: "Type",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "reference",
          required: true,
          label: "Member(s)",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "action",
          label: "Action",
          field: "action",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      state: "",
      data: [],
      label: this.$t("app.delete"),
      message: this.$t("app.deletePaymentItemWarningMsg"),
      statuses: [
        { label: this.$t("app.compulsory"), value: 1 },
        { label: this.$t("app.notCompulsory"), value: 0 },
        { label: this.$t("app.all"), value: "ALL" },
      ],
      states: [
        {
          label: this.$t("app.active"),
          value: "active",
        },
        {
          label: this.$t("app.expired"),
          value: "expired",
        },
        {
          label: this.$t("app.all"),
          value: "ALL",
        },
      ],
      is_compulsory: "",
      type: "",
      frequency: "",
      payment_item_types: [
        "ALL_MEMBERS",
        "A_MEMBER",
        "MEMBERS_WITH_ROLES",
        "MEMBERS_WITHOUT_ROLES",
        "GROUPED_MEMBERS",
        "ALL",
      ],
      frequencies: ["YEARLY", "MONTHLY", "ONE_TIME", "ALL"],
      show_reference_dialog: false,
      references: [],
      deleted_row: null,
      delete_msg: "",
      show_delete_dialog: false,
      selected_payment_item: null,
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 7,
        rowsNumber: 0,
      },
      table_loader: false,
      loading_download: false,
    };
  },
  computed: {
    getPaymentCategoryName() {
      return this.$store.getters.getCurrentPaymentCategory.name;
    },

    validateFilter() {
      return (
        this.is_compulsory === "" && this.frequency === "" && this.type === ""
      );
    },

    validateDownload() {
      return this.getPaymentItemsFromState.length == 0;
    },

    getPaymentItemsFromState() {
      let items = [];
      if (this.$store.getters.getPaymentItems !== null) {
        this.$store.getters.getPaymentItems.data.forEach((ele) => {
          items.push({
            counter: this.$store.getters.getPaymentItems.data.indexOf(ele) + 1,
            name: ele.name,
            amount: ele.amount,
            id: ele.id,
            compulsory: ele.compulsory,
            payment_category_id: ele.payment_category_id,
            description: ele.description,
            payment_category_name: ele.payment_category_name,
            type: "PAYMENT_ITEMS",
            payment_item_type: ele.type,
            frequency: ele.frequency,
            references: ele.references,
            created_at: ele.created_at,
            updated_at: ele.updated_at,
            updated_by: ele.updated_by,
            deadline: ele.deadline,
            deadline_state: ele.deadline_state,
          });
        });
      }
      return items;
    },
  },

  methods: {
    fetchPaymentItems(is_filtering, page, per_page, sort_by) {
      let payment_category_id = this.$route.params.id;
      let is_compulsory_value =
        this.is_compulsory !== null && this.is_compulsory !== ""
          ? this.is_compulsory.value
          : "";
      let state_value =
        this.state !== null && this.state !== "" ? this.state.value : "";
      let type_value = this.type !== null && this.type !== "" ? this.type : "";
      let frequency_value =
        this.frequency !== null && this.frequency !== "" ? this.frequency : "";
      let payload = {
        status: "none",
        url: `/api/protected/filter-payment-items?payment_category_id=${payment_category_id}&is_compulsory=${is_compulsory_value}&type=${type_value}&frequency=${frequency_value}&state=${state_value}&page=${page}&per_page=${per_page}&sort_by=${sort_by}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
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
      this.$store.commit("SET_PAYMENT_ITEMS", null);
      this.table_loader = true;
      this.loading = is_filtering;
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.pagination.page = response.data.current_page;
          this.pagination.rowsPerPage = response.data.per_page;
          this.pagination.rowsNumber = response.data.total;
        })
        .finally(() => {
          this.table_loader = false;
          this.loading = false;
        });
    },

    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.fetchPaymentItems(false, page, fetch_count, sortBy);
    },

    updatePaymentCategory(data) {
      this.$emit("update-payment-category", data);
    },

    updatePaymentItems(data) {
      this.$store.dispatch("setUpdatedPaymentItem", data.data);

      this.$emit("update-payment-item", data);
    },

    viewPaymentItem(data) {
      this.$store.dispatch("setUpdatedPaymentItem", data.data);

      this.$emit("view-payment-item", data);
    },

    downloadItems() {
      let payment_category_id = this.$route.params.id;
      let is_compulsory_value =
        this.is_compulsory !== null && this.is_compulsory !== ""
          ? this.is_compulsory.value
          : "";
      let state_value =
        this.state !== null && this.state !== "" ? this.state.value : "";
      let type_value = this.type !== null && this.type !== "" ? this.type : "";
      let frequency_value =
        this.frequency !== null && this.frequency !== "" ? this.frequency : "";
      let url = `/api/protected/download-payment-items?payment_category_id=${payment_category_id}&is_compulsory=${is_compulsory_value}&frequency=${frequency_value}&type=${type_value}&state=${state_value}&page=&per_page`;
      let file_name = "Payment_Items.pdf";
      this.loadinloading_downloadg = this.downloadPdf(url, file_name);
    },

    filterPaymentItems() {
      let id = this.$store.getters.getCurrentPaymentCategory.id;
      this.$router.push({
        path: `/dashboard/payment-categories/${id}/items`,
        query: {
          status: this.is_compulsory,
          type: this.type,
          frequency: this.frequency,
          t: new Date().getTime(),
        },
      });
      this.fetchPaymentItems(true, 1, 2, "name");
    },

    deleteRow(data) {
      let payload = {
        url: `/api/protected/payment-categories/${data.payment_category_id}/payment-items/${data.id}`,
        msg: this.$t("app.paymentCategoryDeleteFeedbackMsg"),
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
      this.$store.dispatch("deleteRequest", payload).then(() => {
        this.fetchPaymentItems(false, 1, 4, "name");
      });
    },

    showReferences(data) {
      this.selected_payment_item = data.id;
      let references = data.references.filter((ele) => ele != null);
      this.references = JSON.parse(JSON.stringify(references));
      this.show_reference_dialog = true;
      return this.references;
    },

    getFirstLetter(data) {
      return data.substring(0, 1);
    },

    removeReference(reference) {
      this.show_delete_dialog = true;
      this.deleted_row = reference;
      this.delete_msg = this.$t("app.removeMember");
    },

    removeMember() {
      let payload = {
        url: `/api/protected/payment-items/update/reference`,
        data: {
          id: this.selected_payment_item,
          reference_id: this.deleted_row.id,
        },
        msg: this.$t("app.removeMemberSuccessMsg"),
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
      this.$store.dispatch("putRequest", payload).then(() => {
        this.getPaymentItemsReferences(this.selected_payment_item);
        this.show_delete_dialog = false;
      });
    },

    cancelDialog() {
      this.dialog = false;
      this.type = null;
      this.delete_msg = "";
      this.show_delete_dialog = false;
    },

    getPaymentItemsReferences(id) {
      let payload = {
        status: "none",
        url: `/api/protected/payment-items/${id}/references`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
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
      this.references = [];
      this.$store.dispatch("getRequest", payload).then((res) => {
        res.data.forEach((ele) => {
          this.references.push(ele);
        });
      });
    },
  },
  components: {
    CategoryTable,
    ConfirmDialog,
  },
};
</script>

<style lang="scss" scoped>
.toolbar_title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: large;
  letter-spacing: 0.01em;
}
</style>
