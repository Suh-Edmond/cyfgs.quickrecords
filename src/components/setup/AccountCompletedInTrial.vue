<template>
  <div class="row">
    <div class="col-4 col-md-4 col-lg-4 col-xs-12 col-sm-12">
      <div class="header flex justify-start q-pl-md q-pb-sm">
        {{ $t("app.organisationMgtHeading") }}
      </div>
      <div class="q-pt-sm bill_info">
        <div class="row q-col-gutter-x-md justify-between">
          <label class="text-label"
            ><q-icon name="diversity_3" size="xs" class="q-pr-sm" />{{
              $t("app.organisationName")
            }}
            :
          </label>
          <label class="text_value">
            {{ organisation.name }}
          </label>
        </div>
        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-label"
            ><q-icon name="email" size="xs" class="q-pr-sm" />{{
              $t("app.emailLabel")
            }}
            :
          </label>
          <label class="text_value flex justify-end items-end">
            {{ organisation.email }}
          </label>
        </div>
        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-label"
            ><q-icon name="call" size="xs" class="q-pr-sm" />{{
              $t("app.telephoneLabel")
            }}
            :
          </label>
          <label class="text_value"> {{ getTelephone }} </label>
        </div>

        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-label"
            ><img
              src="../../assets/whatsapp_transparent.jpg"
              width="25px"
              class="q-pr-sm whatsapp_icon"
            />{{ $t("app.telephoneTwo") }} :
          </label>
          <label class="text_value"> {{ getWhatsappNumber }} </label>
        </div>

        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-label"
            ><q-icon name="location_on" size="xs" class="q-pr-sm" />{{
              $t("app.addressLabel")
            }}
            :
          </label>
          <label class="text_value">
            {{ organisation.address }} {{ organisation.box_number }}</label
          >
        </div>

        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-label"
            ><q-icon name="location_on" size="xs" class="q-pr-sm" />{{
              $t("app.region")
            }}
            :
          </label>
          <label class="text_value"> {{ organisation.region }} </label>
        </div>

        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-label"
            ><q-icon name="hourglass_top" size="xs" class="q-pr-sm" />{{
              $t("app.trialStartDate")
            }}
            :
          </label>
          <label class="text_value">
            {{ getFormatDate(subscription.trial_period_start_date) }}
          </label>
        </div>

        <div class="row q-col-gutter-x-md q-pt-sm justify-between">
          <label class="text-label"
            ><q-icon name="hourglass_bottom" size="xs" class="q-pr-sm" />{{
              $t("app.trialEndDate")
            }}
            :
          </label>
          <label class="text_value">
            {{ getFormatDate(subscription.trial_period_end_date) }}
          </label>
        </div>
      </div>
    </div>
    <div class="col-8 col-md-8 col-lg-8 col-xs-12 col-sm-12">
      <div
        class="header flex"
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
          <q-item v-for="(feature, index) in features" dense :key="index">
            <q-item-section avatar>
              <q-icon
                :color="
                  feature.requires_subscription ? 'negative' : 'secondary'
                "
                text-color="white"
                :name="feature.requires_subscription ? 'cancel' : 'done'"
                size="sm"
              />
            </q-item-section>
            <q-item-section class="features">{{ feature.name }}</q-item-section>
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

.text-label {
  color: $grey2;
}

.header {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 24px;
}

.text_value {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 24px;
}

.text_h6 {
  color: $grey5;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 24px;
}

.whatsapp_icon {
  color: $grey2 !important;
}

.bill_info {
  margin-bottom: 0.7rem;
}
</style>
