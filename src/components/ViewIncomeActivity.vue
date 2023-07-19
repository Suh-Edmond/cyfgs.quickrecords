<template>
  <div class="q-pa-md">
    <div>
      <div class="flex q-pb-md">
        <label for="name" class="field"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.nameLabel')}}:
          <span class="field_value field_name">{{
            getCurrentIncomeActivity.name
          }}</span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="field"
          ><span>
            <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.amount')}}:
          <span class="field_value field_amount"
            >{{
              Number(getCurrentIncomeActivity.amount).toLocaleString()
            }}
            XAF</span
          ></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="field"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.paymentItem')}}:
          <span
            class="field_value field_item"
            v-if="getCurrentIncomeActivity.payment_item != null"
            >{{ getCurrentIncomeActivity.payment_item.name }}</span
          >
          <span
            class="field_value field_item"
            v-if="getCurrentIncomeActivity.payment_item == null"
            >{{$t('app.none')}}</span
          >
        </label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="field"
          ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.date')}}:
          <span class="field_value field_date">{{
            getFormatIncomeDate
          }}</span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="field"
          ><span> <q-icon name="location_on" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.venue')}}:
          <span class="field_value field_venue">{{
            getCurrentIncomeActivity.venue
          }}</span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label
          for="status"
          class="field"
          v-show="getCurrentIncomeActivity.approve == 'DECLINED'"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.status')}}:
          <span class="item_statue unapproved_color">{{
            getCurrentIncomeActivity.approve
          }}</span></label
        >
        <label
          for="status"
          class="field"
          v-show="getCurrentIncomeActivity.approve == 'APPROVED'"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.status')}}:
          <span class="item_statue approved_color">
            {{ getCurrentIncomeActivity.approve }}</span
          ></label
        >
        <label
          for="status"
          class="field"
          v-show="getCurrentIncomeActivity.approve == 'PENDING'"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.status')}}:
          <span class="item_statue pending_color">
            {{ getCurrentIncomeActivity.approve }}</span
          ></label
        >
      </div>

      <div class="q-mb-md">
        <label for="amount" class="field"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.createdBy')}}:
          <span class="field_value detail_created_by">
            {{ getCurrentIncomeActivity.updated_by }}
          </span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="field"
          ><span> <q-icon name="description" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.comment')}}: <span class="field_value description" v-if="getCurrentIncomeActivity.description == null">

      </span>
        </label>
      </div>
      <p class="field_value" v-if="getCurrentIncomeActivity.description != null">
        {{ getCurrentIncomeActivity.description }}
      </p>

    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  created() {
    let heading = this.$t('app.addIncomeActivityHeading');
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
.unapproved_color {
  color: #f2994a;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
}

.approved_color {
  color: #27ae60;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
}
.pending_color {
  color: $info;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
}
.field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $grey5;
}

.field_venue {
  padding-left: 6rem;
}

.item_statue {
  padding-left: 6rem;
}

.field_value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
  color: $dark;
}
.field_name {
  padding-left: 6rem;
}

.field_amount {
  padding-left: 5.2rem;
}

.field_item {
  padding-left: 2.9rem;
}

.field_date {
  padding-left: 6.5rem;
}

.detail_created_by {
  padding-left: 4.2rem;
}

.description {
  padding-left: 4.6rem;
}
</style>
