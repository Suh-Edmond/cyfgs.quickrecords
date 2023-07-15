<template>
  <div class="q-pa-md">
    <div>
      <div class="q-mb-md">
        <label for="expenditure_item" class="field"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.nameLabel')}}:
          <span class="field_value detail_name">{{
            getUpdatedExpenditureItemDetailFromState.name
          }}</span></label
        >
      </div>
      <div class="q-mb-md">
        <label for="venue" class="field"
          ><span> <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.amountGivenLabel')}}:
          <span class="field_value detail_amount"
            >{{
              Number(
                getUpdatedExpenditureItemDetailFromState.amount_given
              ).toLocaleString()
            }}
            XAF</span
          ></label
        >
      </div>
      <div class="q-mb-md">
        <label for="date" class="field"
          ><span> <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.amountSpent')}}:
          <span class="field_value detail_amount"
            >{{
              Number(
                getUpdatedExpenditureItemDetailFromState.amount_spent
              ).toLocaleString()
            }}
            XAF</span
          ></label
        >
      </div>
      <div class="q-mb-md">
        <label for="amount" class="field"
          ><span> <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.balance')}}:
          <span class="field_value item_bal">
            {{
              Number(
                getUpdatedExpenditureItemDetailFromState.balance
              ).toLocaleString()
            }}
            XAF</span
          ></label
        >
      </div>
      <div class="q-mb-md">
        <label
          for="status"
          class="field"
          v-show="getUpdatedExpenditureItemDetailFromState.approve == 'DECLINED'"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.transactionStatus')}}:
          <span class="value_trxn unapproved_color field_value">{{
            getUpdatedExpenditureItemDetailFromState.approve
          }}</span></label
        >
        <label
          for="status"
          class="field"
          v-show="getUpdatedExpenditureItemDetailFromState.approve == 'APPROVED'"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.transactionStatus')}}:
          <span class="value_trxn approved_color field_value">
            {{ getUpdatedExpenditureItemDetailFromState.approve }}</span
          ></label
        >
        <label
          for="status"
          class="field"
          v-show="getUpdatedExpenditureItemDetailFromState.approve == 'PENDING'"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.transactionStatus')}}:
          <span class="value_trxn pending_color field_value">
            {{ getUpdatedExpenditureItemDetailFromState.approve }}</span
          ></label
        >
      </div>

      <div class="q-mb-md">
        <label for="amount" class="field"
          ><span>
            <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.createdDate')}}:
          <span class="field_value detail_date">
            {{ getFormatDetailCreatedDate }}
          </span></label
        >
      </div>

      <div class="q-mb-md">
        <label for="amount" class="field"
          ><span>
            <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.createdBy')}}:
          <span class="field_value detail_created_by">
            {{ getUpdatedExpenditureItemDetailFromState.updated_by }}
          </span></label
        >
      </div>
      <div class="q-mb-md">
        <label for="comment" class="field"><span>
            <q-icon name="description" size="xs" class="q-pr-sm" /> </span
          >{{$t('app.comment')}}:</label>
        <p class="value_comment">{{ getUpdatedExpenditureItemDetailFromState.comment }}.</p>
      </div>
    </div>
  </div>
</template>
<script>
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import moment from "moment";

export default {
  mixins: [ExpenditureItemDetailMixinVue],
  mounted() {
    let heading = this.$t('app.detailHeading');
    this.$emit("set-heading", heading);
  },
  data() {
    return {
    };
  },

  computed: {
    getUpdatedExpenditureItemDetailFromState() {
      return this.$store.getters.getUpdatedExpenditureItemDetail;
    },
    getFormatDetailCreatedDate() {
      return moment(
        this.$store.getters.getUpdatedExpenditureItemDetail.created_at
      ).format("MMMM Do YYYY");
    },
  },

  methods: {
  },
  components: {
  },
};
</script>

<style scoped lang="scss">
.field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;

  letter-spacing: 0.01em;
  color: $grey5;
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

.detail_name {
  padding-left: 5.6rem;
}

.detail_amount {
  padding-left: 2.3rem;
}

.item_bal {
  padding-left: 4.8rem;
}

.detail_date {
  padding-left: 3.3rem;
}

.detail_created_by {
  padding-left: 4.2rem;
}


.unapproved_color {
  color: #f2994a;
}

.approved_color {
  color: #27ae60;
}

.value_trxn {
 padding-left: 1rem;
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

.value_comment {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 27px;
  text-align: start;
  letter-spacing: 0.005em;
  color: $dark;
  padding-left: 1.6rem;
}
</style>
