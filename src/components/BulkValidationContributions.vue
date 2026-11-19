<template>
  <div>
    <q-card class="q-mb-sm q-mx-md" flat>
      <q-card-section>
        <div class="flex justify-end q-gutter-x-md">
          <q-btn
            class="approve_btn"
            :label="$t('app.approveAll')"
            no-caps
            @click="onShowSelectedItemDialog('Approve')"
          />

          <q-btn
            class="decline_btn q-px-md"
            dense
            :label="$t('app.declineAll')"
            no-caps
            @click="onShowSelectedItemDialog('Decline')"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-------------------------------------------DIALOG TO APPROVE/DECLINE PAYMENT------------------->
    <q-dialog v-model="show_payment_dialog">
      <q-card class="q-pa-sm">
        <q-card-section class="row">
          <div class="text-primary confirm_payment_title">
            {{ type }} {{ $t("app.bulkConntributionConfirmation") }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup size="sm" />
        </q-card-section>
        <q-card-section>
          <div>
            <q-markup-table flat>
              <thead>
                <tr class="text-weight-bold">
                  <th class="text-left text-weight-bold">{{ $t("app.sn") }}</th>
                  <th class="text-left text-weight-bold">
                    {{ $t("app.nameLabel") }}
                  </th>
                  <th class="text-left text-weight-bold">
                    {{ $t("app.totalAmountDeposited") }}
                  </th>
                  <th class="text-left text-weight-bold">
                    {{ $t("app.balance") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selectedContributions" :key="index">
                  <td class="text-left">{{ index + 1 }}</td>
                  <td class="text-left">{{ item.user_name }}</td>
                  <td class="text-left">
                    {{ Number(item.total_amount_deposited).toLocaleString() }}
                  </td>
                  <td class="text-left">
                    {{ Number(item.balance).toLocaleString() }}
                  </td>
                </tr>
                <tr>
                  <td class="text-left text-weight-bold">
                    {{ $t("app.total") }}
                  </td>
                  <td class="text-left"></td>
                  <td class="text-left text-weight-bold">
                    {{ Number(computeRunningTotalAmount()).toLocaleString() }}
                    XAF
                  </td>
                  <td class="text-left text-weight-bold">
                    {{ Number(computeRunningBalance()).toLocaleString() }} XAF
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </q-card-section>

        <q-card-section class="q-mb-md flex justify-end">
          <q-btn
            class="form_button"
            :label="type === 'Approve' ? $t('app.approve') : $t('app.decline')"
            :loading="loading_payment"
            :color="type === 'Approve' ? 'secondary' : 'orange'"
            :disabled="false"
            no-caps
            size="sm"
            @click="onConfirmBulkContributions"
          >
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-------------------------------------------END OF DIALOG TO APPROVE/DECLINE PAYMENT------------>
  </div>
</template>

<script>
export default {
  props: {
    selectedContributions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      loading_payment: false,
      show_payment_dialog: false,
      type: "",
    };
  },

  computed: {},

  methods: {
    computeRunningTotalAmount() {
      let total = 0;
      this.selectedContributions.forEach((ele) => {
        total += ele.total_amount_deposited;
      });
      return total;
    },

    computeRunningBalance() {
      let total = 0;
      this.selectedContributions.forEach((ele) => {
        total += ele.balance;
      });
      return total;
    },

    onShowSelectedItemDialog(type) {
      this.show_payment_dialog = true;
      return (this.type = type);
    },

    setApproveFeedbackMsg() {
      return (
        this.$t("app.recordWas") + `${this.type}` + this.$t("app.successfull")
      );
    },

    setRequestData() {
      let data = [];
      this.selectedContributions.forEach((ele) => {
        data.push({
          id: ele.id,
          type: this.type === "Approve" ? "APPROVED" : "DECLINED",
        });
      });

      return data;
    },

    onConfirmBulkContributions() {
      let payload = {
        url: `/api/protected/contributions/bulk_approve`,
        msg: this.setApproveFeedbackMsg(),
        data: this.setRequestData(),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading_payment = true;
      this.$store
        .dispatch("putRequest", payload)
        .then((res) => {
          if (res.success) {
            this.$emit("fetch-contributions-details");
          }
        })
        .finally(() => {
          this.show_payment_dialog = false;
          this.loading_payment = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.approve_btn {
  background-color: $secondary;
  color: white;
  font-size: 0.7rem;
}

.decline_btn {
  background-color: $orange;
  color: white;
  font-size: 0.7rem;
}

.summary {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 11px;
  color: $grey8;
  text-decoration: underline;
}

.confirm_payment_title {
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
