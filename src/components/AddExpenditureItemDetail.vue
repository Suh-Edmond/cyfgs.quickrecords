<template>
  <div>
    <q-banner
      inline-actions
      rounded
      class="bg-secondary text-white q-mx-md q-mt-sm q-mb-sm"
      dense
      v-if="existExpenditureItemDetail"
    >
      {{ $t("app.cantUpdatedExpenditureItemDetailAfterApprovalMsg") }}
      <span class="text-lowercase">{{
        getUpdatedExpenditureItemDetailFromState.approve
      }}</span>
      <template v-slot:action>
        <q-btn flat icon="close" size="sm" />
      </template>
    </q-banner>
    <div class="q-ml-sm q-mb-md">
      <label class="text-muted q-ml-sm info"
        >{{ $t("app.warningField") }}<span class="text-red">*</span
        >{{ $t("app.fields") }}</label
      >
    </div>

    <q-form
      @submit="onAddExpenditureItemDetail"
      class="q-gutter-sm q-mt-xs q-mx-sm"
    >
      <div class="q-mb-md">
        <label for="credential" class="form_field"
          >{{ $t("app.nameLabel") }} <span class="text-red">*</span></label
        >

        <q-input
          v-model="expenditure_item_detail.name"
          outlined
          dense
          type="text"
          :readonly="existExpenditureItemDetail"
        />
      </div>
      <div class="q-mb-md">
        <label for="credential" class="form_field"
          >{{ $t("app.amountGivenLabel")
          }}<span class="text-red">*</span></label
        >
        <q-input
          v-model="expenditure_item_detail.amount_given"
          outlined
          dense
          type="number"
          @input="validateExpenditureAmountGiven"
          :readonly="existExpenditureItemDetail"
        />
        <small v-if="is_valid_amount_given" class="text-red">
          <b>{{ $t("app.amountGivenWarningMsg") }}</b>
        </small>
      </div>
      <div class="q-mb-md">
        <label for="credential" class="form_field"
          >{{ $t("app.amountSpent") }}<span class="text-red">*</span></label
        >
        <q-input
          v-model="expenditure_item_detail.amount_spent"
          outlined
          dense
          type="number"
          :readonly="existExpenditureItemDetail"
        >
        </q-input>
      </div>
      <div class="q-mb-md">
        <label for="credential" class="form_field">{{
          $t("app.comment")
        }}</label>
        <q-input
          v-model="expenditure_item_detail.comment"
          dense
          class="text_color"
          type="textarea"
          outlined
          :placeholder="$t('app.provideCommentDetail')"
          :readonly="existExpenditureItemDetail"
        />
      </div>
      <div
        :class="
          $q.platform.is.desktop
            ? 'flex q-mt-lg justify-end'
            : 'q-pt-xs q-mb-lg'
        "
      >
        <ButtonVue
          class="form_button"
          :label="$t('app.saveBtnLabel')"
          :loading="loading"
          :color="'primary'"
          :disabled="validateForm"
          :no_caps="true"
        >
        </ButtonVue>
      </div>
    </q-form>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import moment from "moment";

