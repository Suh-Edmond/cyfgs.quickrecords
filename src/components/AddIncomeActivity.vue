<template>
  <div class="q-pa-md">
    <div class="q-mt-md q-mx-md">
      <q-form @submit="onAddIncomeActivity" class="q-gutter-sm">
        <div class="q-mb-md">
          <label for="credential" class="form_field"
            >Name <span class="text-red">*</span></label
          >
          <q-input v-model="income_activity.name" outlined dense type="text" />
        </div>
        <div class="q-mb-md">
          <label for="credential" class="form_field"
            >Amount <span class="text-red">*</span></label
          >
          <q-input
            v-model="income_activity.amount"
            outlined
            dense
            type="number"
          />
        </div>
        <div class="q-mb-md">
          <label for="credential" class="form_field"
            >Venue <span class="text-red">*</span></label
          >
          <q-input v-model="income_activity.venue" outlined dense type="text" />
        </div>
        <div class="q-mb-md">
          <label for="credential" class="form_field"
            >Date <span class="text-red">*</span></label
          >
          <q-input v-model="income_activity.date" outlined dense type="date" />
        </div>
        <div class="q-mb-md">
          <label for="credential" class="form_field">Description</label>
          <q-input
            v-model="income_activity.description"
            outlined
            dense
            autogrow
          />
        </div>
        <div class="row q-mt-lg justify-end">
          <div class="col-md-2 col-sm-2 col-xs-2">
            <ButtonVue
              class="form_button"
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
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import IncomeActivityMixinVue from "src/mixins/IncomeActivityMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";


export default {
  mixins: [IncomeActivityMixinVue, organisationMixinVue],

  created() {
    let heading = "Income Activity Information";
    this.$emit("set-heading", heading);
  },

  data() {
    return {
      label_save: "Save",
      loading: false,
      color: "primary",
      income_activity: {
        venue: null,
        date: null,
        name: null,
        description: null,
        amount: 0,
        id:null,
        organisation_id:null,
      },
      position: "right",
      dialog: false,
      no_caps: true,
    };
  },
  computed: {
    validateForm() {
      return this.income_activity.amount == 0 ||
        this.income_activity.name == null ||
        this.income_activity.date == null ||
        this.income_activity.venue == null
        ? true
        : false;
    },
  },
  methods: {
    onAddIncomeActivity() {
      let organisation_id = this.getOrganisationId;
      let payload = {
        url: this.setActionUrl(this.income_activity.id, organisation_id),
        data: this.income_activity,
        msg: "Income Activity saved Successfully",
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
      this.setDispatchAction(this.income_activity.id, payload);
    },

    resetForm() {
      this.income_activity.name = null;
      this.income_activity.amount = 0;
      this.income_activity.date = null;
      this.income_activity.description = null;
      this.income_activity.organisation_id = null;
      this.income_activity.venue = null;
      this.income_activity.id = null;

      return this.income_activity;
    },


    setActionUrl(id, organsation_id) {
      let url = "";
      if (id === null) {
        url = `/api/protected/organisations/${organsation_id}/income-activities`;
      } else {
        url = `/api/protected/income-activities/${id}/update`;
      }
      return url;
    },

    setDispatchAction(id, payload) {
      this.loading = true;
      if (id === null) {
        this.$store
          .dispatch("postRequest", payload)
          .then(() => {
            this.getOrganisationIncomeActivities();
          })
          .finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
            this.resetForm();
          });
      } else {
        this.$store
          .dispatch("putRequest", payload)
          .then(() => {
            this.getOrganisationIncomeActivities();
          })
          .finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
            this.resetForm();
            // this.$store.dispatch("setUpdatedExpenditureItemDetail", null);
            // this.$store.dispatch("setEditState", false);
          });
      }
    },
  },
  components: {
    ButtonVue,
  },
};
</script>

<style scoped lang="scss">
.add_member_title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 29px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.01em;
  color: #5384ae;
  text-transform: capitalize;
}

.button {
  width: 100%;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
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
  font-size: 13px;
  text-align: center;
  align-items: center;
  letter-spacing: 0.01em;
}
</style>
