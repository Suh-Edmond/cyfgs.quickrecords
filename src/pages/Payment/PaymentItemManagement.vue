<template>
  <q-page>
    <div>
      <FilterComponentVue
        :show_member_filters="false"
        :show_categories="false"
        :show_filter_payment_items="true"
        :loading_download="loading_download"
        :disable_download_btn="validateDownload"
        @filter-payment-items="filterPaymentItems"
        @download-payment-items="downloadPaymentItems"
      >
      </FilterComponentVue>
      <!-----------------------------------------------TABLE FOR PAYMENT ITEMS-->
      <CategoryTable
        :class="$q.platform.is.desktop ? 'q-pt-sm q-px-sm' : ' q-px-sm q-pt-xl'"
        :columns="columns"
        :data="getPaymentItemsFromState"
        :label="label"
        :message="message"
        :title="getPaymentCategoryName"
        :show_payment_category="false"
        :show_payment_item="true"
        :show_expenditure_category="false"
        :show_expenditure_item="false"
        :pagination="getPagination"
        :table_loading="getLoadingState"
        @fetch-payment-items="fetchPaymentItems"
        @update-payment-item="updatePaymentItems"
        @delete-row="deleteRow"
        @update-payment-category="updatePaymentCategory"
        @show-references="showReferences"
        @view-payment-item="viewPaymentItem"
        @onRequest="onRequest"
      >
      </CategoryTable>
      <!------------------------------------------------END OF TABLE PAYMENT ITEMS-------------------------------->
    </div>

    <!-------------------------------------------------DAILOG FOR MEMBERS UNDER A PAYMENT ITEM------------------->
    <div v-if="show_reference_dialog">
      <q-dialog v-model="show_reference_dialog">
        <q-card style="width: 400px">
          <q-card-section class="bg-primary">
            <label
              class="text-white toolbar_title"
              v-if="selected_payment_item.type !== 'A_MEMBER'"
            >
              {{ $t("app.memberLabel") }} ({{ references.length }})
            </label>
            <label
              class="text-white toolbar_title"
              v-if="selected_payment_item.type === 'A_MEMBER'"
            >
              {{ $t("app.member") }} ({{ references.length }})
            </label>
          </q-card-section>
          <q-linear-progress indeterminate v-show="is_fetching_members" />
          <q-card-section>
            <div>
              <q-list>
                <q-item
                  v-for="reference in references"
                  :key="reference.id"
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
                      class="remove_reference_icon"
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
import FilterComponentVue from "src/components/FilterComponent.vue";

