<template>
  <div>
    <div class="row">
      <div class="col-md-12 col-xs-12 col-sm-12">
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
          <template v-slot:top-right>
            <div>
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
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="counter" :props="props">
                {{ props.row.counter }}
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="amount" :props="props">
                {{ Number(props.row.amount).toLocaleString() }}
              </q-td>
              <q-td
                key="is_complusory"
                :props="props"
                v-if="props.row.is_complusory"
              >
                YES
              </q-td>
              <q-td
                key="is_complusory"
                :props="props"
                v-if="!props.row.is_complusory"
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
                  class="delete_fee"
                  @click="deleteFee(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-icon>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <!--add registration fee -->
    <q-dialog v-model="show_add_fee">
      <q-card style="min-width: 450px" class="q-px-md q-pt-sm q-pb-sm">
        <q-card-section class="row items-center q-pb-lg">
          <div class="text-h6 add_year">Add Member's Registration Fee</div>
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
                  v-model="fee.complusory"
                  :val="true"
                  label="YES"
                  size="xs"
                />
                <q-radio
                  dense
                  v-model="fee.complusory"
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
                label="Select frequency"
              />
            </div>
            <div class="flex q-mt-lg justify-end">
              <div>
                <ButtonVue
                  class="form_button"
                  :label="'Save'"
                  :loading="loading"
                  :color="'primary'"
                  :disabled="validateForm"
                  :no_caps="true"
                >
                </ButtonVue>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import ButtonVue from "./Button.vue";
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
  },
  data() {
    return {
      show_add_fee: false,
      fee: {
        name: "Member's Registration Fee",
        amount: 0.0,
        frequency: null,
        type: "REGISTRATION",
        complusory: true,
        payment_category_id: null,
      },
      is_fetching: false,
      frequencies: ["YEARLY", "MONTHLY"],
      loading: false,
    };
  },
  computed: {
    validateForm() {
      return true;
    },
  },
  methods: {
    editFee(data) {},
    formDateTime(data) {},
    deleteFee(data) {},
    onAddFee() {},
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
