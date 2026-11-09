<template>
  <div class="q-m-sm">
    <q-form @submit="uploadFile">
      <div class="text-subtitle2 text-center text-primary">
        {{ $t("app.importMemberMsg") }}
      </div>
      <div
        class="row q-gutter-md q-pt-md"
        :class="$q.platform.is.mobile ? 'q-mr-md' : ''"
      >
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
            :label="$t('app.bulkUpload')"
            :loading="loading"
            color="primary"
            :disabled="validateFormUpload"
            no_caps="true"
            class="full-width"
          >
          </ButtonVue>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import ButtonVue from "src/components/Button.vue";
import { LocalStorage } from "quasar";
export default {
  mixins: [memberMixinVue, organisationMixinVue],
  data() {
    return {
      file: null,
      loading: false,
    };
  },

  computed: {
    validateFormUpload() {
      return this.file === null;
    },
  },
  methods: {
    getOrganisationId() {
      const organ = LocalStorage.getItem("data");
      if (organ) {
        return organ.subscription.organisation.id;
      }
    },
    uploadFile(event) {
      const formData = new FormData();
      formData.append("file", this.file);
      let payload = {
        url: `/api/protected/organisations/${this.getOrganisationId()}/bulk-import-users`,
        msg: this.$t("app.uploadMemberSuccessMsg"),
        data: formData,
        color: "default",
        show_feedback: true,
        status: "success",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
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
        .then(() => {})
        .finally(() => {
          this.loading = false;
          this.file = null;
        });
    },
  },
  components: {
    ButtonVue,
  },
};
</script>
<style scoped lang="scss">
* {
  box-sizing: border-box;
}

.text-subtitle2 {
  color: $grey2;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
  align-items: center;
  text-align: center;
}
</style>
