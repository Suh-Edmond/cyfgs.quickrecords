<template>
  <q-page>
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-lg"
        v-if="getLoadingState"
      />
    </div>
    <!--------------------------------------------------TABLE FOR EXPENDITURE DETAILS---------------------------------------->
    <div>
      <!-- header for filter categories -->
      <div
        class="row q-ml-xs q-pt-xs"
        :class="$q.screen.lg ? 'q-pa-sm' : ''"
        :style="
          $q.screen.lg ? 'background-color:#F6F6F6; border-radius:10px' : ''
        "
      >
        <div class="col-md-3 col-lg-3 col-xs-12 col-sm-12">
          <q-select
            v-model="status"
            outlined
            dense
            :options="statuses"
            :label="$t('app.selectStatusLabel')"
            @input="filterItems"
          />
        </div>
        <q-space />
        <div class="button q-pb-xs">
          <q-btn
            :label="$t('app.print')"
            :loading="loading"
            :color="'positive'"
            :disabled="false"
            no-caps
            icon-left="print"
            @click="downloadExpenditureItemDetails"
          ></q-btn>
        </div>
      </div>
      <div class="q-px-sm q-pt-md">
        <q-markup-table>
          <thead class="bg-primary text-white">
            <tr>
              <th
                class="text-left"
                v-for="column in columns"
                :key="column.name"
              >
                {{ column.label }}
              </th>
              <th class="text-left">
                {{ $t("app.markAll")
                }}<q-checkbox
                  :color="check_all ? 'black' : ''"
                  @input="checkAllExpenses"
                  v-model="check_all"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(expenditure, index) in getExpenditureDetails"
              :key="index"
            >
              <td class="text-left">{{ index + 1 }}</td>
              <td class="text-left">{{ expenditure.name }}</td>
              <td class="text-left">
                {{ Number(expenditure.amount_given).toLocaleString() }}
              </td>
              <td class="text-left">
                {{ Number(expenditure.amount_spent).toLocaleString() }}
              </td>
              <td class="text-left">
                {{ Number(expenditure.balance).toLocaleString() }}
              </td>
              <q-td
                key="approve"
                v-if="expenditure.approve == 'PENDING'"
                class="text-info"
              >
                {{ expenditure.approve }}
              </q-td>
              <q-td
                key="approve"
                v-if="expenditure.approve == 'DECLINED'"
                class="text-orange"
              >
                {{ expenditure.approve }}
              </q-td>
              <q-td
                key="approve"
                v-if="expenditure.approve == 'APPROVED'"
                class="text-positive"
              >
                {{ expenditure.approve }}
              </q-td>
              <td class="text-left">
                <!-- approved btn for expenditure item details -->
                <q-btn
                  class="decline_btn"
                  dense
                  :label="$t('app.decline')"
                  unelevated
                  no-caps
                  @click="onDeclineRecord(expenditure, 'Decline')"
                  v-if="
                    checkTreasurerRole() && expenditure.approve == 'PENDING'
                  "
                />
                <!-- decline btn for expenditure item details -->
                <q-btn
                  class="approve_btn"
                  dense
                  :label="$t('app.approve')"
                  no-caps
                  unelevated
                  @click="onApprovedRecord(expenditure, 'Approve')"
                  v-if="
                    checkTreasurerRole() && expenditure.approve == 'PENDING'
                  "
                />

                <!-- view expenditure item details -->
                <q-btn
                  color="primary"
                  :class="
                    expenditure.approve == 'PENDING'
                      ? 'viewExpenditureItem'
                      : 'viewPending'
                  "
                  dense
                  :label="$t('app.view')"
                  no-caps
                  unelevated
                  @click="onViewExpenditureDetail(expenditure)"
                  v-if="checkTreasurerRole()"
                >
                  <q-icon name="visibility" size="xs" class="q-pl-md"></q-icon>
                </q-btn>
              </td>
              <td class="text-left" v-show="expenditure.approve == 'PENDING'">
                <q-checkbox v-model="selected" color="black" @input="markSingleExpense(expenditure)"  />
              </td>
              <td v-show="expenditure.approve != 'PENDING'"></td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
    <!--------------------------------------------------END OF TABLE FOR EXPENDITURE DETAILS--------------------------------->
  </q-page>
</template>

<script>
import CategoryTable from "src/components/CategoryTable.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import TransactionStatusVue from "src/components/Constants/TransactionStatus.vue";
import { LocalStorage } from "quasar";

