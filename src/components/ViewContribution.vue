<template>
  <div class="q-pa-md">
    <div class="q-mt-sm">
      <div class="flex q-pb-md">
        <label for="name" class="label">Payment Item:
          <span class="value value_item">{{ contribution.payment_item_name }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Total Amount Payable:
          <span class="value value_amount">{{ Number(contribution.payment_item_amount).toLocaleString() }}
            XAF</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Complusory:
          <span class="value value_complusory"
            :class="contribution.complusory ? 'text-secondary' : 'text-negative'">{{ contribution.complusory }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Member's Name:
          <span class="value value_name">{{ contribution.user_name }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Amount Paid:
          <span class="value value_amount_paid">{{ Number(contribution.amount_deposited).toLocaleString() }}
            XAF</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Balance: <span
            class="value value_balance">{{ Number(contribution.balance).toLocaleString() }} XAF</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Payment Date:
          <span class="value value_date">{{ getFormatedCreatedDate }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="status" class="label" v-show="!contribution.approve">Transaction Status:
          <span class=" value_trxn unapproved_color">UNAPPROVED</span></label>
        <label for="status" class="label" v-show="contribution.approve">Transaction Status:
          <span class=" value_trxn approved_color"> APPROVED</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label" v-show="contribution.status == 'INCOMPLETE'">Payment Status:
          <span class="unapproved_color q-pl-md value_status">{{ contribution.status }}</span></label>

        <label for="name" class="label" v-show="contribution.status == 'COMPLETE'">Payment Status:
          <span class="value text-secondary q-pl-md value_status">{{ contribution.status }}</span></label>
      </div>
      <div class="flex q-pb-lg">
        <label for="name" class="label">Transaction code:
          <span class="value  q-pl-md value_code">{{ contribution.code }}</span></label>
      </div>
      <div class="flex q-pb-lg">
        <label for="name" class="label">Created By:
          <span class="value  q-pl-md value_created_by">{{ contribution.updated_by }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">Comment: </label>
        <p class="value_comment">
          {{ contribution.comment }}
        </p>
      </div>
    </div>
    <div align="end" class="q-mt-md">
      <q-btn color="primary" no-caps size="md" round @click="editContribution">
        <q-icon name="edit" size="xs"></q-icon>
      </q-btn>
    </div>
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



export default {
  mounted() {
    let heading = "Member Contribution Detail";
    this.$emit("set-heading", heading);

    this.getSelectedContribution();
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
        payment_item_complusory: true,
        payment_item_name: null,
        complusory: true,
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
    }
  },
  methods: {
    editContribution(data) {
      let payload = {
        data: data,
        current_tab: "Members Contributions",
        right: true,
      };
      this.$emit("edit-contribution", payload);
    },


    getSelectedContribution() {
      this.contribution.amount_deposited = this.$store.getters.getSelectedContribution.amount_deposited
      this.contribution.approve = this.$store.getters.getSelectedContribution.approve
      this.contribution.balance = this.$store.getters.getSelectedContribution.balance
      this.contribution.code = this.$store.getters.getSelectedContribution.code
      this.contribution.comment = this.$store.getters.getSelectedContribution.comment
      this.contribution.created_at = this.$store.getters.getSelectedContribution.created_at
      this.contribution.id = this.$store.getters.getSelectedContribution.id
      this.contribution.name = this.$store.getters.getSelectedContribution.name
      this.contribution.payment_item_amount = this.$store.getters.getSelectedContribution.payment_item_amount
      this.contribution.payment_item_complusory = this.$store.getters.getSelectedContribution.complusory
      this.contribution.payment_item_id = this.$store.getters.getSelectedContribution.payment_item_id
      this.contribution.payment_item_name = this.$store.getters.getSelectedContribution.payment_item_name
      this.contribution.status = this.$store.getters.getSelectedContribution.status
      this.contribution.type = this.$store.getters.getSelectedContribution.type
      this.contribution.updated_by = this.$store.getters.getSelectedContribution.updated_by
      this.contribution.user_id = this.$store.getters.user_id
      this.contribution.user_name = this.$store.getters.getSelectedContribution.user_name
      this.contribution.user_telephone = this.$store.getters.getSelectedContribution.user_telephone

      return this.contribution;
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
  font-size: 13px;
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
  padding-left: 4rem;
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
</style>
