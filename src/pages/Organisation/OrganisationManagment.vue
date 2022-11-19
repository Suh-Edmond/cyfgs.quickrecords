<template>
  <q-page class="q-pa-xs">
    <div>
      <label for="title" class="title">Organisation Information</label>
    </div>
    <q-form
      @submit="onSubmit"
      :style="$q.screen.lg ? '' : 'margin-bottom:5rem;'"
    >
      <div
        class="row q-py-sm"
        :class="$q.screen.lg ? 'q-mb-sm q-px-xl' : ' q-px-sm'"
      >
        <div
          class="col-md-6 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-px-md' : 'q-py-sm'"
        >
          <div>
            <label for="credential" class="form_field">Name</label>
            <q-input
              v-model="organisation.name"
              outlined
              type="text"
              filled
              dense
            />
          </div>
        </div>
        <div
          class="col-md-6 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-px-md' : 'q-py-sm'"
        >
          <div>
            <label for="credential" class="form_field">Email</label>
            <q-input
              dense
              v-model="organisation.email"
              outlined
              type="email"
              filled
            />
          </div>
        </div>
      </div>
      <div class="row" :class="$q.screen.lg ? 'q-mb-md q-px-xl' : 'q-px-sm'">
        <div
          class="col-md-6 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-px-md' : ''"
        >
          <div>
            <label for="credential" class="form_field"
              >Telephone Number(s)
            </label>
            <q-input
              v-model="organisation.telephone"
              outlined
              type="tel"
              filled
              dense
            >
            </q-input>
            <q-input
              v-model="organisation.telephone2"
              outlined
              dense
              type="tel"
              filled
              class="q-mt-xs"
              v-if="show_telephone2"
            />
          </div>
        </div>
        <div
          class="col-md-6 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-px-md' : 'q-py-sm'"
        >
          <div>
            <label for="credential" class="form_field">Address</label>
            <q-input
              v-model="organisation.address"
              outlined
              type="text"
              filled
              dense
            />
          </div>
        </div>
      </div>
      <div class="row" :class="$q.screen.lg ? 'q-mb-md q-px-xl' : 'q-px-sm'">
        <div
          class="col-md-6 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-px-md' : 'q-py-sm'"
        >
          <div>
            <label for="credential" class="form_field">Salutation</label>
            <q-input
              v-model="organisation.salutation"
              outlined
              type="text"
              filled
              dense
            />
          </div>
        </div>
        <div
          class="col-md-6 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-px-md' : 'q-py-sm'"
        >
          <div>
            <label for="credential" class="form_field">P.O BOX</label>
            <q-input
              v-model="organisation.box_number"
              outlined
              type="number"
              filled
              dense
            />
          </div>
        </div>
      </div>
      <div class="row" :class="$q.screen.lg ? 'q-mb-md q-px-xl' : 'q-px-sm'">
        <div
          class="col-md-6 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-px-md' : 'q-py-sm'"
        >
          <div>
            <label for="credential" class="form_field">Description</label>
            <q-input
              v-model="organisation.description"
              outlined
              dense
              type="textarea"
              placeholder="Please provide a description about your organisation"
              filled
            />
          </div>
        </div>
        <div
          class="col-md-6 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-px-md' : 'q-py-sm'"
        >
          <div>
            <label for="credential" class="form_field">Region</label>
            <q-select
              v-model="organisation.region"
              outlined
              type="text"
              filled
              dense
              :options="regionOptions"
            />
          </div>
        </div>
      </div>
      <div class="row flex flex-center" :class="$q.screen.lg ? 'q-mt-md' : ''">
        <div
          class="col-md-2 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? '' : 'q-px-sm q-pt-md q-mb-xl'"
        >
          <ButtonVue
            :label="label"
            :loading="loading"
            :disabled="validateForm"
            class="button"
            :color="color"
            :no_caps="false"
          >
          </ButtonVue>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import ButtonVue from "src/components/Button.vue";
export default {
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
      },
      label: "Save",
      loading: false,
      show_loading: false,
      color: "primary",
      show_telephone2: true,
      regions: ["SouthWest", "NorthWest"],
    };
  },
  computed: {
    validateForm() {
      return (this.organisation.name == null &&
        this.organisation.email == null &&
        this.organisation.telephone == null &&
        this.organisation.address == null) ||
        (this.organisation.name == null &&
          this.organisation.email == null &&
          this.organisation.telephone == null &&
          this.organisation.address == null)
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
          this.getOrganisationInfo();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getOrganisationInfo() {
      if (this.$store.getters.getOrganisation == "undefined") {
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
          this.setOrganisationInfo(res.data);
        });
      } else {
        this.setOrganisationInfo(this.$store.getters.getOrganisation);
      }
    },

    setOrganisationInfo(data) {
      this.exist_organisation = true;
      this.organisation.address = data.address;
      this.organisation.name = data.name;
      this.organisation.email = data.email;
      this.organisation.telephone = data.telephone.split("/")[0];
      this.organisation.telephone2 = data.telephone.split("/")[1];
      this.organisation.salutation = data.salutation;
      this.organisation.description = data.description;
      this.organisation.box_number = data.box_number;
      this.organisation.id = data.id;
      this.organisation.region = data.region;

      return this.organisation;
    },
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
  font-weight: 400;
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

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 24px;
  display: flex;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.button {
  width: 100%;
}
</style>
