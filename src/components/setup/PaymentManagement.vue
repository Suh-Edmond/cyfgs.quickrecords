<template>
  <div class="row q-col-gutter-md">
    <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12"></div>
    <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12">
      <q-card flat bordered>
        <q-card-section class="bg-primary text-white text-muted">
          <div class="text_h6 q-pt-xs q-pb-sm row justify-start text-white">
            {{ $t("app.paymentDetails") }}
          </div>
          <div class="q-pb-xs summaryCaption text-white">
            {{ $t("app.paymentCaption") }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-form @submit="onSubmit">
            <div class="q-pb-sm">
              <q-btn
                round
                color="grey-5"
                label="1"
                class="q-mb-lg text-black payment_btn_step"
                size="sm"
              />
              <label class="text-h6 q-pl-md text-subtitle2"
                >{{ $t("app.customerInformationTitle") }}
              </label>
            </div>
            <div class="row q-col-gutter-x-xs">
              <div class="col-6">
                <label class="form_field"
                  >{{ $t("app.nameAdminLabel") }}
                </label>
                <q-input
                  v-model="payment.adminName"
                  outlined
                  dense
                  type="text"
                  placeholder="exampleadmin"
                />
              </div>
              <div class="col-6">
                <label class="form_field"
                  >{{ $t("app.usernameAdminLabel") }}
                </label>
                <q-input
                  v-model="payment.adminUsername"
                  outlined
                  dense
                  type="text"
                  placeholder="exampleadmin"
                  bottom-slots
                />
              </div>
            </div>

            <div class="row q-col-gutter-x-xs">
              <div class="col-6">
                <label class="form_field"
                  >{{ $t("app.organisationName") }}
                </label>
                <q-input
                  v-model="payment.organisationName"
                  outlined
                  dense
                  type="text"
                  placeholder="exampleadmin"
                />
              </div>
              <div class="col-6">
                <label class="form_field"
                  >{{ $t("app.organisationEmail") }}
                </label>
                <q-input
                  v-model="payment.organisationEmail"
                  outlined
                  dense
                  type="email"
                  placeholder="exampleadmin"
                />
              </div>
            </div>

            <div class="q-py-lg">
              <q-btn
                round
                color="grey-5"
                label="2"
                class="q-mb-lg text-black payment_btn_step"
                size="sm"
              />

              <label class="text-h6 q-pl-md text-subtitle2"
                >{{ $t("app.paymentMethod") }}
              </label>
            </div>
            <div>
              <label class="form_field"
                >{{ $t("app.paymentMethodLabel") }}
              </label>
              <q-select
                outlined
                dense
                v-model="payment.payment_method"
                :options="paymentOptions"
                :error="!!paymentError"
                :error-message="paymentError"
              />
            </div>
            <div>
              <label class="form_field">
                <span>
                  {{ $t("app.accountNumber") }}
                </span>
              </label>
              <q-input
                placeholder="Enter an account number"
                v-model="payment.transaction_number"
                outlined
                dense
                type="text"
                hide-bottom-space
                :error="!!accountNumberError"
                :error-message="accountNumberError"
              ></q-input>
            </div>
            <div v-if="getSubscriptionPlan.billing_cycle === 'monthly'">
              <label class="form_field"
                >{{ $t("app.numberofPaymentMonths") }}
              </label>
              <q-input
                v-model="payment.billing_duration"
                outlined
                dense
                type="number"
              />
            </div>
            <div
              class="q-pt-md"
              v-if="getSubscriptionPlan.billing_cycle === 'yearly'"
            >
              <label class="form_field"
                >{{ $t("app.numberofPaymentYears") }}
              </label>
              <q-input
                v-model="payment.billing_duration"
                outlined
                dense
                type="number"
              />
            </div>
            <div class="q-pt-lg">
              <q-btn
                class="form_button"
                :label="$t('app.makePaymentBtnLabel')"
                :loading="loading"
                :disabled="!validateForm"
                color="primary"
                no-caps
                type="submit"
              >
                <q-icon
                  name="arrow_forward"
                  size="xs"
                  class="q-pl-lg"
                  v-show="!loading"
                ></q-icon>
                <template v-slot:loading>
                  {{ $t("app.processingPayment") }}
                  <q-spinner />
                </template>
              </q-btn>
            </div>

            <div class="row justify-between q-pt-md">
              <q-btn
                outline
                rounded
                @click="onContinueWithTrial()"
                color="primary"
                no-caps
                :label="$t('app.continuetrialLink')"
              />

              <q-btn
                outline
                rounded
                @click="onbackSubscription()"
                color="primary"
                no-caps
                :label="$t('app.backSubscription')"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12">
      <q-card flat bordered>
        <q-card-section class="bg-indigo-1">
          <div class="text_h6 q-pt-xs q-pb-sm row justify-start text-black">
            {{ $t("app.summaryTitle") }}
          </div>
          <div class="q-pb-sm summaryCaption">
            {{ $t("app.summaryCaption") }}
          </div>
        </q-card-section>
        <q-card-section>
          <div class="bg-indigo-1 q-pa-lg rounded-borders">
            <div
              class="row justify-between"
              v-if="getSubscriptionPlan.billing_cycle === 'monthly'"
            >
              <label class="payment_figures"
                >{{ $t("app.monthlyBilling") }}
              </label>

              <label class="payment_figures">
                {{ Number(getSubscriptionPlan.price).toLocaleString() }}
                XAF/Month
              </label>
            </div>
            <div
              class="row justify-between"
              v-if="getSubscriptionPlan.billing_cycle === 'yearly'"
            >
              <label class="payment_figures"
                >{{ $t("app.yearlyBilling") }}
              </label>

              <label class="payment_figures">
                {{ Number(getSubscriptionPlan.price).toLocaleString() }}
                XAF/Year
              </label>
            </div>

            <div class="row justify-between q-py-sm">
              <label class="payment_figures">Referral Code Discount </label>

              <label class="payment_figures">
                {{ Number(getReferralCodeDiscount).toLocaleString() }} XAF
              </label>
            </div>

            <div class="row justify-between q-pb-sm">
              <label class="payment_figures">Payment Charges </label>

              <label class="payment_figures"> {{ getPaymentCharges }} % </label>
            </div>
            <q-separator />
            <div class="row justify-between">
              <label class="payment_total_amount text-weight-bolder"
                >Total
              </label>

              <label class="payment_total_amount text-weight-bolder">
                {{ Number(computeTotalAmount).toLocaleString() }} XAF
              </label>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <label class="account_text">{{ $t("app.featureList") }} </label>
          <q-list class="q-pt-md">
            <q-item v-for="(feature, index) in features" , :key="index" dense>
              <q-item-section avatar>
                <q-icon
                  color="secondary"
                  text-color="white"
                  name="done"
                  size="sm"
                />
              </q-item-section>
              <q-item-section>{{ feature }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12"></div>
  </div>
</template>

<script>
import { LocalStorage, Notify, Platform } from "quasar";
import ProcessStatusVue from "../Constants/ProcessStatus.vue";
import startBroadcasting from "src/boot/echo";
export default {
  name: "PageIndex",
  mounted() {
    this.setPaymentInfo();
    startBroadcasting;

    // let payId = "77433ef3-a060-4779-95f6-7ac2c18fe722",
    // let subscId = "321c173d-fbc0-4741-b6a1-1b3c4ca2d3b7"
    window.Echo.private(
      `payments.321c173d-fbc0-4741-b6a1-1b3c4ca2d3b7.77433ef3-a060-4779-95f6-7ac2c18fe722`
    )
      .listen("PaymentStatusUpdated", (e) => {
        // this.handlePaymentUpdate(e);
        console.log(e);
      })
      .error((error) => {
        console.error("Connection Error:", error);
      });
  },
  beforeDestroy() {
    // window.Echo.leave(`payments.${this.payment.transaction_id}`);
  },
  data() {
    return {
      payment: {
        payment_method: "MTN Mobile-Money",
        transaction_number: "",
        billing_duration: 1,
        adminName: "",
        adminUsername: "",
        organisationName: "",
        organisationEmail: "",
        login_id: "",
        subscription_id: "",
        transaction_id: "",
      },
      loading: false,
      paymentOptions: [
        {
          value: "MTN",
          label: "MTN Mobile-Money",
        },
        {
          value: "Orange",
          label: "Orange Money",
        },
      ],
      paymentError: "",
      accountNumberError: "",
      telephoneError: "",
      features: [
        "User Management",
        "Income Management",
        "Expenditure Management",
        "Contributions Management",
        "Reports and Statistics",
        "Balance Sheets Generation",
        "Logs and Tracability",
        "Security and Secure Storage",
        "Free Training and Support",
        "Free Data Migration",
        "One Month Free Trial",
      ],
      userSubscriptions: JSON.parse(LocalStorage.getItem("subscriptions")),
    };
  },
  emits: ["onCompletePayment", "onContinueTrial", "onbackSubscription"],
  computed: {
    validateForm() {
      const regex = /^\+?[\d\s]+$/;
      const validPhone = regex.test(this.payment.transaction_number);

      return validPhone;
    },

    getSubscriptionPlan() {
      if (this.userSubscriptions === null) {
        return;
      }
      return this.userSubscriptions[0].subscription_plan;
    },

    getReferralCodeDiscount() {
      if (this.userSubscriptions === null) {
        return 0;
      }
      return this.userSubscriptions[0].referral_code_discount;
    },
    getPaymentCharges() {
      return process.env.PAYMENT_CHARGES;
    },
    computeTotalAmount() {
      let subscription = this.userSubscriptions;
      let totalAmount = subscription[0].subscription_plan.price;
      if (subscription === null) {
        return;
      }
      let subscriptionPlan = subscription[0].subscription_plan;
      if (
        subscriptionPlan.is_discount_applicable &&
        subscriptionPlan.discount_percentage > 0
      ) {
        totalAmount =
          subscriptionPlan.price -
          subscriptionPlan.price * (subscriptionPlan.discount_percentage / 100);
      }

      if (this.getReferralCodeDiscount > 0) {
        totalAmount =
          totalAmount > 0
            ? totalAmount - this.getReferralCodeDiscount
            : subscriptionPlan.price - this.getReferralCodeDiscount;
      }
      totalAmount = totalAmount * this.payment.billing_duration;

      totalAmount =
        totalAmount * (process.env.PAYMENT_CHARGES / 100) + totalAmount;

      return totalAmount;
    },

    computePaymentCharges() {
      return process.env.PAYMENT_CHARGES / 100;
    },
  },
  methods: {
    onSubmit() {
      let payload = {
        url: "/api/protected/init/client/subscriptions/initiate-payment",
        data: {
          ...this.payment,
          transaction_number: this.payment.transaction_number
            .replaceAll(" ", "")
            .replaceAll("+", ""),
        },
        msg: "Payment Initiated Successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "default",
        show_feedback: true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then((res) => {
          if (res.status === 422) {
            Notify.create({
              type: "negative",
              message: this.$t("app.createAccountFailMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
          if (res.status === 408) {
            Notify.create({
              type: "negative",
              message: this.$t("app.connectionProblem"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
          if (res.status == 200) {
            console.log({ ...res });

            this.payment.transaction_id = res.data.data.reference;
            this.$q
              .dialog({
                title: "Alert",
                message:
                  "Please confirm the payment or dial *126# to confirm the payment",
              })
              .onOk(() => {
                console.log("OK");
              })
              .onCancel(() => {
                console.log("Cancel");
              })
              .onDismiss(() => {
                console.log("I am triggered on both OK and Cancel");
              });

            // this.$store.commit("SET_PROCESS_STEP", {
            //   processStatus: ProcessStatusVue.COMPLETE_SETUP,
            //   step: 7,
            //   isSuccessful: true,
            // });
            // this.$emit("onCompletePayment");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    onHandlePaymentCallback() {
      let payload = {
        url: "/api/protected/init/client/subscriptions/initiate-payment",
        data: {
          ...this.payment,
          transaction_number: this.payment.transaction_number
            .replaceAll(" ", "")
            .replaceAll("+", ""),
        },
        msg: "Payment completed Successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "default",
        show_feedback: true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then((res) => {
          if (res.status === 422) {
            Notify.create({
              type: "negative",
              message: this.$t("app.createAccountFailMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
          if (res.status === 408) {
            Notify.create({
              type: "negative",
              message: this.$t("app.connectionProblem"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
          if (res.status == 200) {
            let subscriptions = [];
            const subscription = {
              id: res.data.data.subscription.id,
              organisation: res.data.data.organisation,
              subscription_plan: res.data.data.subscription_plan,
              auto_renewal: res.data.data.subscription.auto_renewal,
              referral_code_discount:
                res.data.data.subscription.referral_code_discount,
              current_period_start_date:
                res.data.data.subscription.current_period_start_date,
              current_period_end_date:
                res.data.data.subscription.current_period_end_date,
              status: res.data.data.subscription.status,
              trial_period_end_date:
                res.data.data.subscription.trial_period_end_date,
              trial_period_start_date:
                res.data.data.subscription.trial_period_start_date,
              is_trail: res.data.data.subscription.is_trail,
              login_id: null,
              transaction_status: res.data.data.transaction_status,
              payment_date: res.data.data.payment_date,
            };
            subscriptions.push(subscription);
            LocalStorage.set("subscriptions", JSON.stringify(subscriptions));
            this.$store.commit("SET_PROCESS_STEP", {
              processStatus: ProcessStatusVue.COMPLETE_SETUP,
              step: 7,
              isSuccessful: true,
            });
            this.$emit("onCompletePayment");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    onContinueWithTrial() {
      LocalStorage.set("isTrialMode", true),
        this.$store.commit("SET_PROCESS_STEP", {
          processStatus: ProcessStatusVue.IN_TRIAL,
          step: 5,
          isSuccessful: true,
          isTrial: true,
        });
      this.$emit("onContinueTrial");
    },

    onbackSubscription() {
      this.$store.commit("SET_PROCESS_STEP", {
        processStatus: ProcessStatusVue.CREATE_SUBSCRIPTION,
        step: 4,
        isSuccessful: true,
        isTrial: false,
      });
      this.$emit("onbackSubscription");
    },

    setPaymentInfo() {
      let subscriptions = this.userSubscriptions;
      let organisation = LocalStorage.getItem("organisation");
      if (subscriptions !== null && organisation !== null) {
        this.payment.login_id = LocalStorage.getItem("loginId");
        this.payment.adminName = LocalStorage.getItem("adminName");
        this.payment.adminUsername = LocalStorage.getItem("adminUsername");
        this.payment.organisationName = organisation.name;
        this.payment.organisationEmail = organisation.email;
        this.payment.subscription_id = subscriptions[0].id;
      }
    },

    handlePaymentUpdate(event) {
      alert(`Payment update: ${event.message}`);
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
}

.page {
  background-color: $grey1;
}

.text_h6 {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 800;
  font-size: 15px;
  line-height: 24px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
}

.text-subtitle2 {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.01em;
}

.sign_link {
  text-decoration: none;
  color: $primary;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
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
}

.payment_total_amount {
  margin-top: 0.5rem;
  display: block;
  font-family: "Roboto";
  font-style: normal;
  font-size: 14px;
  line-height: 24px;
  align-items: center;
  letter-spacing: 0.005em;
  color: $primary;
}

.payment_figures {
  margin-top: 0.5rem;
  display: block;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  align-items: center;
  letter-spacing: 0.005em;
  color: $primary;
}

.summaryCaption {
  text-decoration: none;
  color: $dark;
  font-weight: 400;
  font-size: 15px;
}

.account_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  color: $dark;
  text-transform: none;
}

.bottom {
  margin-bottom: 2.5rem;
}

.payment_details {
  border: 1px solid lightgray;
}

.payment_btn_step {
  font-size: 12px !important;
}
</style>
