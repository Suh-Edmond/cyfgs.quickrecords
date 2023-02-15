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
    <!-- no members found -->
    <div>
      <NotFound
        :message="not_found_msg"
        v-if="getMembers.length == 0 && !getLoadingState"
      ></NotFound>
    </div>

    <div v-if="getMembers.length > 0 && !getLoadingState">
      <!-- header for filter members -->
      <div
        class="row q-ml-xs"
        :class="$q.screen.lg ? 'q-pa-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div
          class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-pr-md' : ''"
        >
          <q-select
            v-model="gender"
            outlined
            dense
            :options="genders"
            label="Select gender"
          />
        </div>
        <div
          class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-pr-md' : ''"
        >
          <q-select
            v-model="year"
            outlined
            dense
            :options="years"
            label="Select year"
          />
        </div>
        <div :class="$q.screen.lg ? 'q-pr-md' : ''">
          <q-btn
            :label="label_fetch_user"
            :loading="loading_filter"
            :color="color"
            :disabled="validateFilter"
            @click="filterMembers"
            no-caps
            icon-right="filter_list"
          >
          </q-btn>
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12"></div>

        <div :style="$q.screen.lg ? 'margin-left:76px' : ''">
          <q-btn
            :label="label_print"
            :loading="loading"
            :color="color_print"
            :disabled="false"
            no-caps
            icon-right="print"
            @click="downloadMembers"
          ></q-btn>
        </div>
      </div>
      <!-- table for members -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12" v-show="!start_filter">
          <TableVue
            :columns="columns"
            :data="getMembers"
            :label="label"
            @update-member="updateMember"
            :message="message"
            :show_savings="false"
            :show_income_activity="false"
            :show_members="true"
            :show_contribution="false"
            @fetch-members="getOrganisationMembers"
          >
          </TableVue>
        </div>

        <!-- Table to be display when members are filtered -->
        <div class="col-md-12 col-xs-12 col-sm-12" v-show="start_filter">
          <TableVue
            :columns="columns"
            :data="filteredMembers"
            :label="label"
            @update-member="updateMember"
            :message="message"
            :show_savings="false"
            :show_income_activity="false"
            :show_members="true"
            :show_contribution="false"
            @fetch-members="getOrganisationMembers"
          >
          </TableVue>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import TableVue from "src/components/Table.vue";
import NotFound from "src/components/NotFound.vue";
import memberMixin from "src/mixins/memberMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";

export default {
  mixins: [memberMixin, organisationMixinVue, HelperMixinVue],

  mounted() {
    let id = this.getOrganisationId;
    this.getOrganisationMembers(id, true);
  },
  data() {
    return {
      organisation: null,
      member_total: 0,
      year: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
      label_fetch_user: "Filter",
      loading: false,
      start_filter: false,
      color: "primary",
      no_caps: true,
      genders: ["MALE", "FEMALE", "ALL", "OTHER"],
      gender: null,
      search: "",
      message: "Are you sure you want to delete this Member?",
      label: "Delete",
      is_fetching: false,
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
          sortable: true,
        },
        {
          name: "gender",
          align: "left",
          label: "Gender",
          field: "gender",
          sortable: true,
        },
        {
          name: "telephone",
          align: "left",
          label: "Telephone",
          field: "telephone",
          sortable: true,
        },
        {
          name: "address",
          align: "left",
          label: "Address",
          field: "address",
          sortable: true,
        },
        {
          name: "occupation",
          align: "left",
          label: "Occupation",
          field: "occupation",
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
      not_found_msg:
        "Ooops!! You don't have any Register Member click the button to add Members.",
      label_print: "Print",
      color_print: "positive",
      loading_filter: false,
      filteredMembers: [],
      start_spinner:false,
    };
  },
  computed: {
    validateFilter() {
      return this.year == null && this.gender == null ? true : false;
    },
    getMembers() {
      let data = [];

      this.$store.getters.getMembers.forEach((member) => {
        data.push({
          counter: this.$store.getters.getMembers.indexOf(member) + 1,
          name: member.name,
          telephone: member.telephone,
          gender: member.gender,
          address: member.address,
          occupation: member.occupation,
          id: member.id,
          email: member.email,
          organisation_id: member.organisation_id,
        });
      });
      return data;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState
    },
  },

  methods: {
    updateMember(data) {
      this.$emit("update-member", data);
      this.$store.dispatch("updateMember", data.data);
    },

    filterMembers() {
      this.$router.push({
        path: "/dashboard/members",
        query: { year: this.year, gender: this.gender },
      });

      this.filteredMembers = [];
      let id = this.getOrganisationId;
      let payload = {
        status: "none",
        url: `/api/protected/organisations/filter-users?organisation_id=${id}&gender=${this.gender}&year=${this.year}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner:true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.loading_filter = true;
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          this.start_filter = true;
          res.data.forEach((member) => {
            this.filteredMembers.push({
              counter: res.data.indexOf(member) + 1,
              name: member.name,
              telephone: member.telephone,
              gender: member.gender,
              address: member.address,
              occupation: member.occupation,
              id: member.id,
              email: member.email,
              organisation_id: member.organisation_id,
            });
          });
        })
        .finally(() => {
          this.loading_filter = false;
        });
    },

    downloadMembers() {
      let id = this.getOrganisationId;
      let url = `/api/protected/organisations/download-users?organisation_id=${id}&gender=${this.gender}&year=${this.year}`;
      let file_name = "Organisation_Members.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },
  },

  components: {
    TableVue,
    NotFound,
  },
};
</script>
<style lang="scss" scoped>
</style>
