<template>
  <div class="q-pa-sm">
    <div class="q-mx-md q-mt-lg">
      <q-form @submit="onRegisterMember" class="q-gutter-md">
        <div>
          <label for="credential" class="form_field">Member's Name</label>
          <q-input v-model="user.user_name" outlined dense disable />
        </div>
        <div>
          <label for="credential" class="form_field">Year</label>
          <q-input v-model="user.year" outlined dense disable />
        </div>
        <div>
          <label for="credential" class="form_field">Amount </label>
          <q-input v-model="user.amount" outlined dense type="number" disable />
        </div>
        <div v-if="isMonthlyRegFrequency">
          <label for="month" class="form_field">Select Month <span class="text-red">*</span></label>
          <q-select v-model="user.month_name" outlined dense :options="monthsOptions" label="Search month..." use-input
            input-debounce="0" clearable @filter="filterMonths">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="flex q-mt-lg justify-end">
          <div>
            <ButtonVue label="Save" :loading="loading" color="primary" :no_caps="true" :disabled="validateForm">
            </ButtonVue>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import RegistrationAmountMixinVue from 'src/mixins/RegistrationAmountMixin.vue';
import { Notify,Platform } from 'quasar';
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export default {
  mixins: [memberMixinVue, organisationMixinVue, RegistrationAmountMixinVue],
  mounted() {
    let heading = "Register Member to the Organisation";
    this.$emit("set-heading", heading);
    this.getRegistrationAmount();
  },
  data() {
    return {
      loading: false,
      user: {
        user_name: null,
        year: null,
        amount: null,
        month_name: "",
      },
      monthsOptions: [],
    };
  },
  computed: {
    isMonthlyRegFrequency() {
      return this.$store.getters.getRegAmount.frequency == 'MONTHLY';
    },
    getRegisterMember() {
      if (this.$store.getters.getRegAmount == 0) {
        Notify.create({
          color: "info",
          message: "Registration amount has not been set! Please set the amount under Settings",
          type: "info",
          position: Platform.is.mobile ? "bottom" : "top-right",
        });
      }
      return this.setFormField(
        this.$store.getters.getMemberToRegister.name,
        this.$store.getters.getCurrentYear.year,
        this.$store.getters.getRegAmount.amount
      );
    },

    validateForm() {
      return this.isMonthlyRegFrequency && this.user.month_name == "" || this.$store.getters.getRegAmount == 0;
    }
  },
  watch: {
    getRegisterMember() {
      return this.setFormField(
        this.$store.getters.getMemberToRegister.name,
        this.$store.getters.getCurrentYear.year,
        this.$store.getters.getRegAmount.amount
      );
    },
  },
  methods: {
    onRegisterMember() {
      this.loading = true;
      let payload = {
        url: `/api/protected/members-registration`,
        data: {
          user_id: this.$store.getters.getMemberToRegister.id,
          month_name: this.user.month_name
        },
        msg: "Member registered Successfully",
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
      this.$store
        .dispatch("postRequest", payload)
        .then(() => {
          let id = this.$store.getters.getOrganisation.id;
          this.getOrganisationMembers(id, true);
        })
        .finally(() => {
          this.loading = false;
          this.resetForm();
          this.$emit("close-right-drawer");
        });
    },

    resetForm() {
      this.user.user_id = null;
      this.user.amount = 0.0;
      this.user.year = null;

      return this.user;
    },

    setFormField(name, year, amount) {
      this.user.year = year;
      this.user.amount = amount;
      this.user.user_name = name;
      return this.user;
    },


    filterMonths(val, update, abort) {
      if (val.length < 2) {
        abort();
        return;
      }
      if (this.month == "") {
        this.monthsOptions = months;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.monthsOptions = months.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
  },
  components: {
    ButtonVue,
  },
};
</script>

<style scoped lang="scss">
.hint {
  color: $grey2;
  font-size: small;
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
</style>
