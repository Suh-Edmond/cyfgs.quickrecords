<template>
  <div>
    <!-- table element -->
    <q-table
      :data="data"
      :columns="columns"
      row-key="id"
      :table-header-style="{ backgroundColor: '#213c65', color: '#FFFFFF' }"
      class="col-xs-12"
      :filter="filter"
      :loading="table_loading"
      :pagination.sync="getPagination"
      @request="onRequest"
      binary-state-sort
      flat
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="supporter" :props="props" class="table_value">
            {{ props.row.supporter }}
          </q-td>
          <q-td key="amount_deposited" :props="props" class="table_value">
            {{ Number(props.row.amount_deposited).toLocaleString() }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'PENDING'"
            class="text-info table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'APPROVED'"
            class="registered table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'DECLINED'"
            class="not_registered table_value"
          >
            {{ props.row.approve }}
          </q-td>

          <q-td key="action" :props="props">
            <!-- buttons for approve and decline row data -->
            <q-btn
              class="approve_btn"
              dense
              :label="$t('app.approve')"
              no-caps
              unelevated
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="canValidateTransaction() && props.row.approve === 'PENDING'"
            />

            <q-btn
              class="decline_btn q-mx-xl"
              :label="$t('app.decline')"
              no-caps
              dense
              unelevated
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="canValidateTransaction() && props.row.approve === 'PENDING'"
            />

            <!-- button to handle edit, view and delete of row data  q-px-sm -->
            <q-btn flat round v-if="!checkTreasurerRoleOnly()">
              <q-icon
                name="menu"
                size="xs"
                color="primary"
                class="menu_icon"
                clickable
              >
                <q-menu>
                  <q-list style="width: 180px" bordered separator>
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
                        <q-item-label class="edit">{{
                          $t("app.view")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>

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
                        <q-item-label class="edit">{{
                          $t("app.edit")
                        }}</q-item-label>
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
                        <q-item-label class="text-red delete_text">{{
                          $t("app.delete")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>

            <q-btn
              unelevated
              no-caps
              dense
              :style="$q.platform.is.mobile ? 'width:100px' : 'width:100px'"
              color="primary"
              class="view_income"
              :label="$t('app.view')"
              @click="onViewSupport(props.row)"
              v-if="checkTreasurerRoleOnly()"
            >
              <q-icon name="visibility" class="q-pl-md eye_icon"></q-icon>
            </q-btn>
          </q-td>
        </q-tr>
      </template>

      <!-- slot for table headings -->
      <template v-slot:top-left>
        <div class="text-h6 title" v-if="title !== ''">
          {{ title }},
          <span>
            {{ $t("app.total") }} :
            {{ Number(total).toLocaleString() }} XAF</span
          >
        </div>
      </template>

      <!-- slot for search table data -->
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          v-model="filter"
          :placeholder="$t('app.tableSearch')"
          v-if="$q.platform.is.desktop"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <!-- confirmation dialog for delete -->
    <q-dialog v-model="dialog" v-if="dialog">
      <q-card class="q-pa-sm">
        <q-card-section>
          <div class="row">
            <label class="text-dark message text-primary">{{ message }}</label
            ><br />
          </div>
          <label class="warning_caption">{{ $t("app.actionUndoneMsg") }}</label>
          <div class="text-red q-mt-md record_label">
            {{ $t("app.sponsor") }}:
            <span class="q-pl-md">{{ deleted_row.supporter }}</span>
          </div>
          <div class="text-red record_value">
            {{ $t("app.amount") }}:
            <span class="q-pl-md"
              >{{
                Number(deleted_row.amount_deposited).toLocaleString()
              }}
              XAF</span
            >
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :label="$t('app.cancel')"
            color="primary"
            :disabled="false"
            :loading="loading"
            flat
            class="dialog_button"
            v-close-popup
            no-caps
            size="md"
          ></q-btn>
          <q-btn
            :label="$t('app.delete')"
            color="primary"
            class="dialog_button"
            :disabled="false"
            :loading="loading"
            flat
            no-caps
            v-close-popup
            @click="deleteRow(deleted_row)"
            size="md"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- confirmation dialog for approve and decline row data -->
    <q-dialog v-model="show_approve_dialog" v-if="show_approve_dialog">
      <q-card class="q-pa-sm">
        <q-card-section>
          <div class="row">
            <div class="col-md-12">
              <label>
                <span class="text-weight-bold"
                  >{{ $t("app.doYouKnow") }}{{ chosen_state }}
                  {{ approve_msg }}</span
                >
                <br />
              </label>
            </div>
          </div>
          <div class="text-red">
            <div class="text-weight-bold text-left">
              {{ $t("app.sponsor") }}:
              <span class="q-pl-md">{{ supporter }}</span>
            </div>

            <div class="text-weight-bold text-left">
              {{ $t("app.amount") }}:
              <span class="q-pl-lg"
                >{{ Number(supporter_amount).toLocaleString() }} XAF</span
              >
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-ma-md">
          <q-btn
            :class="chosen_state === 'Approve' ? 'approve' : 'decline'"
            size="md"
            :label="$t('app.cancel')"
            flat
            v-close-popup
            no-caps
          />
          <q-btn
            :class="chosen_state === 'Approve' ? 'approve' : 'decline'"
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
import HelperMixin from "src/mixins/HelperMixin.vue";
import SponsorshipMixin from "src/mixins/SponsorshipMixin.vue";

export default {
  mixins: [SponsorshipMixin, HelperMixin],
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
    total: {
      required: true,
      type: Number,
      default: 0,
    },
    pagination: {
      type: Object,
      required: true,
    },
    table_loading: {
      required: true,
      type: Boolean,
    },
  },

  data() {
    return {
      loading: false,
      color: "positive",
      no_caps: true,
      filter: "",
      show_approve_dialog: false,
      dialog: false,
      deleted_row: null,
      chosen_state: null,
      approve_msg: null,
      approve_data: null,
      supporter: null,
      supporter_amount: 0,
    };
  },
  computed: {
    getPagination: {
      get() {
        return this.pagination;
      },
      set(pagination) {
        return pagination;
      },
    },
  },
  methods: {
    onRequest(props) {
      this.$emit("onRequest", props);
    },

    onViewSupport(data) {
      let payload = {
        data: data,
        tab: this.$t("app.viewSponsorship"),
      };
      this.$store.dispatch("setSelectedSponsorship", data);
      this.$emit("view-sponsorship", payload);
    },

    onEditSupport(data) {
      let payload = {
        data: data,
        tab: this.$t("app.sponsorshipMgt"),
      };

      this.$store.dispatch("setSelectedSponsorship", data);

      this.$emit("edit-sponsorship", payload);
    },
    onDeleteSupport(data) {
      this.dialog = true;
      this.deleted_row = data;
    },

    onDeclineRecord(row, state) {
      this.show_approve_dialog = true;
      this.approve_data = row;
      this.chosen_state = state;
      this.supporter_amount = row.amount_deposited;
      this.supporter = row.supporter;
      this.approve_msg =
        this.$t("app.sponsorshipPart") + `${row.payment_item.name} ?`;
    },

    onApprovedRecord(row, state) {
      this.show_approve_dialog = true;
      this.approve_data = row;
      this.chosen_state = state;
      this.supporter_amount = row.amount_deposited;
      this.supporter = row.supporter;
      this.approve_msg =
        this.$t("app.sponsorshipPart") + `${row.payment_item.name} ?`;
    },

    deleteRow(data) {
      let payload = {
        url: `/api/protected/sponsorships/${data.id}`,
        msg: this.$t("app.sponsorDeletedSuccessMsg"),
        status: "success",
        color: "default",
        to_on_ok: "none",
        show_feedback: true,
        to_on_fail: "none",
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("deleteRequest", payload).then(() => {
        this.getAllSponsorships(1, 10, "", "");
        this.$store.dispatch("setSelectedSponsorship", null);
      });
    },

    onChangeRecordState() {
      let state =
        this.chosen_state == "Approve"
          ? this.$t("app.approveLabel")
          : this.$t("app.declineLabel");
      let payload = {
        url: `/api/protected/sponsorships/${this.approve_data.id}/approve?type=${state}`,
        msg:
          this.$t("app.sponsorPart") +
          `${this.chosen_state}` +
          this.$t("app.successfull"),
        data: null,
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
      this.$store.dispatch("putRequest", payload).then((res) => {
        if (res.success) {
          if (this.approve_data.payment_item == null) {
            this.getAllSponsorships(1, 7, "", "");
          } else {
            this.getAllSponsorships(
              1,
              7,
              this.approve_data.payment_item.id,
              ""
            );
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
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem;
}

.menu_icon {
  cursor: pointer;
}

.edit {
  color: $primary;
  font-size: 0.8rem;
}

.dialog_button {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.approve_btn {
  background-color: $secondary;
  color: white;
  margin-right: 2.5rem;
  width: 4.2rem;
  font-size: 0.8rem;
}

.decline_btn {
  background-color: $orange;
  color: white;
  margin-right: 2.5rem;
  font-size: 0.8rem;
  width: 4.2rem;
}

.message {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem;
  color: $primary;
}

.approve {
  color: $secondary;
}

.decline {
  color: $orange;
}

.warning_caption {
  color: $grey2;
  font-weight: 400;
  font-size: 0.7rem;
}

.view_income {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  align-items: center;
  text-transform: capitalize;
}

.not_registered {
  color: $orange;
}

.registered {
  color: $secondary;
}

.table_value {
  font-size: 0.7rem;
  font-weight: 500;
}

.delete_text {
  font-size: 0.8rem;
}

.record_value {
  font-size: 0.8rem;
  font-weight: 500;
}

.record_label {
  font-size: 0.8rem;
  font-weight: 500;
}

.eye_icon {
  font-size: 0.8rem;
}
</style>
