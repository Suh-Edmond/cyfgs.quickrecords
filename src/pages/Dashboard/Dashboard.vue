<template>
  <q-page>
    <div class="row">
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 q-px-xs">
        <q-card class="card" flat bordered>
          <q-card-section>
            <div class="text-h6 text-uppercase text-center">Users</div>
          </q-card-section>

          <q-card-actions align="around" class="q-pb-sm">
            <div>
              <q-icon name="groups" size="xl" class="card_icon" />
            </div>
            <div>
              <label for="total" class="total">100</label>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 q-px-xs">
        <q-card class="card" flat bordered>
          <q-card-section>
            <div class="text-h6 text-uppercase text-center">Income</div>
          </q-card-section>

          <q-card-actions align="around" class="q-pb-sm">
            <div>
              <q-icon name="data_exploration" size="xl" class="card_icon" />
            </div>
            <div>
              <label for="total" class="total">100 XAF</label>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 q-px-xs">
        <q-card class="card" flat bordered>
          <q-card-section>
            <div class="text-h6 text-uppercase text-center">Contributions</div>
          </q-card-section>

          <q-card-actions align="around" class="q-pb-sm">
            <div>
              <q-icon name="payments" size="xl" class="card_icon" />
            </div>
            <div>
              <label for="total" class="total">100 XAF</label>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 q-px-xs">
        <q-card class="card" flat bordered>
          <q-card-section>
            <div class="text-h6 text-uppercase text-center">Expenditures</div>
          </q-card-section>

          <q-card-actions align="around" class="q-pb-sm">
            <div>
              <q-icon name="data_exploration" size="xl" class="card_icon" />
            </div>
            <div>
              <label for="total" class="total">100 XAF</label>
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <div class="row q-px-xs q-pt-sm">
      <div class="col-12">
        <q-card class="card_statistics" flat bordered>
          <span class="card_statistics_header q-pa-sm">
            Income
          </span>
          <div class="row">
            <q-card class="card_statistics_info q-mx-sm text-center q-mt-md" flat bordered>
              <div class="text-subtitle2 absolute-top text-center amount">
                5
              </div>
            </q-card>
            <q-card class="card_statistics_info q-mx-sm text-center q-mt-md" flat bordered>
              <div class="text-subtitle2 absolute-top text-center amount">
                5
              </div>
            </q-card>
            <q-card class="card_statistics_info q-mx-sm text-center q-mt-md" flat bordered>
              <div class="text-subtitle2 absolute-top text-center amount">
                5
              </div>
            </q-card>
            <q-card class="card_statistics_info q-mx-sm text-center q-mt-md" flat bordered>
              <div class="text-subtitle2 absolute-top text-center amount">
                5
              </div>
            </q-card>
            <q-card class="card_statistics_info q-mx-sm text-center q-mt-md" flat bordered>
              <div class="text-subtitle2 absolute-top text-center amount">
                5
              </div>
            </q-card>
            <q-card class="card_statistics_info q-mx-sm text-center q-mt-md" flat bordered>
              <div class="text-subtitle2 absolute-top text-center amount">
                5
              </div>
            </q-card>
            <q-card class="card_statistics_info q-mx-sm text-center q-mt-md" flat bordered>
              <div class="text-subtitle2 absolute-top text-center amount">
                5
              </div>
            </q-card>
          </div>

        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
import CurrentYearMixinVue from 'src/mixins/CurrentYearMixin.vue';
import RegistrationAmountMixin from 'src/mixins/RegistrationAmountMixin.vue';
export default {
  mixins:[CurrentYearMixinVue, RegistrationAmountMixin],
  mounted(){
    this.fetchCurrentYear();
    this.getRegistrationAmount();
    this.getSessions();
  },
  data() {
    return {
    }
  },
  methods: {


  }
}
</script>
<style lang="scss" scoped>
.card {
  cursor: pointer;
}

.text-h6 {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 29px;
  text-align: center;
  letter-spacing: 0.005em;
  color: #5384AE;
}

.total {

  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 35px;
  text-align: center;
  letter-spacing: 0.005em;
  color: #5384AE;
}

.card_icon {
  color: $grey5;
}

.card_statistics {
  height: 57vh;
}

.card_statistics_header {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 29px;
  letter-spacing: 0.005em;
  color: #5384AE;
}

.card_statistics_info {
  background-color: $blue1;
  width: 3rem;
  height: 50vh
}

.amount {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.005em;
  color: #5384AE;

}
</style>
