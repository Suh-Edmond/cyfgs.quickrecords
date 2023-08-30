<template>
  <q-page>
    <div>
      <!-- header for filter categories -->
      <FilterComponentVue
        :show_member_filters="false"
        :show_categories="false"
        :show_filter_expenditure_items="true"
        :loading_download="loading_download"
        :disable_download_btn="validateDownload"
        @filter-expenditure-items="filterItems"
        @download-expenditure-itemss="downloadExpenditureItems"
      >
      </FilterComponentVue>

      <!-- table for categories -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <CategoryTable
            :columns="columns"
            :data="getExpenditureItems"
            :label="label"
            :message="message"
            :title="getTableTitle"
            :show_payment_category="false"
            :show_payment_item="false"
            :show_expenditure_category="false"
            :show_expenditure_item="true"
            :pagination="pagination"
            :table_loading="table_loader"
            @edit-expenditure-item="editExpenditureItem"
            @view-expenditure-item="viewExpenditureItem"
            @show-expenditure-item-details="showExpenditureItemDetails"
            @delete-row="deleteRow"
            @onRequest="onRequest"
          >
          </CategoryTable>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";
import CurrentYearMixin from "src/mixins/CurrentYearMixin.vue";
import FilterComponentVue from "src/components/FilterComponent.vue";

export default {
  mixins: [
    HelperMixinVue,
    ExpenditureItemDetailMixinVue,
    expenditureItemMixinVue,
    CurrentYearMixin,
  ],
  mounted() {
    this.fetchExpenditureItems(1, 7, "");
  },
  data() {
    return {
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
          name: "action",
          label: "Action",
          field: "action",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      data: [],
      label: this.$t("app.delete"),
      message: this.$t("app.deleteExpenditureItemWarningMsg"),
      status: "",
      payment_item_id: null,
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 7,
        rowsNumber: 0,
      },
      table_loader: false,
      session_id: this.$store.getters.getCurrentYear.id,
      loading_download: false,
    };
  },
  computed: {
    getExpenditureItems() {
      let data = [];
      if (this.$store.getters.getExpenditureItems !== null) {
        this.$store.getters.getExpenditureItems.data.forEach((ele) => {
          data.push({
            counter:
              this.$store.getters.getExpenditureItems.data.indexOf(ele) + 1,
            name: ele.name,
            id: ele.id,
            amount: ele.amount,
            venue: ele.venue,
            date: ele.date,
            comment: ele.comment,
            approve: ele.approve,
            expenditure_category: ele.expenditure_category,
            created_at: ele.created_at,
            updated_at: ele.updated_at,
            updated_by: ele.updated_by,
            total_amount_given: ele.total_amount_given,
            total_amount_spent: ele.total_amount_spent,
            total_balance: ele.total_balance,
            type: "EXPENDITURE_ITEMS",
            payment_item: ele.payment_item,
          });
        });
      }
      return data;
    },

    getTableTitle() {
      let title = "";
      if (this.payment_item_id !== null && this.payment_item_id !== "") {
        title =
          this.$t("app.expenditureItemTitlePartName") +
          `${this.payment_item_id.label}`;
      } else {
        title = this.$store.getters.getCurrentExpenditureCategory.name;
      }
      return title;
    },

    validateDownload() {
      return this.getExpenditureItems.length == 0;
    },
  },
  methods: {
    onRequest(props) {
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.fetchExpenditureItems(page, fetch_count, "");
    },

    fetchExpenditureItems(page, per_page, year_value) {
      let category = this.$store.getters.getCurrentExpenditureCategory;
      let payment_item_value =
        this.payment_item_id !== "" && this.payment_item_id !== null
          ? this.payment_item_id.value
          : "";
      let session_value =
        year_value == ""
          ? this.$store.getters.getCurrentYear.id
          : year_value.value;
      let payload = {
        status: "none",
        url: `/api/protected/expenditure-categories/${category.id}/expenditure-items?status=${this.status}&session_id=${session_value}&payment_item_id=${payment_item_value}&page=${page}&per_page=${per_page}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_EXPENDITURE_ITEMS",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.table_loader = true;
      this.$store.commit("SET_EXPENDITURE_ITEMS", null);
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.pagination.page = response.data.current_page;
          this.pagination.rowsNumber = response.data.total;
          this.pagination.rowsPerPage = response.data.per_page;
        })
        .finally(() => {
          this.table_loader = false;
        });
    },

    editExpenditureItem(data) {
      this.$store.dispatch("setUpdatedExpenditureItem", data.data);
      this.$emit("edit-expenditure-item", data);
    },

    viewExpenditureItem(data) {
      this.$store.dispatch("setUpdatedExpenditureItem", data.data);

      this.$emit("view-expenditure-item", data);
    },

    showExpenditureItemDetails(data) {
      this.$store.dispatch("setCurrentExpenditureItem", {
        id: data.expenditure_item.id,
        name: data.expenditure_item.name,
      });

      const intermediate_tabs = Array.from(
        this.$store.getters.getIntermediateTabs
      );

      intermediate_tabs.push({
        name: this.$t("app.expenditureItemDetailLabel"),
        has_intermediate_tab: true,
      });

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);

      this.$emit("show-expenditure-item-details", data);
    },

    downloadExpenditureItems(data) {
      let expenditure_category_id =
        this.$store.getters.getCurrentExpenditureCategory.id;
      let url = `/api/protected/expenditure-categories/expenditure-items/download?expenditure_category_id=${expenditure_category_id}&status=${data.payment_status}&payment_item_id=${data.payment_item_id.value}&session_id=${data.year.value}`;
      let file_name = "Expenditure_Items.pdf";
      this.loading_download = this.downloadPdf(url, file_name);
    },

    filterItems(data) {
      let expenditure_category =
        this.$store.getters.getCurrentExpenditureCategory;
      this.$router.push({
        path: `/dashboard/expenditure-categories/${expenditure_category.id}/items`,
        query: {
          payment_item_id: data.payment_item_id.label,
          status: data.payment_status,
          session: data.year.label,
          t: new Date().getTime(),
        },
      });

      this.setFilterVariables(data);
      this.fetchExpenditureItems(1, 7, data.year);
    },

    deleteRow(data) {
      let payload = {
        url: `/api/protected/expenditure-categories/${data.expenditure_category.id}/expenditure-items/${data.id}`,
        msg: this.$t("app.deleteExpenditureItemFeedbackMsg"),
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
        this.fetchExpenditureItems(1, 7, "");
      });
    },

    setFilterVariables(data) {
      this.payment_item_id = data.payment_item_id;
      this.status = data.payment_status;
      this.session_id = data.year;
    },
  },
  components: {
    CategoryTable,
    FilterComponentVue,
  },
};
</script>

<style lang="scss" scoped>
.search {
  cursor: pointer;
}
</style>
