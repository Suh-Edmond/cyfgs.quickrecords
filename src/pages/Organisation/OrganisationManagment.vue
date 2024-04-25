<template>
  <q-page class="q-pa-xs">
    <q-linear-progress
      rounded
      indeterminate
      color="primary"
      v-show="show_loading"
    />
    <div v-if="!exist_organisation">
      <div class="flex flex-center q-mb-md">
        <label for="title" class="title">{{
          $t("app.updateOrganisationHeading")
        }}</label>
      </div>
      <div>
        <q-form
          @submit="onSubmit"
          :style="$q.screen.lg ? '' : 'margin-bottom:5rem;'"
        >
          <div
            class="row"
            :class="$q.screen.lg ? 'q-mb-md q-px-xl' : ' q-px-sm'"
          >
            <div class="col-md-1"></div>
            <div
              class="col-md-5 col-xs-12 col-sm-12"
              :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'"
            >
              <div>
                <label for="credential" class="form_field"
                  >{{ $t("app.nameLabel") }}
                  <span class="text-red q-pl-xs">*</span></label
                >
                <q-input
                  v-model="organisation.name"
                  outlined
                  type="text"
                  dense
                  v-if="!exist_organisation"
                />
                <q-input
                  v-model="organisation.name"
                  outlined
                  type="text"
                  dense
                  readonly
                  disable
                  v-if="exist_organisation"
                />
              </div>
            </div>
            <div
              class="col-md-5 col-xs-12 col-sm-12"
              :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'"
            >
              <div>
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
            <div class="col-md-1"></div>
          </div>
          <div
            class="row"
            :class="$q.screen.lg ? 'q-mb-md q-px-xl' : 'q-px-sm'"
          >
            <div class="col-md-1"></div>
            <div
              class="col-md-5 col-xs-12 col-sm-12"
              :class="$q.screen.lg ? 'q-px-sm' : ''"
            >
              <div>
                <label for="credential" class="form_field flex justify-between">
                  <span>
                    {{ $t("app.telephoneLabel") }}
                    <span class="text-red q-pl-xs">*</span>
                  </span>
                  <a class="add_telephone">
                    <q-icon
                      name="add"
                      size="xs"
                      color="primary"
                      v-if="canShowTelephoneField"
                      @click.prevent="showAddTelephone"
                      ><q-tooltip>{{
                        $t("app.addTelephoneLabel")
                      }}</q-tooltip></q-icon
                    >
                    <q-icon
                      name="close"
                      size="xs"
                      color="primary"
                      v-if="!canShowTelephoneField"
                      @click.prevent="removeAddTelephone"
                    >
                      <q-tooltip>{{ $t("app.remove") }}</q-tooltip>
                    </q-icon>
                  </a>
                </label>
                <vue-tel-input
                  v-model="organisation.telephone"
                  defaultCountry="cm"
                  mode="international"
                  class="q-pa-xs q-mb-sm"
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
            <div
              class="col-md-5 col-xs-12 col-sm-12"
              :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'"
            >
              <div>
                <label for="credential" class="form_field"
                  >{{ $t("app.addressLabel") }}
                  <span class="text-red q-pl-xs">*</span></label
                >
                <q-input
                  v-model="organisation.address"
                  outlined
                  type="text"
                  dense
                />
              </div>
            </div>
            <div class="col-md-1"></div>
          </div>
          <div
            class="row"
            :class="$q.screen.lg ? 'q-mb-md q-px-xl' : 'q-px-sm'"
          >
            <div class="col-md-1"></div>
            <div
              class="col-md-5 col-xs-12 col-sm-12"
              :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'"
            >
              <div>
                <label for="credential" class="form_field">{{
                  $t("app.salutation")
                }}</label>
                <q-input
                  v-model="organisation.salutation"
                  outlined
                  type="text"
                  dense
                />
              </div>
            </div>
            <div
              class="col-md-5 col-xs-12 col-sm-12"
              :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'"
            >
              <div>
                <label for="credential" class="form_field">{{
                  $t("app.boxLabel")
                }}</label>
                <q-input
                  v-model="organisation.box_number"
                  outlined
                  type="number"
                  dense
                />
              </div>
            </div>
            <div class="col-md-1"></div>
          </div>
          <div
            class="row q-mb-md"
            :class="$q.screen.lg ? 'q-mb-xs q-px-xl' : 'q-px-sm'"
          >
            <div class="col-md-1"></div>
            <div
              class="col-md-5 col-xs-12 col-sm-12"
              :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'"
            >
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
            <div
              class="col-md-5 col-xs-12 col-sm-12"
              :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'"
            >
              <div>
                <label for="credential" class="form_field"
                  >{{ $t("app.region") }}
                  <span class="text-red q-pl-xs">*</span></label
                >
                <q-input
                  v-model="organisation.region"
                  outlined
                  type="text"
                  dense
                />
              </div>
            </div>
            <div class="col-md-1"></div>
          </div>
          <div class="row q-mt-md q-pr-sm">
            <div class="col-md-3"></div>
            <div
              class="col-md-8 flex q-gutter-md justify-end"
              :class="$q.screen.lg ? 'q-px-lg' : ''"
            >
              <div>
                <q-btn
                  outline
                  color="primary"
                  :label="$t('app.cancel')"
                  no-caps
                  @click="showDetail"
                  class="q-pa-xs"
                  :disable="checkIfOrganisationExist"
                />
              </div>
              <div>
                <ButtonVue
                  :label="$t('app.saveBtnLabel')"
                  :loading="loading"
                  :disabled="validateForm"
                  :color="color"
                  :no_caps="true"
                  class="q-pa-xs"
                >
                </ButtonVue>
              </div>
            </div>
            <div class="col-md-1"></div>
          </div>
        </q-form>
      </div>
    </div>
    <div v-if="exist_organisation">
      <div class="row flex flex-center">
        <div class="col-8 col-sm-12 col-xs-12 col-md-8">
          <q-card class="card text-dark" flat>
            <q-card-section class="flex flex-center">
              <q-avatar
                size="150px"
                font-size="52px"
                v-if="organisation.logo != null"
              >
                <img :src="getOrganisationLogo" alt="" width="160px" />
              </q-avatar>
              <q-avatar
                size="150px"
                font-size="52px"
                color="grey-3"
                v-if="organisation.logo == null"
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
                  size="sm"
                  class="camara"
                  @click="openFileUpload"
                >
                  <q-tooltip>{{ $t("app.uploadLogo") }}</q-tooltip>
                </q-icon>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="flex">
                <div class="text-h6 title">
                  {{ $t("app.organisationMgtHeading") }}
                </div>
                <q-space />
                <div>
                  <q-btn
                    dense
                    flat
                    color="primary"
                    icon="edit"
                    v-close-popup
                    @click="editOrganisation()"
                    size="sm"
                  >
                  </q-btn>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <p>
                <q-icon name="diversity_3" size="sm"></q-icon>
                <span class="q-pl-sm text-body1 text-weight-medium">{{
                  organisation.name
                }}</span>
              </p>
              <p v-if="organisation.salutation !== null">
                <q-icon name="people" size="sm"></q-icon>
                <span class="q-pl-sm text-body1 text-weight-medium">{{
                  organisation.salutation
                }}</span>
              </p>
              <p>
                <q-icon name="email" size="sm"></q-icon>
                <span class="q-pl-sm text-body1 text-weight-medium">{{
                  organisation.email
                }}</span>
              </p>
              <p>
                <q-icon name="phone" size="sm"></q-icon>
                <span class="q-pl-sm text-body1 text-weight-medium"
                  >{{ organisation.telephone }}
                </span>
                <span
                  v-if="organisation.telephone2 !== ''"
                  class="q-pl-sm text-body1 text-weight-medium"
                  >/ {{ organisation.telephone2 }}</span
                >
              </p>
              <p>
                <q-icon name="location_on" size="sm"></q-icon>
                <span class="q-pl-sm text-body1 text-weight-medium"
                  >{{ organisation.region }}, {{ organisation.address }},
                  <span v-if="organisation.box_number !== null">{{
                    organisation.box_number
                  }}</span></span
                >
              </p>
              <p>
                <q-icon name="description" size="sm"></q-icon>
                <span class="q-mx-md q-pl-sm text-body1 text-weight-medium"
                  >{{ organisation.description }}
                </span>
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import ButtonVue from "src/components/Button.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import { Notify, Platform } from "quasar";
import { VueTelInput } from "vue-tel-input";

