<template>
  <q-page>
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios color="primary" size="2em" class="q-mb-lg" v-if="getLoadingState" />
    </div>

    <NotFound :message="not_found_msg" v-if="getMemberSavings.length == 0 && !getLoadingState"></NotFound>

    <div v-if="getMemberSavings.length > 0">
      <!-- header for filter categories -->
      <div class="row q-ml-xs q-pt-xs" :class="$q.screen.lg ? 'q-pa-sm' : ''" :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      ">
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <q-select v-model="status" outlined dense :options="statuses" label="Select Status" @input="filterSavings" />
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn :label="label_download" :loading="loading" :color="color_print" :disabled="false" no-caps
            icon-right="print" @click="downloadSavings"></q-btn>
        </div>
      </div>
      <!-- table for savings -->
      <div class="row q-pt-sm" v-if="!start_filter">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue :columns="columns" :data="getMemberSavings" :label="label" :message="message"
            :title="getCurrentMemberName" :show_savings="false" :show_member_savings="true"
            :show_income_activity="false" :show_members="false" :show_contribution="false"
            @view-member-saving="ViewMemberSaving" @edit-member-saving="editMemberSaving">
          </TableVue>
        </div>
      </div>

      <!-- table for filter savings -->
      <div class="row q-pt-sm" v-if="start_filter">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue :columns="columns" :data="filtered_savings" :label="label" :message="message"
            :title="getCurrentMemberName" :show_savings="false" :show_member_savings="true"
            :show_income_activity="false" :show_members="false" :show_contribution="false"
            @view-member-saving="ViewMemberSaving" @edit-member-saving="editMemberSaving">
          </TableVue>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import NotFound from "src/components/NotFound.vue";
import TableVue from "src/components/Table.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";

export default {
  mixins: [HelperMixinVue],

  data() {
    return {
      not_found_msg: "Ooops!! No Savings has been recorded for this Member",
      filtered_savings: [],
      search: null,
      label_fetch: "Filter",
      color: "primary",
      no_caps: true,
      loading: false,
      label_download: "Print",
      color_print: "positive",
      title: "Suh Edmond", // this title should be the member name
      columns: [
        {
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
        },
        {
          name: "amount_deposited",
          align: "left",
          label: "Amount Deposited (XAF)",
          field: "amount_deposited",
        },
        {
          name: "approve",
          align: "left",
          label: "Status",
          field: "approve",
        },
        {
          name: "date",
          align: "left",
          label: "Date Collected",
          field: "date",
        },
        {
          name: "action",
          label: "Action",
          field: "action",
        },
      ],
      label: "Delete",
      message: "Are you sure you want to delete this Saving?",
      statuses: ["APPROVED", "UNAPPROVED", "ALL"],
      status: null,
      start_filter: false,
    };
  },
  computed: {
    getMemberSavings() {
      let data = [];

      if (this.$store.getters.getMemberSavings != null) {
        this.$store.getters.getMemberSavings.data.forEach((ele) => {
          data.push({
            counter: this.$store.getters.getMemberSavings.data.indexOf(ele) + 1,
            name: ele.user_name,
            email: ele.email,
            telephone: ele.telephone,
            amount_deposited: ele.amount_deposited,
            id: ele.id,
            approve: ele.approve == 1 ? "APPROVED" : "UNAPPROVED",
            comment: ele.comment,
            type: "MEMBER_SAVINGS",
            user_id: ele.user_id,
            created_at: ele.created_at,
            updated_by: ele.updated_by,
            date: ele.created_at,
          });
        });
      }
      return data;
    },

    getCurrentMemberName() {
      let name = "";
      if (this.$store.getters.getMemberSavings != null) {
        name = this.$store.getters.getMemberSavings.data[0].user_name;
      }

      return name;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },
  methods: {
    ViewMemberSaving(data) {
      this.$emit("view-member-saving", data);
    },

    editMemberSaving(data) {
      this.$store.dispatch("setEditState", false);

      this.$emit("edit-member-saving", data);
    },

    filterSavings() {
      this.start_filter = true;
      if (this.status == "ALL") {
        this.filtered_savings = this.getMemberSavings;
      } else {
        this.filtered_savings = this.getMemberSavings.filter(
          (ele) => ele.approve === this.status
        );
      }
      // let member = this.$store.getters.getMemberSavings.data[0];

      this.$router.push({
        path: `/dashboard/members-savings/users/${member.name}`,
        query: { status: this.status },
      });

      return this.filtered_savings;
    },

    downloadSavings() {
      let user_id = this.$store.getters.getMemberSavings.data[0].user_id;

      let url = `/api/protected/savings/download?user_id=${user_id}&status=${this.status}`;

      let file_name = "User_Savings.pdf";

      this.loading = this.downloadPdf(url, file_name);
    },
  },
  components: {
    NotFound,
    TableVue,
  },
};
</script>

<style lang="scss" scoped>

</style>
