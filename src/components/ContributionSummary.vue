<template>
  <div>
    <q-card flat>
      <div class="row q-mb-lg q-gutter-sm" v-if="!is_expenditures">
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 box q-pa-md">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="monetization_on" size="sm" class="icon">
            </q-btn>
            <label class="text-subtitle1 label">{{
              $t("app.expectedContribution")
            }}</label>
          </div>
          <div class="text-center value">
            <label class="text-bold"
              >{{
                Number(summary.expect_contribution).toLocaleString()
              }}
              XAF</label
            >
          </div>
        </div>
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 box q-pa-md">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="monetization_on" size="sm" class="icon">
            </q-btn>
            <label class="text-subtitle1 label">{{
              $t("app.amountContributed")
            }}</label>
          </div>
          <div class="text-center value">
            <label class="text-bold"
              >{{
                Number(summary.amount_contributed).toLocaleString()
              }}
              XAF</label
            >
          </div>
        </div>
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 box q-pa-md">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="monetization_on" size="sm" class="icon">
            </q-btn>
            <label class="text-subtitle1 label">{{ $t("app.balance") }}</label>
          </div>
          <div class="text-center value">
            <label class="text-bold"
              >{{ Number(summary.balance).toLocaleString() }} XAF</label
            >
          </div>
        </div>
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 box q-pa-md">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="trending_up" size="sm" class="icon">
            </q-btn>
            <label class="text-subtitle1 label">{{
              $t("app.percentage")
            }}</label>
          </div>
          <div class="text-center value">
            <label class="text-bold"
              >{{ Number(summary.percentage).toFixed(2) }} %</label
            >
          </div>
        </div>
      </div>
      <div class="row q-mb-lg q-gutter-sm" v-if="is_expenditures">
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 box q-pa-md">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="monetization_on" size="sm" class="icon">
            </q-btn>
            <label class="text-subtitle1 label">{{
              $t("app.estimatedAmount")
            }}</label>
          </div>
          <div class="text-center value">
            <label class="text-bold"
              >{{
                Number(summary.estimated_amount).toLocaleString()
              }}
              XAF</label
            >
          </div>
        </div>
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 box q-pa-md">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="monetization_on" size="sm" class="icon">
            </q-btn>
            <label class="text-subtitle1 label">{{
              $t("app.amountGivenLabel")
            }}</label>
          </div>
          <div class="text-center value">
            <label class="text-bold"
              >{{
                Number(summary.amount_given).toLocaleString()
              }}
              XAF</label
            >
          </div>
        </div>
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 box q-pa-md">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="monetization_on" size="sm" class="icon">
            </q-btn>
            <label class="text-subtitle1 label">{{
              $t("app.amountSpent")
            }}</label>
          </div>
          <div class="text-center value">
            <label class="text-bold"
              >{{
                Number(summary.amount_spent).toLocaleString()
              }}
              XAF</label
            >
          </div>
        </div>
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 box q-pa-md">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="monetization_on" size="sm" class="icon">
            </q-btn>
            <label class="text-subtitle1 label">{{ $t("app.balance") }}</label>
          </div>
          <div class="text-center value">
            <label class="text-bold"
              >{{ Number(summary.balance).toLocaleString() }} XAF</label
            >
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  props: {
    summary: {
      type: Object,
      required: true,
    },
    is_expenditures: {
      type:Boolean,
      required:true
    }
  },
};
</script>

<style scoped lang="scss">
.box {
  background-color: #f6f6f6;
  border-radius: 5px;
}

.icon {
  color: $grey5;
}

.label {
  color: $grey2;
  font-size: small;
}
.value {
  font-size: large;
}
</style>
