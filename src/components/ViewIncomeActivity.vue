<template>
  <div class="q-pa-md">
    <div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.nameLabel") }}
          </label>
        </div>
        <div>
          <label class="value detail-value wrap">
            {{ getCurrentIncomeActivity.name }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.amount") }}
          </label>
        </div>
        <div>
          <label class="value">
            {{ Number(getCurrentIncomeActivity.amount).toLocaleString() }}
            XAF
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.paymentItem") }}
          </label>
        </div>
        <div>
          <label class="value">
            {{ getCurrentIncomeActivity.payment_item.name }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.date") }}
          </label>
        </div>

        <div>
          <label class="value">
            {{ getFormatIncomeDate }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span>
              <q-icon name="location_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.venue") }}
          </label>
        </div>
        <div>
          <label class="value">
            {{ getCurrentIncomeActivity.venue }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="status" class="label">
            <span>
              <q-icon name="check_circle" size="xs" class="q-pr-sm" />
            </span>
            {{ $t("app.status") }}
          </label>
        </div>

        <div>
          <label
            class="value text-warning"
            v-show="getCurrentIncomeActivity.approve == 'DECLINED'"
          >
            {{ getCurrentIncomeActivity.approve }}
          </label>
          <label
            class="value text-secondary"
            v-show="getCurrentIncomeActivity.approve == 'APPROVED'"
          >
            {{ getCurrentIncomeActivity.approve }}
          </label>
          <label
            class="value text-info"
            v-show="getCurrentIncomeActivity.approve == 'PENDING'"
          >
            {{ getCurrentIncomeActivity.approve }}
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
            {{ getFormatIncomeCreatedDate }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <label for="amount" class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.createdBy") }}
        </label>
        <div>
          <label class="value">
            {{ getCurrentIncomeActivity.updated_by }}
          </label>
        </div>
      </div>
      <div class="row justify-between q-pb-md">
        <label for="name" class="label"
          ><span> <q-icon name="description" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.comment") }}
        </label>
        <label class="value detail-value wrap">
          {{ getCurrentIncomeActivity.comment }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  created() {
    let heading = this.$t("app.addIncomeActivityHeading");
    this.$emit("set-heading", heading);
  },
  data() {
    return {};
  },

  computed: {
    getEditState() {
      return this.$store.getters.getEditState;
    },

    getFormatIncomeCreatedDate() {
      return moment(
        this.$store.getters.getCurrentIncomeActivity.created_at
      ).format("MMMM Do YYYY");
    },

    getFormatIncomeDate() {
      return moment(this.$store.getters.getCurrentIncomeActivity.date).format(
        "MMMM Do YYYY"
      );
    },

    getCurrentIncomeActivity() {
      return this.$store.getters.getCurrentIncomeActivity;
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
  font-size: 0.7rem;
  color: $grey5;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.7rem;
  color: $grey8;
}
.detail-value {
  max-width: 250px;
}
.value_comment {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.01em;
  color: $dark;
  margin-left: 1.8rem;
}
</style>
