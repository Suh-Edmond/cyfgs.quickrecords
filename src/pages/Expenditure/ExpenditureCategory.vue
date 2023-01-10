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
      :message="not_found_msg"
      v-if="getData.length == 0 && !getLoadingState"
    ></NotFound>

    <div v-if="getData.length > 0">
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
            v-model="year"
            outlined
            dense
            :options="years"
            label="Select year"
            @input="filterExpenditureCategories"
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
            @click="downloadExpenditureCategory"
          ></q-btn>
        </div>
      </div>

      <!-- table for categories -->
      <div class="row q-pt-sm" v-show="!start_filter">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <CategoryTable
            :columns="columns"
            :data="getData"
            :label="label"
            :message="message"
            @show-expenditure-items="showExpenditureItems"
            @update-expenditure-category="updateExpenditureCategory"
            :show_payment_category="false"
            :show_payment_item="false"
            :show_expenditure_category="true"
            :show_expenditure_item="false"
          >
          </CategoryTable>
        </div>
      </div>

      <!-- table for filtered categories -->
      <div class="col-md-12 col-xs-12 col-sm-12" v-show="start_filter">
        <CategoryTable
          :columns="columns"
          :data="filteredExpenditureCategories"
          :label="label"
          :message="message"
          @show-expenditure-items="showExpenditureItems"
          @update-expenditure-category="updateExpenditureCategory"
          :show_payment_category="false"
          :show_payment_item="false"
          :show_expenditure_category="true"
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
import { SessionStorage } from "quasar";
import ExpenditureCategoryMixinVue from "src/mixins/ExpenditureCategoryMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";

export default {
  mixins: [
    ExpenditureCategoryMixinVue,
    organisationMixinVue,
    expenditureItemMixinVue,
    HelperMixinVue,
  ],
  mounted() {
    this.fetchExpenditureCategories();
  },

  data() {
    return {
      not_found_msg:
        "Ooops!! No Expenditure Categories found. Click the add button to add Expenditure Categories.",
      year: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
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
          name: "expenditure_items",
          align: "center",
          label: "",
          field: "expenditure_items",
        },
        {
          name: "action",
          label: "Action",
          field: "action",
        },
      ],
      label: "Delete",
      message: "Are you sure you want to delete this Expenditure Category?",
      start_filter: false,
      filteredExpenditureCategories: [],
    };
  },
  computed: {
    getData() {
      let data = [];

      this.$store.getters.getExpenditureCategories.forEach((element) => {
        data.push({
          counter:
            this.$store.getters.getExpenditureCategories.indexOf(element) + 1,
          name: element.name,
          expenditure_items: "View Expenditure Items",
          id: element.id,
          description: element.description,
          type: "EXPENDITURE_CATEGORY",
          organisation_id: element.organisation_id,
        });
      });

      return data;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },
  methods: {
    showExpenditureItems(data) {
      this.$store.dispatch(
        "setCurrentExpenditureCategory",
        data.expenditure_items
      );

      this.getExpenditureItemsByCategory();

      SessionStorage.set("intermediate_tab", "Expenditure Items");

      SessionStorage.set("has_intermediate_tab", true);

      this.$emit("show-expenditure-items", data);
    },

    updateExpenditureCategory(data) {
      this.$store.dispatch("setUpdatedExpenditureCategory", data.data);

      this.$emit("update-expenditure-category", data);
    },

    filterExpenditureCategories() {
      this.filteredExpenditureCategories = [];
      let organisation_id = this.getOrganisationId;
      this.$router.push({
        path: "/dashboard/expenditure-categories",
        query: { year: this.year},
      });

      let payload = {
        url: `/api/protected/expenditure-categories/filter?organisation_id=${organisation_id}&year=${this.year}`,
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
        if (res != undefined) {
          res.data.forEach((element) => {
            this.filteredExpenditureCategories.push({
              counter: res.data.indexOf(element) + 1,
              name: element.name,
              expenditure_items: "View Expenditure Items",
              id: element.id,
              description: element.description,
              type: "EXPENDITURE_CATEGORY",
              organisation_id: element.organisation_id,
            });
          });
        }
        this.year = null;
      });
    },

    downloadExpenditureCategory() {
      let id = this.getOrganisationId;
      let url = `/api/protected/expenditure-categories/download?organisation_id=${id}&year=${this.year}`;
      let file_name = "Expenditure_Categories.pdf";
      this.loading = this.downloadPdf(url, file_name);
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
