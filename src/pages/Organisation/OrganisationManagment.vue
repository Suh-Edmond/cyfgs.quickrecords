<template>
  <q-page>
    <q-linear-progress
      rounded
      indeterminate
      color="primary"
      v-show="show_loading"
    />
    <div class="flex flex-center q-mb-md">
      <label class="title">{{ $t("app.organisationMgtHeading") }}</label>
    </div>
    <div class="row justify-center q-mb-xl">
      <img
        :src="getOrganisationLogo"
        alt=""
        width="130"
        height="110"
        v-if="organisationExist"
      />
      <q-avatar
        size="120px"
        font-size="52px"
        color="grey-3"
        v-if="!organisationExist"
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
    </div>
    <q-form
      @submit="onSubmit"
      :style="$q.screen.lg ? '' : 'margin-bottom:5rem;'"
    >
      <div class="row" :class="$q.platform.is.desktop ? 'q-my-md' : ' q-px-sm'">
        <div class="col-1 col-md-1 com-sm-1"></div>
        <div class="col-md-5 col-xs-12 col-sm-12">
          <label class="form_field"
            >{{ $t("app.nameLabel") }}
            <span class="text-red q-pl-xs">*</span></label
          >
          <q-input v-model="organisation.name" outlined type="text" dense />
        </div>
        <div
          class="col-md-5 col-xs-12 col-sm-12"
          :class="$q.platform.is.desktop ? 'q-ml-md' : ' q-py-sm'"
        >
          <label class="form_field">{{ $t("app.emailLabel") }} </label>
          <q-input dense v-model="organisation.email" outlined type="email" />
        </div>
        <div class="col-1 col-md-1 com-sm-1"></div>
      </div>
      <div class="row" :class="$q.platform.is.desktop ? 'q-my-md' : 'q-px-sm'">
        <div class="col-md-1"></div>
        <div class="col-md-5 col-xs-12 col-sm-12">
          <label class="form_field flex justify-between">
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
            </a>
          </label>
          <vue-tel-input
            v-model="organisation.telephone"
            defaultCountry="cm"
            mode="international"
            class="q-pa-xs q-mb-sm"
          ></vue-tel-input>
        </div>
        <div
          class="col-md-5 col-xs-12 col-sm-12"
          :class="$q.platform.is.desktop ? 'q-ml-md' : ' q-py-sm'"
        >
          <label class="form_field"
            >{{ $t("app.addressLabel") }}
            <span class="text-red q-pl-xs">*</span></label
          >
          <q-input v-model="organisation.address" outlined type="text" dense />
        </div>
        <div class="col-md-1"></div>
      </div>
      <div class="row" :class="$q.platform.is.desktop ? 'q-my-md' : 'q-px-sm'">
        <div class="col-md-1"></div>
        <div class="col-md-5 col-xs-12 col-sm-12">
          <label class="form_field flex justify-between">
            <span>
              {{ $t("app.telephoneTwo") }}
              <span class="text-red q-pl-xs">*</span>
            </span>
          </label>
          <vue-tel-input
            v-model="organisation.telephone2"
            defaultCountry="cm"
            mode="international"
            class="q-pa-xs"
            v-if="show_telephone2"
          ></vue-tel-input>
        </div>
        <div
          class="col-md-5 col-xs-12 col-sm-12"
          :class="$q.platform.is.desktop ? 'q-ml-md' : ' q-py-sm'"
        >
          <label class="form_field"
            >{{ $t("app.region") }} <span>*</span></label
          >
          <q-select
            outlined
            dense
            v-model="organisation.region"
            :options="regions"
          />
        </div>
        <div class="col-md-1"></div>
      </div>
      <div class="row q-mb-md">
        <div class="col-md-1"></div>
        <div
          class="col-10 col-md-10 col-xs-12 col-sm-12"
          :class="$q.platform.is.desktop ? 'complete_width' : ''"
        >
          <label class="form_field"
            >{{ $t("app.description") }}
            <span class="text-red q-pl-xs">*</span></label
          >
          <q-input
            v-model="organisation.description"
            outlined
            dense
            type="textarea"
            class="full-width"
          />
        </div>
        <div class="col-md-1"></div>
      </div>
      <div
        class="row q-mt-md justify-end q-gutter-md"
        :class="$q.platform.is.desktop ? 'buttons' : ''"
        v-if="$q.platform.is.desktop"
      >
        <ButtonVue
          :label="$t('app.saveBtnLabel')"
          :loading="loading"
          :disabled="validateForm"
          :color="color"
          :no_caps="true"
        >
        </ButtonVue>
      </div>
      <div class="row q-gutter-md q-mx-sm" v-if="$q.platform.is.mobile">
        <ButtonVue
          :label="$t('app.saveBtnLabel')"
          :loading="loading"
          :disabled="validateForm"
          :color="color"
          :no_caps="true"
          class="full-width"
        >
        </ButtonVue>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import ButtonVue from "src/components/Button.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import { LocalStorage, Notify, Platform } from "quasar";
