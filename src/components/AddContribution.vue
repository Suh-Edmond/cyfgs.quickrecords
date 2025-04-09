<template>
  <div class="q-mb-md" ::class="$q.platform.is.mobile ? 'q-mx-sm' : 'q-mx-md'">
    <q-linear-progress indeterminate v-show="is_fetching_members" />
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
        <div :class="$q.platform.is.mobile ? 'q-mb-md q-mx-sm' : ''">
          <label class="text-muted info"
            >{{ $t("app.warningField") }}<span class="text-red">* </span
            >{{ $t("app.fields") }}</label
          >
        </div>
        <q-form
          @submit="onAddContribution"
          class="q-gutter-xs"
          :class="$q.platform.is.mobile ? 'q-ml-xs' : ''"
        >
          <div v-if="!has_selected_payment_item">
            <div class="q-mb-md">
              <label  class="form_field"
                >{{ $t("app.sessionLabel") }}<span class="text-red">*</span>
              </label>
              <q-select
                v-model="year"
                outlined
                dense
                :options="getSessionsFromState"
                :label="$t('app.selectYearLabel')"
                clearable
                @input="getPaymentItems"
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

            <div class="q-mb-md">
              <label  class="form_field"
                >{{ $t("app.paymentItem") }}<span class="text-red">*</span>
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
                hide-bottom-space
              >
                <template v-slot:append v-if="start_filtering">
                  <q-spinner color="primary" size="1.2em" :thickness="3" />
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
              v-if="
                hasSelectedPaymentItem &&
                !start_filtering &&
                !has_selected_payment_item
              "
            >
              <div class="q-mb-md flex justify-between">
                <label class="form_field">{{
                  $t("app.nameLabel")
                }}</label>
                <label class="value">{{
                  selected_payment_item.label
                }}</label>
              </div>
              <div class="q-mb-md flex justify-between">
                <label class="form_field">{{
                  $t("app.amountPayable")
                }}</label>
                <label class="value"
                  >{{
                    Number(selected_payment_item.amount).toString()
                  }}
                  XAF</label
                >
              </div>
              <div class="q-mb-md flex justify-between">
                <label class="form_field">{{
                  $t("app.frequency")
                }}</label>
                <label class="value">{{
                  formatConstants(selected_payment_item.frequency)
                }}</label>
              </div>
              <div class="q-mb-md flex justify-between">
                <label class="form_field">{{
                  $t("app.type")
                }}</label>
                <label class="value">{{
                  formatConstants(selected_payment_item.type)
                }}</label>
              </div>
              <div
                class="q-mb-md flex justify-between"
                v-if="selected_payment_item.frequency === 'MONTHLY'"
              >
                <label class="form_field">{{
                  $t("app.monthsLabel")
                }}</label>
                <div
                  class="q-gutter-sm"
                  v-if="selected_payment_item.payment_item_months.length > 0"
                >
                  <q-chip
                    color="teal"
                    text-color="white"
                    v-for="ref in selected_payment_item.payment_item_months"
                    :key="ref.id"
                    size="sm"
                    >{{ ref }}</q-chip
                  >
                </div>
              </div>
              <div
                class="q-mb-md flex justify-between"
                v-if="selected_payment_item.frequency === 'QUARTERLY'"
              >
                <label class="form_field">{{
                  $t("app.quarter")
                }}</label>
                <div
                  class="q-gutter-sm q-mt-sm"
                  v-if="selected_payment_item.payment_item_quarters.length > 0"
                >
                  <q-chip
                    color="teal"
                    text-color="white"
                    v-for="ref in selected_payment_item.payment_item_quarters"
                    :key="ref.id"
                    size="sm"
                    >{{ ref }}</q-chip
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="row justify-end" v-show="!has_selected_payment_item">
            <q-btn
              @click="showNextForm()"
              color="primary"
              :label="$t('app.next')"
              no-caps
              :disable="validatePaymentItem"
              size="sm"
              class="q-py-xs"
              ><q-icon name="arrow_forward" size="xs" class="q-pl-sm"></q-icon
            ></q-btn>
          </div>
          <div v-show="has_selected_payment_item && !is_fetching_members">
            <div class="q-mb-md">
              <label  class="form_field"
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
                hide-bottom-space
              >
                <template v-slot:append v-if="start_filter_members">
                  <q-spinner color="primary" size="1.2em" :thickness="5" />
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
            <div class="q-mb-md" v-if="valideteMonthlyPaymentItemFrequency">
              <label class="form_field"
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
                @input="getTotalMonthlyContributionByPaymentItem"
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
            <div class="q-mb-md" v-if="valideteQuarterlyPaymentItemFrequency">
              <label class="form_field"
                >{{ $t("app.selectQuarter")
                }}<span class="text-red">*</span></label
              >
              <q-select
                v-model="contribution.quarterly_name"
                outlined
                dense
                :options="quarterOptions"
                input-debounce="0"
                clearable
                @input="getTotalQuarterlyContributionByPaymentItem"
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
            <div class="q-mb-md">
              <label class="form_field">{{
                $t("app.totalAmountDeposited")
              }}</label>
              <q-input
                v-model.number="contribution.total_amount_deposited"
                outlined
                dense
                type="number"
                readonly
                hide-bottom-space
              >
              </q-input>
            </div>
            <div class="q-mb-md">
              <label class="form_field">{{
                $t("app.balance")
              }}</label>
              <q-input
                v-model="contribution.balance"
                outlined
                dense
                type="number"
                readonly
                hide-bottom-space
              />
            </div>
            <div class="q-mb-md">
              <label class="form_field"
                >{{ $t("app.depositedAmount")
                }}<span class="text-red">*</span></label
              >
              <q-input
                v-model.number="contribution.amount_deposited"
                outlined
                dense
                type="number"
                @input="setPaymentItemBalance"
                :disable="has_completed_payment"
                hide-bottom-space
                autofocus
              >
              </q-input>
              <label v-if="checkPaymentItemBal" class="text-red">
                <b>{{ $t("app.excessAmountLabel") }}</b>
              </label>
              <br v-if="has_completed_payment" />
              <label v-if="has_completed_payment" class="text-info">
                <b
                  >{{ $t("app.hasCompletedAmountLabel") }}
                  {{ selected_payment_item.label }}</b
                >
              </label>
            </div>
            <div class="q-mb-md">
              <label class="form_field"
              >{{ $t("app.paymentDate") }} <span class="text-red">*</span></label
              >
              <q-input
                v-model="contribution.date"
                outlined
                dense
                :disable="has_completed_payment"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="contribution.date">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="q-mb-md">
              <label class="form_field"
                >{{ $t("app.comment") }}
              </label>
              <q-input
                v-model="contribution.comment"
                outlined
                autogrow
                :placeholder="$t('app.commentContribution')"
                :disable="has_completed_payment"
                hide-bottom-space
              />
            </div>
            <div
              :class="
                $q.platform.is.desktop
                  ? 'flex q-mt-md justify-between'
                  : ' q-mt-md'
              "
              v-if="$q.platform.is.desktop"
            >
              <div>
                <q-btn
                  :label="$t('app.back')"
                  :color="'primary'"
                  no-caps
                  outline
                  @click="goBack()"
                >
                </q-btn>
              </div>
              <div class="row q-gutter-x-lg">
                <q-btn
                  :label="$t('app.reset')"
                  :color="'primary'"
                  :disabled="false"
                  no-caps
                  outline
                  @click="resetForm"
                >
                </q-btn>
                <q-btn
                  :label="$t('app.saveBtnLabel')"
                  :color="'primary'"
                  no-caps
                  :loading="loading"
                  :disabled="validateForm"
                  type="submit"
                >
                </q-btn>
              </div>
            </div>
            <div class="q-gutter-y-lg q-mb-lg q-mt-sm" v-if="$q.platform.is.mobile">
              <ButtonVue
                class="full-width"
                :label="$t('app.saveBtnLabel')"
                :loading="loading"
                :color="'primary'"
                :disabled="validateForm"
                :no_caps="true"
                type="submit"
              >
              </ButtonVue>

              <q-btn
                class="full-width"
                :label="$t('app.back')"
                :color="'primary'"
                no-caps
                outline
                @click="goBack()"
              >
              </q-btn>

              <q-btn
                class="full-width"
                :label="$t('app.reset')"
                :color="'primary'"
                :disabled="!validateForm"
                no-caps
                outline
                @click="resetForm"
              >
              </q-btn>
            </div>
          </div>
        </q-form>
      </q-tab-panel>
      <q-tab-panel name="Use Saving">
        <div :class="$q.platform.is.desktop ? 'q-ml-sm' : ''">
          <div class="q-mb-md">
            <label class="text-muted info"
              >{{ $t("app.warningField") }}<span class="text-red">*</span
              >{{ $t("app.fields") }}</label
            >
          </div>
          <q-form @submit="onAddContribution" class="q-gutter-md">
            <div v-show="!has_selected_payment_item">
              <div class="q-mb-md">
                <label  class="form_field"
                  >{{ $t("app.sessionLabel") }}<span class="text-red">*</span>
                </label>
                <q-select
                  v-model="year"
                  outlined
                  dense
                  :options="getSessionsFromState"
                  :label="$t('app.selectYearLabel')"
                  clearable
                  @input="getPaymentItems"
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
              <div class="q-mb-md">
                <label  class="form_field"
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
                  hide-bottom-space
                >
                  <template v-slot:append v-if="start_filtering">
                    <q-spinner color="primary" size="1.2em" :thickness="3" />
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
                v-if="
                  hasSelectedPaymentItem &&
                  !start_filtering &&
                  !has_selected_payment_item
                "
              >
                <div class="q-mb-md flex justify-between">
                  <label class="form_field">{{
                    $t("app.nameLabel")
                  }}</label>
                  <label class="value">{{
                    selected_payment_item.label
                  }}</label>
                </div>
                <div class="q-mb-md flex justify-between">
                  <label class="form_field">{{
                    $t("app.amountPayable")
                  }}</label>
                  <label class="value">{{
                    Number(selected_payment_item.amount).toString()
                  }}</label>
                </div>
                <div class="q-mb-md flex justify-between">
                  <label class="form_field">{{
                    $t("app.frequency")
                  }}</label>
                  <label class="value">{{
                    selected_payment_item.frequency
                  }}</label>
                </div>
                <div class="q-mb-md flex justify-between">
                  <label class="form_field">{{
                    $t("app.type")
                  }}</label>
                  <label class="value">{{
                    selected_payment_item.type
                  }}</label>
                </div>
                <div
                  class="q-mb-md flex"
                  v-if="selected_payment_item.frequency === 'MONTHLY'"
                >
                  <label class="form_field">{{
                    $t("app.monthsLabel")
                  }}</label>
                  <div
                    class="q-gutter-xs"
                    v-if="selected_payment_item.payment_item_months.length > 0"
                  >
                    <q-chip
                      color="teal"
                      text-color="white"
                      v-for="ref in selected_payment_item.payment_item_months"
                      :key="ref.id"
                      size="sm"
                      >{{ ref }}</q-chip
                    >
                  </div>
                </div>
                <div
                  class="q-mb-md flex"
                  v-if="selected_payment_item.frequency === 'QUARTERLY'"
                >
                  <label class="form_field"
                    >{{ $t("app.quarter") }}:</label
                  >
                  <div
                    class="q-gutter-sm q-mt-sm"
                    v-if="
                      selected_payment_item.payment_item_quarters.length > 0
                    "
                  >
                    <q-chip
                      color="teal"
                      text-color="white"
                      v-for="ref in selected_payment_item.payment_item_quarters"
                      :key="ref.id"
                      size="sm"
                      >{{ ref }}</q-chip
                    >
                  </div>
                </div>
              </div>
              <div class="row justify-end">
                <q-btn
                  @click="showNextForm()"
                  color="primary"
                  :label="$t('app.next')"
                  no-caps
                  :disable="validatePaymentItem"
                  size="sm"
                  class="q-py-xs"
                  ><q-icon
                    name="arrow_forward"
                    size="xs"
                    class="q-pl-sm"
                  ></q-icon
                ></q-btn>
              </div>
            </div>
            <div v-show="has_selected_payment_item && !is_fetching_members">
              <div class="q-mb-md">
                <label  class="form_field"
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
                    <q-spinner color="primary" size="1.2em" :thickness="5" />
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
              <div class="q-mb-md" v-if="valideteMonthlyPaymentItemFrequency">
                <label class="form_field"
                  >{{ $t("app.selectMonth") }}
                  <span class="text-red">*</span></label
                >
                <q-select
                  v-model="contribution.month_name"
                  outlined
                  dense
                  :options="monthsOptions"
                  :label="$t('app.searchMonth')"
                  input-debounce="0"
                  clearable
                  @input="getTotalMonthlyContributionByPaymentItem"
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
              <div class="q-mb-md" v-if="valideteQuarterlyPaymentItemFrequency">
                <label class="form_field"
                  >{{ $t("app.selectQuarter")
                  }}<span class="text-red">*</span></label
                >
                <q-select
                  v-model="contribution.quarterly_name"
                  outlined
                  dense
                  :options="quarterOptions"
                  input-debounce="0"
                  clearable
                  @input="getTotalQuarterlyContributionByPaymentItem"
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
                <label class="form_field">{{
                  $t("app.totalSaving")
                }}</label>
                <q-input
                  v-model.number="getTotalSaving"
                  outlined
                  dense
                  type="number"
                  readonly
                >
                </q-input>
              </div>
              <div class="q-mb-md">
                <label class="form_field">{{
                  $t("app.totalAmountDeposited")
                }}</label>
                <q-input
                  v-model.number="contribution.total_amount_deposited"
                  outlined
                  dense
                  type="number"
                  readonly
                >
                </q-input>
              </div>
              <div class="q-mb-md">
                <label class="form_field">{{
                  $t("app.balance")
                }}</label>
                <q-input
                  v-model.number="contribution.balance"
                  outlined
                  dense
                  type="number"
                  readonly
                />
              </div>
              <div class="q-mb-md">
                <label class="form_field"
                  >{{ $t("app.depositedAmount")
                  }}<span class="text-red">*</span></label
                >
                <q-input
                  v-model.number="contribution.amount_deposited"
                  outlined
                  dense
                  type="number"
                  @input="setPaymentItemBalance"
                  :disable="has_completed_payment"
                  autofocus
                >
                </q-input>
                <label v-if="checkPaymentItemBal" class="text-red">
                  <b>{{ $t("app.excessAmountLabel") }}</b>
                </label>
                <br v-if="checkAmountDepositedBasedOnSaving" />
                <label
                  v-if="checkAmountDepositedBasedOnSaving"
                  class="text-red"
                >
                  <b>{{ $t("app.insuffientSaving") }}</b> </label
                ><br v-if="has_completed_payment" />
                <label v-if="has_completed_payment" class="text-info">
                  <b
                    >{{ $t("app.hasCompletedAmountLabel") }}
                    {{ selected_payment_item.label }}</b
                  >
                </label>
              </div>
              <div class="q-mb-md">
                <label class="form_field"
                >{{ $t("app.paymentDate") }} <span class="text-red">*</span></label
                >
                <q-input
                  v-model="contribution.date"
                  outlined
                  dense
                  :disable="has_completed_payment"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="contribution.date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="q-mb-md">
                <label class="form_field"
                  >{{ $t("app.comment") }}
                </label>
                <q-input
                  v-model="contribution.comment"
                  outlined
                  autogrow
                  :placeholder="$t('app.contributionComment')"
                  :disable="has_completed_payment"
                />
              </div>
              <div
                :class="
                  $q.platform.is.desktop
                    ? 'flex q-mt-md justify-between'
                    : ' q-mt-md'
                "
                v-if="$q.platform.is.desktop"
              >
                <div>
                  <q-btn
                    :label="$t('app.back')"
                    :color="'primary'"
                    no-caps
                    outline
                    @click="goBack()"
                  >
                  </q-btn>
                </div>
                <div class="row q-gutter-x-lg">
                  <q-btn
                    class="form_button"
                    :label="$t('app.reset')"
                    :color="'primary'"
                    :disabled="false"
                    no-caps
                    outline
                    @click="resetForm"
                  >
                  </q-btn>
                  <q-btn
                    :label="$t('app.saveBtnLabel')"
                    :color="'primary'"
                    no-caps
                    :loading="loading"
                    :disabled="validateForm"
                    type="submit"
                  >
                  </q-btn>
                </div>
              </div>

              <div class="q-gutter-y-lg q-mb-lg q-mt-sm" v-if="$q.platform.is.mobile">
                <ButtonVue
                  class="full-width"
                  :label="$t('app.saveBtnLabel')"
                  :loading="loading"
                  :color="'primary'"
                  :disabled="validateForm"
                  :no_caps="true"
                  type="submit"
                >
                </ButtonVue>

                <q-btn
                  class="full-width"
                  :label="$t('app.back')"
                  :color="'primary'"
                  no-caps
                  outline
                  @click="goBack()"
                >
                </q-btn>

                <q-btn
                  class="full-width"
                  :label="$t('app.reset')"
                  :color="'primary'"
                  :disabled="false"
                  no-caps
                  outline
                  @click="resetForm"
                >
                </q-btn>
              </div>
            </div>
          </q-form>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import PaymentCategoryMixinVue from "src/mixins/PaymentCategoryMixin.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import memberMixinVue from "src/mixins/memberMixin.vue";
