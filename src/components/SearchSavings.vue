<template>
  <div class="q-pa-md">
    <div>
      <div class="q-mb-md">
        <label for="heading" class="text">Filter by user information </label>
      </div>
      <!-- search by name of member -->
      <div class="q-mb-lg row q-gutter-md">
        <div class="col-md-9 col-lg-9 col-sm-12 col-xs-12">
          <q-input
            v-model="param.name"
            outlined
            dense
            type="text"
            placeholder="Filter by name"
          />
        </div>
        <div class="col-md-2 col-lg-2 col-sm-12 col xs-12">
          <q-btn
            class="form_button"
            label="Filter"
            :loading="loading_user_info"
            :color="'primary'"
            :disabled="validateFilterByUserInfo"
            no-caps
            @click="filterByUserInfo()"
          >
          </q-btn>
        </div>
      </div>
      <hr class="separator" />
      <div class="q-my-md">
        <label for="heading" class="text">Filter by saved amount </label>
      </div>
      <!-- search by amount deposited -->
      <div class="q-mb-lg row q-gutter-md">
        <div class="col-md-9 col-lg-9 col-sm-12 col-xs-12">
          <q-input
            v-model="param.amount_deposited"
            outlined
            dense
            type="number"
            placeholder="Search by amount"
          />
        </div>
        <div class="col-md-2 col-lg-2 col-sm-12 col xs-12">
          <q-btn
            class="form_button"
            label="Filter"
            :loading="loading_save_amount"
            :color="'primary'"
            :disabled="validateAmount"
            no-caps
            @click="filterByAmount()"
          >
          </q-btn>
        </div>
      </div>
      <hr class="separator" />
      <div class="q-my-md">
        <label for="heading" class="text">Filter by status</label>
      </div>
      <!-- filter by status of savings -->
      <div class="q-mb-lg row q-gutter-xs">
        <div
          class="col-md-3 col-lg-3 col-sm-12 col-xs-12"
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

      <hr class="separator" />
      <div class="q-my-md">
        <label for="heading" class="text">Filter by delay</label>
      </div>
      <!-- search by year -->
      <div class="q-mb-md row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <q-select
            v-model="param.year"
            outlined
            dense
            label="Search year..."
            :options="years"
            input-debounce="0"
            use-input
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
      </div>
      <!-- search by month -->
      <div class="q-mb-md row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <q-select
            v-model="param.month"
            outlined
            dense
            :options="months"
            label="Search month..."
            input-debounce="0"
            use-input
            clearable
            @filter="filterMonths"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
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
            placeholder="Search by date"
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
            placeholder="Search by date-range"
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

      <div class="flex justify-end q-mb-lg">
        <div class="q-mr-xl">
          <q-btn
            label="Reset"
            color="primary"
            no-caps
            outline
            @click="resetForm()"
          >
          </q-btn>
        </div>
        <div>
          <q-btn
            class="filter_btn"
            label="Filter"
            :loading="loading"
            :color="'primary'"
            :disabled="validateForm"
            no-caps
            full-width
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
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";

const monthOptions = [
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
];
export default {
  mixins: [organisationMixinVue, UserSavingMixinVue, CurrentYearMixinVue],

  mounted() {
    let heading = "Search Member's Savings";

    this.$emit("set-heading", heading);
  },

  data() {
    return {
      loading: false,
      years: [],
      months: [],
      statuses: [
        {
          name: "PENDING",
          id: 0,
        },
        {
          name: "DECLINED",
          id: 2,
        },
        {
          name: "APPROVED",
          id: 1,
        },
        {
          name: "ALL",
          id: 3,
        },
      ],
      param: {
        name: "",
        year: "",
        month: "",
        status: "",
        range: "",
        amount_deposited: 0,
        date: "",
        date_range: "",
      },
      dialog: false,
      loading_user_info: false,
      loading_save_amount: false,
    };
  },
  computed: {
    validateForm() {
      return this.param.year == "" &&
        this.param.month == "" &&
        this.param.date == "" &&
        this.param.date_range == ""
        ? true
        : false;
    },

    validateFilterByUserInfo() {
      return this.param.name == "" ? true : false;
    },

    validateAmount() {
      return this.param.amount_deposited == 0 ? true : false;
    },
  },
  methods: {
    filterByUserInfo() {
      let organisation = this.$store.getters.getOrganisation;
      let session_id = this.getCurrentYear.id;
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: {
          organisation_id: organisation.name,
          name: this.param.name,
          session_id: session_id,
        },
      });
      let url = `/api/protected/user-savings?organisation_id=${organisation.id}&name=${this.param.name}&session_id=${session_id}`;
      this.filterSaving(url);
      this.param.name = "";
    },

    filterByAmount() {
      let session_id = this.getCurrentYear.id;
      let organisation = this.$store.getters.getOrganisation;
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: {
          organisation_id: organisation.id,
          amount_deposited: this.param.amount_deposited,
          session_id: session_id,
        },
      });
      let url = `/api/protected/user-savings?organisation_id=${organisation.id}&amount_deposited=${this.param.amount_deposited}&session_id=${session_id}`;
      this.loading_save_amount = this.filterSaving(url);
      this.param.amount_deposited = 0;
    },

    filterByStatus(status) {
      let organisation = this.$store.getters.getOrganisation;
      let session_id = this.getCurrentYear.id;
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: {
          organisation_id: organisation.id,
          status: status,
          session_id: session_id,
        },
      });
      let url = `/api/protected/user-savings?organisation_id=${organisation.id}&status=${status}&session_id=${session_id}`;
      this.filterSaving(url);
    },

    filterByDuration() {
      let organisation = this.$store.getters.getOrganisation;
      let session_id = this.getCurrentYear.id;
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: {
          organisation_id: organisation.id,
          session_id: session_id,
          month: this.param.month,
          date: this.param.date,
          range: this.param.date_range,
        },
      });

      let url = `/api/protected/user-savings?organisation_id=${organisation.id}&session_id=${session_id}&month=${this.param.month}&date=${this.param.date}&range=${this.param.date_range}`;
      this.filterSaving(url);
      this.param.year = "";
      this.param.month = "";
      this.param.date = "";
      this.param.date_range = "";
    },

    resetForm() {},

    filterMonths(val, update, abort) {
      if (val < 2) {
        abort();
        return;
      }

      update(() => {
        this.months = monthOptions.filter((item) =>
          item.toLowerCase().includes(val.toLowerCase())
        );
        return this.months;
      });
    },

    filterYears(val, update, abort) {
      if (val < 2) {
        abort();
        return;
      }

      update(() => {
        this.years = this.getSessionsFromState.filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.years;
      });
    },
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
  width: 100%;
}
</style>
