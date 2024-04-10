<template>
  <div>
    <div class="row" :class="$q.platform.is.mobile ? 'q-px-sm' : ''">
      <q-list
        bordered
        padding
        class="col-4 col-md-4 col-sm-12 col-xs-12 col-lg-4"
      >
        <q-item-label header class="setting_title">{{
          $t("app.organisationLabel")
        }}</q-item-label>

        <q-item
          clickable
          v-ripple
          @click="getCurrentItem('Session')"
          :active-class="tag == 'Session' ? 'active_item' : ''"
          :active="tag == 'Session'"
        >
          <q-item-section avatar top>
            <q-icon
              name="timer"
              :class="
                tag == 'Session' ? 'icon_color_active' : 'icon_color_in_active'
              "
              size="xs"
            ></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label
              :class="
                tag == 'Session'
                  ? 'text_header_active'
                  : 'text_header_in_active'
              "
              >{{ $t("app.sessionLabel") }}</q-item-label
            >
            <q-item-label
              caption
              :class="tag == 'Session' ? 'text_active' : 'text_in_active'"
            >
              {{ $t("app.sessionCaptionMsg") }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          @click="getCurrentItem('Registration_fee')"
          :active-class="tag == 'Registration_fee' ? 'active_item' : ''"
          :active="tag == 'Registration_fee'"
        >
          <q-item-section avatar top>
            <q-icon
              name="monetization_on"
              :class="
                tag == 'Registration_fee'
                  ? 'icon_color_active'
                  : 'icon_color_in_active'
              "
              size="xs"
            ></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label
              :class="
                tag == 'Registration_fee'
                  ? 'text_header_active'
                  : 'text_header_in_active'
              "
              >{{ $t("app.registrationFeeLabel") }}</q-item-label
            >
            <q-item-label
              caption
              :class="
                tag == 'Registration_fee' ? 'text_active' : 'text_in_active'
              "
            >
              {{ $t("app.registrationFeeCaptionMsg") }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item-label header class="setting_title">{{
          $t("app.settingsGeneralLabel")
        }}</q-item-label>

        <q-item tag="label" v-ripple>
          <q-item-section avatar top>
            <q-icon
              name="translate"
              class="icon_color_general"
              size="xs"
            ></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text_header_general">{{
              $t("app.settingsLanguage")
            }}</q-item-label>
            <q-item-label caption class="caption_text_general">
              {{ $t("app.settingsLanguageCaption") }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn-dropdown :label="getLocale" flat class="labelText">
              <q-list>
                <q-item
                  clickable
                  v-close-popup
                  @click="onItemClick('en-US')"
                  class="lang_text"
                >
                  <q-item-section class="text-center">
                    <q-item-label>{{ $t("app.english") }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  v-close-popup
                  @click="onItemClick('fr')"
                  class="lang_text"
                >
                  <q-item-section class="text-center">
                    <q-item-label>{{ $t("app.french") }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-item-section>
        </q-item>
      </q-list>
      <SessionsTable
        :data="data"
        :columns="columns"
        :table_loading="loading_session"
        :table_header="session_table_header"
        @fetch-sessions="getSessions"
        class="col-8 col-md-8 col-sm-12 col-xs-12"
        v-if="tag == 'Session'"
      ></SessionsTable>
      <RegistrationFeeTable
        :columns="reg_table_columns"
        :data="reg_table_data"
        :table_header="table_header"
        :loading="loading_reg_fees"
        @fetch-registration-fee="getRegFee"
        class="col-8 col-md-8 col-sm-12 col-xs-12 col-lg-8"
        v-if="tag == 'Registration_fee'"
      ></RegistrationFeeTable>
    </div>

    <!-- add new year dialog -->
    <q-dialog v-model="show_add_year">
      <q-card style="min-width: 400px" class="q-px-md q-pt-sm q-pb-md">
        <q-card-section class="row items-center q-pb-lg">
          <div class="text-h6 add_year">
            {{ $t("app.settingsAddSessionLabel") }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onAddYear" class="q-gutter-md">
            <div>
              <q-input v-model="year" outlined dense> </q-input>
            </div>
            <div class="q-mt-lg flex justify-end">
              <div class="q-mt-xs">
                <ButtonVue
                  class="form_button"
                  :label="saveBtnLabel"
                  :loading="is_fetching"
                  color="primary"
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

    <!--update year dialog -->
    <q-dialog v-model="show_edit_year">
      <q-card style="min-width: 400px" class="q-px-md q-pt-sm q-pb-sm">
        <q-card-section class="row items-center q-pb-lg">
          <div class="text-h6 add_year">
            {{ $t("app.settingsUpdateSessionLabel") }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onUpdateYear" class="q-gutter-md">
            <div>
              <q-input v-model="updated_year.year" outlined disable dense>
              </q-input>
            </div>
            <div class="q-mt-lg">
              <q-select
                v-model="updated_year.status"
                outlined
                :options="year_statuses"
                dense
                :label="yearLabel"
              />
            </div>
            <div class="flex q-mt-lg justify-end">
              <div class="q-mt-xs">
                <ButtonVue
                  class="form_button"
                  :label="saveBtnLabel"
                  :loading="is_fetching"
                  color="primary"
                  :no_caps="true"
                  :disabled="false"
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
import ButtonVue from "src/components/Button.vue";
import moment from "moment";
import RegistrationFeeTable from "src/components/RegistrationFeeTable.vue";
import SessionsTable from "src/components/SessionsTable.vue";
import RegistrationAmountMixin from "src/mixins/RegistrationAmountMixin.vue";
export default {
  mixins: [RegistrationAmountMixin],
  mounted() {
    this.getSessions();
    this.getRegistrationAmount();
    this.getRegFee();
  },
  data() {
    return {
      saveBtnLabel: this.$t("app.saveBtnLabel"),
      yearLabel: this.$t("app.selectYearLabel"),
      columns: [
        {
          name: "year",
          required: true,
          label: "Year",
          align: "left",
          field: (row) => row.year,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: "Status",
          field: "status",
          sortable: true,
        },
        {
          name: "updated_by",
          align: "left",
          label: "Created By",
          field: "updated_by",
          sortable: true,
        },
        {
          name: "created_at",
          label: "Created Date",
          field: "created_at",
          align: "left",
        }
      ],
      data: [],
      tag: "Session",
      show_add_year: false,
      is_fetching: false,
      year: null,
      show_edit_year: false,
      updated_year: {
        year: null,
        status: null,
        id: null,
      },
      year_statuses: ["ACTIVE", "IN_ACTIVE"],
      reg_table_columns: [
        {
          name: "amount",
          align: "left",
          label: "Amount (XAF)",
          field: "amount",
          sortable: true,
        },
        {
          name: "frequency",
          align: "left",
          label: "Frequency",
          field: "frequency",
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: "Status",
          field: "status",
          sortable: true,
        },
        {
          name: "is_complusory",
          align: "left",
          label: "Compulsory",
          field: "is_complusory",
          sortable: true,
        },
        {
          name: "updated_by",
          align: "left",
          label: "Created By",
          field: "updated_by",
          sortable: true,
        },
        {
          name: "updated_at",
          align: "left",
          label: "Modified date",
          field: "updated_at",
          sortable: true,
        },
        { name: "action", label: "Action", field: "action", align: "left" },
      ],
      reg_table_data: [],
      table_header: this.$t("app.regFeeLabel"),
      session_table_header: this.$t("app.sessionLabel"),
      loading_session: false,
      loading_reg_fees: false,
    };
  },
  computed: {
    validateForm() {
      return this.year == null;
    },
    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },
    getLocale() {
      return this.$i18n.locale === "en-US"
        ? this.$t("app.english")
        : this.$t("app.french");
    },
  },

  methods: {
    formDateTime(date) {
      return moment(date).format("MMMM Do YYYY");
    },

    getCurrentItem(type) {
      this.tag = type;
      switch (this.tag) {
        case "Session":
          this.getSessions();
          break;
        case "Registration_fee":
          this.getRegFee();
          break;
      }
    },

    onAddYear() {
      this.is_fetching = true;
      let payload = {
        url: `/api/protected/sessions`,
        data: { year: this.year },
        msg: "Year added Successfully",
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
      this.$store
        .dispatch("postRequest", payload)
        .then(() => {
          this.getSessions();
          this.show_add_year = false;
        })
        .finally(() => {
          this.is_fetching = false;
        });
    },

    getSessions() {
      let payload = {
        url: `/api/protected/sessions`,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_spinner: true,
        show_feedback: false,
        error_msg: "An Error occurred! Please try again",
        has_commit: true,
        commit: "SET_SESSIONS",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading_session = true;
      this.data = [];
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          if (res.success) {
            res.data.forEach((session) => {
              this.data.push({
                id: session.id,
                year: session.year,
                status: session.status,
                created_at: session.created_at,
                updated_at: session.updated_at,
                counter: res.data.indexOf(session) + 1,
                updated_by: session.updated_by,
              });
            });
          }
          return this.data;
        })
        .finally(() => {
          this.loading_session = false;
        });
    },

    editYear(data) {
      this.updated_year = data;
      this.show_edit_year = true;
    },

    onUpdateYear() {
      this.is_fetching = true;
      let payload = {
        url: `/api/protected/sessions/update?id${this.updated_year.id}&status=${this.updated_year.status}`,
        data: { year: this.year },
        msg: "Year updated Successfully",
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
      this.$store
        .dispatch("putRequest", payload)
        .then(() => {
          this.is_fetching = false;
          this.getSessions();
          this.show_edit_year = false;
        })
        .finally(() => {});
    },

    getRegFee() {
      let payload = {
        url: `/api/protected/registration_fees`,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_spinner: true,
        show_feedback: false,
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading_reg_fees = true;
      this.reg_table_data = [];
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          if (res.success) {
            res.data.forEach((ele) => {
              this.reg_table_data.push({
                counter: res.data.indexOf(ele) + 1,
                id: ele.id,
                amount: ele.amount,
                frequency: ele.frequency,
                status: ele.status,
                is_compulsory: ele.is_compulsory,
                created_at: ele.created_at,
                updated_at: ele.updated_at,
                updated_by: ele.updated_by,
              });
            });
          }
          return this.reg_table_data;
        })
        .finally(() => {
          this.loading_reg_fees = false;
        });
    },

    onItemClick(lang) {
      if (lang == "fr") {
        this.$i18n.locale = "fr";
        this.showAppTranslateLoading();
      }
      if (lang == "en-US") {
        this.$i18n.locale = "en-US";
        this.showAppTranslateLoading();
      }
    },

    showAppTranslateLoading() {
      this.$q.loading.show({
        message: this.$t("app.appTranslationLabel"),
        backgroundColor: "primary",
        sanitize: true,
      });

      // hiding in 3s
      this.timer = setTimeout(() => {
        this.$q.loading.hide();
        this.timer = void 0;
      }, 5000);
    },

    beforeDestroy() {
      if (this.timer !== void 0) {
        clearTimeout(this.timer);
        this.$q.loading.hide();
      }
    },
  },

  components: {
    ButtonVue,
    RegistrationFeeTable,
    SessionsTable,
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

.lang_text {
  color: $grey8;
}

.labelText {
  font-size: small;
  color: $grey8;
}

.caption_text_general {
  color: $grey2;
}

.edit_year {
  color: $primary;
  cursor: pointer;
}
.delete_year {
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
</style>
