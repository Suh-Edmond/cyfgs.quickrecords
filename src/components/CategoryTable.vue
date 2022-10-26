<template>
  <div class="q-pa-xs">
    <!-- table for payment categories -->
    <q-table :title="title" :data="payment_categories_data" :columns="payment_category_columns" row-key="counter"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }" v-if="!show_payment_items" class="col-xs-12">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="item" :props="props">
            <q-btn flat class="view_items" @click="showPaymentItems(props.row)">
              {{ props.row.item }}
            </q-btn>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn flat round>
              <q-icon name="more_vert" size="xs" color="primary" class="menu_icon" clickable>
                <q-menu>
                  <q-list>
                    <q-item clickable v-close-popup @click="onViewClick(props)">
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
                    <q-item clickable v-close-popup @click="onDeleteClick(props.row)">
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
        <q-input outlined dense
          :class="$q.screen.md ? 'text-h6-sm q-mb-sm q-mt-sm full-width' : 'text-h6-sm'"
          v-model="filter" placeholder="Search category...">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>



    <!-- table for payment items -->
    <q-table :data="payment_item_data" :columns="payment_item_columns" row-key="counter"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }" v-if="show_payment_items">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="amount" :props="props">
            {{ props.row.amount }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn flat round>
              <q-icon name="more_vert" size="xs" color="primary" class="menu_icon" clickable>
                <q-menu>
                  <q-list>
                    <q-item clickable v-close-popup @click="onViewItemClick(props)">
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
                    <q-item clickable v-close-popup @click="onDeleteItemClick(props.row)">
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
      <template v-slot:top-right>
        <q-input outlined dense
          :class="$q.screen.md ? 'text-h6-sm q-mb-lg q-mt-lg full-width' : 'text-h6-sm'"
          v-model="filter" placeholder="Search Payment items...">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <!-- confirmation delete category dialog -->
    <q-dialog v-model="dialog_category">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" class="warning_image" size="90px" />
          <span class="q-ml-sm text-dark">{{ on_del_msg_cat }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" class="text-color" v-close-popup no-caps />
          <q-btn flat :label="label" color="primary" v-close-popup no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- confirmation delete payment item -->
    <q-dialog v-model="dialog_item">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" class="warning_image" size="90px" />
          <span class="q-ml-sm text-dark">{{ on_del_msg_item }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" class="text-color" v-close-popup no-caps />
          <q-btn flat :label="label" color="primary" v-close-popup no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  props: {
    payment_category_columns: {
      type: Array,
      required: true,
    },
    payment_categories_data: {
      type: Array,
      required: true,
    },
    payment_item_columns: {
      type: Array,
      required: true,
    },
    payment_item_data: {
      type: Array,
      required: true,
    },
    title: {
      required: true,
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
    on_del_msg_cat: {
      type: String,
      required: true,
    },
    on_del_msg_item: {
      type: String,
      required: true,
    },
    show_payment_items: {
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
      dialog_category: false,
      dialog_item: false,
      filter: null,
      showTable: true,
    };
  },
  methods: {
    onViewClick(data) {
      let payload = {
        data: data,
        tab: "Payment Categories",
        show_title: false,
      };
      this.$emit("update-payment-category", payload);
    },
    onDeleteClick(id) {
      this.dialog_category = true;
    },
    showPaymentItems(data) {
      this.$emit("show-payment-items", data);
    },
    onViewItemClick(data){
      let payload = {
        data: data,
        tab: "Payment Items",
        show_title: false,
      };
      this.$emit("update-payment-item", payload);
    },
    onDeleteItemClick(data){
      this.dialog_item = true;
    }
  },
  components: {

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
  color: $grey5;
}

.warning_image {
  color: yellow;
}

.text-color {
  color: $grey2;
}

.view_items {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 25px;
  display: flex;
  align-items: center;
  letter-spacing: 0.01em;
  text-transform: capitalize;
  color: $primary;
}
</style>
