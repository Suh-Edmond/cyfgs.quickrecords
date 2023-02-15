<template>
  <div class="q-pa-lg">
    <div class="q-mt-sm">
      <div class="flex q-pb-md">
        <label for="name" class="field"
          >Name:
          <span class="field_value field_name">{{
            getCurrentIncomeActivity.name
          }}</span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="field"
          >Amount:
          <span class="field_value q-pl-md"
            >{{ Number(getCurrentIncomeActivity.amount).toLocaleString() }} XAF</span
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
            getCurrentIncomeActivity.venue
          }}</span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="status" class="field" v-show="getCurrentIncomeActivity.approve == 'DECLINED'"
          >Status:
          <span class="item_statue unapproved_color">{{getCurrentIncomeActivity.approve}}</span></label
        >
        <label for="status" class="field" v-show="getCurrentIncomeActivity.approve == 'APPROVED'"
          >Status:
          <span class="item_statue approved_color"> {{getCurrentIncomeActivity.approve}}</span></label
        >
        <label for="status" class="field" v-show="getCurrentIncomeActivity.approve == 'PENDING'"
          >Status:
          <span class="item_statue pending_color"> {{getCurrentIncomeActivity.approve}}</span></label
        >
      </div>

      <div class="q-mb-md">
        <label for="amount" class="field"
          >Created By:
          <span class="field_value detail_created_by">
            {{ getCurrentIncomeActivity.updated_by }}
          </span></label
        >
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="field">Comment: </label><br/>
        <div>{{ getCurrentIncomeActivity.description }}</div>
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
  data() {
    return {
      show_image: false,
      position: "right",
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

    getCurrentIncomeActivity(){
      return this.$store.getters.getCurrentIncomeActivity;
    }
  },
  methods: {
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
.pending_color {
  color: $info;
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
