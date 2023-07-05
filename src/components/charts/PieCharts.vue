<template>
  <div class="q-pa-md">
    <q-card flat>
      <q-card-section>
        <Doughnut :chart-options="chartOptions" :chart-data="getChartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
          :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height"></Doughnut>
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
import memberMixinVue from 'src/mixins/memberMixin.vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  name: "App",
  mixins: [organisationMixinVue, memberMixinVue],

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
      default: () => { },
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  mounted(){
    let organisation_id = this.$store.getters.getOrganisation != null ? this.$store.getters.getOrganisation.id : null;
    this.getUserByRegistrationStatus(organisation_id);
  },
  data() {
    return {
      chartData: {
        labels: ["Registered", "Pending", "Not-Registered"],
        datasets: [
          {
            backgroundColor: ["#27ae60", "#2d9cdb", "#f2994a"],
            data: [0, 0, 0],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  computed: {
    getChartData(){
      let data = {
        labels: ["Registered", "Pending", "Not-Registered"],
        datasets: [
          {
            backgroundColor: ["#27ae60", "#2d9cdb", "#f2994a"],
            data: this.$store.getters.getPieChartData,
          },
        ],
      }
      return data;
    }
  },
  watch: {
  },
  methods: {
  },
  components: {
    Doughnut,
  },
};
</script>

<style lang="scss" scoped></style>
