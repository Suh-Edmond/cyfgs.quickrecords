<template>
  <div class="q-pa-md">
    <div class="q-ml-sm q-mb-lg">
      <label class="instruction_info"
        >All fields with <span class="text-red">*</span> are required</label
      >
    </div>
    <div class="q-px-sm">
      <q-form @submit="onAddSponsorship" class="q-gutter-md">
        <div>
          <div class="q-mb-md">
            <label for="name" class="form_field"
              >Payment Activity <span class="text-red">*</span>
            </label>
            <q-select
              outlined
              dense
              v-model="sponsorship.payment_item_id"
              placeholder="Type name to search..."
              :options="getPaymentActivities"
              input-debounce="0"
            >
            </q-select>
          </div>
          <div>
            <div class="q-mb-md">
              <label for="name" class="form_field"
                >Sponsor's Name <span class="text-red">*</span>
              </label>
              <q-input outlined dense v-model="sponsorship.supporter">
              </q-input>
            </div>
            <div class="q-mb-md">
              <label for="credential" class="form_field"
                >Amount Deposited(XAF)<span class="text-red">*</span></label
              >
              <q-input
                v-model.lazy="sponsorship.amount_deposited"
                outlined
                dense
                type="number"
              >
              </q-input>
            </div>
            <div class="q-mb-md">
              <label for="credential" class="form_field">Comment </label>
              <q-input
                v-model="sponsorship.comment"
                outlined
                dense
                type="textarea"
                placeholder="Provide any comment about this sponsorship"
              />
            </div>
            <div class="row q-mt-lg justify-end">
              <div class="col-md-2 col-sm-2 col-xs-2">
                <ButtonVue
                  class="form_button"
                  label="Save"
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
    let heading = "Sponsorship Information";

    this.$emit("set-heading", heading);
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

    getPaymentActivities() {
      let data = [];
      this.$store.getters.getPaymentActivities.forEach((ele) => {
        data.push({
          label: ele.name,
          value:ele.id,
          amount:ele.amount
        })
      })
      return data;
    }
  },
  methods: {
    onAddSponsorship() {
      this.loading = true;
      let payload = {
        url: `/api/protected/activity-supports`,
        data: {
          supporter:this.sponsorship.supporter,
          payment_item_id: this.sponsorship.payment_item_id.value,
          amount_deposited:this.sponsorship.amount_deposited,
          comment:this.sponsorship.comment
        },
        msg: "Sponsorship saved Successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store
        .dispatch("postRequest", payload)
        .then(() => {
          this.resetForm();
          this.getSponsorships(payload.data.payment_item_id);
        })
        .finally(() => {
          this.$emit("close-right-drawer");
          this.loading = false;
        });
    },


    resetForm() {
      this.sponsorship.supporter = null;
      this.sponsorship.amount_deposited = 0.0;
      this.sponsorship.comment = null;
      this.sponsorship.payment_item_id = null;

      return this.sponsorship;
    },
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
  font-weight: 500;
  font-size: 11px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.instruction_info {
  color: $grey2;
}
</style>
