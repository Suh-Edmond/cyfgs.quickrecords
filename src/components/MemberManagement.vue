<template>
  <q-page>
    <!-- no members found -->
    <NotFound :message="not_found_msg" v-if="getTotalOrganisationMember == 0"></NotFound>
    <!-- header for filter members -->
    <div class="row q-ml-xs" v-if="getTotalOrganisationMember > 0" :class="$q.screen.lg ? 'q-pa-sm' : ''" :style="
      $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
    ">
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12" v-show="!start_search">
        <q-select v-model="gender" outlined dense :options="genders" label="Select gender" />
      </div>
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12" v-show="!start_search">
        <q-select v-model="year" outlined dense :options="years" label="Select year" />
      </div>
      <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12" :class="!$q.screen.lg ? '' : ''" v-show="!start_search">
        <ButtonVue class="button" :label="label_fetch_user" :loading="loading" :color="color" :disabled="validateFilter"
          :no_caps="no_caps" icon_right="filter_list">
        </ButtonVue>
      </div>
      <div :class="
        !start_search
          ? 'col-md-3 col-lg-3 col-xs-12 col-sm-12'
          : 'col-md-12 col-lg-12 col-xs-12 col-sm-12 q-pr-xl q-pl-sm'
      ">
        <q-input v-model="search" dense outlined type="search" placeholder="Type a name to search member..."
          v-show="start_search" clearable>
          <template v-slot:before>
            <q-icon name="close" round @click="showSearch" class="icon">
              <q-tooltip>Close Search</q-tooltip>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <div class="search_icon">
          <q-icon name="search" v-show="!start_search" color="primary" round @click="showSearch" class="icon" size="sm">
          </q-icon>
        </div>
      </div>
    </div>
    <!-- table for members -->
    <div class="row q-pt-sm">
      <div class="col-md-12 col-xs-12 col-sm-12">
        <TableVue :columns="columns" :data="data" :title="table_title" :label="label" @update-member="updateMember">
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
  data() {
    return {
      member_total: 1,
      year: null,
      years: ["2020", "2021", "2022", "2023", "2024"],
      label_fetch_user: "Filter Members",
      loading: false,
      color: "primary",
      no_caps: true,
      genders: ["MALE", "FEMALE", "ALL", "OTHER"],
      gender: null,
      search: "",
      start_search: false,
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
          label: "Dessert (100g serving)",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "calories",
          align: "center",
          label: "Calories",
          field: "calories",
          sortable: true,
        },
        { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
        { name: "carbs", label: "Carbs (g)", field: "carbs", sortable: true },
        {
          name: "protein",
          label: "Protein (g)",
          field: "protein",
          sortable: true,
        },
        {
          name: "sodium",
          label: "Sodium (mg)",
          field: "sodium",
          sortable: true,
        },
        {
          name: "calcium",
          label: "Calcium (%)",
          field: "calcium",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "iron",
          label: "Iron (%)",
          field: "iron",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      data: [
        {
          counter: 1,
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: "14%",
          iron: "1%",
        },
        {
          counter: 2,
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: "8%",
          iron: "1%",
        },
        {
          counter: 3,
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: "6%",
          iron: "7%",
        },
        {
          counter: 4,
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: "3%",
          iron: "8%",
        },
        {
          counter: 5,
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: "7%",
          iron: "16%",
        },
        {
          counter: 6,
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: "0%",
          iron: "0%",
        },
        {
          counter: 7,
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: "0%",
          iron: "2%",
        },
        {
          counter: 8,
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: "0%",
          iron: "45%",
        },
        {
          counter: 9,
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: "2%",
          iron: "22%",
        },
        {
          counter: 10,
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: "12%",
          iron: "6%",
        },
      ],
      table_title: "Registered Members",
      not_found_msg: "Ooops!! You don't have any Register Member click the button to add Members."
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
    showSearch() {
      this.start_search = !this.start_search;
    },
    updateMember(data) {
      this.$emit("update-member", data);
    },
  },
  components: {
    ButtonVue,
    TableVue,
    NotFound
  },
};
</script>
<style lang="scss" scoped>
.arrow {
  height: 2rem;
}

.button {
  width: 100%;
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
