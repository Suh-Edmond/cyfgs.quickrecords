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
      <NotFound
        :message="not_found_msg"
        v-if="getMembersSavings.length == 0 && !getLoadingState"
      ></NotFound>
      <!-- header for filter categories -->
      <div v-if="getMembersSavings.length > 0 && !getLoadingState">
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
              input-debounce="0"
              @filter="filterYears"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
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
              :options="months"
              label="Select month"
              input-debounce="0"
              @filter="filterMonths"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-md-6 col-lg-6 col-xs-12 col-sm-12 flex q-pl-md">
            <div>
              <ButtonVue
                :label="label_fetch"
                :loading="loading"
                :color="color"
                :disabled="validateFilter"
                :no_caps="no_caps"
                icon_right="filter_list"
              >
              </ButtonVue>
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
                @click="downloadMembersSavings"
              ></q-btn>
            </div>
          </div>
        </div>

        <!-- table for savings -->
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
              :show_contribution="false"
              @edit-member-saving="editMemberSaving"
            >
            </TableVue>
          </div>
        </div>
      </div>
    </div>

    <!-- search field for members so their savings can be approve -->
    <div v-if="checkTreasurerRole() && !getLoadingState">
      <div
        class="row q-ml-xs q-pt-md justify-between"
        :class="$q.screen.lg ? 'q-pa-md' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div>
          <q-btn
            :label="label_fetch"
            :loading="loading"
            :color="color"
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
            :label="label_download"
            :loading="loading"
            :color="color_print"
            :disabled="savings.length == 0"
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
            :columns="columns"
            :data="getFilteredSavings"
            :label="label"
            :message="message"
            :show_savings="true"
            :show_income_activity="false"
            :show_members="false"
            :show_contribution="false"
          >
          </TableVue>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";
import NotFound from "src/components/NotFound.vue";
import TableVue from "src/components/Table.vue";
import ButtonVue from "src/components/Button.vue";
import UserSavingMixinVue from "src/mixins/UserSavingMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";

export default {
  mixins: [UserSavingMixinVue, HelperMixinVue],
  mounted() {
    this.getOrganisationMemberSavings();
  },
  data() {
    return {
      not_found_msg:
        "Ooops!! No Savings has been recorded. Click the add button to add saving.",
      year: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
      month: null,
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
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
          label: "Total Amount Deposited (XAF)",
          field: "amount_deposited",
        },
        {
          name: "action",
          label: "Action",
          align: "center",
          field: "action",
        },
      ],
      label: "Delete",
      message: "Are you sure you want to delete this Member Saving?",
      is_fetching: true,
      search_data: null,
      savings: [],
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

    getMembersSavings() {
      let data = [];

      if (this.$store.getters.getOrganisationMembersSavings != null) {
        this.$store.getters.getOrganisationMembersSavings.data.forEach(
          (ele) => {
            data.push({
              counter:
                this.$store.getters.getOrganisationMembersSavings.data.indexOf(
                  ele
                ) + 1,
              name: ele.user_name,
              email: ele.email,
              telephone: ele.telephone,
              amount_deposited: ele.amount_deposited,
              id: ele.id,
              approve: ele.approve,
              comment: ele.comment,
              type: "MEMBERS_SAVINGS",
              user_id: ele.user_id,
              created_at: ele.created_at,
              updated_by: ele.updated_by,
            });
          }
        );
      }
      return data;
    },

    getFilteredSavings() {
      let data = [];
      this.$store.getters.getSavings.forEach((ele) => {
        data.push({
          counter: this.$store.getters.getSavings.indexOf(ele) + 1,
          name: ele.user_name,
          email: ele.email,
          telephone: ele.telephone,
          amount_deposited: ele.amount_deposited,
          id: ele.id,
          approve: ele.approve,
          comment: ele.comment,
          type: "MEMBERS_SAVINGS",
          user_id: ele.user_id,
          created_at: ele.created_at,
          updated_by: ele.updated_by,
        });
      });
      return data;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
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
      update(() => {
        const needle = val.toLowerCase();
        this.years = this.years.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    filterMonths(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.months = this.months.filter(
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
  },
  components: {
    NotFound,
    TableVue,
    ButtonVue,
  },
};
</script>

<style lang="scss" scoped></style>
