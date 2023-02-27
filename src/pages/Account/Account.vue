<template>
  <div class="q-pa-sm">
    <q-card class="my-card" flat>
      <div class="row">
        <div class="col col-md-4 col-sm-12 col-xs-12">
          <q-card-section class="text-center">
            <q-avatar size="190px">
              <q-icon name="account_circle" size="190px" class="icon"> </q-icon>
            </q-avatar>
            <p class="text_h6">My Roles:</p>
            <div>
              <q-chip
                size="md"
                color="primary"
                text-color="white"
                v-for="(item, index) in getUserInfo.roles"
                :key="index"
              >
                {{ item.name }}
              </q-chip>
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
                  <label for="info" class="info">Personal information</label>
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
                    <q-tooltip>Edit Profile</q-tooltip>
                  </q-icon>
                </div>
              </div>
              <div class="flex q-pb-md">
                <label for="name" class="label"
                  ><span
                    ><q-icon name="person" class="q-pr-xs person_icon"></q-icon
                  ></span>
                  Name:
                  <span class="value q-pl-xl value_code">{{
                    getUserInfo.name
                  }}</span></label
                >
              </div>
              <div class="flex q-pb-md">
                <label for="name" class="label"
                  ><span
                    ><q-icon
                      name="female"
                      v-if="getUserInfo.gender == 'FEMALE'"
                      class="q-pr-xs gender_icon"
                    ></q-icon
                  ></span>
                  <span
                    ><q-icon
                      name="male"
                      v-if="getUserInfo.gender == 'MALE'"
                      class="q-pr-xs gender_icon"
                    ></q-icon
                  ></span>
                  Gender:
                  <span class="value value_code gender">{{
                    getUserInfo.gender
                  }}</span></label
                >
              </div>
              <div class="flex q-pb-lg">
                <label for="name" class="label"
                  ><span
                    ><q-icon
                      name="email"
                      size="xs"
                      class="q-pr-sm"
                    ></q-icon></span
                  >Email:
                  <span class="value value_code email">{{
                    getUserInfo.email
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
                  >Telephone:
                  <span class="value phone value_code">{{
                    getUserInfo.telephone
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
                  Address:
                  <span class="value address value_code">{{
                    getUserInfo.address
                  }}</span></label
                >
              </div>
              <div class="flex q-pb-lg">
                <label for="name" class="label"
                  ><span
                    ><q-icon name="work" size="xs" class="q-pr-xs"></q-icon
                  ></span>
                  Occupation:
                  <span class="value occupation value_code">{{
                    getUserInfo.occupation
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
                  >Created Date:
                  <span class="value date value_code">{{
                    getFormatedCreatedDate
                  }}</span></label
                >
              </div>
            </div>

            <!-- edit personal information -->
            <div class="q-pa-sm q-mb-lg" v-if="edit_profile">
              <q-form @submit="onUpdateProfile" class="q-gutter-md">
                <div class="info2 q-pb-md">Update Profile</div>
                <small class="hint"
                  >All fields with <span class="text-red">*</span> are
                  required</small
                >
                <div>
                  <label for="credential" class="form_field"
                    >Name <span class="text-red">*</span></label
                  >
                  <q-input v-model="user.name" outlined dense type="text" />
                </div>
                <div>
                  <label for="credential" class="form_field">Email</label>
                  <q-input v-model="user.email" outlined dense type="email" />
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
                  <q-input
                    v-model="user.occupation"
                    outlined
                    dense
                    type="text"
                  />
                </div>
                <div class="row justify-end">
                  <ButtonVue
                    label="Save"
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
                  <label for="info" class="security">Security</label>
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
                    <q-tooltip>Edit Password</q-tooltip>
                  </q-icon>
                </div>
              </div>
              <div class="flex q-pb-md">
                <label for="name" class="label"
                  ><span
                    ><q-icon name="key" class="q-pr-xs person_icon"></q-icon
                  ></span>
                  Password:
                  <span class="value password value_code"
                    >***********</span
                  ></label
                >
              </div>
            </div>

            <!-- edit user password -->
            <div class="q-pa-sm" v-if="edit_password">
              <q-form @submit="onUpdatePassword" class="q-gutter-md">
                <div class="info q-pb-md">Update Password</div>
                <small class="hint"
                  >All fields with <span class="text-red">*</span> are
                  required</small
                >
                <div>
                  <label for="password" class="form_field">Old Password</label>
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
                  <label for="password" class="form_field">New Password</label>
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
                  <label for="confirm_password" class="form_field"
                    >Confirm Password</label
                  >
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
                      <span class="text-red">Password must match</span>
                    </template>
                  </q-input>
                </div>
                <div class="row justify-end">
                  <ButtonVue
                    label="Save"
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
import { LocalStorage, Notify, Platform } from "quasar";
import ButtonVue from "src/components/Button.vue";
import moment from "moment";
export default {
  data() {
    return {
      user: {
        name: LocalStorage.getItem("data").name,
        email: LocalStorage.getItem("data").email,
        address: LocalStorage.getItem("data").address,
        occupation: LocalStorage.getItem("data").occupation,
        user_id: LocalStorage.getItem("data").id,
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
    };
  },
  computed: {
    getUserInfo() {
      const data = LocalStorage.getItem("data");
      return data;
    },

    getFormatedCreatedDate() {
      return moment(LocalStorage.getItem("data").created_at).format(
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
  },
  methods: {
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
          LocalStorage.set("data", res.data.data);
          LocalStorage.set("has_logged_in", true);
          this.edit_profile = false;
        })
        .finally(() => {
          this.loading = false;
          location.reload();
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
      let directory =
        FileConstants.APP_NAME +
        "/" +
        this.organisation.name +
        "/" +
        FileConstants.LOGOS;
      let payload = {
        url: `/api/v1/protected/upload-file?directory=${directory}&fileCategory=${FileConstants.IMAGES}`,
        data: formData,
        status: "none",
        show_feedback: false,
        msg: "Logo uploaded successfully",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
      };
      this.$store.dispatch("uploadImageRequest", payload).then((res) => {
        let get_file_payload = {
          url: `/api/v1/protected/file?directory=${directory}&fileCategory=${FileConstants.IMAGES}&fileName=${e.target.files[0].name}`,
          data: formData,
          show_feedback: false,
        };
        this.$store
          .dispatch("fetchUploadedImageRequest", get_file_payload)
          .then((res) => {
            this.organisation.logo = res.data.fileDownloadUri;
            let update_organisation = {
              url: `/api/protected/organisations/${this.$store.getters.getOrganisation.id}`,
              data: { logo: res.data.fileDownloadUri },
              status: "none",
              show_feedback: false,
            };
            this.$store.dispatch("putRequest", update_organisation).then(() => {
              location.reload();
            });
          });
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

.camara_icon {
  left: 0;
  right: 5rem;
  top: 100;
}
.edit_icon {
  cursor: pointer;
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
</style>
