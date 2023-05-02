<template>
  <div class="q-pa-xs">
    <!-- table heading -->
    <div class="text-center">
      <label for="title" class="text-h5 heading">
        {{ heading }}
      </label>
    </div>
    <!-- table for incomes -->
    <div class="q-py-sm q-pl-sm">
      <label for="" class="heading">Income</label>
    </div>
    <table separator="cell" flat bordered dense>
      <thead>
        <tr
          :style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }"
          class="q-pa-md"
        >
          <th class="text-left q-pa-md">S/N</th>
          <th class="text-center">Category</th>
          <th class="text-center">Description/Activity</th>
          <th class="text-center">Amount (F CFA)</th>
          <th class="text-center">Sub Total (F CFA)</th>
          <th class="text-center">Total (F CFA)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-left">1</td>
          <td class="text-center">Frozen Yogurt</td>
          <td rowspan="10">
            <div>
              <table flat>
                <tbody>
                  <tr>
                    <td>Food</td>
                  </tr>
                  <tr>
                    <td>Food</td>
                  </tr>
                  <tr>
                    <td>Food</td>
                  </tr>
                  <tr>
                    <td>Food</td>
                  </tr>
                  <tr>
                    <td>Food</td>
                  </tr>
                  <tr>
                    <td>Food</td>
                  </tr>
                  <tr>
                    <td>Food</td>
                  </tr>
                  <tr>
                    <td>Food</td>
                  </tr>
                  <tr>
                    <td>Food</td>
                  </tr>
                  <tr>
                    <td>Food</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
          <td class="text-center">24</td>
          <td class="text-center">4</td>
          <td class="text-center">87</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    heading: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      label_download: "Print",
      loading: false,
      color: "positive",
      no_caps: true,
      filter: "",
    };
  },
  computed: {},
  methods: {},
  components: {},
};
</script>
<style lang="scss" scoped>
.heading {
  font-family: "Roboto";
  font-style: normal;
  font-weight: bolder;
  font-size: 17px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $dark;
}
.income_heading {
  padding-left: 30rem;
}
</style>
