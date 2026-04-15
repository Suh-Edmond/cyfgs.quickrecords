<template>
  <q-page>
    <label class="title flex flex-center q-mb-md">{{
      $t("app.createOrganisation")
    }}</label>

    <q-form @submit="onSubmit">
      <div
        class="row"
        :class="$q.platform.is.desktop ? 'q-gutter-x-md' : 'q-gutter-x-xs'"
      >
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field"
            ><q-icon name="diversity_3" size="xs" class="q-pr-xs"></q-icon
            >{{ $t("app.nameLabel") }}
            <span :class="nameError ? 'text-red' : ''">*</span></label
          >
          <q-input
            v-model="organisation.name"
            outlined
            type="text"
            dense
            :error="!!nameError"
            :error-message="nameError"
            @input="validateName()"
          />
        </div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field"
            ><q-icon name="email" size="xs" class="q-pr-xs"></q-icon
            >{{ $t("app.emailLabel") }}
            <span :class="emailError ? 'text-red' : ''">*</span></label
          >
          <q-input
            dense
            v-model="organisation.email"
            outlined
            type="email"
            :error="!!emailError"
            :error-message="emailError"
            @input="validateEmail()"
          >
            <template v-slot:hint>
              {{ $t("app.optionalFieldHintMsg") }}
            </template>
          </q-input>
        </div>
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
      </div>
      <div
        class="row q-pt-md"
        :class="$q.platform.is.desktop ? 'q-gutter-x-md' : 'q-gutter-x-xs'"
      >
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field flex justify-between">
            <span>
              <q-icon name="phone" size="xs" class="q-pr-xs"></q-icon
              >{{ $t("app.telephoneOne") }}
              <span :class="telephoneOneError ? 'text-red' : ''">*</span>
            </span>
          </label>
          <q-input
            v-model="organisation.telephone"
            outlined
            dense
            type="text"
            :error="!!telephoneOneError"
            :error-message="telephoneOneError"
            @input="validateTelephoneOne()"
          ></q-input>
        </div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field"
            ><q-icon name="location_on" size="xs" class="q-pr-xs"></q-icon
            >{{ $t("app.addressLabel") }}
            <span :class="addressError ? 'text-red' : ''">*</span></label
          >
          <q-input
            v-model="organisation.address"
            outlined
            type="text"
            dense
            :error="!!addressError"
            :error-message="addressError"
            @input="validateAddress()"
          />
        </div>
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
      </div>
      <div
        class="row"
        :class="$q.platform.is.desktop ? 'q-gutter-x-md' : 'q-gutter-x-xs'"
      >
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field flex justify-between">
            <span>
              <img
                src="../../assets/whatsapp_transparent.jpg"
                width="25px"
                class="q-pr-sm whatsapp_icon"
              />{{ $t("app.telephoneTwo") }}
              <span :class="telephoneTwoError ? 'text-red' : ''">*</span>
            </span>
          </label>
          <q-input
            v-model="organisation.telephone2"
            outlined
            dense
            type="text"
            :error="!!telephoneTwoError"
            :error-message="telephoneTwoError"
            @input="validateTelephoneTwo()"
          ></q-input>
        </div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field"
            ><q-icon name="location_on" size="xs" class="q-pr-xs"></q-icon
            >{{ $t("app.region") }}
            <span :class="regionError ? 'text-red' : ''">*</span></label
          >
          <q-select
            outlined
            dense
            v-model="organisation.region"
            :options="regions"
            :error="!!regionError"
            :error-message="regionError"
            @input="validateRegion()"
          />
        </div>
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
      </div>

      <div class="row" v-if="$q.platform.is.desktop">
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
        <div
          class="col-8 col-md-8 description"
          :class="$q.platform.is.desktop ? 'complete_width' : ''"
        >
          <label class="form_field"
            ><span
              ><q-icon name="article" size="xs" class="q-pr-xs"></q-icon></span
            >{{ $t("app.description")
            }}<span :class="descriptionError ? 'text-red' : ''">*</span></label
          >
          <q-input
            v-model="organisation.description"
            outlined
            dense
            type="textarea"
            class="full-width"
            :error="!!descriptionError"
            :label="$t('app.descriptionplaceHolder')"
            :error-message="descriptionError"
            @input="validateDescription()"
          />
        </div>
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
      </div>
      <div class="row" v-if="$q.platform.is.mobile">
        <label class="form_field"
          ><q-icon name="article" size="xs" class="q-pr-xs"></q-icon
          >{{ $t("app.description") }}
        </label>
        <q-input
          v-model="organisation.description"
          outlined
          dense
          type="textarea"
          class="full-width"
          :error="!!descriptionError"
          :label="$t('app.descriptionplaceHolder')"
          :error-message="descriptionError"
        />
      </div>
      <div class="flex justify-center q-mt-xs" v-if="$q.platform.is.desktop">
        <q-btn
          class="form_button button"
          :label="$t('app.saveOrganisationLabel')"
          :loading="loading"
          :disabled="!validateForm"
          color="primary"
          no-caps
          type="submit"
        >
        </q-btn>
      </div>
      <div class="row q-mb-xl" v-if="$q.platform.is.mobile">
        <q-btn
          class="form_button full-width"
          :label="$t('app.saveOrganisationLabel')"
          :loading="loading"
          :disabled="!validateForm"
          color="primary"
          no-caps
          type="submit"
        >
        </q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import { LocalStorage, Notify, Platform } from "quasar";
