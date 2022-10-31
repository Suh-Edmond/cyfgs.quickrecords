<template>
  <div class="q-pa-sm">
    <div class="text_h6 text-center q-pt-xs q-pb-md add_member_title">
      Income Activity Information
    </div>
    <div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Name:
          <span class="value q-pl-md">Singing during in a Visit to Mr Nkom Emmaunual</span></label>
      </div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Amount:
          <span class="value q-pl-sm">30000 XAF</span></label>
      </div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Date:
          <span class="value q-pl-lg">Monday 31st October 2022</span></label>
      </div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Venue:
          <span class="value q-pl-md">Sandpit Bakweri Town</span></label>
      </div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Status:
          <span class="value text-secondary q-pl-md">APPROVED</span></label>
      </div>
      <div class="flex q-pb-sm">
        <label for="name" class="label">Comment:
        </label>
        <p class="value_comment">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic debitis veritatis dicta
          ipsum
          quibusdam nihil, molestias ea soluta nam reiciendis. Repudiandae itaque consectetur laboriosam eum maxime, vel
          maiores quidem ipsa.</p>
      </div>

      <div class="flex">
        <q-card class="image_card" @click="show_image = true">
          <q-img src="https://cdn.quasar.dev/img/mountains.jpg" basic>
            <div class="absolute-bottom text-caption text-center">
              Uploaded Image
            </div>
          </q-img>
        </q-card>
      </div>
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
  computed:{

  },
  methods:{

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
</style>
