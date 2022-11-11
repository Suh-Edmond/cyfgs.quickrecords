<template>
  <div class="q-pa-sm">
    <div class="text_h6 text-center q-pt-xs q-pb-sm add_member_title">
      Add Members to the Organisation
    </div>
    <div>
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-tab name="Add Member" label="Add Member" no-caps icon="person_add" />
        <q-tab name="Upload File" label="Upload File" no-caps icon="file_upload" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Add Member">
          <div>
            <q-form @submit="onAddMember" class="q-gutter-md">
              <div class="text-subtitle2 text-left text-primary">
                Personal Information
              </div>
              <div>
                <label for="credential" class="form_field">Name <span class="text-red">*</span></label>
                <q-input v-model="user.name" outlined dense type="text" />
              </div>
              <div>
                <label for="credential" class="form_field">Gender <span class="text-red">*</span></label>
                <q-select v-model="user.gender" outlined dense :options="gender_options" />
              </div>
              <div>
                <label for="credential" class="form_field">Email</label>
                <q-input v-model="user.email" outlined dense type="email" />
              </div>
              <div>
                <label for="credential" class="form_field">Telephone <span class="text-red">*</span></label>
                <q-input v-model="user.telephone" outlined dense type="tel" />
              </div>
              <div>
                <label for="credential" class="form_field">Address <span class="text-red">*</span></label>
                <q-input v-model="user.address" outlined dense type="text" />
              </div>
              <div>
                <label for="credential" class="form_field">Occupation <span class="text-red">*</span></label>
                <q-input v-model="user.occupation" outlined dense type="text" />
              </div>
              <div>
                <ButtonVue class="form_button" :label="label_save" :loading="loading" :color="color"
                  :disabled="validateForm" :no_caps="no_caps">
                </ButtonVue>
              </div>
            </q-form>
          </div>
        </q-tab-panel>
        <q-tab-panel name="Upload File">
          <div>
            <q-form @submit="uploadFile">
              <div class="text-subtitle2 text-center text-primary">
                Import Members from an Excel File
                <span class="q-pl-md">
                  <q-btn flat @click="openHelp">
                    <q-icon name="help_outline" size="sm"> </q-icon>
                    <q-tooltip> Help </q-tooltip>
                  </q-btn>
                </span>
              </div>
              <div class="row q-gutter-md flex flex-center q-pt-md">
                <div class="col-md-8 col-sm-12 col-xs-12">
                  <q-file outlined v-model="file" dense label="Choose file" accept="xls, .xlsx, .xlsm, .csv" counter>
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
                <div class="col-md-2 col-sm-12 col-xs-12 q-pb-md">
                  <ButtonVue class="form_button" :label="label_upload" :loading="loading" :color="color"
                    :disabled="validateFormUpload" :no_caps="no_caps">
                  </ButtonVue>
                </div>
              </div>
            </q-form>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <q-dialog v-model="dialog" :position="position">
      <q-card style="width: 370px" class="q-ma-md">
        <q-bar>
          <div></div>
          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="row flex flex-center">
          <div>
            <div class="q-pb-sm help_text">
              Below is an Eample of an Excel file to be upload
            </div>
            <div>
              <q-img src="../assets/example_csv_upload.png" spinner-color="white"
                style="height: 100%; width: 100%" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import organisationMixinVue  from "src/mixins/organisationMixin.vue";

export default {
  mixins: [memberMixinVue, organisationMixinVue],
  mounted(){
    this.organisation_id = this.getOrganisationId;
  },
  data() {
    return {
      label_save: "Save",
      loading: false,
      color: "primary",
      user: {
        name: null,
        email: null,
        telephone: null,
        address: null,
        occupation: null,
        gender: null,
      },
      gender_options: ["MALE", "FEMALE", "OTHER"],
      file: null,
      label_upload: "Import",
      position: "right",
      dialog: false,
      no_caps: true,
      tab: "Add Member",
    };
  },
  computed: {
    validateForm() {
      return this.user.name === null ||
        this.user.telephone == null ||
        this.user.gender == null ||
        this.user.address == null ||
        this.user.occupation == null
        ? true
        : false;
    },
    validateFormUpload() {
      return this.file == null ? true : false;
    },
    getOrganisationId(){
      return this.organisation_id;
    }
  },
  methods: {
    onAddMember() {
      let id = this.getOrganisationId
      this.loading = true;
      let payload = {
        url: `/api/protected/organisations/${id}/add-users`,
        data: this.user,
        msg: "Member added Successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit: true,
        commit: "SET_MEMBERS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("postRequest", payload).then((res) => {
        this.$emit("start-fetching-users", true);
        this.getOrganisationMembers(id, true);
      }).finally(() => {
        this.loading = false;
        this.resetForm();
        this.$emit("close-right-drawer");
      })
    },
    openHelp() {
      this.dialog = true;
    },

    uploadFile(event) {
      const formData = new FormData()
      formData.append("file", this.file);
      let id = this.getOrganisationId;
      let payload = {
        url: `/api/protected/organisations/${id}/import-users`,
        msg: "Members uploaded successfully",
        data: formData,
        color: "default",
        to_on_ok: "none",
        status: "none",
        to_on_fail: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "SET_MEMBERS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading = true;
      this.$store.dispatch("uploadFileRequest", payload).then((res) => {
        this.getOrganisationMembers(id);
      }).finally(() => {
        this.loading = false;
        this.$emit("close-right-drawer");
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
