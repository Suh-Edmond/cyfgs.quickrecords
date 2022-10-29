<template>
  <q-page>
    <NotFound
      :message="not_found_msg"
      v-if="expenditure_item_details.length == 0"
    ></NotFound>
    <!-- header for filter categories -->
    <div
      class="row q-ml-xs q-pt-xs"
      v-if="expenditure_item_details.length > 0"
      :class="$q.screen.lg ? 'q-pa-sm' : ''"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
    >
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
        <q-select
          v-model="status"
          outlined
          dense
          :options="statuses"
          label="Select Status"
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
          :title="title"
          :show_payment_category="false"
          :show_payment_item="false"
          :show_expenditure_category="false"
          :show_expenditure_item="false"
          :show_expenditure_item_detail="true"
          @edit-expenditure-item-detail="editExpenditureItemDetail"
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
        "Ooops!! No Details has been recorded for this Expenditure Category. click the add button to add Expenditure Item Details.",
      expenditure_item_details: [{"id":1}],
      search: null,
      label_fetch: "Filter",
      color: "primary",
      no_caps: true,
      loading: false,
      label_download: "Print",
      color_print: "positive",
      title:"Harvest ThanksGiven",// this title should be the category name
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
          name: "amount_given",
          align: "center",
          label: "Amount Given(XAF)",
          field: "amount_given",
          sortable: true,
        },
        {
          name: "amount_spent",
          align: "center",
          label: "Amount Spent(XAF)",
          field: "amount_spent",
          sortable: true,
        },
        {
          name: "balance",
          align: "center",
          label: "Balance",
          field: "balance",
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
      data: [
        {
          id: 1,
          name: "Frozen Yogurt",
          amount_given: 50000,
          amount_spent:45000,
          balance:5000,
          action: "",
        },
        {
          id: 2,
          name: "Ice cream sandwich",
          amount_given: 60000,
          amount_spent:45000,
          balance:5000,
          action: "",
        },
        {
          id: 3,
          name: "Eclair",
          amount_given: 70000,
          amount_spent:45000,
          balance:5000,
          action: "",
        },
        {
          id: 4,
          name: "Cupcake",
          amount_given: 50000,
          amount_spent:45000,
          balance:5000,
          action: "",
        },
        {
          id: 5,
          name: "Gingerbread",
          amount_given: 20000,
          amount_spent:45000,
          balance:5000,
          action: "",
        },
        {
          id: 6,
          name: "Jelly bean",
          amount_given: 50000,
          amount_spent:45000,
          balance:5000,
          action: "",
        },
        {
          id: 7,
          name: "Lollipop",
          amount_given: 50000,
          amount_spent:45000,
          balance:5000,
          action: "",
        },
        {
          id: 8,
          name: "Honeycomb",
          amount_given: 50000,
          amount_spent:45000,
          balance:5000,
          action: "",
        },
        {
          id: 9,
          name: "Donut",
          amount_given: 50000,
          amount_spent:45000,
          balance:5000,
          action: "",
        },
        {
          id: 10,
          name: "KitKat",
          amount_given: 50000,
          amount_spent:45000,
          balance:5000,
          action: "",
        },
      ],
      label: "Delete",
      message: "Are you sure you want to delete this Expenditure Item Detail?",
      statuses: ["APPROVED", "UNAPPROVED"],
      status: null,
      name: "Harvest of Joyful Celebration 2022",
    };
  },
  computed: {
  },
  methods: {
    editExpenditureItemDetail(data) {
      this.$emit("edit-expenditure-item-detail", data)
    },
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
