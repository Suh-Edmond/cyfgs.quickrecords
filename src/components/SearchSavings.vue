<template>
  <div class="q-pa-md">
    <div>
      <div class="q-mb-md">
        <label for="heading" class="text">{{
          $t("app.filterUserSaving")
        }}</label>
      </div>
      <!-- search by name of member -->
      <div class="q-mb-lg row q-gutter-md">
        <div class="col-md-9 col-lg-9 col-sm-12 col-xs-12">
          <q-input
            v-model="param.name"
            outlined
            dense
            type="text"
            :placeholder="$t('app.filterName')"
          />
        </div>
        <div class="col-md-2 col-lg-2 col-sm-12 col xs-12">
          <q-btn
            class="form_button"
            :label="$t('app.filter')"
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
        <label for="heading" class="text">{{ $t("app.filterAmount") }} </label>
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
            :label="$t('app.filter')"
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
        <label for="heading" class="text">{{ $t("app.filterStatus") }}</label>
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
        <label for="heading" class="text">{{ $t("app.filterDelay") }}</label>
      </div>
      <!-- search by year -->
      <div class="q-mb-md row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <q-select
            v-model="param.year"
            outlined
            dense
            :label="$t('app.searchYear')"
            :options="years"
            input-debounce="0"
            use-input
            clearable
            @input="stopSearch"
            @filter="filterYears"
          >
            <template v-slot:append v-if="start_filter_year">
              <q-spinner color="primary" size="1.2em" :thickness="3" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t("app.noResults") }}</q-item-section
                >
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
            :options="getAllMonths"
            :label="$t('app.searchMonth')"
            input-debounce="0"
            use-input
            clearable
          >
            <template v-slot:append v-if="start_filter_month">
              <q-spinner color="primary" size="1.2em" :thickness="3" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"
                  >{{ $t("app.noResults") }}
                </q-item-section>
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
            :placeholder="$t('app.selectDate')"
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
      <div class="flex justify-end q-mb-lg">
        <div class="q-mr-xl">
          <q-btn
            :label="$t('app.reset')"
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
            :label="$t('app.filter')"
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
import MonthsMixin from "src/mixins/MonthsMixin.vue";

export default {
  mixins: [
    organisationMixinVue,
    UserSavingMixinVue,
    CurrentYearMixinVue,
    MonthsMixin,
  ],

  mounted() {
    let heading = this.$t("app.searchSaving");

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
      organisation_id: this.$store.getters.getOrganisation.id,
      session_id: this.$store.getters.getCurrentYear.id,
      start_filter_month: false,
      start_filter_year: false,
    };
  },
  computed: {
    validateForm() {
      return (
        this.param.year === "" &&
        this.param.month === "" &&
        this.param.date === "" &&
        this.param.date_range === ""
      );
    },

    validateFilterByUserInfo() {
      return this.param.name === "";
    },

    validateAmount() {
      return this.param.amount_deposited === 0;
    },

    getAllMonths(){
      return [
        { label: this.$t("app.januaryName"), value: 1 },
        { label: this.$t("app.februaryName"), value: 2 },
        { label: this.$t("app.marchName"), value: 3 },
        { label: this.$t("app.aprilName"), value: 4 },
        { label: this.$t("app.mayName"), value: 5 },
        { label: this.$t("app.juneName"), value: 6 },
        { label: this.$t("app.julyName"), value: 7 },
        { label: this.$t("app.augustName"), value: 8 },
        { label: this.$t("app.septemberName"), value: 9 },
        { label: this.$t("app.octoberName"), value: 10 },
        { label: this.$t("app.novemberName"), value: 11 },
        { label: this.$t("app.decemberName"), value: 12 },
      ]
    }
  },
  methods: {
    filterByUserInfo() {
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: {
          organisation_id: this.organisation_id,
          name: this.param.name,
          session_id: this.session_id,
          t: new Date().getTime(),
        },
      });
      let url = `/api/protected/user-savings?organisation_id=${this.organisation_id}&name=${this.param.name}&session_id=${this.session_id}&page=${1}&per_page=${7}`;
      this.loading_user_info = this.filterSaving(url);
    },

    filterByAmount() {
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: {
          organisation_id: this.organisation_id,
          amount_deposited: this.param.amount_deposited,
          session_id: this.session_id,
          t: new Date().getTime(),
        },
      });
      let url = `/api/protected/user-savings?organisation_id=${this.organisation_id}&amount_deposited=${this.param.amount_deposited}&session_id=${this.session_id}&page=${1}&per_page=${7}`;
      this.loading_save_amount = this.filterSaving(url);
    },

    filterByStatus(status) {
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: {
          organisation_id: this.organisation_id,
          status: status,
          session_id: this.session_id,
          t: new Date().getTime(),
        },
      });
      let url = `/api/protected/user-savings?organisation_id=${this.organisation_id}&status=${status}&session_id=${this.session_id}&page=${1}&per_page=${7}`;
      this.filterSaving(url);
    },

    filterByDuration() {
      this.$router.push({
        path: `/dashboard/members-savings`,
        query: {
          organisation_id: this.organisation_id,
          session_id: this.session_id,
          month: this.param.month,
          date: this.param.date,
          range: this.param.date_range,
          t: new Date().getTime(),
        },
      });

      let url = `/api/protected/user-savings?organisation_id=${this.organisation_id}&session_id=${this.session_id}&month=${this.param.month}&date=${this.param.date}&range=${this.param.date_range}&page=${1}&per_page=${7}`;
      this.loading = this.filterSaving(url);
    },

    resetForm() {},

    filterMonths(val, update, abort) {
      if (val < 1) {
        this.start_filter_month = false;
        abort();
        return;
      }

      update(() => {
        this.start_filter_month = true;
        this.months = this.getMonths.filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.months;
      });
    },

    filterYears(val, update, abort) {
      if (val < 1) {
        this.start_filter_year = false;
        abort();
        return;
      }

      update(() => {
        this.start_filter_year = true;
        this.years = this.getSessionsFromState.filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.years;
      });
    },

    stopSearch() {
      if (this.param.year != null && this.param.year != "") {
        this.start_filter_year = false;
      }
      if (this.param.month != null && this.param.month != "") {
        this.start_filter_month = false;
      }
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
