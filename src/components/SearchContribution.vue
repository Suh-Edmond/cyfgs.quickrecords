<template>
  <div class="q-px-lg">
    <div>
      <div class="q-my-md">
        <label for="heading" class="text"
          >{{$t('app.filterMsg')}}
        </label>
      </div>
      <div class="q-mb-lg row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 q-mt-sm">
          <q-select
            v-model="param.payment_item_id"
            outlined
            dense
            :options="filtered_payment_items"
            :label="$t('app.searchPaymentItem')"
            input-debounce="0"
            use-input
            clearable
            @filter="filterPaymentItems"
            @input="stopSearch"
          >
          <template v-slot:append v-if="start_filtering">
              <q-spinner color="primary" size="1.2em" :thickness="3" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> {{$t('app.noResults')}} </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>

      <!-- filter by status of contributions -->
      <div class="q-my-md">
        <label for="heading" class="text">{{$t('app.filterStatus')}}</label>
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
            :disable="validateForm"
            @click="filterByDuration(status.name)"
          >
            {{ status.name }}
          </q-chip>
        </div>
      </div>

      <!-- filter by duration -->
      <hr class="separator" />
      <div class="q-my-md">
        <label for="heading" class="text">{{$t('app.filterDelay')}}</label>
      </div>
      <!-- by year -->
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
            @filter="filterYears"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">  {{$t('app.noResults')}} </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
      <!--  by month -->
      <div class="q-mb-md row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <q-select
            v-model="param.month"
            outlined
            dense
            :options="months"
            :label="$t('app.searchMonth')"
            input-debounce="0"
            use-input
            clearable
            @filter="filterMonths"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">{{$t('app.noResults')}} </q-item-section>
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

      <!-- filter by date range -->
      <div class="q-mb-md row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <q-input
            dense
            v-model="param.date_range"
            mask="date"
            outlined
            :placeholder="$t('app.selectDateRange')"
            range
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

      <div class="flex justify-end q-mt-lg">
        <div class="q-mr-xl">
          <q-btn label="Reset" color="primary" no-caps outline @click="reset()">
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
            @click="filterByDuration(null)"
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
import ContributionsMixinVue from "src/mixins/ContributionsMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";
import MonthsMixinVue from 'src/mixins/MonthsMixin.vue';

export default {
  mixins: [
    organisationMixinVue,
    UserSavingMixinVue,
    ContributionsMixinVue,
    HelperMixinVue,
    CurrentYearMixinVue,
    MonthsMixinVue
  ],

  mounted() {
    let heading = this.$t('app.searchContributionlabel');

    this.$emit("set-heading", heading);

    this.getPaymentItems();
  },

  data() {
    return {
      loading: false,
      years: [],
      months: [],
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
        payment_category_id: null,
        payment_item_id: null,
        month: "",
        year: "",
        range: "",
        date: "",
        date_range: "",
      },
      payment_items_by_category: [],
      payment_categories: [],
      filtered_payment_items: [],
      start_filter_payment_item:false,
      start_filtering:false,
    };
  },
  computed: {
    validateForm() {
      return this.param.payment_item_id == null;
    },
  },
  methods: {
    getPaymentItems() {
      this.payment_items_by_category = [];
      let payload = {
        status: "none",
        url: `/api/protected/payment-items`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
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
      this.$store.dispatch("getRequest", payload).then((res) => {
        if (res.success) {
          res.data.forEach((ele) => {
            this.payment_items_by_category.push({
              label: ele.name,
              value: ele.id,
              amount: ele.amount,
            });
          });
        }
      });

      return this.payment_items_by_category;
    },

    filterByDuration(status) {
      let payload = {
        organisation_id: this.getOrganisationId,
        status: status == null ? "" : status,
        payment_category_id: this.param.payment_category_id,
        payment_item_id: this.param.payment_item_id,
        year:
          this.param.year == ""
            ? this.$store.getters.getCurrentYear.id
            : this.param.year.value,
        month: this.param.month,
        date: this.param.date,
        date_range: this.param.date_range,
        amount: this.param.payment_item_id.amount,
      };
      this.loading = this.filterMembersContributions(
        payload,
        payload.year,
        payload.status,
        payload.month,
        payload.date,
        payload.date_range,
        payload.amount,
        1,
        4
      );
      this.param.payment_item_id = "";
    },

    reset() {
      this.param.payment_category_id = null;
      this.param.payment_item_id = null;
      this.param.month = "";
      this.param.year = "";
      this.param.range = "";
      this.param.date = "";
      this.param.date_range = "";
    },

    getPaymentCategoriesFromState() {
      this.payment_categories = [];
      this.$store.getters.getPaymentCategories.forEach((ele) => {
        this.payment_categories.push({
          label: ele.name,
          value: ele.id,
        });
      });

      return this.payment_categories;
    },

    filterPaymentCategories(val, update, abort) {
      if (val < 2) {
        abort();
        return;
      }

      update(() => {
        this.payment_categories = this.getPaymentCategoriesFromState().filter(
          (item) => item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.payment_categories;
      });
    },

    filterPaymentItems(val, update, abort) {
      if (val < 2) {
        abort();
        this.start_filter_payment_item = false
        return;
      }

      update(() => {
        this.start_filter_payment_item = true
        this.filtered_payment_items = this.payment_items_by_category.filter(
          (item) => item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.filtered_payment_items;
      });
    },

    filterMonths(val, update, abort) {
      if (val < 2) {
        abort();
        return;
      }

      update(() => {
        this.months = this.getMonths.filter((item) =>
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

    stopSearch(){
      if(this.param.payment_item_id != null){
        this.start_filter_payment_item = false;
      }
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
