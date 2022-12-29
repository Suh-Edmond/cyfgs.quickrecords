<template>
  <div class="q-pa-lg">
    <div class="q-mt-sm">
      <div class="flex q-pb-md">
        <label for="name" class="field"
          >Name:
          <span class="field_value field_name">{{
            income_activity.name
          }}</span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="field"
          >Amount:
          <span class="field_value q-pl-md"
            >{{ Number(income_activity.amount).toLocaleString() }} XAF</span
          ></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="field"
          >Date:
          <span class="field_value field_date">{{
            getFormatIncomeDate
          }}</span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="field"
          >Venue:
          <span class="field_value field_venue">{{
            income_activity.venue
          }}</span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="status" class="field" v-show="!income_activity.approve"
          >Status:
          <span class="item_statue unapproved_color">UNAPPROVED</span></label
        >
        <label for="status" class="field" v-show="income_activity.approve"
          >Status:
          <span class="item_statue approved_color"> APPROVED</span></label
        >
      </div>
      <!-- <div class="q-mb-md">
        <label for="amount" class="field"
          >Created Date:
          <span class="field_value detail_date">
            {{ getFormatIncomeCreatedDate }}
          </span></label
        >
      </div> -->

      <div class="q-mb-md">
        <label for="amount" class="field"
          >Created By:
          <span class="field_value detail_created_by">
            {{ income_activity.updated_by }}
          </span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="field">Comment: </label>
        <p>{{ income_activity.description }}</p>
      </div>

      <!-- <div class="flex">
        <q-card class="image_card" @click="show_image = true">
          <q-img src="https://cdn.quasar.dev/img/mountains.jpg" basic>
            <div class="absolute-bottom text-caption text-center">
              Uploaded Image
            </div>
          </q-img>
        </q-card>
      </div> -->
    </div>
    <q-dialog v-model="show_image" :position="position">
      <q-card
        style="width: 360px"
        :class="$q.screen.lg ? 'q-mr-md' : 'q-mx-sm'"
      >
        <q-bar>
          <div></div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div>
            <q-img
              src="https://cdn.quasar.dev/img/mountains.jpg"
              spinner-color="white"
              style="height: 100%; width: 100%px"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  created() {
    let heading = "Income Activity Information";
    this.$emit("set-heading", heading);
  },

  mounted() {
    this.getCurrentIncomeActivity();
  },

  data() {
    return {
      show_image: false,
      position: "right",
      income_activity: {
        venue: null,
        date: null,
        name: null,
        description: null,
        amount: 0,
        id: null,
        organisation_id: null,
        approve: null,
        created_at: null,
        updated_by: null,
      },
    };
  },

  computed: {
    getEditState() {
      return this.$store.getters.getEditState;
    },

    getFormatIncomeCreatedDate() {
      return moment(
        this.$store.getters.getCurrentIncomeActivity.created_at
      ).format("MMMM Do YYYY");
    },

    getFormatIncomeDate() {
      return moment(this.$store.getters.getCurrentIncomeActivity.date).format(
        "MMMM Do YYYY"
      );
    },
  },

  methods: {
    getCurrentIncomeActivity() {
      this.income_activity.name =
        this.$store.getters.getCurrentIncomeActivity.name;
      this.income_activity.date =
        this.$store.getters.getCurrentIncomeActivity.date;
      this.income_activity.venue =
        this.$store.getters.getCurrentIncomeActivity.venue;
      this.income_activity.description =
        this.$store.getters.getCurrentIncomeActivity.description;
      this.income_activity.organisation_id =
        this.$store.getters.getCurrentIncomeActivity.organisation_id;
      this.income_activity.amount =
        this.$store.getters.getCurrentIncomeActivity.amount;
      this.income_activity.id = this.$store.getters.getCurrentIncomeActivity.id;
      this.income_activity.approve =
        this.$store.getters.getCurrentIncomeActivity.approve;
      this.income_activity.created_at =
        this.$store.getters.getCurrentIncomeActivity.created_at;
      this.income_activity.updated_by =
        this.$store.getters.getCurrentIncomeActivity.updated_by;

      return this.income_activity;
    },
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
.field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $grey5;
}

.field_venue {
  padding-left: 1.7rem;
}

.item_statue {
  padding-left: 1.7rem;
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
.field_name {
  padding-left: 1.6rem;
}

.field_date {
  padding-left: 2.4rem;
}

.detail_created_by {
  padding-left: 0.2rem;
}
</style>
