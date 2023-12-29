<template>
  <div class="q-pa-md">
    <div class="q-px-md">
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.paymentItem") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label class="value">
            {{ getSelectedContribution.payment_item_name }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.totalAmountPayable") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{
              Number(
                getSelectedContribution.payment_item_amount
              ).toLocaleString()
            }}
            XAF
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="priority_high" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.compulsoryLabel") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label
            class="value"
            v-if="getSelectedContribution.payment_item_complusory"
          >
            {{ $t("app.yes") }}
          </label>
          <label
            class="value"
            v-if="!getSelectedContribution.payment_item_complusory"
          >
            {{ $t("app.no") }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span>
              <q-icon name="trending_flat" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.frequency") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{ getSelectedContribution.payment_item_frequency}}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.membersName") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label class="value">
            {{ getSelectedContribution.user_name }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label">
            <span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.amountDeposited") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label class="value">
            {{
              Number(getSelectedContribution.amount_deposited).toLocaleString()
            }}
            XAF
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label">
            <span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.balance") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label class="value">
            {{ Number(getSelectedContribution.balance).toLocaleString() }}
            XAF
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span>
              <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.quarterLabel") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value" v-if="getSelectedContribution.payment_item_frequency == 'QUARTERLY'">
            {{ getSelectedContribution.quarterly_name }}
          </label>
          <label class="value" v-if="getSelectedContribution.payment_item_frequency == 'MONTHLY'">
            {{ getSelectedContribution.month_name }}
          </label>
          <label class="value" v-else>
            {{ getSelectedContribution.payment_item_frequency }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.paymentDate") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{ getFormatedCreatedDate }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="status" class="label"
            ><span>
              <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.transactionStatus") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label
            class="value text-info"
            v-show="getSelectedContribution.approve == 'PENDING'"
          >
            {{ getSelectedContribution.approve }}
          </label>
          <label
            class="value text-secondary"
            v-show="getSelectedContribution.approve == 'APPROVED'"
          >
            {{ getSelectedContribution.approve }}
          </label>
          <label
            class="value text-warning"
            v-show="getSelectedContribution.approve == 'DECLINED'"
          >
            {{ getSelectedContribution.approve }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span>
              <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.paymentStatus") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label
            class="value text-warning"
            v-show="getSelectedContribution.status == 'INCOMPLETE'"
          >
            {{ getSelectedContribution.status }}
          </label>
          <label
            class="value text-secondary"
            v-show="getSelectedContribution.status == 'COMPLETE'"
          >
            {{ getSelectedContribution.status }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="badge" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.transactionCode") }}:
          </label>
        </div>

        <div class="detail-value wrap">
          <label class="value">
            {{ getSelectedContribution.code }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-pb-md">
        <div>
          <label for="name" class="label"
            ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.createdBy") }}:
          </label>
        </div>
        <div class="detail-value wrap">
          <label class="value">
            {{ getSelectedContribution.updated_by }}
          </label>
        </div>
      </div>
      <div class="flex justify-start q-pb-md">
        <div>
          <label for="name" class="label"
            ><span>
              <q-icon name="description" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.comment") }}:
          </label>
        </div>
      </div>
      <div class="value_comment" v-show="getSelectedContribution.comment !== null">{{ getSelectedContribution.comment }}</div>
      <div class="value_comment" v-show="getSelectedContribution.comment === null">{{ $t('app.none') }}</div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import organisationMixin from "src/mixins/organisationMixin.vue";
import memberMixin from "src/mixins/memberMixin.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";

export default {
  mixins: [organisationMixin, memberMixin, HelperMixin],
  mounted() {
    let heading = this.$t("app.viewContributionInformation");
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
      return moment(
        this.$store.getters.getSelectedContribution.created_at
      ).format("MMMM Do YYYY");
    },

    getSelectedContribution() {
      console.log(this.$store.getters.getSelectedContribution);
      return this.$store.getters.getSelectedContribution;
    },

    computeTotalAmountContributed() {
      return this.$store.getters.getMemberContributions !== null
        ? this.$store.getters.getMemberContributions.total_contribution
        : 0;
    },
  },
  methods: {
    editContribution(data) {
      let payload = {
        data: data,
        current_tab: "Edit Member Contribution",
        right: true,
      };

      let id = this.getOrganisationId;

      if (this.$store.getters.getMembers.length == 0) {
        this.getOrganisationMembers(id, false);
      }

      this.$emit("edit-contribution", payload);
    },
  },
};
</script>

<style lang="scss" scoped>
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
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.01em;
  color: $grey8;}
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
