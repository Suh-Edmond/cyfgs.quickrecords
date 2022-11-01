<template>
  <q-page>
    <!-- no members found -->
    <NotFound
      :message="not_found_msg"
      v-if="getTotalOrganisationMember == 0"
    ></NotFound>
    <!-- header for filter members -->
    <div
      class="row q-ml-xs"
      v-if="getTotalOrganisationMember > 0"
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
        <ButtonVue
          :label="label_fetch_user"
          :loading="loading"
          :color="color"
          :disabled="validateFilter"
          :no_caps="no_caps"
          icon_right="filter_list"
        >
        </ButtonVue>
      </div>
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12"></div>

      <div :style="$q.screen.lg ? 'margin-left:76px' : ''">
        <ButtonVue
          :label="label_print"
          :loading="loading"
          :color="color_print"
          :disabled="false"
          :no_caps="no_caps"
          icon_right="print"
          size="sm"
        ></ButtonVue>
      </div>
    </div>
    <!-- table for members -->
    <div class="row q-pt-sm">
      <div class="col-md-12 col-xs-12 col-sm-12">
        <TableVue
          :columns="columns"
          :data="data"
          :label="label"
          @update-member="updateMember"
          :member_name="select_member_name"
          :message="message"
          :show_savings="false"
          :show_income_activity="false"
          :show_members="true"
          :show_contribution="false"
        >
        </TableVue>
      </div>
    </div>
  </q-page>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import TableVue from "src/components/Table.vue";
import NotFound from "src/components/NotFound.vue";
export default {
  created(){
    console.log(this.$store.getters.auth);
  },
  data() {
    return {
      organisation:null,
      member_total: 1,
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
      columns: [
        {
          name: "id",
          required: true,
          label: "S/N",
          align: "left",
          field: "id",
        },
        {
          name: "name",
          required: true,
          label: "Dessert (100g serving)",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "email",
          align: "center",
          label: "Email",
          field: "email",
          sortable: true,
        },
        { name: "gender", label: "Gender", field: "gender", sortable: true },
        {
          name: "telephone",
          label: "Telephone",
          field: "telephone",
          sortable: true,
        },
        { name: "address", label: "Address", field: "address", sortable: true },
        {
          name: "occupation",
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
      data: [
        {
          id: 1,
          name: "Frozen Yogurt",
          email: "frozen@gmail.com",
          telephone: "673889903",
          gender: "MALE",
          address: "Molyko Buea",
          occupation: "Student",
          action: "",
        },
        {
          id: 2,
          name: "Ice cream sandwich",
          email: "frozen@gmail.com",
          telephone: "673889903",
          gender: "MALE",
          address: "Molyko Buea",
          occupation: "Student",
          action: "",
        },
        {
          id: 3,
          name: "Eclair",
          email: "frozen@gmail.com",
          telephone: "673889903",
          gender: "MALE",
          address: "Molyko Buea",
          occupation: "Student",
          action: "",
        },
        {
          id: 4,
          name: "Cupcake",
          email: "frozen@gmail.com",
          telephone: "673889903",
          gender: "MALE",
          address: "Molyko Buea",
          occupation: "Student",
          action: "",
        },
        {
          id: 5,
          name: "Gingerbread",
          email: "frozen@gmail.com",
          telephone: "673889903",
          gender: "MALE",
          address: "Molyko Buea",
          occupation: "Student",
          action: "",
        },
        {
          id: 6,
          name: "Jelly bean",
          email: "frozen@gmail.com",
          telephone: "673889903",
          gender: "MALE",
          address: "Molyko Buea",
          occupation: "Student",
          action: "",
        },
        {
          id: 7,
          name: "Lollipop",
          email: "frozen@gmail.com",
          telephone: "673889903",
          gender: "MALE",
          address: "Molyko Buea",
          occupation: "Student",
          action: "",
        },
        {
          id: 8,
          name: "Honeycomb",
          email: "frozen@gmail.com",
          telephone: "673889903",
          gender: "MALE",
          address: "Molyko Buea",
          occupation: "Student",
          action: "",
        },
        {
          id: 9,
          name: "Donut",
          email: "frozen@gmail.com",
          telephone: "673889903",
          gender: "MALE",
          address: "Molyko Buea",
          occupation: "Student",
          action: "",
        },
        {
          id: 10,
          name: "KitKat",
          email: "frozen@gmail.com",
          telephone: "673889903",
          gender: "MALE",
          address: "Molyko Buea",
          occupation: "Student",
          action: "",
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
    getTotalOrganisationMember() {
      return this.member_total;
    },
    validateFilter() {
      return this.year == null && this.gender == null ? true : false;
    },
  },
  methods: {
    updateMember(data) {
      this.$emit("update-member", data);
    },
    getOrganisationMembers(){
      let payload = {
        data: "",
        status: "none",
        url: "/api/protected/organisation-info",
        has_path_val: true,
        show_feedback: false,
        msg: "default",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "default",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
    }
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
