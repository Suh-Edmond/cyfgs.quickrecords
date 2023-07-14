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
            v-model="year"
            outlined
            dense
            :options="getSessionsFromState"
            :label="$t('app.selectYearLabel')"
          />
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-ml-md">
            <q-btn
              :label="$t('app.filter')"
              :loading="is_fetching"
              color="primary"
              :disabled="validateFilter"
              @click="filterExpenditureCategories"
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
            @click="downloadExpenditureCategory"
          ></q-btn>
        </div>
      </div>

      <!-- table for categories -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <CategoryTable
            :columns="columns"
            :data="getData"
            :label="label"
            :message="message"
            :show_payment_category="false"
            :show_payment_item="false"
            :show_expenditure_category="true"
            :show_expenditure_item="false"
            @show-expenditure-items="showExpenditureItems"
            @update-expenditure-category="updateExpenditureCategory"
            @delete-row="onDeleteRow"
          >
          </CategoryTable>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import ExpenditureCategoryMixinVue from "src/mixins/ExpenditureCategoryMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import CurrentYearMixin from "src/mixins/CurrentYearMixin.vue";

export default {
  mixins: [
    ExpenditureCategoryMixinVue,
    organisationMixinVue,
    expenditureItemMixinVue,
    HelperMixinVue,
    CurrentYearMixin,
  ],
  mounted() {
    this.fetchExpenditureCategories();
  },

  data() {
    return {
      year: null,
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
      label: this.$t('app.delete'),
      message: this.$t('app.deleteExpenditureCategoryWarningMsg'),
      start_filter: false,
      filteredExpenditureCategories: [],
      is_fetching:false,
    };
  },
  computed: {
    validateFilter (){
      return this.year == null
    },
    getData() {
      let data = [];
      if (
        this.filteredExpenditureCategories.length == 0 &&
        !this.start_filter
      ) {
        this.$store.getters.getExpenditureCategories.forEach((element) => {
          data.push({
            counter:
              this.$store.getters.getExpenditureCategories.indexOf(element) + 1,
            name: element.name,
            expenditure_items: this.$t('app.viewExpenditureItems'),
            id: element.id,
            description: element.description,
            type: "EXPENDITURE_CATEGORY",
            organisation_id: element.organisation_id,
          });
        });
      }else {
        data = this.filteredExpenditureCategories;
      }
      return data;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    validateDownload(){
      return this.getData.length == 0
    }
  },
  methods: {
    showExpenditureItems(data) {
      this.$store.dispatch(
        "setCurrentExpenditureCategory",
        data.expenditure_items
      );

      this.getExpenditureItemsByCategory();

      let intermediate_tabs = [];

      intermediate_tabs.push({
        name: this.$t('app.expenditureItemLabel'),
        has_intermediate_tab: true,
      });

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);

      this.$emit("show-expenditure-items", data);
    },

    updateExpenditureCategory(data) {
      this.$store.dispatch("setUpdatedExpenditureCategory", data.data);

      this.$emit("update-expenditure-category", data);
    },

    filterExpenditureCategories() {
      this.is_fetching = true;
      this.filteredExpenditureCategories = [];
      let organisation_id = this.getOrganisationId;
      this.$router.push({
        path: "/dashboard/expenditure-categories",
        query: { year: this.year },
      });

      let payload = {
        url: `/api/protected/expenditure-categories/filter?organisation_id=${organisation_id}&year=${this.year}`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t('app.expenditureCategoryErrorMsg'),
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
        this.is_fetching = false;
        if (res != undefined) {
          res.data.forEach((element) => {
            this.filteredExpenditureCategories.push({
              counter: res.data.indexOf(element) + 1,
              name: element.name,
              expenditure_items: this.$t('app.viewExpenditureItems'),
              id: element.id,
              description: element.description,
              type: "EXPENDITURE_CATEGORY",
              organisation_id: element.organisation_id,
            });
          });
        }
      });
    },

    downloadExpenditureCategory() {
      let id = this.getOrganisationId;
      let url = `/api/protected/expenditure-categories/download?organisation_id=${id}&year=${this.year}`;
      let file_name = "Expenditure_Categories.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    onDeleteRow(data) {
      let payload = {
        url: `/api/protected/organisations/${data.organisation_id}/expenditure-categories/${data.id}`,
        msg: this.$t('app.expenditureItemDeleteSuccessMsg'),
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
        this.fetchExpenditureCategories();
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
