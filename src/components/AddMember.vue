<template>
  <div class="q-pa-sm">
    <div>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey q-pt-xs"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          name="Add Member"
          :label="$t('app.addMember')"
          no-caps
          icon="person_add"
        />
        <q-tab
          name="Upload File"
          :label="$t('app.uploadFile')"
          no-caps
          icon="file_upload"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Add Member">
          <div class="q-mx-md">
            <q-form @submit="onAddMember" class="q-gutter-md">
              <div class="text-subtitle2 text-left text-primary q-pt-xs">
                {{ $t("app.personalInformationLabel") }}
              </div>
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
                <label for="credential" class="form_field">{{
                  $t("app.emailLabel")
                }} <span class="text-red">*</span></label>
                <q-input v-model="user.email" outlined dense type="email" />
              </div>
              <div>
                <label for="credential" class="form_field"
                  >{{ $t("app.telephoneLabel") }}
                  <span class="text-red">*</span></label
                >
                <vue-tel-input
                  v-model="user.telephone"
                  defaultCountry="cm"
                  mode="international"
                  class="q-pa-xs"
                ></vue-tel-input>
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
                <q-input v-model="user.occupation" outlined dense type="text" />
              </div>
              <div class="flex q-mt-lg justify-end">
                <div>
                  <ButtonVue
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
        <q-tab-panel name="Upload File">
          <div>
            <q-form @submit="uploadFile">
              <div class="text-subtitle2 text-center text-primary">
                {{ $t("app.importMemberMsg") }}
                <span class="q-pl-md">
                  <q-btn flat @click="openHelp">
                    <q-icon name="help_outline" size="sm"> </q-icon>
                    <q-tooltip> {{ $t("app.help") }} </q-tooltip>
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
                    accept="xls, .xlsx, .xlsm, .csv"
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
      <q-card :style="{ width: image_width }" class="q-ma-md">
        <q-bar class="bg-primary">
          <div></div>
          <q-space />

          <q-btn dense flat icon="close" v-close-popup class="text-white">
            <q-tooltip>{{ $t("app.close") }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section
          class="row flex flex-center csv_image_card"
          @click="full_width = true"
        >
          <div>
            <div class="q-pb-md help_text">
              {{ $t("app.importMemberHelpMsg") }}
            </div>
            <div class="q-mx-lg">
              <q-img
                src="../assets/example_csv_upload.png"
                spinner-color="white"
                class="q-px-sm"
                style="width: 100%; height: 100%"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- example csv file to be uploaded in full width-->
    <q-dialog v-model="full_width" full-width>
      <q-card>
        <q-bar class="bg-primary">
          <div></div>
          <q-space />

          <q-btn dense flat icon="close" v-close-popup class="text-white">
            <q-tooltip>{{ $t("app.close") }}</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div class="q-pb-md help_text">
            {{ $t("app.importMemberHelpMsg") }}
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <q-img
            src="../assets/example_csv_upload.png"
            spinner-color="white"
            class="q-px-md"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import { VueTelInput } from "vue-tel-input";
export default {
  mixins: [memberMixinVue, organisationMixinVue],
  created() {
    let heading = this.$t("app.addMemberOrganisation");
    this.$emit("set-heading", heading);
  },
  data() {
    return {
      full_width: false,
      image_width: "370px",
      label_save: this.$t("app.saveBtnLabel"),
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
      label_upload: this.$t("app.import"),
      position: "right",
      dialog: false,
      no_caps: true,
      tab: this.$t("app.addMember"),
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
      let id = this.getOrganisationId;
      this.loading = true;
      let payload = {
        url: `/api/protected/organisations/${id}/add-users`,
        data: {
          name: this.user.name,
          telephone: this.user.telephone.replace(/\s+/g, ""),
          gender: this.user.gender,
          address: this.user.address,
          occupation: this.user.occupation,
          email: this.user.email,
        },
        msg: "Member added Successfully",
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
        .dispatch("postRequest", payload)
        .then(() => {
          this.getOrganisationMembers(id, true);
        })
        .finally(() => {
          this.loading = false;
          this.resetForm();
          this.$emit("close-right-drawer");
        });
    },
    openHelp() {
      this.dialog = true;
    },

    uploadFile(event) {
      const formData = new FormData();
      formData.append("file", this.file);
      let id = this.getOrganisationId;
      let payload = {
        url: `/api/protected/organisations/${id}/import-users`,
        msg: "Members uploaded successfully",
        data: formData,
        color: "default",
        show_feedback: true,
        status: "success",
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
      this.loading = true;
      this.$store
        .dispatch("uploadFileRequest", payload)
        .then(() => {
          this.getOrganisationMembers(id, true);
        })
        .finally(() => {
          this.loading = false;
          this.file = null;
          this.$emit("close-right-drawer");
        });
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
  },
  components: {
    ButtonVue,
    VueTelInput,
  },
};
</script>

<style src="vue-tel-input/dist/vue-tel-input.css"></style>
<style scoped lang="scss">
.csv_image_card {
  cursor: pointer;
}

.hint {
  color: $grey2;
  font-size: small;
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

.or_option {
  font-weight: bolder;
}

.help_text {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  text-align: center;
  align-items: center;
  letter-spacing: 0.01em;
}
</style>
