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
        {{ $t("app.updateExpenditureItemCaption") }}</span
      >
      <span class="text-lowercase registration_text">{{
        getCurrentExpenditureItem.approve
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
          v-model="expenditureItemData.payment_item.name"
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
          v-model="expenditureItemData.name"
          outlined
          dense
          type="text"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.date") }}</label
        >
        <q-input
          v-model="expenditureItemData.date"
          outlined
          dense
          readonly
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="expenditureItemData.date">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.venue") }}</label
        >
        <q-input
          v-model="expenditureItemData.venue"
          outlined
          dense
          type="text"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.oldEstimatedAmount") }}</label
        >
        <q-input
          v-model="expenditureItemData.amount"
          outlined
          dense
          type="number"
          readonly
          hide-bottom-space
        />
      </div>
      <div class="q-mb-md">
        <label class="form_field"
        >{{ $t("app.newEstimatedAmount") }}<span class="text-red q-ml-xs">*</span></label
        >
        <q-input
          v-model="expenditure_item_transaction.new_amount_deposited"
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
          v-model="expenditure_item_transaction.reason"
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
  import expenditureItemMixin from "src/mixins/expenditureItemMixin";

  export default {
    name: "ChangeExpenditureItemTransaction",
    mixins: [expenditureItemMixin],
    props: {
      expenditureItemData: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      console.log(this.expenditureItemData)
      this.$emit("set-heading", this.$t("app.updateExpenditureItemTitleComponent"));
    },

    data() {
      return {
        loading: false,
        expenditure_item_transaction: {
          reason: null,
          old_amount_deposited: this.expenditureItemData.amount,
          reference_data: this.expenditureItemData.id,
          organisation_id: this.organisation_id,
          approve: this.expenditureItemData.approve,
          new_amount_deposited: 0,
          transaction_data_group: TransactionDataGroup.EXPENDITURE_ITEMS
        },
        position: "right",
        organisation_id: this.$store.getters.getOrganisation.id,
        show_banner:true,
      };
    },
    computed: {
      validateForm() {
        return (
          this.expenditure_item_transaction.new_amount_deposited === 0 ||
          this.expenditure_item_transaction.reason == null ||
          this.expenditure_item_transaction.reason.length < 30 ||
          this.expenditure_item_transaction.approve == null
        );
      },

      getCurrentExpenditureItem() {
        return this.expenditureItemData;
      },
    },

    methods: {
      onUpdateIncomeActivityHistory() {
        let payload = {
          url: `/api/protected/transactions/update-history`,
          data: this.expenditure_item_transaction,
          msg: this.$t("app.addExpenditureItemSuccessMsg"),
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
          this.fetchExpenditureItems( 1, 10, "", "", this.expenditureItemData.payment_item.id, "");
        }).finally(() => {
          this.$emit("close-right-drawer");
          this.loading = false;
          this.resetForm();
        })

      },

      resetForm() {
        this.expenditure_item_transaction.new_amount_deposited = 0;
        this.expenditure_item_transaction.approve = this.expenditureItemData.approve;
        this.expenditure_item_transaction.reason = null;
        this.expenditure_item_transaction.reference_data = this.expenditureItemData.id

        return this.expenditure_item_transaction;
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
