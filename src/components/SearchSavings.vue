<template>
  <div class="q-pa-md">
    <div class="q-mt-sm">
      <div class="q-my-md">
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
            placeholder="Filter by name, telephone"
          />
        </div>
        <div class="col-md-2 col-lg-2 col-sm-12 col xs-12">
          <q-btn
            class="form_button"
            label="Filter"
            :loading="loading_user_info"
            :color="color"
            :disabled="validateFilterByUserInfo"
            no-caps
            @click="filterByUserInfo()"
          >
          </q-btn>
        </div>
      </div>
      <hr class="separator"/>
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
            :color="color"
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
          :key="status"
        >
          <q-chip color="primary" text-color="white" clickable class="q-pa-md">
            {{ status.name }}
          </q-chip>
        </div>
      </div>

      <hr class="separator" />
      <div class="q-my-md">
        <label for="heading" class="text">Filter by delay</label>
      </div>
      <!-- search by year -->
      <div class="q-mb-lg row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <q-select
            v-model="param.year"
            outlined
            dense
            placeholder="filter by year"
            :options="years"
            input-debounce="0"
            @filter="filterYears"
            use-input
            hide-selected
            fill-input
          />
        </div>
      </div>
      <!-- search by month -->
      <div class="q-mb-lg row">
        <div
          class="col-md-12 col-lg-12 col-sm-12 col-xs-12"
        >
        <q-select
            v-model="param.month"
            outlined
            dense
            placeholder="filter by month"
            :options="months"
            input-debounce="0"
            use-input
            hide-selected
            fill-input
          />
        </div>
      </div>

      <!-- filter by date -->
      <div class="row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <q-input dense v-model="param.date" mask="date" :rules="['date']" outlined placeholder="filter by date">
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
      <div class="q-mb-sm row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
          <q-input dense v-model="param.date_range" mask="date" :rules="['date']" outlined placeholder="filter by date-range">
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

      <div class="row">
          <q-btn
            class="filter_btn"
            label="Filter"
            :loading="loading"
            :color="color"
            :disabled="validateForm"
            icon-right="filter_list"
            no-caps
            full-width
          >
          </q-btn>
      </div>
    </div>
  </div>
</template>
<script>
import PaymentCategoryMixinVue from "src/mixins/PaymentCategoryMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import PaymentItemMixinVue from "src/mixins/PaymentItemMixin.vue";
import ContributionsMixinVue from "src/mixins/ContributionsMixin.vue";

export default {
  mixins: [
    PaymentCategoryMixinVue,
    organisationMixinVue,
    memberMixinVue,
    PaymentItemMixinVue,
    ContributionsMixinVue,
  ],

  mounted() {
    let heading = "Search Member's Savings";

    this.$emit("set-heading", heading);

    this.getOrganisationId;
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
          name: "DECLINE",
          id: 0,
        },
        {
          name: "APPROVED",
          id: 1,
        },
      ],
      param: {
        name: null,
        telephone: null,
        year: null,
        month: null,
        status: null,
        range: null,
        amount_deposited: 0,
        date: null,
        date_range:null
      },
      position: "right",
      error_bal: false,
      dialog: false,
      no_caps: true,
      hasMadePayment: false,
      loading_user_info:false,
    };
  },
  computed: {
    validateForm() {
      return false;
    },
    validateFilterByUserInfo(){
      return this.param.name != null ? true: false;
    },
    validateAmount(){
      return this.param.amount_deposited != 0 ? true: false
    }
  },
  methods: {
    filterByUserInfo(){
      this.loading_user_info = true;
    },
    filterByAmount(){

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
  width:100%
}
</style>
