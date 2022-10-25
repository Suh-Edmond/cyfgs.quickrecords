<template>
  <div class="q-pa-xs">
    <div class="button q-pb-xs">
      <ButtonVue :label="label_download" :loading="loading" :color="color" :disabled="false" :no_caps="no_caps"
        icon_right="print"></ButtonVue>
    </div>
    <q-table :title="title" :data="data" :columns="columns" row-key="name"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="item" :props="props">
            <q-btn flat class="view_items">
              {{props.row.item}}
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
    </q-table>


    <!-- confirmation dialog -->
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" class="warning_image" size="lg" />
          <span class="q-ml-sm text-dark">{{message}}</span>
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
import ButtonVue from "src/components/Button.vue";
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
      required: true,
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
    message: {
      type: String,
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
    };
  },
  methods: {
    onViewClick(data) {
      let payload = {
        data: data,
        tab: "Payment Categories",
        show_title: false
      }
      this.$emit("update-payment-category", payload);
    },
    onDeleteClick(id) {
      this.dialog = true;
    },
  },
  components: {
    ButtonVue,
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
  color: $orange;
}

.text-color {
  color: $grey2;
}

.view_items {
  font-family: 'Roboto';
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
