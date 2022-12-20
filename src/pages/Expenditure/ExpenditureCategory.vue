<template>
  <q-page>
    <NotFound :message="not_found_msg" v-if="getData.length == 0"></NotFound>

    <div v-if="getData.length > 0">
      <!-- header for filter categories -->
      <div class="row q-ml-xs q-pt-xs" :class="$q.screen.lg ? 'q-pa-sm' : ''" :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      ">
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <q-select v-model="year" outlined dense :options="years" label="Select year" />
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <ButtonVue :label="label_download" :loading="loading" :color="color_print" :disabled="false"
            :no_caps="no_caps" icon_right="print"></ButtonVue>
        </div>
      </div>

      <!-- table for categories -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <CategoryTable :columns="columns" :data="getData" :label="label" :message="message" :name="name"
            @show-expenditure-items="showExpenditureItems" @update-expenditure-category="updateExpenditureCategory"
            :show_payment_category="false" :show_payment_item="false" :show_expenditure_category="true"
            :show_expenditure_item="false">
          </CategoryTable>
        </div>
      </div>
    </div>


  </q-page>
</template>

<script>
import NotFound from "src/components/NotFound.vue";
import CategoryTable from "src/components/CategoryTable.vue";
import ButtonVue from "src/components/Button.vue";
import { SessionStorage } from "quasar";
import ExpenditureCategoryMixinVue from "src/mixins/ExpenditureCategoryMixin.vue";

export default {
  mixins: [ExpenditureCategoryMixinVue],
  mounted() {
    this.fetchExpenditureCategories();
  },

  data() {
    return {
      not_found_msg:
        "Ooops!! No Expenditure Categories found. Click the add button to add Expenditure Categories.",
      expenditure_categories: [{ id: 1 }],
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
      name: "Harvest ThanksGiven",
    };
  },
  computed: {
    validateFilter() {
      return true;
    },

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
    }
  },
  methods: {
    showExpenditureItems(data) {
      //make request
      SessionStorage.set("intermediate_tab", "Expenditure Items");
      SessionStorage.set("has_intermediate_tab", true);
      this.$emit("show-expenditure-items", data);
    },
    updateExpenditureCategory(data) {
      this.$store.dispatch("setUpdatedExpenditureCategory", data.data);

      this.$emit("update-expenditure-category", data);
    }
  },
  components: {
    NotFound,
    CategoryTable,
    ButtonVue,
  },
};
</script>

<style lang="scss" scoped>
.search {
  cursor: pointer;
}
</style>
