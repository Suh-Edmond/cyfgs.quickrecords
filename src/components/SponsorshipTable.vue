<template>
  <div class="q-pa-xs">
    <!-- table element -->
    <q-table
      :data="data"
      :columns="columns"
      row-key="id"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }"
      class="col-xs-12"
      :filter="filter"
      :pagination.sync="pagination"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="supporter" :props="props">
            {{ props.row.supporter }}
          </q-td>
          <q-td key="amount_deposited" :props="props">
            {{ Number(props.row.amount_deposited).toLocaleString() }}
          </q-td>
          <q-td key="code" :props="props">
            {{ props.row.code }}
          </q-td>
          <q-td key="approve" :props="props">
            {{ props.row.approve }}
          </q-td>

          <q-td key="action" :props="props">
            <!-- button to handle edit, view and delete of row data -->
            <q-btn flat round>
              <q-icon
                name="more_vert"
                size="xs"
                color="primary"
                class="menu_icon"
                clickable
              >
                <q-menu>
                  <q-list style="width: 180px" bordered separator>
                    <!-- edit support -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewSupport(props.row)"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="visibility" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">View</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditSupport(props.row)"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="edit" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">Edit</q-item-label>
                      </q-item-section>
                    </q-item>

                    <!-- deleted specify row -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDeleteSupport(props.row)"
                    >
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

            <!-- buttons for approve and decline row data -->
            <q-btn
              class="decline_btn"
              size="md"
              label="Decline"
              no-caps
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />

            <q-btn
              class="approve_btn"
              size="md"
              label="Approve"
              no-caps
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />
          </q-td>
        </q-tr>
      </template>

      <!-- slot for table headings -->
      <template v-slot:top-left>
        <div class="text-h6 title">
          {{ title }}
        </div>
      </template>

      <!-- slot for search table data -->
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          :class="
            $q.screen.md
              ? 'text-h6-sm q-mb-sm q-mt-sm full-width'
              : 'text-h6-sm'
          "
          v-model="filter"
          placeholder="Type to search..."
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <q-card v-if="data.length > 0">
      <q-card-section>
        <div class="text-bold">
          Total Amount: {{ total }} XAF
        </div>
      </q-card-section>
    </q-card>

    <!-- confirmation dialog for delete -->
    <q-dialog v-model="dialog" v-if="dialog">
      <q-card>
        <q-card-section>
          <div>
            <label class="q-ml-sm text-dark">{{ message }}</label>
          </div>
          <div class="text-weight-bold text-center">{{ deleted_row.name }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Cancel"
            :color="'primary'"
            :disabled="false"
            :loading="loading"
            :no_caps="true"
            :flat="true"
            class="dialog_button"
            v-close-popup
          ></q-btn>
          <q-btn
            :label="label"
            :color="'primary'"
            class="dialog_button"
            :disabled="false"
            :loading="loading"
            :no_caps="false"
            :flat="true"
            v-close-popup
            @click="deleteRow(deleted_row)"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- confirmation dialog for approve and decline row data -->
    <q-dialog v-model="show_approve_dialog" v-if="show_approve_dialog">
      <q-card class="approve_card">
        <q-card-section>
          <div class="row">
            <div class="col-md-12">
              <label for="msg">
                <span class="text-weight-bold"
                  >Do you want to {{ chosen_state }} {{ approve_msg }}</span
                >
                <br />
              </label>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            :class="chosen_state == 'Approve' ? 'approve' : 'decline'"
            size="md"
            label="Cancel"
            flat
            v-close-popup
          />
          <q-btn
            :class="chosen_state == 'Approve' ? 'approve' : 'decline'"
            size="md"
            :label="chosen_state"
            flat
            @click="onChangeRecordState()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { LocalStorage } from "quasar";

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
      required: false,
      type: Boolean,
    },
    message: {
      required: false,
      type: String,
    },
    total:{
      required:true,
      type:Number,
      default:0
    }
  },

  data() {
    return {
      label_download: "Print",
      loading: false,
      color: "positive",
      no_caps: true,
      filter: "",
      pagination: {
        rowsPerPage: 15, // current rows per page being displayed
      },
      show_approve_dialog: false,
      dialog: false,
      deleted_row: null,
      chosen_state: null,
      approve_msg: null,
      approve_data: null,
    };
  },
  computed: {},
  methods: {
    onViewSupport(data) {},
    onEditSupport(data) {},

    onDeleteSupport(data) {},

    onDeclineRecord(data, type) {},

    onApprovedRecord(data, type) {},

    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name == "TREASURER"
      );
      return treasurer_role != undefined;
    },

    deleteRow(data) {},

    onChangeRecordState() {},
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.title {
  font-size: small;
}

.menu_icon {
  cursor: pointer;
}

.edit {
  color: $primary;
}

.title {
  font-size: medium;
}

.dialog_button {
  font-size: small;
  font-weight: 500;
}

.approve_btn {
  background-color: $secondary;
  color: white;
}

.approve_card {
  width: 30rem;
  padding: 0.7rem;
}

.decline_btn {
  background-color: $orange;
  color: white;
}

.approve {
  color: $secondary;
}

.decline {
  color: $orange;
}
</style>
