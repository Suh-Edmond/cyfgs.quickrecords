<template>
  <div class="q-pa-sm">
    <div class="text_h6 text-center q-pt-xs q-pb-md add_member_title">
      Expenditure Item Detail Information
    </div>
    <div>
      <div>
        <q-form @submit="onAddExpenditureItemDetail" class="q-gutter-sm">
          <div>
            <label for="credential" class="form_field">Expenditure Item <span class="text-red">*</span></label>
            <q-select v-model="expenditure_item_detail.expenditure_item_id" outlined dense :disabled="checkIfExistExpenditureItemDetail"
              :options="expenditure_items" />
          </div>
          <div>
            <label for="credential" class="form_field">Name <span class="text-red">*</span></label>
            <q-input v-model="expenditure_item_detail.name" outlined dense type="text" />
          </div>
          <div>
            <label for="credential" class="form_field">Amount Given<span class="text-red">*</span></label>
            <q-input v-model="expenditure_item_detail.amount_given" outlined dense type="number" />
          </div>
          <div>
            <label for="credential" class="form_field">Amount Spent<span class="text-red">*</span></label>
            <q-input v-model="expenditure_item_detail.amount_spent" outlined dense type="number" />
          </div>
          <div>
            <label for="credential" class="form_field">Comment</label>
            <q-input v-model="expenditure_item_detail.comment" outlined dense autogrow />
          </div>

          <div>
            <label for="credential" class="form_field">Receipt(Optional)</label>
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
      expenditure_item_detail: {
        expenditure_item_id: null,
        amount_spent: null,
        name: null,
        comment: null,
        amount_given: null
      },
      position: "right",
      dialog: false,
      no_caps: true,
      expenditure_items: [{ "lable": 1, "value": "Funerals" }]
    };
  },
  computed: {
    validateForm() {
      return this.expenditure_item_detail.amount_given === null || this.expenditure_item_detail.name === null || this.expenditure_item_detail.expenditure_item_id === null || this.expenditure_item_detail.amount_spent === null ? true : false;
    },
    checkIfExistExpenditureItemDetail(){
      return this.expenditure_item_detail.expenditure_item_id !== null && this.expenditure_item_detail.name !== null && this.expenditure_item_detail.amount_given && this.expenditure_item_detail.amount_spent ? true : false
    }
  },
  methods: {
    onAddExpenditureItemDetail() {
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
