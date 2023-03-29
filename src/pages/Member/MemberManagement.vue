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


    <div>
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
            v-model="has_register"
            outlined
            dense
            :options="registrationStatuses"
            label="Select status"
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
        <div class="flex col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <div :class="$q.screen.lg ? 'q-pr-md' : ''">
            <q-btn
              label="Filter"
              :loading="loading_filter"
              color="primary"
              :disabled="validateFilter"
              @click="filterMembers"
              no-caps
              icon-right="filter_list"
            >
            </q-btn>
          </div>
          <q-space />
          <div>
            <q-btn
              label="Print"
              :loading="loading"
              color="positive"
              :disabled="false"
              no-caps
              icon-right="print"
              @click="downloadMembers"
            ></q-btn>
          </div>
        </div>
      </div>
      <!-- table for members -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
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
            :total_members="computeTotalMembership"
            @fetch-members="getOrganisationMembers"
            @register-member="registerMember"
          >
          </TableVue>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import TableVue from "src/components/Table.vue";
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
      year: "",
      has_register: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
      loading: false,
      start_filter: false,
      no_caps: true,
      genders: ["MALE", "FEMALE", "ALL", "OTHER"],
      registrationStatuses: ["REGISTERED", "NOT_REGISTERED"],
      gender: "",
      message: "Are you sure you want to delete this Member?",
      label: "Delete",
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
          name: "has_register",
          align: "left",
          label: "Registeration Status",
          field: "has_register",
          sortable: true,
        },
        {
          name: "approve",
          align: "left",
          label: "Payment Status",
          field: "approve",
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
        "Ooops!! You don't have any Member click the button to add Members.",
      loading_filter: false,
    };
  },
  computed: {
    validateFilter() {
      return this.has_register == null ? true : false;
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
          has_register: member.has_register,
          has_paid:member.has_paid,
          type:"MEMBERS",
          approve:member.approve,
          year:member.year
        });
      });
      return data;
    },

    computeTotalMembership() {
      return this.getMembers.length;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },

  methods: {
    updateMember(data) {
      this.$emit("update-member", data);
      this.$store.dispatch("updateMember", data.data);
    },

    registerMember(data) {
      this.$store.dispatch("setMemberToRegister", data.data)
      this.$emit("register-member", data);
    },

    filterMembers() {
      this.$router.push({
        path: "/dashboard/members",
        query: {
          has_register: this.has_register,
          year: this.year,
          gender: this.gender,
        },
      });
      let payload = {
        status: "none",
        url: `/api/protected/organisations/filter-users?has_register=${this.has_register}&gender=${this.gender}&year=${this.year}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_MEMBERS",
        has_commit: true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: null,
        },
      };
      this.loading_filter = true;
      this.$store
        .dispatch("getRequest", payload)
        .then(() => {})
        .finally(() => {
          this.loading_filter = false;
        });
    },

    downloadMembers() {
      let url = `/api/protected/organisations/download-users?has_register=${this.has_register}&gender=${this.gender}&year=${this.year}`;
      let file_name = "Organisation_Members.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },
  },

  components: {
    TableVue,
  },
};
</script>
<style lang="scss" scoped></style>
