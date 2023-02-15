<template>
  <div class="q-pa-md">
    <div class="q-mt-sm">
      <div class="flex q-pb-md">
        <label for="name" class="label">Payment Item:
          <span class="value value_item">{{ getSelectedContribution.payment_item_name }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Total Amount Payable:
          <span class="value value_amount">{{ Number(getSelectedContribution.payment_item_amount).toLocaleString() }}
            XAF</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Complusory:
          <span class="value value_complusory" v-if="getSelectedContribution.payment_item_complusory">YES</span>
          <span class="value value_complusory" v-if="!getSelectedContribution.payment_item_complusory">NO</span></label>

      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Member's Name:
          <span class="value value_name">{{ getSelectedContribution.user_name }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Amount:
          <span class="value value_amount_paid">{{ Number(getSelectedContribution.amount_deposited).toLocaleString() }}
            XAF</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Total Amount Paid:
          <span class="value value_amount_total">{{ Number(computeTotalAmountContributed).toLocaleString() }}
            XAF</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Balance: <span
            class="value value_balance">{{ Number(getSelectedContribution.balance).toLocaleString() }} XAF</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Payment Date:
          <span class="value value_date">{{ getFormatedCreatedDate }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="status" class="label" v-show="getSelectedContribution.approve == 'DECLINED'">Transaction Status:
          <span class=" value_trxn unapproved_color">{{getSelectedContribution.approve}}</span></label>
        <label for="status" class="label" v-show="getSelectedContribution.approve == 'APPROVED'">Transaction Status:
          <span class=" value_trxn approved_color"> {{getSelectedContribution.approve}}</span></label>
          <label for="status" class="label" v-show="getSelectedContribution.approve == 'PENDING'">Transaction Status:
          <span class=" value_trxn pending_color"> {{getSelectedContribution.approve}}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label" v-show="getSelectedContribution.status == 'INCOMPLETE'">Payment Status:
          <span class="unapproved_color q-pl-md value_status">{{ getSelectedContribution.status }}</span></label>

        <label for="name" class="label" v-show="getSelectedContribution.status == 'COMPLETE'">Payment Status:
          <span class="value text-secondary q-pl-md value_status">{{ getSelectedContribution.status }}</span></label>
      </div>
      <div class="flex q-pb-lg">
        <label for="name" class="label">Transaction code:
          <span class="value  q-pl-md value_code">{{ getSelectedContribution.code }}</span></label>
      </div>
      <div class="flex q-pb-lg">
        <label for="name" class="label">Created By:
          <span class="value  q-pl-md value_created_by">{{ getSelectedContribution.updated_by }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Comment: </label>
      </div>
      <p class="value_comment">
          {{ getSelectedContribution.comment }}
        </p>
    </div>
    <!-- edit contribution has been remove -->
    <!-- <div align="end" class="q-mt-md">
      <q-btn color="primary" no-caps size="sm" round @click="editContribution">
        <q-icon name="edit" size="xs"></q-icon>
      </q-btn>
    </div> -->




    <!-- image for receipt for contribution -->
    <q-dialog v-model="show_image" :position="position">
      <q-card style="width: 360px" :class="$q.screen.lg ? 'q-mr-md' : 'q-mx-sm'">
        <q-bar>
          <div></div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div>
            <q-img src="https://cdn.quasar.dev/img/mountains.jpg" spinner-color="white"
              style="height: 100%; width: 100%px" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import moment from "moment";
import organisationMixin from "src/mixins/organisationMixin.vue";
import memberMixin from "src/mixins/memberMixin.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";


export default {
  mixins:[organisationMixin, memberMixin, HelperMixin],
  mounted() {
    let heading = "Member Contribution Detail";
    this.$emit("set-heading", heading);
  },

  data() {
    return {
      show_image: false,
      position: "right",
      contribution: {
        amount_deposited: 0,
        id: null,
        approve: false,
        balance: 0,
        payment_item_amount: 0,
        payment_item_id: null,
        payment_item_complusory: "",
        payment_item_name: null,
        comment: null,
        code: null,
        type: "",
        created_at: null,
        updated_by: null,
        status: null,
        user_id: null,
        user_name: null,
        user_telephone: null,
      },
    };
  },
  computed: {
    getFormatedCreatedDate() {
      return moment(this.$store.getters.getSelectedContribution.created_at).format(
        "MMMM Do YYYY"
      );
    },

    getSelectedContribution() {
      return this.$store.getters.getSelectedContribution;
    },

    computeTotalAmountContributed() {
      return this.computeTotal(this.$store.getters.getMemberContributions);
    }
  },
  methods: {
    editContribution(data) {
      let payload = {
        data: data,
        current_tab: "Edit Member Contribution",
        right: true,
      };

      let id = this.getOrganisationId;

      if(this.$store.getters.getMembers.length == 0) {
        this.getOrganisationMembers(id, false);
      }

      this.$emit("edit-contribution", payload);
    }

  },
};
</script>

<style lang="scss" scoped>
.unapproved_color {
  color: #f2994a;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
}

.approved_color {
  color: #27ae60;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
}


.label {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $grey5;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
  color: $dark;
}

.value_comment {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 27px;
  text-align: start;
  letter-spacing: 0.005em;
  color: $dark;
}

.image {
  height: 100px;
  width: 100px;
}

.image_card {
  width: 100%;
  max-width: 150px;
  cursor: pointer;
}

.card {
  width: 100%;
}

.value_name {
  padding-left: 2.5rem;
}

.value_item {
  padding-left: 3.5rem;
}

.value_amount {
  padding-left: 0.2rem;
}

.value_date {
  padding-left: 3.6rem;
}

.value_trxn {
  padding-left: 1.9rem;
}

.value_status {
  padding-left: 3rem;
}

.value_code {
  padding-left: 2.4rem;
}

.value_amount_paid {
  padding-left: 6rem;
}

.value_amount_total {
  padding-left: 1.8rem;
}

.value_balance {
  padding-left: 6rem;
}

.button {
  width: 90px;
}

.value_complusory {
  padding-left: 4.4rem;
}

.value_created_by {
  padding-left: 5rem;
}

.pending_color {
  color: $info;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
}
</style>
