<template>
  <div class="q-pa-xs">
    <div>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey q-pt-sm"
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
        <q-tab
          name="Member Roles"
          label="Member Roles"
          no-caps
          icon="person"
          v-if="canEditUserRole"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Personal Information">
          <div class="q-mx-lg q-pt-md">
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
                  disable
                  readonly
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
                <q-input
                  v-model="user.telephone"
                  outlined
                  dense
                  type="tel"
                  mask="(+###) ### - ### - ###"
                  unmasked-value
                  disable
                  readonly
                />
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
              <div class="row q-mt-lg justify-end">
                <div class="col-md-2 col-sm-2 col-xs-2 q-mt-xs">
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
        </q-tab-panel>
        <q-tab-panel name="Member Roles">
          <!-- spinners -->
          <div class="flex justify-center">
            <q-spinner-ios color="primary" size="1.7em" v-if="show_spinner" />
          </div>
          <div class="q-mx-sm" >
            <q-list v-if="!show_spinner">
              <q-item
                class="q-my-sm"
                v-ripple
              >
              <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" size="35px">
                    U</q-avatar
                  >
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{getRoleWithNameUser.name}}</q-item-label>
                  <q-item-label caption lines="1" class="text-sm"
                    >Updated by:
                    <span class="q-pl-sm">
                      {{getRoleWithNameUser.updated_by}}</span
                    ></q-item-label
                  >
                  <q-item-label caption lines="2"
                    >Updated on:
                    <span class="q-pl-sm"
                      >{{formDateTime(getRoleWithNameUser.updated_at)}}
                    </span></q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item
                v-for="role in user_roles"
                :key="role.name"
                class="q-my-sm"
                v-ripple
              >
                <q-item-section avatar v-if="role.name == 'PRESIDENT'">
                  <q-avatar color="primary" text-color="white" size="35px">
                    PP
                  </q-avatar>
                </q-item-section>
                <q-item-section
                  avatar
                  v-if="role.name == 'FINANCIAL_SECRETARY'"
                >
                  <q-avatar color="primary" text-color="white" size="35px">
                    FS
                  </q-avatar>
                </q-item-section>
                <q-item-section avatar v-if="role.name == 'TREASURER'">
                  <q-avatar color="primary" text-color="white" size="35px">
                    TR
                  </q-avatar>
                </q-item-section>
                <q-item-section avatar v-if="role.name == 'AUDITOR'">
                  <q-avatar color="primary" text-color="white" size="35px">
                    AU
                  </q-avatar>
                </q-item-section>
                <q-item-section v-if="role.name != 'USER'">
                  <q-item-label>{{ role.name }}</q-item-label>
                  <q-item-label caption lines="1" class="text-sm"
                    >Updated by:
                    <span class="q-pl-sm">
                      {{ role.updated_by }}</span
                    ></q-item-label
                  >
                  <q-item-label caption lines="2"
                    >Updated on:
                    <span class="q-pl-sm"
                      >{{ formDateTime(role.updated_at) }}
                    </span></q-item-label
                  >
                </q-item-section>

                <q-item-section side v-if="role.name !== 'USER'">
                  <q-btn flat round @click="showRemoveRoleDialog(role)">
                    <q-icon name="close" color="negative">
                      <q-tooltip>Remove</q-tooltip>
                    </q-icon>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>

            <q-separator spaced />
            <div>
              <q-form @submit="addRole">
                <div class="row q-gutter-sm q-pt-md">
                  <div class="col-md-8 col-sm-12 col-xs-12">
                    <q-select
                      outlined
                      v-model="role"
                      :options="getAvailableRoles"
                      dense
                      label="Select Role"
                    >
                    </q-select>
                  </div>
                  <div class="col-md-1 col-sm-12 col-xs-12"></div>
                  <div class="col-md-2 col-sm-12 col-xs-12" :class="$q.screen.lg ?'q-ml-md':''">
                    <ButtonVue
                      class="form_button"
                      :label="label_add_role"
                      :loading="loading"
                      :color="color"
                      :disabled="validateAddRoleForm"
                      :no_caps="no_caps"
                    >
                    </ButtonVue>
                  </div>
                </div>
              </q-form>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <q-dialog v-model="show_dialog" :position="position">
      <q-card>
        <q-card-section>
          <div>
            <q-avatar
              icon="warning"
              class="warning_image"
              size="30px"
              color="yellow"
              text-color="white"
            />
            <span class="q-ml-sm text-dark warning_text"
              >Are you sure you want to remove this role ?</span
            >
          </div>
          <div
            class="text-weight-medium text-center diaglog_info"
            v-if="show_dialog"
          >
            {{ role_deleted.name }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :label="label_cancel"
            color="primary"
            no_caps
            flat
            size="sm"
            v-close-popup
          ></q-btn>
          <q-btn
            :label="label"
            color="primary"
            size="sm"
            @click="removeUserRole"
            no_caps
            flat
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import ButtonVue from "src/components/Button.vue";
import organisationMixin from "src/mixins/organisationMixin.vue";
import memberMixin from "src/mixins/memberMixin.vue";
import { LocalStorage, Notify, Platform } from "quasar";
import roleMixinVue from "src/mixins/roleMixin.vue";
import moment from "moment";

export default {
  mixins: [organisationMixin, memberMixin, roleMixinVue],
  created() {
    let heading = "Update Member Information";
    this.$emit("set-heading", heading);
  },
  mounted() {
    if (this.checkCanEditUserRole()) {
      this.getAllRoles();
    }
  },
  data() {
    return {
      label_save: "Save",
      label_cancel: "Cancel",
      loading: false,
      color: "primary",
      can_edit_user_role: true,
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
      label: "Remove",
      position: "right",
      message: "Are you sure  you want to remove this role ?",
      show_dialog: false,
      user_roles: [],
      role_deleted: null,
      show_spinner: false,
    };
  },

  computed: {
    validateForm() {
      return this.user.name == null ||
        this.user.telephone == null ||
        this.user.address == null ||
        this.user.address == null ||
        this.user.occupation == null ||
        this.user.gender == null
        ? true
        : false;
    },
    validateAddRoleForm() {
      return this.role == null ? true : false;
    },
    getUpdatedMember() {
      return this.setFormField(this.getUpdatedMemberFromState());
    },

    getAvailableRoles() {
      let roles = [];
      this.$store.getters.getRoles
        .filter(
          (role) =>
            role.name === "TREASURER" ||
            role.name === "FINANCIAL_SECRETARY" ||
            role.name == "AUDITOR"
        )
        .forEach((role) => {
          roles.push({
            label: role.name,
            value: role.name,
          });
        });
      return roles;
    },

    canEditUserRole() {
      let has_president_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name === "PRESIDENT"
      );
      return has_president_role != undefined;
    },

    getRoleWithNameUser(){
      const role = this.user_roles.find((ele) => ele.name == 'USER');
      return role
    }
  },

  methods: {
    onUpdateMember() {
      let id = this.getUpdatedMemberFromState().id;
      let payload = {
        url: `/api/protected/users/${id}`,
        data: this.user,
        msg: "Member information updated Successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        show_feedback: true,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      let organisation_id = this.getOrganisationId;
      this.loading = true;

      this.$store
        .dispatch("putRequest", payload)
        .then(() => {
          this.getOrganisationMembers(organisation_id);
          this.resetForm();
        })
        .finally(() => {
          this.loading = false;
          this.$emit("close-right-drawer");
        });
    },

    addRole() {
      const role = this.user_roles.find((ele) => ele.name == this.role.value);

      if (role !== undefined) {
        Notify.create({
          type: "info",
          message: "Role already exist",
          position: Platform.is.mobile ? "bottom" : "top-right",
        });
      } else {
        let user_id = this.getUpdatedMemberFromState().id;
        let payload = {
          url: `/api/protected/roles`,
          msg: "Role added successfully",
          data: { user_id: user_id, role: this.role.value },
          color: "default",
          to_on_ok: "none",
          show_feedback: true,
          status: "none",
          to_on_fail: "none",
          error_msg:
            "Only one member of your organisation is allowed to have this Role",
          has_commit: false,
          commit: "none",
          to_be_store_data: {
            required: false,
            has_value: false,
            data: [],
          },
        };
        this.loading = true;
        this.$store.dispatch("postRequest", payload).then(() => {
          this.loading = false;
          this.role = null;
          this.getUserRoles(user_id);
        });
      }
    },

    getUserRoles(id) {
      let payload = {
        url: `/api/protected/roles/users/${id}`,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        status: "none",
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
      this.can_edit_user_role = this.checkCanEditUserRole();
      this.show_spinner = true;
      if (this.can_edit_user_role) {
        this.$store
          .dispatch("getRequest", payload)
          .then((res) => {
            this.user_roles = res.data;
          })
          .finally(() => {
            this.show_spinner = false;
          });
      }
    },

    removeUserRole() {
      let user_id = this.getUpdatedMemberFromState().id;
      let payload = {
        url: `/api/protected/roles/users/${user_id}?role=${this.role_deleted.name}`,
        msg: "Role removed successfully",
        color: "default",
        to_on_ok: "none",
        status: "success",
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
      this.$store.dispatch("deleteRequest", payload).then(() => {
        this.getUserRoles(user_id);
      });
    },

    showRemoveRoleDialog(role) {
      this.role_deleted = role;
      this.show_dialog = true;
    },

    setFormField(data) {
      this.user.name = data.name;
      this.user.email = data.email;
      this.user.telephone = data.telephone;
      this.user.address = data.address;
      this.user.occupation = data.occupation;
      this.user.gender = data.gender;

      this.getUserRoles(data.id);

      return this.user;
    },

    resetForm() {
      this.user.name = null;
      this.user.email = null;
      this.user.telephone = null;
      this.user.address = null;
      this.user.occupation = null;
      this.user.gender = null;

      return this.user;
    },

    getUpdatedMemberFromState() {
      return this.$store.getters.getUpdatedMember;
    },

    formDateTime(date) {
      return moment(date).format("MMMM Do YYYY");
    },

    checkCanEditUserRole() {
      let has_president_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name === "PRESIDENT"
      );
      return has_president_role != undefined;
    },
  },
  components: {
    ButtonVue,
  },

  watch: {
    getUpdatedMember() {
      this.setFormField(this.getUpdatedMemberFromState());
    },
  },
};
</script>
<style lang="scss" scoped>

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

.warning_text {
  font-size: small;
}

.diaglog_info {
  font-size: smaller;
}
</style>
