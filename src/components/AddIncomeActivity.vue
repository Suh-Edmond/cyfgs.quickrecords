<template>
  <div class="q-pa-sm">
    <div class="text_h6 text-center q-pt-xs q-pb-md add_member_title">
      Income Activity Information
    </div>
    <div>
        <q-form @submit="onAddIncomeActivity" class="q-gutter-sm">
          <div>
            <label for="credential" class="form_field">Name <span class="text-red">*</span></label>
            <q-input v-model="income_activity.name" outlined dense type="text" />
          </div>
          <div>
            <label for="credential" class="form_field">Amount <span class="text-red">*</span></label>
            <q-input v-model="income_activity.amount" outlined dense type="number" />
          </div>
          <div>
            <label for="credential" class="form_field">Venue <span class="text-red">*</span></label>
            <q-input v-model="income_activity.venue" outlined dense type="text" />
          </div>
          <div>
            <label for="credential" class="form_field">Date <span class="text-red">*</span></label>
            <q-input v-model="income_activity.date" outlined dense type="date"  />
          </div>
          <div>
            <label for="credential" class="form_field">Comment</label>
            <q-input v-model="income_activity.comment" outlined dense autogrow />
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
</template>
<script>
import ButtonVue from "src/components/Button.vue";
export default {

  data() {
    return {
      label_save: "Save",
      loading: false,
      color: "primary",
      income_activity: {
        venue: null,
        date: null,
        name: null,
        comment: null,
        amount: null
      },
      position: "right",
      dialog: false,
      no_caps: true,
    };
  },
  computed: {
    validateForm() {
      return this.income_activity.amount === null || this.income_activity.name === null || this.income_activity.expenditure_category_id === null || this.income_activity.date === null || this.income_activity.venue ? true : false;
    },
    checkIfExistExpenditureItem(){
      return this.income_activity.expenditure_category_id !== null && this.income_activity.name !== null && this.income_activity.amount ? true : false
    }
  },
  methods: {
    onAddIncomeActivity() {
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
