<template>
  <div class="q-pa-sm">
    <div class="text_h6 text-center q-pt-xs q-pb-md add_member_title" v-show="show_title">
      Add Payment Category
    </div>
    <div class="text_h6 text-center q-pt-xs q-pb-md add_member_title" v-show="!show_title">
      Payment Category Information
    </div>
    <div>
      <div>
        <q-form @submit="onAddPaymentCategory" class="q-gutter-md">
          <div>
            <label for="credential" class="form_field">Name <span class="text-red">*</span></label>
            <q-input v-model="payment_category.name" outlined dense type="text" />
          </div>
          <div>
            <label for="credential" class="form_field">Description <span class="text-red">*</span></label>
            <q-input v-model="payment_category.description" outlined dense type="textarea"
              placeholder="Please provide a description about the category" />
          </div>
          <div class="q-pt-md">
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
  props: {
    show_title: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      label_save: "Save",
      loading: false,
      color: "primary",
      payment_category: {
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
      return this.payment_category.name === null
        ? true
        : false;
    },
  },
  methods: {
    onAddPaymentCategory() {
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
