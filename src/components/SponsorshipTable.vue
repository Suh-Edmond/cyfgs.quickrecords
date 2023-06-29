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
      :rows-per-page-options="[0]"
      hide-pagination
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
          <q-td key="approve" :props="props"  v-if="props.row.approve == 'PENDING'"
            class="text-info">
            {{ props.row.approve }}
          </q-td>
          <q-td key="approve" :props="props"  v-if="props.row.approve == 'APPROVED'"
            class="registered">
            {{ props.row.approve }}
          </q-td>
          <q-td key="approve" :props="props"   v-if="props.row.approve == 'DECLINED'"
            class="not_registered">
            {{ props.row.approve }}
          </q-td>

          <q-td key="action" :props="props">
            <q-btn
              unelevated
              no-caps
              size="md"
              color="primary"
              class="view_income q-mr-md"
              label="View"
              @click="onViewSupport(props.row)"
              v-if="checkTreasurerRole()"
            >
              <q-icon name="visibility" size="xs" class="q-pl-md"></q-icon>
            </q-btn>

            <!-- button to handle edit, view and delete of row data  q-px-sm -->
            <q-btn flat round v-if="!checkTreasurerRole()">
              <q-icon
                name="menu"
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
                      @click="onEditSupport(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="edit" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">Edit</q-item-label>
                      </q-item-section>
                    </q-item>

                    <!-- view support -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewSupport(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="visibility" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">View</q-item-label>
                      </q-item-section>
                    </q-item>

                    <!-- deleted specify row -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDeleteSupport(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
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
              unelevated
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />

            <q-btn
              class="approve_btn q-ml-md"
              size="md"
              label="Approve"
              no-caps
              unelevated
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

      <template v-slot:bottom>
        <q-tr>
          <q-th class="text-bold total q-my-md">
            Total:
          </q-th>
          <q-th class="text-bold total_given">
            {{ Number(total).toLocaleString() }} XAF
          </q-th>
        </q-tr>
      </template>
    </q-table>

    <!-- confirmation dialog for delete -->
    <q-dialog v-model="dialog" v-if="dialog">
      <q-card>
        <q-card-section class="q-pa-lg">
          <div class="q-mb-md">
            <label class="text-dark message">{{ message }}</label><br/>
            <small class="warning_caption">This action can not be undone</small>
          </div>
          <div class="text-weight-bold text-left text-red">Sponsor:  <span class="q-pl-md">{{ deleted_row.supporter }}</span> </div>
          <div class="text-weight-bold text-left text-red"> Amount: <span class="q-pl-md">{{ Number(deleted_row.amount_deposited).toLocaleString() }} XAF</span></div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Cancel"
            color="primary"
            :disabled="false"
            :loading="loading"
            flat
            class="dialog_button"
            v-close-popup
            no-caps
          ></q-btn>
          <q-btn
            label="Delete"
            color="primary"
            class="dialog_button"
            :disabled="false"
            :loading="loading"
            flat
            no-caps
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
          <div  class="text-red">
              <div class="text-weight-bold text-left">
                Sponsor:
                <span class="q-pl-md">{{ supporter }}</span>
              </div>

              <div class="text-weight-bold text-left">
                Amount:
                <span class="q-pl-lg"
                  >{{ Number(supporter_amount).toLocaleString() }} XAF</span
                >
              </div>
            </div>
        </q-card-section>

        <q-card-actions align="right" class="q-ma-md">
          <q-btn
            :class="chosen_state == 'Approve' ? 'approve' : 'decline'"
            size="md"
            label="Cancel"
            flat
            v-close-popup
            no-caps
          />
          <q-btn
            :class="chosen_state == 'Approve' ? 'approve' : 'decline'"
            size="md"
            :label="chosen_state"
            flat
            no-caps
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
import SponsorshipMixin from "src/mixins/SponsorshipMixin.vue";
import moment from "moment";

export default {
  mixins:[SponsorshipMixin],
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
      supporter:null,
      supporter_amount:0
    };
  },
  computed: {},
  methods: {
    onViewSupport(data) {
      let payload = {
        data: data,
        tab: "View Sponsorship",
      };
      this.$store.dispatch("setSelectedSponsorship", data);
      this.$emit("view-sponsorship", payload);
    },

    onEditSupport(data){
      let payload = {
        data: data,
        tab: "Sponsorship Management",
      };

      this.$store.dispatch("setSelectedSponsorship", data);

      this.$emit("edit-sponsorship", payload)
    },
    onDeleteSupport(data) {
      this.dialog = true;
      this.deleted_row = data
    },

    onDeclineRecord(row, state) {
      this.show_approve_dialog = true;
      this.approve_data = row;
      this.chosen_state = state;
      this.supporter_amount = row.amount_deposited;
      this.supporter = row.supporter;
      this.approve_msg = `Sponsorship for ${row.payment_item.name} ?`;
    },

    onApprovedRecord(row, state) {
      this.show_approve_dialog = true;
      this.approve_data = row;
      this.chosen_state = state;
      this.supporter_amount = row.amount_deposited;
      this.supporter = row.supporter;
      this.approve_msg = `Sponsorship for ${row.payment_item.name} ?`;
    },

    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name == "TREASURER"
      );
      return treasurer_role != undefined;
    },

    deleteRow(data) {
      let payload = {
        url: `/api/protected/sponsorships/${data.id}`,
        msg: "Sponsorship deleted successfully",
        status: "success",
        color: "default",
        to_on_ok: "none",
        show_feedback: true,
        to_on_fail: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("deleteRequest", payload).then(() => {
        this.getAllSponsorships();
        this.$store.dispatch("setSelectedSponsorship", null);
      });
    },

    onChangeRecordState() {
      let state = this.chosen_state == 'Approve' ? 'APPROVED':'DECLINED'
      let payload = {
        url: `/api/protected/sponsorships/${this.approve_data.id}/approve?type=${state}`,
        msg: `Sponsorship has been ${this.chosen_state} successfully`,
        data: null,
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
      this.$store.dispatch("putRequest", payload).then((res) => {
        if (res.status == 200) {
         if(this.approve_data.payment_item == null){
          this.getAllSponsorships();
         }else{
          this.getSponsorships(this.approve_data.payment_item.id);
         }
        }
      });
    },
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

.dialog_button {
  font-size: .9rem;
  font-weight: 500;
  margin-bottom: .5rem;
}

.approve_btn {
  background-color: $secondary;
  color: white;
}

.approve_card {
  width: 24rem;
  // padding: 0.7rem;
}

.decline_btn {
  background-color: $orange;
  color: white;
  // margin-right: 3rem;
}

.message {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.approve {
  color: $secondary;
}

.decline {
  color: $orange;
}

.total {
   font-size: 15px;
}
.total_given {
  padding-left: 3rem;
  font-size: 13px;
}

.warning_caption {
  color: $grey2;
  font-weight: 500;
  font-size: 13px;
}

.view_income {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 25px;
  letter-spacing: 0.01em;
  text-transform: capitalize;
  color: $primary;

}

.not_registered {
  color: $orange;
}

.registered {
  color: $secondary;
}
</style>
