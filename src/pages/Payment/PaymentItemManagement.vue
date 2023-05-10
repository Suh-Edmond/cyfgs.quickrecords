<template>
  <q-page>
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-lg"
        v-if="getLoadingState"
      />
    </div>

    <NotFound
      :message="getNotFoundMsgForPaymentItems"
      v-if="getPaymentItems.length == 0 && !getLoadingState"
    ></NotFound>

    <div v-if="getPaymentItems.length > 0 && !getLoadingState">
      <!-- header for filter categories -->
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
            label="Select status"
          />
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-ml-md">
          <q-select
            v-model="type"
            outlined
            dense
            :options="payment_item_types"
            label="Select type"
          />
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-ml-md">
          <q-select
            v-model="frequency"
            outlined
            dense
            :options="frequencies"
            label="Select frequency"
          />
        </div>
        <div class="col-md-1 col-lg-1 col-xs-12 col-sm-12 q-ml-md">
          <q-btn
            label="Filter"
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
            label="Print"
            :loading="loading"
            color="positive"
            :disabled="false"
            no-caps
            icon-right="print"
            @click="downloadItems"
          ></q-btn>
        </div>
      </div>
      <!-- table for categories -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12" v-show="!start_filter">
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
          >
          </CategoryTable>
        </div>

        <div class="col-md-12 col-xs-12 col-sm-12" v-show="start_filter">
          <CategoryTable
            :columns="columns"
            :data="filteredPaymentItems"
            :label="label"
            :message="message"
            :title="getPaymentCategoryName"
            @update-payment-category="updatePaymentCategory"
            :show_payment_category="false"
            :show_payment_item="true"
            @update-payment-item="updatePaymentItems"
            :show_expenditure_category="false"
            :show_expenditure_item="false"
            @show-references="showReferences"
          >
          </CategoryTable>
        </div>
      </div>
    </div>

    <!-- dialog to show all members responsible for a payment item -->
    <div v-if="show_reference_dialog">
      <q-dialog v-model="show_reference_dialog">
        <q-card>
          <q-card-section>
            <q-toolbar class="bg-primary text-white shadow-2">
              <q-toolbar-title class="toolbar_title">Members</q-toolbar-title>
            </q-toolbar>
          </q-card-section>
          <q-card-section>
            <div class="q-mb-md q-px-md">
              <q-input
                v-model="searched_reference"
                outlined
                type="search"
                dense
                label="Search..."
                @input="searchReference(references)"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="q-mt-md">
              <q-list style="width: 400px">
                <q-item
                  v-for="reference in references"
                  :key="reference.id"
                  class="q-my-sm"
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
            <q-btn  label="OK" v-close-popup color="primary" size="md" @click="fetchPaymentItems()"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <!-- confirm delete dialog -->
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
import NotFound from "src/components/NotFound.vue";
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
      not_found_msg: "",
      start_filter: false,
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
      label: "Delete",
      message: "Are you sure you want to delete this Payment Item?",
      statuses: [
        { label: "COMPLUSORY", value: true },
        { label: "NOT COMPLUSORY", value: false },
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
      ],
      frequencies: ["YEARLY", "MONTHLY", "ONE_TIME"],
      loading_filter: false,
      show_reference_dialog: false,
      references: [],
      searched_reference: null,
      deleted_row: null,
      delete_msg: "",
      show_delete_dialog: false,
      selected_payment_item:null
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

    getNotFoundMsgForPaymentItems() {
      let msg = "";
      if (this.$store.getters.getCurrentPaymentCategory != undefined) {
        msg = `Ooops!! No Payment Items found for Category [${this.$store.getters.getCurrentPaymentCategory.name}]. Click the add button to add Payment Items.`;
      }
      return msg;
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
  },

  methods: {
    updatePaymentCategory(data) {
      this.$emit("update-payment-category", data);
    },
    updatePaymentItems(data) {
      this.$store.dispatch("setUpdatedPaymentItem", data.data);

      this.$emit("update-payment-item", data);
    },

    getPaymentItemsFromState() {
      let items = [];
      if (this.$store.getters.getPaymentItems) {
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
          });
        });
      }
      return items;
    },

    downloadItems() {
      let id = this.$store.getters.getCurrentPaymentCategory.id;
      let url = `/api/protected/download-payment-items?payment_category_id=${id}`;
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
      let payload = {
        url: `/api/protected/filter-payment-items?payment_category_id=${id}&is_compulsory=${this.is_compulsory.value}&type=${this.type}&frequency=${this.frequency}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch payment categories",
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
        this.start_filter = true;
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
        msg: `Payment Category deleted successfully`,
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
    searchReference(data) {
      const ref = data;
      if (this.searched_reference.length >= 2) {
        this.references = this.references.filter((ref) =>
          ref.name.toLowerCase().includes(this.searched_reference.toLowerCase())
        );
      } else {
        this.references = ref;
      }
      return this.references;
    },

    removeReference(reference) {
      this.show_delete_dialog = true;
      this.deleted_row = reference;
      this.delete_msg =
        "Are you sure you want to remove this Member?";
    },

    removeMember(){
      let payload = {
        url: `/api/protected/payment-items/update/reference`,
        data:{
          id:this.selected_payment_item,
          reference_id:this.deleted_row.id
        },
        msg: `Member remove successfully`,
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
      this.$store.dispatch("putRequest", payload).then(() => {
        this.getPaymentItemsReferences(this.selected_payment_item);
        this.show_delete_dialog = false
      });
    },

    cancelDialog(){
      this.dialog = false;
      this.type = null;
      this.delete_msg = "";
      this.show_delete_dialog = false
    },

    getPaymentItemsReferences(id){
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
        })
      });
    },

    fetchPaymentItems(){
      this.getPaymentItemsByCategory(this.$route.params.id)
    }
  },
  components: {
    NotFound,
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
  align-items: center;
  letter-spacing: 0.01em;
}
</style>
