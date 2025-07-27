<template>
  <div
    class="q-my-md q-ml-md"
    :class="$q.platform.is.mobile ? 'q-mr-sm' : 'q-mr-md'"
  >
    <q-banner
      inline-actions
      rounded
      class="bg-secondary text-white q-mb-md"
      dense
      v-if="checkUserHasRegister && getMemberRegistrationStatus === 'APPROVED'"
    >
      <span class="registration_text">
        {{ $t("app.memberHasRegister") }} {{ getRegisterMember.year }}
      </span>
      <template v-slot:action>
        <q-btn flat icon="close" size="sm" />
      </template>
    </q-banner>
    <q-banner
      inline-actions
      rounded
      class="bg-info text-white q-mb-md registration_text"
      dense
      v-if="checkUserHasRegister && getMemberRegistrationStatus === 'PENDING'"
    >
      <span class="registration_text"
        >{{ $t("app.memberPaidRegistrationMsg") }}
        {{ getRegisterMember.year }}</span
      >
      <template v-slot:action>
        <q-btn flat icon="close" size="sm" />
      </template>
    </q-banner>
    <q-form
      @submit="onRegisterMember"
      class="q-gutter-sm q-mt-md"
      :class="$q.platform.is.mobile ? 'q-pl-sm' : ''"
    >
      <div>
        <label class="form_field">{{
          $t("app.membersName")
        }}</label>
        <q-input v-model="user.user_name" outlined dense disable />
      </div>
      <div>
        <label class="form_field">{{ $t("app.year") }}</label>
        <q-input v-model="user.year" outlined dense disable hide-bottom-space />
      </div>
      <div>
        <label class="form_field"
          >{{ $t("app.amount") }}
        </label>
        <q-input
          v-model="user.amount"
          outlined
          dense
          type="number"
          disable
          hide-bottom-space
        />
      </div>
      <div v-if="isMonthlyRegFrequency">
        <label class="form_field"
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
          hide-bottom-space
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
        v-if="$q.platform.is.desktop"
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
      <div v-if="$q.platform.is.mobile" class="q-mt-md">
        <ButtonVue
          :label="$t('app.saveBtnLabel')"
          :loading="loading"
          color="primary"
          :no_caps="true"
          :disabled="validateForm"
          class="full-width"
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
import CurrentYearMixin from "src/mixins/CurrentYearMixin";
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
  mixins: [
    memberMixinVue,
    organisationMixinVue,
    RegistrationAmountMixinVue,
    CurrentYearMixin,
  ],
  mounted() {
    let heading = this.$t("app.registerMemberHeading");
    this.$emit("set-heading", heading);
    this.getRegistrationAmount();
    if (
      this.$store.getters.getCurrentYear == null
    ) {
      this.fetchCurrentYear();
    }
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
      return this.$store.getters.getRegAmount.frequency === "MONTHLY";
    },
    getRegisterMember() {
      console.log(this.$store.getters.getRegAmount);
      
      if (this.$store.getters.getRegAmount == null) {
        Notify.create({
          color: "info",
          message: this.$t("app.registrationAmountNotSet"),
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
      return (
        (this.isMonthlyRegFrequency && this.user.month_name === "") ||
        this.$store.getters.getRegAmount === 0 ||
        this.checkUserHasRegister
      );
    },

    checkUserHasRegister() {
      return this.$store.getters.getMemberToRegister.has_paid;
    },

    getMemberRegistrationStatus() {
      return this.$store.getters.getMemberToRegister.approve;
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
            10,
            "name",
            "",
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
      if (this.month === "") {
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
.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.7rem;
  align-items: center;
  color: $grey5;
}

.registration_text {
  font-size: 0.7rem;
}
</style>
