<template>
  <div>
    <q-card flat>
      <div class="row q-my-xl q-gutter-xs" v-if="!is_expenditures">
        <div class="col-12 col-md box">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="trending_flat" size="sm" class="icon">
            </q-btn>
            <label class="text-subtitle1 label">{{
              $t("app.frequency")
            }}</label>
          </div>
          <div class="text-center value">
            <label class="text-bold"
              >{{ formatConstants(summary.frequency) }}
            </label>
          </div>
        </div>
        <div class="col-12 col-md box">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="group" size="sm" class="icon"> </q-btn>
            <label class="text-subtitle1 label">{{
              $t("app.memberSize")
            }}</label>
          </div>
          <div class="text-center value">
            <label class="text-bold">{{ summary.member_size }} </label>
          </div>
        </div>
        <div class="col-12 col-md box">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="monetization_on" size="sm" class="icon">
            </q-btn>
            <label class="text-subtitle1 label"
              >{{ $t("app.expectedContribution") }}
              <span>
                <q-btn color="primary" dense flat size="sm" icon="help">
                  <q-tooltip anchor="bottom end" self="bottom end">
                    <p class="tooltipText wrap">
                      {{ $t("app.helpMsgExpectedContribution") }}
                    </p>
                  </q-tooltip>
                </q-btn>
              </span></label
            >
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
        <div class="col-12 col-md box">
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
        <div class="col-12 col-md box">
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
        <div class="col-12 col-md box">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="trending_up" size="md" class="icon">
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
        <div class="col-12 col-md box">
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
        <div class="col-12 col-md box">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="monetization_on" size="sm" class="icon">
            </q-btn>
            <label class="text-subtitle1 label">{{
              $t("app.totalAmountGiven")
            }}</label>
          </div>
          <div class="text-center value">
            <label class="text-bold"
              >{{ Number(summary.amount_given).toLocaleString() }} XAF</label
            >
          </div>
        </div>
        <div class="col-12 col-md box">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="monetization_on" size="sm" class="icon">
            </q-btn>
            <label class="text-subtitle1 label">{{
              $t("app.totalAmountSpent")
            }}</label>
          </div>
          <div class="text-center value">
            <label class="text-bold"
              >{{ Number(summary.amount_spent).toLocaleString() }} XAF</label
            >
          </div>
        </div>
        <div class="col-12 col-md box">
          <div class="q-mb-md flex justify-between">
            <q-btn dense flat icon="monetization_on" size="sm" class="icon">
            </q-btn>
            <label class="text-subtitle1 label">{{
              $t("app.totalBalance")
            }}</label>
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
import HelperMixin from "src/mixins/HelperMixin.vue";
export default {
  mixins: [HelperMixin],
  props: {
    summary: {
      type: Object,
      required: true,
    },
    is_expenditures: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.box {
  background-color: #f6f6f6;
  border-radius: 5px;
  padding: 0.7rem;
}

.icon {
  color: $primary;
}

.label {
  color: $primary;
  font-size: 0.7rem;
  font-weight: 500;
}
.value {
  font-size: 0.8rem;
  color: $primary;
}

.tooltipText {
  font-size: 0.7rem;
  width: 25rem;
}
</style>
