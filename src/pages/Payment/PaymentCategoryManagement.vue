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

    <NotFound :message="not_found_msg" v-if="getData.length == 0 && !getLoadingState"></NotFound>


    <!-- header for filter categories -->
    <div v-if="getData.length > 0 && !getLoadingState">
      <div
        class="row q-ml-xs q-pt-xs"
        :class="$q.screen.lg ? 'q-pa-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <q-select
            v-model="year"
            outlined
            dense
            :options="years"
            label="Select year"
            @input="filterPaymentCategories"
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
            @click="downloadPaymentCategory"
          ></q-btn>
        </div>
      </div>
      <!-- table for categories -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12" v-show="!start_filter">
          <CategoryTable
            :columns="columns"
            :data="getData"
            :label="label"
            :message="message"
            @show-payment-items="showPaymentItems"
            @update-payment-category="updatePaymentCategory"
            :show_payment_category="true"
            :show_payment_item="false"
            :show_expenditure_category="false"
            :show_expenditure_item="false"
          >
          </CategoryTable>
        </div>
      </div>

      <!-- table for filtered categories -->
      <div class="col-md-12 col-xs-12 col-sm-12" v-show="start_filter">
        <CategoryTable
          :columns="columns"
          :data="filteredPaymentCategories"
          :label="label"
          :message="message"
          @show-payment-items="showPaymentItems"
          @update-payment-category="updatePaymentCategory"
          :show_payment_category="true"
          :show_payment_item="false"
          :show_expenditure_category="false"
          :show_expenditure_item="false"
        >
        </CategoryTable>
      </div>
    </div>
  </q-page>
</template>

<script>
import NotFound from "src/components/NotFound.vue";
import CategoryTable from "src/components/CategoryTable.vue";
import PaymentCategoryMixinVue from "src/mixins/PaymentCategoryMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";

export default {
  mixins: [PaymentCategoryMixinVue, HelperMixinVue],
  mounted() {
    let id = this.$store.getters.getOrganisation.id;
    this.fetchCategories(id);
  },
  data() {
    return {
      not_found_msg:
        "Ooops!! No Payment Categories found. Click the add button to add Payment Categories.",
      year: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
      search: null,
      label_fetch: "Filter",
      is_fetching: true,
      color: "primary",
      loading: false,
      start_filter: false,
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
          name: "item",
          align: "center",
          label: "",
          field: "item",
        },
        {
          name: "action",
          label: "Action",
          field: "action",
        },
      ],
      label: "Delete",
      message: "Are you sure you want to delete this Payment Category?",
      filteredPaymentCategories: [],
    };
  },
  computed: {
    getData() {
      let data = [];

      this.$store.getters.getPaymentCategories.forEach((element) => {
        data.push({
          counter:
            this.$store.getters.getPaymentCategories.indexOf(element) + 1,
          name: element.name,
          item: "View Payment Items",
          id: element.id,
          description: element.description,
          type: "PAYMENT_CATEGORY",
          organisation_id: element.organisation_id,
        });
      });

      return data;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState
    },
  },

  watch: {
    getLoadingState() {
      return this.$store.getters.getFetchingState
    },
  },


  methods: {
    updatePaymentCategory(data) {
      this.$store.dispatch("setUpdatedPayCategories", data.data);

      this.$emit("update-payment-category", data);
    },
    showPaymentItems(data) {
      this.getPaymentItemsByCategory(data.payment_items.id);

      let intermediate_tabs = [];

      intermediate_tabs.push({name: "Payment Items", has_intermediate_tab: true})

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs)

      this.$store.dispatch("setCurrentPaymentCategory", data.payment_items);
    },

    updatePaymentItems(data) {
      this.$emit("update-payment-item", data);
    },

    filterPaymentCategories() {
      this.$router.push({
        path: "/dashboard/payment-categories",
        query: { year: this.year},
      });

      this.filteredPaymentCategories = [];

      let organisationId = this.getOrganisationId;
      let payload = {
        url: `/api/protected/filter-payment-categories?organisation_id=${organisationId}&year=${this.year}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Could not fetch payment categories",
        has_commit: false,
        show_feedback: false,
        show_spinner:true,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.start_filter = true;
        res.data.forEach((element) => {
          this.filteredPaymentCategories.push({
            counter: res.data.indexOf(element) + 1,
            name: element.name,
            item: "View Payment Items",
            id: element.id,
            description: element.description,
            type: "PAYMENT_CATEGORY",
            organisation_id: element.organisation_id,
          });
        });
      });
    },

    downloadPaymentCategory() {
      let id = this.getOrganisationId;
      let url = `/api/protected/download-payment-categories?organisation_id=${id}&year=${this.year}`;
      let file_name = "Organisation_Payment_Categories.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    getPaymentItemsByCategory(id) {
      let payload = {
        status: "none",
        url: `/api/protected/payment-categories/${id}/payment-items`,
        has_path_val: true,
        show_feedback: false,
        show_spinner:true,
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
  },
  components: {
    NotFound,
    CategoryTable,
  },
};
</script>

<style lang="scss" scoped>
.search {
  cursor: pointer;
}
</style>
