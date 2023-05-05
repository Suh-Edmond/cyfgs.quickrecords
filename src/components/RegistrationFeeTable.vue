<template>
  <div>
    <div class="row">
      <!-- add fee button -->
      <div class="col-12 q-mb-sm">
        <div class="flex justify-end">
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
            <q-tooltip> Add registration fee </q-tooltip>
          </q-btn>
        </div>
      </div>
      <!-- end of fee button -->

      <!-- not session has been set -->
      <div class="col-12 q-mt-lg" v-if="data.length == 0 && !loading">
        <NotFound
          :message="'Opps! Member Registration Fee has not been set. Please click the add button to set fee'"
        ></NotFound>
      </div>
      <!-- end of not found component -->

      <!-- table for registration fees -->
      <div class="col-md-12 col-xs-12 col-sm-12" v-if="data.length > 0">
        <q-table
          :data="data"
          :columns="columns"
          row-key="index"
          :table-header-style="{
            backgroundColor: '#5384ae',
            color: '#FFFFFF',
          }"
        >
          <template v-slot:top-left>
            <div>
              <label for="title" class="title">{{ table_header }}</label>
            </div>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" class="text-bold">
              <q-td key="counter" :props="props">
                {{ props.row.counter }}
              </q-td>
              <q-td key="amount" :props="props">
                {{ Number(props.row.amount).toLocaleString() }}
              </q-td>
              <q-td key="frequency" :props="props">
                {{ props.row.frequency }}
              </q-td>
              <q-td
                key="status"
                :props="props"
                :class="
                  props.row.status == 'ACTIVE'
                    ? 'status_active'
                    : 'status_in_active'
                "
              >
                {{ props.row.status }}
              </q-td>
              <q-td
                key="is_complusory"
                :props="props"
                v-if="props.row.is_compulsory"
              >
                YES
              </q-td>
              <q-td
                key="is_complusory"
                :props="props"
                v-if="!props.row.is_compulsory"
              >
                NO
              </q-td>
              <q-td key="action" :props="props">
                <q-icon
                  name="edit"
                  size="xs"
                  class="edit_fee q-mr-xl"
                  @click="editFee(props.row)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-icon>

                <q-icon
                  name="delete"
                  size="xs"
                  class="delete_fee q-ml-md"
                  @click="deleteFee(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-icon>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <!-- end table for registration fees -->
    </div>

    <!--add registration fee -->
    <q-dialog v-model="show_add_fee">
      <q-card style="min-width: 450px" class="q-px-md q-pt-sm q-pb-sm">
        <q-card-section class="row items-center q-pb-lg">
          <div class="text-h6 add_year" v-if="fee.id == null">Add Member's Registration Fee</div>
          <div class="text-h6 add_year" v-else>Update Member's Registration Fee</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onAddFee" class="q-gutter-md">
            <div>
              <label for="credential" class="form_field"
                >Amount <span class="text-red">*</span></label
              >
              <q-input v-model="fee.amount" outlined dense type="number" />
            </div>
            <div class="flex">
              <div>
                <label for="credential" class="form_field"
                  >Compulsory <span class="text-red">*</span></label
                >
              </div>
              <div class="q-gutter-sm q-ml-lg">
                <q-radio
                  dense
                  v-model="fee.is_compulsory"
                  :val="true"
                  label="YES"
                  size="xs"
                />
                <q-radio
                  dense
                  v-model="fee.is_compulsory"
                  :val="false"
                  label="NO"
                  size="xs"
                />
              </div>
            </div>
            <div>
              <label for="credential" class="form_field"
                >Frequency <span class="text-red">*</span></label
              >
              <q-select
                v-model="fee.frequency"
                outlined
                dense
                :options="frequencies"
              />
            </div>
            <div class="flex q-mt-lg justify-end">
              <div>
                <ButtonVue
                  class="form_button"
                  :label="'Save'"
                  :loading="is_fetching"
                  :color="'primary'"
                  :disabled="fee.amount == 0"
                  :no_caps="true"
                >
                </ButtonVue>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--end add registration fee -->

    <!-- confirmation dialog -->
    <div v-if="show_confirm_dialog">
      <ConfirmDialog
        :data="deleted_data"
        :msg="delete_msg"
        :show_reg_fee="true"
        :type="'REGISTRATION_FEE'"
        @cancel-dialog="cancelDialog"
        @fetch-registration-fee="fetchRegistrationFee"
      ></ConfirmDialog>
    </div>
  </div>
</template>

<script>
import ButtonVue from "./Button.vue";
import RegistrationFreqencyVue from "./Constants/RegistrationFreqency.vue";
import NotFound from "./NotFound.vue";
import ConfirmDialog from "./ConfirmDialog.vue";
export default {
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
        status: null,
      },
      is_fetching: false,
      frequencies: [
        RegistrationFreqencyVue.YEARLY,
        RegistrationFreqencyVue.MONTHLY,
      ],
      show_confirm_dialog: false,
      deleted_data: null,
      delete_msg: "",
    };
  },
  computed: {},
  methods: {
    editFee(data) {
      this.show_add_fee = true;
      this.fee.amount = data.amount;
      this.fee.frequency = data.frequency;
      this.fee.id = data.id;
      this.fee.status = data.status;

      return this.fee;
    },

    deleteFee(data) {
      this.show_confirm_dialog = !this.show_confirm_dialog;
      this.deleted_data = data;
      this.delete_msg = "Are you sure, you want delete this Registration Fee ?";
      return this.show_confirm_dialog;
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
            ? "Registration saved Successfully"
            : "Registration updated Successfully",
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
    NotFound,
    ConfirmDialog,
  },
};
</script>

<style lang="scss" scoped>
.add_year {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  font-size: medium;
  letter-spacing: 0.005em;
}
.alert {
  color: $grey5;
}
.title {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.005em;
}

.setting_title {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  text-align: left;
  letter-spacing: 0.005em;
}

.active_item {
  background-color: $primary2;
  color: $white1;
}

.text_header_active {
  color: $white1;
  font-weight: 500;
  font-family: "Roboto";
  font-style: normal;
  font-size: 14px;
  line-height: 24px;
}

.text_header_in_active {
  color: $dark;
  font-weight: normal;
  font-family: "Roboto";
  font-style: normal;
  font-size: 14px;
  line-height: 24px;
}

.text_in_active {
  color: $grey2;
}

.text_active {
  color: $white1;
}

.icon_color_active {
  color: $white1;
}

.icon_color_in_active {
  color: $grey2;
}

.icon_color_general {
  color: $grey2;
}

.text_header_general {
  font-weight: normal;
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-size: 14px;
  line-height: 24px;
}

.caption_text_general {
  color: $grey2;
}

.edit_fee {
  color: $primary;
  cursor: pointer;
}
.delete_fee {
  color: red;
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
  font-weight: bold;
  align-items: center;
  letter-spacing: 0.01em;
}

.message {
  font-size: 16px;
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
</style>
