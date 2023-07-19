<template>
  <q-page>
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-lg"
        v-if="getLoadingState"
      />
    </div>

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
                <q-item-section class="text-grey"> {{$t('app.noResults')}} </q-item-section>
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
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> {{$t('app.noResults')}} </q-item-section>
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
              :loading="loading"
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
            @view-sponsorship="viewSponsorship"
            @edit-sponsorship="editSponsorship"
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
    this.fetchPaymentActivities();
    this.getPaymentActivitiesFromStatus();
    this.getAllSponsorships();
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
          align: "center",
        },
      ],
      label: this.$t('app.delete'),
      message: this.$t('app.deleteSponsorshipWarningMsg'),
      loading: false,
      payment_item_id: null,
      payment_items: [],
      start_filtering: false,
      is_fetching: false,
    };
  },
  computed: {
    validateFilter() {
      return this.payment_item_id != null ? false : true;
    },

    validateDownload() {
      return this.getData.length == 0;
    },

    getTotalSponsorship() {
      let total = 0;
      this.$store.getters.getSponsorships.forEach((ele) => {
        total += parseFloat(ele.amount_deposited);
      });
      return total;
    },

    setTableTitle() {
      return this.$store.getters.getSponsorships.length > 0
        ? this.$t('app.partSponsorshipTitle') + `${this.$store.getters.getSponsorships[0].payment_item.name}`
        : "";
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
    getData() {
      let data = [];
      this.$store.getters.getSponsorships.forEach((ele) => {
        data.push({
          counter: this.$store.getters.getSponsorships.indexOf(ele) + 1,
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
      return data;
    },
  },
  methods: {
    filterSponsorship() {
      let payload = {
        status: "none",
        url: `/api/protected/sponsorships/search?payment_item_id=${this.payment_item_id.value}&status=${this.status}`,
        has_path_val: true,
        show_feedback: false,
        show_spinner: true,
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
      this.is_fetching = true;
      this.$store.dispatch("getRequest", payload).then(() => {
        this.is_fetching = false;
      });
    },

    downloadSponsorship() {
      let value =
        this.payment_item_id != null ? this.payment_item_id.value : "";
      let url = `/api/protected/sponsorships/download?payment_item_id=${value}&status=${this.status}`;
      let file_name = "Sponsorships.pdf";
      this.loading = this.downloadPdf(url, file_name);
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

    stopSearch(){
      if(this.payment_item_id != null) {
        this.start_filtering = false
      }
    }
  },
  components: {
    SponsorshipTable,
  },
};
</script>

<style lang="scss" scoped></style>
