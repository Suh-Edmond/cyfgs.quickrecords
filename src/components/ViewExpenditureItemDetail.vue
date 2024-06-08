<template>
  <div class="q-py-md" :class="$q.platform.is.mobile ? 'q-px-lg' : 'q-px-md'">
    <div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="expenditure_item" class="label"
            ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.nameLabel") }}
          </label>
        </div>
        <div>
          <label class="value">
            {{ getUpdatedExpenditureItemDetailFromState.name }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="venue" class="label"
            ><span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.amountGivenLabel") }}
          </label>
        </div>
        <div>
          <label class="value">
            {{
              Number(
                getUpdatedExpenditureItemDetailFromState.amount_given
              ).toLocaleString()
            }}
            XAF
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="date" class="label"
            ><span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.amountSpent") }}</label
          >
        </div>
        <div>
          <label class="value">
            {{
              Number(
                getUpdatedExpenditureItemDetailFromState.amount_spent
              ).toLocaleString()
            }}
            XAF
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="amount" class="label"
            ><span>
              <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.balance") }}
          </label>
        </div>
        <div>
          <label class="value">
            {{
              Number(
                getUpdatedExpenditureItemDetailFromState.balance
              ).toLocaleString()
            }}
            XAF
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="status" class="label"
            ><span>
              <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.transactionStatus") }}
          </label>
        </div>
        <div>
          <label
            class="value text-info"
            v-show="
              getUpdatedExpenditureItemDetailFromState.approve == 'PENDING'
            "
          >
            {{ getUpdatedExpenditureItemDetailFromState.approve }}
          </label>
          <label
            class="value text-secondary"
            v-show="
              getUpdatedExpenditureItemDetailFromState.approve == 'APPROVED'
            "
          >
            {{ getUpdatedExpenditureItemDetailFromState.approve }}
          </label>
          <label
            class="value text-warning"
            v-show="
              getUpdatedExpenditureItemDetailFromState.approve == 'DECLINED'
            "
          >
            {{ getUpdatedExpenditureItemDetailFromState.approve }}
          </label>
        </div>
      </div>

      <div class="flex justify-between q-mb-md">
        <div>
          <label for="amount" class="label"
            ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.createdDate") }}
          </label>
        </div>

        <div>
          <label class="value">
            {{ getFormatDetailCreatedDate }}
          </label>
        </div>
      </div>
      <div class="flex justify-between q-mb-md">
        <div>
          <label for="amount" class="label"
            ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
            >{{ $t("app.createdBy") }}
          </label>
        </div>
        <div>
          <label class="value">
            {{ getUpdatedExpenditureItemDetailFromState.updated_by }}
          </label>
        </div>
      </div>
      <div class="row q-mb-xs">
        <label for="comment" class="label"
          ><span> <q-icon name="description" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.comment") }}</label
        >
      </div>
      <div class="value detail-value q-ml-lg">
        {{ getUpdatedExpenditureItemDetailFromState.comment }}
      </div>
    </div>
  </div>
</template>
<script>
import ExpenditureItemDetailMixinVue from "src/mixins/ExpenditureItemDetailMixin.vue";
import moment from "moment";

export default {
  mixins: [ExpenditureItemDetailMixinVue],
  mounted() {
    let heading = this.$t("app.detailHeading");
    this.$emit("set-heading", heading);
  },
  data() {
    return {};
  },

  computed: {
    getUpdatedExpenditureItemDetailFromState() {
      return this.$store.getters.getUpdatedExpenditureItemDetail;
    },
    getFormatDetailCreatedDate() {
      return moment(
        this.$store.getters.getUpdatedExpenditureItemDetail.created_at
      ).format("MMMM Do YYYY");
    },
  },

  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">
.label {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 0.7rem;
  color: $grey5;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.7rem;
  color: $grey8;
}

.detail-value {
  max-width: 250px;
}
</style>
