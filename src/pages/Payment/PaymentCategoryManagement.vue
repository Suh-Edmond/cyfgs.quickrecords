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
            :options="getSessionsFromState"
            label="Select year"
            @input="filterPaymentCategories"
          />
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
            :show_payment_category="true"
            :show_payment_item="false"
            :show_expenditure_category="false"
            :show_expenditure_item="false"
            @delete-row="deleteRow"
            @show-payment-items="showPaymentItems"
            @update-payment-category="updatePaymentCategory"
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
          :show_payment_category="true"
          :show_payment_item="false"
          :show_expenditure_category="false"
          :show_expenditure_item="false"
          @show-payment-items="showPaymentItems"
          @update-payment-category="updatePaymentCategory"
          @delete-row="deleteRow"
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
import CurrentYearMixin from "src/mixins/CurrentYearMixin.vue";

export default {
  mixins: [PaymentCategoryMixinVue, HelperMixinVue, CurrentYearMixin],
  mounted() {
    let id = this.$store.getters.getOrganisation.id;
    this.fetchCategories(id, true);
  },
  data() {
    return {
      not_found_msg:
        "Ooops!! No Payment Categories found. Click the add button to add Payment Categories.",
      year: null,
      is_fetching: true,
      loading: false,
      start_filter: false,
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
      this.getPaymentItemsByCategory(data.data.id);

      let intermediate_tabs = [];

      intermediate_tabs.push({name: "Payment Items", has_intermediate_tab: true})

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs)

      this.$store.dispatch("setCurrentPaymentCategory", data.data);
    },

    updatePaymentItems(data) {
      this.$emit("update-payment-item", data);
    },

    filterPaymentCategories() {
      this.$router.push({
        path: "/dashboard/payment-categories",
        query: { year: this.year.label},
      });

      this.filteredPaymentCategories = [];
      let year = this.year.label.substring(0, 4);

      let organisationId = this.$store.getters.getOrganisation.id;
      let payload = {
        url: `/api/protected/filter-payment-categories?organisation_id=${organisationId}&year=${year}`,
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
      let year = this.year.label.substring(0, 4);

      let organisationId = this.$store.getters.getOrganisation.id;
      let url = `/api/protected/download-payment-categories?organisation_id=${organisationId}&year=${year}`;
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

    deleteRow(data){
      let payload = {
        url: `/api/protected/organisations/${data.organisation_id}/payment-categories/${data.id}`,
        msg:`Payment Item deleted successfully`,
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
        this.fetchCategories(data.organisation_id, true)
      });
    }
  },
  components: {
    NotFound,
    CategoryTable,
  },
};
</script>

<style lang="scss" scoped>

</style>
