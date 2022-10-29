<template>
  <div class="q-pa-sm">

    <div
      class="text_h6 text-center q-pt-xs q-pb-md add_member_title">
      Expenditure Category Information
    </div>
    <div>
      <div>
        <q-form @submit="onAddExpenditureCategory" class="q-gutter-md">
          <div>
            <label for="credential" class="form_field"
              >Name <span class="text-red">*</span></label
            >
            <q-input
              v-model="expenditure.name"
              outlined
              dense
              type="text"
            />
          </div>
          <div>
            <label for="credential" class="form_field"
              >Description <span class="text-red">*</span></label
            >
            <q-input
              v-model="expenditure.description"
              outlined
              dense
              type="textarea"
              placeholder="Please provide a description about the category"
            />
          </div>
          <div>
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
      expenditure: {
        name: null,
        description: null,
      },
      position: "right",
      dialog: false,
      no_caps: true,
    };
  },
  computed: {
    validateForm() {
      return this.expenditure.name === null ? true : false;
    },
  },
  methods: {
    onAddExpenditureCategory() {
      this.$emit("close-right-drawer");
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
