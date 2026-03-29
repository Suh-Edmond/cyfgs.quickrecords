<template>
  <div class="row justify-between">
    <div>
      <div class="text_h6 q-pt-xs q-pb-sm row justify-start text-black">
        {{ $t("app.currentSubscription") }}
      </div>
      <div class="q-pb-sm summaryCaption">
        {{ $t("app.currentSubscriptionCaption") }}
      </div>
    </div>
    <div
      class="items-end caption"
      v-if="subscriptionPlan.billing_cycle === 'monthly'"
    >
      <div class="text_h6 q-pt-xs q-pb-sm text-black">
        {{ $t("app.monthlyPlan") }}
      </div>
      <div class="q-pb-sm">
        {{ Number(subscriptionPlan.price).toLocaleString() }}
        XAF/{{ $t("app.month") }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    subscriptionPlan: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.caption {
  color: $dark;
  font-weight: 600;
  font-size: 15px;
}
</style>
