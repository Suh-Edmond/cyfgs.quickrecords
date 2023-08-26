<template>
  <q-page>
    <div>
      <!-- header for filter sponsors -->
      <div
        class="row q-ml-xs q-pt-xs"
        :class="$q.screen.lg ? 'q-pa-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <q-select
            v-model="payment_item_id"
            outlined
            dense
            :options="payment_items"
            :label="$t('app.searchPaymentItem')"
            input-debounce="0"
            use-input
            clearable
            @filter="filterPaymentItems"
            @input="stopSearch"
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
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12 q-pl-md">
          <q-select
            v-model="status"
            outlined
            dense
            :options="statuses"
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
        <div class="col-md-6 col-lg-6 col-xs-12 col-sm-12 flex q-pl-md">
          <div>
            <q-btn
              :label="$t('app.filter')"
              color="primary"
              :disabled="validateFilter"
              no-caps
              icon-right="filter_list"
              @click="filterSponsorship"
              :loading="is_fetching"
            >
            </q-btn>
          </div>
          <q-space />
          <div class="button q-pb-xs">
            <q-btn
              :label="$t('app.print')"
              :loading="loading_download"
              color="positive"
              :disabled="validateDownload"
              no-caps
              icon-right="print"
              @click="downloadSponsorship"
            ></q-btn>
          </div>
        </div>
      </div>
      <!-- table for support activities -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <SponsorshipTable
            :columns="columns"
            :data="getData"
            :title="setTableTitle"
            :message="message"
            :total="getTotalSponsorship"
            :pagination="pagination"
            :table_loading="table_loader"
            @view-sponsorship="viewSponsorship"
            @edit-sponsorship="editSponsorship"
            @onRequest="onRequest"
          >
          </SponsorshipTable>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import SponsorshipTable from "src/components/SponsorshipTable.vue";
import PaymentItemMixin from "src/mixins/PaymentItemMixin.vue";
import SponsorshipMixin from "src/mixins/SponsorshipMixin.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";

