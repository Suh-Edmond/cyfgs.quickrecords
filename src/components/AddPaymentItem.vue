<template>
  <div class="q-pa-md">
    <div class="q-ml-sm q-mb-lg">
      <label class="text-muted q-pl-sm info"
        >All fields with <span class="text-red">*</span> are required</label
      >
    </div>
    <div class="q-mt-md q-mx-md">
      <q-form @submit="onAddPaymentItem" class="q-gutter-md">
        <div>
          <label for="credential" class="form_field"
            >Name <span class="text-red">*</span></label
          >
          <q-input v-model="payment_item.name" outlined dense type="text" />
        </div>
        <div>
          <label for="credential" class="form_field"
            >Amount <span class="text-red">*</span></label
          >
          <q-input v-model="payment_item.amount" outlined dense type="number" />
        </div>
        <div class="flex">
          <div>
            <label for="credential" class="form_field"
              >Compulsory <span class="text-red">*</span></label
            >
          </div>
          <div class="q-gutter-sm q-ml-lg">
            <q-radio
              dense
              v-model="payment_item.compulsory"
              :val="true"
              label="YES"
              size="xs"
            />
            <q-radio
              dense
              v-model="payment_item.compulsory"
              :val="false"
              label="NO"
              size="xs"
            />
          </div>
        </div>
        <div>
          <label for="credential" class="form_field"
            >Frequency <span class="text-red">*</span></label
          >
          <q-select
            v-model="payment_item.frequency"
            outlined
            dense
            :options="frequencies"
            label="Select frequency"
          />
        </div>
        <div>
          <label for="credential" class="form_field"
            >Type <span class="text-red">*</span></label
          >
          <q-select
            v-model="payment_item.type"
            outlined
            dense
            :options="payment_item_types"
            label="Select type"
            @input="handlePaymentItemType()"
          />
        </div>

        <!-- when the payment item type is A_MEMBER -->
        <div v-if="payment_item.type == 'A_MEMBER'">
          <div v-if="references.length == 0">
            <label for="title" class="q-mt-sm form_field"
              >Select Member <span class="text-red">*</span></label
            >
          </div>
          <div v-if="references.length > 0">
            <label for="title" class="q-mt-sm form_field"
              >Selected Member:</label
            >
            <div class="q-gutter-sm q-mb-lg">
              <q-btn
                color="primary"
                class="ref_btn"
                v-for="ref in references"
                :key="ref.value"
                @click="removeSelectedReference(ref)"
                >{{ref.label}}
                <q-icon name="clear" class="q-pl-sm" size="xs"></q-icon>
                <q-tooltip>Remove member</q-tooltip>
              </q-btn>
            </div>
          </div>

          <q-select
            :class="references.length > 0 ? 'q-mt-lg' : ''"
            v-model="payment_item.reference"
            :options="members"
            label="Type member's name"
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
                  No member found
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <!-- When the type is GROUPED_MEMBERS -->
        <div v-if="payment_item.type == 'GROUPED_MEMBERS'">
          <div v-if="references.length == 0">
            <label for="title" class="q-mt-sm form_field"
              >Select Members <span class="text-red">*</span></label
            >
          </div>
          <div v-if="references.length > 0">
            <label for="title" class="q-mt-sm form_field"
              >Selected Members:</label
            >
            <div class="q-gutter-sm q-mb-lg">
              <q-btn
                color="primary"
                class="ref_btn"
                v-for="ref in references"
                :key="ref.value"
                @click="removeSelectedReference(ref)"
                >{{ref.label}}
                <q-icon name="clear" class="q-pl-sm" size="xs"></q-icon>
                <q-tooltip>Remove member</q-tooltip>
              </q-btn>
            </div>
          </div>

          <q-select
            :class="references.length > 0 ? 'q-mt-lg' : ''"
            v-model="payment_item.reference"
            :options="members"
            label="Type member's name"
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
              <q-spinner color="primary" size="1.2em" :thickness="5" />
            </template>

            <!-- no member found message -->
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No member found
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- END OF SELECTIONS -->

        <div class="q-mt-lg">
          <label for="credential" class="form_field">Description </label>
          <q-input
            v-model="payment_item.description"
            outlined
            dense
            type="textarea"
            placeholder="Please provide a description about the category"
          />
        </div>
        <div class="flex q-mt-lg justify-end">
          <div>
            <ButtonVue
              class="form_button"
              label="Save"
              :loading="loading"
              color="primary"
              :disabled="validateForm"
              :no_caps="true"
            >
            </ButtonVue>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
