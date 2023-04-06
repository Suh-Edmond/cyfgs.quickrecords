<template>
  <div class="q-pa-sm">
    <div class="q-mx-md q-mt-md">
      <q-form @submit="onRegisterMember" class="q-gutter-md">
        <label class="hint"
          >All fields with <span class="text-red">*</span> are required</label
        >
        <div>
          <label for="credential" class="form_field"
            >Member's Name</label
          >
          <q-input
            v-model="user.user_id"
            outlined
            dense
            disable

          />
        </div>
        <div>
          <label for="credential" class="form_field"
            >Year <span class="text-red">*</span></label
          >
          <q-select v-model="user.year" outlined dense :options="years" label="Select year" />
        </div>
        <div>
          <label for="credential" class="form_field"
            >Amount </label
          >
          <q-input v-model="user.amount" outlined dense type="number" disable />
        </div>
        <div class="flex q-mt-lg justify-end">
          <div>
            <ButtonVue
              label="Save"
              :loading="loading"
              color="primary"
              :disabled="validateForm"
              :no_caps="true"
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
import memberMixinVue from "src/mixins/memberMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";

export default {
  mixins: [memberMixinVue, organisationMixinVue],
  mounted() {
    let heading = "Register Member to the Organisation";
    this.$emit("set-heading", heading);

    let id = this.$store.getters.getOrganisation.id;
    this.getOrganisationMembers(id, true);

    this.getRegistrationAmount();
  },
  data() {
    return {
      loading: false,
      registration_item:null,
      user: {
        user_id: this.$store.getters.getMemberToRegister.name,
        year: null,
        amount: 0.0,
      },
      years: [
        { label: "2022", value: "2022" },
        { label: "2023", value: "2023" },
        { label: "2024", value: "2024" },
        { label: "2025", value: "2025" },
      ],
    };
  },
  computed: {
    validateForm() {
      return this.user.amount == 0.0 ||
        this.user.user_id == null ||
        this.user.year == null
        ? true
        : false;
    },
  },
  methods: {
    onRegisterMember() {
      this.loading = true;
      let payload = {
        url: `/api/protected/members-registration`,
        data: {
          payment_item_id: this.registration_item.id,
          year: this.user.year.value,
          user_id: this.$store.getters.getMemberToRegister.id,
        },
        msg: "Member registered Successfully",
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
      this.$store
        .dispatch("postRequest", payload)
        .then(() => {
          let id = this.$store.getters.getOrganisation.id;
          this.getOrganisationMembers(id, true);
        })
        .finally(() => {
          this.loading = false;
          this.resetForm();
          this.$emit("close-right-drawer");
        });
    },

    resetForm() {
      this.user.user_id = null;
      this.user.amount = 0.0;
      this.user.year = null;

      return this.user;
    },

    getRegistrationAmount() {
      let payload = {
        status: "none",
        url: `/api/protected/payment-items/type`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: null,
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          if(res.data.length > 0){
            this.registration_item = res.data[0];
            this.user.amount = this.registration_item.amount
          }
        })
        .finally(() => {
        });
    },
  },
  components: {
    ButtonVue,
  },
};
</script>

<style scoped lang="scss">
.hint {
  color: $grey2;
  font-size: small;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}
</style>
