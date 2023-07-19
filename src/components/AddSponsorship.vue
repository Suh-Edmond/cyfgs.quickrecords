<template>
  <div class="q-pa-md">
    <div class="q-ml-sm q-mb-lg">
      <label class="instruction_info"
        >{{ $t('app.warningField') }} <span class="text-red">*</span> {{$t('app.fields')}}</label
      >
    </div>
    <div class="q-px-sm">
      <q-form @submit="onAddSponsorship" class="q-gutter-md">
        <div>
          <div class="q-mb-md">
            <label for="name" class="form_field"
              >{{$t('app.paymentItem')}} <span class="text-red">*</span>
            </label>
            <q-select
              outlined
              dense
              v-model="sponsorship.payment_item_id"
              :options="payment_items"
              :label="$t('app.searchPaymentItem')"
              input-debounce="0"
              use-input
              clearable
              @filter="filterPaymentItems"
              @input="stopSearch"
              class="text_color"
            >
            <template v-slot:append v-if="start_filtering">
              <q-spinner color="primary" size="1.2em" :thickness="3" />
            </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    {{$t('app.noResults')}}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div>
            <div class="q-mb-md">
              <label for="name" class="form_field"
                >{{$t('app.sponsorNameLabel')}} <span class="text-red">*</span>
              </label>
              <q-input
                outlined
                dense
                v-model="sponsorship.supporter"
                class="text_color"
              >
              </q-input>
            </div>
            <div class="q-mb-md">
              <label for="credential" class="form_field"
                >{{$t('app.amountDeposited')}}<span class="text-red">*</span></label
              >
              <q-input
                v-model.lazy="sponsorship.amount_deposited"
                outlined
                dense
                type="number"
                class="text_color"
              >
              </q-input>
            </div>
            <div class="q-mb-md">
              <label for="credential" class="form_field">{{$t('app.comment')}} </label>
              <q-input
                v-model="sponsorship.comment"
                outlined
                dense
                class="text_color"
                type="textarea"
                placeholder="Provide any comment about this sponsorship"
              />
            </div>
            <div class="flex q-mt-lg justify-end">
              <div>
                <ButtonVue
                  class="form_button"
                  :label="$t('app.saveBtnLabel')"
                  :loading="loading"
                  :color="'primary'"
                  :disabled="validateForm"
                  :no_caps="no_caps"
                >
                </ButtonVue>
              </div>
            </div>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
import SponsorshipMixin from "src/mixins/SponsorshipMixin.vue";

export default {
  mixins: [SponsorshipMixin],

  mounted() {
    let heading = this.$t('app.sponsorshipHeading');

    this.$emit("set-heading", heading);
    this.getPaymentActivitiesFromStatus();
  },

  data() {
    return {
      loading: false,
      sponsorship: {
        supporter: null,
        payment_item_id: null,
        amount_deposited: 0,
        comment: null,
      },
      no_caps: true,
      payment_items: [],
      start_filtering:false,
    };
  },
  computed: {
    validateForm() {
      return this.sponsorship.supporter === null ||
        this.sponsorship.amount_deposited == 0 ||
        this.sponsorship.payment_item_id == null
        ? true
        : false;
    },
    getSelectedSponsorship() {
      return this.setFormField(this.$store.getters.getSelectedSponsorship);
    },
  },
  watch: {
    getSelectedSponsorship() {
      return this.setFormField(this.$store.getters.getSelectedSponsorship);
    },
  },

  methods: {
    onAddSponsorship() {
      this.loading = true;
      let saved_sponsorship_id =
        this.$store.getters.getSelectedSponsorship != null
          ? this.$store.getters.getSelectedSponsorship.id
          : null;
      let payload = {
        url: `/api/protected/activity-supports`,
        data: {
          supporter: this.sponsorship.supporter,
          payment_item_id: this.sponsorship.payment_item_id.value,
          amount_deposited: JSON.parse(this.sponsorship.amount_deposited),
          comment: this.sponsorship.comment,
        },
        msg: this.$t('app.addSponsorshipSuccessMsg'),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: this.$t('app.defaultErrorMsg'),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.dispatchAction(payload, saved_sponsorship_id);
    },

    resetForm() {
      this.sponsorship.supporter = null;
      this.sponsorship.amount_deposited = 0.0;
      this.sponsorship.comment = null;
      this.sponsorship.payment_item_id = null;

      return this.sponsorship;
    },

    dispatchAction(payload, id) {
      if (id == null) {
        this.$store
          .dispatch("postRequest", payload)
          .then(() => {
            this.getAllSponsorships();
            this.resetForm();
          })
          .finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
          });
      } else {
        payload.url = `/api/protected/activity-supports/${id}`;
        this.$store
          .dispatch("putRequest", payload)
          .then(() => {
            this.getAllSponsorships();
            this.resetForm();
          })
          .finally(() => {
            this.$emit("close-right-drawer");
            this.loading = false;
          });
      }
    },

    setFormField(data) {
      if (data != null) {
        this.sponsorship.id = data.id;
        this.sponsorship.amount_deposited = parseFloat(data.amount_deposited);
        this.sponsorship.comment = data.comment;
        this.sponsorship.supporter = data.supporter;
        this.sponsorship.payment_item_id = {
          label: data.payment_item.name,
          value: data.payment_item.id,
        };
      }

      return this.sponsorship;
    },

    filterPaymentItems(val, update, abort) {
      if (val < 2) {
        this.start_filtering = false;
        abort();
        return;
      }

      update(() => {
        this.start_filtering = true;
        this.payment_items = this.getPaymentActivitiesFromStatus().filter(
          (item) => item.label.toLowerCase().includes(val.toLowerCase())
        );
        return this.payment_items;
      });
    },

    getPaymentActivitiesFromStatus() {
      let payment_items = [];
      this.$store.getters.getPaymentActivities.forEach((ele) => {
        payment_items.push({
          label: ele.name,
          value: ele.id,
          amount: ele.amount,
        });
      });
      return payment_items;
    },


    stopSearch(){
      if(this.sponsorship.payment_item_id != null){
        this.start_filtering = false
      }
    }
  },
  components: {
    ButtonVue,
  },
};
</script>

<style scoped lang="scss">
.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.instruction_info {
  color: $grey2;
}

.text_color {
  color: $grey2;
}
</style>