import { Notify, Platform } from "quasar";
import ButtonVue from "src/components/Button.vue";
import PaymentItemMixin from "src/mixins/PaymentItemMixin.vue";
import PaymentItemMixinVue from "src/mixins/PaymentItemMixin.vue";
import memberMixin from "src/mixins/memberMixin.vue";

export default {
  mixins: [PaymentItemMixin, PaymentItemMixinVue, memberMixin],

  created() {
    let heading = "Payment Item Information";
    this.$emit("set-heading", heading);
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
        type: null,
        frequency: null,
        amount: 0.0,
        reference: null,
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
    };
  },
  computed: {
    validateForm() {
      return this.payment_item.name == null ||
        this.payment_item.type == null ||
        this.payment_item.frequency == null ||
        this.payment_item.amount == 0.0
        ? true
        : false;
    },

    getUpdatedPaymentItem() {
      return this.setFormFields(this.$store.getters.getUpdatedPaymentItem);
    },
  },

  watch: {
    getUpdatedPaymentItem() {
      return this.setFormFields(this.$store.getters.getUpdatedPaymentItem);
    },
  },

  methods: {
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
        },
        msg: "Payment Item save Successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: "An Error occurred! Please try again",
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
      this.payment_item.type = null;
      this.payment_item.amount = 0.0;
      this.payment_item.frequency = null;
      this.payment_item.reference = null;
      (this.payment_item.description = ""),
        (this.payment_item.compulsory = true);
      this.payment_item.id = null;
      this.payment_item.payment_category_id = null;

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
      if (data != null) {
        (this.payment_item.name = data.name),
          (this.payment_item.payment_category_id = data.payment_category_id);
        this.payment_item.frequency = data.frequency;
        this.payment_item.description = data.description;
        this.payment_item.id = data.id;
        this.payment_item.amount = data.amount;
        this.payment_item.type = data.payment_item_type;
        this.payment_item.compulsory = data.compulsory == 1 ? true : false;
        this.references = this.setReferences(data.references);
      }
      return this.payment_item;
    },

    handlePaymentItemType() {
      this.references = [];
      this.payment_item.reference = null;
      if (this.$store.getters.getMembers.length == 0) {
        let organisation_id = this.$store.getters.getOrganisation.id;
        this.getOrganisationMembers(organisation_id, false);
        this.getReferences();
      } else {
        this.getReferences();
      }
    },

    getReferences() {
      this.members = [];
      this.$store.getters.getMembers.forEach((member) => {
        this.members.push({
          label: member.name,
          value: member.id,
        });
      });
      return this.members;
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
              message: "Member has already been selected",
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
      if(this.$store.getters.getUpdatedPaymentItem != null){
        this.removeReference(ref);
      }
      return this.references;
    },

    filterFn(val, update, abort) {
      if (val.length < 2) {
        this.start_filtering = false;
        abort();
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.members = this.getReferences();
        this.members = this.members.filter((v) =>
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

    removeReference(ref){
      let payment_item_id = this.$store.getters.getUpdatedPaymentItem.id
      let payload = {
        url: `/api/protected/payment-items/update/reference`,
        data:{
          id:payment_item_id,
          reference_id:ref.value
        },
        msg: ``,
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: false,
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("putRequest", payload).then(() => {
      });
    },

    setReferences(data){
      let refs = [];
      data.forEach((ele) => {
        refs.push ({
          label:ele.name,
          value:ele.id
        })
      })
      return refs;
    }
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
  font-size: 12.8px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.info {
  color: $grey2;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  align-items: center;
  letter-spacing: 0.01em;
}

.ref_btn {
  font-size: smaller;
}
</style>
