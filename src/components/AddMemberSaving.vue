<template>
  <div class="q-pa-md">
    <div class="q-ml-sm q-mb-lg">
      <label class="text-muted q-ml-sm instruction_info"
        >All fields with <span class="text-red">*</span> are required</label
      >
    </div>
    <div class="q-mt-md q-mx-md">
      <q-form @submit="onAddSaving" class="q-gutter-md">
        <div>
          <label for="name" class="form_field"
            >Member Name <span class="text-red">*</span>
          </label>
          <q-select
            outlined
            dense
            v-model="saving.user_id"
            :options="members"
            use-input
            input-debounce="0"
            @filter="filterFn"
            @input="stopSearch"
            clearable
            :disable="onMemberExist"
          >
          <template v-slot:append v-if="start_filtering">
              <q-spinner color="primary" size="1.2em" :thickness="5" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>

          </q-select>
        </div>
        <div>
          <label for="credential" class="form_field q-mt-ms"
            >Amount <span class="text-red">*</span></label
          >
          <q-input
            v-model="saving.amount_deposited"
            outlined
            dense
            type="number"
          />
        </div>
        <div>
          <label for="credential" class="form_field"
            >Comment </label
          >
          <q-input
            v-model="saving.comment"
            outlined
            dense
            type="textarea"
            placeholder="Provide any comment about this saving"
          />
        </div>
        <div class="flex q-mt-lg justify-end">
          <div>
            <ButtonVue
              class="form_button"
              :label="'Save'"
              :loading="loading"
              :color="'primary'"
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
import UserSavingMixinVue from "src/mixins/UserSavingMixin.vue";

export default {
  mixins: [memberMixinVue, organisationMixinVue, UserSavingMixinVue],

  mounted() {
    let heading = "Member Savings Information";
    this.$emit("set-heading", heading);

    this.getOrganisationMembers(this.getOrganisationId, false);

    this.getMembersFromState();
  },

  data() {
    return {
      loading: false,
      saving: {
        user_id: null,
        amount_deposited: 0,
        comment: null,
        id: null,
      },
      position: "right",
      dialog: false,
      members: [],
      start_filtering:false,
    };
  },
  computed: {
    validateForm() {
      return this.saving.user_id == null || this.saving.amount_deposited == 0
        ? true
        : false;
    },
    isMemberExist() {
      return this.saving.user_id !== null &&
        this.saving.amount_deposited != 0 &&
        this.saving.id != null
        ? true
        : false;
    },
    startSearch() {
      return this.saving.user_id === null ? false : true;
    },
    getUpdateMemberSaving() {
      return this.setFormFields(this.$store.getters.getUpdatedMemberSaving);
    },
    onMemberExist(){
      return this.$store.getters.getUpdatedMemberSaving != null
    }
  },

  watch: {
    getUpdateMemberSaving() {
      return this.setFormFields(this.$store.getters.getUpdatedMemberSaving);
    },
  },

  methods: {
    getMembersFromState() {
      this.$store.getters.getMembers.forEach((ele) => {
        this.members.push({
          label: ele.name,
          value: ele.id,
        });
      });
      return this.members;
    },

    onAddSaving() {
      let payload = {
        url: this.setActionUrl(this.saving.id, this.saving.user_id.value),
        data: {
          user_id: this.saving.user_id.value,
          amount_deposited: JSON.parse(this.saving.amount_deposited),
          comment: this.saving.comment,
          id: this.saving.id,
        },
        msg: "Member Saving save successfully",
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
      this.setDispatchAction(this.saving.id, payload);
    },

    filterFn(val, update, abort) {
      if (val.length < 1) {
        this.start_filtering = false;
        abort();
        return;
      }

      update(() => {
        this.members = [];
        this.start_filtering = true;
        this.members = this.getMembersFromState();
        this.members = this.members.filter((v) =>
          v.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.members;
      });
    },

    setActionUrl(id, user_id) {
      let url = "";
      if (id === null || id === undefined) {
        url = `/api/protected/user-savings`;
      } else {
        url = `/api/protected/user-savings/${user_id}/${id}`;
      }
      return url;
    },

    setDispatchAction(id, payload) {
      let organisation_id = this.getOrganisationId;
      this.loading = true;
      if (id === null || id === undefined) {
        this.$store
          .dispatch("postRequest", payload)
          .then(() => {
            this.getOrganisationMemberSavings(organisation_id);
          })
          .finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
            this.resetForm();
          });
      } else {
        this.$store
          .dispatch("putRequest", payload)
          .then(() => {
            this.getOrganisationMemberSavings(organisation_id);
            this.resetForm();
          })
          .finally(() => {
            this.$emit("close-right-drawer");

            this.loading = false;

            this.resetForm();

            this.$store.dispatch("setUpdatedMemberSaving", null);
          });
      }
    },

    resetForm() {
      this.saving.user_id = null;
      this.saving.amount_deposited = 0;
      this.saving.id = null;
      this.saving.comment = null;

      return this.saving;
    },

    setFormFields(data) {
      if (data != null) {
        (this.saving.user_id = { label: data.name, value: data.user_id }),
          (this.saving.amount_deposited = data.amount_deposited),
          (this.saving.comment = data.comment),
          (this.saving.id = data.id);
      }

      return this.saving;
    },

    stopSearch(){
      if(this.saving.user_id != null){
        this.start_filtering = false
      }
    }
  },
  components: {
    ButtonVue,
  },
};
</script>

<style scoped lang="scss">
.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.instruction_info {
  color: $grey2;
}
</style>
