<template>
  <q-page class="page">
    <div
      class="row q-px-sm"
      :class="$q.screen.lg ? 'q-pt-lg flex flex-center' : 'q-pt-sm'"
    >
      <div class="col-md-6 col-lg-6 col-sm-12 col-xs-12">
        <q-card class="q-mb-xl q-pa-md">
          <q-card-section>
            <div class="text_h6 text-center q-pt-sm q-pb-sm">
              {{ $t("app.createOrganisation") }}
            </div>
            <div class="text-subtitle2 text-center q-pb-xs">
              {{ $t("app.createOrganisationCaption") }}
            </div>
            <div class="validation_warning text-left q-my-sm">
              {{ $t("app.warningField") }}<span class="text-red">*</span>
              {{ $t("app.fields") }}
            </div>
            <q-form @submit="onSubmit">
              <div class="row q-my-md">
                <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                  <label for="credential" class="form_field"
                    >{{ $t("app.nameLabel") }}
                    <span class="text-red q-pl-xs">*</span></label
                  >
                  <q-input
                    v-model="organisation.name"
                    outlined
                    type="text"
                    dense
                  />
                </div>
              </div>
              <div class="row q-my-lg">
                <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                  <label for="credential" class="form_field"
                    >{{ $t("app.emailLabel") }}
                    <span class="text-red q-pl-xs">*</span></label
                  >
                  <q-input
                    dense
                    v-model="organisation.email"
                    outlined
                    type="email"
                  />
                </div>
              </div>
              <div class="row q-my-lg">
                <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                  <div>
                    <label for="credential" class="form_field flex"
                      >{{ $t("app.telephoneLabel") }}
                      <span class="text-red q-pl-xs">*</span><q-space />
                      <a
                        @click.prevent="showAddTelephone"
                        class="add_telephone"
                      >
                        <q-icon
                          name="add"
                          size="xs"
                          color="primary"
                          v-if="!show_telephone2"
                          ><q-tooltip>{{
                            $t("app.addTelephoneLabel")
                          }}</q-tooltip></q-icon
                        >
                        <q-icon
                          name="close"
                          size="xs"
                          color="primary"
                          v-if="show_telephone2"
                        >
                          <q-tooltip>{{ $t("app.remove") }}</q-tooltip>
                        </q-icon>
                      </a>
                    </label>
                    <vue-tel-input
                      v-model="organisation.telephone"
                      defaultCountry="cm"
                      mode="international"
                      class="q-pa-xs"
                    ></vue-tel-input>

                    <vue-tel-input
                      v-model="organisation.telephone2"
                      defaultCountry="cm"
                      mode="international"
                      class="q-pa-xs"
                      v-if="show_telephone2"
                    ></vue-tel-input>
                  </div>
                </div>
              </div>
              <div class="row q-my-lg">
                <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                  <div>
                    <label for="credential" class="form_field"
                      >{{ $t("app.addressLabel")
                      }}<span class="text-red q-pl-xs">*</span></label
                    >
                    <q-input
                      v-model="organisation.address"
                      outlined
                      type="text"
                      dense
                    />
                  </div>
                </div>
              </div>
              <div class="row q-my-lg">
                <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                  <div>
                    <label for="credential" class="form_field"
                      >{{ $t("app.salutation")
                      }}<span class="text-red q-pl-xs">*</span></label
                    >
                    <q-input
                      v-model="organisation.salutation"
                      outlined
                      type="text"
                      dense
                    />
                  </div>
                </div>
              </div>
              <div
                class="row justify-end q-mt-md q-mb-xl"
                v-show="!show_second_form"
              >
                <q-btn
                  @click="show_second_form = !show_second_form"
                  color="primary"
                  label="Continue"
                  no-caps
                  :disable="isValidFirstFormField"
                  ><q-icon
                    name="arrow_forward"
                    size="xs"
                    class="q-pl-sm"
                  ></q-icon
                ></q-btn>
              </div>
              <div v-show="show_second_form">
                <div class="row q-my-lg">
                  <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                    <div>
                      <label for="credential" class="form_field"
                        >{{ $t("app.boxLabel")
                        }}<span class="text-red q-pl-xs">*</span></label
                      >
                      <q-input
                        v-model="organisation.box_number"
                        outlined
                        type="number"
                        dense
                      />
                    </div>
                  </div>
                </div>
                <div class="row q-my-lg">
                  <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                    <div>
                      <label for="credential" class="form_field"
                        >{{ $t("app.region")
                        }}<span class="text-red q-pl-xs">*</span></label
                      >
                      <q-input
                        v-model="organisation.region"
                        outlined
                        type="text"
                        dense
                      />
                    </div>
                  </div>
                </div>
                <div class="row q-my-lg">
                  <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                    <div>
                      <label for="credential" class="form_field"
                        >{{ $t("app.logo") }}
                        <span class="text-red q-pl-xs">*</span></label
                      >
                      <q-file
                        accept="image/png,image/jpg,image/jpeg"
                        outlined
                        dense
                        v-model="organisation.logo"
                        label="Upload logo"
                      />
                    </div>
                  </div>
                </div>
                <div class="row q-my-lg">
                  <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                    <div>
                      <label for="credential" class="form_field"
                        >{{ $t("app.description") }}
                        <span class="text-red q-pl-xs">*</span></label
                      >
                      <q-input
                        v-model="organisation.description"
                        outlined
                        dense
                        type="textarea"
                      />
                    </div>
                  </div>
                </div>
                <div class="row flex justify-end q-mb-md q-gutter-md">
                  <div>
                    <ButtonVue
                      :label="$t('app.saveBtnLabel')"
                      :loading="loading"
                      :disabled="validateForm"
                      :color="color"
                      :no_caps="true"
                      class="submit_btn"
                    >
                    </ButtonVue>
                  </div>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import organisationMixin from "src/mixins/organisationMixin.vue";
