<template>
  <div class="q-pa-xs">
    <!-- table heading -->
    <div class="text-center">
      <label for="title" class="text-h5 heading">
        {{ heading }}
      </label>
    </div>
    <!-- table for incomes -->
    <q-markup-table>
      <!-- <t> -->

      <!-- </t> -->
      <thead>
        <div>Income</div>
        <tr :style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }">
          <th class="text-left">S/N</th>
          <th class="text-left">Dessert (100g serving)</th>
          <th class="text-right">Calories</th>
          <th class="text-right">Fat (g)</th>
          <th class="text-right">Carbs (g)</th>
          <th class="text-right">Protein (g)</th>
          <th class="text-right">Sodium (mg)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-left">Frozen Yogurt</td>
          <td class="text-right">159</td>
          <td class="text-right">6</td>
          <td class="text-right">24</td>
          <td class="text-right">4</td>
          <td class="text-right">87</td>
        </tr>
        <tr>
          <td class="text-left">Ice cream sandwich</td>
          <td class="text-right">237</td>
          <td class="text-right">9</td>
          <td class="text-right">37</td>
          <td class="text-right">4.3</td>
          <td class="text-right">129</td>
        </tr>
        <tr>
          <td class="text-left">Eclair</td>
          <td class="text-right">262</td>
          <td class="text-right">16</td>
          <td class="text-right">23</td>
          <td class="text-right">6</td>
          <td class="text-right">337</td>
        </tr>
        <tr>
          <td class="text-left">Cupcake</td>
          <td class="text-right">305</td>
          <td class="text-right">3.7</td>
          <td class="text-right">67</td>
          <td class="text-right">4.3</td>
          <td class="text-right">413</td>
        </tr>
        <tr>
          <td class="text-left">Gingerbread</td>
          <td class="text-right">356</td>
          <td class="text-right">16</td>
          <td class="text-right">49</td>
          <td class="text-right">3.9</td>
          <td class="text-right">327</td>
        </tr>
      </tbody>
    </q-markup-table>
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
* {
  padding: 0;
  margin: 0;
}
.title {
  font-size: medium;
}

.total_income_value {
  padding-left: 31.2rem;
  font-size: 14px;
}
.total {
  padding-left: 7.6rem;
  font-size: 14px;
}
.total_given {
  padding-left: 16.8rem;
  font-size: 14px;
}

.total_spent {
  padding-left: 15.9rem;
  font-size: 14px;
}
.balance {
  padding-left: 16.5rem;
  font-size: 14px;
}
.balance_details {
  font-size: 14px;
}
.total_heading {
  padding-left: 11.5rem;
  font-size: 14px;
}
.net_balance {
  padding-left: 1rem;
}
.heading {
  font-family: "Roboto";
  font-style: normal;
  font-weight: bolder;
  font-size: 17px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $dark;
}
</style>
