<template>
  <div>
    <!---------------------------------------------MEMBER MANAGEMENT FILTERS----------------------------------------------->
    <div
      class="q-pa-sm"
      :class="$q.screen.lg ? 'row' : 'q-gutter-sm'"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_member_filters"
    >
      <div
        class="col col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.screen.lg ? 'q-pr-md' : ''"
      >
        <q-select
          v-model="year"
          outlined
          dense
          :options="getSessionsFromState"
          :label="$t('app.selectYearLabel')"
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
      <div
        class="col col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.screen.lg ? 'q-pr-md' : ''"
      >
        <q-select
          v-model="has_register"
          outlined
          dense
          :options="registrationStatuses"
          :label="$t('app.selectStatusLabel')"
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
      <div
        class="col col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.screen.lg ? 'q-pr-md' : ''"
      >
        <q-select
          v-model="gender"
          outlined
          dense
          :options="genders"
          :label="$t('app.selectGenderLabel')"
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
      <div class="flex col-md-3 col-lg-3 col-xs-12 col-sm-12">
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterMembers"
          @click="filterMembers"
          no-caps
          icon-right="filter_list"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
          :class="$q.screen.lg ? 'q-pr-md' : ''"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.print')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="print"
          @click="downloadMembers"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        ></q-btn>
      </div>
    </div>
    <!---------------------------------------------END OF MEMBER MANAGEMENT FILTERS---------------------------------------->

    <!---------------------------------------------PAYMENT AND EXPENDITURE CATEGORIES FILTERS------------------------------->
    <div
      :class="$q.screen.lg ? 'row q-pa-sm' : 'row q-pa-sm'"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_categories"
    >
      <div
        class="row col-md-12 col-lg-12 col-xs-12 col-sm-12"
        :class="$q.platform.is.mobile ? 'row q-pt-md' : 'q-pl-md'"
      >
        <q-space />
        <q-btn
          :label="$t('app.print')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="print"
          @click="downloadCategories"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        ></q-btn>
      </div>
    </div>
    <!---------------------------------------------END OF PAYMENT AND EXPENDITURE CATEGORIES FILTERS------------------------>

    <!-------------------------------------------------HEADER FILTER FOR PAYMENT ITEMS------------------------------------->
    <div
      :class="$q.screen.lg ? 'row q-pa-sm' : 'q-gutter-sm q-px-sm'"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_filter_payment_items"
    >
      <div class="col">
        <q-select
          v-model="is_compulsory"
          outlined
          dense
          :options="statuses"
          :label="$t('app.selectStatusLabel')"
          clearable
        />
      </div>
      <div class="col" :class="$q.platform.is.desktop ? 'q-ml-xs' : ''">
        <q-select
          v-model="type"
          outlined
          dense
          :options="payment_item_types"
          :label="$t('app.selectPaymentType')"
          clearable
        />
      </div>
      <div class="col" :class="$q.platform.is.desktop ? 'q-ml-xs' : ''">
        <q-select
          v-model="frequency"
          outlined
          dense
          :options="frequencies"
          :label="$t('app.selectFrequency')"
          clearable
        />
      </div>
      <div class="col" :class="$q.platform.is.desktop ? 'q-ml-xs' : ''">
        <q-select
          v-model="state"
          outlined
          dense
          :options="states"
          clearable
          :label="$t('app.selectState')"
        />
      </div>
      <div
        class="col-4 col-md-4 col-lg-4 col-xs-12 col-sm-12 flex"
        :class="$q.platform.is.desktop ? 'q-ml-xs' : ''"
      >
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterPaymentItem"
          @click="filterPaymentItems"
          no-caps
          icon-right="filter_list"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.print')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="print"
          @click="downloadPaymentItems"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        ></q-btn>
      </div>
    </div>
    <!------------------------------------------------END OF FILTER HEADER PAYMENT  ITEM------------------------------------------>

    <!-----------------------------------------------HEADER FILTER FOR EXPENDITURE ITEMS------------------------------------------->
    <div
      :class="$q.screen.lg ? 'row q-pa-sm' : 'col q-gutter-sm q-px-sm'"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_filter_expenditure_items"
    >
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
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
      <div
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.platform.is.desktop ? 'q-pl-md' : ''"
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
      <div
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.platform.is.desktop ? 'q-pl-md' : ''"
      >
        <q-select
          v-model="payment_status"
          outlined
          dense
          :options="payment_statuses"
          :label="$t('app.selectStatusLabel')"
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
      <div
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12 flex"
        :class="$q.platform.is.desktop ? 'q-pl-md' : ''"
      >
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterExpenditureItems"
          no-caps
          icon-right="filter_list"
          @click="filterExpenditureItems"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.print')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="print"
          @click="downloadExpenditureItems"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        ></q-btn>
      </div>
    </div>
    <!-----------------------------------------------END HEADER FILTER FOR EXPENDITURE ITEMS--------------------------------------->

    <!----------------------------------------------HEADER FILTER FOR EXPENDITURE ITEM DETAILS-------------------------------------->
    <div
      :class="$q.screen.lg ? 'row q-pa-sm' : 'q-gutter-sm q-px-sm'"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_filter_expenditure_items_details"
    >
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
        <q-select
          v-model="payment_status"
          outlined
          dense
          :options="payment_statuses"
          :label="$t('app.selectStatusLabel')"
        />
      </div>
      <div
        class="col-md-9 col-lg-9 col-xs-12 col-sm-12 flex"
        :class="$q.platform.is.desktop ? 'q-pl-sm' : ''"
      >
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterExpenditureItem"
          no-caps
          icon-right="filter_list"
          @click="filterItemDetails"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.print')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="print"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
          @click="downloadExpenditureItemDetails"
        ></q-btn>
      </div>
    </div>
    <!---------------------------------------------END OF FILTER FOR EXPENDITURE ITEM DETAILS--------------------------------------->

    <!--------------------------------------------FILTER HEADER FOR MEMBERS SAVINGS NON TREASURER------------------------------------------------->
    <div
      :class="$q.screen.lg ? 'row q-pa-sm' : 'col q-gutter-sm q-px-sm'"
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
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
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
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.platform.is.desktop ? 'q-pl-md' : ''"
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
      <div
        class="col-md-6 col-lg-6 col-xs-12 col-sm-12 flex"
        :class="$q.platform.is.desktop ? 'q-pl-md' : ''"
      >
        <q-btn
          :label="$t('app.filter')"
          :color="'primary'"
          :disabled="validateFilterSavings"
          no-caps
          icon-right="filter_list"
          @click="filterAllSavings"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.print')"
          :loading="getDownloadLoadingState"
          :color="'positive'"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="print"
          @click="downloadMembersSavings"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        ></q-btn>
      </div>
    </div>
    <!-------------------------------------------END OF FILTER FOR MEMBERS SAVINGS NON TREASURER-------------------------------------------------->

    <!----------------------------------------------FILTER HEADER FOR MEMBERS SAVINGS TREASURER--------------------------------------------------->
    <div
      :class="$q.screen.lg ? 'row q-pa-sm' : 'row q-gutter-sm q-px-sm'"
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
        :size="$q.platform.is.mobile ? 'sm' : 'md'"
      >
      </q-btn>
      <q-space />
      <q-btn
        :label="$t('app.print')"
        :loading="getDownloadLoadingState"
        :color="'positive'"
        :disabled="getDisableDownloadBtn"
        no-caps
        icon-right="print"
        @click="downloadMembersSavings"
        :size="$q.platform.is.mobile ? 'sm' : 'md'"
      ></q-btn>
    </div>
    <!---------------------------------------------END OF FILTER FOR MEMBERS SAVINGS TREASURER---------------------------------------------------->
    <!----------------------------------------------FILTER HEADER FOR MEMBER SAVINGS-------------------------------------------------------------->
    <div
      :class="$q.screen.lg ? 'row q-pa-sm' : 'col q-gutter-sm q-px-sm'"
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
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
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
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.platform.is.desktop ? 'q-pl-md' : ''"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              {{ $t("app.noResults") }}</q-item-section
            >
          </q-item>
        </template>
      </q-select>
      <div
        class="col-md-6 col-lg-6 col-xs-12 col-sm-12 flex"
        :class="$q.platform.is.desktop ? 'q-pl-md' : ''"
      >
        <q-btn
          :label="$t('app.filter')"
          :color="'primary'"
          :disabled="validateFilterMemberSavings"
          no-caps
          icon-right="filter_list"
          @click="filterMemberSavings"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.print')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="print"
          @click="downloadMemberSavings"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        ></q-btn>
      </div>
    </div>
    <!----------------------------------------------END OF FILTER HEADER FOR MEMBER SAVINGS------------------------------------------------------->

    <!----------------------------------------------FILTER HEADER FOR INCOME ACTIVITIES----------------------------------------------------------->
    <div
      :class="$q.screen.lg ? 'row q-pa-sm' : 'col q-gutter-sm q-px-sm'"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_income_activity"
    >
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
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
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
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.platform.is.desktop ? 'q-pl-sm' : ''"
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
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.platform.is.desktop ? 'q-pl-sm' : ''"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              {{ $t("app.noResults") }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <div
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12 flex"
        :class="$q.platform.is.desktop ? 'q-pl-sm' : ''"
      >
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterIncomeActivity"
          no-caps
          icon-right="filter_list"
          @click="filterIncomeActivity"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.print')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="print"
          @click="downloadIncomeActivity"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        ></q-btn>
      </div>
    </div>
    <!----------------------------------------------END OF FILTER HEADER FOR INCOME ACTIVITIES---------------------------------------------------->

    <!--------------------------------------------FILTER HEADER FOR VIEW MEMBER CONTRIBUTIONS---------------------------------------------------->
    <div
      :class="$q.screen.lg ? 'row q-pa-sm' : 'col q-gutter-sm q-px-xs'"
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
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
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
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.platform.is.desktop ? 'q-pl-md' : ''"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              {{ $t("app.noResults") }}</q-item-section
            >
          </q-item>
        </template>
      </q-select>
      <div
        class="col-md-6 col-lg-6 col-xs-12 col-sm-12 flex"
        :class="$q.platform.is.desktop ? 'q-pl-md' : ''"
      >
        <q-btn
          :label="$t('app.filter')"
          :color="'primary'"
          :disabled="validateFilterMemberContribution"
          no-caps
          icon-right="filter_list"
          @click="filterMemberContribution"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.print')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="print"
          @click="downloadMemberContribution"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        ></q-btn>
      </div>
    </div>
    <!--------------------------------------------END OF FILTER HEADER FOR VIEW MEMBER CONTTRIBUTION--------------------------------------------->

    <!--------------------------------------------FILTER HEADER FOR SPONSORSHIP----------------------------------------------------------------->
    <div
      :class="$q.screen.lg ? 'row q-pa-sm' : 'col q-gutter-sm q-px-sm'"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_sponsorship"
    >
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
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
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
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
        :class="$q.platform.is.desktop ? 'q-pl-md' : ''"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              {{ $t("app.noResults") }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <div
        class="col-md-6 col-lg-6 col-xs-12 col-sm-12 flex"
        :class="$q.platform.is.desktop ? 'q-pl-md' : ''"
      >
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterSponsorship"
          no-caps
          icon-right="filter_list"
          @click="filterSponsorship"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        >
        </q-btn>
        <q-space />
        <q-btn
          :label="$t('app.print')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="print"
          @click="downloadSponsorship"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
        ></q-btn>
      </div>
    </div>
    <!--------------------------------------------END OF FILTER HEADER FOR SPONSORSHIP---------------------------------------------------------->

    <!--------------------------------------------FILTER HEADER FOR REPORTS--------------------------------------------------------------------->
    <div
      :class="$q.screen.lg ? 'row q-pa-sm' : 'col q-gutter-sm q-px-sm'"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_report"
    >
      <div
        class="col-md-4 col-lg-4 col-xs-12 col-sm-12"
        :class="$q.screen.lg ? 'q-pr-md' : ''"
      >
        <q-select
          v-model="report_option"
          outlined
          dense
          :options="getReportGenerationOptions"
          :label="$t('app.selectOptionGenerateReport')"
          @input="selectedReportOption"
          clearable
        />
      </div>
      <div
        class="col-md-4 col-lg-4 col-xs-12 col-sm-12"
        :class="$q.screen.lg ? 'q-pr-md' : ''"
      >
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
        class="col-md-2 col-lg-2 col-xs-12 col-sm-12"
        :class="$q.screen.lg ? 'q-pr-md' : ''"
      >
        <q-btn
          :label="$t('app.generateReport')"
          color="primary"
          @click="generateReport"
          no-caps
          class="full-width"
          :disabled="validateGenerateReport"
          :loading="false"
        >
        </q-btn>
      </div>
      <div
        class="button q-pb-xs col-md-2 col-lg-2 col-xs-12 col-sm-12 flex justify-end"
      >
        <q-btn
          :label="$t('app.print')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDownloadLoadingState"
          no-caps
          icon-right="print"
          @click="downloadReport"
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
  },

  mixins: [CurrentYearMixin, PaymentItemMixinVue, MonthsMixinVue],

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
      genders: ["MALE", "FEMALE", "ALL", "OTHER"],
      registrationStatuses: [
        "REGISTERED",
        "NOT_REGISTERED",
        "PENDING",
        "DECLINED",
        "ALL",
        "ACTIVE",
        "IN_ACTIVE",
      ],
      is_compulsory: "",
      type: "",
      frequency: "",
      state: "",
      statuses: [
        { label: this.$t("app.compulsory"), value: 1 },
        { label: this.$t("app.notCompulsory"), value: 0 },
        { label: this.$t("app.all"), value: "ALL" },
      ],
      states: [
        {
          label: this.$t("app.active"),
          value: "active",
        },
        {
          label: this.$t("app.expired"),
          value: "expired",
        },
        {
          label: this.$t("app.all"),
          value: "ALL",
        },
      ],
      payment_item_types: [
        "ALL_MEMBERS",
        "A_MEMBER",
        "MEMBERS_WITH_ROLES",
        "MEMBERS_WITHOUT_ROLES",
        "GROUPED_MEMBERS",
        "ALL",
      ],
      frequencies: ["YEARLY", "MONTHLY", "ONE_TIME", "ALL"],
      payment_item_id: "",
      start_payment_item_select_filtering: false,
      payment_statuses: ["PENDING", "APPROVED", "DECLINED", "ALL"],
      payment_status: "",
      filtered_payment_items: [],
      month: "",
      start_month_filtering: false,
      monthsOptions: [],
      transaction_statuses: ["INCOMPLETE", "COMPLETED", "ALL"],
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
    };
  },

  computed: {
    validateFilterMembers() {
      return (
        (this.has_register === "" || this.has_register === null) &&
        (this.year === "" || this.year === null) &&
        (this.gender === "" || this.gender === null)
      );
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
        this.is_compulsory === "" &&
        this.frequency === "" &&
        this.type === "" &&
        this.state === ""
      );
    },

    validateFilterExpenditureItems() {
      return this.payment_item_id === null || this.payment_item_id === "";
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
      return this.payment_item_id === null;
    },

    validateFilterMemberContribution() {
      return (
        (this.payment_status === null || this.payment_status === "") &&
        (this.transaction_status === null || this.transaction_status === "")
      );
    },

    validateFilterSponsorship() {
      return this.payment_item_id === null;
    },

    getReportGenerationOptions() {
      let data = [];
      data.push(
        { label: this.$t("app.reportByPaymentItem"), value: 1 },
        { label: this.$t("app.reportByQuarter"), value: 2 },
        { label: this.$t("app.reportByYear"), value: 3 }
      );

      return data;
    },

    validateGenerateReport() {
      return this.report_option == "" || this.group == "";
    },
  },

  methods: {
    filterMembers() {
      let payload = {
        year: this.year !== null && this.year !== "" ? this.year : "",
        has_register: this.has_register,
        gender: this.gender !== null && this.gender !== "" ? this.gender : "",
      };

      this.$emit("filter-members", payload);
    },
    downloadMembers() {
      let payload = {
        year: this.year !== null && this.year !== "" ? this.year : "",
        has_register: this.has_register,
        gender: this.gender !== null && this.gender !== "" ? this.gender : "",
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
            ? this.is_compulsory
            : "",
        frequency:
          this.frequency !== null && this.frequency !== ""
            ? this.frequency
            : "",
        type: this.type !== null && this.type !== "" ? this.type : "",
        state: this.state !== null && this.state !== "" ? this.state : "",
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
            ? this.is_compulsory
            : "",
        frequency:
          this.frequency !== null && this.frequency !== ""
            ? this.frequency
            : "",
        type: this.type !== null && this.type !== "" ? this.type : "",
        state: this.state !== null && this.state !== "" ? this.state : "",
      };

      this.$emit("download-payment-items", payload);
    },

    downloadExpenditureItems() {
      let payload = {
        payment_item_id:
          this.payment_item_id !== null && this.payment_item_id !== ""
            ? this.payment_item_id
            : "",
        year: this.year !== null && this.year !== "" ? this.year : "",
        payment_status:
          this.payment_status !== null && this.payment_status !== ""
            ? this.payment_status
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
        payment_status:
          this.payment_status !== null && this.payment_status !== ""
            ? this.payment_status
            : "",
      };

      this.$emit("filter-expenditure-items", payload);
    },

    filterItemDetails() {
      this.$emit("filter-expenditure-item-details", {
        payment_status: this.payment_status,
      });
    },

    downloadExpenditureItemDetails() {
      this.$emit("download-expenditure-item-details", {
        payment_status: this.payment_status,
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
        payment_status: this.payment_status,
      });
    },

    downloadMemberSavings() {
      this.$emit("download-member-savings", {
        month: this.year,
        payment_status: this.payment_status,
      });
    },

    filterIncomeActivity() {
      let payload_data = {
        payment_item_id: this.payment_item_id,
        month: this.month,
        status: this.payment_status,
      };
      this.$emit("filter-income-activity", payload_data);
    },

    downloadIncomeActivity() {
      let payload = {
        payment_item_id: this.payment_item_id,
        month: this.month,
        status: this.payment_status,
      };

      this.$emit("download-income-activity", payload);
    },

    filterMemberContribution() {
      let payload = {
        payment_status: this.payment_status,
        transaction_status: this.transaction_status,
      };

      this.$emit("filter-member-contribution", payload);
    },

    downloadMemberContribution() {
      let payload = {
        payment_status: this.payment_status,
        transaction_status: this.transaction_status,
      };

      this.$emit("download-member-contribution", payload);
    },

    filterSponsorship() {
      let payload_data = {
        payment_item_id: this.payment_item_id,
        payment_status: this.payment_status,
      };

      this.$emit("filter-sponsorship", payload_data);
    },

    downloadSponsorship() {
      let payload_data = {
        payment_item_id: this.payment_item_id,
        payment_status: this.payment_status,
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
  },
};
</script>

<style lang="scss" scoped></style>
