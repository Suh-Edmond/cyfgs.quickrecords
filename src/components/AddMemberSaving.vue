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
          <q-select outlined dense v-model="saving.user_id" :options="members">
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
            >Comment <span class="text-red">*</span></label
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
              :label="label_save"
              :loading="loading"
              :color="color"
              :disabled="validateForm"
              :no_caps="no_caps"
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

    this.setFormFields(null);

    this.getMembers();

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
    getMembers() {
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
      // let data = [];
      // update(() => {
      //   let filtered = this.$store.getters.getMembers.filter((ele) =>
      //     ele.name.toLowerCase().includes(val.toLowerCase())
      //   );
      //   filtered.forEach((e) => {
      //     data.push({
      //       label: e.name,
      //       value: e.id,
      //     });
      //   });
      // });

      // return data;
      if (val === "") {
        // update(() => {
        //   this.members = stringOptions

        //   // with Quasar v1.7.4+
        //   // here you have access to "ref" which
        //   // is the Vue reference of the QSelect
        // })
        // return
        const needle = val.toLowerCase();
        this.members = this.members.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      }

      // update(() => {
      //   const needle = val.toLowerCase()
      //   this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      // })
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
