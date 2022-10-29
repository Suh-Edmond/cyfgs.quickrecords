<template>
  <q-page>
    <NotFound
      :message="not_found_msg"
      v-if="expenditure_categories.length == 0"
    ></NotFound>
    <!-- header for filter categories -->
    <div
      class="row q-ml-xs q-pt-xs"
      v-if="expenditure_categories.length > 0"
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
        />
      </div>
      <q-space />
      <div class="button q-pb-xs">
        <ButtonVue
          :label="label_download"
          :loading="loading"
          :color="color_print"
          :disabled="false"
          :no_caps="no_caps"
          icon_right="print"
        ></ButtonVue>
      </div>
    </div>
    <!-- table for categories -->
    <div class="row q-pt-sm">
      <div class="col-md-12 col-xs-12 col-sm-12">
        <CategoryTable
          :columns="columns"
          :data="data"
          :label="label"
          :message="message"
          :name="name"
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
import ButtonVue from "src/components/Button.vue";
import { SessionStorage } from "quasar";
export default {
  data() {
    return {
      not_found_msg:
        "Ooops!! No Expenditure Categories found. click the add button to add Expenditure Categories.",
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
          name: "id",
          required: true,
          label: "S/N",
          align: "left",
          field: "id",
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
          name: "expenditure_category",
          align: "center",
          label: "",
          field: "expenditure_category",
        },
        {
          name: "action",
          label: "Action",
          field: "action",
        },
      ],
      data: [
        {
          id: 1,
          name: "Frozen Yogurt",
          expenditure_category: "View Expenditure Items",
          action: "",
        },
        {
          id: 2,
          name: "Ice cream sandwich",
          expenditure_category: "View Expenditure Items",
          action: "",
        },
        {
          id: 3,
          name: "Eclair",
          expenditure_category: "View Expenditure Items",
          action: "",
        },
        {
          id: 4,
          name: "Cupcake",
          expenditure_category: "View Expenditure Items",
          action: "",
        },
        {
          id: 5,
          name: "Gingerbread",
          expenditure_category: "View Expenditure Items",
          action: "",
        },
        {
          id: 6,
          name: "Jelly bean",
          expenditure_category: "View Expenditure Items",
          action: "",
        },
        {
          id: 7,
          expenditure_category: "Lollipop",
          item: "View Expenditure Items",
          action: "",
        },
        {
          id: 8,
          name: "Honeycomb",
          expenditure_category: "View Expenditure Items",
          action: "",
        },
        {
          id: 9,
          name: "Donut",
          expenditure_category: "View Expenditure Items",
          action: "",
        },
        {
          id: 10,
          name: "KitKat",
          expenditure_category: "View Expenditure Items",
          action: "",
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
  },
  methods: {
    showExpenditureItems(data) {
      //make request
      SessionStorage.set("intermediate_tab", "Expenditure Items");
      SessionStorage.set("has_intermediate_tab", true);
      this.$emit("show-expenditure-items", data);
    },
    updateExpenditureCategory(data){
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