export default {
  mixins: [PaymentItemMixin, SponsorshipMixin, HelperMixin],

  mounted() {
    let page = 1;
    let per_page = 7;
    let payment_item_id = "";
    let status = "";
    this.getAllSponsorships(page, per_page, payment_item_id, status);
    this.fetchPaymentActivities();
    this.getPaymentActivitiesFromStatus();
  },

  data() {
    return {
      statuses: ["PENDING", "APPROVED", "DECLINED", "ALL"],
      status: "",
      columns: [
        {
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
        },
        {
          name: "supporter",
          required: true,
          label: "Sponsor",
          align: "left",
          field: "supporter",
        },
        {
          name: "amount_deposited",
          align: "left",
          label: "Amount Deposited(XAF)",
          field: "amount_deposited",
        },
        {
          name: "approve",
          align: "left",
          label: "Transaction Status",
          field: "approve",
          sortable: true,
        },
        {
          name: "action",
          label: "Action",
          field: "action",
          align: "left",
        },
      ],
      label: this.$t("app.delete"),
      message: this.$t("app.deleteSponsorshipWarningMsg"),
      loading_download: false,
      payment_item_id: null,
      payment_items: [],
      start_filtering: false,
      is_fetching: false,
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 7,
        rowsNumber: 0,
      },
      table_loader: false,
    };
  },
  computed: {
    validateFilter() {
      return this.payment_item_id === null;
    },

    validateDownload() {
      return this.getData.length == 0;
    },

    getTotalSponsorship() {
      return this.$store.getters.getSponsorships !== null
        ? this.$store.getters.getSponsorships.total
        : 0;
    },

    setTableTitle() {
      return this.payment_item_id !== null && this.payment_item_id !== " "
        ? this.$t("app.partSponsorshipTitle") + this.payment_item_id.label
        : "";
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getData() {
      let data = [];
      if (this.$store.getters.getSponsorships !== null) {
        this.$store.getters.getSponsorships.data.forEach((ele) => {
          data.push({
            counter: this.$store.getters.getSponsorships.data.indexOf(ele) + 1,
            supporter: ele.supporter,
            amount_deposited: ele.amount_deposited,
            code: ele.code,
            approve: ele.approve,
            id: ele.id,
            payment_item: ele.payment_item,
            created_at: ele.created_at,
            updated_at: ele.updated_at,
            updated_by: ele.updated_by,
            comment: ele.comment,
          });
        });
      }
      return data;
    },
  },
  methods: {
    getAllSponsorships(page, per_page, payment_item, status, is_filtering) {
      let payment_item_id =
        payment_item !== null && payment_item !== "" ? payment_item.value : "";
      let status_value = status !== "" && status !== "" ? status : "";
      let payload = {
        status: "none",
        url: `/api/protected/sponsorships?page=${page}&per_page=${per_page}&payment_item_id=${payment_item_id}&status=${status_value}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "SET_SPONSORSHIPS",
        has_commit: true,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.commit("SET_SPONSORSHIPS", null);
      this.table_loader = true;
      this.is_fetching = is_filtering;
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.pagination.rowsNumber = response.data.total;
          this.pagination.page = response.data.current_page;
          this.pagination.rowsPerPage = response.data.per_page;
        })
        .finally(() => {
          this.is_fetching = false;
          this.table_loader = false;
        });

      return this.is_fetching;
    },

    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;
      this.$store.commit("SET_SPONSORSHIPS", null);

      this.getAllSponsorships(
        page,
        fetch_count,
        this.payment_item_id,
        this.status,
        false
      );
    },

    filterSponsorship() {
      let payment_item =
        this.payment_item_id !== "" && this.payment_item_id !== null
          ? this.payment_item_id
          : "";
      let status_value =
        this.status !== "" && this.status !== null ? this.status : "";
      this.$router.push({
        path: `/dashboard/sponsorship?payment_item=${payment_item.label}&status=${status_value}`,
        query: {
          payment_item: payment_item.label,
          status: this.status,
          t: new Date().getTime(),
        },
      });
      let page = 1;
      let per_page = 7;
      this.getAllSponsorships(
        page,
        per_page,
        this.payment_item_id,
        this.status,
        true
      );
    },

    downloadSponsorship() {
      let payment_item_value =
        this.payment_item_id !== null && this.payment_item_id !== ""
          ? this.payment_item_id.value
          : "";
      let payment_item_name =
        this.payment_item_id !== null && this.payment_item_id !== ""
          ? this.payment_item_id.label
          : "";
      let status_value =
        this.status !== null && this.status !== "" ? this.status : "";
      let url = `/api/protected/sponsorships/download?payment_item_id=${payment_item_value}&status=${status_value}&per_page=&payment_item_label=${payment_item_name}`;
      let file_name = "Sponsorships.pdf";
      this.loading_download = this.downloadPdf(url, file_name);
    },

    viewSponsorship(data) {
      this.$emit("view-sponsorship", data);
    },

    editSponsorship(data) {
      this.$emit("edit-sponsorship", data);
    },

    filterPaymentItems(val, update, abort) {
      if (val < 2) {
        this.start_filtering = false;
        abort();
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.payment_items = this.getPaymentActivitiesFromStatus().filter(
          (item) => item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.payment_items;
      });
    },

    getPaymentActivitiesFromStatus() {
      this.payment_items = [];
      this.$store.getters.getPaymentActivities.forEach((ele) => {
        this.payment_items.push({
          label: ele.name,
          value: ele.id,
          amount: ele.amount,
        });
      });
      return this.payment_items;
    },

    stopSearch() {
      if (this.payment_item_id != null) {
        this.start_filtering = false;
      }
    },
  },
  components: {
    SponsorshipTable,
  },
};
</script>

<style lang="scss" scoped></style>
