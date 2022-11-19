<template>
  <q-page>
    <!-- no members found -->
    <div>
      <NotFound :message="not_found_msg" v-if="getMembers.length == 0"></NotFound>
    </div>

    <div v-if="getMembers.length > 0">
      <!-- header for filter members -->
      <div class="row q-ml-xs" :class="$q.screen.lg ? 'q-pa-sm' : ''" :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      ">
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-pr-md' : ''">
          <q-select v-model="gender" outlined dense :options="genders" label="Select gender" />
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-pr-md' : ''">
          <q-select v-model="year" outlined dense :options="years" label="Select year" />
        </div>
        <div :class="$q.screen.lg ? 'q-pr-md' : ''">
          <ButtonVue :label="label_fetch_user" :loading="loading" :color="color" :disabled="validateFilter"
            :no_caps="no_caps" icon_right="filter_list">
          </ButtonVue>
        </div>
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12"></div>

        <div :style="$q.screen.lg ? 'margin-left:76px' : ''">
          <ButtonVue :label="label_print" :loading="loading" :color="color_print" :disabled="false" :no_caps="no_caps"
            icon_right="print" size="sm"></ButtonVue>
        </div>
      </div>
      <!-- table for members -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <TableVue :columns="columns" :data="getMembers" :label="label" @update-member="updateMember"
            :member_name="select_member_name" :message="message" :show_savings="false" :show_income_activity="false"
            :show_members="true" :show_contribution="false">
          </TableVue>
        </div>
      </div>
    </div>

  </q-page>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import TableVue from "src/components/Table.vue";
import NotFound from "src/components/NotFound.vue";
import memberMixin from "src/mixins/memberMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";

export default {
  mixins: [memberMixin, organisationMixinVue],

  mounted() {
    let id = this.getOrganisationId
    this.getOrganisationMembers(id)
  },
  data() {
    return {
      organisation: null,
      member_total: 0,
      year: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
      label_fetch_user: "Filter",
      loading: false,
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
        { name: "gender", align: "left", label: "Gender", field: "gender", sortable: true },
        {
          name: "telephone",
          align: "left",
          label: "Telephone",
          field: "telephone",
          sortable: true,
        },
        { name: "address", align: "left", label: "Address", field: "address", sortable: true },
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
      select_member_name: " Suh Edmond Edmond",
    };
  },
  computed: {
    validateFilter() {
      return this.year == null && this.gender == null ? true : false;
    },
    getMembers() {
      var data = [];
      this.$store.getters.getMembers.forEach(member => {
        data.push({
          counter: this.$store.getters.getMembers.indexOf(member) + 1,
          name: member.name,
          telephone: member.telephone,
          gender: member.gender,
          address: member.address,
          occupation: member.occupation,
          id: member.id,
          email: member.email,
        })
      })
      return data;
    }
  },
  methods: {
    updateMember(data) {
      this.$emit("update-member", data);
      this.$store.dispatch("updateMember", data.data);
    },

  },

  components: {
    ButtonVue,
    TableVue,
    NotFound,
  },
};
</script>
<style lang="scss" scoped>
.arrow {
  height: 2rem;
}

.button {
  width: 100%;
  letter-spacing: 0.01em;
}

.filter_section {
  background-color: $grey7;
  border-radius: 10px;
}

.search_icon {
  text-align: end;
}

.icon {
  cursor: pointer;
}
</style>
