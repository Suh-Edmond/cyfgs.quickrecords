<template>
  <div class="q-pa-sm">
    <q-card class="my-card" flat>
      <div class="row">
        <div class="col col-md-4 col-sm-12 col-xs-12">
          <q-card-section>
            <div class="text-center">
              <q-avatar size="190px">
                <q-icon
                  name="account_circle"
                  size="190px"
                  class="icon"
                  v-if="user.picture == null"
                >
                </q-icon>
                <img
                  :src="getProfilePicture"
                  :alt="$t('app.profilePicAlt')"
                  v-if="user.picture != null"
                />
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
            <div class="q-mt-md">
              <q-list>
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
                  <q-item-section avatar v-if="role.name == 'AUDITOR'">
                    <q-avatar color="primary" text-color="white" size="35px">
                      AU
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="role_name">{{
                      role.name
                    }}</q-item-label>
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
            </div>
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
                  <label for="credential" class="form_field">{{
                    $t("app.emailLabel")
                  }}</label>
                  <q-input v-model="user.email" outlined dense type="email" />
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
  </div>
</template>

<script>
import { LocalStorage } from "quasar";
import ButtonVue from "src/components/Button.vue";
import moment from "moment";
import organisationMixin from "src/mixins/organisationMixin.vue";

export default {
  mixins: [organisationMixin],

  mounted() {
    this.getOrganisationInfo();
  },

  data() {
    return {
      user: {
        name: LocalStorage.getItem("data").name,
        email: LocalStorage.getItem("data").email,
        gender: LocalStorage.getItem("data").gender,
        address: LocalStorage.getItem("data").address,
        occupation: LocalStorage.getItem("data").occupation,
        user_id: LocalStorage.getItem("data").id,
        roles: LocalStorage.getItem("data").roles,
        picture: LocalStorage.getItem("data").picture,
        telephone: LocalStorage.getItem("data").telephone,
      },
      security: {
        old_password: null,
        password: null,
        password_confirmation: null,
        user_id: LocalStorage.getItem("data").id,
      },
      loading: false,
      edit_profile: false,
      edit_password: false,
      is_pwd: true,
      is_confirm_pwd: true,
      is_old_pwd: true,
      no_caps: true,
      gender_options: ["MALE", "FEMALE", "OTHER"],
    };
  },
  computed: {
    getFormatedCreatedDate() {
      return moment(LocalStorage.getItem("data").created_at).format(
        "MMMM Do YYYY"
      );
    },

    getFormatedUpdatedDate() {
      return moment(LocalStorage.getItem("data").updated_at).format(
        "MMMM Do YYYY"
      );
    },

    validateForm() {
      return this.user.name == null ||
        this.user.address == null ||
        this.user.occupation == null
        ? true
        : false;
    },

    validatePasswordMatch() {
      return (
        this.security.password != null &&
        this.security.password != this.security.password_confirmation
      );
    },

    validatePassword() {
      return this.security.old_password == null ||
        this.security.password == null ||
        this.security.password_confirmation == null
        ? true
        : false;
    },

    getProfilePicture() {
      return (
        process.env.FILE_API_URL +
        process.env.FILE_DOWNLOAD_PATH +
        this.user.picture
      );
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
          this.edit_profile = false;
          LocalStorage.remove("data");
          LocalStorage.set("data", res.data);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    showEditProfile() {
      return (this.edit_profile = true);
    },

    showEditPassword() {
      return (this.edit_password = true);
    },

    onUpdatePassword() {
      this.loading = true;
      let payload = {
        url: `/api/protected/user/profile/password/update`,
        data: this.security,
        msg: "Password Updated Successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg:
          "Old password did not match saved password! Please try again",
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
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      let user = LocalStorage.getItem("data");
      let organisation = this.$store.getters.getOrganisation;
      let directory = `${process.env.APP_NAME}/${organisation.name}/${process.env.PROFILE_PICTURES}`;
      let payload = {
        url: `/upload-file?directory=${directory}&fileCategory=${process.env.FILE_CATEGORY}`,
        data: formData,
        status: "none",
        show_feedback: true,
        msg: "Picture uploaded successfully",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
      };

      this.$store.dispatch("uploadImageRequest", payload).then((response) => {
        if (response.status == 200) {
          this.user.picture = response.data.fileDownloadUri.split(
            process.env.FILE_SEPARATOR_KEY
          )[1];
          let update_user = {
            url: `/api/protected/users/${user.id}`,
            data: {
              picture: this.user.picture,
            },
            status: "none",
            show_feedback: false,
          };
          this.$store.dispatch("putRequest", update_user).then(() => {
            this.user.picture = response.data.fileDownloadUri.split(
              process.env.FILE_SEPARATOR_KEY
            )[1];
            LocalStorage.remove("data");
            LocalStorage.set("data", user);
          });
        }
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
</style>
