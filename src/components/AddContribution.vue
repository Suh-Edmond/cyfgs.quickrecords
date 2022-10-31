<template>
  <div class="q-ma-md">
    <div class="text_h6 text-center q-pt-xs q-pb-md add_member_title">
      Contribution Information
    </div>
    <div>
      <div>
        <q-form @submit="onAddContribution" class="q-gutter-md">
          <div>
            <label for="name" class="form_field">Member Name <span class="text-red">*</span>
            </label>
            <q-select outlined dense v-model="contribution.user_id" placeholder="Type name to search..."
              :options="members" input-debounce="0" @filter="filterMembers" use-input hide-selected fill-input>
            </q-select>
          </div>
          <div>
            <label for="name" class="form_field">Payment Item <span class="text-red">*</span>
            </label>
            <q-select outlined dense v-model="contribution.payment_item_id" placeholder="Type name to search..."
              :options="payment_items" input-debounce="0" @filter="filterPaymentItems" use-input hide-selected
              fill-input>
            </q-select>
          </div>
          <div>
            <label for="credential" class="form_field">Amount Payable</label>
            <q-input v-model="contribution.amount_payable" outlined dense type="number" disable />
          </div>
          <div>
            <label for="credential" class="form_field">Deposite Amount <span class="text-red">*</span></label>
            <q-input v-model="contribution.amount_deposited" outlined dense type="number" />
          </div>
          <div>
            <label for="credential" class="form_field">Balance </label>
            <q-input v-model="contribution.balance" outlined dense type="number" disable />
          </div>
          <div>
            <label for="credential" class="form_field">Comment </label>
            <q-input v-model="contribution.comment" outlined dense type="text" autogrow
              placeholder="Provide any comment about this contribution" />
          </div>
          <div>
            <label for="credential" class="form_field">Receipt(Optional)</label>
            <q-uploader
              style="width:100%"
              url="http://localhost:4444/upload"
              label="Restricted to images"
              flat
              bordered
              multiple
              accept="image/jpg, image/png,image/jpeg"
              @rejected="onRejected"
            />
          </div>
          <div>
            <ButtonVue class="form_button" :label="label_save" :loading="loading" :color="color"
              :disabled="validateForm" :no_caps="no_caps">
            </ButtonVue>
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";

export default {
  data() {
    return {
      label_save: "Save",
      loading: false,
      color: "primary",
      contribution: {
        user_id: null,
        payment_item_id: null,
        amount_deposited: 0,
        comment: null,
        balance: 0,
        amount_payable: 5000
      },
      position: "right",
      dialog: false,
      no_caps: true,
      members: [
        "Mary",
        "John",
        "Joe",
        "Paul",
        "Peter",
        "Lum",
        "Bih",
        "Jerry",
        "Moses",
      ],
      payment_items: [{}]
    };
  },
  computed: {
    validateForm() {
      return this.contribution.user_id === null || this.contribution.amount_deposited == 0
        ? true
        : false;
    },
    isMemberExist() {
      return this.contribution.user_id !== null && this.contribution.amount_deposited !== 0
        ? false
        : true;
    },
    startSearch() {
      return this.contribution.user_id === null ? false : true
    }
  },
  methods: {
    onAddContribution() {
      this.$emit("close-right-drawer");
    },
    filterMembers(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.members = this.members.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterPaymentItems(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.payment_items = this.payment_items.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    onRejected(){

    }
  },
  components: {
    ButtonVue,
  },
};
</script>

<style scoped lang="scss">
.add_member_title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 29px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.01em;
  color: #5384ae;
  text-transform: capitalize;
}

.button {
  width: 100%;
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

.or_option {
  font-weight: bolder;
}

.help_text {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  text-align: center;
  align-items: center;
  letter-spacing: 0.01em;
}
</style>
