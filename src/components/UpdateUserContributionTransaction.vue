<template>
  <div
    class="q-mb-md"
    :class="$q.platform.is.mobile ? 'q-ml-lg q-mr-md' : 'q-mx-md'"
  >
    <q-banner
      inline-actions
      rounded
      class="bg-info text-white q-mt-sm"
      dense
      v-if="show_banner"
    >
      <span class="registration_text">
        {{ $t("app.updateUserContributionCaption") }}</span
      >
      <span class="text-lowercase registration_text">{{
        getCurrentUserContribution.approve
      }}</span>
      <template v-slot:action>
        <q-btn flat icon="close" size="sm" @click="closeBanner()" />
      </template>
    </q-banner>

    <div class="text-left q-mt-md q-mb-lg">
      <label class="text-muted info"
      >{{ $t("app.warningField") }}<span class="text-red">*</span>
        {{ $t("app.fields") }}</label
      >
    </div>
    <q-form @submit="onUpdateExpenditureItemDetailTransaction" class="q-gutter-md">
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.paymentItem") }}</label
        >
        <q-input
          v-model="userContribution.payment_item_name"
          outlined
          dense
          type="text"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.totalAmountPayable") }}</label
        >
        <q-input
          v-model="getContributionSummary.payment_item.amount"
          outlined
          dense
          type="number"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.memberName") }}</label
        >
        <q-input
          v-model="userContribution.user_name"
          outlined
          dense
          type="text"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.totalAmountDeposited") }}</label
        >
        <q-input
          v-model="getContributionSummary.total_amount"
          outlined
          dense
          type="number"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.totalBalance") }}</label
        >
        <q-input
          v-model="computeTotalBalanceAfterUpdate"
          outlined
          dense
          type="number"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.oldAmount") }}</label
        >
        <q-input
          v-model="userContribution.amount_deposited"
          outlined
          dense
          type="number"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.newAmount") }}<span class="text-red q-ml-xs">*</span></label
        >
        <q-input
          v-model="contribution_transaction.new_amount_deposited"
          outlined
          dense
          type="number"
          hide-bottom-space
        />
        <label v-if="computeTotalBalanceAfterUpdate < 0" class="text-red">
          <b>{{ $t("app.excessAmountLabel") }}</b>
        </label>
      </div>
      <div class="q-mb-md">
        <label class="form_field">{{
          $t("app.reason")
          }}<span class="text-red q-ml-xs">*</span></label>
        <q-input
          v-model="contribution_transaction.reason"
          outlined
          dense
          autogrow
          :placeholder="$t('app.reasonCaption')"
          hide-bottom-space
        />
      </div>
      <div
        :class="$q.platform.is.desktop ? 'flex q-mt-md justify-end' : 'q-mb-xl'"
        v-if="$q.platform.is.desktop"
      >
        <q-btn
          class="form_button q-mr-lg"
          :label="$t('app.reset')"
          :color="'primary'"
          no-caps
          outline
          @click="resetForm"
        >
        </q-btn>
        <ButtonVue
          class="form_button"
          :label="$t('app.saveBtnLabel')"
          :loading="loading"
          color="primary"
          :disabled="validateForm"
          :no_caps="true"
        >
        </ButtonVue>
      </div>
      <div class="q-gutter-y-lg q-mb-lg" v-if="$q.platform.is.mobile">
        <ButtonVue
          class="full-width q-mt-lg"
          :label="$t('app.saveBtnLabel')"
          :loading="loading"
          color="primary"
          :disabled="validateForm"
          :no_caps="true"
        >
        </ButtonVue>
        <q-btn
          class="full-width"
          :label="$t('app.reset')"
          :color="'primary'"
          no-caps
          outline
          @click="resetForm"
        >
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
  import TransactionDataGroup from "components/Constants/TransactionDataGroup";
  import ButtonVue from "components/Button";
  import ContributionsMixin from "src/mixins/ContributionsMixin";
  import {Notify, Platform} from "quasar";

  export default {
    name: "ChangeExpenditureItemTransaction",
    mixins: [ContributionsMixin],
    props: {
      userContribution: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      this.$emit("set-heading", this.$t("app.updateUserContributionTitleComponent"));
    },

    data() {
      return {
        loading: false,
        contribution_transaction: {
          reason: null,
          old_amount_deposited: this.userContribution.amount_deposited,
          reference_data: this.userContribution.id,
          organisation_id: this.$store.getters.getOrganisation.id,
          approve: this.userContribution.approve,
          new_amount_deposited: 0,
          transaction_data_group: TransactionDataGroup.USER_CONTRIBUTIONS,
          new_balance: 0,
          initial_total_balance: this.$store.getters.getMemberContributions.total_balance
        },
        position: "right",
        organisation_id: this.$store.getters.getOrganisation.id,
        show_banner:true,
      };
    },
    computed: {
      validateForm() {
        return (
          this.contribution_transaction.old_amount_deposited === 0 ||
          this.contribution_transaction.new_amount_deposited === 0 ||
          this.contribution_transaction.reason == null ||
          this.contribution_transaction.reason.length < 30 ||
          this.contribution_transaction.approve == null
        );
      },

      getCurrentUserContribution() {
        return this.userContribution;
      },

      getContributionSummary(){
        return this.$store.getters.getMemberContributions;
      },
      computeTotalBalanceAfterUpdate(){
        let total_amount_contributed = this.$store.getters.getMemberContributions.total_amount;
        let offset_balance = total_amount_contributed - parseInt(this.contribution_transaction.new_amount_deposited);

        let total_balance = this.$store.getters.getMemberContributions.total_balance;
        if(parseInt(this.contribution_transaction.new_amount_deposited) > 0){
          total_balance = this.$store.getters.getMemberContributions.total_balance + offset_balance;
        }

        return total_balance;
      }
    },

    methods: {
      onUpdateExpenditureItemDetailTransaction() {
        let payload = {
          url: `/api/protected/transactions/update-history`,
          data: {
            reason: this.contribution_transaction.reason,
            old_amount_deposited: this.userContribution.amount_deposited,
            reference_data: this.userContribution.id,
            organisation_id: this.$store.getters.getOrganisation.id,
            approve: this.userContribution.approve,
            new_amount_deposited: this.contribution_transaction.new_amount_deposited,
            transaction_data_group: TransactionDataGroup.USER_CONTRIBUTIONS,
          },
          msg: this.$t("app.saveDetailSuccessMsg"),
          color: "default",
          to_on_ok: "none",
          to_on_fail: "none",
          show_feedback: false,
          error_msg: this.$t("app.defaultErrorMsg"),
          has_commit: false,
          commit: "none",
          to_be_store_data: {
            required: false,
            has_value: false,
            data: [],
          },
        };
        this.loading = true;
        this.$store.dispatch("postRequest", payload).then((res) => {
         if(res.data.status === 400){
           Notify.create({
             color: "info",
             message: res.data.message,
             type: "info",
             position: Platform.is.mobile ? "bottom" : "top-right",
           });
         }
          this.getMemberContributionsByPaymentItem(this.userContribution.payment_item_id, this.userContribution.user_id, "ALL", "ALL");
        }).finally(() => {
          this.$emit("close-right-drawer");
          this.loading = false;
          this.resetForm();
        })

      },

      resetForm() {
        this.contribution_transaction.new_amount_deposited = 0;
        this.contribution_transaction.approve = this.userContribution.approve;
        this.contribution_transaction.reason = null;
        this.contribution_transaction.reference_data = this.userContribution.id

        return this.contribution_transaction;
      },
      closeBanner(){
        return this.show_banner = !this.show_banner;
      }
    },
    components: {
      ButtonVue,
    },
  }
</script>

<style scoped lang="scss">
  .form_field {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 500;
    font-size: 0.8rem;
    align-items: center;
    color: $grey5;
  }

  .info {
    color: $grey2;
    font-size: smaller;
  }

  .registration_text {
    font-size: 0.8rem;
  }
</style>
