<template>
  <div class="q-pa-sm">
    <div class="text_h6 text-center q-pt-xs q-pb-md add_member_title">
      Member Savings Information
    </div>
    <div>
      <div>
        <q-form @submit="onAddSaving" class="q-gutter-md">
          <div>
            <label for="name" class="form_field">Member Name <span class="text-red">*</span>
            </label>
            <q-input outlined dense v-model="saving.user_id" placeholder="Type name to search..." :loading="startSearch">
              <template v-slot:append v-if="!startSearch">
                <q-icon name="search" color="primary" />
              </template>
            </q-input>
          </div>
          <div>
            <label for="credential" class="form_field">Amount <span class="text-red">*</span></label>
            <q-input v-model="saving.amount_deposited" outlined dense type="number" />
          </div>
          <div>
            <label for="credential" class="form_field">Comment </label>
            <q-input v-model="saving.comment" outlined dense type="textarea"
              placeholder="Provide any comment about this saving" />
          </div>
          <div>
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
      saving: {
        user_id: null,
        amount_deposited: 0,
        comment: null,
      },
      position: "right",
      dialog: false,
      no_caps: true,
      members: [
        "Mary",
        "John",
        "Joe",
        "Paul",
        "Peter",
        "Lum",
        "Bih",
        "Jerry",
        "Moses",
      ],
    };
  },
  computed: {
    validateForm() {
      return this.saving.user_id === null || this.saving.amount_deposited == 0
        ? true
        : false;
    },
    isMemberExist() {
      return this.saving.user_id !== null && this.saving.amount_deposited !== 0
        ? false
        : true;
    },
    startSearch(){
      return this.saving.user_id === null ? false : true
    }
  },
  methods: {
    onAddSaving() {
      this.$emit("close-right-drawer");
    },
    filterMembers(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.members = this.members.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
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
