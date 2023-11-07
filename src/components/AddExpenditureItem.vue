<template>
  <div class="q-mb-md">
    <q-banner
      inline-actions
      rounded
      class="bg-warning text-white q-mx-md q-mt-sm"
      dense
      v-if="existExpenditureItem"
    >
      {{ $t("app.cantUpdatedExpenditureItemAfterApprovalMsg") }}
      <span class="text-lowercase">{{
        getUpdatedExpenditureFromState.approve
      }}</span>
      <template v-slot:action>
        <q-btn flat icon="close" size="sm" />
      </template>
    </q-banner>
    <div class="q-mt-md">
      <label class="text-muted q-pl-lg"
        >{{ $t("app.warningField") }} <span class="text-red">*</span>
        {{ $t("app.fields") }}</label
      >
    </div>
    <q-form @submit="onAddExpenditureItem" class="q-gutter-md q-mt-xs q-mx-sm">
      <div class="q-mb-md">
        <label for="name" class="form_field"
          >{{ $t("app.paymentItem") }} <span class="text-red">*</span>
        </label>
        <q-select
          outlined
          dense
          v-model="expenditure_item.payment_item_id"
          :label="$t('app.searchPaymentItem')"
          :options="payment_items"
          input-debounce="0"
          class="text_color"
          clearable
          use-input
          @filter="filterPaymentItems"
          :readonly="existExpenditureItem"
        >
        </q-select>
      </div>
      <div>
        <label for="credential" class="form_field"
          >{{ $t("app.nameLabel") }} <span class="text-red">*</span></label
        >
        <q-input
          v-model="expenditure_item.name"
          outlined
          dense
          type="text"
          class="q-mb-md"
          :readonly="existExpenditureItem"
        />
      </div>
      <div>
        <label for="credential" class="form_field"
          >{{ $t("app.estimatedAmount") }}
          <span class="text-red">*</span></label
        >
        <q-input
          v-model="expenditure_item.amount"
          outlined
          dense
          type="number"
          class="q-mb-md"
          :readonly="existExpenditureItem"
        />
      </div>
      <div>
        <label for="credential" class="form_field"
          >{{ $t("app.venue") }}
        </label>
        <q-input
          v-model="expenditure_item.venue"
          outlined
          dense
          type="text"
          class="q-mb-md"
          :readonly="existExpenditureItem"
        />
      </div>
      <div>
        <label for="credential" class="form_field"
          >{{ $t("app.date") }} <span class="text-red">*</span></label
        >
        <q-input
          v-model="expenditure_item.date"
          outlined
          dense
          class="q-mb-md"
          :readonly="existExpenditureItem"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="expenditure_item.date">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div>
        <label for="credential" class="form_field"
          >{{ $t("app.comment") }}
        </label>
        <q-input
          v-model="expenditure_item.comment"
          outlined
          dense
          class="text_color"
          type="textarea"
          :placeholder="$t('app.expenditureComment')"
          :readonly="existExpenditureItem"
        />
      </div>
      <div
        :class="$q.platform.is.desktop ? 'flex q-mt-md justify-end' : 'q-mb-lg'"
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
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";
import moment from "moment";
import { Notify, Platform } from "quasar";

export default {
  mixins: [expenditureItemMixinVue],

  mounted() {
    let heading = this.$t("app.addExpenditureItemHeading");
    this.$emit("set-heading", heading);

    this.setFormFields(this.$store.getters.getUpdatedExpenditureItem);

    this.getPaymentActivities();
  },
  data() {
    return {
      loading: false,
      expenditure_item: {
        expenditure_category_id: null,
        venue: null,
        date: moment(new Date()).format("YYYY/MM/DD"),
        name: null,
        comment: null,
        amount: 0.0,
        picture: null,
        payment_item_id: null,
        id: null,
      },
      start_filtering: false,
      payment_items: [],
    };
  },
  computed: {
    validateForm() {
      return (
        this.expenditure_item.amount === 0 ||
        this.expenditure_item.name === null ||
        this.expenditure_item.date === null ||
        this.expenditure_item.payment_item_id === null ||
        this.existExpenditureItem
      );
    },

    getCurrentExpenditureCategory() {
      return this.$store.getters.getCurrentExpenditureCategory;
    },
    getUpdatedExpenditureFromState() {
      return this.$store.getters.getUpdatedExpenditureItem;
    },

    getUpdatedExpenditureItem() {
      return this.setFormFields(this.$store.getters.getUpdatedExpenditureItem);
    },

    existExpenditureItem() {
      return this.$store.getters.getUpdatedExpenditureItem !== null && this.$store.getters.getUpdatedExpenditureItem.approve !== "PENDING";
    },
  },
  watch: {
    getUpdatedExpenditureItem() {
      return this.setFormFields(this.$store.getters.getUpdatedExpenditureItem);
    },
  },
  methods: {
    onAddExpenditureItem() {
      let category = this.$store.getters.getCurrentExpenditureCategory;
      let payload = {
        url: this.setActionUrl(this.expenditure_item.id, category),
        data: {
          name: this.expenditure_item.name,
          venue: this.expenditure_item.venue,
          date: this.expenditure_item.date,
          payment_item_id: this.expenditure_item.payment_item_id.value,
          amount: this.expenditure_item.amount,
          comment: this.expenditure_item.comment,
        },
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
      this.setDispatchAction(this.expenditure_item.id, payload);
    },
    resetForm() {
      this.expenditure_item.name = null;
      this.expenditure_item.amount = 0;
      this.expenditure_item.venue = null;
      this.expenditure_item.date = null;
      this.expenditure_item.comment = null;
      this.expenditure_item.expenditure_category_id = null;
      this.expenditure_item.id = null;
      this.expenditure_item.payment_item_id = null;

      return this.expenditure_item;
    },

    setFormFields(data) {
      if (data != null) {
        this.expenditure_item.expenditure_category_id =
          data.expenditure_category_id;
        this.expenditure_item.venue = data.venue;
        this.expenditure_item.date = data.date;
        this.expenditure_item.name = data.name;
        this.expenditure_item.comment = data.comment;
        this.expenditure_item.amount = data.amount;
        this.expenditure_item.id = data.id;
        this.expenditure_item.payment_item_id = {
          label: data.payment_item.name,
          value: data.payment_item.id,
          amount: data.payment_item.amount,
        };
      }

      return this.expenditure_item;
    },

    setActionUrl(id, category) {
      let url = "";
      if (id === null) {
        url = `/api/protected/expenditure-categories/${category.id}/expenditure-items`;
      } else {
        url = `/api/protected/expenditure-categories/${category.id}/expenditure-items/${id}`;
      }
      return url;
    },

    setDispatchAction(id, payload) {
      this.loading = true;
      if (id === null) {
        this.$store
          .dispatch("postRequest", payload)
          .then(() => {
            this.fetchExpenditureItems(1, 7, "", "", "");
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
            this.fetchExpenditureItems(1, 7, "", "", "");
          })
          .finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
            this.resetForm();
            this.$store.dispatch("setUpdatedExpenditureItem", null);
          });
      }
    },

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
      if (val < 1 || this.expenditure_item.payment_item_id != null) {
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
  font-size: 11px;
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

.item_value {
  padding-left: 2.8rem;
}

.item_venue {
  padding-left: 7rem;
}

.item_date {
  padding-left: 7.8rem;
}

.item_amount {
  padding-left: 6.4rem;
}

.item_statue {
  padding: 7.1rem;
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