export default {
  mixins: [HelperMixinVue],
  beforeMount() {
    this.$store.commit("SET_PAGINATION", {
      sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    });
  },

  mounted() {
    this.fetchPaymentItems(false, 1, 10, "name");
  },
  data() {
    return {
      loading: false,
      columns: [
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
      is_compulsory: "",
      type: "",
      frequency: "",
      show_reference_dialog: false,
      references: [],
      deleted_row: null,
      delete_msg: "",
      show_delete_dialog: false,
      selected_payment_item: null,
      loading_download: false,
      is_fetching_members: false,
    };
  },
  computed: {
    getPaymentCategoryName() {
      return this.$store.getters.getCurrentPaymentCategory.name;
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

    getPagination() {
      let paginate_object = {
        sortBy: this.$store.getters.getPagination.sortBy,
        descending: this.$store.getters.getPagination.descending,
        page: this.$store.getters.getPagination.page,
        rowsPerPage: this.$store.getters.getPagination.rowsPerPage,
        rowsNumber: this.$store.getters.getPagination.rowsNumber,
      };

      return paginate_object;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },

  methods: {
    fetchPaymentItems(is_filtering, page, per_page, sort_by) {
      let is_compulsory_value =
        this.is_compulsory !== null && this.is_compulsory !== ""
          ? this.is_compulsory.value
          : "";
      let state_value =
        this.state !== null && this.state !== "" ? this.state.value : "";
      let payment_category_id = this.$route.params.id;
      let type_value = this.type !== null && this.type !== "" ? this.type : "";
      let payload = {
        status: "none",
        url: `/api/protected/filter-payment-items?payment_category_id=${payment_category_id}&is_compulsory=${is_compulsory_value}&type=${type_value}&frequency=${this.frequency}&state=${state_value}&page=${page}&per_page=${per_page}&sort_by=${sort_by}`,
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
      this.$store.commit("SET_IS_FETCHING", true);
      this.loading = is_filtering;
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          if (response.success) {
            this.$store.commit("SET_PAGINATION", {
              sortBy: "name",
              descending: false,
              page: response.data.current_page,
              rowsPerPage: response.data.per_page,
              rowsNumber: response.data.total,
            });
          }
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
          this.loading = false;
        });
    },

    onRequest(props) {
      const { page, rowsPerPage, sortBy } = props.pagination;
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

    downloadPaymentItems(data) {
      let payment_category_id = this.$route.params.id;
      let is_compulsory =
        data.is_compulsory !== "" ? data.is_compulsory.value : "";
      let category_name = this.$store.getters.getCurrentPaymentCategory.name;
      let url = `/api/protected/download-payment-items?payment_category_id=${payment_category_id}&is_compulsory=${is_compulsory}&frequency=${data.frequency}&type=${data.type}&state=${data.state}&page=&per_page&category_name=${category_name}`;
      let file_name = "Payment_Items.pdf";
      this.loading_download = this.downloadPdf(url, file_name);
    },

    filterPaymentItems(data) {
      let id = this.$store.getters.getCurrentPaymentCategory.id;
      this.setFilterVariables(data);
      this.$router.push({
        path: `/dashboard/payment-categories/${id}/items`,
        query: {
          status: data.is_compulsory,
          type: data.type,
          frequency: data.frequency,
          state: data.state,
          t: new Date().getTime(),
        },
      });
      this.fetchPaymentItems(true, 1, 10, "name");
    },

    deleteRow(data) {
      let payload = {
        url: `/api/protected/payment-categories/${data.payment_category_id}/payment-items/${data.id}`,
        msg: this.$t("app.deletePaymentItemFeedbackMsg"),
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
        this.fetchPaymentItems(false, 1, 10, "name");
      });
    },

    showReferences(data) {
      this.selected_payment_item = data;
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
          id: this.selected_payment_item.id,
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
      this.is_fetching_members = true;
      this.$store
        .dispatch("putRequest", payload)
        .then(() => {
          this.fetchPaymentItem(
            this.$route.params.id,
            this.selected_payment_item.id
          );
          this.show_delete_dialog = false;
        })
        .finally(() => {
          this.references = this.references.filter(
            (ele) => ele.id !== this.deleted_row.id
          );
          this.is_fetching_members = false;
        });
      return this.references;
    },

    cancelDialog() {
      this.dialog = false;
      this.type = null;
      this.delete_msg = "";
      this.show_delete_dialog = false;
    },

    setFilterVariables(data) {
      this.is_compulsory =
        typeof data.is_compulsory === undefined ? "" : data.is_compulsory;
      this.frequency = data.frequency;
      this.type = data.type;
      this.state = typeof data.state === undefined ? "" : data.state;
    },

    fetchPaymentItem(payment_category_id, payment_item_id) {
      let payload = {
        status: "none",
        url: `/api/protected/payment-categories/${payment_category_id}/payment-items/${payment_item_id}`,
        has_path_val: false,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "",
        has_commit: false,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          if (response.success) {
            this.$store.getters.getPaymentItems.data =
              this.$store.getters.getPaymentItems.data.filter(
                (payment_item) => payment_item.id !== payment_item_id
              );
            this.$store.getters.getPaymentItems.data.push(response.data);
          }
        })
        .finally(() => {});
    },
  },
  components: {
    CategoryTable,
    ConfirmDialog,
    FilterComponentVue,
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

.remove_reference_icon {
  cursor: pointer;
}
</style>
