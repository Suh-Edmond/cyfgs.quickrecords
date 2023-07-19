<template>
  <div class="q-mb-md">
    <div class="q-mb-lg">
      <q-tabs
        v-model="tab"
        dense
        class="text-primary"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        shadow-2
      >
        <q-tab
          name="Enter Contribution"
          :label="$t('app.enterContribution')"
          no-caps
          icon="payments"
        />
        <q-tab
          name="Use Saving"
          :label="$t('app.useSaving')"
          no-caps
          icon="savings"
        />
      </q-tabs>

      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Enter Contribution">
          <div>
            <div class="q-ml-sm q-mb-lg">
              <label class="text-muted info"
                >{{ $t("app.warningField") }}<span class="text-red">*</span
                >{{ $t("app.fields") }}</label
              >
            </div>
            <div class="q-px-sm">
              <q-form @submit="onAddContribution" class="q-gutter-md">
                <div>
                  <div class="q-mb-md">
                    <label for="name" class="form_field"
                      >{{ $t("app.paymentItem")
                      }}<span class="text-red">*</span>
                    </label>
                    <q-select
                      v-model="contribution.payment_item_id"
                      outlined
                      dense
                      :options="filtered_payment_items"
                      :label="$t('app.searchPaymentItem')"
                      input-debounce="0"
                      use-input
                      clearable
                      @filter="filterPaymentItems"
                      @input="fetchPaymentItem"
                    >
                      <template v-slot:append v-if="start_filtering">
                        <q-spinner
                          color="primary"
                          size="1.2em"
                          :thickness="3"
                        />
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            {{ $t("app.noResults") }}
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="q-mb-md">
                    <label for="credential" class="form_field">{{
                      $t("app.amountPayable")
                    }}</label>
                    <q-input
                      v-model="contribution.amount_payable"
                      outlined
                      dense
                      type="number"
                      disable
                    />
                  </div>
                  <div
                    class="row justify-end"
                    v-show="!has_selected_payment_item"
                  >
                    <q-btn
                      @click="
                        has_selected_payment_item = !has_selected_payment_item
                      "
                      color="primary"
                      :label="$t('app.next')"
                      no-caps
                      :disable="validatePaymentItem"
                      ><q-icon
                        name="arrow_forward"
                        size="xs"
                        class="q-pl-sm"
                      ></q-icon
                    ></q-btn>
                  </div>
                  <div v-show="has_selected_payment_item">
                    <div class="q-mb-md">
                      <label for="name" class="form_field"
                        >{{ $t("app.memberName") }}
                        <span class="text-red">*</span>
                      </label>
                      <q-select
                        outlined
                        dense
                        v-model="contribution.user_id"
                        :options="members"
                        @input="selectMember"
                        :label="$t('app.searchMember')"
                        input-debounce="0"
                        use-input
                        clearable
                        @filter="filterMembers"
                      >
                        <template v-slot:append v-if="start_filter_members">
                          <q-spinner
                            color="primary"
                            size="1.2em"
                            :thickness="5"
                          />
                        </template>
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
                      class="q-mb-md"
                      v-if="valideteMonthlyPaymentItemFrequency"
                    >
                      <label for="credential" class="form_field"
                        >{{ $t("app.selectMonth")
                        }}<span class="text-red">*</span></label
                      >
                      <q-select
                        v-model="contribution.month_name"
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
                      class="q-mb-md"
                      v-if="valideteQuarterlyPaymentItemFrequency"
                    >
                      <label for="credential" class="form_field"
                        >{{ $t("app.selectQuarter")
                        }}<span class="text-red">*</span></label
                      >
                      <q-select
                        v-model="contribution.quarterly_name"
                        outlined
                        dense
                        :options="quartersOptions"
                        input-debounce="0"
                        clearable
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
                    <div class="q-mb-md">
                      <label for="credential" class="form_field">{{
                        $t("app.totalAmountDeposited")
                      }}</label>
                      <q-input
                        v-model.number="contribution.total_amount_deposited"
                        outlined
                        dense
                        type="number"
                        disable
                      >
                      </q-input>
                    </div>
                    <div class="q-mb-md">
                      <label for="credential" class="form_field">{{
                        $t("app.balance")
                      }}</label>
                      <q-input
                        v-model="contribution.balance"
                        outlined
                        dense
                        type="number"
                        disable
                      />
                    </div>
                    <div class="q-mb-md">
                      <label for="credential" class="form_field"
                        >{{ $t("app.depositedAmount")
                        }}<span class="text-red">*</span></label
                      >
                      <q-input
                        v-model.number="contribution.amount_deposited"
                        outlined
                        dense
                        type="number"
                        @keyup="setPaymentItemBalance"
                        :disable="has_completed_payment"
                      >
                      </q-input>
                      <small v-if="checkPaymentItemBal" class="text-red">
                        <b>{{ $t("app.excessAmountLabel") }}</b>
                      </small>
                      <small v-if="has_completed_payment" class="text-info">
                        <b
                          >{{ $t("app.hasCompletedAmountLabel") }}
                          {{ selected_payment_item.label }}</b
                        >
                      </small>
                    </div>
                    <div class="q-mb-md">
                      <label for="credential" class="form_field"
                        >{{ $t("app.comment") }}
                      </label>
                      <q-input
                        v-model="contribution.comment"
                        outlined
                        type="textarea"
                        :placeholder="$t('app.commentContribution')"
                        :disable="has_completed_payment"
                      />
                    </div>
                    <div class="flex q-mt-lg justify-end">
                      <div class="q-mr-lg">
                        <q-btn
                          class="form_button"
                          :label="$t('app.reset')"
                          :color="'primary'"
                          :disabled="!validateForm"
                          no-caps
                          outline
                          @click="resetForm"
                        >
                        </q-btn>
                      </div>
                      <div>
                        <ButtonVue
                          class="form_button"
                          :label="$t('app.saveBtnLabel')"
                          :loading="loading"
                          :color="'primary'"
                          :disabled="validateForm"
                          :no_caps="true"
                        >
                        </ButtonVue>
                      </div>
                    </div>
                  </div>
                </div>
              </q-form>
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="Use Saving">
          <div>
            <div class="q-ml-sm q-mb-lg">
              <label class="text-muted info"
                >{{ $t("app.warningField") }}<span class="text-red">*</span
                >{{ $t("app.fields") }}</label
              >
            </div>
            <div class="q-px-sm">
              <q-form @submit="onAddContribution" class="q-gutter-md">
                <div>
                  <div class="q-mb-md">
                    <label for="name" class="form_field"
                      >{{ $t("app.paymentItem") }}
                      <span class="text-red">*</span>
                    </label>
                    <q-select
                      v-model="contribution.payment_item_id"
                      outlined
                      dense
                      @input="fetchPaymentItem"
                      :options="filtered_payment_items"
                      :label="$t('app.searchPaymentItem')"
                      input-debounce="0"
                      use-input
                      clearable
                      @filter="filterPaymentItems"
                    >
                      <template v-slot:append v-if="start_filtering">
                        <q-spinner
                          color="primary"
                          size="1.2em"
                          :thickness="3"
                        />
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            {{ $t("app.noResults") }}
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="q-mb-md">
                    <label for="credential" class="form_field">{{
                      $t("app.amountPayable")
                    }}</label>
                    <q-input
                      v-model="contribution.amount_payable"
                      outlined
                      dense
                      type="number"
                      disable
                    />
                  </div>
                  <div
                    class="row justify-end"
                    v-show="!has_selected_payment_item"
                  >
                    <q-btn
                      @click="
                        has_selected_payment_item = !has_selected_payment_item
                      "
                      color="primary"
                      :label="$t('app.next')"
                      no-caps
                      :disable="validatePaymentItem"
                      ><q-icon
                        name="arrow_forward"
                        size="xs"
                        class="q-pl-sm"
                      ></q-icon
                    ></q-btn>
                  </div>
                  <div v-show="has_selected_payment_item">
                    <div class="q-mb-md">
                      <label for="name" class="form_field"
                        >{{ $t("app.memberName") }}
                        <span class="text-red">*</span>
                      </label>
                      <q-select
                        outlined
                        dense
                        v-model="contribution.user_id"
                        :options="members"
                        @input="selectMember"
                        :label="$t('app.searchMember')"
                        input-debounce="0"
                        use-input
                        clearable
                        @filter="filterMembers"
                      >
                        <template v-slot:append v-if="start_filter_members">
                          <q-spinner
                            color="primary"
                            size="1.2em"
                            :thickness="5"
                          />
                        </template>
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
                      class="q-mb-md"
                      v-if="valideteMonthlyPaymentItemFrequency"
                    >
                      <label for="credential" class="form_field"
                        >{{ $t("app.selectMonth") }}
                        <span class="text-red">*</span></label
                      >
                      <q-select
                        v-model="contribution.month_name"
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
                      class="q-mb-md"
                      v-if="valideteQuarterlyPaymentItemFrequency"
                    >
                      <label for="credential" class="form_field"
                        >{{ $t("app.selectQuarter")
                        }}<span class="text-red">*</span></label
                      >
                      <q-select
                        v-model="contribution.quarterly_name"
                        outlined
                        dense
                        :options="quartersOptions"
                        input-debounce="0"
                        clearable
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
                    <div class="q-mb-md">
                      <label for="credential" class="form_field">{{
                        $t("app.totalSaving")
                      }}</label>
                      <q-input
                        v-model.number="contribution.total_saving"
                        outlined
                        dense
                        type="number"
                        disable
                      >
                      </q-input>
                    </div>
                    <div class="q-mb-md">
                      <label for="credential" class="form_field">{{
                        $t("app.totalAmountDeposited")
                      }}</label>
                      <q-input
                        v-model.number="contribution.total_amount_deposited"
                        outlined
                        dense
                        type="number"
                        disable
                      >
                      </q-input>
                    </div>
                    <div class="q-mb-md">
                      <label for="credential" class="form_field">{{
                        $t("app.balance")
                      }}</label>
                      <q-input
                        v-model="contribution.balance"
                        outlined
                        dense
                        type="number"
                        disable
                      />
                    </div>
                    <div class="q-mb-md">
                      <label for="credential" class="form_field"
                        >{{ $t("app.depositedAmount")
                        }}<span class="text-red">*</span></label
                      >
                      <q-input
                        v-model.number="contribution.amount_deposited"
                        outlined
                        dense
                        type="number"
                        @keyup="setPaymentItemBalance"
                        :disable="has_completed_payment"
                      >
                      </q-input>
                      <small v-if="checkPaymentItemBal" class="text-red">
                        <b>{{ $t("app.excessAmountLabel") }}</b>
                      </small>
                      <br/>
                      <small
                        v-if="checkAmountDepositedBasedOnSaving"
                        class="text-red"
                      >
                        <b>{{ $t("app.insuffientSaving") }}</b>
                      </small><br/>
                      <small v-if="has_completed_payment" class="text-info">
                        <b
                          >{{ $t("app.hasCompletedAmountLabel") }}
                          {{ selected_payment_item.label }}</b
                        >
                      </small>
                    </div>
                    <div class="q-mb-md">
                      <label for="credential" class="form_field"
                        >{{ $t("app.comment") }}
                      </label>
                      <q-input
                        v-model="contribution.comment"
                        outlined
                        type="textarea"
                        :placeholder="$t('app.contributionComment')"
                        :disable="has_completed_payment"
                      />
                    </div>
                    <div class="flex q-mt-lg justify-end">
                      <div class="q-mr-lg">
                        <q-btn
                          class="form_button"
                          :label="$t('app.reset')"
                          :color="'primary'"
                          :disabled="!validateForm"
                          no-caps
                          outline
                          @click="resetForm"
                        >
                        </q-btn>
                      </div>
                      <div>
                        <ButtonVue
                          class="form_button"
                          :label="$t('app.saveBtnLabel')"
                          :loading="loading"
                          :color="'primary'"
                          :disabled="validateForm"
                          :no_caps="true"
                        >
                        </ButtonVue>
                      </div>
                    </div>
                  </div>
                </div>
              </q-form>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import PaymentCategoryMixinVue from "src/mixins/PaymentCategoryMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import ContributionsMixinVue from "src/mixins/ContributionsMixin.vue";
