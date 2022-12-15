<template>
  <q-page class="q-pa-xs">
    <div v-if="!exist_organisation">
      <div class="flex flex-center q-mb-md">
        <label for="title" class="title">Organisation Information</label>
      </div>
      <div>
        <q-form @submit="onSubmit" :style="$q.screen.lg ? '' : 'margin-bottom:5rem;'">
          <div class="row" :class="$q.screen.lg ? 'q-mb-md q-px-xl' : ' q-px-sm'">
            <div class="col-md-1"></div>
            <div class="col-md-5 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'">
              <div>
                <label for="credential" class="form_field">Name <span class="text-red q-pl-xs">*</span></label>
                <q-input v-model="organisation.name" outlined type="text" dense v-show="organisation == null"/>
                <q-input v-model="organisation.name" outlined type="text" dense disable v-show="organisation != null" />
              </div>
            </div>
            <div class="col-md-5 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'">
              <div>
                <label for="credential" class="form_field">Email <span class="text-red q-pl-xs">*</span></label>
                <q-input dense v-model="organisation.email" outlined type="email" />
              </div>
            </div>
            <div class="col-md-1"></div>
          </div>
          <div class="row" :class="$q.screen.lg ? 'q-mb-md q-px-xl' : 'q-px-sm'">
            <div class="col-md-1"></div>
            <div class="col-md-5 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-px-sm' : ''">
              <div>
                <label for="credential" class="form_field">Telephone Number <span
                    class="text-red q-pl-xs">*</span><q-space></q-space>
                  <a @click.prevent="showAddTelephone" class="add_telephone">
                    <q-icon name="add" size="xs" color="primary" v-if="!show_telephone2"><q-tooltip>Add
                        Telephone</q-tooltip></q-icon>
                    <q-icon name="close" size="xs" color="primary" v-if="show_telephone2">
                      <q-tooltip>Remove</q-tooltip>
                    </q-icon>
                  </a>
                </label>
                <q-input v-model="organisation.telephone" outlined type="tel" dense mask="(+###) ### - ### - ###"
                  unmasked-value hint="Example: (+237) ### - ### - ###">
                </q-input>
                <q-input v-model="organisation.telephone2" outlined dense type="tel" class="q-mt-xs"
                  mask="(+###) ### - ### - ###" unmasked-value hint="Example: (+237) ### - ### - ###"
                  v-if="show_telephone2" />
              </div>
            </div>
            <div class="col-md-5 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'">
              <div>
                <label for="credential" class="form_field">Address <span class="text-red q-pl-xs">*</span></label>
                <q-input v-model="organisation.address" outlined type="text" dense />
              </div>
            </div>
            <div class="col-md-1"></div>
          </div>
          <div class="row" :class="$q.screen.lg ? 'q-mb-md q-px-xl' : 'q-px-sm'">
            <div class="col-md-1"></div>
            <div class="col-md-5 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'">
              <div>
                <label for="credential" class="form_field">Salutation</label>
                <q-input v-model="organisation.salutation" outlined type="text" dense />
              </div>
            </div>
            <div class="col-md-5 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'">
              <div>
                <label for="credential" class="form_field">P.O Box</label>
                <q-input v-model="organisation.box_number" outlined type="number" dense />
              </div>
            </div>
            <div class="col-md-1"></div>
          </div>
          <div class="row q-mb-md" :class="$q.screen.lg ? 'q-mb-xs q-px-xl' : 'q-px-sm'">
            <div class="col-md-1"></div>
            <div class="col-md-5 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'">
              <div>
                <label for="credential" class="form_field">Description <span class="text-red q-pl-xs">*</span></label>
                <q-input v-model="organisation.description" outlined dense type="textarea" />
              </div>
            </div>
            <div class="col-md-5 col-xs-12 col-sm-12" :class="$q.screen.lg ? 'q-px-sm' : 'q-py-sm'">
              <div>
                <label for="credential" class="form_field">Region <span class="text-red q-pl-xs">*</span></label>
                <q-select v-model="organisation.region" outlined type="text" dense :options="regionOptions" />
              </div>
            </div>
            <div class="col-md-1"></div>
          </div>
          <div class="row q-mt-md q-pr-sm">
            <div class="col-md-3"></div>
            <div class="col-md-8 flex q-gutter-md justify-end" :class="$q.screen.lg ? 'q-px-lg' : ''">
              <div>
                <q-btn outline color="primary" label="Cancel" no-caps @click="showDetail" />
              </div>
              <div>
                <ButtonVue :label="label" :loading="loading" :disabled="validateForm" :color="color" :no_caps="true">
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
              <q-avatar size="150px" font-size="52px" v-if="organisation.logo != null">
                <img :src="organisation.logo" alt="" width="160px" />
              </q-avatar>
              <q-avatar size="150px" font-size="52px" color="grey" v-if="organisation.logo == null">
              </q-avatar>
              <div class="q-mt-xl logo">
                <input type="file" accept="image/x-png,image/jpg,image/jpeg" style="display: none" id="logo"
                  @change="onFileChanged" />
                <q-icon name="photo_camera" size="sm" class="q-mt-md q-pr-xl" @click="openFileUpload">
                </q-icon>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="flex">
                <div class="text-h6 title">Organisation information</div>
                <q-space />
                <div>
                  <q-btn dense flat color="primary" icon="edit" v-close-popup @click="editOrganisation()" size="sm">
                  </q-btn>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <p>
                <q-icon name="diversity_3" size="xs"></q-icon>
                <span class="q-pl-sm">{{ organisation.name }}</span>
              </p>
              <p v-if="organisation.salutation !== null">
                <q-icon name="people" size="xs"></q-icon>
                <span class="q-pl-sm">{{ organisation.salutation }}</span>
              </p>
              <p>
                <q-icon name="email" size="xs"></q-icon>
                <span class="q-pl-sm">{{ organisation.email }}</span>
              </p>
              <p>
                <q-icon name="phone" size="xs"></q-icon>
                <span class="q-pl-sm">{{ organisation.telephone }} </span>
                <span v-if="organisation.telephone2 !== 'null'">/ {{ organisation.telephone2 }}</span>
              </p>
              <p>
                <q-icon name="location_on" size="xs"></q-icon>
                <span class="q-pl-sm">{{ organisation.region }}, {{ organisation.address }},
                  <span v-if="organisation.box_number !== null">{{
                      organisation.box_number
                  }}</span></span>
              </p>
              <p class="q-mx-md q-pl-sm">
                <span>{{ organisation.description }} </span>
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
import FileConstants from 'src/components/Constants/FileConstants.vue';
import organisationMixinVue from "src/mixins/organisationMixin.vue";

