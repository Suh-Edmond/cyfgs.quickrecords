<template>
  <div class="q-pa-md">
    <div class="q-mt-md q-mx-md">
      <q-form @submit="onAddExpenditureItem" class="q-gutter-sm">
        <div>
          <label for="credential" class="form_field"
            >Expenditure Category <span class="text-red">*</span></label
          >
          <q-select
            v-model="expenditure_item.expenditure_category_id"
            outlined
            dense
            :disabled="checkIfExistExpenditureItem"
            :options="getExpenditureCategories"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-mb-md"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div>
          <label for="credential" class="form_field"
            >Name <span class="text-red">*</span></label
          >
          <q-input
            v-model="expenditure_item.name"
            outlined
            dense
            type="text"
            class="q-mb-md"
          />
        </div>
        <div>
          <label for="credential" class="form_field"
            >Amount <span class="text-red">*</span></label
          >
          <q-input
            v-model="expenditure_item.amount"
            outlined
            dense
            type="number"
            class="q-mb-md"
          />
        </div>
        <div>
          <label for="credential" class="form_field"
            >Venue <span class="text-red">*</span></label
          >
          <q-input
            v-model="expenditure_item.venue"
            outlined
            dense
            type="text"
            class="q-mb-md"
          />
        </div>
        <div>
          <label for="credential" class="form_field"
            >Date <span class="text-red">*</span></label
          >
          <q-input
            v-model="expenditure_item.date"
            outlined
            dense
            type="date"
            class="q-mb-md"
          />
        </div>
        <div>
          <label for="credential" class="form_field">Comment</label>
          <q-input
            v-model="expenditure_item.comment"
            outlined
            dense
            autogrow
            class="q-mb-md"
          />
        </div>

        <div>
          <label for="credential" class="form_field">Image</label>
          <q-file
            outlined
            v-model="expenditure_item.picture"
            dense
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>
        <div class="row q-mt-lg justify-end">
          <div class="col-md-2 col-sm-2 col-xs-2">
            <ButtonVue
              class="form_button"
              :label="label_save"
              :loading="loading"
              :color="color"
              :disabled="validateForm"
              :no_caps="no_caps"
            >
            </ButtonVue>
          </div>
        </div>
      </q-form>
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
      },
      position: "right",
      dialog: false,
      no_caps: true,
      expenditure_categories: [],
    };
  },
  computed: {
    validateForm() {
      return this.expenditure_item.amount === 0 ||
        this.expenditure_item.name === null ||
        this.expenditure_item.expenditure_category_id === null ||
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
      this.$store.getters.getExpenditureCategories?.forEach((ele) => {
        data.push({
          label: ele.name,
          value: ele.id,
        });
      });
      return data;
    },
  },
  methods: {
    onAddExpenditureItem() {
      let category = this.$store.getters.getCurrentExpenditureCategory;
      let payload = {
        url: `/api/protected/expenditure-categories/${category.id}/expenditure-items`,
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
      this.loading = true;
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
    },

    filterFn(val, update, abort) {
      if (val.length < 2) {
        abort();
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        return this.getExpenditureCategories.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    resetForm() {
      this.expenditure_item.name = null;
      this.expenditure_item.amount = 0;
      this.expenditure_item.venue = null;
      this.expenditure_item.date = null;
      this.expenditure_item.comment = null;
      this.expenditure_item.expenditure_category_id = null;
      this.expenditure_categories.picture = null;

      return this.expenditure_item;
    },
  },
  components: {
    ButtonVue,
  },
};
</script>

<style scoped lang="scss">
.add_member_title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 29px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.01em;
  color: #5384ae;
  text-transform: capitalize;
}

.button {
  width: 100%;
}

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
