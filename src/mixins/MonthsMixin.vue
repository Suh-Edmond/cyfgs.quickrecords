<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      months: [
        this.$t("app.januaryName"),
        this.$t("app.februaryName"),
        this.$t("app.marchName"),
        this.$t("app.aprilName"),
        this.$t("app.mayName"),
        this.$t("app.juneName"),
        this.$t("app.julyName"),
        this.$t("app.augustName"),
        this.$t("app.septemberName"),
        this.$t("app.octoberName"),
        this.$t("app.novemberName"),
        this.$t("app.decemberName"),
      ],
      quarters: [
        this.$t('app.firstQuarter'),
        this.$t('app.secondQuarter'),
        this.$t('app.thirdQuarter'),
        this.$t('app.fourthQuarter'),
      ],
    };
  },
  computed: {
    getMonths() {
      return this.months;
    },

    getQuarters(){
      return this.quarters;
    }
  },
};
</script>
