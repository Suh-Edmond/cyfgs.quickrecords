<template>
  <div class="q-pa-sm">
    <q-card class="my-card" flat>
      <div class="row">
        <div class="col col-md-4 col-sm-12 col-xs-12">
          <q-card-section class="text-center">
            <q-avatar size="190px">
              <q-icon
                name="account_circle"
                size="190px"
                class="icon"
                v-if="getUserInfo.picture == null"
              >
              </q-icon>
              <img
                :src="getUserInfo.picture"
                alt="User picture"
                v-if="getUserInfo.picture != null"
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
              <q-tooltip>Upload Picture</q-tooltip>
              </q-icon>
            </div>
            <p class="text_h6 q-pt-md">My Roles:</p>
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
              <div class="flex q-pb-lg">
                <label for="name" class="label"
                  ><span
                    ><q-icon
                      name="verified_user"
                      size="xs"
                      class="q-pr-xs"
                    ></q-icon></span
                  >Updated Date:
                  <span class="value date value_code">{{
                    getFormatedUpdatedDate
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
                  <q-btn
                  class="q-mr-lg"
                  label="Cancel"
                  color="primary"
                  no-caps
                  outline
                  @click="edit_profile = false"
                >
                </q-btn>
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
                  <q-btn
                  class="q-mr-lg"
                  label="Cancel"
                  color="primary"
                  no-caps
                  outline
                  @click="edit_password = false"
                >
                </q-btn>
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
import { LocalStorage } from "quasar";
import ButtonVue from "src/components/Button.vue";
import moment from "moment";
import organisationMixin from "src/mixins/organisationMixin.vue";
export default {
  mixins: [organisationMixin],

  mounted() {
    let storage_data = LocalStorage.getItem("data");
    if (
      storage_data.occupation == null ||
      storage_data.address == null ||
      storage_data.gender == null
    ) {
      this.getUser();
    }
  },

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
  },
  methods: {
    getUser() {
      let data = LocalStorage.getItem("data");
      let payload = {
        url: `/api/protected/organisations/users/${data.id}`,
        data: this.user,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: false,
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        show_spinner: false,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          data.address = res.data.address;
          data.occupation = res.data.occupation;
          data.gender = res.data.gender;
          LocalStorage.set("data", data);
        })
        .finally(() => {});
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
      let user = LocalStorage.getItem("data");
      let organisation = this.$store.getters.getOrganisation;
      let fileCategory = "IMAGES";
      let APP_NAME = "FINANCIAL_ASSISTANT_APP";
      let upload_folder = "PROFILE_PICTURES";
      let directory = `${APP_NAME}/${organisation.name}/${upload_folder}`;
      let payload = {
        url: `/api/v1/protected/upload-file?directory=${directory}&fileCategory=${fileCategory}`,
        data: formData,
        status: "none",
        show_feedback: false,
        msg: "Picture uploaded successfully",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
      };
      this.$store.dispatch("uploadImageRequest", payload).then((res) => {
        let get_file_payload = {
          url: `/api/v1/protected/file?directory=${directory}&fileCategory=${fileCategory}&fileName=${e.target.files[0].name}`,
          data: formData,
          show_feedback: false,
        };
        this.$store
          .dispatch("fetchUploadedImageRequest", get_file_payload)
          .then((res) => {
            let data = {
              name: user.name,
              email: user.email,
              gender: user.gender,
              address: user.address,
              occupation: user.occupation,
              picture: res.data.fileDownloadUri,
            };
            let update_user = {
              url: `/api/protected/users/${user.id}`,
              data: data,
              status: "none",
              show_feedback: false,
            };
            this.$store.dispatch("putRequest", update_user).then(() => {
              user.picture = res.data.fileDownloadUri;
              LocalStorage.set("data", user);
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
.camara {
  position: absolute;
  top: 50%;
  left: 60%;
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
</style>
