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
    <!-- not found -->
    <NotFound
      :message="not_found_msg"
      v-if="getData.length == 0 && !getLoadingState"
    ></NotFound>

    <div v-if="getData.length > 0 && !getLoadingState">
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
            label="Search payment item..."
            input-debounce="0"
            use-input
            clearable
            @filter="filterPaymentItems"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
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
            label="Select status"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-md-6 col-lg-6 col-xs-12 col-sm-12 flex q-pl-md">
          <div>
            <q-btn
              label="Filter"
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
              label="Print"
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
import NotFound from "src/components/NotFound.vue";

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
      label: "Delete",
      message: "Are you sure you want to delete this Sponsorship ?",
      loading: false,
      payment_item_id: null,
      payment_items:[],
      start_filtering:false,
      is_fetching:false,
      not_found_msg:"Ooops!! No Sponsorship has been record for any Activity or Item for this Session.Click the add button to add Sponsorhip",
    };
  },
  computed: {
    validateFilter() {
      return this.payment_item_id != null ? false : true;
    },

    validateDownload(){
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
        ? `Sponsorships for ${this.$store.getters.getSponsorships[0].payment_item.name}`
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
            comment:ele.comment
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
      this.is_fetching = true
      this.$store.dispatch("getRequest", payload).then(() => {
        this.is_fetching = false;
      })

    },

    downloadSponsorship() {
      let value = this.payment_item_id != null ? this.payment_item_id.value : "";
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
        this.payment_items = this.getPaymentActivitiesFromStatus().filter((item) =>
          item.label.toLowerCase().includes(val.toLowerCase())
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
  },
  components: {
    SponsorshipTable,
    NotFound
  },
};
</script>

<style lang="scss" scoped></style>
