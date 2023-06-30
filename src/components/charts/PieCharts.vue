<template>
  <div class="q-pa-md">
    <q-card flat>
      <q-card-section>
        <Doughnut
          :chart-options="chartOptions"
          :chart-data="chartData"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
        ></Doughnut>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
import organisationMixinVue from 'src/mixins/organisationMixin.vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  name: "App",
  mixins:[organisationMixinVue],

  props: {
    chartId: {
      type: String,
      default: "doughnut-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 600,
    },
    height: {
      type: Number,
      default: 600,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },

  beforeMount(){
    this.getUserByRegistration();
  },

  data() {
    return {
      chartData: {
        labels: ["Registered","Pending", "Not-Registered"],
        datasets: [
          {
            backgroundColor: ["#27ae60","#2d9cdb", "#f2994a"],
            data: [0,0, 0],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  watch:{
    getUserByRegistration(){
      return this.getUserByRegistration();
    }
  },
  methods: {
    getUserByRegistration(){
      let organisation_id = this.getOrganisationId;
      let payload = {
        status: "none",
        url: `/api/protected/organisations/users?organisation_id=${organisation_id}`,
        has_path_val: true,
        show_feedback: false,
        msg: "none",
        color: "default",
        error_msg: "default",
        commit: "",
        has_commit: false,
        to_be_store_data: {
          required: true,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.chartData.datasets[0].data = res.data;
      });
    }
  },
  components: {
    Doughnut,
  },
};
</script>

<style lang="scss" scoped>
</style>
