<template>
  <div class="">
    <q-stepper v-model="step" ref="stepper" color="primary" animated>
      <q-step
        :name="1"
        title="Account"
        icon="settings"
        :done="hasCompletedAccountCreation"
        style="min-height: 500px"
      >
        <AccountCreation
          @confirmAccountCreation="handleConfirmAccountCreationEvent"
          @onAccountCreation="handleAccountCreationEvent"
        />
      </q-step>

      <q-step
        v-if="processStatus === 'ACCOUNT_VERIFICATION'"
        :name="2"
        title="Account Verification"
        icon="settings"
        :done="hasCompletedAccountVerification"
        style="min-height: 500px"
      >
        <ConfirmAccountCreationVue
          @onAccountCreation="handleAccountCreationEvent"
          @onCreateOrganisation="handleOrganisationCreationEvent"
        />
      </q-step>

      <q-step
        :name="3"
        title="Organisation"
        icon="settings"
        :done="completedOrganisationCreation"
        style="min-height: 500px"
      >
        <CreateOrganisationVue
          @onSubscriptionCreation="handleSubscriptionCreationEvent"
        />
      </q-step>

      <q-step
        :name="4"
        title="Subscription"
        icon="settings"
        :done="hasCompletedSubscription"
        style="min-height: 500px"
      >
        <SubscriptionCreationVue
          @onMakePayment="handleMakePayment"
          @onContinueTrial="handleTrial"
        />
        <q-stepper-navigation>
          <q-btn
            flat
            @click="step = 3"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="5"
        v-if="
          processStatus === 'IN_TRIAL' || getProcessStage.isTrial || isTrialMode
        "
        title="Trail"
        icon="settings"
        :done="hasCompletedTrial"
        style="min-height: 500px"
      >
        <TrialManagementVue
          @onSubscribeToPackage="handleSubscriptionCreationEvent"
          @onStartTrial="handleStartTrialEvent"
        />
      </q-step>

      <q-step
        :name="6"
        title="Payment"
        icon="settings"
        :done="hasCompletedPayment"
        style="min-height: 500px"
      >
        <PaymentManagementVue
          @onContinueTrial="handleContinueTrialEvent"
          @onCompletePayment="handleCompletePayment"
        />

        <q-stepper-navigation>
          <q-btn
            flat
            @click="$refs.stepper.previous()"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="7"
        title="Complete"
        icon="settings"
        :done="hasCompletedSetup"
        style="min-height: 500px"
      >
        <span class="forgot_password text-right q-mt-xl">{{
          $t("app.successfulOrganSetup")
        }}</span>
        <router-link to="/auth/login" class="sign_link">
          <span class="forgot_password text-right q-mt-xl">{{
            $t("app.loginCaption")
          }}</span>
        </router-link>
      </q-step>

      <template v-slot:message>
        <q-banner v-if="step === 1" class="bg-primary text-white q-px-lg">
          Get Started by creating an account
        </q-banner>
        <q-banner v-else-if="step === 2" class="bg-primary text-white q-px-lg">
          Continue by verifying your account
        </q-banner>
        <q-banner v-else-if="step === 3" class="bg-primary text-white q-px-lg">
          Create your Organisation
        </q-banner>
        <q-banner v-else-if="step === 4" class="bg-primary text-white q-px-lg">
          Subscribe to a package or continue with Trail
        </q-banner>
        <q-banner v-else-if="step === 5" class="bg-primary text-white q-px-lg">
          You are currently in Trial mode, make payment for complete usage
        </q-banner>
        <q-banner v-else class="bg-primary text-white q-px-lg">
          Complete Subscription Payment
        </q-banner>
      </template>
    </q-stepper>
  </div>
</template>

<script>
import organisationMixin from "src/mixins/organisationMixin.vue";
import ButtonVue from "src/components/Button.vue";
import AccountCreation from "src/components/setup/AccountCreation.vue";
import ConfirmAccountCreationVue from "src/components/setup/ConfirmAccountCreation.vue";
import CreateOrganisationVue from "src/components/setup/CreateOrganisation.vue";

import memberMixinVue from "src/mixins/memberMixin.vue";
import UserSavingMixin from "src/mixins/UserSavingMixin.vue";
import { VueTelInput } from "vue-tel-input";
import SubscriptionCreationVue from "src/components/setup/SubscriptionCreation.vue";
import PaymentManagementVue from "src/components/setup/PaymentManagement.vue";
import TrialManagementVue from "src/components/setup/TrialManagement.vue";
import { LocalStorage } from "quasar";

export default {
  name: "PageIndex",
  mixins: [organisationMixin, memberMixinVue, UserSavingMixin],
  data() {
    return {
      logo: null,
      loading: false,
      color: "primary",
      directory: "LOGOS",
      step: 1,
      processStatus: "CREATE_ACCOUNT",
      processStep: "CREATE_ACCOUNT",
      hasCompletedAccountCreation: false,
      hasCompletedAccountVerification: false,
      completedOrganisationCreation: false,
      hasCompletedSubscription: false,
      hasCompletedTrial: false,
      hasCompletedPayment: false,
      hasCompletedSetup: false,
      isTrialMode: LocalStorage.getItem("isTrialMode"),
    };
  },

  computed: {
    getProcessStage() {
      return this.$store.getters.getProcessStage;
    },
  },
  methods: {
    handleConfirmAccountCreationEvent() {
      this.hasCompletedAccountCreation =
        this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },

    handleAccountCreationEvent() {
      this.hasCompletedAccountCreation =
        this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },
    handleOrganisationCreationEvent() {
      this.hasCompletedAccountVerification =
        this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },

    handleSubscriptionCreationEvent() {
      this.completedOrganisationCreation =
        this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },

    handleMakePayment() {
      this.hasCompletedSubscription =
        this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },

    handleTrial() {
      this.hasCompletedSubscription =
        this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },

    handleStartTrialEvent() {
      this.hasCompletedTrial = this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },
    handleContinueTrialEvent() {
      this.hasCompletedSubscription =
        this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.hasCompletedPayment = false;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },
    handleCompletePayment() {
      this.hasCompletedPayment =
        this.$store.getters.getProcessStage.isSuccessful;
      this.hasCompletedSetup = this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },
  },
  components: {
    AccountCreation,
    ConfirmAccountCreationVue,
    CreateOrganisationVue,
    SubscriptionCreationVue,
    TrialManagementVue,
    PaymentManagementVue,
  },
};
</script>

<style src="vue-tel-input/dist/vue-tel-input.css"></style>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.page {
  background-color: $grey1;
}

.q-stepper__header--alternative .q-stepper__line {
  display: none;
}

.text_h6 {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
}

.text-subtitle2 {
  color: $grey2;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
}

.validation_warning {
  color: $grey2;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
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

.form_button {
  width: 100%;
  margin-bottom: 0.1rem;
}

.forgot_password {
  display: block;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 24px;
  align-items: center;
  letter-spacing: 0.005em;
  color: $primary;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.submit_btn {
  width: 10rem;
}
</style>
