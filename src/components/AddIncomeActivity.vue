<template>
  <div class="q-mb-md q-mx-md">
    <q-banner
      inline-actions
      rounded
      class="bg-info text-white q-mt-sm"
      dense
      v-if="existIncomeActivity"
    >
      {{ $t("app.cantUpdatedIncomeAfterApprovalMsg") }}
      <span class="text-lowercase">{{
        getUpdatedIncomeActivityFromState().approve
      }}</span>
      <template v-slot:action>
        <q-btn flat icon="close" size="sm" />
      </template>
    </q-banner>

    <div class="text-left q-mt-md q-mb-lg">
      <label class="text-muted info"
        >{{ $t("app.warningField") }}<span class="text-red">*</span>
        {{ $t("app.fields") }}</label
      >
    </div>
    <q-form @submit="onAddIncomeActivity" class="q-gutter-md">
      <div class="q-mb-md">
        <label for="name" class="form_field"
          >{{ $t("app.paymentItem") }}<span class="text-red">*</span></label
        >
        <q-select
          outlined
          dense
          v-model="income_activity.payment_item_id"
          :label="$t('app.searchPaymentItem')"
          :options="payment_items"
          input-debounce="0"
          clearable
          use-input
          @filter="filterPaymentItems"
          @input="stopSearch"
          :readonly="existIncomeActivity"
        >
          <template v-slot:append v-if="start_filtering">
            <q-spinner color="primary" size="1.2em" :thickness="5" />
          </template>

          <!-- no member found message -->
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t("app.noResults") }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="q-mb-md">
        <label for="credential" class="form_field"
          >{{ $t("app.nameLabel") }} <span class="text-red">*</span></label
        >
        <q-input
          v-model="income_activity.name"
          outlined
          dense
          type="text"
          :readonly="existIncomeActivity"
        />
      </div>
      <div class="q-mb-md">
        <label for="credential" class="form_field"
          >{{ $t("app.amount") }} <span class="text-red">*</span></label
        >
        <q-input
          v-model="income_activity.amount"
          outlined
          dense
          type="number"
          :readonly="existIncomeActivity"
        />
      </div>
      <div class="q-mb-md">
        <label for="credential" class="form_field"
          >{{ $t("app.venue") }} <span class="text-red">*</span></label
        >
        <q-input
          v-model="income_activity.venue"
          outlined
          dense
          type="text"
          :readonly="existIncomeActivity"
        />
      </div>
      <div class="q-mb-md">
        <label for="credential" class="form_field"
          >{{ $t("app.date") }} <span class="text-red">*</span></label
        >
        <q-input
          v-model="income_activity.date"
          outlined
          dense
          :readonly="existIncomeActivity"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="income_activity.date">
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
        <label for="credential" class="form_field">{{
          $t("app.description")
        }}</label>
        <q-input
          v-model="income_activity.description"
          outlined
          dense
          autogrow
          :placeholder="$t('app.incomeDescription')"
          :readonly="existIncomeActivity"
        />
      </div>
      <div
        :class="$q.platform.is.desktop ? 'flex q-mt-md justify-end' : 'q-mb-xl'"
      >
        <q-btn
          class="form_button q-mr-lg"
          :label="$t('app.reset')"
          :color="'primary'"
          no-caps
          outline
          @click="resetForm"
          v-if="$q.platform.is.desktop"
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
    </q-form>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import IncomeActivityMixinVue from "src/mixins/IncomeActivityMixin.vue";
import moment from "moment";