export default {
  mixins: [organisationMixinVue],
  mounted() {
    this.getOrganisationInfo();
    this.setOrganisationInfo();
  },
  data() {
    return {
      exist_organisation: false,
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
      label: "Save",
      loading: false,
      show_loading: false,
      color: "primary",
      show_telephone2: false,
      updatedTelephone: "",
    };
  },
  computed: {
    validateForm() {
      return (
        this.organisation.name == "" ||
        this.organisation.email == "" ||
        this.organisation.telephone == "" ||
        this.organisation.address == "" ||
        this.organisation.description == "" ||
        this.organisation.region == ""
      );
    },

    checkIfOrganisationExist() {
      return this.$store.getters.getOrganisation == null ? true : false;
    },

    getOrganisationLogo() {
      return (
        process.env.API_BASE_URL + this.$store.getters.getOrganisation.logo
      );
    },

    canShowTelephoneField() {
      return this.organisation.telephone2 === "";
    },
  },
  methods: {
    onSubmit() {
      let payload = {
        data: {
          name: this.organisation.name,
          email: this.organisation.email,
          telephone: this.setTelephone(
            this.show_telephone2,
            this.organisation.telephone,
            this.organisation.telephone2
          ),
          address: this.organisation.address,
          description: this.organisation.description,
          box_number: this.organisation.box_number,
          salutation: this.organisation.salutation,
          region: this.organisation.region,
          id:
            this.$store.getters.getOrganisation == null
              ? null
              : this.$store.getters.getOrganisation.id,
        },
        url: "/api/protected/organisations",
        msg: this.$t("app.saveOrganisationSuccessMsg"),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: "default",
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
        .dispatch("postRequest", payload)
        .then(() => {
          this.exist_organisation = true;
          this.getOrganisationInfo();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getOrganisationInfo() {
      let payload = {
        status: "none",
        url: "/api/protected/organisation-info",
        has_path_val: true,
        show_feedback: false,
        msg: "default",
        color: "default",
        error_msg: "default",
        commit: "SET_ORGANISATION",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        if (res !== undefined) {
          this.setOrganisationInfo();
        } else {
          Notify.create({
            type: "info",
            message:
              "Organisation not yet created! Please fill the fields to add organisation",
            position: !Platform.is.mobile ? "top-right" : "bottom",
          });
        }
      });
    },

    setOrganisationInfo() {
      let data = this.$store.getters.getOrganisation;
      let telephoneString = data.telephone.split("/");
      if (data != null) {
        this.exist_organisation = true;
        if (telephoneString.length > 1) {
          this.show_telephone2 = true;
        }
        this.organisation.address = data.address;
        this.organisation.name = data.name;
        this.organisation.email = data.email;
        this.organisation.telephone = telephoneString[0];
        this.organisation.telephone2 =
          telephoneString[1] != undefined ? telephoneString[1] : "";
        this.organisation.salutation = data.salutation;
        this.organisation.description = data.description;
        this.organisation.box_number = data.box_number;
        this.organisation.region = data.region;
        this.organisation.logo = data.logo;
      }

      return this.organisation;
    },

    editOrganisation() {
      this.exist_organisation = false;
    },

    showDetail() {
      this.exist_organisation = !this.exist_organisation;
    },

    showAddTelephone() {
      return (this.show_telephone2 = true);
    },

    removeAddTelephone() {
      this.organisation.telephone2 = "";
      return (this.show_telephone2 = false);
    },

    setTelephone(show_telephone2, telephone, telephone2) {
      let finalTelephone = "";
      if (
        (show_telephone2 && this.organisation.telephone2 !== undefined) ||
        this.organisation.telephone2 != ""
      ) {
        finalTelephone = telephone + "/" + telephone2;
      } else {
        finalTelephone = telephone;
      }

      return finalTelephone;
    },

    openFileUpload() {
      document.getElementById("logo").click();
    },

    onFileChanged(e) {
      this.show_loading = true;
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      let payload = {
        url: `/api/protected/upload_file?requester=ORGANISATION&file_category=${process.env.FILE_CATEGORY}`,
        data: formData,
        msg: this.$t("app.uploadLogoSuccessMsg"),
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
      this.$store
        .dispatch("uploadImageRequest", payload)
        .then((response) => {
          if (response.status == 200) {
            this.organisation.logo = response.data.data;
            this.$store.dispatch("setOrganisation", this.organisation);
          }
        })
        .finally(() => {
          this.show_loading = false;
        });
    },
  },
  components: {
    ButtonVue,
    VueTelInput,
  },
};
</script>
<style lang="scss" scoped>
.title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 29px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.01em;
  color: $primary;
}

.label {
  font-family: "Roboto";
  font-style: normal;
  line-height: 29px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: capitalize;
  color: $grey2;
  font-size: larger;
}

.icon {
  color: $grey2;
}

.control {
  margin-right: 5rem;
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

.card {
  border-radius: 0.8rem;
}

.more {
  color: blue;
  cursor: pointer;
}

.add_telephone {
  text-decoration: none;
  cursor: pointer;
}

.logo {
  cursor: pointer;
}

.camara {
  position: absolute;
  top: 70%;
  left: 55%;
  cursor: pointer;
  color: $grey8;
}
</style>
