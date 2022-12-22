<template>
  <div class="q-pa-md">
    <div class="q-mt-md q-mx-md">
      <q-form @submit="onAddExpenditureItemDetail" class="q-gutter-sm">
        <div class="q-mb-md">
          <label for="credential" class="form_field">Name <span class="text-red">*</span></label>
          <q-input v-model="expenditure_item_detail.name" outlined dense type="text" />
        </div>
        <div class="q-mb-md">
          <label for="credential" class="form_field">Amount Given<span class="text-red">*</span></label>
          <q-input v-model="expenditure_item_detail.amount_given" outlined dense type="number" />
        </div>
        <div class="q-mb-md">
          <label for="credential" class="form_field">Amount Spent<span class="text-red">*</span></label>
          <q-input v-model="expenditure_item_detail.amount_spent" outlined dense type="number" standout bottom-slots>
            <template v-slot:hint>
              Amount Spent must not be more than Amount Given
            </template>
          </q-input>
        </div>
        <div class="q-mb-md">
          <label for="credential" class="form_field">Comment</label>
          <q-input v-model="expenditure_item_detail.comment" outlined dense autogrow />
        </div>

        <div class="q-mb-md">
          <label for="credential" class="form_field">Receipt (Optional)</label>
          <q-file outlined v-model="expenditure_item_detail.picture" dense class="q-mb-md">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
        <div class="row q-mt-lg justify-end">
          <div class="col-md-2 col-sm-2 col-xs-2">
            <ButtonVue class="form_button" :label="label_save" :loading="loading" :color="color"
              :disabled="validateForm" :no_caps="no_caps">
            </ButtonVue>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
export default {
  mixins: [ExpenditureItemDetailMixinVue],
  created() {
    let heading = "Expenditure Item Detail Information";
    this.$emit("set-heading", heading);
  },
  data() {
    return {
      label_save: "Save",
      loading: false,
      color: "primary",
      expenditure_item_detail: {
        expenditure_item_id: this.$store.getters.getCurrentExpenditureItem.id,
        amount_spent: 0,
        name: null,
        comment: null,
        amount_given: 0,
        picture: null,
        id: null
      },
      position: "right",
      dialog: false,
      no_caps: true,
    };
  },

  computed: {
    validateForm() {
      return this.expenditure_item_detail.amount_given === null ||
        this.expenditure_item_detail.name === null ||
        this.expenditure_item_detail.amount_spent === null ||
        this.expenditure_item_detail.amount_given < this.expenditure_item_detail.amount_spent ? true : false;
    },
  },

  methods: {
    onAddExpenditureItemDetail() {
      let item = this.$store.getters.getCurrentExpenditureItem;
      let payload = {
        url: this.setActionUrl(this.expenditure_item_detail.id, item),
        data: this.expenditure_item_detail,
        msg: "Expenditure Item detail save Successfully",
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
      this.setDispatchAction(this.expenditure_item_detail.id, payload);
    },
    resetForm() {
      this.expenditure_item_detail.name = null;
      this.expenditure_item_detail.amount_spent = 0;
      this.expenditure_item_detail.amount_given = 0
      this.expenditure_item_detail.comment = null;
      this.expenditure_item_detail.expenditure_item_id = null;
      this.expenditure_item_detail.picture = null;

      return this.expenditure_item_detail;
    },
    showEditForm() {
      this.$store.dispatch("setEditState", false);
      // this.setFormFields(this.$store.getters.getUpdatedExpenditureItem);
    },

    setFormFields(data) {
      this.expenditure_item_detail.expenditure_item_id = data.expenditure_item_id
      this.expenditure_item_detail.name = data.name;
      this.expenditure_item_detail.comment = data.comment;
      this.expenditure_item_detail.amount_given = data.amount_given;
      this.expenditure_item_detail.amount_spent = data.amount_spent;
      this.expenditure_item_detail.id = data.id;

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
            this.getExpenditureDetailsByItemId(payload.data.expenditure_item_id);
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
            this.getExpenditureDetailsByItemId(payload.data.expenditure_item_id);
          })
          .finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
            this.resetForm();
            // this.$store.dispatch("setUpdatedExpenditureItem", null);
          });
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
  font-size: 11px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.or_option {
  font-weight: bolder;
}

.help_text {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  text-align: center;
  align-items: center;
  letter-spacing: 0.01em;
}
</style>
