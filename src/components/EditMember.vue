<template>
  <div class="q-pa-xs">
    <div class="text_h6 text-center q-pt-xs q-pb-md add_member_title">
      Update Member Information
    </div>
    <div>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          name="Personal Information"
          label="Personal Information"
          no-caps
          icon="person"
        />
        <q-tab name="Member Roles" label="Member Roles" no-caps icon="person" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Personal Information">
          <div>
            <q-form @submit="onUpdateMember" class="q-gutter-md">
              <div>
                <label for="credential" class="form_field"
                  >Name <span class="text-red">*</span></label
                >
                <q-input v-model="user.name" outlined dense type="text" />
              </div>
              <div>
                <label for="credential" class="form_field"
                  >Gender <span class="text-red">*</span></label
                >
                <q-select
                  v-model="user.gender"
                  outlined
                  dense
                  :options="gender_options"
                />
              </div>
              <div>
                <label for="credential" class="form_field">Email</label>
                <q-input v-model="user.email" outlined dense type="email" />
              </div>
              <div>
                <label for="credential" class="form_field"
                  >Telephone <span class="text-red">*</span></label
                >
                <q-input v-model="user.telephone" outlined dense type="tel" />
              </div>
              <div>
                <label for="credential" class="form_field"
                  >Address <span class="text-red">*</span></label
                >
                <q-input v-model="user.address" outlined dense type="text" />
              </div>
              <div>
                <label for="credential" class="form_field"
                  >Occupation <span class="text-red">*</span></label
                >
                <q-input v-model="user.occupation" outlined dense type="text" />
              </div>
              <div class="col-md-2 col-sm-12 col-xs-12">
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
        </q-tab-panel>
        <q-tab-panel name="Member Roles">
          <div>
            <div class="flex" v-for="role in userRoles" :key="role.id">
              <div>
                <label for="role" class="role"> {{role.name}} </label>
              </div>
              <q-space />
              <div>
                <q-btn flat round @click="removeRole">
                  <q-icon name="close" color="negative">
                    <q-tooltip>Remove</q-tooltip>
                  </q-icon>
                </q-btn>
              </div>
            </div>
            <q-separator spaced />
            <div>
              <div class="row q-gutter-sm q-pt-md">
                <div class="col-md-8 col-sm-12 col-xs-12">
                  <q-select
                    outlined
                    v-model="role"
                    :options="all_roles"
                    dense
                    label="Select Role"
                  >
                  </q-select>
                </div>
                <div class="col-md-1 col-sm-12 col-xs-12"></div>
                <div class="col-md-2 col-sm-12 col-xs-12">
                  <ButtonVue
                    class="form_button"
                    :label="label_add_role"
                    :loading="loading"
                    :color="color"
                    :disabled="validateAddRoleForm"
                    :no_caps="no_caps"
                    @click="addRole"
                  >
                  </ButtonVue>
                </div>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <q-dialog v-model="show_dialog" :position="position">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" class="warning_image" size="40px" />
          <span class="q-ml-sm text-dark"
            >Are you sure you want to remove this role ?</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" class="text-color" v-close-popup no-caps />
          <q-btn flat :label="label" color="primary" v-close-popup no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import ButtonVue from "src/components/Button.vue";
import organisationMixin from "src/mixins/organisationMixin.vue";
import memberMixin from "src/mixins/memberMixin.vue";

export default {
  mixins:[organisationMixin, memberMixin],
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.setFormField();
    this.getUserRoles(this.data.id);
  },
  data() {
    return {
      label_save: "Save",
      loading: false,
      color: "primary",
      no_caps: true,
      user: {
        name: null,
        email: null,
        telephone: null,
        address: null,
        occupation: null,
        gender: null,
      },
      gender_options: ["MALE", "FEMALE", "OTHER"],
      tab: "Personal Information",
      label_add_role: "Add",
      role: null,
      all_roles: ["PRESIDENT", "TREASUERER", "FINANCIAL_SECRETARY", "AUDITOR"],
      label: "Remove",
      position: "right",
      message: "Are you sure  you want to remove this role ?",
      show_dialog: false,
      user_roles:[],
    };
  },
  computed: {
    validateForm() {
      return this.user.name === null ||
        this.user.telephone === null ||
        this.user.address === null ||
        this.user.address === null ||
        this.user.occupation === null ||
        this.user.gender === null
        ? true
        : false;
    },
    validateAddRoleForm() {
      return this.role == null ? true : false;
    },
    userRoles(){
      return this.user_roles;
    }
  },
  methods: {
    onUpdateMember() {
      let payload = {
        url: `/api/protected/users/${this.data.id}`,
        data: this.user,
        msg: "Member information updated Successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      let organisation_id = this.getOrganisationId;
      this.loading = true;

      this.$store.dispatch("putRequest", payload).then((res) => {
        console.log(organisation_id);
        this.getOrganisationMembers(organisation_id);
        this.resetForm();
      }).finally(() => {
        this.loading = false;
        this.$emit("close-right-drawer");
      })
    },
    addRole() {
      let payload = {
        url: `/api/protected/roles`,
        msg: "Role added successfully",
        data:{user_id:this.data.id, role:this.role.value},
        color: "default",
        to_on_ok: "none",
        status:"none",
        to_on_fail: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit:false,
        commit:"none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      }
      this.loading = true;
      this.$store.dispatch("postRequest", payload).then(() => {
        this.loading = false;
        this.getUserRoles(this.data.id);
      });
    },
    removeRole() {
      this.show_dialog = true;
    },
    setFormField() {
      (this.user.name = this.data.name), (this.user.email = this.data.email);
      this.user.telephone = this.data.telephone;
      this.user.address = this.data.address;
      this.user.occupation = this.data.occupation;
      this.user.gender = this.data.gender;

      return this.user;
    },

    getOrganisationMembers(id) {
      console.log(id);
      let payload = {
        url: `/api/protected/organisations/${id}/users`,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        status:"none",
        to_on_fail: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit:true,
        commit:"SET_MEMBERS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$emit("start-loading", true);
      this.$store.dispatch("getRequest", payload).then((res) => {
      }).finally(() => {
        this.$emit("start-loading", false);
      })
    },
    resetForm() {
      this.user.name = null;
      this.user.email = null;
      this.user.telephone = null;
      this.user.address = null;
      this.user.occupation = null;
      this.user.gender = null;

      return this.user
    },
    getUserRoles(id){
      let payload = {
        url: `/api/protected/roles/users/${id}`,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        status:"none",
        to_on_fail: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit:false,
        commit:"none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      }
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.user_roles = res.data
      })
    }

  },
  components: {
    ButtonVue,
  },
};
</script>
<style lang="scss" scoped>
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

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.form_button {
  width: 100%;
}

.role {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 27px;
  text-align: left;
  letter-spacing: 0.01em;
  color: #333333;
}

.warning_image {
  color: yellow;
}

.text-color {
  color: $grey2;
}
</style>
