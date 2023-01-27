<template>
  <div class="q-px-lg">
    <div>
      <div class="q-my-md">
        <label for="heading" class="text"
          >Filter by Payment Category, Item
        </label>
      </div>
      <div class="q-mb-lg row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 q-mb-md">
          <q-select
            v-model="param.payment_category_id"
            outlined
            dense
            label="Select category"
            :options="getExpenditureCategories"
            @input="getPaymentItems"
          />
        </div>

        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 q-mt-sm">
          <q-select
            v-model="param.payment_item_id"
            outlined
            dense
            label="Select item"
            :options="months"
          />
        </div>
      </div>

      <!-- filter by status of savings -->
      <hr class="separator" />
      <div class="q-my-md">
        <label for="heading" class="text">Filter by status</label>
      </div>
      <div class="q-mb-lg row">
        <div
          class="col-md-4 col-lg-4 col-sm-12 col-xs-12"
          v-for="status in statuses"
          :key="status.index"
        >
          <q-chip
            color="primary"
            text-color="white"
            clickable
            class="q-pa-md"
            @click="filterByStatus(status.name)"
          >
            {{ status.name }}
          </q-chip>
        </div>
      </div>

      <!-- filter by duration -->
      <hr class="separator" />
      <div class="q-my-md">
        <label for="heading" class="text">Filter by delay</label>
      </div>
      <!-- by year -->
      <div class="q-mb-md row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <q-select
            v-model="param.year"
            outlined
            dense
            label="Select year"
            :options="years"
          />
        </div>
      </div>
      <!--  by month -->
      <div class="q-mb-md row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <q-select
            v-model="param.month"
            outlined
            dense
            label="Select month"
            :options="months"
          />
        </div>
      </div>

      <!-- filter by date -->
      <div class="row q-mb-md">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <q-input
            dense
            v-model="param.date"
            mask="date"
            outlined
            placeholder="Select date"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="param.date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <!-- filter by date range -->
      <div class="q-mb-md row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <q-input
            dense
            v-model="param.date_range"
            mask="date"
            outlined
            placeholder="Select date-range"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="param.date_range" range>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <div class="row justify-end q-mt-lg">
        <div class="col-md-3 col-sm-3 col-xs-3">
          <q-btn
            label="Reset"
            color="primary"
            :disabled="!validateForm"
            no-caps
            outline
            @click="reset()"
          >
          </q-btn>
        </div>
        <div class="col-md-3 col-sm-3 col-xs-3 col-lg-3">
          <q-btn
            class="filter_btn"
            label="Filter"
            :loading="loading"
            :color="color"
            :disabled="validateForm"
            no-caps
            @click="filterByDuration()"
          >
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import UserSavingMixinVue from "src/mixins/UserSavingMixin.vue";
import ExpenditureCategoryMixin from "src/mixins/ExpenditureCategoryMixin.vue";

export default {
  mixins: [organisationMixinVue, UserSavingMixinVue],

  mounted() {
    let heading = "Search Member's Contribution";

    this.$emit("set-heading", heading);

    // this.fetchExpenditureCategories();
  },

  data() {
    return {
      label_save: "Save",
      loading: false,
      color: "primary",
      years: ["2020", "2021", "2022", "2023", "2024"],
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
      statuses: [
        {
          name: "PENDING",
          id: 2,
        },
        {
          name: "APPROVED",
          id: 1,
        },
        {
          name: "DECLINED",
          id: 3,
        },
        {
          name: "COMPLETE",
          id: 4,
        },
        {
          name: "INCOMPLETE",
          id: 5,
        },
        {
          name: "ALL",
          id: 0,
        },
      ],
      param: {
        payment_category_id: "",
        payment_item_id: "",
        month: "",
        status: "",
        range: "",
        date: "",
        date_range: "",
      },
      position: "right",
      error_bal: false,
      dialog: false,
      no_caps: true,
      hasMadePayment: false,
      loading_user_info: false,
      loading_save_amount: false,
    };
  },
  computed: {
    validateForm() {
      return this.param.payment_category_id == "" &&
        this.param.payment_item_id == ""
        ? true
        : false;
    },

    getExpenditureCategories() {
      let data = [];

      this.$store.getters.getExpenditureCategories.forEach((element) => {
        data.push({
          label: element.name,
          value: element.id,
        });
      });

      return data;
    },
  },
  methods: {
    getPaymentItems(){

    },
    filterByUserInfo() {
      let organisation_id = this.getOrganisationId;
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: { organisation_id: organisation_id, name: this.param.name },
      });
      let url = `/api/protected/user-savings?organisation_id=${organisation_id}&name=${this.param.name}`;
      this.filterSaving(url);
      this.$store.dispatch("setSearchSavingsParams", {
        organisation_id: organisation_id,
        name: this.param.name,
      });
      this.param.name = "";
    },

    filterByAmount() {
      let organisation_id = this.getOrganisationId;
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: {
          organisation_id: organisation_id,
          amount_deposited: this.param.amount_deposited,
        },
      });
      let url = `/api/protected/user-savings?organisation_id=${organisation_id}&amount_deposited=${this.param.amount_deposited}`;
      this.filterSaving(url);
      this.$store.dispatch("setSearchSavingsParams", {
        organisation_id: organisation_id,
        amount_deposited: this.param.amount_deposited,
      });
      this.param.amount_deposited = 0;
    },

    filterByStatus(status) {
      let organisation_id = this.getOrganisationId;
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: { organisation_id: organisation_id, status: status },
      });
      let url = `/api/protected/user-savings?organisation_id=${organisation_id}&status=${status}`;
      this.filterSaving(url);
      this.$store.dispatch("setSearchSavingsParams", {
        organisation_id: organisation_id,
        status: status,
      });
    },

    filterByDuration() {
      let organisation_id = this.getOrganisationId;
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: {
          organisation_id: organisation_id,
          year: this.param.year,
          month: this.param.month,
          date: this.param.date,
          range: this.param.date_range,
        },
      });

      let url = `/api/protected/user-savings?organisation_id=${organisation_id}&year=${this.param.year}&month=${this.param.month}&date=${this.param.date}&range=${this.param.date_range}`;
      this.filterSaving(url);
      this.param.year = "";
      this.param.month = "";
      this.param.date = "";
      this.param.date_range = "";

      this.$store.dispatch("setSearchSavingsParams", {
        organisation_id: organisation_id,
        year: this.param.year,
        month: this.param.month,
        date: this.param.date,
        range: this.param.date_range,
      });
    },

    reset() {

    }
  },
  components: {},
};
</script>

<style scoped lang="scss">
.text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  align-items: center;
  letter-spacing: 0.1em;
  color: $grey5;
}

.separator {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  align-items: center;
  letter-spacing: 0.1em;
  color: $grey5;
}

.filter_btn {
  letter-spacing: 0.1em;
  width: 100%;
}
</style>