export default {
  mixins: [IncomeActivityMixinVue],

  mounted() {
    let heading = this.$t("app.addIncomeActivityHeading");
    this.$emit("set-heading", heading);
    this.getPaymentActivities();
  },

  data() {
    return {
      loading: false,
      income_activity: {
        venue: null,
        date: moment(new Date()).format("YYYY/MM/DD"),
        name: null,
        description: null,
        amount: 0,
        id: null,
        organisation_id: null,
        approve: null,
        created_at: null,
        updated_by: null,
        payment_item_id: null,
      },
      position: "right",
      dialog: false,
      payment_items: [],
      start_filtering: false,
      organisation_id: this.$store.getters.getOrganisation.id,
    };
  },
  computed: {
    validateForm() {
      return (
        this.income_activity.amount == 0 ||
        this.income_activity.name == null ||
        this.income_activity.date == null ||
        this.income_activity.venue == null ||
        this.existIncomeActivity
      );
    },

    validateDisablePaymentItem() {
      return this, this.income_activity.payment_item_id != null;
    },

    getIncomeActivity() {
      this.setFormFields(this.getUpdatedIncomeActivityFromState());
      return this.getUpdatedIncomeActivityFromState();
    },

    existIncomeActivity() {
      return (
        this.getUpdatedIncomeActivityFromState() !== null &&
        this.getUpdatedIncomeActivityFromState().approve !== "PENDING"
      );
    },
  },

  watch: {
    getIncomeActivity() {
      this.setFormFields(this.getUpdatedIncomeActivityFromState());
      return this.getUpdatedIncomeActivityFromState();
    },
  },

  methods: {
    getPaymentActivities() {
      this.payment_items = [];
      this.$store.getters.getPaymentActivities.forEach((ele) => {
        this.payment_items.push({
          label: ele.name,
          value: ele.id,
          amount: ele.amount,
        });
      });
      return this.payment_items;
    },

    filterPaymentItems(val, update, abort) {
      if (val < 1 || this.payment_items.payment_item_id != null) {
        this.start_filtering = false;
        abort();
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.payment_items = this.getPaymentActivities().filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.payment_items;
      });
    },

    onAddIncomeActivity() {
      let payload = {
        url: this.setActionUrl(this.income_activity.id, this.organisation_id),
        data: {
          venue: this.income_activity.venue,
          date: this.income_activity.date,
          name: this.income_activity.name,
          description: this.income_activity.description,
          amount: this.income_activity.amount,
          organisation_id: this.income_activity.organisation_id,
          payment_item_id:
            this.income_activity.payment_item_id != null
              ? this.income_activity.payment_item_id.value
              : null,
        },
        msg: this.$t("app.addIncomeSuccessFeedbackMsg"),
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
      this.setDispatchAction(
        this.income_activity.id,
        payload,
        this.organisation_id
      );
    },

    resetForm() {
      this.income_activity.name = null;
      this.income_activity.amount = 0;
      this.income_activity.date = null;
      this.income_activity.description = null;
      this.income_activity.organisation_id = null;
      this.income_activity.venue = null;
      this.income_activity.id = null;
      this.income_activity.payment_item_id = null;

      return this.income_activity;
    },

    setActionUrl(id, organsation_id) {
      let url = "";
      if (id === null) {
        url = `/api/protected/organisations/${organsation_id}/income-activities`;
      } else {
        url = `/api/protected/income-activities/${id}/update`;
      }
      return url;
    },

    setDispatchAction(id, payload, organisation_id) {
      this.loading = true;
      if (id === null) {
        this.$store
          .dispatch("postRequest", payload)
          .then(() => {
            this.getOrganisationIncomeActivities(organisation_id, 1, 7);
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
            this.getOrganisationIncomeActivities(organisation_id, 1, 7);
            this.resetForm();
          })
          .finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
            this.$store.dispatch("setUpdatedIncomeActivity", null);
            this.$store.dispatch("setEditState", false);
          });
      }
    },

    getUpdatedIncomeActivityFromState() {
      return this.$store.getters.getUpdateIncomeActivity;
    },

    setFormFields(data) {
      if (data != null) {
        this.income_activity.name = data.name;
        this.income_activity.id = data.id;
        this.income_activity.amount = data.amount;
        this.income_activity.date = data.date;
        this.income_activity.description = data.description;
        this.income_activity.organisation_id = data.organisation_id;
        this.income_activity.venue = data.venue;
        this.income_activity.approve = data.approve;
        this.income_activity.created_at = data.created_at;
        this.income_activity.updated_by = data.updated_by;
        this.income_activity.payment_item_id =
          data.payment_item != null
            ? {
                label: data.payment_item.name,
                value: data.payment_item.id,
                amount: data.payment_item.amount,
              }
            : null;
      }

      return this.income_activity;
    },

    stopSearch() {
      if (this.income_activity.payment_item_id != null) {
        this.start_filtering = false;
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

.info {
  color: $grey2;
  font-size: small;
}
</style>
