<template>
  <q-page>
    <NotFound :message="getNotFoundMsg" v-if="getExpenditureItemDetails.length == 0"></NotFound>
    <!-- header for filter categories -->
    <div class="row q-ml-xs q-pt-xs" v-if="getExpenditureItemDetails.length > 0" :class="$q.screen.lg ? 'q-pa-sm' : ''"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      ">
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
        <q-select v-model="status" outlined dense :options="statuses" label="Select Status" />
      </div>
      <q-space />
      <div class="button q-pb-xs">
        <q-btn :label="label_download" :loading="loading" :color="color_print" :disabled="false" no-caps
          icon-right="print"></q-btn>
      </div>
    </div>
    <!-- table for categories -->
    <div v-if="getExpenditureItemDetails.length > 0">
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <CategoryTable :columns="columns" :data="getExpenditureItemDetails" :label="label" :message="message"
            :title="getExpenditureItemName" :show_payment_category="false" :show_payment_item="false"
            :show_expenditure_category="false" :show_expenditure_item="false" :show_expenditure_item_detail="true"
            @edit-expenditure-item-detail="editExpenditureItemDetail">
          </CategoryTable>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>
import NotFound from "src/components/NotFound.vue";
import CategoryTable from "src/components/CategoryTable.vue";


export default {
  data() {
    return {
      not_found_msg:
        "Ooops!! No Details has been recorded for this Expenditure Category. click the add button to add Expenditure Item Details.",
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
      label: "Delete",
      message: "Are you sure you want to delete this Expenditure Item Detail?",
      statuses: ["APPROVED", "UNAPPROVED"],
      status: null,
    };
  },
  computed: {
    getExpenditureItemDetails() {
      let data = [];
      this.$store.getters.getExpenditureItemDetails.data?.forEach((ele) => {
        data.push({
          counter: this.$store.getters.getExpenditureItemDetails.data?.indexOf(ele) + 1,
          name: ele.name,
          amount_given: ele.amount_given,
          amount_spent: ele.amount_spent,
          balance: ele.balance,
          type: "EXPENDITURE_DETAILS",
          id: ele.id,
          expenditure_item_id: ele.expenditure_item_id,
          comment: ele.comment,
          approve: ele.approve,
          created_at: ele.created_at,
          updated_at: ele.updated_at,
          updated_by: ele.updated_by
        })
      })
      return data;
    },

    getExpenditureItemName() {
      return this.$store.getters.getCurrentExpenditureItem?.name;
    },

    getNotFoundMsg() {
      return `Ooops!! No Details has been recorded for this Expenditure Item [${this.getExpenditureItemName}]. Click the add button to add Expenditure Item Details.`
    }
  },
  methods: {
    editExpenditureItemDetail(data) {
      this.$emit("edit-expenditure-item-detail", data)
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
