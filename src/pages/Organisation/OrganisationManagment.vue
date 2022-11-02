<template>
  <q-page class="q-pa-xs">
    <!-- <div class="flex flex-center" v-if="req_loader">
      <q-spinner color="dark" size="2em" :thickness="2"/>
    </div> -->
    <div>
      <label for="title" class="title">Organisation Information</label>
    </div>
    <q-form
      @submit="onSubmit"
      :style="$q.screen.lg ? '' : 'margin-bottom:5rem;'"
    >
      <div class="row q-py-sm q-px-sm" :class="$q.screen.lg ? 'q-mb-md' : ''">
        <div
          class="col-md-6 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-px-md' : 'q-py-sm'"
        >
          <div>
            <label for="credential" class="form_field">Name</label>
            <q-input
              v-model="organisation.name"
              outlined
              dense
              type="text"
              filled
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
              v-model="organisation.email"
              outlined
              dense
              type="email"
              filled
            />
          </div>
        </div>
      </div>
      <div class="row q-px-sm" :class="$q.screen.lg ? 'q-mb-md' : ''">
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
              dense
              type="tel"
              filled
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
              dense
              type="text"
              filled
            />
          </div>
        </div>
      </div>
      <div class="row q-px-sm" :class="$q.screen.lg ? 'q-mb-md' : ''">
        <div
          class="col-md-6 col-xs-12 col-sm-12"
          :class="$q.screen.lg ? 'q-px-md' : 'q-py-sm'"
        >
          <div>
            <label for="credential" class="form_field">Salutation</label>
            <q-input
              v-model="organisation.salutation"
              outlined
              dense
              type="text"
              filled
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
              dense
              type="number"
              filled
            />
          </div>
        </div>
      </div>
      <div class="row q-px-sm" :class="$q.screen.lg ? 'q-mb-md' : ''">
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
            <label for="credential" class="form_field">Logo</label>
            <q-file outlined v-model="logo" dense filled label="Select logo to upload">
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
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
      logo: null,
      organisation: {
        name: null,
        email: null,
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
          let payload = {
            data: "",
            status: "none",
            url: "/api/protected/organisation-info",
            has_path_val: true,
            show_feedback: false,
            msg: "default",
            color: "default",
            to_on_ok: "none",
            to_on_fail: "none",
            error_msg: "default",
          };
          this.$store.dispatch("auth/getRequest", payload).then((res) => {
            this.setOrganisationInfo(res.data);
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getOrganisationInfo() {
      let payload = {
        data: "",
        status: "none",
        url: "/api/protected/organisation-info",
        has_path_val: true,
        show_feedback: false,
        msg: "default",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "default",
        commit:"SET_ORGANISATION",
        has_commit:true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.show_loading = true;
      this.$emit("start-loading", this.show_loading);
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.show_loading = false;
        this.$emit("start-loading", this.show_loading);
        this.setOrganisationInfo(res.data);
      });
    },

    setOrganisationInfo(data) {
      this.organisation.address = data.address;
      this.organisation.name = data.name;
      this.organisation.email = data.email;
      this.organisation.telephone = data.telephone.split("/")[0];
      this.organisation.telephone2 = data.telephone.split("/")[1];
      this.organisation.salutation = data.salutation;
      this.organisation.description = data.description;
      this.organisation.box_number = data.box_number;
      this.organisation.id = data.id;

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

.button {
  width: 100%;
}
</style>
