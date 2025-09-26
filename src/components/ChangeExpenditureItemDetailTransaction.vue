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
        {{ $t("app.updateExpenditureItemDetailCaption") }}</span
      >
      <span class="text-lowercase registration_text">{{
        getCurrentExpenditureItemDetail.approve
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
        >{{ $t("app.nameLabel") }}</label
        >
        <q-input
          v-model="expenditureItemDetailData.name"
          outlined
          dense
          type="text"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.oldAmountGiven") }}</label
        >
        <q-input
          v-model="expenditureItemDetailData.amount_given"
          outlined
          dense
          type="number"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.oldAmountSpent") }}</label
        >
        <q-input
          v-model="expenditureItemDetailData.amount_spent"
          outlined
          dense
          type="number"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.newAmountGiven") }}<span class="text-red q-ml-xs">*</span></label
        >
        <q-input
          v-model="expenditure_item_detail_transaction.new_amount_given"
          outlined
          dense
          type="number"
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.newAmountSpent") }}<span class="text-red q-ml-xs">*</span></label
        >
        <q-input
          v-model="expenditure_item_detail_transaction.new_amount_spent"
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
          v-model="expenditure_item_detail_transaction.reason"
          outlined
          dense
          autogrow
          :placeholder="$t('app.reasonCaption')"
          hide-bottom-space
        />
        <small class="text-muted info">{{$t('app.reasonLengthWarning')}}</small>
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
  import ExpenditureItemDetailMixin from "src/mixins/ExpenditureItemDetailMixin";

  export default {
    name: "ChangeExpenditureItemTransaction",
    mixins: [ExpenditureItemDetailMixin],
    props: {
      expenditureItemDetailData: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      this.$emit("set-heading", this.$t("app.updateExpenditureItemDetailTitleComponent"));
    },

    data() {
      return {
        loading: false,
        expenditure_item_detail_transaction: {
          reason: null,
          old_amount_deposited: this.expenditureItemDetailData.amount,
          reference_data: this.expenditureItemDetailData.id,
          organisation_id: this.$store.getters.getOrganisation.id,
          approve: this.expenditureItemDetailData.approve,
          new_amount_deposited: 0,
          transaction_data_group: TransactionDataGroup.EXPENDITURE_ITEM_DETAILS,
          new_amount_spent: 0,
          new_amount_given: 0
        },
        position: "right",
        organisation_id: this.$store.getters.getOrganisation.id,
        show_banner:true,
      };
    },
    computed: {
      validateForm() {
        return (
          this.expenditure_item_detail_transaction.new_amount_spent === 0 ||
          this.expenditure_item_detail_transaction.new_amount_given === 0 ||
          this.expenditure_item_detail_transaction.reason == null ||
          this.expenditure_item_detail_transaction.reason.length < 20 ||
          this.expenditure_item_detail_transaction.approve == null
        );
      },

      getCurrentExpenditureItemDetail() {
        return this.expenditureItemDetailData;
      },
    },

    methods: {
      onUpdateExpenditureItemDetailTransaction() {
        let payload = {
          url: `/api/protected/transactions/update-history`,
          data: {
            reason: this.expenditure_item_detail_transaction.reason,
            old_amount_deposited: this.expenditureItemDetailData.amount_given + "/" + this.expenditureItemDetailData.amount_spent,
            reference_data: this.expenditureItemDetailData.id,
            organisation_id: this.$store.getters.getOrganisation.id,
            approve: this.expenditureItemDetailData.approve,
            new_amount_deposited: this.expenditure_item_detail_transaction.new_amount_given + "/" + this.expenditure_item_detail_transaction.new_amount_spent,
            transaction_data_group: TransactionDataGroup.EXPENDITURE_ITEM_DETAILS,
          },
          msg: this.$t("app.saveDetailSuccessMsg"),
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
          this.getExpenditureDetailsByItemId( this.expenditureItemDetailData.expenditure_item_id, 1, 10);
        }).finally(() => {
          this.$emit("close-right-drawer");
          this.loading = false;
          this.resetForm();
        })

      },

      resetForm() {
        this.expenditure_item_detail_transaction.new_amount_deposited = 0;
        this.expenditure_item_detail_transaction.approve = this.expenditureItemDetailData.approve;
        this.expenditure_item_detail_transaction.reason = null;
        this.expenditure_item_detail_transaction.reference_data = this.expenditureItemDetailData.id

        return this.expenditure_item_detail_transaction;
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
