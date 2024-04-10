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
      >
        <template v-slot:top-left>
          <div>
            <label for="title" class="title">{{ table_header }}</label>
          </div>
        </template>
        <template v-slot:top-right>
          <q-btn
            label="Add"
            dense
            size="sm"
            color="primary"
            no-caps
            class="q-pa-xs"
            icon-right="add"
            @click="show_add_session = true"
          >
            <q-tooltip> {{ $t("app.settingsAddSessionLabel") }} </q-tooltip>
          </q-btn>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" class="text-bold">
            <q-td key="year" :props="props">
              {{ props.row.year }}
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
            <q-td key="updated_by" :props="props">
              {{ props.row.updated_by }}
            </q-td>
            <q-td key="created_at" :props="props">
              {{ props.row.created_at }}
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
        :style="$q.platform.is.mobile ? 'min-width: 350px' : 'min-width: 450px'"
        class="q-px-md q-pt-sm q-pb-sm"
      >
        <q-card-section class="row items-center q-pb-lg">
          <div class="text-h6 add_year" v-if="session.id == null">
            {{ $t("app.settingsAddSessionLabel") }}
          </div>
          <div class="text-h6 add_year" v-else>
            {{ $t("app.updateSession") }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup  @click="closeAddSessionDialog" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSetSession" class="q-gutter-md">
            <div>
              <label for="credential" class="form_field"
                >{{ $t("app.year") }} <span class="text-red">*</span></label
              >
              <q-input
                v-model="session.year"
                outlined
                dense
                type="text"
                :disable="this.session != undefined && this.session.id != null"
              />
            </div>
            <div>
              <label for="credential" class="form_field"
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
            <div class="flex q-mt-lg justify-end">
              <div>
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
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--end add registration fee -->

    <q-dialog v-model="show_warning">
      <q-card style="width: 400px">
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
              <label class="text-left warning_msg"> {{$t('app.sessionWarningMsg')}} <b>{{ session.year }}</b></label><br/>
              <label class="text-grey text-weight-medium"  >{{ $t('app.setSessionWarnimngMsg') }}?</label>
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
import ButtonVue from "./Button.vue";
import SessionStatusVue from "./Constants/SessionStatus.vue";
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
        year: null,
        id: null,
      },
      is_fetching: false,
      session_statuses: [SessionStatusVue.ACTIVE, SessionStatusVue.IN_ACTIVE],
      show_warning:false,
    };
  },
  methods: {
    getCurrentSession() {
      const current_session = this.data.filter(
        (ele) => ele.status == SessionStatusVue.ACTIVE
      );
      return current_session != undefined ? current_session[0] : null;
    },

    onSetSession() {
      this.show_add_session = false;
     return this.show_warning = !this.show_warning;
    },

    saveSession(){
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
    }
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

.warning_msg {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
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

.warning_caption {
  color: $orange;
  font-weight: 500;
  font-size: 13px;
}
</style>
