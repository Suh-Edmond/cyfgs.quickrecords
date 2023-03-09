<template>
  <div class="q-pa-md">
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios color="primary" size="2em" class="q-mb-lg" v-if="getLoadingState" />
    </div>
    <div class="q-mt-sm" v-if="!show_edit_form">
      <div class="flex q-pb-md">
        <label for="name" class="label"><span> <q-icon name="category" size="xs" /> </span> Payment Activity:
          <span class="value value_item">{{
            getSelectedSponsorship.payment_item.name
          }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"><span> <q-icon name="person" size="xs" /> </span> Sponsor's Name:
          <span class="value value_name">{{
            getSelectedSponsorship.supporter
          }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label">
          <span> <q-icon name="monetization_on" size="xs" /> </span> Amount:
          <span class="value value_amount">{{
            Number(getSelectedSponsorship.amount_deposited).toLocaleString()
          }}
            XAF</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"><span> <q-icon name="schedule" size="xs" /> </span> Payment Date:
          <span class="value value_date">{{
            getFormatedCreatedDate
          }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="status" class="label" v-show="getSelectedSponsorship.approve == 'DECLINED'"><span> <q-icon
              name="check_circle" size="xs" /> </span> Transaction
          Status:
          <span class="value_trxn unapproved_color">{{
            getSelectedSponsorship.approve
          }}</span></label>
        <label for="status" class="label" v-show="getSelectedSponsorship.approve == 'APPROVED'"><span> <q-icon
              name="check_circle" size="xs" /> </span> Transaction
          Status:
          <span class="value_trxn approved_color">
            {{ getSelectedSponsorship.approve }}</span></label>
        <label for="status" class="label" v-show="getSelectedSponsorship.approve == 'PENDING'"><span> <q-icon
              name="check_circle" size="xs" /> </span> Transaction
          Status:
          <span class="value_trxn pending_color">
            {{ getSelectedSponsorship.approve }}</span></label>
      </div>
      <div class="flex q-pb-md">
        <label for="name" class="label"><span> <q-icon name="badge" size="xs" /> </span> Transaction code:
          <span class="value q-pl-md value_code">{{
            getSelectedSponsorship.code
          }}</span></label>
      </div>
      <div class="flex q-pb-lg">
        <label for="name" class="label"><span> <q-icon name="person" size="xs" /> </span> Created By:
          <span class="value q-pl-md value_created_by">{{
            getSelectedSponsorship.updated_by
          }}</span></label>
      </div>
      <div class="flex q-pb-xs">
        <label for="name" class="label"><span> <q-icon name="description" size="xs" /> </span> Comment:
        </label>
      </div>
      <p class="value_comment">
        {{ getSelectedSponsorship.comment }}
      </p>
    </div>

    <div v-if="show_edit_form">
      <div class="q-ml-sm q-mb-lg">
        <label class="instruction_info">All fields with <span class="text-red">*</span> are required</label>
      </div>
      <div class="q-px-sm">
        <q-form @submit="onUpdateSponsorship" class="q-gutter-md">
          <div>
            <div class="q-mb-md">
              <label for="name" class="form_field">Payment Activity <span class="text-red">*</span>
              </label>
              <q-select outlined dense v-model="sponsorship.payment_item_id" placeholder="Type name to search..."
                :options="getPaymentActivities" input-debounce="0">
              </q-select>
            </div>
            <div class="q-mb-md">
              <label for="name" class="form_field">Sponsor's Name <span class="text-red">*</span>
              </label>
              <q-input outlined dense v-model="sponsorship.supporter">
              </q-input>
            </div>
            <div class="q-mb-md">
              <label for="credential" class="form_field">Amount Deposited(XAF)<span class="text-red">*</span></label>
              <q-input v-model.lazy="sponsorship.amount_deposited" outlined dense type="number">
              </q-input>
            </div>
            <div class="q-mb-md">
              <label for="credential" class="form_field">Comment </label>
              <q-input v-model="sponsorship.comment" outlined dense type="textarea"
                placeholder="Provide any comment about this sponsorship" />
            </div>
            <div class="flex q-mt-lg justify-end">
              <div class="q-mr-xl">
                <q-btn label="Cancel" :disabled="validateForm" no-caps color="primary" outline
                  @click="show_edit_form = !show_edit_form">
                </q-btn>
              </div>
              <div>
                <ButtonVue class="form_button" label="Save" :loading="loading" :color="'primary'" :disabled="validateForm"
                  :no_caps="no_caps">
                </ButtonVue>
              </div>
            </div>
          </div>
        </q-form>
      </div>
    </div>
    <!-- edit sponsorship -->
    <div align="end" class="q-mt-xl" v-if="!show_edit_form">
      <q-btn color="primary" no-caps size="sm" round @click="editSponsorship">
        <q-icon name="edit" size="xs"></q-icon>
        <q-tooltip>Edit Sponsorship</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import ButtonVue from "src/components/Button.vue";
import SponsorshipMixin from "src/mixins/SponsorshipMixin.vue";

export default {
  mixins: [SponsorshipMixin],
  mounted() {
    let heading = "Sponsorship information";
    this.$emit("set-heading", heading);
  },

  data() {
    return {
      show_edit_form: false,
      loading: false,
      sponsorship: {
        supporter: null,
        payment_item_id: null,
        amount_deposited: 0,
        comment: null,
        id: null,
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
    getFormatedCreatedDate() {
      return moment(
        this.getSelectedSponsorship.created_at
      ).format("MMMM Do YYYY");
    },

    getSelectedSponsorship() {
      const id = this.$store.getters.getSelectedSponsorship.id;
      return this.$store.getters.getSponsorships.filter(ele => ele.id == id)[0];
    },

    getPaymentActivities() {
      let data = [];
      this.$store.getters.getPaymentActivities.forEach((ele) => {
        data.push({
          label: ele.name,
          value: ele.id,
          amount: ele.amount
        })
      })
      return data;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
  },
  methods: {
    editSponsorship() {
      let heading = "Update Sponsorship information";
      this.$emit("set-heading", heading);

      this.show_edit_form = !this.show_edit_form;

      const selected_sponsorship = this.getSelectedSponsorship;
      this.sponsorship.id = selected_sponsorship.id;
      this.sponsorship.supporter = selected_sponsorship.supporter;
      this.sponsorship.amount_deposited = parseFloat(selected_sponsorship.amount_deposited);
      (this.sponsorship.comment = selected_sponsorship.comment),
        (this.sponsorship.payment_item_id = {
          label: selected_sponsorship.payment_item.name,
          value: selected_sponsorship.payment_item.id,
          amount: selected_sponsorship.payment_item.amount,
        });

      return this.sponsorship;
    },

    onUpdateSponsorship() {
      const updated_sponsorship = this.getSelectedSponsorship;
      this.loading = true;
      let payload = {
        url: `/api/protected/activity-supports/${updated_sponsorship.id}`,
        data: {
          supporter: this.sponsorship.supporter,
          payment_item_id: this.sponsorship.payment_item_id.value,
          amount_deposited: this.sponsorship.amount_deposited,
          comment: this.sponsorship.comment
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
        .dispatch("putRequest", payload)
        .then(() => {
          this.getSponsorships(updated_sponsorship.payment_item.id);
          this.show_edit_form = !this.show_edit_form;
        })
        .finally(() => {
          this.loading = false;
          let heading = "Sponsorship information";
          this.$emit("set-heading", heading);
        });
    },
  },

  components: {
    ButtonVue,
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
  padding-left: 1.5rem;
}

.value_name {
  padding-left: 2.5rem;
}

.value_item {
  padding-left: 2.3rem;
}

.value_amount {
  padding-left: 5.7rem;
}

.value_date {
  padding-left: 3.5rem;
}

.value_trxn {
  padding-left: 1.5rem;
}

.value_code {
  padding-left: 2.1rem;
}

.value_created_by {
  padding-left: 4.5rem;
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
