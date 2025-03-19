<template>
  <div>
    <div :class="$q.platform.is.mobile ? 'q-mt-sm' : 'q-ml-md'">
      <q-table
        :data="data"
        :columns="columns"
        row-key="index"
        :table-header-style="{
          backgroundColor: '#213c65',
          color: '#FFFFFF',
        }"
        :loading="loading"
        flat
      >
        <template v-slot:top-left>
          <label   class="title">{{ table_header }}</label>
        </template>
        <template v-slot:top-right>
          <q-btn
            label="Add"
            dense
            size="sm"
            color="primary"
            no-caps
            class="q-pa-xs"
            icon-right="add"
            @click="show_add_fee = true"
          >
            <q-tooltip> {{ $t("app.addRegFee") }} </q-tooltip>
          </q-btn>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="amount" :props="props" class="table_value">
              {{ Number(props.row.amount).toLocaleString() }}
            </q-td>
            <q-td key="frequency" :props="props" class="table_value">
              {{ props.row.frequency }}
            </q-td>
            <q-td
              key="status"
              :props="props"
              class="table_value"
              :class="
                props.row.status === 'ACTIVE'
                  ? 'status_active'
                  : 'status_in_active'
              "
            >
              {{ formatConstants(props.row.status) }}
            </q-td>
            <q-td
              key="is_complusory"
              :props="props"
              v-if="props.row.is_compulsory"
              class="table_value"
            >
              {{ $t("app.yes") }}
            </q-td>
            <q-td
              key="is_complusory"
              :props="props"
              v-if="!props.row.is_compulsory"
              class="table_value"
            >
              {{ $t("app.no") }}
            </q-td>
            <q-td key="updated_by" :props="props" class="table_value">
              {{ props.row.updated_by }}
            </q-td>
            <q-td key="updated_at" :props="props" class="table_value">
              {{ props.row.updated_at }}
            </q-td>
            <q-td key="action" :props="props">
              <q-icon
                name="edit"
                size="xs"
                class="edit_fee"
                @click="editFee(props.row)"
              >
                <q-tooltip>{{ $t("app.edit") }}</q-tooltip>
              </q-icon>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
    </div>

    <!--add registration fee -->
    <q-dialog v-model="show_add_fee">
      <q-card
        :style="$q.platform.is.desktop ? 'width: 350px' : 'width: 450px'"
        class="q-pt-sm q-pb-md"
        :class="$q.platform.is.desktop?'q-px-sm':''"
      >
        <q-card-section class="row">
          <div class="text-h6 add_year" v-if="fee.id == null">
            {{ $t("app.addRegFee") }}
          </div>
          <div class="text-h6 add_year" v-else>
            {{ $t("app.updateRegFee") }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup size="sm" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onAddFee" class="q-gutter-md">
            <div>
              <label class="form_field"
                >{{ $t("app.amount") }} <span class="text-red">*</span></label
              >
              <q-input v-model="fee.amount" outlined dense type="number" />
            </div>
            <div class="flex">
              <div>
                <label class="form_field"
                  >{{ $t("app.compulsoryLabel") }}
                  <span class="text-red">*</span></label
                >
              </div>
              <div class="q-gutter-sm q-ml-lg">
                <q-radio
                  dense
                  v-model="fee.is_compulsory"
                  :val="true"
                  :label="$t('app.yes')"
                  size="xs"
                />
                <q-radio
                  dense
                  v-model="fee.is_compulsory"
                  :val="false"
                  :label="$t('app.no')"
                  size="xs"
                />
              </div>
            </div>
            <div>
              <label class="form_field"
                >{{ $t("app.status") }} <span class="text-red">*</span></label
              >
              <q-select
                v-model="fee.status"
                outlined
                dense
                :options="statuses"
              />
            </div>
            <div>
              <label class="form_field"
                >{{ $t("app.frequency") }}
                <span class="text-red">*</span></label
              >
              <q-select
                v-model="fee.frequency"
                outlined
                dense
                :options="frequencies"
              />
            </div>
            <div class="flex q-mt-lg justify-end" v-if="$q.platform.is.desktop">
              <ButtonVue
                class="form_button"
                :label="$t('app.saveBtnLabel')"
                :loading="is_fetching"
                :color="'primary'"
                :disabled="fee.amount === 0"
                :no_caps="true"
              >
              </ButtonVue>
            </div>
            <div class="q-mt-lg" v-if="$q.platform.is.mobile">
              <ButtonVue
                class="full-width"
                :label="$t('app.saveBtnLabel')"
                :loading="is_fetching"
                :color="'primary'"
                :disabled="fee.amount === 0"
                :no_caps="true"
              >
              </ButtonVue>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--end add registration fee -->
  </div>
</template>

<script>
import ButtonVue from "./Button.vue";
import RegistrationFreqencyVue from "./Constants/RegistrationFreqency.vue";
import ConfirmDialog from "./ConfirmDialog.vue";
import SessionStatusVue from "./Constants/SessionStatus.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";

export default {
  mixins: [HelperMixin],
  props: {
    data: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    table_header: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      show_add_fee: false,
      fee: {
        amount: 0.0,
        frequency: RegistrationFreqencyVue.YEARLY,
        is_compulsory: true,
        id: null,
        status: SessionStatusVue.ACTIVE,
      },
      is_fetching: false,
      frequencies: [
        RegistrationFreqencyVue.YEARLY,
        RegistrationFreqencyVue.MONTHLY,
      ],
      statuses: [SessionStatusVue.ACTIVE, SessionStatusVue.IN_ACTIVE],
      show_confirm_dialog: false,
    };
  },
  methods: {
    editFee(data) {
      this.show_add_fee = true;
      this.fee.amount = data.amount;
      this.fee.frequency = data.frequency;
      this.fee.id = data.id;
      this.fee.status = data.status;

      return this.fee;
    },

    onAddFee() {
      this.is_fetching = true;
      let payload = {
        url:
          this.fee.id == null
            ? `/api/protected/registration_fees`
            : `/api/protected/registration_fees/${this.fee.id}`,
        data: this.fee,
        msg:
          this.fee.id == null
            ? this.$t("app.saveRegFeeSuccessMsg")
            : this.$t("app.saveRegFeeSuccessMsg"),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store
        .dispatch(this.fee.id == null ? "postRequest" : "putRequest", payload)
        .then(() => {
          this.is_fetching = false;
          this.$emit("fetch-registration-fee");
          this.show_add_fee = false;
        })
        .finally(() => {
          this.fee.amount = 0.0;
          this.fee.frequency = RegistrationFreqencyVue.YEARLY;
          this.fee.id = null;
          this.fee.status = null;
        });
    },

    cancelDialog() {
      this.show_confirm_dialog = false;
    },

    fetchRegistrationFee() {
      this.$emit("fetch-registration-fee");
    },
  },
  components: {
    ButtonVue,
  },
};
</script>

<style lang="scss" scoped>
.add_year {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: medium;
}

.title {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
}

.edit_fee {
  color: $primary;
  cursor: pointer;
}

.status_active {
  color: $secondary;
}

.status_in_active {
  color: $orange;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.7rem;
  align-items: center;
  color: $grey5;
}

.table_value {
  font-size: 0.7rem;
  font-weight: 500;
}
</style>
