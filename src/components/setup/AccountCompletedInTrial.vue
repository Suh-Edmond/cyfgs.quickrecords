<template>
  <div class="row">
    <div class="col-4 col-md-4 col-lg-4 col-xs-12 col-sm-12">
      <div class="text_h6 flex justify-start q-pl-md q-pb-sm">
        {{ $t("app.organisationMgtHeading") }}
      </div>
      <div class="q-pt-sm bill_info">
        <div class="row q-col-gutter-x-md justify-between">
          <label class="text-muted">Name:</label>
          <label class="text_h6">
            {{ organisation.name }}
          </label>
        </div>
        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-muted">Email:</label>
          <label class="text_h6 flex justify-end items-end">
            {{ organisation.email }}
          </label>
        </div>
        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-muted">Telehone:</label>
          <label class="text_h6"> {{ getTelephone }} </label>
        </div>

        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-muted">WhatsApp Number:</label>
          <label class="text_h6"> {{ getWhatsappNumber }} </label>
        </div>

        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-muted">Address:</label>
          <label class="text_h6"> {{ organisation.address }} </label>
        </div>

        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-muted">PO Box:</label>
          <label class="text_h6"> {{ organisation.box_number }} </label>
        </div>

        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-muted">Region:</label>
          <label class="text_h6"> {{ organisation.region }} </label>
        </div>

        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-muted">Salutation/Greeting:</label>
          <label class="text_h6"> {{ organisation.salutation }} </label>
        </div>

        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-muted">Trial start date:</label>
          <label class="text_h6">
            {{ getFormatDate(subscription.trial_period_start_date) }}
          </label>
        </div>

        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-muted">Trial end date:</label>
          <label class="text_h6">
            {{ getFormatDate(subscription.trial_period_end_date) }}
          </label>
        </div>
      </div>
    </div>
    <div class="col-8 col-md-8 col-lg-8 col-xs-12 col-sm-12">
      <div
        class="text_h6 flex q-pb-sm"
        :class="
          $q.platform.is.mobile ? 'justify-start q-pl-md' : 'justify-center'
        "
      >
        {{ $t("app.planFeatures") }}
      </div>
      <div
        :class="
          $q.platform.is.desktop
            ? 'fit row wrap justify-center items-center content-center'
            : 'fit row wrap justify-start items-start content-start'
        "
      >
        <q-list>
          <q-item
            v-ripple
            v-for="(feature, index) in features"
            dense
            :key="index"
          >
            <q-item-section avatar>
              <q-icon
                color="secondary"
                text-color="white"
                name="done"
                size="xs"
              />
            </q-item-section>
            <q-item-section>{{ feature }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "PageIndex",
  props: {
    subscription: {
      required: true,
      type: Object,
    },
    features: {
      required: true,
      type: Array,
    },
    organisation: {
      required: true,
      type: Object,
    },
  },

  computed: {
    getTelephone() {
      return this.organisation.telephone.split("/")[0];
    },
    getWhatsappNumber() {
      return this.organisation.telephone.split("/")[1];
    },
  },

  methods: {
    getFormatDate(date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss a");
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
}

.page {
  background-color: $grey1;
}

.text_h6 {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 24px;
  align-items: center;
  text-align: center;
}

.billing_field {
  font-family: "Roboto";
  font-style: normal;

  font-size: 14px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $dark;
}

.bill_info {
  margin-bottom: 0.7rem;
}
</style>