import MonthsMixinVue from "src/mixins/MonthsMixin.vue";

export default {
  mixins: [
    PaymentCategoryMixinVue,
    organisationMixinVue,
    memberMixinVue,
    ContributionsMixinVue,
    MonthsMixinVue,
  ],

  mounted() {
    let heading = this.$t("app.contributionHeading");

    this.$emit("set-heading", heading);

    let organisation_id = this.getOrganisationId;

    if (this.getMembersFromState().length == 0) {
      this.getOrganisationMembers(organisation_id, false);
    } else {
      this.getMembersFromState();
    }

    this.getPaymentItems();
  },

  data() {
    return {
      loading: false,
      contribution: {
        user_id: null,
        payment_item_id: null,
        amount_deposited: 0,
        comment: "",
        balance: 0,
        amount_payable: 0,
        total_amount_deposited: 0,
        payment_category_id: null,
        id: null,
        month_name: "",
        quarterly_name: "",
        total_saving: 0,
      },
      position: "right",
      error_bal: false,
      dialog: false,
      has_completed_payment: false,
      has_selected_payment_item: false,
      filtered_payment_items: [],
      payment_items_by_category: [],
      selected_payment_item: null,
      payment_categories: [],
      members: [],
      monthsOptions: [],
      quartersOptions: this.getQuarters,
      tab: "Enter Contribution",
      start_filter_members: false,
      start_filtering: false,
    };
  },
  computed: {
    checkPaymentItemBal() {
      return this.contribution.amount_deposited != 0 &&
        parseFloat(this.contribution.amount_deposited) +
          parseFloat(this.contribution.total_amount_deposited) >
          parseFloat(this.contribution.amount_payable)
        ? true
        : false;
    },

    checkAmountDepositedBasedOnSaving() {
      return this.contribution.amount_deposited != 0 &&
        parseFloat(this.contribution.amount_deposited) >
          parseFloat(this.contribution.total_saving)
        ? true
        : false;
    },

    validateForm() {
      return this.contribution.user_id === null ||
        this.contribution.amount_deposited == 0 ||
        this.contribution.payment_item_id == null ||
        this.checkPaymentItemBal ||
        (this.validetePaymentItemFrequency &&
          this.contribution.month_name == "") ||
        (this.valideteQuarterlyPaymentItemFrequency &&
          this.contribution.quarterly_name == "")
        ? true
        : false;
    },

    validatePaymentItem() {
      return this.contribution.payment_item_id == null;
    },

    valideteMonthlyPaymentItemFrequency() {
      return (
        this.contribution.payment_item_id != null &&
        this.contribution.payment_item_id.frequency == "MONTHLY"
      );
    },

    valideteQuarterlyPaymentItemFrequency() {
      return (
        this.contribution.payment_item_id != null &&
        this.contribution.payment_item_id.frequency == "QUARTERLY"
      );
    },
  },
  methods: {
    onAddContribution() {
      let payload = {
        url: `/api/protected/contributions`,
        data: {
          user_id: this.contribution.user_id.value,
          amount_deposited: parseFloat(this.contribution.amount_deposited),
          payment_item_id: this.contribution.payment_item_id.value,
          comment: this.contribution.comment,
          month_name: this.contribution.month_name,
          quarterly_name: this.contribution.quarterly_name,
          contributed_via_saving: this.tab == "Use Saving" ? true : false,
        },
        msg: this.$t("app.saveContributionSuccessMsg"),
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
      this.setDispatchAction(payload, this.contribution.payment_item_id);
    },

    fetchPaymentItem() {
      if (this.contribution.payment_item_id != null) {
        this.start_filtering = false;
        this.selected_payment_item = this.filtered_payment_items.find(
          (item) => item.value == this.contribution.payment_item_id.value
        );
        if (this.selected_payment_item != undefined) {
          this.contribution.amount_payable = this.selected_payment_item.amount;
        }
      }
    },

    selectMember() {
      this.start_filter_members = true;
      this.has_completed_payment = false;
      let user_id =
        this.contribution.user_id != null
          ? this.contribution.user_id.value
          : "";
      if (this.tab == "Enter Contribution") {
        let amount_deposited_payload = {
          status: "none",
          url: `/api/protected/contributions/users/${user_id}/items/${this.contribution.payment_item_id.value}`,
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
        this.$store
          .dispatch("getRequest", amount_deposited_payload)
          .then((res) => {
            // //set the balance to be paid by the member has paid anything got the item before
            if (res) {
              this.contribution.total_amount_deposited = res.data;
              this.contribution.balance =
                this.contribution.amount_payable - res.data;
              if (this.contribution.balance == 0) {
                this.has_completed_payment = true;
              }
            }
          })
          .finally(() => {
            this.start_filter_members = false;
          });
      } else {
        let payload = {
          status: "none",
          url: `/api/protected/user-savings/${user_id}`,
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
        this.$store
          .dispatch("getRequest", payload)
          .then((res) => {
            this.contribution.total_saving = res.data.total_savings;
            return res;
          })
          .then((res) => {
            let amount_deposited_payload = {
              status: "none",
              url: `/api/protected/contributions/users/${user_id}/items/${this.contribution.payment_item_id.value}`,
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
            this.$store
              .dispatch("getRequest", amount_deposited_payload)
              .then((res) => {
                // //set the balance to be paid by the member has paid anything got the item before
                if (res) {
                  this.contribution.total_amount_deposited = res.data;
                  this.contribution.balance =
                    this.contribution.amount_payable - res.data;
                  if (this.contribution.balance == 0) {
                    this.has_completed_payment = true;
                  }
                }
              });
          })
          .finally(() => {
            this.start_filter_members = false;
          });
      }
    },

    setPaymentItemBalance() {
      let total_amount_paid =
        parseFloat(this.contribution.total_amount_deposited) +
        parseFloat(this.contribution.amount_deposited);
      this.contribution.balance =
        this.contribution.amount_deposited != 0
          ? this.contribution.amount_payable - total_amount_paid
          : this.contribution.amount_payable -
            this.contribution.total_amount_deposited;
    },

    resetForm() {
      this.has_selected_payment_item = false;
      this.has_completed_payment = false;
      this.contribution.user_id = null;
      this.contribution.amount_payable = 0.0;
      this.contribution.amount_deposited = 0.0;
      this.contribution.balance = null;
      this.contribution.comment = null;
      this.contribution.payment_item_id = null;
      this.contribution.payment_category_id = null;
      this.contribution.id = null;
      this.contribution.total_amount_deposited = 0.0;
      this.contribution.month_name = "";
      this.contribution.quarterly_name = "";
      this.contribution.total_saving = 0;

      return this.contribution;
    },

    setDispatchAction(payload, payment_item) {
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then(() => {
          let data = {
            payment_item_id: payment_item,
            year: this.$store.getters.getCurrentYear.id,
            month: "",
            date: "",
            status: "",
            date_range: "",
          };
          this.filterMembersContributions(data);
          this.resetForm();
        })
        .finally(() => {
          this.$emit("close-right-drawer");
          this.loading = false;
        });
    },

    filterPaymentItems(val, update, abort) {
      if (val < 1) {
        this.start_filtering = false;
        abort();
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.filtered_payment_items = this.payment_items_by_category.filter(
          (item) => item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.filtered_payment_items;
      });
    },

    getMembersFromState() {
      this.members = [];
      this.$store.getters.getMembers.forEach((ele) => {
        this.members.push({
          label: ele.name,
          value: ele.id,
        });
      });

      return this.members;
    },

    filterMembers(val, update, abort) {
      if (val < 1) {
        this.start_filter_members = false;
        abort();
        return;
      }

      update(() => {
        this.start_filter_members = true;
        this.members = this.getMembersFromState().filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.members;
      });
    },

    filterMonths(val, update, abort) {
      if (val.length < 1) {
        abort();
        return;
      }
      if (this.month == "") {
        this.monthsOptions = this.getMonths;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.monthsOptions = this.getMonths.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    getPaymentItems() {
      this.payment_items_by_category = [];
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
            this.payment_items_by_category.push({
              label: ele.name,
              value: ele.id,
              amount: ele.amount,
            });
          });
        }
      });

      return this.payment_items_by_category;
    },
  },
  components: {
    ButtonVue,
  },
};
</script>

<style scoped lang="scss">
.button {
  width: 100%;
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

.noPaymentItems {
  color: $grey2;
}

.info {
  color: $grey2;
}
</style>
