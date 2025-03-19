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
          :label="$t('app.personalInformationLabel')"
          no-caps
          icon="person"
        />
        <q-tab
          name="Member Roles"
          :label="$t('app.memberRoles')"
          no-caps
          icon="person"
          v-if="canEditUserRole"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Personal Information">
          <div class="q-ml-lg">
            <label class="text-muted"
              >{{$t('app.warningField')}}<span class="text-red">*</span>{{ $t('app.fields') }}</label>
          </div>
          <div class="q-mx-lg q-pt-md">
            <q-form @submit="onUpdateMember" class="q-gutter-md">
              <div>
                <label class="form_field"
                  >{{$t('app.nameLabel')}} <span class="text-red">*</span></label
                >
                <q-input v-model="user.name" outlined dense type="text" />
              </div>
              <div>
                <label class="form_field"
                  >{{$t('app.gender')}} <span class="text-red">*</span></label
                >
                <q-select
                  v-model="user.gender"
                  outlined
                  dense
                  :options="gender_options"
                  :disable="user.gender != null"
                />
              </div>
              <div>
                <label class="form_field">{{$t('app.emailLabel')}}</label>
                <q-input v-model="user.email" outlined dense type="email" />
              </div>
              <div>
                <label class="form_field"
                  >{{$t('app.telephoneLabel')}} <span class="text-red">*</span></label
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
                <label class="form_field"
                  >{{$t('app.addressLabel')}} <span class="text-red">*</span></label
                >
                <q-input v-model="user.address" outlined dense type="text" />
              </div>
              <div>
                <label class="form_field"
                  >{{$t('app.occupation')}} <span class="text-red">*</span></label
                >
                <q-input v-model="user.occupation" outlined dense type="text" />
              </div>
              <div class="row q-mt-lg justify-end">
                <div class="col-md-2 col-sm-2 col-xs-2 q-mt-xs">
                  <ButtonVue
                    class="form_button"
                    :label="this.$t('app.saveBtnLabel')"
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
          <div class="q-mx-sm" v-if="!show_spinner">
            <q-list>
              <q-item
                v-for="role in user_roles"
                :key="role.name"
                v-ripple
                class="q-mb-sm"
              >
                <q-item-section avatar v-if="role.name === 'MEMBER'">
                  <q-avatar color="primary" text-color="white" size="35px">
                    M</q-avatar
                  >
                </q-item-section>
                <q-item-section avatar v-if="role.name === 'PRESIDENT'">
                  <q-avatar color="primary" text-color="white" size="35px">
                    PP
                  </q-avatar>
                </q-item-section>
                <q-item-section
                  avatar
                  v-if="role.name === 'FINANCIAL_SECRETARY'"
                >
                  <q-avatar color="primary" text-color="white" size="35px">
                    FS
                  </q-avatar>
                </q-item-section>
                <q-item-section avatar v-if="role.name === 'TREASURER'">
                  <q-avatar color="primary" text-color="white" size="35px">
                    TR
                  </q-avatar>
                </q-item-section>
                <q-item-section avatar v-if="role.name === 'AUDITOR'">
                  <q-avatar color="primary" text-color="white" size="35px">
                    AU
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ role.name }}</q-item-label>
                  <q-item-label caption class="text-sm"
                    >{{$t('app.updatedBy')}}:
                    <span> {{ role.updated_by }}</span></q-item-label
                  >
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption>
                    <span
                      >{{ formDateTime(role.updated_at) }}
                    </span></q-item-label
                  >
                  <q-btn
                    flat
                    round
                    @click="showRemoveRoleDialog(role)"
                    v-if="role.name !== 'MEMBER'"
                  >
                    <q-icon name="close" color="negative">
                      <q-tooltip>{{$t('app.remove')}}</q-tooltip>
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
                      :label="$t('app.selectRole')"
                    >
                    </q-select>
                  </div>
                  <div class="col-md-1 col-sm-12 col-xs-12"></div>
                  <div
                    class="col-md-2 col-sm-12 col-xs-12"
                    :class="$q.screen.lg ? 'q-ml-md' : ''"
                  >
                    <ButtonVue
                      class="form_button"
                      :label="$t('app.add')"
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

    <q-dialog v-model="show_dialog" position="right">
      <q-card :style="{ width: image_width }">
        <q-card-section>
          <div class="text-left q-pb-md">
            <label class="text-dark message">{{$t('app.removeRoleWarningMsg')}}</label>
          </div>
          <div
            class="text-weight-medium text-left diaglog_info"
            v-if="show_dialog"
          >
            {{$t('app.member')}}: <span>{{ user.name }}</span>
          </div>
          <div
            class="text-weight-medium text-left diaglog_info q-pt-sm"
            v-if="show_dialog"
          >
           {{$t('app.role')}}: <span class="q-pl-lg">{{ role_deleted.name }}</span>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :label="this.$t('app.cancel')"
            color="primary"
            no_caps
            flat
            class="dialog_button"
            v-close-popup
          ></q-btn>
          <q-btn
            :label="this.$t('app.remove')"
            color="primary"
            class="dialog_button"
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
    let heading = this.$t('app.updateMemberInformation');
    this.$emit("set-heading", heading);
  },
  mounted() {
    if (this.checkCanEditUserRole()) {
      this.getAllRoles();
    }
  },
  data() {
    return {
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
      role: null,
      position: "right",
      image_width: "400px",
      message: this.$t('app.removeRoleWarningMsg'),
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
        this.user.address == null || false || this.user.occupation == null ||
        this.user.gender == null;
    },
    validateAddRoleForm() {
      return this.role == null;
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
            role.name === "AUDITOR"
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
      let has_president_role = LocalStorage.getItem("data").user_data.roles.find(
        (role) => role.name === "PRESIDENT"
      );
      return has_president_role !== undefined;
    },

    getRoleWithNameUser() {
      const role = this.user_roles.find((ele) => ele.name === "MEMBER");
      return role;
    },
  },

  methods: {
    onUpdateMember() {
      let id = this.getUpdatedMemberFromState().id;
      let payload = {
        url: `/api/protected/users/${id}`,
        data: this.user,
        msg: this.$t('app.updateMemberSuccessMsg'),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg:this.$t('app.defaultErrorMsg'),
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
          this.getOrganisationMembers(organisation_id, true);
          this.resetForm();
        })
        .finally(() => {
          this.loading = false;
          this.$emit("close-right-drawer");
        });
    },

    addRole() {
      const role = this.user_roles.find((ele) => ele.name === this.role.value);

      if (role !== undefined) {
        Notify.create({
          type: "info",
          message: this.$t('app.roleExistMsg'),
          position: Platform.is.mobile ? "bottom" : "top-right",
        });
      } else {
        let user_id = this.getUpdatedMemberFromState().id;
        let payload = {
          url: `/api/protected/roles`,
          msg: this.$t('app.roleAddedSuccessMsg'),
          data: { user_id: user_id, role: this.role.value },
          color: "default",
          to_on_ok: "none",
          show_feedback: true,
          status: "none",
          to_on_fail: "none",
          error_msg:this.$t('app.oneMemberRoleWarningMsg'),
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
      this.show_spinner = true;
      let payload = {
        url: `/api/protected/roles/users/${id}`,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        status: "none",
        to_on_fail: "none",
        error_msg: this.$t('app.defaultErrorMsg'),
        has_commit: false,
        show_feedback: false,
        show_spinner: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.can_edit_user_role = this.checkCanEditUserRole();
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
        msg: this.$t('app.roleRemoveSuccessMsg'),
        color: "default",
        to_on_ok: "none",
        status: "success",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: this.$t('app.defaultErrorMsg'),
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
      let has_president_role = LocalStorage.getItem("data").user_data.roles.find(
        (role) => role.name === "PRESIDENT"
      );
      return has_president_role !== undefined;
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
  font-size: 12px;
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

.dialog_button {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.text-color {
  color: $grey2;
}

.message {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.diaglog_info {
  font-size: small;
  color: red;
}
</style>
