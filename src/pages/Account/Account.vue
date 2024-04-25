<template>
  <div class="q-pa-sm">
    <q-linear-progress
      rounded
      indeterminate
      color="primary"
      v-show="is_fetch_picture"
    />
    <q-card class="my-card" flat>
      <div class="row">
        <div class="col col-md-4 col-sm-12 col-xs-12">
          <q-card-section>
            <div class="text-center">
              <q-avatar size="190px" v-if="canShowProfilePic">
                <img :src="getProfilePicture" :alt="$t('app.profilePicAlt')" />
              </q-avatar>
              <q-avatar
                size="150px"
                font-size="52px"
                color="grey-3"
                v-if="!canShowProfilePic"
              >
              </q-avatar>
              <div>
                <input
                  type="file"
                  accept="image/x-png,image/jpg,image/jpeg"
                  style="display: none"
                  id="logo"
                  @change="onFileChanged"
                />
                <q-icon
                  name="add_a_photo"
                  class="camara"
                  size="sm"
                  @click="openFileUpload"
                >
                  <q-tooltip>{{ $t("app.uploadPicture") }}</q-tooltip>
                </q-icon>
              </div>
            </div>
            <!-- member roles -->
            <div class="flex q-mt-md q-px-md">
              <div>
                <label for="role" class="role_heading"
                  ><span
                    ><q-icon
                      name="military_tech"
                      class="role_icon"
                    ></q-icon></span
                  >{{ $t("app.rolesName") }}:
                </label>
              </div>
              <q-space />
              <div></div>
            </div>
            <q-list class="q-mt-md">
              <q-item
                v-for="(role, index) in user.roles"
                :key="index"
                class="q-mb-md"
              >
                <q-item-section avatar v-if="role.name == 'MEMBER'">
                  <q-avatar color="primary" text-color="white" size="35px">
                    M</q-avatar
                  >
                </q-item-section>
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
                <q-item-section avatar v-if="role.name == 'ADMIN'">
                  <q-avatar color="primary" text-color="white" size="35px">
                    A
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="role_name">{{ role.name }}</q-item-label>
                  <q-item-label caption class="text-sm role_update_date"
                    >{{ $t("app.updatedBy") }}:
                    <span> {{ role.updated_by }}</span></q-item-label
                  >
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption class="role_update_date">
                    <span
                      >{{ formDateTime(role.created_at) }}
                    </span></q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </div>
        <div class="col col-1"></div>
        <div class="col col-md-6 col-sm-12 col-xs-12">
          <q-card-section>
            <!-- personal infomation -->
            <div class="q-pa-sm" v-if="!edit_profile">
              <div class="q-pa-sm row">
                <div>
                  <label for="info" class="info">{{
                    $t("app.personalInformationLabel")
                  }}</label>
                </div>
                <q-space />
                <div class="flex justify-end">
                  <q-icon
                    name="edit"
                    size="xs"
                    color="primary"
                    class="edit_icon"
                    @click="showEditProfile"
                  >
                    <q-tooltip>{{ $t("app.editProfile") }}</q-tooltip>
                  </q-icon>
                </div>
              </div>
              <div class="flex q-pb-md">
                <label for="name" class="label"
                  ><span
                    ><q-icon name="person" class="q-pr-xs person_icon"></q-icon
                  ></span>
                  {{ $t("app.nameLabel") }}:
                  <span class="value q-pl-xl value_code">{{
                    user.name
                  }}</span></label
                >
              </div>
              <div class="flex q-pb-md">
                <label for="name" class="label"
                  ><span
                    ><q-icon
                      name="female"
                      v-if="user.gender == 'FEMALE'"
                      class="q-pr-xs gender_icon"
                    ></q-icon
                  ></span>
                  <span
                    ><q-icon
                      name="male"
                      v-if="user.gender == 'MALE'"
                      class="q-pr-xs gender_icon"
                    ></q-icon
                  ></span>
                  <span class="q-pr-xs"></span>
                  {{ $t("app.gender") }}:
                  <span class="value value_code gender">{{ user.gender }}</span>
                  <span
                    class="value value_code q-pl-lg"
                    v-if="user.gender == null"
                    >{{ $t("app.notSet") }}</span
                  >
                </label>
              </div>
              <div class="flex q-pb-lg">
                <label for="name" class="label"
                  ><span
                    ><q-icon
                      name="email"
                      size="xs"
                      class="q-pr-sm"
                    ></q-icon></span
                  >{{ $t("app.emailLabel") }}:
                  <span class="value value_code email">{{
                    user.email
                  }}</span></label
                >
              </div>
              <div class="flex q-pb-lg">
                <label for="name" class="label"
                  ><span
                    ><q-icon
                      name="phone"
                      size="xs"
                      class="q-pr-xs"
                    ></q-icon></span
                  >{{ $t("app.telephoneLabel") }}:
                  <span class="value phone value_code">{{
                    user.telephone
                  }}</span></label
                >
              </div>
              <div class="flex q-pb-lg">
                <label for="name" class="label"
                  ><span
                    ><q-icon
                      name="location_on"
                      size="xs"
                      class="q-pr-xs"
                    ></q-icon
                  ></span>
                  {{ $t("app.addressLabel") }}:
                  <span class="value address value_code">{{
                    user.address
                  }}</span></label
                >
              </div>
              <div class="flex q-pb-lg">
                <label for="name" class="label"
                  ><span
                    ><q-icon name="work" size="xs" class="q-pr-xs"></q-icon
                  ></span>
                  {{ $t("app.occupation") }}:
                  <span class="value occupation value_code">{{
                    user.occupation
                  }}</span></label
                >
              </div>
              <div class="flex q-pb-lg">
                <label for="name" class="label"
                  ><span
                    ><q-icon
                      name="verified_user"
                      size="xs"
                      class="q-pr-xs"
                    ></q-icon></span
                  >{{ $t("app.createdDate") }}:
                  <span class="value date value_code">{{
                    getFormatedCreatedDate
                  }}</span></label
                >
              </div>
              <div class="flex q-pb-lg">
                <label for="name" class="label"
                  ><span
                    ><q-icon
                      name="verified_user"
                      size="xs"
                      class="q-pr-xs"
                    ></q-icon></span
                  >{{ $t("app.updatedDate") }}:
                  <span class="value date value_code">{{
                    getFormatedUpdatedDate
                  }}</span></label
                >
              </div>
            </div>

            <!-- edit personal information -->
            <div class="q-pa-sm q-mb-lg" v-if="edit_profile">
              <q-form @submit="onUpdateProfile" class="q-gutter-md">
                <div class="info2 q-pb-md">{{ $t("app.editProfile") }}</div>
                <small class="hint"
                  >{{ $t("app.warningField") }}<span class="text-red">*</span
                  >{{ $t("app.fields") }}</small
                >
                <div>
                  <label for="credential" class="form_field"
                    >{{ $t("app.nameLabel") }}
                    <span class="text-red">*</span></label
                  >
                  <q-input v-model="user.name" outlined dense type="text" />
                </div>
                <div>
                  <label for="credential" class="form_field"
                    >{{ $t("app.gender") }}
                    <span class="text-red">*</span></label
                  >
                  <q-select
                    v-model="user.gender"
                    outlined
                    dense
                    :options="gender_options"
                  />
                </div>
                <div>
                  <label for="credential" class="form_field"
                    >{{ $t("app.emailLabel") }}
                    <span class="text-red">*</span></label
                  >
                  <q-input
                    v-model="user.email"
                    outlined
                    dense
                    type="email"
                    disable
                  />
                </div>
                <div>
                  <label for="credential" class="form_field">{{
                    $t("app.telephoneLabel")
                  }}</label>
                  <q-input
                    v-model="user.telephone"
                    outlined
                    dense
                    type="text"
                  />
                </div>
                <div>
                  <label for="credential" class="form_field"
                    >{{ $t("app.addressLabel") }}
                    <span class="text-red">*</span></label
                  >
                  <q-input v-model="user.address" outlined dense type="text" />
                </div>
                <div>
                  <label for="credential" class="form_field"
                    >{{ $t("app.occupation") }}
                    <span class="text-red">*</span></label
                  >
                  <q-input
                    v-model="user.occupation"
                    outlined
                    dense
                    type="text"
                  />
                </div>
                <div class="row justify-end">
                  <q-btn
                    class="q-mr-lg"
                    :label="$t('app.cancel')"
                    color="primary"
                    no-caps
                    outline
                    @click="edit_profile = false"
                  >
                  </q-btn>
                  <ButtonVue
                    :label="$t('app.saveBtnLabel')"
                    :loading="loading"
                    color="primary"
                    :disabled="validateForm"
                    :no_caps="no_caps"
                  >
                  </ButtonVue>
                </div>
              </q-form>
            </div>

            <!-- security of profile -->
            <div class="q-pa-xs" v-if="!edit_password">
              <div class="q-pa-sm row">
                <div>
                  <label for="info" class="security">{{
                    $t("app.security")
                  }}</label>
                </div>
                <q-space />
                <div class="flex justify-end">
                  <q-icon
                    name="edit"
                    size="xs"
                    color="primary"
                    class="edit_icon"
                    @click="showEditPassword"
                  >
                    <q-tooltip>{{ $t("app.editProfile") }}</q-tooltip>
                  </q-icon>
                </div>
              </div>
              <div class="flex q-pb-md">
                <label for="name" class="label"
                  ><span
                    ><q-icon name="key" class="q-pr-xs person_icon"></q-icon
                  ></span>
                  {{ $t("app.passwordLabel") }}:
                  <span class="value password value_code"
                    >***********</span
                  ></label
                >
              </div>
            </div>

            <!-- edit user password -->
            <div class="q-pa-sm" v-if="edit_password">
              <q-form @submit="onUpdatePassword" class="q-gutter-md">
                <div class="info q-pb-md">{{ $t("app.editPassword") }}</div>
                <small class="hint"
                  >{{ $t("app.warningField") }}<span class="text-red">*</span
                  >{{ $t("app.fields") }}</small
                >
                <div>
                  <label for="password" class="form_field">{{
                    $t("app.oldPassword")
                  }}</label>
                  <q-input
                    v-model="security.old_password"
                    :type="is_pwd ? 'password' : 'text'"
                    outlined
                    dense
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="is_pwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="is_pwd = !is_pwd"
                      />
                    </template>
                  </q-input>
                </div>
                <div>
                  <label for="password" class="form_field">{{
                    $t("app.newPassword")
                  }}</label>
                  <q-input
                    v-model="security.password"
                    :type="is_old_pwd ? 'password' : 'text'"
                    outlined
                    dense
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="is_pwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="is_old_pwd = !is_old_pwd"
                      />
                    </template>
                  </q-input>
                </div>
                <div>
                  <label for="confirm_password" class="form_field">{{
                    $t("app.confirmPasswordLabel")
                  }}</label>
                  <q-input
                    v-model="security.password_confirmation"
                    :type="is_confirm_pwd ? 'password' : 'text'"
                    outlined
                    bottom-slots
                    dense
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="is_confirm_pwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="is_confirm_pwd = !is_confirm_pwd"
                      />
                    </template>
                    <template v-slot:hint v-if="validatePasswordMatch">
                      <span class="text-red">{{
                        $t("app.passwordNotMatchMsg")
                      }}</span>
                    </template>
                  </q-input>
                </div>
                <div class="row justify-end">
                  <q-btn
                    class="q-mr-lg"
                    :label="$t('app.cancel')"
                    color="primary"
                    no-caps
                    outline
                    @click="edit_password = false"
                  >
                  </q-btn>
                  <ButtonVue
                    :label="$t('app.saveBtnLabel')"
                    :loading="loading"
                    color="primary"
                    :disabled="validatePassword"
                    :no_caps="no_caps"
                  >
                  </ButtonVue>
                </div>
              </q-form>
            </div>
          </q-card-section>
        </div>
      </div>
    </q-card>

    <!-----------------------------------------------EDIT PROFILE DIALOG----------------------------------------->
    <q-dialog v-model="showEditProfileDialog" persistent>
      <q-card style="min-width: 360px">
        <q-form @submit="onUpdateProfile" class="q-gutter-sm q-pa-md">
          <div class="info2 q-pb-md flex">
            {{ $t("app.editProfile") }}
            <q-space />
            <span
              ><q-icon
                name="close"
                size="xs"
                class="q-pr-xs"
                @click="closeEditDialog"
              ></q-icon
            ></span>
          </div>
          <small class="hint"
            >{{ $t("app.warningField") }}<span class="text-red">*</span
            >{{ $t("app.fields") }}</small
          >
          <div>
            <label for="credential" class="form_field"
              >{{ $t("app.nameLabel") }} <span class="text-red">*</span></label
            >
            <q-input v-model="user.name" outlined dense type="text" />
          </div>
          <div>
            <label for="credential" class="form_field"
              >{{ $t("app.gender") }} <span class="text-red">*</span></label
            >
            <q-select
              v-model="user.gender"
              outlined
              dense
              :options="gender_options"
            />
          </div>
          <div>
            <label for="credential" class="form_field"
              >{{ $t("app.emailLabel") }} <span class="text-red">*</span></label
            >
            <q-input v-model="user.email" outlined dense type="email" />
          </div>
          <div>
            <label for="credential" class="form_field">{{
              $t("app.telephoneLabel")
            }}</label>
            <q-input
              v-model="user.telephone"
              outlined
              dense
              type="text"
              disable
            />
          </div>
          <div>
            <label for="credential" class="form_field"
              >{{ $t("app.addressLabel") }}
              <span class="text-red">*</span></label
            >
            <q-input v-model="user.address" outlined dense type="text" />
          </div>
          <div>
            <label for="credential" class="form_field"
              >{{ $t("app.occupation") }} <span class="text-red">*</span></label
            >
            <q-input v-model="user.occupation" outlined dense type="text" />
          </div>
          <div
            class="row justify-end"
            :class="$q.platform.is.mobile ? 'q-mb-lg q-mt-md' : ''"
          >
            <ButtonVue
              :label="$t('app.saveBtnLabel')"
              :loading="loading"
              color="primary"
              :disabled="validateForm"
              :no_caps="no_caps"
            >
            </ButtonVue>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <!-----------------------------------------------END OF EDIT PROFILE DIALOG---------------------------------->

    <!-----------------------------------------------EDIT PROFILE DIALOG----------------------------------------->
    <q-dialog v-model="showEditPasswordDialog" persistent>
      <q-card style="min-width: 360px">
        <q-form @submit="onUpdatePassword" class="q-gutter-sm q-pa-md">
          <div class="info q-pb-md flex">
            {{ $t("app.editPassword") }}
            <q-space />
            <span
              ><q-icon
                name="close"
                size="xs"
                class="q-pr-xs"
                @click="closeEditPasswordDialog"
              ></q-icon
            ></span>
          </div>
          <small class="hint"
            >{{ $t("app.warningField") }}<span class="text-red">*</span
            >{{ $t("app.fields") }}</small
          >
          <div>
            <label for="password" class="form_field">{{
              $t("app.oldPassword")
            }}</label>
            <q-input
              v-model="security.old_password"
              :type="is_pwd ? 'password' : 'text'"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon
                  :name="is_pwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="is_pwd = !is_pwd"
                />
              </template>
            </q-input>
          </div>
          <div>
            <label for="password" class="form_field">{{
              $t("app.newPassword")
            }}</label>
            <q-input
              v-model="security.password"
              :type="is_old_pwd ? 'password' : 'text'"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon
                  :name="is_pwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="is_old_pwd = !is_old_pwd"
                />
              </template>
            </q-input>
          </div>
          <div>
            <label for="confirm_password" class="form_field">{{
              $t("app.confirmPasswordLabel")
            }}</label>
            <q-input
              v-model="security.password_confirmation"
              :type="is_confirm_pwd ? 'password' : 'text'"
              outlined
              bottom-slots
              dense
            >
              <template v-slot:append>
                <q-icon
                  :name="is_confirm_pwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="is_confirm_pwd = !is_confirm_pwd"
                />
              </template>
              <template v-slot:hint v-if="validatePasswordMatch">
                <span class="text-red">{{
                  $t("app.passwordNotMatchMsg")
                }}</span>
              </template>
            </q-input>
          </div>
          <div
            class="row justify-end"
            :class="$q.platform.is.mobile ? 'q-mb-lg q-mt-md' : ''"
          >
            <ButtonVue
              :label="$t('app.saveBtnLabel')"
              :loading="loading"
              color="primary"
              :disabled="validatePassword"
              :no_caps="no_caps"
            >
            </ButtonVue>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <!-----------------------------------------------END OF EDIT PROFILE DIALOG---------------------------------->
  </div>
