<template>
  <div class="q-py-md" :class="$q.platform.is.mobile ? 'q-px-lg' : 'q-px-md'">
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="name" class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.memberName") }}
        </label>
      </div>

      <div>
        <label class="value">
          {{ getCurrentMemberSaving.user_name }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="email" class="label"
          ><span> <q-icon name="email" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.emailLabel") }}
        </label>
      </div>
      <div>
        <label class="value">
          {{ getCurrentMemberSaving.email }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <label for="telephone" class="label"
        ><span> <q-icon name="phone" size="xs" class="q-pr-sm" /> </span
        >{{ $t("app.telephoneLabel") }}
      </label>
      <div>
        <label class="value">
          {{ getCurrentMemberSaving.telephone }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <label for="amount" class="label"
        ><span>
          <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
        >{{ $t("app.amountDeposited") }}
      </label>
      <div>
        <label class="value">
          {{ Number(getCurrentMemberSaving.amount_deposited).toLocaleString() }}
          XAF
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <label for="amount" class="label"
        ><span>
          <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
        >{{ $t("app.amountUsed") }}
      </label>
      <div>
        <label class="value">
          {{ Number(getCurrentMemberSaving.amount_used).toLocaleString() }}
          XAF
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="status" class="label"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.transactionStatus") }}
        </label>
      </div>
      <div>
        <label
          class="value text-info"
          v-show="getCurrentMemberSaving.approve == 'PENDING'"
        >
          {{ getCurrentMemberSaving.approve }}
        </label>
        <label
          class="value text-secondary"
          v-show="getCurrentMemberSaving.approve == 'APPROVED'"
        >
          {{ getCurrentMemberSaving.approve }}
        </label>
        <label
          class="value text-warning"
          v-show="getCurrentMemberSaving.approve == 'DECLINED'"
        >
          {{ getCurrentMemberSaving.approve }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-mb-md">
      <div>
        <label for="amount" class="label"
          ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.createdDate") }}
        </label>
      </div>
      <div>
        <label class="value">
          {{ getFormatSavingCreatedDate }}
        </label>
      </div>
    </div>

    <div class="flex justify-between q-mb-md">
      <div>
        <label for="amount" class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.createdBy") }}
        </label>
      </div>
      <div>
        <label class="value">
          {{ getCurrentMemberSaving.updated_by }}
        </label>
      </div>
    </div>
    <div class="row q-mb-xs">
      <label for="comment" class="label"
        ><span> <q-icon name="description" size="xs" class="q-pr-sm" /> </span
        >{{ $t("app.comment") }}</label
      >
    </div>
    <div
      class="value detail-value q-ml-lg"
      v-show="getCurrentMemberSaving.comment !== null"
    >
      {{ getCurrentMemberSaving.comment }}
    </div>
  </div>
</template>
<script>
import moment from "moment";

export default {
  created() {
    let heading = this.$t("app.viewSavingHeading");
    this.$emit("set-heading", heading);
  },

  data() {
    return {};
  },

  computed: {
    getEditState() {
      return this.$store.getters.getEditState;
    },

    getFormatSavingCreatedDate() {
      return moment(
        this.$store.getters.getCurrentMemberSaving.created_at
      ).format("MMMM Do YYYY");
    },

    getCurrentMemberSaving() {
      return this.$store.getters.getCurrentMemberSaving;
    },
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.label {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 0.8rem;
  color: $grey5;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
  color: $grey8;
}
.detail-value {
  max-width: 250px;
}
</style>
