<template>
  <div class="q-pa-md">
    <div class="q-px-md">
      <div class="flex q-pb-md">
        <label for="name" class="label"><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span>{{$t('app.paymentItem')}}:
          <span class="value value_item">{{ getSelectedContribution.payment_item_name }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"><span> <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span>{{$t('app.totalAmountPayable')}}:
          <span class="value value_amount">{{ Number(getSelectedContribution.payment_item_amount).toLocaleString() }}
            XAF</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"><span> <q-icon name="check" size="xs" class="q-pr-sm" /> </span>{{$t('app.compulsory')}}:
          <span class="value value_complusory" v-if="getSelectedContribution.payment_item_complusory">{{$t('app.yes')}}</span>
          <span class="value value_complusory" v-if="!getSelectedContribution.payment_item_complusory">{{$t('app.no')}}</span></label>

      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"><span> <q-icon name="person" size="xs" class="q-pr-sm"/> </span>{{$t('app.membersName')}}:
          <span class="value value_name">{{ getSelectedContribution.user_name }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"> <span> <q-icon name="monetization_on" size="xs" class="q-pr-sm"/> </span>{{$t('app.amount')}}:
          <span class="value value_amount_paid">{{ Number(getSelectedContribution.amount_deposited).toLocaleString() }}
            XAF</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"><span> <q-icon name="monetization_on" size="xs" class="q-pr-sm"/> </span>{{$t('app.totalAmountPaid')}}:
          <span class="value value_amount_total">{{ Number(computeTotalAmountContributed).toLocaleString() }}
            XAF</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"> <span> <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span>{{$t('app.balance')}}: <span
            class="value value_balance">{{ Number(getSelectedContribution.balance).toLocaleString() }} XAF</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"><span> <q-icon name="schedule" size="xs" class="q-pr-sm"/> </span>{{$t('app.paymentDate')}}:
          <span class="value value_date">{{ getFormatedCreatedDate }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="status" class="label" v-show="getSelectedContribution.approve == 'DECLINED'"><span> <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span>{{$t('app.transactionStatus')}}:
          <span class=" value_trxn unapproved_color">{{getSelectedContribution.approve}}</span></label>
        <label for="status" class="label" v-show="getSelectedContribution.approve == 'APPROVED'"><span> <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span>{{$t('app.transactionStatus')}}:
          <span class=" value_trxn approved_color"> {{getSelectedContribution.approve}}</span></label>
          <label for="status" class="label" v-show="getSelectedContribution.approve == 'PENDING'"><span> <q-icon name="check_circle" size="xs" class="q-pr-sm"/> </span>{{$t('app.transactionStatus')}}:
          <span class=" value_trxn pending_color"> {{getSelectedContribution.approve}}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label" v-show="getSelectedContribution.status == 'INCOMPLETE'"><span> <q-icon name="check_circle" size="xs" class="q-pr-sm"/> </span>{{$t('app.paymentStatus')}}:
          <span class="unapproved_color q-pl-md value_status">{{ getSelectedContribution.status }}</span></label>

        <label for="name" class="label" v-show="getSelectedContribution.status == 'COMPLETE'"><span> <q-icon name="check_circle" size="xs" class="q-pr-sm"/> </span>{{$t('app.paymentStatus')}}:
          <span class="value text-secondary q-pl-md value_status">{{ getSelectedContribution.status }}</span></label>
      </div>
      <div class="flex q-pb-lg">
        <label for="name" class="label"><span> <q-icon name="badge" size="xs" class="q-pr-sm"/> </span>{{$t('app.transactionCode')}}:
          <span class="value  q-pl-md value_code">{{ getSelectedContribution.code }}</span></label>
      </div>
      <div class="flex q-pb-lg">
        <label for="name" class="label"><span> <q-icon name="person" size="xs" class="q-pr-sm"/> </span>{{$t('app.createdBy')}}:
          <span class="value  q-pl-md value_created_by">{{ getSelectedContribution.updated_by }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"><span> <q-icon name="description" size="xs" class="q-pr-sm"/> </span>{{$t('app.comment')}}: </label>
      </div>
      <p class="value_comment">
          {{ getSelectedContribution.comment }}
        </p>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import organisationMixin from "src/mixins/organisationMixin.vue";
import memberMixin from "src/mixins/memberMixin.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";


export default {
  mixins:[organisationMixin, memberMixin, HelperMixin],
  mounted() {
    let heading = this.$t('app.viewContributionInformation');
    this.$emit("set-heading", heading);
  },

  data() {
    return {
      show_image: false,
      position: "right",
      contribution: {
        amount_deposited: 0,
        id: null,
        approve: false,
        balance: 0,
        payment_item_amount: 0,
        payment_item_id: null,
        payment_item_complusory: "",
        payment_item_name: null,
        comment: null,
        code: null,
        type: "",
        created_at: null,
        updated_by: null,
        status: null,
        user_id: null,
        user_name: null,
        user_telephone: null,
      },
    };
  },
  computed: {
    getFormatedCreatedDate() {
      return moment(this.$store.getters.getSelectedContribution.created_at).format(
        "MMMM Do YYYY"
      );
    },

    getSelectedContribution() {
      return this.$store.getters.getSelectedContribution;
    },

    computeTotalAmountContributed() {
      return this.computeTotal(this.$store.getters.getMemberContributions);
    }
  },
  methods: {
    editContribution(data) {
      let payload = {
        data: data,
        current_tab: "Edit Member Contribution",
        right: true,
      };

      let id = this.getOrganisationId;

      if(this.$store.getters.getMembers.length == 0) {
        this.getOrganisationMembers(id, false);
      }

      this.$emit("edit-contribution", payload);
    }

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
}

.image {
  height: 100px;
  width: 100px;
}

.image_card {
  width: 100%;
  max-width: 150px;
  cursor: pointer;
}

.card {
  width: 100%;
}

.value_name {
  padding-left: 3.9rem;
}

.value_item {
  padding-left: 4.5rem;
}

.value_amount {
  padding-left: 1.5rem;
}

.value_date {
  padding-left: 4.9rem;
}

.value_trxn {
  padding-left: 3.1rem;
}

.value_status {
  padding-left: 4.4rem;
}

.value_code {
  padding-left: 4rem;
}

.value_amount_paid {
  padding-left: 7.2rem;
}

.value_amount_total {
  padding-left: 3rem;
}

.value_balance {
  padding-left: 4.8rem;
}


.value_complusory {
  padding-left: 5.5rem;
}

.value_created_by {
  padding-left: 6.5rem;
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
</style>
