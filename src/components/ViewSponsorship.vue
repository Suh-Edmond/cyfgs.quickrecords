<template>
  <div class="q-pa-md">
    <div class="flex justify-between q-pb-md">
      <div>
        <label for="name" class="label"
          ><span> <q-icon name="category" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.paymentItem") }}
        </label>
      </div>
      <div>
        <label class="value">
          {{ getSelectedSponsorship.payment_item.name }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label for="name" class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.sponsorNameLabel") }}
        </label>
      </div>
      <div>
        <label class="value">
          {{ getSelectedSponsorship.supporter }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label for="name" class="label">
          <span>
            <q-icon name="monetization_on" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.amount") }}
        </label>
      </div>

      <div>
        <label class="value">
          {{ Number(getSelectedSponsorship.amount_deposited).toLocaleString() }}
          XAF
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <label for="name" class="label"
        ><span> <q-icon name="schedule" size="xs" class="q-pr-sm" /> </span
        >{{ $t("app.paymentDate") }}
      </label>
      <div>
        <label class="value">
          {{ getFormatedCreatedDate }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <div>
        <label for="status" class="label"
          ><span>
            <q-icon name="check_circle" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.transactionStatus") }}
        </label>
      </div>

      <div>
        <label
          class="value text-secondary"
          v-show="getSelectedSponsorship.approve == 'APPROVED'"
        >
          {{ getSelectedSponsorship.approve }}
        </label>
        <label
          class="value text-orange"
          v-show="getSelectedSponsorship.approve == 'DECLINED'"
        >
          {{ getSelectedSponsorship.approve }}
        </label>
        <label
          class="value text-info"
          v-show="getSelectedSponsorship.approve == 'PENDING'"
        >
          {{ getSelectedSponsorship.approve }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-md">
      <label for="name" class="label"
        ><span> <q-icon name="badge" size="xs" class="q-pr-sm" /> </span
        >{{ $t("app.transactionCode") }}</label
      >

      <div>
        <label class="value">
          {{ getSelectedSponsorship.code }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-lg">
      <div>
        <label for="name" class="label"
          ><span> <q-icon name="person" size="xs" class="q-pr-sm" /> </span
          >{{ $t("app.createdBy") }}
        </label>
      </div>

      <div>
        <label class="value">
          {{ getSelectedSponsorship.updated_by }}
        </label>
      </div>
    </div>
    <div class="flex justify-between q-pb-xs">
      <label for="name" class="label"
        ><span> <q-icon name="description" size="xs" class="q-pr-sm" /> </span
        >{{ $t("app.comment") }}
      </label>
      <div
        class="value detail-value wrap"
        v-show="getSelectedSponsorship.comment !== null"
      >
        {{ getSelectedSponsorship.comment }}
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import SponsorshipMixin from "src/mixins/SponsorshipMixin.vue";

export default {
  mixins: [SponsorshipMixin],
  mounted() {
    let heading = this.$t("app.sponsorshipHeading");
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
      return (
        this.sponsorship.supporter === null ||
        this.sponsorship.amount_deposited == 0 ||
        this.sponsorship.payment_item_id == null
      );
    },
    getFormatedCreatedDate() {
      console.log(this.$store.getters.getSelectedSponsorship);
      return moment(this.getSelectedSponsorship.created_at).format(
        "MMMM Do YYYY"
      );
    },

    getSelectedSponsorship() {
      const id = this.$store.getters.getSelectedSponsorship.id;
      return this.$store.getters.getSponsorships.data.filter(
        (ele) => ele.id == id
      )[0];
    },
  },
  methods: {},

  components: {},
};
</script>

<style lang="scss" scoped>
.label {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 0.7rem;
  color: $grey5;
}
.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.7rem;
  color: $grey8;
}

.detail-value {
  max-width: 250px;
}
</style>
