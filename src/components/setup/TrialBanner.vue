<template>
  <div
    class="bg-deep-orange-3 text-white rounded-borders"
    v-if="subscriptionStatus === 'trialing'"
  >
    <q-list bordered class="rounded-borders">
      <q-item v-ripple>
        <q-item-section avatar>
          <q-icon name="warning" class="" size="md" />
        </q-item-section>

        <q-item-section class="q-pa-xs" v-if="$q.platform.is.desktop">
          <q-item-label lines="1" class="text-weight-bold">{{
            $t("app.trailingSubscription")
          }}</q-item-label>
          <q-item-label lines="2">
            {{
              $t("app.trialingSubscriptionCaption", {
                telephone: "+237673660071",
              })
            }}
          </q-item-label>
        </q-item-section>

        <div v-if="$q.platform.is.mobile">
          {{ $t("app.trailingSubscription") }}<br />
          {{ $t("app.trialingSubscriptionCaption") }}
        </div>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    subscriptionStatus: {
      type: String,
      required: true,
    },
    subscription: {
      type: Object,
      required: true,
    },
  },

  methods: {
    getFormatDate(date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss a");
    },
  },
};
</script>

<style></style>
