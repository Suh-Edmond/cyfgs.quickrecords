<template>
  <div class="q-pa-xs">
    <!-- table element -->
    <q-table :title="title" :data="data" :columns="columns" row-key="counter"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }" class="col-xs-12">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="item" :props="props" v-if="show_payment_category">
            <q-btn flat class="view_items" @click="showPaymentItems(props.row)"
              :to="{ name: 'payment_items', params: { id: props.row.counter } }">
              {{ props.row.item }}
            </q-btn>
          </q-td>
          <q-td key="amount" :props="props" v-if="show_payment_item">
              {{ props.row.amount }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn flat round>
              <q-icon name="more_vert" size="xs" color="primary" class="menu_icon" clickable>
                <q-menu>
                  <q-list>
                    <q-item clickable v-close-popup @click="onViewCategory(props.row)" v-if="show_payment_category">
                      <q-item-section avatar>
                        <span>
                          <q-icon name="info" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">Details</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="onViewItem(props.row)" v-if="show_payment_item">
                      <q-item-section avatar>
                        <span>
                          <q-icon name="info" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">Details</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="onDelete(props.row)">
                      <q-item-section avatar>
                        <span>
                          <q-icon name="delete" size="xs" color="red" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-red">Delete</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-left>
        <div class="text-h6">
        </div>
      </template>
      <template v-slot:top-right>
        <q-input outlined dense :class="$q.screen.md ? 'text-h6-sm q-mb-sm q-mt-sm full-width' : 'text-h6-sm'"
          v-model="filter" placeholder="Search category...">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <!-- confirmation delete category dialog -->
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <div>
            <q-avatar icon="warning" class="warning_image" size="40px" />
            <span class="q-ml-sm text-dark">{{ message }}</span>
          </div>
          <div class="text-weight-bold text-center">{{ name }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <ButtonVue :label="label_cancel" :color="'primary'" :disabled="false" :loading="loading" :no_caps="false"
            v-close-popup :flat="true"></ButtonVue>
          <ButtonVue :label="label" :color="'primary'" :disabled="false" :loading="loading" :no_caps="false"
            v-close-popup :flat="true"></ButtonVue>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import ButtonVue from './Button.vue';
export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    title: {
      required: false,
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    show_payment_category: {
      type: Boolean,
      required: true
    },
    show_payment_item: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      label_download: "Print",
      loading: false,
      color: "positive",
      no_caps: true,
      dialog: false,
      filter: null,
      showTable: true,
      label_cancel: "Cancel",
    };
  },
  methods: {
    onViewCategory(data) {
      let payload = {
        data: data,
        tab: "Payment Categories",
        show_title: false,
      };
      this.$emit("update-payment-category", payload);
    },
    onViewItem(data) {
      let payload = {
        data: data,
        tab: "Payment Items",
        show_title: false,
      };
      this.$emit("update-payment-item", payload);
    },
    onDelete(data) {
      this.dialog = true;
    },
    showPaymentItems(data) {
      let has_intermediate_tab = true;
      this.$emit("show-payment-items", {data, has_intermediate_tab});
    },
    // onViewItemClick(data){
    //   let payload = {
    //     data: data,
    //     tab: "Payment Items",
    //     show_title: false,
    //   };
    //   this.$emit("update-payment-item", payload);
    // },
    // onDeleteItemClick(data){
    //   this.dialog_item = true;
    // }
  },
  components: {
    ButtonVue
  },
};
</script>
<style lang="scss" scoped>
.button {
  text-align: end;
}

.menu_icon {
  cursor: pointer;
}

.edit {
  color: $grey5;
}

.details {
  color: $dark;
}

.warning_image {
  color: yellow;
}

.view_items {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 25px;
  align-items: center;
  letter-spacing: 0.01em;
  text-transform: capitalize;
  color: $primary;
}
</style>