import ButtonVue from "src/components/Button.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import UserSavingMixin from "src/mixins/UserSavingMixin.vue";
import { VueTelInput } from "vue-tel-input";
export default {
  name: "PageIndex",
  mixins: [organisationMixin, memberMixinVue, UserSavingMixin],
  data() {
    return {
      logo: null,
      organisation: {
        name: null,
        email: null,
        region: null,
        telephone: null,
        address: null,
        description: null,
        salutation: null,
        box_number: null,
        telephone2: null,
        id: null,
        logo: null,
      },
      label: this.$t("app.saveBtnLabel"),
      loading: false,
      color: "primary",
      show_telephone2: false,
      directory: "LOGOS",
      show_second_form: false,
    };
  },
  computed: {
    isValidFirstFormField() {
      return this.organisation.name == null ||
        this.organisation.email == null ||
        this.organisation.telephone == null ||
        this.organisation.address == null
        ? true
        : false;
    },
    validateForm() {
      return this.organisation.name == null ||
        this.organisation.email == null ||
        this.organisation.telephone == null ||
        this.organisation.address == null ||
        this.organisation.description == null ||
        this.organisation.region == null
        ? true
        : false;
    },
  },
  methods: {
    onSubmit() {
      let payload = {
        data: {
          name: this.organisation.name,
          email: this.organisation.email,
          telephone:
            this.organisation.telephone2 !== null ||
            this.organisation.telephone2 !== ""
              ? this.organisation.telephone + "/" + this.organisation.telephone2
              : this.organisation.telephone,
          address: this.organisation.address,
          description: this.organisation.description,
          box_number: this.organisation.box_number,
          salutation: this.organisation.salutation,
          region: this.organisation.region,
          id: null,
        },
        url: "/api/protected/organisations",
        msg: "Organisation saved successfully",
        color: "default",
        to_on_ok: "dashboard",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: "default",
        commit: "SET_ORGANISATION",
        has_commit: true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };

      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then((res) => {
          return res;
        })
        .then(async (res) => {
          return this.uploadLogo(this.organisation.logo, res.data);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    showAddTelephone() {
      this.show_telephone2 = !this.show_telephone2;
    },

    uploadLogo(file, organisation) {
      const formData = new FormData();
      formData.append("file", file);
      let directory =
        `${process.env.APP_NAME}/` +
        this.organisation.name +
        `/${process.env.BASE_FOLDER}`;
      let payload = {
        url: `/upload-file?directory=${directory}&fileCategory=${process.env.FILE_CATEGORY}`,
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
        let update_organisation = {
          url: `/api/protected/organisations/${organisation.data.id}`,
          data: {
            logo: res.data.fileDownloadUri.split(
              process.env.FILE_SEPARATOR_KEY
            )[1],
          },
          status: "none",
          show_feedback: false,
          commit: "SET_ORGANISATION",
          has_commit: true,
          color: "default",
          error_msg: "default",
          msg: "",
          to_on_ok: "none",
          to_on_fail: "none",
          to_be_store_data: {
            required: true,
            has_value: false,
            data: null,
          },
        };
        this.$store
          .dispatch("putRequest", update_organisation)
          .then((response) => {
            this.getOrganisationMembers(response.data.id);
            this.getOrganisationMemberSavings(response.data.id);
            this.getUserByRegistrationStatus(response.data.id);
            this.getUserByRegistration(response.data.id);
          });
      });
    },
  },
  components: {
    ButtonVue,
    VueTelInput,
  },
};
</script>

<style src="vue-tel-input/dist/vue-tel-input.css"></style>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.page {
  background-color: $grey1;
}

.text_h6 {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
}

.text-subtitle2 {
  color: $grey2;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
}

.validation_warning {
  color: $grey2;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
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

.form_button {
  width: 100%;
  margin-bottom: 0.1rem;
}

.forgot_password {
  display: block;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 24px;
  align-items: center;
  letter-spacing: 0.005em;
  color: $primary;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.submit_btn {
  width: 10rem;
}
</style>
