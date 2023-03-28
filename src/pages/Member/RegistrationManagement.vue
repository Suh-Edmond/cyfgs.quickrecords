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
        v-if="registeredMembers.length == 0 && !getLoadingState"
      ></NotFound>
    </div>

    <div v-if="registeredMembers.length > 0 && !getLoadingState">
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
            v-model="status"
            outlined
            dense
            :options="statuses"
            label="Select status"
          />
        </div>
        <div :class="$q.screen.lg ? 'q-pr-md' : ''">
          <q-btn
            label="Filter"
            :loading="loading_filter"
            color="primary"
            :disabled="validateFilter"
            @click="getMembers"
            no-caps
            icon-right="filter_list"
          >
          </q-btn>
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12"></div>

        <div :style="$q.screen.lg ? 'margin-left:76px' : ''">
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
      <!-- table for members -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue
            :columns="columns"
            :data="registeredMembers"
            :label="label"
            @update-member="updateMember"
            :message="message"
            :show_savings="false"
            :show_income_activity="false"
            :show_members="true"
            :show_contribution="false"
            :total_members="registeredMembers.length"
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
import HelperMixinVue from "src/mixins/HelperMixin.vue";

export default {
  mixins: [HelperMixinVue],

  mounted() {
    this.getMembers();
  },
  data() {
    return {
      organisation: null,
      year: "2023",
      years: ["2020", "2021", "2022", "2023", "2024"],
      loading: false,
      statuses: ["PENDING","APPROVED", "DECLINED", "ALL"],
      status: "ALL",
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
        "Ooops!! You don't have any Register Member click the button to Register Member(s).",
      loading_filter: false,
      registeredMembers: [],
    };
  },
  computed: {
    validateFilter() {
      return this.year == null ? true : false;
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

    getMembers() {
      this.$router.push({
        path: "/dashboard/registered-members",
        query: { year: this.year, status:this.status},
      });

      this.registeredMembers = [];
      let payload = {
        status: "none",
        url: `/api/protected/registered-members?year=${this.year}&status=${this.status}`,
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
          res.data.forEach((member) => {
            this.registeredMembers.push({
              counter: res.data.indexOf(member) + 1,
              name: member.user.name,
              telephone: member.user.telephone,
              gender: member.user.gender,
              address: member.user.address,
              occupation: member.user.occupation,
              id: member.id,
              email: member.user.email,
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
