<template>
  <div class="q-pa-sm">
    <div>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey q-pt-xs"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          name="Registration"
          label="Registration"
          no-caps
          icon="person_add"
        />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Registration">
          <div class="q-mx-md q-mt-md">
            <q-form @submit="onRegisterMember" class="q-gutter-md">
              <label class="hint"
                >All fields with <span class="text-red">*</span> are
                required</label
              >
              <div>
                <label for="credential" class="form_field"
                  >Year <span class="text-red">*</span></label
                >
                <q-select v-model="user.year" outlined dense :options="years" />
              </div>
              <div>
                <label for="credential" class="form_field"
                  >Member <span class="text-red">*</span></label
                >
                <q-select
                  v-model="user.user_id"
                  outlined
                  dense
                  :options="fetchMembersFromStore"
                />
              </div>

              <div>
                <label for="credential" class="form_field"
                  >Amount <span class="text-red">*</span></label
                >
                <q-input v-model="user.amount" outlined dense type="number" />
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
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";

export default {
  mixins: [memberMixinVue, organisationMixinVue],
  created() {
    let heading = "Register Member(s) to the Organisation";
    this.$emit("set-heading", heading);

    let id = this.$store.getters.getOrganisation.id
    this.getOrganisationMembers(id, true);
  },
  data() {
    return {
      full_width: false,
      image_width: "370px",
      loading: false,
      user: {
        user_id: null,
        year: null,
        amount: 0.0,
      },
      years: [{"label":"2022", "value":"2022"}, {"label":"2023", "value":"2023"}, {"label":"2024", "value":"2024"}, {"label":"2025", "value":"2025"}],
      registered_members: [],
      dialog: false,
      tab: "Registration",
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

    fetchMembersFromStore() {
      let data = [];
      this.$store.getters.getMembers.forEach((member) => {
        data.push({
          label: member.name,
          value:member.id
        });
      });
      return data;
    },
  },
  methods: {
    onRegisterMember() {
      this.loading = true;
      let payload = {
        url: `/api/protected/members-registration`,
        data: {
          amount:this.user.amount,
          year :this.user.year.value,
          user_id:this.user.user_id.value
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
        .then(() => {})
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
    }
  },
  components: {
    ButtonVue,
  },
};
</script>

<style scoped lang="scss">
.csv_image_card {
  cursor: pointer;
}

.hint {
  color: $grey2;
  font-size: small;
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
  font-size: 12px;
  text-align: center;
  align-items: center;
  letter-spacing: 0.01em;
}
</style>
