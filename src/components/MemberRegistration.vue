<template>
  <div class="q-pa-sm">
    <div class="q-mx-md q-mt-lg">
      <q-form @submit="onRegisterMember" class="q-gutter-md">
        <div>
          <label for="credential" class="form_field"
            >Member's Name</label
          >
          <q-input
            v-model="user.user_name"
            outlined
            dense
            disable

          />
        </div>
        <div>
          <label for="credential" class="form_field"
            >Year</label
          >
          <q-input v-model="user.year" outlined dense disable/>
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
              :no_caps="true"
              :disabled="false"
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
  },
  data() {
    return {
      loading: false,
      user: {
        user_name: this.$store.getters.getMemberToRegister != null ? this.$store.getters.getMemberToRegister.name : null,
        year: this.$store.getters.getCurrentYear != null ? this.$store.getters.getCurrentYear.year : null,
        amount: this.$store.getters.getRegAmount != null ? this.$store.getters.getRegAmount[0].amount : null,
      },
    };
  },
  computed: {
  },
  methods: {
    onRegisterMember() {
      this.loading = true;
      let payload = {
        url: `/api/protected/members-registration`,
        data: {
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
