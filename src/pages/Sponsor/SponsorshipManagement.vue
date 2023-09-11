<template>
  <q-page>
    <div>
      <!-- header for filter sponsors -->
      <FilterComponentVue
        :show_sponsorship="true"
        :loading_download="loading_download"
        :disable_download_btn="validateDownload"
        @filter-sponsorship="filterSponsorship"
        @download-sponsorship="downloadSponsorship"
      >
      </FilterComponentVue>
      <!-- table for support activities -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <SponsorshipTable
            :columns="columns"
            :data="getData"
            :title="setTableTitle"
            :message="message"
            :total="getTotalSponsorship"
            :pagination="getPagination"
            :table_loading="getLoadingState"
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
import FilterComponentVue from "src/components/FilterComponent.vue";

export default {
  mixins: [PaymentItemMixin, SponsorshipMixin, HelperMixin],
  beforeMount(){
    this.$store.commit("SET_PAGINATION", {
      sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 7,
      rowsNumber: 0,
    });
  },


  mounted() {
    let page = 1;
    let per_page = 7;
    let payment_item_id = "";
    let status = "";
    this.getAllSponsorships(page, per_page, payment_item_id, status);
  },

  data() {
    return {
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
    };
  },
  computed: {
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

    getPagination() {
      let paginate_object = {
        sortBy: this.$store.getters.getPagination.sortBy,
        descending: this.$store.getters.getPagination.descending,
        page: this.$store.getters.getPagination.page,
        rowsPerPage: this.$store.getters.getPagination.rowsPerPage,
        rowsNumber: this.$store.getters.getPagination.rowsNumber,
      };

      return paginate_object;
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
      let payment_item_id = payment_item !== "" ? payment_item.value : "";
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
      this.$store.commit("SET_IS_FETCHING", true);
      this.is_fetching = is_filtering;
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          this.$store.commit("SET_PAGINATION", {
            sortBy: "name",
            descending: false,
            page: response.data.current_page,
            rowsPerPage: response.data.per_page,
            rowsNumber: response.data.total,
          });
        })
        .finally(() => {
          this.is_fetching = false;
          this.$store.commit("SET_IS_FETCHING", false);
        });

      return this.is_fetching;
    },

    onRequest(props) {
      const { page, rowsPerPage } = props.pagination;
      const fetch_count =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;

      this.getAllSponsorships(
        page,
        fetch_count,
        this.payment_item_id,
        this.status,
        false
      );
    },

    filterSponsorship(data) {
      let payment_item_name =
        data.payment_item_id !== "" ? data.payment_item_id.label : "";
      this.$router.push({
        path: `/dashboard/sponsorship?payment_item=${payment_item_name}&status=${data.payment_status}`,
        query: {
          payment_item: payment_item_name,
          status: data.payment_status,
          t: new Date().getTime(),
        },
      });
      this.setSearchVariables(data);
      let page = 1;
      let per_page = 7;
      this.getAllSponsorships(
        page,
        per_page,
        data.payment_item_id,
        data.payment_status,
        true
      );
    },

    downloadSponsorship(data) {
      let payment_item_value =
        data.payment_item_id !== null && data.payment_item_id !== ""
          ? data.payment_item_id.value
          : "";
      let payment_item_name =
        data.payment_item_id !== null && data.payment_item_id !== ""
          ? data.payment_item_id.label
          : "";
      let status_value =
        data.payment_status !== null && data.payment_status !== ""
          ? data.payment_status
          : "";
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

    setSearchVariables(data) {
      this.payment_item_id = data.payment_item_id;
      this.status = data.payment_status;
    },
  },
  components: {
    SponsorshipTable,
    FilterComponentVue,
  },
};
</script>

<style lang="scss" scoped></style>
