<template>
  <div class="q-pa-md">
    <div class="q-mt-md q-mx-md">
      <q-form @submit="onAddSaving" class="q-gutter-md">
        <div>
          <label for="name" class="form_field">Member Name <span class="text-red">*</span>
          </label>
          <q-select outlined dense v-model="saving.user_id" use-input hide-selected fill-input input-debounce="0"
            :options="getMembers" @filter="filterMembers" :disable="isMemberExist">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div>
          <label for="credential" class="form_field q-mt-ms">Amount <span class="text-red">*</span></label>
          <q-input v-model="saving.amount_deposited" outlined dense type="number" />
        </div>
        <div>
          <label for="credential" class="form_field">Comment <span class="text-red">*</span></label>
          <q-input v-model="saving.comment" outlined dense type="textarea"
            placeholder="Provide any comment about this saving" />
        </div>
        <div class="row q-mt-lg justify-end">
          <div class="col-md-2 col-sm-2 col-xs-2">
            <ButtonVue class="form_button" :label="label_save" :loading="loading" :color="color"
              :disabled="validateForm" :no_caps="no_caps">
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

  created() {
    let heading = "Member Savings Information";
    this.$emit("set-heading", heading);

    this.getOrganisationMembers(this.getOrganisationId, false);

    this.setFormFields(null);
  },
  data() {
    return {
      label_save: "Save",
      loading: false,
      color: "primary",
      saving: {
        user_id: null,
        amount_deposited: 0,
        comment: null,
        id: null,
      },
      position: "right",
      dialog: false,
      no_caps: true,
      members: [],
    };
  },
  computed: {
    validateForm() {
      return this.saving.user_id === null || this.saving.amount_deposited == 0
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
    getMembers() {
      let data = [];
      this.$store.getters.getMembers.forEach((ele) => {
        data.push({
          label: ele.name,
          value: ele.id,
        });
      });

      return data;
    },
    getUpdateMemberSaving() {
      return this.setFormFields(this.$store.getters.getUpdatedMemberSaving);
    },
  },

  watch: {
    getUpdateMemberSaving() {
      return this.setFormFields(this.$store.getters.getUpdatedMemberSaving);
    },
  },

  methods: {
    onAddSaving() {
      let payload = {
        url: this.setActionUrl(this.saving.id, this.saving.user_id.value),
        data: {
          user_id: this.saving.user_id.value,
          amount_deposited: this.saving.amount_deposited,
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

    filterMembers(val, update, abort) {
      let data = [];
      update(() => {
        let filtered = this.$store.getters.getMembers.filter((ele) =>
          ele.name.toLowerCase().includes(val.toLowerCase())
        );
        filtered.forEach((e) => {
          data.push({
            label: e.name,
            value: e.id,
          });
        });
      });

      return data;
    },

    setActionUrl(id, user_id) {
      let url = "";
      if (id === null || id === undefined) {
        url = `/api/protected/user-savings`;
      } else {
        url = `/api/protected/user-savings/${user_id}/${id}`; //the user_id of and the id of the saving to be updated
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
