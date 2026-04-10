<template>
  <div>
    <div :class="$q.platform.is.mobile ? 'q-mt-sm' : 'q-ml-sm'">
      <!-- table for session -->
      <q-table
        :data="data"
        :columns="columns"
        row-key="index"
        :table-header-style="{
          backgroundColor: '#213c65',
          color: '#FFFFFF',
        }"
        :loading="table_loading"
        flat
      >
        <template v-slot:top-left>
          <div>
            <label class="title">{{ table_header }}</label>
          </div>
        </template>
        <template v-slot:top-right>
          <q-btn
            label="Add"
            dense
            size="sm"
            color="primary"
            :disable="!canAddSession"
            no-caps
            class="q-pa-xs"
            icon-right="add"
            @click="show_add_session = true"
          >
            <q-tooltip> {{ $t("app.settingsAddSessionLabel") }} </q-tooltip>
          </q-btn>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="year" :props="props" class="table_value">
              {{ props.row.year }}
            </q-td>
            <q-td
              key="status"
              :props="props"
              :class="
                props.row.status === 'ACTIVE'
                  ? 'status_active'
                  : 'status_in_active'
              "
              class="table_value"
            >
              {{ formatConstants(props.row.status) }}
            </q-td>
            <q-td key="updated_by" :props="props" class="table_value">
              {{ props.row.updated_by }}
            </q-td>
            <q-td key="created_at" :props="props" class="table_value">
              {{ formateDate(props.row.created_at) }}
            </q-td>
          </q-tr>
        </template>

        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
      <!-- end table for session -->
    </div>

    <!--add registration fee -->
    <q-dialog v-model="show_add_session">
      <q-card
        :style="$q.platform.is.desktop ? 'width: 350px' : 'width: 450px'"
        class="q-pt-sm q-pb-md"
        :class="$q.platform.is.desktop ? 'q-px-sm' : ''"
      >
        <q-card-section class="row">
          <div class="text-h6 add_year" v-if="session.id == null">
            {{ $t("app.settingsAddSessionLabel") }}
          </div>
          <div class="text-h6 add_year" v-else>
            {{ $t("app.updateSession") }}
          </div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            @click="closeAddSessionDialog"
            size="sm"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSetSession" class="q-gutter-md">
            <div>
              <label class="form_field"
                >{{ $t("app.year") }} <span class="text-red">*</span></label
              >
              <q-input
                v-model="session.year"
                outlined
                dense
                type="text"
                :disable="this.session !== undefined && this.session.id != null"
              />
            </div>
            <div>
              <label class="form_field"
                >{{ $t("app.status") }} <span class="text-red">*</span></label
              >
              <q-select
                v-model="session.status"
                outlined
                dense
                :options="session_statuses"
                disabled
              />
            </div>
            <div class="flex q-mt-lg justify-end" v-if="$q.platform.is.desktop">
              <ButtonVue
                class="form_button"
                :label="$t('app.addLabel')"
                :loading="is_fetching"
                :color="'primary'"
                :disabled="session.year == null"
                :no_caps="true"
              >
              </ButtonVue>
            </div>

            <div class="flex q-mt-lg" v-if="$q.platform.is.mobile">
              <ButtonVue
                class="full-width"
                :label="$t('app.addLabel')"
                :loading="is_fetching"
                :color="'primary'"
                :disabled="session.year == null"
                :no_caps="true"
              >
              </ButtonVue>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--end add registration fee -->

    <q-dialog v-model="show_warning">
      <q-card
        :style="$q.platform.is.desktop ? 'width: 300px' : 'width: 400px'"
        :class="$q.platform.is.desktop ? 'q-px-sm' : ''"
      >
        <q-card-section>
          <div class="row">
            <div class="col-md-2">
              <q-avatar
                icon="warning"
                color="warning"
                text-color="white"
                size="lg"
              />
            </div>
            <div class="col-md-10">
              <label class="text-left warning_msg">
                {{ $t("app.sessionWarningMsg") }}
                <b>{{ session.year }}</b></label
              ><br />
              <label class="text-grey text-weight-medium"
                >{{ $t("app.setSessionWarnimngMsg") }}?</label
              >
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-my-md">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            v-close-popup
            class="q-mr-lg"
          />
          <q-btn
            flat
            :label="$t('app.saveBtnLabel')"
            color="primary"
            @click="saveSession()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import moment from "moment";
import ButtonVue from "./Button.vue";
import SessionStatusVue from "./Constants/SessionStatus.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";
import { LocalStorage } from "quasar";
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
    table_loading: {
      required: false,
      type: Boolean,
    },
  },
  data() {
    return {
      show_add_session: false,
      session: {
        status: SessionStatusVue.ACTIVE,
        year: new Date().getFullYear(),
        id: null,
      },
      is_fetching: false,
      session_statuses: [SessionStatusVue.ACTIVE, SessionStatusVue.IN_ACTIVE],
      show_warning: false,
    };
  },
  computed: {
    canAddSession() {
      const data = LocalStorage.getItem("data");
      return data.current_session === null;
    },
  },
  methods: {
    formateDate(date) {
      return moment(date).format("MMMM Do YYYY");
    },

    onSetSession() {
      this.show_add_session = false;
      return (this.show_warning = !this.show_warning);
    },

    saveSession() {
      let payload = {
        url: `/api/protected/sessions`,
        data: this.session,
        msg: this.$t("app.saveSessionSuccessMsg"),
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
        .dispatch("postRequest", payload)
        .then(() => {
          this.is_fetching = false;
          this.$emit("fetch-sessions");
        })
        .finally(() => {
          this.session.status = SessionStatusVue.ACTIVE;
          this.session.id = null;
          this.session.year = null;
          this.show_warning = false;
        });
    },

    closeAddSessionDialog() {
      this.session.year = null;
      this.session.status = SessionStatusVue.ACTIVE;
      this.session.id = null;
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

.warning_msg {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
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
