<template>
  <div class="q-mb-md">
    <div class="text-left q-pl-md q-mb-md q-mt-md">
      <label class="text-muted q-pl-sm info"
        >{{ $t("app.warningField") }}<span class="text-red">*</span
        >{{ $t("app.fields") }}</label
      >
    </div>
    <q-form @submit="onAddPaymentItem" class="q-gutter-md q-mt-sm q-mx-sm">
      <div>
        <label for="credential" class="form_field"
          >{{ $t("app.nameLabel") }} <span class="text-red">*</span></label
        >
        <q-input v-model="payment_item.name" outlined dense type="text" />
      </div>
      <div>
        <label for="credential" class="form_field"
          >{{ $t("app.amount") }} <span class="text-red">*</span></label
        >
        <q-input v-model="payment_item.amount" outlined dense type="number" />
      </div>
      <div class="flex">
        <div>
          <label for="credential" class="form_field"
            >{{ $t("app.compulsoryLabel") }}
            <span class="text-red">*</span></label
          >
        </div>
        <div class="q-gutter-sm q-ml-lg">
          <q-radio
            dense
            v-model="payment_item.compulsory"
            :val="true"
            :label="$t('app.yes')"
            size="xs"
          />
          <q-radio
            dense
            v-model="payment_item.compulsory"
            :val="false"
            :label="$t('app.no')"
            size="xs"
          />
        </div>
      </div>
      <div>
        <label for="credential" class="form_field"
          >{{ $t("app.deadline") }} <span class="text-red">*</span></label
        >
        <q-input
          dense
          outlined
          v-model="payment_item.deadline"
          @input="validateDeadline()"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="payment_item.deadline"
                  @input="validateDeadline()"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <label v-if="invalid_deadline" class="text-red">
          <b>{{ $t("app.invalidDeadline") }}</b>
        </label>
      </div>
      <div>
        <label for="credential" class="form_field"
          >{{ $t("app.frequency") }} <span class="text-red">*</span></label
        >
        <q-select
          v-model="payment_item.frequency"
          outlined
          dense
          :options="frequencies"
          :label="$t('app.selectFrequency')"
          :disable="validateDisableFrequency"
        />
      </div>
      <div>
        <label for="credential" class="form_field"
          >{{ $t("app.type") }} <span class="text-red">*</span></label
        >
        <q-select
          v-model="payment_item.type"
          outlined
          dense
          :options="payment_item_types"
          :label="$t('app.selectType')"
          @input="handlePaymentItemType()"
          :disable="validateDisableType"
        />
      </div>

      <!-- when the payment item type is A_MEMBER -->
      <div v-if="payment_item.type == 'A_MEMBER'">
        <div v-if="references.length == 0">
          <label for="title" class="q-mt-sm form_field"
            >{{ $t("app.selectMember") }} <span class="text-red">*</span></label
          >
        </div>
        <div v-if="references.length > 0">
          <label for="title" class="q-mt-sm form_field"
            >{{ $t("app.selectedMember") }}:</label
          >
          <div class="q-gutter-sm q-mb-lg">
            <q-btn
              color="primary"
              class="ref_btn"
              v-for="ref in references"
              :key="ref.value"
              @click="removeSelectedReference(ref)"
              >{{ ref.label }}
              <q-icon name="clear" class="q-pl-sm" size="xs"></q-icon>
              <q-tooltip>{{ $t("app.removeMemberTip") }}</q-tooltip>
            </q-btn>
          </div>
        </div>

        <q-select
          :class="references.length > 0 ? 'q-mt-lg' : ''"
          v-model="payment_item.reference"
          :options="members"
          :label="$t('app.searchMember')"
          outlined
          dense
          @input="selectMember()"
          use-input
          input-debounce="0"
          @filter="filterFn"
          clearable
          v-if="references.length == 0"
        >
          <template v-slot:append v-if="start_filtering">
            <q-spinner color="primary" size="1.2em" :thickness="5" />
          </template>

          <!-- no member found message -->
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t("app.notFound") }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <!-- When the type is GROUPED_MEMBERS -->
      <div v-if="payment_item.type == 'GROUPED_MEMBERS'">
        <div v-if="references.length == 0">
          <label for="title" class="q-mt-sm form_field"
            >{{ $t("app.selectMembers") }}
            <span class="text-red">*</span></label
          >
        </div>
        <div v-if="references.length > 0">
          <label for="title" class="q-mt-sm form_field">{{
            $t("app.selectedMembers")
          }}</label>
          <div class="q-gutter-sm q-mb-lg">
            <q-btn
              color="primary"
              class="ref_btn"
              v-for="ref in references"
              :key="ref.value"
              @click="removeSelectedReference(ref)"
              >{{ ref.label }}
              <q-icon name="clear" class="q-pl-sm" size="xs"></q-icon>
              <q-tooltip>{{ $t("app.removeMemberTip") }}</q-tooltip>
            </q-btn>
          </div>
        </div>

        <q-select
          :class="references.length > 0 ? 'q-mt-lg' : ''"
          v-model="payment_item.reference"
          :options="members"
          :label="$t('app.searchMember')"
          multiple
          outlined
          dense
          @input="selectMember()"
          use-input
          input-debounce="0"
          @filter="filterFn"
          clearable
        >
          <template v-slot:append v-if="start_filtering">
            <q-spinner color="primary" size="1.2em" :thickness="3" />
          </template>

          <!-- no member found message -->
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t("app.notFound") }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <!-- END OF SELECTIONS -->

      <div class="q-mt-lg">
        <label for="credential" class="form_field"
          >{{ $t("app.description") }}
        </label>
        <q-input
          v-model="payment_item.description"
          outlined
          dense
          autogrow
          :placeholder="$t('app.provideDescription')"
        />
      </div>
      <div
        :class="
          $q.platform.is.desktop
            ? 'flex q-mt-lg justify-end'
            : 'q-pt-xs q-mb-lg'
        "
      >
        <q-btn
          class="form_button q-mr-md"
          :label="$t('app.reset')"
          :color="'primary'"
          :disabled="false"
          no-caps
          outline
          @click="resetForm"
        >
        </q-btn>
        <ButtonVue
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
import { Notify, Platform } from "quasar";
import ButtonVue from "src/components/Button.vue";
import PaymentItemMixin from "src/mixins/PaymentItemMixin.vue";
import PaymentItemMixinVue from "src/mixins/PaymentItemMixin.vue";
import memberMixin from "src/mixins/memberMixin.vue";
import moment from "moment";