import ProcessStatusVue from "../Constants/ProcessStatus.vue";
import { REGIONS } from "../../utils/regions";
export default {
  mixins: [organisationMixinVue],

  mounted() {
    this.setOrganisationInfo();
  },
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

      loading: false,
      show_telephone2: false,
      nameError: "",
      telephoneOneError: "",
      telephoneTwoError: "",
      emailError: "",
      addressError: "",
      descriptionError: "",
      regionError: "",
      regions: REGIONS,
    };
  },
  emits: ["onSubscriptionCreation", "onContinueTrial"],

  computed: {
    validateForm() {
      return (
        this.organisation.name !== null &&
        this.nameError === "" &&
        (this.organisation.email === null ||
          (this.organisation.email !== null && this.emailError === "")) &&
        this.organisation.telephone !== null &&
        this.telephoneOneError === "" &&
        this.organisation.telephone2 !== null &&
        this.telephoneTwoError === "" &&
        this.organisation.address !== null &&
        this.addressError === "" &&
        this.organisation.description !== null &&
        this.descriptionError === "" &&
        this.organisation.region !== null &&
        this.regionError === ""
      );
    },

    checkIfOrganisationExist() {
      return this.$store.getters.getProcessStage.has_organisation;
    },

    getOrganisationLogo() {
      return this.checkIfOrganisationExist
        ? process.env.SERVER_BASE_URL +
            this.$store.getters.getProcessStage.organisation.logo
        : "";
    },
  },
  methods: {
    onSubmit() {
      const organisation = LocalStorage.getItem("organisation");
      let payload = {
        data: {
          name: this.organisation.name,
          email: this.organisation.email,
          telephone: this.setTelephone(
            this.organisation.telephone,
            this.organisation.telephone2
          ),
          address: this.organisation.address,
          description: this.organisation.description,
          box_number: this.organisation.box_number,
          salutation: this.organisation.salutation,
          region: this.organisation.region,
          id: this.$store.getters.getProcessStage.has_organisation
            ? this.$store.getters.getProcessStage.organisation_id
            : organisation !== null
            ? organisation.id
            : "",
          loginId: LocalStorage.getItem("loginId"),
        },
        url: "/api/public/auth/organisations/create-account",
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
        .then((res) => {
          if (res.status === 422 || res.status === 400 || res.status === 401) {
            Notify.create({
              type: "negative",
              message: this.$t("app.createOrganisationFailMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
          if (res.status === 200) {
            this.$store.commit("SET_PROCESS_STEP", {
              ...res.data.data,
              // processStatus: ProcessStatusVue.CREATE_SUBSCRIPTION,
              // step: 4,
              // isSuccessful: true,
              processStatus: ProcessStatusVue.IN_TRIAL,
              step: 5,
              isSuccessful: true,
              isTrial: true,
              has_organisation: true,
              organisation_id: res.data.data.id,
              organisation_name: res.data.data.name,
              organisation_email: res.data.data.email,
              organisation_description: res.data.data.description,
              organisation_telephone: res.data.data.telephone,
              organisation_address: res.data.data.address,
              organisation_salutation: res.data.data.salutation,
              organisation_region: res.data.data.region,
              organisation_box_number: res.data.data.box_number,
              organisation_logo: res.data.data.logo,
              loginId: res.data.data.user_id,
              accountId: res.data.data.user_id,
            });

            // this.$emit("onSubscriptionCreation");
            this.$emit("onContinueTrial");
            LocalStorage.set("adminUsername", res.data.data.adminUsername);
            LocalStorage.set("adminName", res.data.data.adminName);
            LocalStorage.set("organisationId", res.data.data.id);
            LocalStorage.set("organisation", res.data.data);
          }
        })
        .finally(() => {
          this.loading = false;
          this.resetOrganisationInfo();
        });
    },

    setOrganisationInfo() {
      const organisation = LocalStorage.getItem("organisation");
      if (organisation !== null) {
        let telephoneString = organisation.telephone.split("/");
        this.organisation.address = organisation.address;
        this.organisation.name = organisation.name;
        this.organisation.email = organisation.email;
        this.organisation.telephone = telephoneString[0];
        this.organisation.telephone2 =
          telephoneString[1] !== undefined ? telephoneString[1] : "";
        this.organisation.salutation = organisation.salutation;
        this.organisation.description = organisation.description;
        this.organisation.box_number = organisation.box_number;
        this.organisation.region = organisation.region;
        this.organisation.logo = organisation.logo;
      }

      return this.organisation;
    },

    resetOrganisationInfo() {
      this.organisation.address = "";
      this.organisation.name = "";
      this.organisation.email = "";
      this.organisation.telephone = "";
      this.organisation.telephone2 = "";
      this.organisation.salutation = "";
      this.organisation.description = "";
      this.organisation.box_number = "";
      this.organisation.region = "";
      this.organisation.logo = "";
    },

    setTelephone(telephone, telephone2) {
      return telephone + "/" + telephone2;
    },

    validateTelephoneOne() {
      const regex = /^\d{9,15}$/;
      const validPhone = regex.test(this.organisation.telephone);
      this.telephoneOneError = validPhone
        ? ""
        : this.$t("app.invalidPhoneError");
      return validPhone;
    },

    validateTelephoneTwo() {
      const regex = /^\d{9,15}$/;
      const validPhone = regex.test(this.organisation.telephone2);
      this.telephoneTwoError = validPhone
        ? ""
        : this.$t("app.invalidPhoneError");
      return validPhone;
    },

    validString(data) {
      return data !== null && data !== undefined && data.trim().length > 0;
    },

    validateEmail() {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const validEmail =
        this.organisation !== null &&
        this.organisation.email !== null &&
        regex.test(this.organisation.email);
      this.emailError = validEmail ? "" : this.$t("app.invalidEmailErrorMsg");
      return validEmail;
    },
    validateName() {
      const validName =
        this.validString(this.organisation.name) &&
        this.organisation.name.length >= 4;
      this.nameError = validName ? "" : this.$t("app.invalidNameMsg");
      return validName;
    },

    validateAddress() {
      const validAddress =
        this.validString(this.organisation.address) &&
        this.organisation.address.length >= 4;
      this.addressError = validAddress ? "" : this.$t("app.invalidAddress");
      return validAddress;
    },

    validateDescription() {
      const validDescription =
        this.validString(this.organisation.description) &&
        this.organisation.description.length >= 4;
      this.descriptionError = validDescription
        ? ""
        : this.$t("app.descriptionplaceHolder");
      return validDescription;
    },
    validateRegion() {
      const validRegion =
        this.validString(this.organisation.region) &&
        this.organisation.region !== "";
      this.regionError = validRegion ? "" : this.$t("app.regionError");
      return validRegion;
    },

    // openFileUpload() {
    //   document.getElementById("logo").click();
    // },

    // onFileChanged(e) {
    //   this.show_loading = true;
    //   const formData = new FormData();
    //   formData.append("image", e.target.files[0]);
    //   let payload = {
    //     url: `/api/protected/upload_file?requester=ORGANISATION&file_category=${process.env.FILE_CATEGORY}`,
    //     data: formData,
    //     msg: this.$t("app.uploadLogoSuccessMsg"),
    //     color: "default",
    //     to_on_ok: "none",
    //     to_on_fail: "none",
    //     show_feedback: true,
    //     error_msg: this.$t("app.defaultErrorMsg"),
    //     has_commit: false,
    //     commit: "none",
    //     to_be_store_data: {
    //       required: false,
    //       has_value: false,
    //       data: [],
    //     },
    //   };
    //   this.$store
    //     .dispatch("uploadImageRequest", payload)
    //     .then((response) => {
    //       if (response.status === 200) {
    //         this.organisation.logo = response.data.data;
    //         this.$store.dispatch("setOrganisation", this.organisation);
    //         Notify.create({
    //           type: "positive",
    //           message: this.$t("app.uploadLogoSuccessMsg"),
    //           position: Platform.is.mobile ? "bottom" : "top-right",
    //         });
    //       }
    //     })
    //     .finally(() => {
    //       this.show_loading = false;
    //     });
    // },
  },
  components: {},
};
</script>
<style lang="scss" scoped>
.title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 1.1rem;
  align-items: center;
  text-align: center;
  color: $primary;
}

.description {
  margin-left: 18px;
}

.button {
  margin-top: 3px;
  width: 15%;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem;
  color: $grey5;
}

.complete_width {
  width: 67.8% !important;
}

.logo {
  cursor: pointer;
}
</style>