export default {
  mixins: [HelperMixinVue],

  mounted() {},

  data() {
    return {
      check_all: false,
      val: false,
      start_filter: false,
      color: "primary",
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
          name: "name",
          required: true,
          label: this.$t("app.nameLabel"),
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "amount_given",
          align: "left",
          label: this.$t("app.amountGivenLabel") + "(XAF)",
          field: "amount_given",
          sortable: true,
        },
        {
          name: "amount_spent",
          align: "left",
          label: this.$t("app.amountSpent") + "(XAF)",
          field: "amount_spent",
          sortable: true,
        },
        {
          name: "balance",
          align: "left",
          label: this.$t("app.balance"),
          field: "balance",
          sortable: true,
        },
        {
          name: "approve",
          align: "left",
          label: this.$t("app.transactionStatus"),
          field: "approve",
          sortable: true,
        },
        {
          name: "action",
          label: this.$t("app.action"),
          field: "action",
          sortable: true,
          align: "left",
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ],
      label: this.$t("app.delete"),
      message: "",
      statuses: ["PENDING", "APPROVED", "DECLINED", "ALL"],
      status: null,
      filtered_items: [],
      show_spinner: false,
      selected:false,
      approve_state:false,
    };
  },
  computed: {
    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
    getExpenditureItemName() {
      return this.$store.getters.getExpenditureItemName;
    },

    getExpenditureItemAmount() {
      return this.$store.getters.getExpenditureItemDetails != null &&
        this.$store.getters.getExpenditureItemDetails.length > 0
        ? this.$store.getters.getExpenditureItemDetails[2]
            .expenditure_item_amount
        : 0;
    },

    getTotalAmountGiven() {
      return this.$store.getters.getExpenditureItemDetails != null &&
        this.$store.getters.getExpenditureItemDetails.length > 0
        ? this.$store.getters.getExpenditureItemDetails[3].total_amount_given
        : 0;
    },

    getTotalAmountSpent() {
      return this.$store.getters.getExpenditureItemDetails != null &&
        this.$store.getters.getExpenditureItemDetails.length > 0
        ? this.$store.getters.getExpenditureItemDetails[4].total_amount_spent
        : 0;
    },

    getBalance() {
      return this.getTotalAmountGiven - this.getTotalAmountSpent;
    },

    getTotalBalance() {
      return this.$store.getters.getExpenditureItemDetails != null &&
        this.$store.getters.getExpenditureItemDetails.length > 0
        ? this.$store.getters.getExpenditureItemDetails[5].total_balance
        : 0;
    },

    getExpenditureDetails() {
      let data = [];
      if (
        this.$store.getters.getExpenditureItemDetails != null &&
        this.$store.getters.getExpenditureItemDetails.length > 0
      ) {
        this.$store.getters.getExpenditureItemDetails[0].forEach((ele) => {
          data.push({
            counter:
              this.$store.getters.getExpenditureItemDetails[0].indexOf(ele) + 1,
            name: ele.name,
            amount_given: ele.amount_given,
            amount_spent: ele.amount_spent,
            balance: ele.balance,
            type: "EXPENDITURE_DETAILS",
            id: ele.id,
            expenditure_item_id: ele.expenditure_item_id,
            comment: ele.comment,
            approve: ele.approve,
            created_at: ele.created_at,
            updated_at: ele.updated_at,
            updated_by: ele.updated_by,
            approve_state:ele.approve === 'PENDING' ? false:true
          });
        });
      }
      return data;
    },
  },
  methods: {
    checkAllExpenses(){
      this.getExpenditureDetails.map(ele => ele.approve_state = this.check_all)
      return this.getExpenditureDetails;
    },

    markSingleExpense(expense){
      this.selected = true;
      // console.log(expense);
      // this.getExpenditureDetails.find(ele => ele.id === expense.id).approve_state = true;
      // console.log(this.getExpenditureDetails);
      // return this.getExpenditureDetails;
      return this.selected;
    },


    evaluateAllRecord(expenses) {
      return expenses.find((ele) => ele.approve == "PENDING") == undefined
        ? (this.check_all = null)
        : (this.check_all = false);
    },
    downloadExpenditureItemDetails() {
      let expenditure_item_id = this.$router.currentRoute.params.id;
      let url = `/api/protected/expenditure-item-details/download?expenditure_item_id=${expenditure_item_id}&status=${this.status}`;
      let file_name = "Expenditure_Item_Details.pdf";
      this.loading = this.downloadPdf(url, file_name);
    },

    filterItems() {
      this.start_filter = true;
      this.show_spinner = true;
      let expenditure_item_id = this.$router.currentRoute.params.id;

      this.$router.push({
        path: `/dashboard/expenditures/${expenditure_item_id}/details`,
        query: { status: this.status },
      });

      if (this.status == "ALL") {
        this.filtered_items = this.getExpenditureDetails;
      } else {
        const items = this.getExpenditureDetails.filter(
          (item) => item.approve == this.status
        );
        this.filtered_items = items;
      }
      this.filtered_items = Array.from(this.filtered_items);
      this.show_spinner = false;
      return this.filtered_items;
    },

    viewExpenditureItemDetail(data) {
      this.$store.dispatch("setUpdatedExpenditureItemDetail", data.data);
      this.$emit("view-expenditure-item-detail", data);
    },
    onDeclineRecord(data1, data) {},

    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").user_data.roles.find(
        (role) => role.name == "TREASURER"
      );
      return treasurer_role != undefined;
    },

    onViewExpenditureDetail(data) {
      let payload = {
        data: data,
        tab: "Expenditure Item Detail Information",
      };
      this.$emit("view-expenditure-item-detail", payload);
    },

    onApprovedRecord(data1, data) {},
  },
  components: {
    // CategoryTable,
  },
};
</script>

<style lang="scss" scoped>
.tableHead {
  background-color: "#5384ae";
  color: "#FFFFFF";
}
.viewExpenditureItem {
  width: 5.5rem;
  margin-left: 1rem;
}
.viewPending {
  width: 5.5rem;
}

.approve_btn {
  background-color: $secondary;
  color: white;
  width: 5.5rem;
  margin-left: 1rem;
}

.decline_btn {
  background-color: $orange;
  color: white;
  width: 5.5rem;
}
</style>
