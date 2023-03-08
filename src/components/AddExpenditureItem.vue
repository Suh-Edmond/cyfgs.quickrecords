<template>
  <div class="q-pa-md">
    <div class="q-ml-sm q-mb-lg">
      <label class="text-muted q-ml-sm"
        >All fields with <span class="text-red">*</span> are required</label
      >
    </div>
    <div class="q-mt-md q-mx-md" v-if="!getEditState">
      <q-form @submit="onAddExpenditureItem" class="q-gutter-sm">
        <div>
          <label for="credential" class="form_field">Name <span class="text-red">*</span></label>
          <q-input v-model="expenditure_item.name" outlined dense type="text" class="q-mb-md" />
        </div>
        <div>
          <label for="credential" class="form_field">Amount <span class="text-red">*</span></label>
          <q-input v-model="expenditure_item.amount" outlined dense type="number" class="q-mb-md" />
        </div>
        <div>
          <label for="credential" class="form_field">Venue <span class="text-red">*</span></label>
          <q-input v-model="expenditure_item.venue" outlined dense type="text" class="q-mb-md" />
        </div>
        <div>
          <label for="credential" class="form_field">Date <span class="text-red">*</span></label>
          <q-input v-model="expenditure_item.date"  outlined dense class="q-mb-md">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
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
          <label for="credential" class="form_field">Comment <span class="text-red">*</span></label>
          <q-input v-model="expenditure_item.comment" outlined dense autogrow class="q-mb-md" />
        </div>

        <div>
          <label for="credential" class="form_field">Receipt (Optional)</label>
          <q-file outlined v-model="expenditure_item.picture" dense class="q-mb-md">
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
    <div class="q-mt-md" v-if="getEditState">
      <div class="q-mb-md">
        <label for="expenditure_category_name" class="field">Expenditure Category:
          <span class="field_value q-pl-md">{{
            getCurrentExpenditureCategory.name
          }}</span></label>
      </div>
      <div class="q-mb-md">
        <label for="expenditure_item" class="field">Expenditure Item:
          <span class="field_value item_value">{{
            getUpdatedExpenditureFromState.name
          }}</span></label>
      </div>
      <div class="q-mb-md">
        <label for="venue" class="field">Venue:
          <span class="field_value item_venue">{{
            getUpdatedExpenditureFromState.venue
          }}</span></label>
      </div>
      <div class="q-mb-md">
        <label for="date" class="field">Date:
          <span class="field_value item_date">{{
            getUpdatedExpenditureFromState.date
          }}</span></label>
      </div>
      <div class="q-mb-md">
        <label for="amount" class="field">Amount:
          <span class="field_value item_amount">
            {{ getUpdatedExpenditureFromState.amount }} XAF</span></label>
      </div>
      <div class="q-mb-md">
        <label for="status" class="field" v-show="!getUpdatedExpenditureFromState.approve">Status:
          <span class="field_value item_statue unapproved_color">
            UNAPPROVED</span></label>
        <label for="status" class="field" v-show="getUpdatedExpenditureFromState.approve">Status:
          <span class="field_value item_statue approved_color">
            APPROVED</span></label>
      </div>
      <div class="q-mb-md">
        <label for="comment" class="field">Comment:</label>
        <p>{{ getUpdatedExpenditureFromState.comment }}.</p>
      </div>

      <div class="row q-mt-lg justify-end">
        <q-btn round color="primary" icon="edit" size="sm" @click="showEditForm" />
      </div>
    </div>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import expenditureItemMixinVue from "src/mixins/expenditureItemMixin.vue";

export default {
  mixins: [expenditureItemMixinVue],

  created() {
    let heading = "Expenditure Item Information";
    this.$emit("set-heading", heading);
  },
  data() {
    return {
      label_save: "Save",
      loading: false,
      color: "primary",
      expenditure_item: {
        expenditure_category_id: null,
        venue: null,
        date: null,
        name: null,
        comment: null,
        amount: 0,
        picture: null,
        id: null,
      },
      position: "right",
      dialog: false,
      no_caps: true,
    };
  },
  computed: {
    validateForm() {
      return this.expenditure_item.amount === 0 ||
        this.expenditure_item.name === null ||
        this.expenditure_item.date === null ||
        this.expenditure_item.venue === null
        ? true
        : false;
    },
    checkIfExistExpenditureItem() {
      return this.expenditure_item.expenditure_category_id !== null &&
        this.expenditure_item.name !== null &&
        this.expenditure_item.amount
        ? true
        : false;
    },
    getExpenditureCategories() {
      let data = [];
      this.$store.getters.getExpenditureCategories.forEach((ele) => {
        data.push({
          label: ele.name,
          value: ele.id,
        });
      });
      return data;
    },
    getEditState() {
      return this.$store.getters.getEditState;
    },
    getCurrentExpenditureCategory() {
      return this.$store.getters.getCurrentExpenditureCategory;
    },
    getUpdatedExpenditureFromState() {
      return this.$store.getters.getUpdatedExpenditureItem;
    },
  },
  methods: {
    onAddExpenditureItem() {
      let category = this.$store.getters.getCurrentExpenditureCategory;
      let payload = {
        url: this.setActionUrl(this.expenditure_item.id, category),
        data: this.expenditure_item,
        msg: "Expenditure Item save Successfully",
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

      return this.expenditure_item;
    },
    showEditForm() {
      this.$store.dispatch("setEditState", false);
      this.setFormFields(this.$store.getters.getUpdatedExpenditureItem);
    },

    setFormFields(data) {
      this.expenditure_item.expenditure_category_id = data.expenditure_category_id
      this.expenditure_item.venue = data.venue;
      this.expenditure_item.date = data.date;
      this.expenditure_item.name = data.name;
      this.expenditure_item.comment = data.comment;
      this.expenditure_item.amount = data.amount;
      this.expenditure_item.id = data.id;

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
            this.getExpenditureItemsByCategory();
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
            this.getExpenditureItemsByCategory();
          })
          .finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
            this.resetForm();
            this.$store.dispatch("setUpdatedExpenditureItem", null);
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
</style>
