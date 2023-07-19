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

    <div v-if="!checkTreasurerRole()">
      <!--------------------------------------------------------START OF SAVINGS--------------------------------------->
      <div>
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
              :label="$t('app.searchYear')"
              use-input
              input-debounce="0"
              clearable
              @filter="filterYears"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    {{ $t("app.noResults") }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-pl-md">
            <q-select
              v-model="month"
              outlined
              dense
              :options="monthsOptions"
              :label="$t('app.searchMonth')"
              use-input
              input-debounce="0"
              clearable
              @filter="filterMonths"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    {{ $t("app.noResults") }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-md-6 col-lg-6 col-xs-12 col-sm-12 flex q-pl-md">
            <div>
              <q-btn
                :label="$t('app.filter')"
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
            <div class="button q-pb-xs">
              <q-btn
                :label="$t('app.print')"
                :loading="loading"
                :color="'positive'"
                :disabled="false"
                no-caps
                icon-right="print"
                @click="downloadMembersSavings"
              ></q-btn>
            </div>
          </div>
        </div>

        <!--------------------------------------------------------START OF TABLE TO DISPLAY SAVINGS-------------------------->
        <div class="row q-pt-sm">
          <div class="col-md-12 col-xs-12 col-sm-12">
            <TableVue
              :columns="columns"
              :data="getMembersSavings"
              :label="label"
              :message="message"
              :show_savings="true"
              :show_income_activity="false"
              :show_members="false"
              :total_saving="getTotalMembersSavings"
              :show_contribution="false"
              @edit-member-saving="editMemberSaving"
            >
            </TableVue>
          </div>
        </div>
        <!---------------------------------------------------------END OF TABLE OF SAVINGS------------------------------------>
      </div>
      <!---------------------------------------------------------END OF SAVINGS---------------------------------------->
    </div>

    <!----------------------------------------------------------SAVINGS TO BE APPROVE/DECLINE------------------------->
    <div v-if="checkTreasurerRole()">
      <div
        class="row q-ml-xs q-pt-md justify-between"
        :class="$q.screen.lg ? 'q-pa-md' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div>
          <q-btn
            :label="$t('app.filter')"
            :loading="is_fetching"
            :color="'primary'"
            :disabled="false"
            no-caps
            icon-right="filter_list"
            @click="searchSavings()"
          >
          </q-btn>
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn
            :label="$t('app.print')"
            :loading="loading"
            :color="'positive'"
            :disabled="getFilteredSavings.length == 0"
            no-caps
            icon-right="print"
            @click="downloadMembersSavings"
          ></q-btn>
        </div>
      </div>

      <!-- table for filtered savings -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue
            :columns="columns_tresurer"
            :data="getFilteredSavings"
            :label="label"
            :message="message"
            :show_savings="true"
            :show_income_activity="false"
            :show_members="false"
            :total_saving="computeTotalSavingsForFiltered"
            :show_contribution="false"
            @view-member-saving="ViewMemberSaving"
          >
          </TableVue>
        </div>
      </div>
    </div>
    <!------------------------------------------------------------END OF SAVINGS TO BE APPROVED / DECLINED------------->
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";
import TableVue from "src/components/Table.vue";
import UserSavingMixinVue from "src/mixins/UserSavingMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";
import MonthsMixinVue from 'src/mixins/MonthsMixin.vue';
export default {
  mixins: [UserSavingMixinVue, HelperMixinVue, CurrentYearMixinVue, MonthsMixinVue],
  mounted() {
    let organisation_id =
      this.$store.getters.getOrganisation != null
        ? this.$store.getters.getOrganisation.id
        : "";
    this.getOrganisationMemberSavings(organisation_id);
    this.getSessions()
  },
  data() {
    return {
      year: "",
      month: "",
      monthsOptions: [],
      years: [],
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
          name: "user_name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.user_name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "email",
          align: "left",
          label: "Email",
          field: "email",
        },
        {
          name: "telephone",
          align: "left",
          label: "Telephone Number",
          field: "telephone",
        },
        {
          name: "total_amount",
          align: "left",
          label: "Total Amount Saved (XAF)",
          field: "total_amount",
        },
        {
          name: "action",
          label: "Action",
          align: "left",
          field: "action",
        },
      ],
      columns_tresurer: [
        {
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
        },
        {
          name: "user_name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.user_name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "email",
          align: "left",
          label: "Email",
          field: "email",
        },
        {
          name: "telephone",
          align: "left",
          label: "Telephone Number",
          field: "telephone",
        },
        {
          name: "amount_deposited",
          align: "left",
          label: "Amount Deposited (XAF)",
          field: "amount_deposited",
        },
        {
          name: "amount_used",
          align: "left",
          label: "Amount Used (XAF)",
          field: "amount_used",
        },
        {
          name: "approve",
          align: "left",
          label: "Payment Status",
          field: "approve",
        },
        {
          name: "action",
          label: "Action",
          align: "left",
          field: "action",
        },
      ],
      label: this.$t("app.delete"),
      message: this.$t("app.deleteSavingWarningMsg"),
      is_fetching: false,
      search_data: null,
      savings: [],
      is_filtering: false,
      filtered_savings: [],
    };
  },
  computed: {
    validateFilter() {
      return this.year !== null || this.month !== null ? false : true;
    },

    getFetchingState() {
      return typeof this.$store.getters.getOrganisationMemberSavings ===
        undefined
        ? true
        : false;
    },

    getTotalMembersSavings() {
      return this.$store.getters.getOrganisationMembersSavings != null
        ? this.$store.getters.getOrganisationMembersSavings.total_savings
        : 0;
    },

    getFilteredSavings() {
      let data = [];
      this.$store.getters.getSavings.forEach((ele) => {
        data.push({
          counter: this.$store.getters.getSavings.indexOf(ele) + 1,
          user_name: ele.user_name,
          email: ele.email,
          telephone: ele.telephone,
          total_amount: ele.total_amount,
          id: ele.id,
          approve: ele.approve,
          comment: ele.comment,
          type: "MEMBERS_SAVINGS",
          user_id: ele.user_id,
          created_at: ele.created_at,
          updated_by: ele.updated_by,
          sesion_id: ele.session_id,
          amount_deposited: ele.amount_deposited,
          amount_used: ele.amount_used,
        });
      });
      return data;
    },

    computeTotalSavingsForFiltered() {
      let total = 0;
      this.$store.getters.getSavings.forEach((ele) => {
        total += ele.total_amount;
      });
      return total;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getMembersSavings() {
      let data = [];
      if (this.filtered_savings.length <= 0 && !this.is_filtering) {
        if (this.$store.getters.getOrganisationMembersSavings != null) {
          this.$store.getters.getOrganisationMembersSavings.data.forEach(
            (ele) => {
              data.push({
                counter:
                  this.$store.getters.getOrganisationMembersSavings.data.indexOf(
                    ele
                  ) + 1,
                user_name: ele.user_name,
                email: ele.email,
                telephone: ele.telephone,
                total_amount: ele.total_amount,
                id: ele.id,
                approve: ele.approve,
                comment: ele.comment,
                type: "MEMBERS_SAVINGS",
                user_id: ele.user_id,
                created_at: ele.created_at,
                updated_by: ele.updated_by,
                amount_deposited: ele.amount_deposited,
                amount_used: ele.amount_used,
              });
            }
          );
        }
      } else {
        data = this.filtered_savings;
      }
      return data;
    },
  },
  watch: {
    getSavings() {
      return this.getMembersSavings;
    },
  },
  methods: {
    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name == "TREASURER"
      );
      return treasurer_role != undefined;
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

    filterMonths(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      if (this.month == "") {
        this.monthsOptions = this.getMonths;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.monthsOptions = this.getMonths.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    editMemberSaving(data) {
      this.$emit("edit-member-saving", data);
    },

    downloadMembersSavings() {
      let id = this.$store.getters.getOrganisation.id;

      let url = `/api/protected/organisation-savings/download?organisation_id=${id}`;

      let file_name = "Organisation_Savings.pdf";

      this.loading = this.downloadPdf(url, file_name);
    },

    searchSavings() {
      let payload = {
        data: null,
        tab: "Search Savings",
      };

      this.$emit("search-member-saving", payload);
    },

    filterSavings() {
      this.is_fetching = true;
      this.filtered_savings = [];
      let organisation_id = this.$store.getters.getOrganisation.id;
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: { month: this.month, year: this.year.label },
      });
      let payload = {
        url: `/api/protected/user-savings?month=${this.month}&session_id=${this.year.value}&organisation_id=${organisation_id}`,
        msg: "",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: false,
        error_msg: this.$t("app.defaultErrorMsg"),
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
        this.is_filtering = true;
        if (res.data) {
          res.data.forEach((saving) => {
            this.filtered_savings.push({
              counter: res.data.indexOf(saving) + 1,
              user_name: saving.user_name,
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
              total_amount: saving.total_amount,
            });
          });
        }
      });
    },

    ViewMemberSaving(data) {
      this.$emit("view-member-saving", data);
    },
  },
  components: {
    TableVue,
  },
};
</script>

<style lang="scss" scoped></style>
