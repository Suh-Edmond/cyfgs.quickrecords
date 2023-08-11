<template>
  <q-page>
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-md"
        v-if="getLoadingState"
      />
    </div>

    <div>
      <!-------------------------------------------------HEADER FOR PAYMENT ITEMS-------------------------------->
      <div
        class="row q-ml-xs q-pt-xs"
        :class="$q.screen.lg ? 'q-pa-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <q-select
            v-model="is_compulsory"
            outlined
            dense
            :options="statuses"
            :label="$t('app.selectStatusLabel')"
          />
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-ml-md">
          <q-select
            v-model="type"
            outlined
            dense
            :options="payment_item_types"
            :label="$t('app.selectPaymentType')"
          />
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-ml-md">
          <q-select
            v-model="frequency"
            outlined
            dense
            :options="frequencies"
            :label="$t('app.selectFrequency')"
          />
        </div>
        <div class="col-md-1 col-lg-1 col-xs-12 col-sm-12 q-ml-md">
          <q-btn
            :label="$t('app.filter')"
            :loading="loading_filter"
            color="primary"
            :disabled="validateFilter"
            @click="filterPaymentItems"
            no-caps
            icon-right="filter_list"
          >
          </q-btn>
        </div>

        <q-space />
        <div class="button q-pb-xs">
          <q-btn
            :label="$t('app.print')"
            :loading="loading"
            color="positive"
            :disabled="validateDownload"
            no-caps
            icon-right="print"
            @click="downloadItems"
          ></q-btn>
        </div>
      </div>
      <!------------------------------------------------END OF HEADER------------------------------------------->

      <!-----------------------------------------------TABLE FOR PAYMENT ITEMS-->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <CategoryTable
            :columns="columns"
            :data="getPaymentItems"
            :label="label"
            :message="message"
            :title="getPaymentCategoryName"
            :show_payment_category="false"
            :show_payment_item="true"
            :show_expenditure_category="false"
            :show_expenditure_item="false"
            @update-payment-item="updatePaymentItems"
            @delete-row="deleteRow"
            @update-payment-category="updatePaymentCategory"
            @show-references="showReferences"
            @view-payment-item="viewPaymentItem"
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
          <q-card-section class="q-my-md">
            <q-toolbar class="bg-primary text-white shadow-2">
              <q-toolbar-title class="toolbar_title flex text-white">
                 {{$t('app.memberLabel')}}
              </q-toolbar-title>
            </q-toolbar>
            <div class="q-mt-md">
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
              @click="fetchPaymentItems()"
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
    this.getPaymentItemsFromState();
  },
  data() {
    return {
      is_filtering: false,
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
          align: "center",
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
      data: [],
      label: this.$t('app.delete'),
      message: this.$t('app.deletePaymentItemWarningMsg'),
      statuses: [
        { label: this.$t('app.compulsory'), value: true },
        { label: this.$t('app.notCompulsory'), value: false },
      ],
      is_compulsory: "",
      filteredPaymentItems: [],
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
      loading_filter: false,
      show_reference_dialog: false,
      references: [],
      deleted_row: null,
      delete_msg: "",
      show_delete_dialog: false,
      selected_payment_item: null,
    };
  },
  computed: {
    getPaymentItems() {
      let items = this.getPaymentItemsFromState();
      return items;
    },

    getPaymentCategoryName() {
      return this.$store.getters.getCurrentPaymentCategory.name;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    validateFilter() {
      return this.is_compulsory == null &&
        this.frequency == null &&
        this.type == null
        ? true
        : false;
    },

    validateDownload() {
      return this.getPaymentItems == 0;
    },
  },

  methods: {
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
    getPaymentItemsFromState() {
      let items = [];
      if (this.filteredPaymentItems.length == 0 && !this.is_filtering) {
        if (this.$store.getters.getPaymentItems) {
          this.$store.getters.getPaymentItems.data.forEach((ele) => {
            items.push({
              counter:
                this.$store.getters.getPaymentItems.data.indexOf(ele) + 1,
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
            });
          });
        }
      } else {
        items = this.filteredPaymentItems;
      }
      return items;
    },

    downloadItems() {
      let id = this.$store.getters.getCurrentPaymentCategory.id;
      let url = `/api/protected/download-payment-items?payment_category_id=${id}&is_compulsory=${this.is_compulsory.value}&frequency=${this.frequency}&type=${this.type}`;
      let file_name = "Payment_Items.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    filterPaymentItems() {
      let id = this.$store.getters.getCurrentPaymentCategory.id;
      this.$router.push({
        path: `/dashboard/payment-categories/${id}/items`,
        query: {
          status: this.is_compulsory,
          type: this.type,
          frequency: this.frequency,
        },
      });

      this.filteredPaymentItems = [];
      this.loading_filter = true;
      let payload = {
        url: `/api/protected/filter-payment-items?payment_category_id=${id}&is_compulsory=${this.is_compulsory.value}&type=${this.type}&frequency=${this.frequency}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t('app.paymentItemErrorMsg'),
        has_commit: false,
        show_feedback: false,
        show_spinner: true,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.is_filtering = true;
        this.loading_filter = false;
        res.data.data.forEach((ele) => {
          this.filteredPaymentItems.push({
            counter: res.data.data.indexOf(ele) + 1,
            name: ele.name,
            amount: ele.amount,
            id: ele.id,
            complusory: ele.complusory ? "YES" : "NO",
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
          });
        });
      });
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

    deleteRow(data) {
      let payload = {
        url: `/api/protected/payment-categories/${data.payment_category_id}/payment-items/${data.id}`,
        msg: this.$t('app.paymentCategoryDeleteFeedbackMsg'),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: this.$t('app.defaultErrorMsg'),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("deleteRequest", payload).then(() => {
        this.getPaymentItemsByCategory(data.payment_category_id);
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
      this.delete_msg = this.$t('app.removeMember');
    },

    removeMember() {
      let payload = {
        url: `/api/protected/payment-items/update/reference`,
        data: {
          id: this.selected_payment_item,
          reference_id: this.deleted_row.id,
        },
        msg: this.$t('app.removeMemberSuccessMsg'),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: this.$t('app.defaultErrorMsg'),
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

    fetchPaymentItems() {
      this.getPaymentItemsByCategory(this.$route.params.id);
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