export default {
  mixins: [PaymentItemMixin, PaymentItemMixinVue, memberMixin],

  mounted() {
    let heading = this.$t("app.paymentItemHeading");
    this.$emit("set-heading", heading);
    this.resetForm();
    this.$store.commit("SET_MEMBERS", []);
    this.setFormFields(this.$store.getters.getUpdatedPaymentItem);
  },

  beforeMount() {
    this.resetForm();
  },

  data() {
    return {
      loading: false,
      payment_category: {
        name: null,
        description: null,
      },
      position: "right",
      dialog: false,
      payment_item: {
        compulsory: true,
        name: null,
        description: "",
        id: null,
        payment_category_id: null,
        type: "ALL_MEMBERS",
        frequency: "ONE_TIME",
        amount: 0.0,
        reference: null,
        deadline: new Date(),
      },
      payment_item_types: [
        "ALL_MEMBERS",
        "A_MEMBER",
        "MEMBERS_WITH_ROLES",
        "MEMBERS_WITHOUT_ROLES",
        "GROUPED_MEMBERS",
      ],
      frequencies: ["YEARLY", "MONTHLY", "ONE_TIME", "QUARTERLY"],
      members: [],
      references: [],
      start_filtering: false,
      invalid_deadline: false,
    };
  },
  computed: {
    validateForm() {
      return (
        this.payment_item.name === null ||
        this.payment_item.type === null ||
        this.payment_item.frequency === null ||
        this.payment_item.deadline === null ||
        this.payment_item.amount === 0.0 ||
        (this.payment_item.type === "GROUPED_MEMBERS" &&
          this.references.length == 0) ||
        (this.payment_item.type === "A_MEMBER" && this.references.length == 0)
      );
    },

    getUpdatedPaymentItem() {
      return this.setFormFields(this.$store.getters.getUpdatedPaymentItem);
    },

    validateDisableFrequency() {
      return (
        this.payment_item.id != null && this.payment_item.frequency != null
      );
    },

    validateDisableType() {
      return this.payment_item.id != null && this.payment_item.type != null;
    },

    getMembersFromStore() {
      let data = [];
      this.$store.getters.getMembers.forEach((member) => {
        data.push({
          label: member.name,
          value: member.id,
        });
      });

      return data;
    },
  },

  watch: {
    getUpdatedPaymentItem() {
      if (this.$store.getters.getUpdatedPaymentItem !== null) {
        this.handlePaymentItemType();
      }
      return this.setFormFields(this.$store.getters.getUpdatedPaymentItem);
    },
  },

  methods: {
    validateDeadline() {
      let date = new Date();
      let month =
        date.getMonth() + 1 > 10
          ? 0 + date.getMonth() + 1
          : date.getMonth() + 1;
      let current_date =
        date.getFullYear() + "/" + 0 + month + "/" + date.getDate();
      return (this.invalid_deadline =
        this.payment_item.deadline !== null &&
        this.payment_item.deadline < current_date);
    },
    onAddPaymentItem() {
      let category = this.$store.getters.getCurrentPaymentCategory;
      let payload = {
        url: this.setAddUpdatePaymentItemUrl(this.payment_item, category),
        data: {
          name: this.payment_item.name,
          amount: this.payment_item.amount,
          type: this.payment_item.type,
          amount: this.payment_item.amount,
          frequency: this.payment_item.frequency,
          compulsory: this.payment_item.compulsory,
          description: this.payment_item.description,
          reference: this.buildStringOfReferences(this.references),
          deadline: this.payment_item.deadline,
        },
        msg: this.$t("app.paymentItemSuccessMsg"),
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
      this.setDispatchAction(this.payment_item, payload, category);
    },

    resetForm() {
      this.payment_item.name = null;
      this.payment_item.type = "ALL_MEMBERS";
      this.payment_item.amount = 0.0;
      this.payment_item.frequency = "ONE_TIME";
      this.payment_item.reference = null;
      this.payment_item.deadline = moment(new Date()).format("YYYY/MM/D");
      (this.payment_item.description = ""),
        (this.payment_item.compulsory = true);
      this.payment_item.id = null;
      this.payment_item.payment_category_id = null;
      this.references = [];
      return this.payment_item;
    },

    setAddUpdatePaymentItemUrl(payment_item, category) {
      let url = "";
      if (payment_item.id === null) {
        url = `/api/protected/payment-categories/${category.id}/payment-items`;
      } else {
        url = `/api/protected/payment-categories/${category.id}/payment-items/${payment_item.id}`;
      }

      return url;
    },

    setDispatchAction(payment_item, payload, category) {
      if (payment_item.id === null) {
        this.loading = true;
        this.$store
          .dispatch("postRequest", payload)
          .then(() => {
            this.getPaymentItemsByCategory(category.id);
            this.resetForm();
            this.$emit("close-right-drawer");
          })
          .finally(() => {
            this.loading = false;
            this.resetForm();
            this.references = [];
          });
      } else {
        this.loading = true;
        this.$store
          .dispatch("putRequest", payload)
          .then(() => {
            this.getPaymentItemsByCategory(category.id);
            this.resetForm();
            this.$emit("close-right-drawer");
            this.references = [];
          })
          .finally(() => {
            this.loading = false;
            this.resetForm();
          });
      }
    },

    setFormFields(data) {
      if (data !== null) {
        (this.payment_item.name = data.name),
          (this.payment_item.payment_category_id = data.payment_category_id);
        this.payment_item.frequency = data.frequency;
        this.payment_item.description = data.description;
        this.payment_item.id = data.id;
        this.payment_item.amount = data.amount;
        this.payment_item.type = data.payment_item_type;
        this.payment_item.compulsory = data.compulsory == 1 ? true : false;
        this.references = this.setReferences(data.references);
        this.payment_item.deadline = data.deadline;
      }
      return this.payment_item;
    },

    handlePaymentItemType() {
      this.payment_item.reference = null;
      if (
        this.payment_item.type == "A_MEMBER" ||
        (this.payment_item.type == "GROUPED_MEMBERS" &&
          this.getMembersFromStore.length == 0)
      ) {
        this.getOrganisationMembers();
      }
    },

    getOrganisationMembers() {
      let organisation_id = this.$store.getters.getOrganisation.id;
      let payload = {
        url: `/api/protected/organisations/${organisation_id}/users`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        commit: "SET_MEMBERS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then(() => {})
        .finally(() => {});
    },

    selectMember() {
      let selected = null;
      if (this.payment_item.type == "A_MEMBER") {
        selected = JSON.parse(JSON.stringify(this.payment_item.reference));
        this.references.push({ label: selected.label, value: selected.value });
        this.payment_item.reference = null;
        this.members = this.members.filter(
          (member) => member.value != selected.value
        );
      } else {
        selected =
          JSON.parse(JSON.stringify(this.payment_item.reference)) != undefined
            ? JSON.parse(JSON.stringify(this.payment_item.reference))[0]
            : null;
        if (selected != null) {
          const exist = this.references.find(
            (ele) => ele.value == selected.value
          );
          if (exist == undefined) {
            this.references.push({
              label: selected.label,
              value: selected.value,
            });
            this.payment_item.reference = null;
            this.members = this.members.filter(
              (member) => member.value != selected.value
            );
          } else {
            Notify.create({
              type: "info",
              message: this.$t("app.memberExist"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
        }
      }
      return this.members;
    },

    removeSelectedReference(ref) {
      this.references = this.references.filter(
        (reference) => reference.value != ref.value
      );
      this.members.push(ref);
      if (this.$store.getters.getUpdatedPaymentItem != null) {
        this.removeReference(ref);
      }
      return this.references;
    },

    filterFn(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      update(() => {
        this.members = this.getMembersFromStore.filter((v) =>
          v.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.members;
      });
    },

    buildStringOfReferences(references) {
      let ref_str = "";
      for (let index = 0; index < references.length; index++) {
        ref_str += references[index].value + "/";
      }
      return ref_str;
    },

    removeReference(ref) {
      let payment_item_id = this.$store.getters.getUpdatedPaymentItem.id;
      let payload = {
        url: `/api/protected/payment-items/update/reference`,
        data: {
          id: payment_item_id,
          reference_id: ref.value,
        },
        msg: ``,
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
      this.$store.dispatch("putRequest", payload).then(() => {});
    },

    setReferences(data) {
      let refs = [];
      data.forEach((ele) => {
        refs.push({
          label: ele.name,
          value: ele.id,
        });
      });
      return refs;
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

.ref_btn {
  font-size: smaller;
}
</style>