import ContributionsMixinVue from "src/mixins/ContributionsMixin.vue";
import CurrentYearMixin from "src/mixins/CurrentYearMixin.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";
import moment from "moment";

import { LocalStorage, Notify, Platform } from "quasar";
import CategoryConstants from "components/Constants/CategoryConstants";

export default {
  mixins: [
    PaymentCategoryMixinVue,
    organisationMixinVue,
    memberMixinVue,
    ContributionsMixinVue,
    CurrentYearMixin,
    HelperMixin,
  ],

  mounted() {
    let heading = this.$t("app.contributionHeading");

    this.$emit("set-heading", heading);

    if (this.getSessionsFromState.length === 0) {
      this.getSessions();
    }
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
        date:moment(new Date()).format("YYYY/MM/DD"),
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
      quarterOptions: [],
      tab: CategoryConstants.ENTERED_CONTRIBUTION,
      start_filter_members: false,
      start_filtering: false,
      payment_item_members: [],
      is_fetching_members: false,
      year: "",
    };
  },
  computed: {
    checkPaymentItemBal() {
      return this.contribution.amount_deposited !== 0 &&
        parseFloat(this.contribution.amount_deposited) +
        parseFloat(this.contribution.total_amount_deposited) >
        parseFloat(this.contribution.amount_payable);
    },

    checkAmountDepositedBasedOnSaving() {
      return (
        this.contribution.amount_deposited !== 0 &&
        parseInt(this.contribution.amount_deposited) >
          parseFloat(LocalStorage.getItem("saving"))
      );
    },

    validateForm() {
      return (
        this.contribution.user_id === null ||
        this.contribution.amount_deposited === 0 ||
        this.contribution.payment_item_id == null ||
        this.checkPaymentItemBal ||
        (this.valideteMonthlyPaymentItemFrequency &&
          this.contribution.month_name === "") ||
        (this.valideteQuarterlyPaymentItemFrequency &&
          this.contribution.quarterly_name === "") ||
        this.checkAmountDepositedBasedOnSaving
      );
    },

    validatePaymentItem() {
      return this.contribution.payment_item_id == null;
    },

    valideteMonthlyPaymentItemFrequency() {
      return (
        this.contribution.payment_item_id !== null &&
        this.contribution.payment_item_id.frequency === CategoryConstants.MONTHLY
      );
    },

    valideteQuarterlyPaymentItemFrequency() {
      return (
        this.contribution.payment_item_id !== null &&
        this.contribution.payment_item_id.frequency === CategoryConstants.QUARTERLY
      );
    },

    getCurrentTab() {
      return this.tab;
    },

    getTotalSaving() {
      return parseFloat(this.contribution.total_saving);
    },

    hasSelectedPaymentItem() {
      return this.selected_payment_item !== null;
    },
  },
  methods: {
    showNextForm() {
      this.has_selected_payment_item = !this.has_selected_payment_item;
      this.getPaymentItemMembers();
    },

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
          contributed_via_saving: this.getCurrentTab === CategoryConstants.USE_SAVING,
          date: this.contribution.date.replaceAll("/", "-")
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
          (item) => item.value === this.contribution.payment_item_id.value
        );
        if (
          this.selected_payment_item !== undefined &&
          this.selected_payment_item.frequency === CategoryConstants.QUARTERLY
        ) {
          this.contribution.amount_payable = this.selected_payment_item.amount;
          this.quarterOptions =
            this.selected_payment_item.payment_item_quarters;
        } else if (
          this.selected_payment_item !== undefined &&
          this.selected_payment_item.frequency === CategoryConstants.MONTHLY
        ) {
          this.contribution.amount_payable = this.selected_payment_item.amount;
          this.monthsOptions = this.selected_payment_item.payment_item_months;
        } else {
          this.contribution.amount_payable =
            this.selected_payment_item !== undefined
              ? this.selected_payment_item.amount
              : 0;
        }
      } else {
        this.start_filtering = true;
      }
      return this.start_filtering;
    },

    selectMember() {
      switch (this.contribution.payment_item_id.frequency) {
        case CategoryConstants.QUARTERLY:
          this.getTotalQuarterlyContributionByPaymentItem();
          break;
        case CategoryConstants.MONTHLY:
          this.getTotalMonthlyContributionByPaymentItem();
          break;
        default:
          this.getMemberTotalContributionByPaymentItem();
          break;
      }
    },

    getTotalMonthlyContributionByPaymentItem() {
      return this.getMemberTotalContributionByPaymentItem();
    },

    getTotalQuarterlyContributionByPaymentItem() {
      return this.getMemberTotalContributionByPaymentItem();
    },

    getMemberTotalContributionByPaymentItem() {
      this.start_filter_members = true;
      this.has_completed_payment = false;
      let user_id =
        this.contribution.user_id != null
          ? this.contribution.user_id.value
          : "";
      if (this.tab === CategoryConstants.ENTERED_CONTRIBUTION) {
        let amount_deposited_payload = {
          status: "none",
          url: `/api/protected/contributions/users/${user_id}/items/${this.contribution.payment_item_id.value}?month=${this.contribution.month_name}&quarter=${this.contribution.quarterly_name}&frequency=${this.contribution.payment_item_id.frequency}`,
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
              if (this.contribution.balance === 0) {
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
          url: `/api/protected/user-savings/${user_id}?page=${1}&per_page=${10}`,
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
            this.contribution.total_saving = parseFloat(res.data.total_savings);
            LocalStorage.set("saving", this.contribution.total_saving);
            if (res.success && res.data.total_savings === 0) {
              Notify.create({
                color: "info",
                message: this.$t("app.noSavingAvailableMsg"),
                type: "info",
                position: Platform.is.mobile ? "bottom" : "top-right",
              });
            }
            return res;
          })
          .then((res) => {
            let amount_deposited_payload = {
              status: "none",
              url: `/api/protected/contributions/users/${user_id}/items/${this.contribution.payment_item_id.value}?month=${this.contribution.month_name}&quarter=${this.contribution.quarterly_name}&frequency=${this.contribution.payment_item_id.frequency}`,
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
                  if (this.contribution.balance === 0) {
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
        this.contribution.amount_deposited !== 0
          ? this.contribution.amount_payable - total_amount_paid
          : this.contribution.amount_payable -
            this.contribution.total_amount_deposited;
      let savings = parseFloat(LocalStorage.getItem("saving"));
      let deposite = parseFloat(this.contribution.amount_deposited);

      this.contribution.total_saving =
        this.contribution.amount_deposited !== 0 &&
        !isNaN(this.contribution.amount_deposited)
          ? savings - deposite
          : savings;
    },

    resetForm() {
      this.start_filtering = false;
      this.has_selected_payment_item = false;
      this.has_completed_payment = false;
      this.contribution.user_id = null;
      this.contribution.amount_payable = 0.0;
      this.contribution.amount_deposited = 0.0;
      this.contribution.balance = 0.0;
      this.contribution.comment = null;
      this.contribution.payment_item_id = null;
      this.contribution.payment_category_id = null;
      this.contribution.id = null;
      this.contribution.total_amount_deposited = 0.0;
      this.contribution.month_name = "";
      this.contribution.quarterly_name = "";
      this.contribution.total_saving = 0;
      this.selected_payment_item = null;
      LocalStorage.remove("saving");

      return this.contribution;
    },

    getCurrentYearId(){
      return this.$store.getters.getCurrentYear === null ? LocalStorage.getItem("current_session").id: this.$store.getters.getCurrentYear.id;
    },

    setDispatchAction(payload, payment_item) {
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then(() => {
          let data = {
            payment_item_id: payment_item,
            year: this.getCurrentYearId(),
            month: "",
            date: "",
            status: "",
            date_range: "",
          };
          this.filterMembersContributions(
            data,
            data.year,
            data.status,
            data.month,
            data.date,
            data.date_range,
            0,
            1,
            7
          );
          this.$emit("close-right-drawer");
          this.resetForm();
          this.start_filtering = false;
          this.has_selected_payment_item = false;
          this.selected_payment_item = null;
        })
        .finally(() => {
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

    getPaymentItemMembers() {
      let organisation_id = this.$store.getters.getOrganisation.id;
      this.is_fetching_members = true;
      let payload = {
        status: "none",
        url: `/api/protected/organisations/payment_items/${this.contribution.payment_item_id.value}/users?organisation_id=${organisation_id}`,
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
      this.payment_item_members = [];
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          res.data.forEach((member) => {
            this.payment_item_members.push({
              label: member.name,
              value: member.id,
            });
          });
        })
        .finally(() => {
          this.is_fetching_members = false;
        });

      return this.payment_item_members;
    },

    filterMembers(val, update, abort) {
      if (val < 1) {
        this.start_filter_members = false;
        abort();
        return;
      }

      update(() => {
        this.start_filter_members = true;
        this.members = this.payment_item_members.filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.members;
      });
    },

    getPaymentItems() {
      this.payment_items_by_category = [];
      this.is_fetching_members = true;
      let payload = {
        status: "none",
        url: `/api/protected/payment-items?session_id=${this.year.value}`,
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
              frequency: ele.frequency,
              payment_item_months: ele.payment_item_months,
              payment_item_quarters: ele.payment_item_quarters,
              type: ele.type,
              references: ele.references,
            });
          });
        }
        this.is_fetching_members = false;
      });
      return this.payment_items_by_category;
    },

    goBack() {
      return (this.has_selected_payment_item = !this.has_selected_payment_item);
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
  font-size: 0.8rem;
  align-items: center;
  color: $grey5;
}

.noPaymentItems {
  color: $grey2;
}

.info {
  color: $grey2;
  font-size: smaller;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
  color: $grey8;
}
</style>
