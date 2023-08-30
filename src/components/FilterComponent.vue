<template>
  <div class="q-pa-xs">
    <!---------------------------------------------MEMBER MANAGEMENT FILTERS----------------------------------------------->
    <div
      class="row q-ml-xs"
      :class="$q.screen.lg ? 'q-pa-sm' : ''"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_member_filters"
    >
      <div
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
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
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
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
        class="col-md-3 col-lg-3 col-xs-12 col-sm-12"
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
        <div :class="$q.screen.lg ? 'q-pr-md' : ''">
          <q-btn
            :label="$t('app.filter')"
            color="primary"
            :disabled="validateFilterMembers"
            @click="filterMembers"
            no-caps
            icon-right="filter_list"
          >
          </q-btn>
        </div>
        <q-space />
        <div>
          <q-btn
            :label="$t('app.print')"
            :loading="getDownloadLoadingState"
            color="positive"
            :disabled="getDisableDownloadBtn"
            no-caps
            icon-right="print"
            @click="downloadMembers"
          ></q-btn>
        </div>
      </div>
    </div>
    <!---------------------------------------------END OF MEMBER MANAGEMENT FILTERS---------------------------------------->

    <!---------------------------------------------PAYMENT AND EXPENDITURE CATEGORIES FILTERS------------------------------->
    <div
      class="row q-ml-xs q-pt-xs"
      :class="$q.screen.lg ? 'q-pa-sm' : ''"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_categories"
    >
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
        <q-select
          v-model="year"
          outlined
          dense
          :options="getSessionsFromState"
          clearable
          :label="$t('app.selectYearLabel')"
        />
      </div>
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-ml-md">
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterCategories"
          @click="filterCategories"
          no-caps
          icon-right="filter_list"
        >
        </q-btn>
      </div>
      <q-space />
      <div class="button q-pb-xs">
        <q-btn
          :label="$t('app.print')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="print"
          @click="downloadCategories"
        ></q-btn>
      </div>
    </div>
    <!---------------------------------------------END OF PAYMENT AND EXPENDITURE CATEGORIES FILTERS------------------------>

    <!-------------------------------------------------HEADER FILTER FOR PAYMENT ITEMS------------------------------------->
    <div
      class="row q-ml-xs"
      :class="$q.screen.lg ? 'q-pa-sm' : ''"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_filter_payment_items"
    >
      <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12">
        <q-select
          v-model="is_compulsory"
          outlined
          dense
          :options="statuses"
          :label="$t('app.selectStatusLabel')"
          clearable
        />
      </div>
      <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 q-pl-sm">
        <q-select
          v-model="type"
          outlined
          dense
          :options="payment_item_types"
          :label="$t('app.selectPaymentType')"
          clearable
        />
      </div>
      <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 q-pl-sm">
        <q-select
          v-model="frequency"
          outlined
          dense
          :options="frequencies"
          :label="$t('app.selectFrequency')"
          clearable
        />
      </div>
      <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 q-pl-sm">
        <q-select
          v-model="state"
          outlined
          dense
          :options="states"
          clearable
          :label="$t('app.selectState')"
        />
      </div>
      <div class="col-md-4 col-lg-4 col-xs-12 col-sm-12 flex q-pl-sm">
        <div>
          <q-btn
            :label="$t('app.filter')"
            color="primary"
            :disabled="validateFilterPaymentItem"
            @click="filterPaymentItems"
            no-caps
            icon-right="filter_list"
          >
          </q-btn>
        </div>
        <q-space />
        <div>
          <q-btn
            :label="$t('app.print')"
            :loading="getDownloadLoadingState"
            color="positive"
            :disabled="getDisableDownloadBtn"
            no-caps
            icon-right="print"
            @click="downloadPaymentItems"
          ></q-btn>
        </div>
      </div>
    </div>
    <!------------------------------------------------END OF FILTER HEADER PAYMENT  ITEM------------------------------------------>

    <!-----------------------------------------------HEADER FILTER FOR EXPENDITURE ITEMS------------------------------------------->
    <div
      class="row q-ml-xs q-pt-xs"
      :class="$q.screen.lg ? 'q-pa-sm' : ''"
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
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-pl-md">
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
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-pl-md">
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
      <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 flex q-pl-md">
        <div>
          <q-btn
            :label="$t('app.filter')"
            color="primary"
            :disabled="validateFilterExpenditureItems"
            no-caps
            icon-right="filter_list"
            @click="filterExpenditureItems"
          >
          </q-btn>
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn
            :label="$t('app.print')"
            :loading="getDownloadLoadingState"
            color="positive"
            :disabled="getDisableDownloadBtn"
            no-caps
            icon-right="print"
            @click="downloadExpenditureItems"
          ></q-btn>
        </div>
      </div>
    </div>
    <!-----------------------------------------------END HEADER FILTER FOR EXPENDITURE ITEMS--------------------------------------->

    <!----------------------------------------------HEADER FILTER FOR EXPENDITURE ITEM DETAILS-------------------------------------->
    <div
      class="row q-ml-xs q-pt-xs"
      :class="$q.screen.lg ? 'q-pa-sm' : ''"
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
      <div class="q-pl-lg col-md-3 col-lg-3 col-xs-12 col-sm-12">
        <q-btn
          :label="$t('app.filter')"
          color="primary"
          :disabled="validateFilterExpenditureItem"
          no-caps
          icon-right="filter_list"
          @click="filterItemDetails"
        >
        </q-btn>
      </div>
      <q-space />
      <div class="button q-pb-xs">
        <q-btn
          :label="$t('app.print')"
          :loading="getDownloadLoadingState"
          color="positive"
          :disabled="getDisableDownloadBtn"
          no-caps
          icon-right="print"
          @click="downloadExpenditureItemDetails"
        ></q-btn>
      </div>
    </div>
    <!---------------------------------------------END OF FILTER FOR EXPENDITURE ITEM DETAILS--------------------------------------->
  </div>
</template>

<script>
import CurrentYearMixin from "src/mixins/CurrentYearMixin.vue";
import PaymentItemMixinVue from "src/mixins/PaymentItemMixin.vue";
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

    show_filter_expenditure_items_details: {
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
  },

  mixins: [CurrentYearMixin, PaymentItemMixinVue],

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
  },

  methods: {
    filterMembers() {
      let payload = {
        year: this.year !== null && this.year !== "" ? this.year : "",
        has_register: this.has_register,
        gender: this.gender,
      };

      this.$emit("filter-members", payload);
    },
    downloadMembers() {
      let payload = {
        year: this.year,
        has_register: this.has_register,
        gender: this.gender,
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

    searchPaymentItems(val, update, abort) {
      const all_payment_items = this.getAllPaymentItemsFromStore();
      if (val < 1) {
        this.start_payment_item_select_filtering = false;
        abort();
        return;
      }

      update(() => {
        this.start_payment_item_select_filtering = true;
        this.filtered_payment_items = all_payment_items.filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.filtered_payment_items;
      });
    },

    stopSelectInputSearch() {
      if (this.payment_item_id !== null) {
        this.start_payment_item_select_filtering = false;
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
  },
};
</script>

<style lang="scss" scoped></style>
