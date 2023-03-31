<template>
  <div class="flex justify-center">
    <div>
      <q-avatar size="190px">
        <q-icon
          name="account_circle"
          size="190px"
          class="icon"
          v-if="getProfilePic == null"
        >
        </q-icon>
        <img
          :src="getProfilePic.picture"
          alt="User picture"
          v-if="getProfilePic != null"
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
    </div>
  </div>
</template>
<script>
import moment from "moment";

export default {
  mounted() {
    let heading = "Member Profile";
    this.$emit("set-heading", heading);

    let id = this.$store.getters.getCurrentMember.id;
    this.getMemberProfile(id);
  },
  data() {
    return {};
  },

  computed: {
    getMember() {
      return this.$store.getters.getCurrentMember;
    },

    getProfilePic() {
      let pic = null;
      if (this.getMember != null && this.getMember.picture != null) {
        pic = this.getMember.picture;
      }
      if (this.profile_picture != null) {
        pic = this.profile_picture;
      }

      return pic;
    },
  },

  methods: {
    openFileUpload() {
      document.getElementById("logo").click();
    },

    onFileChanged(e) {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
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
      this.$store.dispatch("uploadImageRequest", payload).then(() => {
        let get_file_payload = {
          url: `/api/v1/protected/file?directory=${directory}&fileCategory=${fileCategory}&fileName=${e.target.files[0].name}`,
          data: formData,
          show_feedback: false,
        };
        this.$store
          .dispatch("fetchUploadedImageRequest", get_file_payload)
          .then((res) => {
            let data = {
              name: this.profile.name,
              email: this.profile.email,
              gender: this.profile.gender,
              address: this.profile.address,
              occupation: this.profile.occupation,
              picture: res.data.fileDownloadUri,
            };
            this.profile_picture = res.data.fileDownloadUri;
            let update_user = {
              url: `/api/protected/users/${this.profile.id}`,
              data: data,
              status: "none",
              show_feedback: false,
            };
            this.$store.dispatch("putRequest", update_user).then(() => {
              // location.reload();
            });
          });
      });
    },

    getMemberProfile(id) {
      let payload = {
        url: `/api/protected/organisations/users/${id}`,
        data: "",
        status: "none",
        show_feedback: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_CURRENT_MEMBER",
        has_commit: true,
      };
      this.$store
        .dispatch("getRequest", payload)
        .then(() => {})
        .catch((e) => {});
    },
  },
};
</script>

<style scoped lang="scss">
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
  top: 30%;
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