export default {
  mixins: [ExpenditureItemDetailMixinVue],
  created() {
    let heading = this.$t("app.detailHeading");
    this.$emit("set-heading", heading);
  },
  data() {
    return {
      loading: false,
      expenditure_item_detail: {
        expenditure_item_id: this.$store.getters.getCurrentExpenditureItem.id,
        amount_spent: 0,
        name: null,
        comment: " ",
        amount_given: 0,
        picture: null,
        id: null,
      },
      is_valid_amount_given: false,
    };
  },

  computed: {
    validateForm() {
      return (
        this.expenditure_item_detail.amount_given == null ||
        this.expenditure_item_detail.name == null ||
        this.expenditure_item_detail.amount_spent == null ||
        this.existExpenditureItemDetail
      );
    },
    getCurrentExpenditureItem() {
      return this.$store.getters.getCurrentExpenditureItem;
    },
    getUpdatedExpenditureItemDetailFromState() {
      return this.$store.getters.getUpdatedExpenditureItemDetail;
    },
    getFormatDetailCreatedDate() {
      return moment(
        this.$store.getters.getUpdatedExpenditureItemDetail.created_at
      ).format("MMMM Do YYYY");
    },

    setFormUpdateDetail() {
      return this.setFormFields(
        this.$store.getters.getUpdatedExpenditureItemDetail
      );
    },

    existExpenditureItemDetail() {
      return this.$store.getters.getUpdatedExpenditureItemDetail !== null && this.$store.getters.getUpdatedExpenditureItemDetail.approve !== "PENDING";
    },
  },
  watch: {
    setFormUpdateDetail() {
      return this.setFormFields(
        this.$store.getters.getUpdatedExpenditureItemDetail
      );
    },
  },
  methods: {
    onAddExpenditureItemDetail() {
      let item = this.$store.getters.getCurrentExpenditureItem;
      let payload = {
        url: this.setActionUrl(this.expenditure_item_detail.id, item),
        data: this.expenditure_item_detail,
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
      this.setDispatchAction(this.expenditure_item_detail.id, payload);
    },

    resetForm() {
      this.expenditure_item_detail.name = null;
      this.expenditure_item_detail.amount_spent = 0;
      this.expenditure_item_detail.amount_given = 0;
      this.expenditure_item_detail.comment = null;
      // this.expenditure_item_detail.expenditure_item_id = null;
      this.expenditure_item_detail.picture = null;
      // this.expenditure_item_detail.id = null;

      return this.expenditure_item_detail;
    },

    setFormFields(data) {
      if (data != null) {
        this.expenditure_item_detail.expenditure_item_id =
          data.expenditure_item_id;
        this.expenditure_item_detail.name = data.name;
        this.expenditure_item_detail.comment = data.comment;
        this.expenditure_item_detail.amount_given = data.amount_given;
        this.expenditure_item_detail.amount_spent = data.amount_spent;
        this.expenditure_item_detail.id = data.id;
      }

      return this.expenditure_item_detail;
    },

    setActionUrl(id, item) {
      let url = "";
      if (id === null) {
        url = `/api/protected/expenditure-items/${item.id}/details`;
      } else {
        url = `/api/protected/expenditure-details/${id}/update`;
      }
      return url;
    },

    setDispatchAction(id, payload) {
      this.loading = true;
      if (id === null) {
        this.$store
          .dispatch("postRequest", payload)
          .then(() => {
            this.getExpenditureDetailsByItemId(
              payload.data.expenditure_item_id,
              1,
              7
            );
          })
          .finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
            this.resetForm();
          });
      } else {
        this.$store
          .dispatch("putRequest", payload)
          .then(() => {
            this.getExpenditureDetailsByItemId(
              payload.data.expenditure_item_id,
              1,
              7
            );
          })
          .finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
            this.resetForm();
            this.$store.dispatch("setUpdatedExpenditureItemDetail", null);
          });
      }
    },

    validateExpenditureAmountGiven() {
      if (
        this.$store.getters.getCurrentExpenditureItem.amount >
        this.expenditure_item_detail.amount_given
      ) {
        this.is_valid_amount_given = true;
      }
    },
  },
  components: {
    ButtonVue,
  },
};
</script>

<style scoped lang="scss">
.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
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
  padding-left: 0.6rem;
}

.item_amount {
  padding-left: 2.5rem;
}

.detail_amount {
  padding-left: 2.3rem;
}

.item_bal {
  padding-left: 4.8rem;
}

.detail_date {
  padding-left: 3rem;
}

.detail_created_by {
  padding-left: 3.7rem;
}

.item_statue {
  padding: 5.5rem;
}

.unapproved_color {
  color: #f2994a;
}

.approved_color {
  color: #27ae60;
}

.info {
  color: $grey2;
  font-size: small;
}
</style>
