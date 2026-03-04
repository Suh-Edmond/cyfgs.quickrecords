<template>
  <q-page>
    <label class="title flex flex-center q-mb-md">{{
      $t("app.createOrganisation")
    }}</label>

    <q-form @submit="onSubmit">
      <div class="row q-gutter-x-md">
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field">{{ $t("app.nameLabel") }} </label>
          <q-input
            v-model="organisation.name"
            outlined
            type="text"
            dense
            placeholder="Growth Leader Association"
            :error="!!nameError"
            :error-message="nameError"
          />
        </div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field">{{ $t("app.emailLabel") }} </label>
          <q-input
            dense
            v-model="organisation.email"
            outlined
            type="email"
            :error="!!emailError"
            :error-message="emailError"
          />
        </div>
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
      </div>
      <div class="row q-gutter-x-md">
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field flex justify-between">
            <span>
              {{ $t("app.telephoneOne") }}
            </span>
          </label>
          <vue-tel-input
            v-model="organisation.telephone"
            defaultCountry="cm"
            mode="international"
            class="q-pa-xs q-mb-sm"
            :error="!!telephoneOneError"
            :error-message="telephoneOneError"
          ></vue-tel-input>
        </div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field">{{ $t("app.addressLabel") }} </label>
          <q-input
            v-model="organisation.address"
            outlined
            type="text"
            dense
            :error="!!addressError"
            :error-message="addressError"
          />
        </div>
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
      </div>
      <div class="row q-gutter-x-md">
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field flex justify-between">
            <span>
              {{ $t("app.telephoneTwo") }}
            </span>
          </label>
          <vue-tel-input
            v-model="organisation.telephone2"
            defaultCountry="cm"
            mode="international"
            class="q-pa-xs q-mb-sm"
            :error="!!telephoneTwoError"
            :error-message="telephoneTwoError"
          ></vue-tel-input>
        </div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field">{{ $t("app.boxLabel") }}</label>
          <q-input
            v-model="organisation.box_number"
            outlined
            type="number"
            dense
            :error="!!box_numberError"
            :error-message="box_numberError"
          />
        </div>
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
      </div>
      <div class="row q-gutter-x-md">
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field">{{ $t("app.salutation") }} </label>
          <q-input
            v-model="organisation.salutation"
            outlined
            type="text"
            dense
          />
        </div>
        <div class="col-md-4 col-xs-12 col-sm-12">
          <label class="form_field">{{ $t("app.region") }} </label>
          <q-select
            outlined
            dense
            v-model="organisation.region"
            :options="regions"
            :error="!!regionError"
            :error-message="regionError"
          />
        </div>
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
      </div>

      <div class="row q-gutter-x-md">
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
        <div
          class="col-8 col-md-8"
          :class="$q.platform.is.desktop ? 'complete_width' : ''"
        >
          <label class="form_field">{{ $t("app.description") }} </label>
          <q-input
            v-model="organisation.description"
            outlined
            dense
            type="textarea"
            class="full-width"
            :error="!!descriptionError"
            :error-message="descriptionError"
          />
        </div>
        <div class="col-2 col-md-2 col-sm-2 col-lg-2"></div>
      </div>
      <div class="flex justify-center q-mt-xs" v-if="$q.platform.is.desktop">
        <q-btn
          class="form_button"
          :label="$t('app.saveOrganisationLabel')"
          :loading="loading"
          :disabled="validateForm"
          color="primary"
          no-caps
          type="submit"
        >
          <q-icon name="arrow_forward" size="xs" class="q-pl-lg"></q-icon>
        </q-btn>
      </div>
      <div class="row q-gutter-md q-mx-sm" v-if="$q.platform.is.mobile">
        <q-btn
          class="form_button full-width"
          :label="$t('app.saveOrganisationLabel')"
          :loading="loading"
          :disabled="validateForm"
          color="primary"
          no-caps
          type="submit"
        >
          <q-icon name="arrow_forward" size="xs" class="q-pl-lg"></q-icon>
        </q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import { LocalStorage, Notify, Platform } from "quasar";
import { VueTelInput } from "vue-tel-input";
import ProcessStatusVue from "../Constants/ProcessStatus.vue";

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
      salutationError: "",
      regionError: "",
      box_numberError: "",
      regions: [
        "Adamawa - Ngaoundere",
        "Center - Yaounde",
        "East - Bertoua",
        "Far North - Maroua",
        "Littoral - Douala",
        "North - Garoua",
        "Northwest - Bamenda",
        "West - Bafoussam",
        "South - Ebolowa",
        "Southwest - Buea",
      ],
    };
  },
  emits: ["onSubscriptionCreation"],

  computed: {
    validateForm() {
      return (
        this.organisation.name === "" ||
        this.organisation.email === "" ||
        this.organisation.telephone === "" ||
        this.organisation.address === "" ||
        this.organisation.description === "" ||
        this.organisation.region === ""
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
            : "",
          account_id: LocalStorage.getItem("loginId"),
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
          if (res.status === 422 || res.status == 400 || res.status == 401) {
            Notify.create({
              type: "negative",
              message: this.$t("app.createOrganisationFailMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
          if (res.status === 200) {
            this.$store.commit("SET_PROCESS_STEP", {
              ...res.data.data,
              processStatus: ProcessStatusVue.CREATE_SUBSCRIPTION,
              step: 4,
              isSuccessful: true,
              has_organisation: false,
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

            this.$emit("onSubscriptionCreation");
            // LocalStorage.set("organisationName", res.data.data.name);
            // LocalStorage.set("organisationEmail", res.data.data.email);
            LocalStorage.set("adminUsername", res.data.data.adminUsername);
            LocalStorage.set("adminName", res.data.data.adminName);
            LocalStorage.set("organisationId", res.data.data.id);
            LocalStorage.set("organisation", res.data.data);
          }
        })
        .finally(() => {
          this.loading = false;
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

    setTelephone(telephone, telephone2) {
      return telephone + "/" + telephone2;
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
  components: {
    VueTelInput,
  },
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

.text-body1 {
  font-size: 0.9rem;
}

.icon {
  color: $grey2;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem;
  align-items: center;
  color: $grey5;
}

.complete_width {
  width: 67.7% !important;
}

.logo {
  cursor: pointer;
}
</style>
