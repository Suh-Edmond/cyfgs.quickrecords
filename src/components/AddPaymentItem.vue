<template>
  <div class="q-pa-sm">
    <div class="text_h6 text-center q-pt-xs q-pb-md add_member_title">
      Payment Item Information
    </div>
    <div>
      <div>
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
            <q-input
              v-model="payment_item.amount"
              outlined
              dense
              type="number"
            />
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
                v-model="payment_item.complusory"
                val="YES"
                label="YES"
                size="xs"
              />
              <q-radio
                dense
                v-model="payment_item.complusory"
                val="NO"
                label="NO"
                size="xs"
              />
            </div>
          </div>
          <div>
            <label for="credential" class="form_field"
              >Description <span class="text-red">*</span></label
            >
            <q-input
              v-model="payment_item.description"
              outlined
              dense
              type="textarea"
              placeholder="Please provide a description about the category"
            />
          </div>
          <div class="q-pt-md">
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
      payment_category: {
        name: null,
        description: null,
      },
      position: "right",
      dialog: false,
      no_caps: true,
      payment_item: {
        complusory: "YES",
      },
    };
  },
  computed: {
    validateForm() {
      return this.payment_category.name === null ? true : false;
    },
  },
  methods: {
    onAddPaymentItem() {
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
