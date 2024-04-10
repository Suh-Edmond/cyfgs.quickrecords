<template>
  <div class="q-pa-sm">
    <q-banner
      inline-actions
      rounded
      class="bg-secondary text-white q-mb-lg q-mx-md q-mt-sm"
      dense
      v-if="checkUserHasRegister"
    >
      {{ $t("app.memberHasRegister") }}
      <template v-slot:action>
        <q-btn flat icon="close" size="sm" />
      </template>
    </q-banner>
    <q-form
      @submit="onRegisterMember"
      class="q-gutter-sm"
      :class="$q.platform.is.mobile ? 'q-pl-sm' : ''"
    >
      <div>
        <label for="credential" class="form_field">{{
          $t("app.membersName")
        }}</label>
        <q-input v-model="user.user_name" outlined dense disable />
      </div>
      <div>
        <label for="credential" class="form_field">{{ $t("app.year") }}</label>
        <q-input v-model="user.year" outlined dense disable />
      </div>
      <div>
        <label for="credential" class="form_field"
          >{{ $t("app.amount") }}
        </label>
        <q-input v-model="user.amount" outlined dense type="number" disable />
      </div>
      <div v-if="isMonthlyRegFrequency">
        <label for="month" class="form_field"
          >{{ $t("app.selectMonth") }}<span class="text-red">*</span></label
        >
        <q-select
          v-model="user.month_name"
          outlined
          dense
          :options="monthsOptions"
          :label="$t('app.searchMonth')"
          use-input
          input-debounce="0"
          clearable
          @filter="filterMonths"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                {{ $t("app.noResults") }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div
        :class="
          $q.platform.is.desktop
            ? 'flex q-mt-lg justify-end'
            : 'q-pt-xs q-mb-lg'
        "
      >
        <ButtonVue
          :label="$t('app.saveBtnLabel')"
          :loading="loading"
          color="primary"
          :no_caps="true"
          :disabled="validateForm"
        >
        </ButtonVue>
      </div>
    </q-form>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import RegistrationAmountMixinVue from "src/mixins/RegistrationAmountMixin.vue";
import { Notify, Platform } from "quasar";
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
    let heading = this.$t("app.registerMemberHeading");
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
      return this.$store.getters.getRegAmount.frequency == "MONTHLY";
    },
    getRegisterMember() {
      if (this.$store.getters.getRegAmount == null) {
        Notify.create({
          color: "info",
          message: this.$t("app.registrationAmountNotSet"),
          type: "info",
          position: Platform.is.mobile ? "bottom" : "top-right",
        });
      }
      console.log(this.$store.getters.getRegAmount.amount);
      return this.setFormField(
        this.$store.getters.getMemberToRegister.name,
        this.$store.getters.getCurrentYear.year,
        this.$store.getters.getRegAmount.amount
      );
    },

    validateForm() {
      return (
        (this.isMonthlyRegFrequency && this.user.month_name == "") ||
        this.$store.getters.getRegAmount == 0 ||
        this.checkUserHasRegister
      );
    },

    checkUserHasRegister() {
      return this.$store.getters.getMemberToRegister.has_paid;
    },
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
          month_name: this.user.month_name,
        },
        msg: this.$t("app.memberRegisteredSuccessMsg"),
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
        .dispatch("postRequest", payload)
        .then(() => {
          let id = this.$store.getters.getOrganisation.id;
          this.filterOrganisationMembers(
            id,
            false,
            1,
            7,
            "name",
            this.$store.getters.getCurrentYear.id,
            "",
            "",
            ""
          );
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
