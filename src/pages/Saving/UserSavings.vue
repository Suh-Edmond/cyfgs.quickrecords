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
        <TableVue
          :columns="columns"
          :data="data"
          :label="label"
          :message="message"
          :name="name"
          :title="title"
          :show_savings="false"
          :show_member_savings="true"
          :show_income_activity="false"
          :show_members="false"
          :show_contribution="false"
          @edit-member-saving="editMemberSaving"
        >
        </TableVue>
      </div>
    </div>
  </q-page>
</template>

<script>
import NotFound from "src/components/NotFound.vue";
import TableVue from "src/components/Table.vue";
import ButtonVue from "src/components/Button.vue";
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
      title:"Suh Edmond",// this title should be the member name
      columns: [
        {
          name: "id",
          required: true,
          label: "S/N",
          align: "left",
          field: "id",
        },
        {
          name: "amount_deposited",
          align: "left",
          label: "Amount Deposited (XAF)",
          field: "amount_deposited",
        },
        {
          name: "date",
          align: "left",
          label: "Date",
          field: "date",
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
          email: "emailgmail.com",
          date: "2022/09/09",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 2,
          name: "Ice cream sandwich",
          email: "emailgmail.com",
         date: "2022/09/09",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 3,
          name: "Eclair",
          email: "emailgmail.com",
         date: "2022/09/09",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 4,
          date: "2022/09/09",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 5,
          name: "Gingerbread",
          date: "2022/09/09",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 6,
          name: "Jelly bean",
          date: "2022/09/09",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 7,
          date: "2022/09/09",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 8,
          name: "Honeycomb",
          email: "emailgmail.com",
          date: "2022/09/09",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 9,
          name: "Donut",
          email: "emailgmail.com",
          date: "2022/09/09",
          amount_deposited: 50000,
          action: "",
        },
        {
          id: 10,
          name: "KitKat",
          email: "emailgmail.com",
          date: "2022/09/09",
          amount_deposited: 50000,
          action: "",
        },
      ],
      label: "Delete",
      message: "Are you sure you want to delete this Saving?",
      statuses: ["APPROVED", "UNAPPROVED"],
      status: null,
      name: "Harvest of Joyful Celebration 2022",
    };
  },
  computed: {
  },
  methods: {
    editMemberSaving(data){
      console.log(data);
      this.$emit('edit-member-saving', data)
    }
  },
  components: {
    NotFound,
    TableVue,
    ButtonVue,
  },
};
</script>

<style lang="scss" scoped>
.search {
  cursor: pointer;
}
</style>
