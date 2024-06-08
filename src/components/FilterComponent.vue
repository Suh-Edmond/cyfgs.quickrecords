<template>
  <div>
    <!---------------------------------------------MEMBER MANAGEMENT FILTERS----------------------------------------------->
    <div
      class="row q-gutter-sm q-pa-sm"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_member_filters"
    >
      <div class="col-12 col-md">
        <q-select
          v-model="year"
          outlined
          dense
          :options="getSessionsFromState"
          :label="$t('app.selectYearLabel')"
          clearable
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
      <div class="col-12 col-md">
        <q-select
          v-model="has_register"
          outlined
          dense
          :options="registrationStatuses"
          :label="$t('app.selectStatusLabel')"
          clearable
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
      <div class="col-12 col-md">
        <q-select
          v-model="gender"
          outlined
          dense
          :options="genders"
          :label="$t('app.selectGenderLabel')"
          clearable
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
      <div class="flex col-12 col-md">
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterMembers"
          @click="filterMembers"
          no-caps
          icon-right="filter_list"
          class="q-my-xs"
          size="sm"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.download')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="download"
          @click="downloadMembers"
          class="q-my-xs"
          size="sm"
        ></q-btn>
      </div>
    </div>
    <!---------------------------------------------END OF MEMBER MANAGEMENT FILTERS---------------------------------------->

    <!---------------------------------------------PAYMENT AND EXPENDITURE CATEGORIES FILTERS------------------------------->
    <div
      class="row q-pa-sm justify-end"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_categories"
    >
      <div :class="$q.platform.is.mobile ? 'row q-pt-md' : ''">
        <q-space />
        <q-btn
          :label="$t('app.download')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="download"
          @click="downloadCategories"
          class="q-py-xs"
          size="sm"
        ></q-btn>
      </div>
    </div>
    <!---------------------------------------------END OF PAYMENT AND EXPENDITURE CATEGORIES FILTERS------------------------>

    <!-------------------------------------------------HEADER FILTER FOR PAYMENT ITEMS------------------------------------->
    <div
      class="row q-gutter-sm q-pa-sm"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_filter_payment_items"
    >
      <div class="col-12 col-md">
        <q-select
          v-model="year"
          outlined
          dense
          :options="getSessionsFromState"
          :label="$t('app.searchYear')"
          use-input
          input-debounce="0"
          clearable
          hide-bottom-space
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"
                >{{ $t("app.notResults") }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-12 col-md">
        <q-select
          v-model="is_compulsory"
          outlined
          dense
          :options="statuses"
          :label="$t('app.selectStatusLabel')"
          clearable
          hide-bottom-space
        />
      </div>
      <div class="col-12 col-md">
        <q-select
          v-model="type"
          outlined
          dense
          :options="payment_item_types"
          :label="$t('app.selectPaymentType')"
          clearable
          hide-bottom-space
        />
      </div>
      <div class="col-12 col-md">
        <q-select
          v-model="frequency"
          outlined
          dense
          :options="frequencies"
          :label="$t('app.selectFrequency')"
          clearable
          hide-bottom-space
        />
      </div>
      <div class="col-12 col-md">
        <q-select
          v-model="state"
          outlined
          dense
          :options="states"
          clearable
          :label="$t('app.selectState')"
          hide-bottom-space
        />
      </div>
      <div
        class="col-12 col-md flex"
        :class="$q.platform.is.desktop ? 'q-ml-sm' : ''"
      >
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterPaymentItem"
          @click="filterPaymentItems"
          no-caps
          icon-right="filter_list"
          class="q-my-xs"
          size="sm"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.download')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="download"
          @click="downloadPaymentItems"
          class="q-my-xs"
          size="sm"
        ></q-btn>
      </div>
    </div>
    <!------------------------------------------------END OF FILTER HEADER PAYMENT  ITEM------------------------------------------>

    <!-----------------------------------------------HEADER FILTER FOR EXPENDITURE ITEMS------------------------------------------->
    <div
      class="row q-gutter-sm q-pa-sm"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_filter_expenditure_items"
    >
      <div class="col-12 col-md">
        <q-select
          v-model="year"
          outlined
          dense
          :options="getSessionsFromState"
          :label="$t('app.searchYear')"
          use-input
          input-debounce="0"
          clearable
          hide-bottom-space
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"
                >{{ $t("app.notResults") }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-12 col-md">
        <q-select
          v-model="payment_item_id"
          outlined
          dense
          :options="filtered_payment_items"
          :label="$t('app.searchPaymentItem')"
          input-debounce="0"
          use-input
          clearable
          @filter="searchPaymentItems"
          @input="stopSelectInputSearch"
          class="payment_item_select_field"
          hide-bottom-space
        >
          <template v-slot:append v-if="start_payment_item_select_filtering">
            <q-spinner color="primary" size="1.2em" :thickness="3" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"
                >{{ $t("app.notResults") }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-12 col-md">
        <q-select
          v-model="payment_status"
          outlined
          dense
          :options="payment_statuses"
          :label="$t('app.selectStatusLabel')"
          hide-bottom-space
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"
                >{{ $t("app.notResults") }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-12 col-md flex">
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterExpenditureItems"
          no-caps
          icon-right="filter_list"
          @click="filterExpenditureItems"
          class="q-my-xs"
          size="sm"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.download')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="download"
          @click="downloadExpenditureItems"
          class="q-my-xs"
          size="sm"
        ></q-btn>
      </div>
    </div>
    <!-----------------------------------------------END HEADER FILTER FOR EXPENDITURE ITEMS--------------------------------------->

    <!----------------------------------------------HEADER FILTER FOR EXPENDITURE ITEM DETAILS-------------------------------------->
    <div
      class="row q-gutter-sm q-pa-sm"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_filter_expenditure_items_details"
    >
      <div class="col-12 col-md">
        <q-select
          v-model="payment_status"
          outlined
          dense
          :options="payment_statuses"
          :label="$t('app.selectStatusLabel')"
          hide-bottom-space
        />
      </div>
      <div class="col-12 col-md flex">
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterExpenditureItem"
          no-caps
          icon-right="filter_list"
          @click="filterItemDetails"
          class="q-my-xs"
          size="sm"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.download')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="download"
          class="q-my-xs"
          size="sm"
          @click="downloadExpenditureItemDetails"
        ></q-btn>
      </div>
    </div>
    <!---------------------------------------------END OF FILTER FOR EXPENDITURE ITEM DETAILS--------------------------------------->

    <!--------------------------------------------FILTER HEADER FOR MEMBERS SAVINGS NON TREASURER------------------------------------------------->
    <div
      class="row q-gutter-sm q-pa-sm"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_savings_non_treasurer"
    >
      <q-select
        v-model="year"
        outlined
        dense
        :options="getSessionsFromState"
        :label="$t('app.searchYear')"
        use-input
        input-debounce="0"
        clearable
        class="col-12 col-md"
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
      <q-select
        v-model="month"
        outlined
        dense
        :options="monthsOptions"
        :label="$t('app.searchMonth')"
        use-input
        input-debounce="0"
        clearable
        @filter="filterMonths"
        @input="stopSelectInputSearch"
        class="col-12 col-md"
        hide-bottom-space
      >
        <template v-slot:append v-if="start_month_filtering">
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
      <div class="col-12 col-md flex">
        <q-btn
          :label="$t('app.filter')"
          :color="'primary'"
          :disabled="validateFilterSavings"
          no-caps
          icon-right="filter_list"
          @click="filterAllSavings"
          class="q-my-xs"
          size="sm"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.download')"
          :loading="getDownloadLoadingState"
          :color="'positive'"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="download"
          @click="downloadMembersSavings"
          class="q-my-xs"
          size="sm"
        ></q-btn>
      </div>
    </div>
    <!-------------------------------------------END OF FILTER FOR MEMBERS SAVINGS NON TREASURER-------------------------------------------------->

    <!----------------------------------------------FILTER HEADER FOR MEMBERS SAVINGS TREASURER--------------------------------------------------->
    <div
      class="row q-gutter-sm q-pa-sm"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_savings_treasurer"
    >
      <q-btn
        :label="$t('app.filter')"
        :color="'primary'"
        :disabled="false"
        no-caps
        icon-right="filter_list"
        @click="searchSavings()"
        class="q-py-xs"
        size="sm"
      >
      </q-btn>
      <q-space />
      <q-btn
        :label="$t('app.download')"
        :loading="getDownloadLoadingState"
        :color="'positive'"
        :disabled="getDisableDownloadBtn"
        no-caps
        icon-right="download"
        @click="downloadMembersSavings"
        class="q-py-xs"
        size="sm"
      ></q-btn>
    </div>
    <!---------------------------------------------END OF FILTER FOR MEMBERS SAVINGS TREASURER---------------------------------------------------->

    <!----------------------------------------------FILTER HEADER FOR MEMBER SAVINGS-------------------------------------------------------------->
    <div
      class="row q-gutter-sm q-pa-sm"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_filter_member_savings"
    >
      <q-select
        v-model="month"
        outlined
        dense
        :options="monthsOptions"
        :label="$t('app.searchMonth')"
        use-input
        input-debounce="0"
        clearable
        @filter="filterMonths"
        @input="stopSelectInputSearch"
        class="col-12 col-md"
        hide-bottom-space
      >
        <template v-slot:append v-if="start_month_filtering">
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
      <q-select
        v-model="payment_status"
        outlined
        dense
        :options="payment_statuses"
        :label="$t('app.selectStatusLabel')"
        clearable
        class="col-12 col-md"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              {{ $t("app.noResults") }}</q-item-section
            >
          </q-item>
        </template>
      </q-select>
      <div class="col-12 col-md flex">
        <q-btn
          :label="$t('app.filter')"
          :color="'primary'"
          :disabled="validateFilterMemberSavings"
          no-caps
          icon-right="filter_list"
          @click="filterMemberSavings"
          class="q-my-xs"
          size="sm"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.download')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="download"
          @click="downloadMemberSavings"
          class="q-my-xs"
          size="sm"
        ></q-btn>
      </div>
    </div>
    <!----------------------------------------------END OF FILTER HEADER FOR MEMBER SAVINGS------------------------------------------------------->

    <!----------------------------------------------FILTER HEADER FOR INCOME ACTIVITIES----------------------------------------------------------->
    <div
      class="row q-gutter-xs q-pa-sm"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_income_activity"
    >
      <q-select
        v-model="year"
        outlined
        dense
        :options="getSessionsFromState"
        :label="$t('app.searchYear')"
        use-input
        input-debounce="0"
        clearable
        class="col-12 col-md"
        hide-bottom-space
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"
              >{{ $t("app.notResults") }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select
        v-model="payment_item_id"
        outlined
        dense
        :options="filtered_payment_items"
        :label="$t('app.searchPaymentItem')"
        input-debounce="0"
        use-input
        clearable
        @filter="searchPaymentItems"
        @input="stopSelectInputSearch"
        class="col-12 col-md"
        hide-bottom-space
      >
        <template v-slot:append v-if="start_payment_item_select_filtering">
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
      <q-select
        v-model="month"
        outlined
        dense
        :options="monthsOptions"
        :label="$t('app.searchMonth')"
        input-debounce="0"
        @filter="filterMonths"
        @input="stopSelectInputSearch"
        use-input
        clearable
        class="col-12 col-md"
        hide-bottom-space
      >
        <template v-slot:append v-if="start_month_filtering">
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
      <q-select
        v-model="payment_status"
        outlined
        dense
        :options="payment_statuses"
        clearable
        :label="$t('app.selectStatusLabel')"
        class="col-12 col-md"
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
      <div class="col-12 col-md flex">
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterIncomeActivity"
          no-caps
          icon-right="filter_list"
          @click="filterIncomeActivity"
          class="q-my-xs"
          size="sm"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.download')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="download"
          @click="downloadIncomeActivity"
          class="q-my-xs"
          size="sm"
        ></q-btn>
      </div>
    </div>
    <!----------------------------------------------END OF FILTER HEADER FOR INCOME ACTIVITIES---------------------------------------------------->

    <!--------------------------------------------FILTER HEADER FOR VIEW MEMBER CONTRIBUTIONS---------------------------------------------------->
    <div
      class="row q-gutter-sm q-pb-sm"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_member_contribution"
    >
      <q-select
        v-model="transaction_status"
        outlined
        dense
        :options="transaction_statuses"
        :label="$t('app.selectStatusLabel')"
        use-input
        input-debounce="0"
        clearable
        class="col-12 col-md"
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
      <q-select
        v-model="payment_status"
        outlined
        dense
        :options="payment_statuses"
        :label="$t('app.searchTransactionStatus')"
        clearable
        class="col-12 col-md"
        hide-bottom-space
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              {{ $t("app.noResults") }}</q-item-section
            >
          </q-item>
        </template>
      </q-select>
      <div class="col-12 col-md flex">
        <q-btn
          :label="$t('app.filter')"
          :color="'primary'"
          :disabled="validateFilterMemberContribution"
          no-caps
          icon-right="filter_list"
          @click="filterMemberContribution"
          class="q-my-xs"
          size="sm"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.download')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="download"
          @click="downloadMemberContribution"
          class="q-my-xs"
          size="sm"
        ></q-btn>
      </div>
    </div>
    <!--------------------------------------------END OF FILTER HEADER FOR VIEW MEMBER CONTTRIBUTION--------------------------------------------->

    <!--------------------------------------------FILTER HEADER FOR SPONSORSHIP----------------------------------------------------------------->
    <div
      class="row q-gutter-sm q-pa-sm"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_sponsorship"
    >
      <q-select
        v-model="year"
        outlined
        dense
        :options="getSessionsFromState"
        :label="$t('app.searchYear')"
        use-input
        input-debounce="0"
        clearable
        class="col-12 col-md"
        hide-bottom-space
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"
              >{{ $t("app.notResults") }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select
        v-model="payment_item_id"
        outlined
        dense
        :options="filtered_payment_items"
        :label="$t('app.searchPaymentItem')"
        input-debounce="0"
        use-input
        clearable
        @filter="searchPaymentItems"
        @input="stopSelectInputSearch"
        class="col-12 col-md"
        hide-bottom-space
      >
        <template v-slot:append v-if="start_payment_item_select_filtering">
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
      <q-select
        v-model="payment_status"
        outlined
        dense
        :options="payment_statuses"
        :label="$t('app.selectStatusLabel')"
        clearable
        class="col-12 col-md"
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
      <div class="col-12 col-md flex">
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterSponsorship"
          no-caps
          icon-right="filter_list"
          @click="filterSponsorship"
          class="q-my-xs"
          size="sm"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.download')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="download"
          @click="downloadSponsorship"
          class="q-my-xs"
          size="sm"
        ></q-btn>
      </div>
    </div>
    <!--------------------------------------------END OF FILTER HEADER FOR SPONSORSHIP---------------------------------------------------------->

    <!--------------------------------------------FILTER HEADER FOR REPORTS--------------------------------------------------------------------->
    <div
      class="row q-gutter-sm q-pb-sm q-pr-sm"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_report"
    >
      <div class="col-12 col-md">
        <q-select
          v-model="report_option"
          outlined
          dense
          :options="getReportGenerationOptions"
          :label="$t('app.selectOptionGenerateReport')"
          @input="selectedReportOption"
          clearable
          hide-bottom-space
        />
      </div>
      <div class="col-12 col-md">
        <q-select
          v-model="group"
          outlined
          dense
          :options="report_options"
          :label="selected_option_label"
          input-debounce="0"
          use-input
          clearable
          @filter="filterReportOptions"
          @input="stopSelectInputSearch"
          hide-bottom-space
          class="wrap"
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
      <div class="col-12 col-md flex">
        <q-btn
          :label="$t('app.generateReport')"
          color="primary"
          @click="generateReport"
          no-caps
          :disabled="validateGenerateReport"
          :loading="false"
          class="q-my-xs"
          size="sm"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.download')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDownloadLoadingState"
          no-caps
          icon-right="download"
          @click="downloadReport"
          class="q-my-xs"
          size="sm"
        ></q-btn>
      </div>
    </div>
    <!-------------------------------------------END OF FILTER HEADER FOR REPORTS--------------------------------------------------------------->

    <!--------------------------------------------FILTER HEADER FOR balance sheet--------------------------------------------------------------------->
    <div
      class="row q-gutter-sm q-pb-sm q-pr-sm"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_balance_sheet"
    >
      <div class="col-8 col-md-8 col-sm-12 col-xs-12 col-lg-8">
        <q-select
          v-model="year"
          outlined
          dense
          :options="getSessionsFromState"
          :label="$t('app.searchYear')"
          use-input
          input-debounce="0"
          clearable
          hide-bottom-space
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"
                >{{ $t("app.notResults") }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-4 col-md flex">
        <q-btn
          :label="$t('app.generateBalanceSheet')"
          color="primary"
          @click="generateBalanceSheet"
          no-caps
          :disabled="validateGenerateBalanceSheet"
          :loading="false"
          class="q-my-xs"
          size="sm"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.download')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDownloadLoadingState"
          no-caps
          icon-right="download"
          @click="downloadBalanceSheet"
          class="q-my-xs"
          size="sm"
        ></q-btn>
      </div>
    </div>
    <!-------------------------------------------END OF FILTER HEADER FOR REPORTS--------------------------------------------------------------->
  </div>
</template>

<script>
import CurrentYearMixin from "src/mixins/CurrentYearMixin.vue";
import PaymentItemMixinVue from "src/mixins/PaymentItemMixin.vue";
import MonthsMixinVue from "src/mixins/MonthsMixin.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";

export default {
  props: {
    show_member_filters: {
      required: false,
      type: Boolean,
    },

    show_categories: {
      required: false,
      type: Boolean,
    },

    show_filter_payment_items: {
      required: false,
      type: Boolean,
    },

    show_filter_expenditure_items: {
      required: false,
      type: Boolean,
    },

    show_filter_member_savings: {
      required: false,
      type: Boolean,
    },

    show_filter_expenditure_items_details: {
      required: false,
      type: Boolean,
    },

    show_savings_non_treasurer: {
      required: false,
      type: Boolean,
    },

    show_income_activity: {
      required: false,
      type: Boolean,
    },

    show_savings_treasurer: {
      required: false,
      type: Boolean,
    },

    show_member_contribution: {
      required: false,
      type: Boolean,
    },

    loading_download: {
      required: true,
      type: Boolean,
    },

    disable_download_btn: {
      required: true,
      type: Boolean,
    },

    show_sponsorship: {
      required: false,
      type: Boolean,
    },

    show_report: {
      required: false,
      type: Boolean,
    },

    show_balance_sheet: {
      required: false,
      type: Boolean,
    },
  },

  mixins: [CurrentYearMixin, PaymentItemMixinVue, MonthsMixinVue, HelperMixin],

  mounted() {
    if (this.getSessionsFromState.length == 0) {
      this.getSessions();
    }
    if (this.$store.getters.getPaymentActivities.length == 0) {
      this.fetchPaymentActivities();
    }
    this.getAllPaymentItemsFromStore();
  },

  data() {
    return {
      year: "",
      has_register: "",
      gender: "",
      genders: ["Male", "Female", "All", "Other"],
      registrationStatuses: [
        "Registered",
        "Non-registered",
        "Pending",
        "Declined",
        "All",
        "Active",
        "In-active",
      ],
      is_compulsory: "",
      type: "",
      frequency: "",
      state: "",
      statuses: ["Compulsory", "Not Compulsory", "All"],
      states: ["Active", "Expired", "All"],
      payment_item_types: [
        "All Members",
        "A Member",
        "Members with roles",
        "Members without roles",
        "Grouped members",
        "All",
      ],
      frequencies: ["Yearly", "Monthly", "One-time", "All"],
      payment_item_id: "",
      start_payment_item_select_filtering: false,
      payment_statuses: ["Pending", "Approved", "Declined", "All"],
      payment_status: "",
      filtered_payment_items: [],
      month: "",
      start_month_filtering: false,
      monthsOptions: [],
      transaction_statuses: ["Incomplete", "Complete", "All"],
      transaction_status: "",
      report_option: "",
      selected_option_label: "",
      report_options: [],
      quarters: [
        { label: this.$t("app.firstQuarter"), value: "1" },
        { label: this.$t("app.secondQuarter"), value: "2" },
        { label: this.$t("app.thirdQuarter"), value: "3" },
        { label: this.$t("app.fourthQuarter"), value: "4" },
      ],
      group: "",
      start_filtering: false,
      mid_years: [
        { label: this.$t("app.midYearOne"), value: "6" },
        { label: this.$t("app.midYearTwo"), value: "12" },
      ],
    };
  },

  computed: {
    validateFilterMembers() {
      return this.year === "" || this.year === null;
    },

    validateFilterCategories() {
      return this.year === null || this.year === "";
    },

    getDownloadLoadingState: {
      get() {
        return this.loading_download;
      },
      set(loading_download) {
        return loading_download;
      },
    },

    getDisableDownloadBtn: {
      get() {
        return this.disable_download_btn;
      },
      set(disable_download_btn) {
        return disable_download_btn;
      },
    },

    validateFilterPaymentItem() {
      return (
        this.year == "" &&
        this.is_compulsory === "" &&
        this.frequency === "" &&
        this.type === "" &&
        this.state === ""
      );
    },

    validateFilterExpenditureItems() {
      return (
        this.payment_item_id == "" &&
        this.year == "" &&
        this.payment_status == ""
      );
    },

    validateFilterExpenditureItem() {
      return this.payment_status === "";
    },

    validateFilterSavings() {
      return this.year === "" || this.year === null;
    },

    validateFilterMemberSavings() {
      return (
        (this.month === null || this.month === "") &&
        (this.payment_status === null || this.payment_status === "")
      );
    },

    validateFilterIncomeActivity() {
      return (
        (this.payment_item_id == "" || this.payment_item_id == null) &&
        (this.year == "" || this.year == null)
      );
    },

    validateFilterMemberContribution() {
      return (
        (this.payment_status === null || this.payment_status === "") &&
        (this.transaction_status === null || this.transaction_status === "")
      );
    },

    validateFilterSponsorship() {
      return (
        (this.payment_item_id == "" || this.payment_item_id == null) &&
        (this.year == "" || this.year == null)
      );
    },

    getReportGenerationOptions() {
      let data = [];
      data.push(
        { label: this.$t("app.reportByPaymentItem"), value: 1 },
        { label: this.$t("app.reportByQuarter"), value: 2 },
        { label: this.$t("app.midYearReportLabel"), value: 3 },
        { label: this.$t("app.reportByYear"), value: 4 }
      );

      return data;
    },

    validateGenerateReport() {
      return this.report_option == "" || this.group == "";
    },

    validateGenerateBalanceSheet() {
      return this.year == "" || this.year == null;
    },
  },

  methods: {
    filterMembers() {
      let payload = {
        year: this.year !== null && this.year !== "" ? this.year : "",
        has_register: this.indexRegistrationStatus(this.has_register),
        gender:
          this.gender !== null && this.gender !== ""
            ? this.indexGender(this.gender)
            : "",
      };

      this.$emit("filter-members", payload);
    },
    downloadMembers() {
      let payload = {
        year: this.year !== null && this.year !== "" ? this.year : "",
        has_register: this.indexRegistrationStatus(this.has_register),
        gender:
          this.gender !== null && this.gender !== ""
            ? this.indexGender(this.gender)
            : "",
      };

      this.$emit("download-members", payload);
    },

    filterCategories() {
      let payload = {
        year: this.year !== null && this.year !== "" ? this.year : "",
      };

      this.$emit("filter-categories", payload);
    },

    downloadCategories() {
      let payload = {
        year: this.year !== null && this.year !== "" ? this.year : "",
      };

      this.$emit("download-categories", payload);
    },

    filterPaymentItems() {
      let payload = {
        is_compulsory:
          this.is_compulsory !== null && this.is_compulsory !== ""
            ? this.indexCompulsory(this.is_compulsory)
            : "",
        frequency:
          this.frequency !== null && this.frequency !== ""
            ? this.indexPaymentFrequency(this.frequency)
            : "",
        type:
          this.type !== null && this.type !== ""
            ? this.indexPaymentItemType(this.type)
            : "",
        state:
          this.state !== null && this.state !== ""
            ? this.indexPaymentItemStates(this.state)
            : "",
        session_id:
          this.year !== null && this.year !== "" ? this.year.value : "",
      };

      this.$emit("filter-payment-items", payload);
    },

    getAllPaymentItemsFromStore() {
      this.filtered_payment_items = [];
      if (this.$store.getters.getPaymentActivities.length > 0) {
        this.$store.getters.getPaymentActivities.forEach((ele) => {
          this.filtered_payment_items.push({
            label: ele.name,
            value: ele.id,
            amount: ele.amount,
          });
        });
      }
      return this.filtered_payment_items;
    },

    downloadPaymentItems() {
      let payload = {
        is_compulsory:
          this.is_compulsory !== null && this.is_compulsory !== ""
            ? this.is_compulsory(this.is_compulsory)
            : "",
        frequency:
          this.frequency !== null && this.frequency !== ""
            ? this.indexPaymentFrequency(this.frequency)
            : "",
        type:
          this.type !== null && this.type !== ""
            ? this.indexPaymentItemType(this.type)
            : "",
        state:
          this.state !== null && this.state !== ""
            ? this.indexPaymentItemStates(this.state)
            : "",
      };

      this.$emit("download-payment-items", payload);
    },

    downloadExpenditureItems() {
      let payload = {
        payment_item_id:
          this.payment_item_id != null && this.payment_item_id != ""
            ? this.payment_item_id
            : "",
        year: this.year != null && this.year != "" ? this.year : "",
        payment_status:
          this.payment_status != null && this.payment_status != ""
            ? this.indexPaymentStatus(this.payment_status)
            : "",
      };

      this.$emit("download-expenditure-items", payload);
    },

    searchPaymentItems(val, update, abort, is_report_filtering) {
      const all_payment_items = this.getAllPaymentItemsFromStore();
      if (val < 1) {
        this.start_payment_item_select_filtering = false;
        abort();
        return;
      }
      if (!is_report_filtering) {
        update(() => {
          this.start_payment_item_select_filtering = true;
          this.filtered_payment_items = all_payment_items.filter((item) =>
            item.label.toLowerCase().includes(val.toLowerCase())
          );
          return this.filtered_payment_items;
        });
      } else {
        update(() => {
          this.start_filtering = true;
          this.report_options = all_payment_items.filter((item) =>
            item.label.toLowerCase().includes(val.toLowerCase())
          );
          return this.report_options;
        });
      }
    },

    stopSelectInputSearch() {
      if (this.payment_item_id !== null) {
        this.start_payment_item_select_filtering = false;
      }
      if (this.month !== null || this.month !== "") {
        this.start_month_filtering = false;
      }
      if (this.group !== null || this.group !== "") {
        this.start_filtering = false;
      }
    },

    filterExpenditureItems() {
      let payload = {
        payment_item_id:
          this.payment_item_id !== null && this.payment_item_id !== ""
            ? this.payment_item_id
            : "",
        year: this.year !== null && this.year !== "" ? this.year : "",
        payment_status: this.indexPaymentStatus(this.payment_status),
      };

      this.$emit("filter-expenditure-items", payload);
    },

    filterItemDetails() {
      this.$emit("filter-expenditure-item-details", {
        payment_status: this.indexPaymentStatus(this.payment_status),
      });
    },

    downloadExpenditureItemDetails() {
      this.$emit("download-expenditure-item-details", {
        payment_status: this.indexPaymentStatus(this.payment_status),
      });
    },

    filterMonths(val, update, abort) {
      if (val.length < 1) {
        this.start_month_filtering = false;
        abort();
        return;
      }
      if (this.month == "") {
        this.monthsOptions = this.getMonths;
      }
      update(() => {
        this.start_month_filtering = true;
        const needle = val.toLowerCase();
        this.monthsOptions = this.getMonths.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    filterAllSavings() {
      this.$emit("filter-savings", { year: this.year, month: this.month });
    },

    downloadMembersSavings() {
      this.$emit("download-savings", { year: this.year, month: this.month });
    },

    searchSavings() {
      this.$emit("search-savings");
    },

    filterMemberSavings() {
      this.$emit("filter-member-savings", {
        month: this.month,
        payment_status: this.indexPaymentStatus(this.payment_status),
      });
    },

    downloadMemberSavings() {
      this.$emit("download-member-savings", {
        month: this.year,
        payment_status: this.indexPaymentStatus(this.payment_status),
      });
    },

    filterIncomeActivity() {
      let payload_data = {
        payment_item_id: this.payment_item_id,
        month: this.month,
        status: this.indexPaymentStatus(this.payment_status),
        year: this.year.value,
      };
      this.$emit("filter-income-activity", payload_data);
    },

    downloadIncomeActivity() {
      let payload = {
        payment_item_id: this.payment_item_id,
        month: this.month,
        status: this.indexPaymentStatus(this.payment_status),
      };

      this.$emit("download-income-activity", payload);
    },

    filterMemberContribution() {
      let payload = {
        payment_status: this.indexPaymentStatus(this.payment_status),
        transaction_status: this.indexTransactionStatus(
          this.transaction_status
        ),
      };

      this.$emit("filter-member-contribution", payload);
    },

    downloadMemberContribution() {
      let payload = {
        payment_status: this.indexPaymentStatus(this.payment_status),
        transaction_status: this.indexTransactionStatus(
          this.transaction_status
        ),
      };

      this.$emit("download-member-contribution", payload);
    },

    filterSponsorship() {
      let payload_data = {
        payment_item_id: this.payment_item_id,
        payment_status: this.indexPaymentStatus(this.payment_status),
        year: this.year,
      };

      this.$emit("filter-sponsorship", payload_data);
    },

    downloadSponsorship() {
      let payload_data = {
        payment_item_id: this.payment_item_id,
        payment_status: this.indexPaymentStatus(this.payment_status),
      };

      this.$emit("download-sponsorship", payload_data);
    },

    selectedReportOption() {
      if (this.report_option != null) {
        switch (this.report_option.value) {
          case 1:
            if (this.$store.getters.getPaymentActivities.length == 0) {
              this.fetchPaymentActivities();
            }
            this.getAllPaymentItemsFromStore();
            this.selected_option_label = this.$t("app.searchPaymentItem");
            break;
          case 2:
            this.selected_option_label = this.$t("app.selectQuarter");
            break;
          case 3:
            this.selected_option_label = this.$t("app.selectMidYear");
            break;
          case 4:
            this.selected_option_label = this.$t("app.selectYearLabel");
            break;
        }
      }
    },

    filterQuarters(val, update, abort) {
      this.report_options = [];
      if (val < 1) {
        abort();
        this.start_filtering = false;
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.report_options = this.quarters.filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.report_options;
      });
    },

    filterMidYear(val, update, abort) {
      this.report_options = [];
      if (val < 1) {
        abort();
        this.start_filtering = false;
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.report_options = this.mid_years.filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.report_options;
      });
    },

    filterYears(val, update, abort) {
      this.report_options = [];
      if (val < 1) {
        abort();
        this.start_filtering = false;
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.report_options = this.getSessionsFromState.filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.report_options;
      });
    },

    filterReportOptions(val, update, abort) {
      this.report_options = [];
      switch (this.report_option.value) {
        case 1:
          this.searchPaymentItems(val, update, abort, true);
          break;
        case 2:
          this.filterQuarters(val, update, abort);
          break;
        case 3:
          this.filterMidYear(val, update, abort);
          break;
        case 4:
          this.filterYears(val, update, abort);
          break;
      }
      return this.report_options;
    },

    generateReport() {
      let payload = {
        group: this.group,
        report_option: this.report_option,
      };
      this.$emit("generate-report", payload);
    },

    downloadReport() {
      let payload = {
        group: this.group,
        report_option: this.report_option,
      };
      this.$emit("download-report", payload);
    },

    generateBalanceSheet() {
      let payload = {
        session: this.year,
        organisation_id: this.$store.getters.getOrganisation.id,
      };

      this.$emit("generate-balance-sheet", payload);
    },

    downloadBalanceSheet() {
      let payload = {
        session: this.year,
        organisation_id: this.$store.getters.getOrganisation.id,
      };
      this.$emit("download-balance-sheet", payload);
    },
  },
};
</script>

<style lang="scss" scoped>
.view_savings {
  height: 1rem;
}
</style>
