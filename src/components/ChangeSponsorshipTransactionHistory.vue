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
        {{ $t("app.updateSponsorshipCaption") }}</span
      >
      <span class="text-lowercase registration_text">{{
        getCurrentSponsorship.approve
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
    <q-form @submit="onUpdateIncomeActivityHistory" class="q-gutter-md">
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.paymentItem") }}</label
        >
        <q-input
          v-model="getCurrentSponsorship.payment_item.name"
          outlined
          dense
          type="text"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.nameLabel") }}</label
        >
        <q-input
          v-model="getCurrentSponsorship.supporter"
          outlined
          dense
          type="text"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.oldAmount") }}</label
        >
        <q-input
          v-model="getOldAmountDeposited"
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
          v-model="sponsorship_history.new_amount_deposited"
          outlined
          dense
          type="number"
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field">{{
          $t("app.reason")
          }}<span class="text-red q-ml-xs">*</span></label>
        <q-input
          v-model="sponsorship_history.reason"
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
    import SponsorshipMixin from "src/mixins/SponsorshipMixin";
    import TransactionStatus from "components/Constants/TransactionStatus";
    import TransactionDataGroup from "components/Constants/TransactionDataGroup";
    import ButtonVue from "components/Button";

    export default {
      name: "ChangeSponsorshipTransactionHistory",
      mixins: [SponsorshipMixin],
      props: {
        sponsorship: {
          type: Object,
          required: true,
        },
      },
      mounted() {
        this.$emit("set-heading", this.$t("app.updateSponsorshipTitleComponent"));
      },

      data() {
        return {
          loading: false,
          payment_statuses: [TransactionStatus.PENDING, TransactionStatus.APPROVED, TransactionStatus.DECLINED],
          sponsorship_history: {
            reason: null,
            old_amount_deposited: parseInt(this.sponsorship.amount_deposited),
            reference_data: this.sponsorship.id,
            organisation_id: null,
            approve: this.sponsorship.approve,
            new_amount_deposited: 0,
            transaction_data_group:TransactionDataGroup.SPONSORSHIP
          },
          position: "right",
          organisation_id: this.$store.getters.getOrganisation.id,
          show_banner:true,
        };
      },
      computed: {
        validateForm() {
          return (
            this.sponsorship_history.new_amount_deposited === 0 ||
            this.sponsorship_history.reason == null ||
            this.sponsorship_history.reason.length < 30 ||
            this.sponsorship_history.approve == null
          );
        },

        getCurrentSponsorship() {
          return this.sponsorship;
        },
        getOldAmountDeposited() {
          return parseInt(this.sponsorship.amount_deposited);
        }
      },

      methods: {
        onUpdateIncomeActivityHistory() {
          let payload = {
            url: `/api/protected/transactions/update-history`,
            data: this.sponsorship_history,
            msg: this.$t("app.addSponsorshipSuccessMsg"),
            color: "default",
            to_on_ok: "none",
            to_on_fail: "none",
            show_feedback: true,
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
            let payment_item_id = this.sponsorship.payment_item.id;
            this.getAllSponsorships( 1, 10, payment_item_id, "");
          }).finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
            this.resetForm();
          })

        },

        resetForm() {
          this.sponsorship_history.new_amount_deposited = 0;
          this.sponsorship_history.approve = this.incomeActivity.approve;
          this.sponsorship_history.reason = null;
          this.sponsorship_history.reference_data = this.incomeActivity.id

          return this.sponsorship_history;
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
