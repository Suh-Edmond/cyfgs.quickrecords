<template>
  <div class="">
    <q-stepper v-model="step" ref="stepper" color="primary" animated>
      <q-step
        :name="1"
        :title="$t('app.account')"
        icon="account_circle"
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
        :title="$t('app.accountVerification')"
        icon="account_circle"
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
        :title="$t('app.organisationLabel')"
        icon="diversity_3"
        :done="hasCompletedOrganisationCreation"
        style="min-height: 500px"
      >
        <CreateOrganisationVue
          @onSubscriptionCreation="handleSubscriptionCreationEvent"
          @onContinueTrial="handleTrial"
        />
      </q-step>

      <!-- <q-step
        :name="4"
        title="Subscription"
        icon="calendar_check"
        :done="hasCompletedSubscription"
        style="min-height: 500px"
      >
        <SubscriptionCreationVue
          @onMakePayment="handleMakePayment"
          @onContinueTrial="handleTrial"
          @onBackToOrganisation="handleBackToOrganisation"
          @setProgressBar="setProgressBar"
        />
      </q-step> -->

      <q-step
        :name="5"
        :title="$t('app.trial')"
        icon="free_cancellation"
        :done="hasCompletedTrial"
        style="min-height: 500px"
      >
        <TrialManagementVue
          @onMakePaymentToPackage="handleSubscriptionPaymentEvent"
          @onStartTrial="handleStartTrialEvent"
          @setProgressBar="setProgressBar"
        />
      </q-step>
      <q-step
        :name="7"
        :title="$t('app.complete')"
        icon="task_alt"
        :done="hasCompletedSetup"
        style="min-height: 500px"
      >
        <CompleteSetup
          @onMakePayment="handleMakePayment"
          class="complete_content"
        >
        </CompleteSetup>
      </q-step>

      <template v-slot:message>
        <q-banner v-if="step === 1" class="bg-primary text-white q-px-lg">
          {{ $t("app.createAccountCaption") }}
        </q-banner>
        <q-banner v-else-if="step === 2" class="bg-primary text-white q-px-lg">
          {{ $t("app.confirmAccountCaption") }}
        </q-banner>
        <q-banner v-else-if="step === 3" class="bg-primary text-white q-px-lg">
          {{ $t("app.createOrganisationCaption") }}
        </q-banner>
        <q-banner v-else-if="step === 4" class="bg-primary text-white q-px-lg">
          {{ $t("app.subscriptionCaption") }}
        </q-banner>
        <q-banner v-else-if="step === 5" class="bg-primary text-white q-px-lg">
          {{
            $t("app.trialingSubscriptionCaption", {
              telephone: "+237673660071",
            })
          }}
        </q-banner>
        <q-banner v-else class="bg-primary text-white q-px-lg">
          {{ $t("app.completedSetupCaption") }}
        </q-banner>
        <q-linear-progress
          rounded
          indeterminate
          color="primary"
          v-show="showProgressBar"
        />
      </template>
    </q-stepper>
  </div>
</template>

<script>
import organisationMixin from "src/mixins/organisationMixin.vue";
import AccountCreation from "src/components/setup/AccountCreation.vue";
import ConfirmAccountCreationVue from "src/components/setup/ConfirmAccountCreation.vue";
import CreateOrganisationVue from "src/components/setup/CreateOrganisation.vue";

import memberMixinVue from "src/mixins/memberMixin.vue";
import UserSavingMixin from "src/mixins/UserSavingMixin.vue";
import TrialManagementVue from "src/components/setup/TrialManagement.vue";
import { LocalStorage } from "quasar";
import CompleteSetup from "src/components/setup/CompleteSetup.vue";

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
      hasCompletedOrganisationCreation: false,
      hasCompletedSubscription: false,
      hasCompletedTrial: false,
      hasCompletedPayment: false,
      hasCompletedSetup: false,
      isTrialMode: LocalStorage.getItem("isTrialMode"),
      showProgressBar: false,
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
      this.hasCompletedOrganisationCreation =
        this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },

    handleSubscriptionPaymentEvent() {
      this.hasCompletedSubscription =
        this.$store.getters.getProcessStage.isSuccessful;
      this.hasCompletedTrial = this.$store.getters.getProcessStage.isSuccessful;
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
      this.hasCompletedOrganisationCreation =
        this.$store.getters.getProcessStage.isSuccessful; //TODO: Remove when payment is working
      this.hasCompletedSubscription =
        this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },

    handleStartTrialEvent() {
      this.hasCompletedSetup = true; // TODO: Remove when payment is wokring;
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
      this.hasCompletedSetup = true; // TODO: Remove when payment is wokring;
    },
    handleCompletePayment() {
      this.hasCompletedPayment =
        this.$store.getters.getProcessStage.isSuccessful;
      this.hasCompletedSetup = this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },

    handleBackToOrganisation() {
      this.hasCompletedOrganisationCreation =
        this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },

    setProgressBar(showProgressBar) {
      return (this.showProgressBar = showProgressBar);
    },

    handleBackToSubscription() {
      this.hasCompletedOrganisationCreation =
        this.$store.getters.getProcessStage.isSuccessful;
      this.step = this.$store.getters.getProcessStage.step;
      this.processStatus = this.$store.getters.getProcessStage.processStatus;
    },
  },
  components: {
    AccountCreation,
    ConfirmAccountCreationVue,
    CreateOrganisationVue,
    // SubscriptionCreationVue,
    TrialManagementVue,
    CompleteSetup,
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

.complete_content {
  margin-bottom: 3rem !important;
}

.submit_btn {
  width: 10rem;
}
</style>
