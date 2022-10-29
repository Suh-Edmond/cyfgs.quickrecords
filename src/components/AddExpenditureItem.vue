<template>
  <div class="q-pa-sm">
    <div class="text_h6 text-center q-pt-xs q-pb-md add_member_title">
      Expenditure Item Information
    </div>
    <div>
      <div>
        <q-form @submit="onAddExpenditureItem" class="q-gutter-sm">
          <div>
            <label for="credential" class="form_field">Expenditure Category <span class="text-red">*</span></label>
            <q-select v-model="expenditure_item.expenditure_category_id" outlined dense :disabled="checkIfExistExpenditureItem"
              :options="expenditure_categories" />
          </div>
          <div>
            <label for="credential" class="form_field">Name <span class="text-red">*</span></label>
            <q-input v-model="expenditure_item.name" outlined dense type="text" />
          </div>
          <div>
            <label for="credential" class="form_field">Amount <span class="text-red">*</span></label>
            <q-input v-model="expenditure_item.amount" outlined dense type="number" />
          </div>
          <div>
            <label for="credential" class="form_field">Venue <span class="text-red">*</span></label>
            <q-input v-model="expenditure_item.venue" outlined dense type="text" />
          </div>
          <div>
            <label for="credential" class="form_field">Date <span class="text-red">*</span></label>
            <q-input v-model="expenditure_item.date" outlined dense type="date"  />
          </div>
          <div>
            <label for="credential" class="form_field">Comment</label>
            <q-input v-model="expenditure_item.comment" outlined dense autogrow />
          </div>

          <div>
            <label for="credential" class="form_field">Image</label>
            <q-uploader
              style="width:100%"
              url="http://localhost:4444/upload"
              label="Restricted to images"
              flat
              bordered
              multiple
              accept="image/jpg, image/png,image/jpeg"
              @rejected="onRejected"
            />
          </div>

          <div class="q-mt-md">
            <ButtonVue class="form_button" :label="label_save" :loading="loading" :color="color"
              :disabled="validateForm" :no_caps="no_caps">
            </ButtonVue>
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
export default {

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
        amount: null
      },
      position: "right",
      dialog: false,
      no_caps: true,
      expenditure_categories: [{ "lable": 1, "value": "Funerals" }]
    };
  },
  computed: {
    validateForm() {
      return this.expenditure_item.amount === null || this.expenditure_item.name === null || this.expenditure_item.expenditure_category_id === null || this.expenditure_item.date === null || this.expenditure_item.venue ? true : false;
    },
    checkIfExistExpenditureItem(){
      return this.expenditure_item.expenditure_category_id !== null && this.expenditure_item.name !== null && this.expenditure_item.amount ? true : false
    }
  },
  methods: {
    onAddExpenditureItem() {
      this.$emit("close-right-drawer");
    },
    onRejected(){}
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
