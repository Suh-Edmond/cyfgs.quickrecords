<template>
  <div class="q-pa-sm">
    <!-- spinner when fetching data -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-lg"
        v-if="getLoadingState"
      />
    </div>


      <!-- report details available -->
    <div>
      <div
        class="row q-ml-xs q-pt-md justify-between"
        :class="$q.screen.lg ? 'q-pa-md' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div>
          <q-btn
            label="Filter"
            color="primary"
            :disabled="false"
            no-caps
            icon-right="filter_list"
            @click="openReportBar()"
          >
          </q-btn>
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn
            label="Print"
            :loading="loading"
            color="positive"
            :disabled="data.length == 0"
            no-caps
            icon-right="print"
            @click="downloadContributions()"
          ></q-btn>
        </div>
      </div>
      <!-- table for contributions -->
      <div class="row q-pt-sm">
        <div class="col-md-12 col-xs-12 col-sm-12">
          <ReportsTable :data="data" :columns="columns" :title="title">

          </ReportsTable>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import ReportsTable from "src/components/ReportsTable.vue";

export default {

  mounted() {
  },

  data() {
    return {
      payment_item_id: null,
      loading: false,
      columns: [
        {
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
        },
        {
          name: "description",
          required: true,
          label: "Description",
          align: "left",
          field: (row) => row.description,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "amount",
          align: "left",
          label: "Amount Deposited (XAF)",
          field: "amount",
        },
      ],
      data: [],
      title: "Report for Annual Rally 2022 at Buea Town",
    };
  },
  computed: {
    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },


  methods: {

    openReportBar() {
      let payload = {
        data: null,
        tab: "Generate Reports",
      };

      this.$emit("report-generation", payload);
    },

    downloadContributions() {
      let payment_item_id = this.$store.getters.getSearchSavingParams.payment_item_id.id;
      let month = this.$store.getters.getSearchSavingParams.month;
      let year = this.$store.getters.getSearchSavingParams.year;
      let status = this.$store.getters.getSearchSavingParams.status
      let url = `/api/protected/download-contributions?payment_item_id=${payment_item_id}&month=${month}&year=${year}&status=${status}`;

      let file_name = "Member's Contribution for "+this.$store.getters.getSearchSavingParams.payment_item_id.name +".pdf";
      this.loading = this.downloadPdf(url, file_name);
    },
  },
  components: {
    ReportsTable,
  },
};
</script>

<style lang="scss" scoped></style>