export default {
  mixins: [organisationMixinVue],
  mounted() {
    this.getOrganisationInfo();
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
      regions: ["SouthWest", "NorthWest"],
      directory: "LOGOS",
    };
  },
  computed: {
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
    regionOptions() {
      var regions = [];
      this.regions.forEach((region) => {
        regions.push({
          value: region,
          label: region,
        });
      });
      return regions;
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
          region: this.organisation.region.value,
          id:
            this.$store.getters.getOrganisation == null
              ? null
              : this.$store.getters.getOrganisation.id,
        },
        url: "/api/protected/organisations",
        msg: "Organisation saved successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "default",
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
        if (res.data !== null) {
          this.exist_organisation = true;
          this.setOrganisationInfo();
        }
      });
    },

    setOrganisationInfo() {
      let data = this.$store.getters.getOrganisation;
      if (data.telephone.split("/").length > 1) {
        this.show_telephone2 = true;
      }
      this.organisation.address = data.address;
      this.organisation.name = data.name;
      this.organisation.email = data.email;
      this.organisation.telephone = data.telephone.split("/")[0];
      this.organisation.telephone2 = data.telephone.split("/")[1];
      this.organisation.salutation = data.salutation;
      this.organisation.description = data.description;
      this.organisation.box_number = data.box_number;
      this.organisation.region = data.region;
      this.organisation.logo = data.logo
      return this.organisation;
    },

    editOrganisation() {
      this.exist_organisation = false;
    },
    showDetail() {
      this.exist_organisation = !this.exist_organisation;
    },
    showAddTelephone() {
      this.show_telephone2 = !this.show_telephone2;
    },
    openFileUpload() {
      document.getElementById('logo').click();
    },
    onFileChanged(e) {
      const formData = new FormData();
      formData.append("file", e.target.files[0])

      let directory = FileConstants.APP_NAME + '/' + this.organisation.name + '/' + FileConstants.LOGOS;
      let payload = {
        url: `/api/v1/protected/upload-file?directory=${directory}&fileCategory=${FileConstants.IMAGES}`,
        data: formData,
        status: "none",
        msg: "Logo uploaded successfully",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
      }
      this.$store.dispatch("uploadImageRequest", payload).then((res) => {
        let get_file_payload = {
          url: `/api/v1/protected/file?directory=${directory}&fileCategory=${FileConstants.IMAGES}&fileName=${e.target.files[0].name}`,
          data: formData,

        }
        this.$store.dispatch("fetchUploadedImageRequest", get_file_payload).then((res) => {
          this.organisation.logo = res.data.fileDownloadUri
          let update_organisation = {
            url: `/api/protected/organisations/${this.$store.getters.getOrganisation.id}`,
            data: { "logo": res.data.fileDownloadUri },
            status: "none"
          }
          this.$store.dispatch("putRequest", update_organisation).then(() => {
          })
        })
      })



    }
  },
  components: {
    ButtonVue,
  },
};
</script>
<style lang="scss" scoped>
.title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
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
  font-weight: 400;
  font-size: 13px;
  line-height: 24px;
  display: flex;
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
</style>
