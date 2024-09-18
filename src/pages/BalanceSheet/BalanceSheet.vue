<template>
  <div class="q-mb-xl">
    <div
      class="flex justify-between q-pa-xs q-mb-md"
      :style="
        $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
      "
      v-if="show_hint"
    >
      <div class="hint_text_color q-pt-sm q-pl-sm">
        {{ $t("app.balanceSheetHint") }}
      </div>
      <div>
        <q-btn
          flat
          round
          class="close_color"
          icon="close"
          @click="closeHint"
          size="sm"
        />
      </div>
    </div>

    <FilterComponentVue
      :show_report="false"
      :show_balance_sheet="true"
      :loading_download="loading_download"
      :disable_download_btn="validateDownloadBtn"
      @generate-balance-sheet="onGenerateBalanceSheet"
      @download-balance-sheet="onDownloadBalanceSheet"
    >
    </FilterComponentVue>

    <div class="flex flex-center q-mt-lg" v-if="getLoadingState">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-if="$q.platform.is.desktop">
      <BalanceSheetTable
        :heading="setTableHeader"
        :data="balance_sheet_data"
        v-if="show_balance_sheet && !getLoadingState"
      ></BalanceSheetTable>
    </div>
    <div v-if="$q.platform.is.mobile">
      <div
        class="flex justify-between q-pa-xs q-mb-md"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div class="hint_text_color q-pt-sm q-pl-sm">
          {{ $t("app.balanceSheetHintMsgMobile") }}
        </div>
        <div>
          <q-btn
            flat
            round
            class="close_color"
            icon="close"
            @click="closeHint"
            size="sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilterComponentVue from "src/components/FilterComponent.vue";
import BalanceSheetTable from "../../components/BalanceSheetTable.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";
export default {
  mixins: [HelperMixin],
  data() {
    return {
      loading_download: false,
      show_hint: true,
      heading: "",
      balance_sheet_data: null,
      show_balance_sheet: false,
      selected_session: null,
    };
  },
  computed: {
    validateDownloadBtn() {
      return false;
    },

    setTableHeader() {
      return this.$t("app.balancesheetheading") + this.selected_session.label;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },

  methods: {
    closeHint() {
      return (this.show_hint = !this.show_hint);
    },
    onGenerateBalanceSheet(data) {
      this.selected_session = data.session;
      let payload = {
        status: "none",
        url: `/api/protected/organisation/year/balance_sheet?organisation_id=${data.organisation_id}&session_id=${data.session.value}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "",
        has_commit: false,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: null,
        },
      };
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          if (res.success) {
            this.balance_sheet_data = res.data;
            this.show_balance_sheet = true;
          }
        })
        .finally(() => {
          this.$store.commit("SET_IS_FETCHING", false);
        });

      return this.balance_sheet_data;
    },

    onDownloadBalanceSheet(payload) {
      let url = `/api/protected/organisation/year/balance_sheet/download?organisation_id=${payload.organisation_id}&session_id=${payload.session.value}&year=${payload.session.label}`;
      this.loading_download = this.downloadPdf(url, "Balance_Sheet.pdf");
      return this.loading_download;
    },
  },

  components: {
    FilterComponentVue,
    BalanceSheetTable,
  },
};
</script>

<style scoped lang="scss"></style>
