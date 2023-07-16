<template>
  <div class="q-pa-md">
    <div>
      <div class="flex q-pb-md">
        <label for="name" class="label"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.paymentItem')}}:
          <span class="value value_item">{{
            getSelectedSponsorship.payment_item.name
          }}</span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.sponsorNameLabel')}}:
          <span class="value value_name">{{
            getSelectedSponsorship.supporter
          }}</span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">
          <span>
            <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.amount')}}:
          <span class="value value_amount"
            >{{
              Number(getSelectedSponsorship.amount_deposited).toLocaleString()
            }}
            XAF</span
          ></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"
          ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.paymentDate')}}:
          <span class="value value_date">{{
            getFormatedCreatedDate
          }}</span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label
          for="status"
          class="label"
          v-show="getSelectedSponsorship.approve == 'DECLINED'"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.transactionStatus')}}:
          <span class="value_trxn unapproved_color">{{
            getSelectedSponsorship.approve
          }}</span></label
        >
        <label
          for="status"
          class="label"
          v-show="getSelectedSponsorship.approve == 'APPROVED'"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.transactionStatus')}}:
          <span class="value_trxn approved_color">
            {{ getSelectedSponsorship.approve }}</span
          ></label
        >
        <label
          for="status"
          class="label"
          v-show="getSelectedSponsorship.approve == 'PENDING'"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.transactionStatus')}}:
          <span class="value_trxn pending_color">
            {{ getSelectedSponsorship.approve }}</span
          ></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"
          ><span> <q-icon name="badge" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.transactionCode')}}:
          <span class="value q-pl-md value_code">{{
            getSelectedSponsorship.code
          }}</span></label
        >
      </div>
      <div class="flex q-pb-lg">
        <label for="name" class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.createdBy')}}:
          <span class="value q-pl-md value_created_by">{{
            getSelectedSponsorship.updated_by
          }}</span></label
        >
      </div>
      <div class="flex q-pb-xs">
        <label for="name" class="label"
          ><span> <q-icon name="description" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.comment')}}:
        </label>
      </div>
      <p class="value_comment">
        {{ getSelectedSponsorship.comment }}
      </p>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import SponsorshipMixin from "src/mixins/SponsorshipMixin.vue";

export default {
  mixins: [SponsorshipMixin],
  mounted() {
    let heading = this.$t('app.sponsorshipHeading');
    this.$emit("set-heading", heading);
  },

  data() {
    return {
      show_edit_form: false,
      loading: false,
      sponsorship: {
        supporter: null,
        payment_item_id: null,
        amount_deposited: 0,
        comment: null,
        id: null,
      },
      no_caps: true,
    };
  },
  computed: {
    validateForm() {
      return this.sponsorship.supporter === null ||
        this.sponsorship.amount_deposited == 0 ||
        this.sponsorship.payment_item_id == null
        ? true
        : false;
    },
    getFormatedCreatedDate() {
      return moment(this.getSelectedSponsorship.created_at).format(
        "MMMM Do YYYY"
      );
    },

    getSelectedSponsorship() {
      const id = this.$store.getters.getSelectedSponsorship.id;
      return this.$store.getters.getSponsorships.filter(
        (ele) => ele.id == id
      )[0];
    },
  },
  methods: {
  },

  components: {
  },
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

.label {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $grey5;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
  color: $dark;
}

.value_comment {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 27px;
  text-align: start;
  letter-spacing: 0.005em;
  color: $dark;
  // padding-left: 1.5rem;
}

.value_name {
  padding-left: 2.5rem;
}

.value_item {
  padding-left: 2.3rem;
}

.value_amount {
  padding-left: 5.7rem;
}

.value_date {
  padding-left: 3.5rem;
}

.value_trxn {
  padding-left: 1.5rem;
}

.value_code {
  padding-left: 2.1rem;
}

.value_created_by {
  padding-left: 4.5rem;
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

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.instruction_info {
  color: $grey2;
}
</style>
