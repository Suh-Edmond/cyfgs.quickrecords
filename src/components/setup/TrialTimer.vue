<template>
  <div class="timer trial-countdown">
    <div v-if="timeLeft > 0">
      <span>{{ $t("app.trialTimeRemaining") }} </span>
      <strong> {{ days }}d {{ hours }}h {{ minutes }}m {{ seconds }}s </strong>
    </div>
    <div v-else>
      <span class="expired"> {{ $t("app.trialExpiredMsg") }}</span>
    </div>

    <div class="text_subscription_time" v-if="isSubscriptionExpired">
      <span>{{ $t("app.subscriptionRequiredMsg") }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    trialEndDate: {
      required: true,
      type: String,
    },
    status: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      timer: null,
      now: new Date().getTime(),
    };
  },
  mounted() {
    this.startTimer();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  computed: {
    targetDate() {
      return new Date(this.trialEndDate).getTime();
    },
    timeLeft() {
      const diff = this.targetDate - this.now;
      return diff > 0 ? diff : 0;
    },

    isTrialExpired() {
      return this.countDown <= 0 && this.status === "trialing";
    },

    isSubscriptionExpired() {
      return this.countDown <= 0 && this.status === "past_due";
    },
    days() {
      return Math.floor(this.timeLeft / (1000 * 60 * 60 * 24));
    },
    hours() {
      return Math.floor(
        (this.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
    },
    minutes() {
      return Math.floor((this.timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    },
    seconds() {
      return Math.floor((this.timeLeft % (1000 * 60)) / 1000);
    },
  },
  mounted() {
    this.startTimer();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        this.now = new Date().getTime();

        if (this.timeLeft <= 0) {
          clearInterval(this.timer);
          this.$emit("expired");
        }
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.trial-countdown {
  padding: 10px;
  color: $orange;
  border-radius: 4px;
}
.expired {
  color: $orange;
  font-weight: bold;
}
.timer {
  position: absolute;
  top: 5px;
  left: 10%;
}
</style>
