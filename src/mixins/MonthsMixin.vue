<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      months: [
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
      ],
      quarters: [
        this.$t("app.firstQuarter"),
        this.$t("app.secondQuarter"),
        this.$t("app.thirdQuarter"),
        this.$t("app.fourthQuarter"),
      ],
    };
  },
  computed: {
    getMonths() {
      return this.months;
    },

    getQuarters() {
      return this.quarters;
    },
  },
};
</script>
