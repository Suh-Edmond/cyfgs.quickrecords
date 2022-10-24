<template>
  <div class="q-pa-sm">
    <div class="text_h6 text-center q-pt-xs q-pb-md add_member_title">
      Add Members to the Organisation
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
                <label for="credential" class="form_field"
                  >Name <span class="text-red">*</span></label
                >
                <q-input
                  v-model="user.name"
                  outlined
                  dense
                  type="text"
                />
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
                <q-input
                  v-model="user.email"
                  outlined
                  dense
                  type="email"
                />
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
                />
              </div>
              <div>
                <label for="credential" class="form_field"
                  >Address <span class="text-red">*</span></label
                >
                <q-input
                  v-model="user.address"
                  outlined
                  dense
                  type="text"
                />
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
              <div class="q-pt-md">
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
        <q-tab-panel name="Upload File">
          <div>
            <q-form>
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
                  <q-file
                    outlined
                    v-model="file"
                    dense
                    label="Choose file"

                    accept="xls, .xlsx,xlsm"
                    counter
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
                <div class="col-md-2 col-sm-12 col-xs-12 q-pb-md">
                  <ButtonVue
                    class="form_button"
                    :label="label_upload"
                    :loading="loading"
                    :color="color"
                    :disabled="validateFormUpload"
                    :no_caps="no_caps"
                    @click="uploadFile"
                  >
                  </ButtonVue>
                </div>
              </div>
            </q-form>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <q-dialog v-model="dialog" :position="position">
      <q-card style="width: 350px" class="q-ma-md">
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
              <q-img
                src="../assets/UB-Logo.png"
                spinner-color="white"
                style="height: 100%; width: 100%px"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
export default {
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
  },
  methods: {
    onAddMember() {
      this.$emit("close-right-drawer");
    },
    openHelp() {
      this.dialog = true;
    },
    uploadFile() {
      this.$emit("close-right-drawer");
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
  text-transform: capitalize;
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
