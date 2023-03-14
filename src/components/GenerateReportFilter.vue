<template>
  <div class="q-pa-sm">
    <div class="q-pl-md">
      <label for="title" class="title">Select an option to Generate Report</label>
    </div>
    <div class="q-pt-md">
      <q-option-group :options="options" type="radio" v-model="group" @input="selectedOption" />
    </div>

    <hr class="separator" />
    <!-- report generation by activity -->
    <div v-if="group == 1" class="q-px-md q-pt-lg">
      <div class="q-mb-md">
        <label for="name" class="form_field">Select Activity or Event to Generate Report
        </label>
        <q-select outlined dense v-model="activity" placeholder="Type name to search..." :options="payment_items"
          input-debounce="0" class="q-mt-md">
        </q-select>
      </div>

      <div>
        <q-btn class="form_button" :label="label" :loading="loading" :color="color" :disabled="validateForm" @click="generateReport"
          :no_caps="no_caps">
          <q-icon name="arrow_forward" size="xs" class="q-pl-lg"></q-icon>
        </q-btn>
      </div>
    </div>

    <!-- quaterly report generation  -->
    <div v-if="group == 2" class="q-px-md q-pt-lg">
      <div class="q-mb-md">
        <label for="name" class="form_field">Click to Generate Quaterly Report
        </label>
      </div>
      <div>
        <q-btn class="form_button" :label="label" :loading="loading" :color="color" :disabled="group != 2"
          :no_caps="no_caps">
          <q-icon name="arrow_forward" size="xs" class="q-pl-lg"></q-icon>
        </q-btn>
      </div>
    </div>

    <!-- mid-year report generation  -->
    <div v-if="group == 3" class="q-px-md q-pt-lg">
      <div class="q-mb-md">
        <label for="name" class="form_field">Click to Generate Mid-Year Report
        </label>
      </div>
      <div>
        <q-btn class="form_button" :label="label" :loading="loading" :color="color" :disabled="group != 3"
          :no_caps="no_caps">
          <q-icon name="arrow_forward" size="xs" class="q-pl-lg"></q-icon>
        </q-btn>
      </div>
    </div>

    <!-- yearly report generation  -->
    <div v-if="group == 4" class="q-px-md q-pt-lg">
      <div class="q-mb-md">
        <label for="name" class="form_field">Select Year to Generate Report
        </label>
        <q-select outlined dense v-model="activity" placeholder="Type name to search..." :options="payment_items"
          input-debounce="0" class="q-mt-md">
        </q-select>
      </div>

      <div>
        <q-btn class="form_button" :label="label" :loading="loading" :color="color" :disabled="group != 4"
          :no_caps="no_caps">
          <q-icon name="arrow_forward" size="xs" class="q-pl-lg"></q-icon>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import UserSavingMixinVue from "src/mixins/UserSavingMixin.vue";
import PaymentCategoryMixin from "src/mixins/PaymentCategoryMixin.vue";
import ContributionsMixinVue from "src/mixins/ContributionsMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";

export default {
  mixins: [
    organisationMixinVue,
    UserSavingMixinVue,
    PaymentCategoryMixin,
    ContributionsMixinVue,
    HelperMixinVue,
  ],

  mounted() {
    let heading = "Generate Reports";
    this.$emit("set-heading", heading);
  },

  data() {
    return {
      no_caps: false,
      color: "primary",
      loading: false,
      label: "Generate Report",
      group: null,
      options: [
        { label: "By Activity/Event", value: 1 },
        { label: "Quaterly (3 months)", value: 2 },
        { label: "Mid-Year (6 months)", value: 3 },
        { label: "Yearly (12 months)", value: 4 },
      ],
      activity: null,
      payment_items: []
    };
  },
  computed: {
    validateForm() {
      return this.activity == null
    }
  },
  methods: {
    selectedOption() {
      switch (this.group) {
        case 1:
          this.getPaymentItems();
          break;
      }
    },

    getPaymentItems() {
      this.payment_items = [];
      let payload = {
        status: "none",
        url: `/api/protected/payment-items`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        if (res.success) {
          res.data.forEach((ele) => {
            this.payment_items.push({
              label: ele.name,
              value: ele.id,
            });
          });
        }
      });

      return this.payment_items;
    },

    generateReport(){
      this.loading = true;
      let payload = {
        status: "none",
        url: `/api/protected/activity/${this.activity.value}/generate-report`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_ACTIVITY_REPORT_DATA",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
         this.$emit("close-right-drawer");
          this.loading = false
      });

    }
  },
  components: {
  },
};
</script>

<style scoped lang="scss">
.title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  align-items: center;
  letter-spacing: 0.1em;
  color: $grey5;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.form_button {
  width: 100%;
}

.separator {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  align-items: center;
  letter-spacing: 0.1em;
  color: $grey5;
  margin-top: 1.3rem;
}
</style>
