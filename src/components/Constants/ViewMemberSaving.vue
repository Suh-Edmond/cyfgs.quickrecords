<template>
  <div class="q-pa-lg">
    <div class="q-mt-md" v-if="getEditState">
      <div class="q-mb-md">
        <label for="name" class="field"
          >Member Name:
          <span class="field_value item_value">{{
            getCurrentMemberSaving.name
          }}</span></label
        >
      </div>
      <div class="q-mb-md">
        <label for="email" class="field"
          >Email:
          <span class="field_value item_venue">{{
            getCurrentMemberSaving.email
          }}</span></label
        >
      </div>
      <div class="q-mb-md">
        <label for="telephone" class="field"
          >Telephone:
          <span class="field_value item_tel">{{
            getCurrentMemberSaving.telephone
          }}</span></label
        >
      </div>
      <div class="q-mb-md">
        <label for="amount" class="field"
          >Amount Deposited:
          <span class="field_value item_amount">
            {{ getCurrentMemberSaving.amount_deposited }} XAF</span
          ></label
        >
      </div>
      <div class="q-mb-md">
        <label
          for="status"
          class="field"
          v-show="getCurrentMemberSaving.approve == 'UNAPPROVED'"
          >Status:
          <span class="field_value item_statue unapproved_color">
            UNAPPROVED</span
          ></label
        >
        <label
          for="status"
          class="field"
          v-show="getCurrentMemberSaving.approve == 'APPROVED'"
          >Status:
          <span class="field_value item_statue approved_color">
            APPROVED</span
          ></label
        >
      </div>
      <div class="q-mb-md">
        <label for="amount" class="field"
          >Created Date:
          <span class="field_value detail_date">
            {{ getFormatSavingCreatedDate }}
          </span></label
        >
      </div>

      <div class="q-mb-md">
        <label for="amount" class="field"
          >Created By:
          <span class="field_value detail_created_by">
            {{ getCurrentMemberSaving.updated_by }}
          </span></label
        >
      </div>
      <div class="q-mb-md">
        <label for="comment" class="field">Comment:</label>
        <p>{{ getCurrentMemberSaving.comment }}.</p>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";

export default {
  created() {
    let heading = "Member Saving Information";
    this.$emit("set-heading", heading);
  },

  data() {
    return {};
  },

  computed: {
    getCurrentMemberSaving() {
      return this.$store.getters.getCurrentMemberSaving;
    },

    getEditState() {
      return this.$store.getters.getEditState;
    },

    getFormatSavingCreatedDate() {
      return moment(
        this.$store.getters.getCurrentMemberSaving.created_at
      ).format("MMMM Do YYYY, h:mm:ss a");
    },
  },
};
</script>

<style lang="scss" scoped>
.field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;

  letter-spacing: 0.01em;
  color: $grey5;
}

.field_value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
  color: $dark;
}

.item_value {
  padding-left: 1.8rem;
}

.item_venue {
  padding-left: 5.8rem;
}

.item_tel {
  padding-left: 3.9rem;
}

.item_amount {
  padding-left: 0.7rem;
}

.item_statue {
  padding: 5.7rem;
}

.unapproved_color {
  color: #f2994a;
}

.approved_color {
  color: #27ae60;
}

.detail_date {
  padding-left: 3.2rem;
}

.detail_created_by {
  padding-left: 3.7rem;
}
</style>