import { VueTelInput } from "vue-tel-input";
import { REGIONS } from "../../utils/regions";
import { store } from "quasar/wrappers";

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
      label: "Save",
      loading: false,
      show_loading: false,
      color: "primary",
      show_telephone2: false,
      updatedTelephone: "",
      regions: REGIONS,
    };
  },
  computed: {
    validateForm() {
      return (
        this.organisation.name === "" ||
        this.organisation.telephone === "" ||
        this.organisation.address === "" ||
        this.organisation.description === "" ||
        this.organisation.region === ""
      );
    },

    organisationExist() {
      return this.$store.getters.getOrganisation !== null;
    },

    getOrganisationLogo() {
      const data = LocalStorage.getItem("data");
      if (data === undefined) {
        return "";
      }

      return process.env.SERVER_BASE_URL + data.subscription.organisation.logo;
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
        .then((res) => {
          const storedData = LocalStorage.getItem("data");
          if (storedData) {
            storedData.subscription.organisation.email = res.data.data.email;
            LocalStorage.remove("data");
            LocalStorage.set("data", storedData);
          }

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
        if (res.success) {
          this.setOrganisationInfo();
        }
      });
    },

    setOrganisationInfo() {
      const authData = LocalStorage.getItem("data");
      if (authData !== null) {
        const userOrganisation = authData.subscription.organisation;
        let telephoneString = userOrganisation.telephone.split("/");
        if (telephoneString.length > 1) {
          this.show_telephone2 = true;
        }
        this.organisation.address = userOrganisation.address;
        this.organisation.name = userOrganisation.name;
        this.organisation.email = userOrganisation.email;
        this.organisation.telephone = telephoneString[0];
        this.organisation.telephone2 =
          telephoneString[1] !== undefined ? telephoneString[1] : "";
        this.organisation.salutation = userOrganisation.salutation;
        this.organisation.description = userOrganisation.description;
        this.organisation.box_number = userOrganisation.box_number;
        this.organisation.region = userOrganisation.region;
        this.organisation.logo = userOrganisation.logo;
      }

      return this.organisation;
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
        this.organisation.telephone2 !== ""
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
          if (response.status === 200) {
            this.organisation.logo = response.data.data;
            this.$store.dispatch("setOrganisation", this.organisation);
            const storedData = LocalStorage.getItem("data");
            if (storedData) {
              storedData.subscription.organisation.logo = response.data.data;
              LocalStorage.remove("data");
              LocalStorage.set("data", storedData);
            }
            Notify.create({
              type: "positive",
              message: this.$t("app.uploadLogoSuccessMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
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
  font-size: 0.8rem;
  align-items: center;
  color: $grey5;
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
  top: 14.2%;
  left: 52%;
  cursor: pointer;
  color: $grey8;
}

.complete_width {
  width: 84.2% !important;
}
.buttons {
  margin-right: 7.5% !important;
}
</style>
