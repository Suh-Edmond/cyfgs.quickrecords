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
      v-if="getMemberSavings.length == 0 && !getLoadingState"
    ></NotFound>

    <div v-if="getMemberSavings.length > 0 && !getLoadingState">
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
            use-input
            input-debounce="0"
            clearable
            @filter="filterYears"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-pl-md">
          <q-select
            v-model="status"
            outlined
            dense
            :options="statuses"
            label="Select Status"
            clearable
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-md-6 col-lg-6 col-xs-12 col-sm-12 flex q-pl-md">
          <div>
            <q-btn
              :label="'Filter'"
              :loading="is_fetching"
              :color="'primary'"
              :disabled="validateFilter"
              no-caps
              icon-right="filter_list"
              @click="filterSavings"
            >
            </q-btn>
          </div>
          <q-space />
          <div class="button">
            <q-btn
              label="Print"
              :loading="loading"
              color="positive"
              :disabled="false"
              no-caps
              icon-right="print"
              @click="downloadSavings"
            ></q-btn>
          </div>
        </div>
      </div>
      <!-- table for savings -->
      <div class="row q-pt-sm" v-if="!start_filter">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue
            :columns="columns"
            :data="getMemberSavings"
            :label="label"
            :message="message"
            :title="getCurrentMemberName"
            :show_savings="false"
            :show_member_savings="true"
            :show_income_activity="false"
            :show_members="false"
            :show_contribution="false"
            :total_saving="getMemberTotalSaving"
            @view-member-saving="ViewMemberSaving"
            @edit-member-saving="editMemberSaving"
          >
          </TableVue>
        </div>
      </div>

      <!-- table for filter savings -->
      <div class="row q-pt-sm" v-if="start_filter">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue
            :columns="columns"
            :data="filtered_savings"
            :label="label"
            :message="message"
            :title="getCurrentMemberName"
            :show_savings="false"
            :show_member_savings="true"
            :show_income_activity="false"
            :show_members="false"
            :total_saving="getMemberTotalSaving"
            :show_contribution="false"
            @view-member-saving="ViewMemberSaving"
            @edit-member-saving="editMemberSaving"
          >
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
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";
export default {
  mixins: [HelperMixinVue, CurrentYearMixinVue],

  data() {
    return {
      not_found_msg: "Ooops!! No Savings has been recorded for this Member",
      filtered_savings: [],
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
          name: "amount_deposited",
          align: "left",
          label: "Amount Deposited (XAF)",
          field: "amount_deposited",
        },
        {
          name: "approve",
          align: "left",
          label: "Transaction Status",
          field: "approve",
        },
        {
          name: "date",
          align: "left",
          label: "Date Collected",
          field: "date",
        },
        // {
        //   name: "state",
        //   align: "left",
        //   label: "Saving Status",
        //   field: "state",
        //   sortable: true,
        // },
        {
          name: "action",
          label: "Action",
          field: "action",
          align: "left",
        },
      ],
      label: "Delete",
      message: "Are you sure you want to delete this Saving ?",
      statuses: ["PENDING", "APPROVED", "DECLINED", "ALL"],
      status: "",
      start_filter: false,
      year: "",
      is_fetching: false,
      years: [],
    };
  },
  computed: {
    validateFilter() {
      return this.year == null;
    },
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
            approve: ele.approve,
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

    getMemberTotalSaving() {
      return this.$store.getters.getMemberSavings.total_savings;
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
      this.is_fetching = true;
      this.start_filter = true;
      this.filtered_savings = [];
      let member = this.$store.getters.getMemberSavings.data[0].user_name;
      let organisation_id = this.$store.getters.getOrganisation.id;
      let user_id = this.$store.getters.getMemberSavings.data[0].user_id
      this.$router.push({
        path: `/dashboard/members-savings/users/`,
        query: { status: this.status, year:this.year.label },
      });
      let payload = {
        url: `/api/protected/user-savings?status=${this.status}&year=${this.year.value}&organisation_id=${organisation_id}&user_id=${user_id}`,
        msg: "",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: false,
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.is_fetching = false;
        if (res.data) {
          res.data.forEach((saving) => {
            this.filtered_savings.push({
              counter: res.data.indexOf(saving) + 1,
              name: saving.user_name,
              email: saving.email,
              telephone: saving.telephone,
              amount_deposited: saving.amount_deposited,
              id: saving.id,
              approve: saving.approve,
              comment: saving.comment,
              type: "MEMBER_SAVINGS",
              user_id: saving.user_id,
              created_at: saving.created_at,
              updated_by: saving.updated_by,
              date: saving.created_at,
            });
          });
        }
      });
      return this.filtered_savings;
    },

    downloadSavings() {
      let user_id = this.$store.getters.getMemberSavings.data[0].user_id;
      let current_session =
        this.year == null ? this.getCurrentYear.id : this.year.value;

      let url = `/api/protected/savings/download?user_id=${user_id}&status=${this.status}&session_id=${current_session}`;

      let file_name = "User_Savings.pdf";

      this.loading = this.downloadPdf(url, file_name);
    },

    filterYears(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      if (this.year == "") {
        this.years = this.getSessionsFromState;
      }
      update(() => {
        this.years = this.getSessionsFromState.filter((v) =>
          v.label.toLowerCase().includes(val.toLowerCase())
        );
      });
    },
  },
  components: {
    NotFound,
    TableVue,
  },
};
</script>

<style lang="scss" scoped></style>
