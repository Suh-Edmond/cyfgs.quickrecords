<template>
  <div class="q-pa-sm">
    <div class="text_h6 text-center q-pt-xs q-pb-md add_member_title">
      Member Contribution Detail

    </div>
    <div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Payment Item:
          <span class="value value_item">Harvest Thanksgiven 2022</span></label>
      </div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Total Amount Payable:
          <span class="value value_amount">30000 XAF</span></label>
      </div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Member's Name:
          <span class="value value_name">Nkom Emmaunual</span></label>
      </div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Amount Paid:
          <span class="value value_amount_paid">20000 XAF</span></label>
      </div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Balance:
          <span class="value value_balance">10000 XAF</span></label>
      </div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Date:
          <span class="value value_date">Monday 31st October 2022</span></label>
      </div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Venue:
          <span class="value value_venue">Sandpit Bakweri Town</span></label>
      </div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Status:
          <span class="value text-secondary q-pl-md value_status">COMPLETE</span></label>
      </div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Comment:
        </label>
        <p class="value_comment">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic debitis veritatis dicta
          ipsum
          quibusdam nihil, molestias ea soluta nam reiciendis. Repudiandae itaque consectetur laboriosam eum maxime, vel
          maiores quidem ipsa.</p>
      </div>
      <div class="flex" v-if="show_image">
        <q-card class="image_card" @click="show_image = true">
          <q-img src="https://cdn.quasar.dev/img/mountains.jpg" basic>
            <div class="absolute-bottom text-caption text-center">
              Uploaded Image
            </div>
          </q-img>
        </q-card>
      </div>
    </div>
    <div align="end" class="q-mt-md">
      <q-btn color="primary" no-caps size="md" round @click="editContribution">
       <q-icon name="edit" size="xs"></q-icon>
      </q-btn>
    </div>
    <q-dialog v-model="show_image" :position="position">
      <q-card style="width: 360px" :class="$q.screen.lg?'q-mr-md':'q-mx-sm'">
        <q-bar>
          <div></div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div>
            <q-img src="https://cdn.quasar.dev/img/mountains.jpg" spinner-color="white" style="height: 100%; width: 100%px" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

</template>

<script>
export default {
  data() {
    return {
      show_image: false,
      position: "right",
    };
  },
  computed: {

  },
  methods: {
    editContribution(data){
      let payload = {
        data: data,
        current_tab: "Members Contributions",
        right: true
      };
      this.$emit("edit-contribution",payload);
    }
  }
};
</script>

<style lang="scss" scoped>
.add_member_title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 29px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.01em;
  color: $primary;
  text-transform: capitalize;
}

.label {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 24px;
  text-align: start;
  letter-spacing: 0.01em;
  color: $grey2;

}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 27px;
  text-align: right;
  letter-spacing: 0.005em;
  color: $dark;
  // padding-left: 1rem;
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
  padding-left: 2.2rem;
}
.value_item {
  padding-left: 3rem;
}
.value_amount {
  padding-left: .2rem;
}
.value_date {
  padding-left: 6.5rem;
}
.value_venue {
  padding-left:6rem;
}
.value_status {
  padding-left: 6rem;
}
.value_amount_paid {
  padding-left: 3.5rem;
}

.value_balance {
  padding-left: 5.2rem;
}

.button {
  width: 90px;
}
</style>
