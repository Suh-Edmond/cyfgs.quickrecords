<template>
  <q-page>
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-lg"
        v-if="getLoadingState && expenditure_category_id != null"
      />
    </div>

    <div>
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
            v-model="expenditure_category_id"
            outlined
            dense
            :options="getExpenditureCategories"
            label="Select expenditure category"
            @input="fetchItems"
          />
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn
            :label="label_download"
            :loading="loading"
            :color="color_print"
            :disabled="false"
            no-caps
            icon-right="print"
            @click="downloadExpenditureItems"
          ></q-btn>
        </div>
      </div>
      <!-- table for expenditure items -->
      <div>
        <div class="row q-pt-sm">
          <div class="col-md-12 col-xs-12 col-sm-12">
            <CategoryTable
              :columns="columns"
              :data="getExpenditures"
              :label="label"
              :message="message"
              :title="getExpenditureCategoryName"
              :show_payment_category="false"
              :show_payment_item="false"
              :show_expenditure_category="false"
              :show_expenditure_item="true"
              @show-expenditure-items="showExpenditureItem"
            >
            </CategoryTable>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import { SessionStorage } from "quasar";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import OrganisationMixin from "src/mixins/organisationMixin.vue";
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";

export default {
  mixins: [
    OrganisationMixin,
    HelperMixinVue,
    ExpenditureItemDetailMixinVue,
    expenditureItemMixinVue,
  ],
  mounted() {
    this.fetchExpenditureCategories();
  },
  data() {
    return {
      search: null,
      label_fetch: "Filter",
      color: "primary",
      no_caps: true,
      loading: false,
      label_download: "Print",
      color_print: "positive",
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
          label: "Estimated Amount (XAF)",
          field: "amount",
          sortable: true,
        },
        {
          name: "venue",
          align: "left",
          label: "Venue",
          field: "venue",
          sortable: true,
        },
        {
          name: "date",
          align: "left",
          label: "Date",
          field: "date",
          sortable: true,
        },
        {
          name: "state",
          align: "left",
          label: "Transaction Status",
          field: "state",
          sortable: true,
        },
        {
          name: "action",
          label: "Action",
          field: "action",
          sortable: true,
          align: "left",
        },
      ],
      data: [],
      label: "Delete",
      message: "Are you sure you want to delete this Expenditure Item?",
      expenditure_category_id: null,
      start_filter: false,
      filtered_items: [],
      expenditure_items: [],
    };
  },
  computed: {
    getExpenditureCategories() {
      let data = [];

      this.$store.getters.getExpenditureCategories.forEach((element) => {
        data.push({
          label: element.name,
          value: element.id,
        });
      });

      return data;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getExpenditures() {
      let data = [];
      if (this.$store.getters.getExpenditures != null) {
        this.$store.getters.getExpenditures.forEach((ele) => {
          data.push({
            counter: this.$store.getters.getExpenditures.indexOf(ele) + 1,
            name: ele.name,
            id: ele.id,
            amount: ele.amount,
            venue: ele.venue,
            date: ele.date,
            comment: ele.comment,
            approve: ele.approve,
            expenditure_category_id: ele.expenditure_category_id,
            created_at: ele.created_at,
            updated_at: ele.updated_at,
            updated_by: ele.updated_by,
            expenditure_details: ele.expenditure_details,
            total_amount_given: ele.total_amount_given,
            total_amount_spent: ele.total_amount_spent,
            total_balance: ele.total_balance,
            type: "EXPENDITURE_ITEMS",
            show_state_action: this.checkIfExpendituredetailsStatus(ele.expenditure_details)
          });
        });
      }
      return data;
    },

    getExpenditureCategoryName() {
      return this.$store.getters.getExpenditureCategory != null
        ? this.$store.getters.getExpenditureCategory.name
        : "";
    },
  },
  methods: {
    //this check to ensure if an expenditure item can be approve/decline
    //so the negation will be used
    checkIfExpendituredetailsStatus(data) {
      return data.filter((ele) => ele.approve == "PENDING").length == 0;
    },
    fetchExpenditureCategories() {
      let organisationId = this.getOrganisationId;
      let payload = {
        url: `/api/protected/organisations/${organisationId}/expenditure-categories`,
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

    showExpenditureItem(data) {
      SessionStorage.set("intermediate_tab", "Expenditure Items");

      SessionStorage.set("has_intermediate_tab", true);

      this.$emit("show-expenditure-items", data);
    },

    downloadExpenditureItems() {
      let expenditure_category_id = this.expenditure_category_id;
      let state = this.status === "APPROVED" ? 1 : 0;
      let url = `/api/protected/expenditure-items/download?expenditure_category_id=${expenditure_category_id}&status=${state}`;
      let file_name = "Expenditure_Items.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    fetchItems() {
      const selected_expenditure_category =
        this.$store.getters.getExpenditureCategories.find(
          (ele) => ele.id == this.expenditure_category_id.value
        );

      let payload = {
        status: "none",
        url: `/api/protected/expenditure-categories/${selected_expenditure_category.id}/expenditures`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_EXPENDITURES",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {
        this.$store.dispatch(
          "setExpenditureCategory",
          selected_expenditure_category
        );
      });
    },
  },
  components: {
    CategoryTable,
  },
};
</script>

<style lang="scss" scoped>
.search {
  cursor: pointer;
}
</style>