</template>

<script>
import { LocalStorage, Platform } from "quasar";
import ButtonVue from "src/components/Button.vue";
import moment from "moment";
import organisationMixin from "src/mixins/organisationMixin.vue";

export default {
  mixins: [organisationMixin],

  mounted() {},

  data() {
    return {
      user: {
        name: LocalStorage.getItem("data").user_data.name,
        email: LocalStorage.getItem("data").user_data.email,
        gender: LocalStorage.getItem("data").user_data.gender,
        address: LocalStorage.getItem("data").user_data.address,
        occupation: LocalStorage.getItem("data").user_data.occupation,
        user_id: LocalStorage.getItem("data").user_data.id,
        roles: LocalStorage.getItem("data").user_data.roles,
        picture: LocalStorage.getItem("data").user_data.picture,
        telephone: LocalStorage.getItem("data").user_data.telephone,
        status: LocalStorage.getItem("data").user_data.status,
      },
      security: {
        old_password: null,
        password: null,
        password_confirmation: null,
        user_id: LocalStorage.getItem("data").user_data.id,
      },
      loading: false,
      edit_profile: false,
      edit_password: false,
      is_pwd: true,
      is_confirm_pwd: true,
      is_old_pwd: true,
      no_caps: true,
      gender_options: ["MALE", "FEMALE", "OTHER"],
      is_fetch_picture: false,
      showEditProfileDialog: false,
      showEditPasswordDialog: false,
    };
  },
  computed: {
    canShowProfilePic() {
      return (
        this.user.picture != "" &&
        this.user.picture != null &&
        this.user.picture != undefined
      );
    },

    getFormatedCreatedDate() {
      return moment(LocalStorage.getItem("data").user_data.created_at).format(
        "MMMM Do YYYY"
      );
    },

    getFormatedUpdatedDate() {
      return moment(LocalStorage.getItem("data").user_data.updated_at).format(
        "MMMM Do YYYY"
      );
    },

    validateForm() {
      return (
        this.user.name == null ||
        this.user.address == null ||
        this.user.occupation == null
      );
    },

    validatePasswordMatch() {
      return (
        this.security.password != null &&
        this.security.password != this.security.password_confirmation
      );
    },

    validatePassword() {
      return (
        this.security.old_password == null ||
        this.security.password == null ||
        this.security.password_confirmation == null
      );
    },

    getProfilePicture() {
      return process.env.API_BASE_URL + this.user.picture;
    },
  },
  methods: {
    formDateTime(date) {
      return moment(date).format("MMMM Do YYYY");
    },

    onUpdateProfile() {
      this.loading = true;
      let payload = {
        url: `/api/protected/user/profile/update`,
        data: this.user,
        msg: "Profile Updated Successfully",
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
        .dispatch("putRequest", payload)
        .then((res) => {
          if (res.success) {
            LocalStorage.remove("data");
            LocalStorage.set("data", res.data);
          }
          this.edit_profile = false;
        })
        .finally(() => {
          if (Platform.is.mobile) {
            this.showEditProfileDialog = false;
          }
          this.loading = false;
        });
    },

    showEditProfile() {
      if (Platform.is.mobile) {
        this.showEditProfileDialog = true;
      } else {
        this.edit_profile = true;
      }
    },

    closeEditDialog() {
      return (this.showEditProfileDialog = false);
    },

    closeEditPasswordDialog() {
      return (this.showEditPasswordDialog = false);
    },

    showEditPassword() {
      if (Platform.is.mobile) {
        this.showEditPasswordDialog = true;
      } else {
        this.edit_password = true;
      }
    },

    onUpdatePassword() {
      this.loading = true;
      let payload = {
        url: `/api/protected/user/profile/password/update`,
        data: this.security,
        msg: this.$t("app.passwordUpdateSuccessMsg"),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: this.$t("app.passwordUpdateFailMsg"),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store
        .dispatch("putRequest", payload)
        .then((res) => {
          if (res.status == 200) {
            this.edit_password = false;
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.loading = false;
          this.resetForm();
          if (Platform.is.mobile) {
            this.showEditPasswordDialog = false;
          }
        });
    },

    resetForm() {
      this.security.password = null;
      this.security.old_password = null;
      this.security.password_confirmation = null;

      return this.security;
    },

    openFileUpload() {
      document.getElementById("logo").click();
    },

    onFileChanged(e) {
      this.is_fetch_picture = true;
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      let user = LocalStorage.getItem("data").user_data;

      let payload = {
        url: `/api/protected/upload_file?requester=MEMBER&file_category=${process.env.PROFILE_PICTURES}`,
        data: formData,
        status: "none",
        show_feedback: true,
        msg: this.$t("app.profilePicUploadSuccessMsg"),
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
      };

      this.$store
        .dispatch("uploadImageRequest", payload)
        .then((response) => {
          if (response.status == 200) {
            this.user.picture = response.data.data;
            let update_user = {
              url: `/api/protected/users/${user.id}`,
              data: {
                picture: this.user.picture,
              },
              msg: this.$t("app.profilePicUploadSuccessMsg"),
              color: "default",
              to_on_ok: "none",
              to_on_fail: "none",
              show_feedback: true,
              error_msg: this.$t("app.defaultErrorMsg"),
              has_commit: false,
              commit: "none",
              to_be_store_data: {
                required: false,
                has_value: false,
                data: [],
              },
            };
            this.$store.dispatch("putRequest", update_user).then(() => {
              const current_session =
                LocalStorage.getItem("data").current_session;
              let user_data = LocalStorage.getItem("data").user_data;
              user_data.picture = this.user.picture;
              LocalStorage.remove("data");
              LocalStorage.set("data", {
                user_data: user_data,
                current_session: current_session,
              });
            });
          }
        })
        .finally(() => {
          this.is_fetch_picture = false;
        });
    },
  },
  components: {
    ButtonVue,
  },
};
</script>

<style lang="scss" scoped>
.icon {
  color: $grey1;
  cursor: pointer;
}

.edit_icon {
  cursor: pointer;
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
.gender {
  padding-left: 2.5rem;
}
.text_h6 {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
}
.person_icon {
  font-size: 1.4rem;
}
.gender_icon {
  font-size: 1.4rem;
}
.email {
  padding-left: 3.5rem;
}
.camara {
  position: relative;
  left: 10%;
  top: -45px;
  cursor: pointer;
  color: $grey8;
}

.phone {
  padding-left: 2rem;
}

.address {
  padding-left: 2.6rem;
}

.occupation {
  padding-left: 1.4rem;
}

.date {
  padding-left: 1rem;
}

.label {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $grey5;
}
.info {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $primary;
}

.info2 {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $primary;
}

.security {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: red;
}

.password {
  padding-left: 2rem;
}
.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
  color: $dark;
}

.role_heading {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $primary;
}

.role_name {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 12.5px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $grey8;
}

.role_update_date {
  font-weight: 500;
}

.hint {
  color: $grey2;
  font-size: small;
}
</style>
