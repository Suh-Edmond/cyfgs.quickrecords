<template>
  <div>
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-lg"
        v-if="getLoadingState"
      />
    </div>

    <div class="row q-px-sm">
      <div class="col-md-4 col-sm-12 col-xs-12">
        <div class="items">
          <q-list bordered padding>
            <q-item-label header class="setting_title"
              >Organisation</q-item-label
            >

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
                    tag == 'Session'
                      ? 'icon_color_active'
                      : 'icon_color_in_active'
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
                  >Session</q-item-label
                >
                <q-item-label
                  caption
                  :class="tag == 'Session' ? 'text_active' : 'text_in_active'"
                >
                  Set the current Session for the organisation
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
                  >Registration Fee</q-item-label
                >
                <q-item-label
                  caption
                  :class="
                    tag == 'Registration_fee' ? 'text_active' : 'text_in_active'
                  "
                >
                  Set the Registration fee for memebers
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              @click="getCurrentItem('Roles')"
              :active-class="tag == 'Roles' ? 'active_item' : ''"
              :active="tag == 'Roles'"
            >
              <q-item-section avatar top>
                <q-icon
                  name="folder"
                  :class="
                    tag == 'Roles'
                      ? 'icon_color_active'
                      : 'icon_color_in_active'
                  "
                  size="xs"
                ></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label
                  :class="
                    tag == 'Roles'
                      ? 'text_header_active'
                      : 'text_header_in_active'
                  "
                  >Roles</q-item-label
                >
                <q-item-label
                  caption
                  :class="tag == 'Roles' ? 'text_active' : 'text_in_active'"
                >
                  Set the number of members for each role
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              @click="getCurrentItem('Subscription')"
              :active-class="tag == 'Subscription' ? 'active_item' : ''"
              :active="tag == 'Subscription'"
            >
              <q-item-section avatar top>
                <q-icon
                  name="folder"
                  :class="
                    tag == 'Subscription'
                      ? 'icon_color_active'
                      : 'icon_color_in_active'
                  "
                  size="xs"
                ></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label
                  :class="
                    tag == 'Subscription'
                      ? 'text_header_active'
                      : 'text_header_in_active'
                  "
                  >Subscription Plan</q-item-label
                >
                <q-item-label
                  caption
                  :class="
                    tag == 'Subscription' ? 'text_active' : 'text_in_active'
                  "
                >
                  Manage organisation subscription plans
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />
            <q-item-label header class="setting_title">General</q-item-label>

            <q-item>
              <q-item-section avatar top>
                <q-icon
                  name="folder"
                  class="icon_color_general"
                  size="xs"
                ></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text_header_general"
                  >Notifications</q-item-label
                >
                <q-item-label caption class="caption_text_general">
                  Notify me when a member with a role joins the system
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  color="blue"
                  v-model="new_role_member"
                  val="battery"
                />
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
              <q-item-section avatar top>
                <q-icon
                  name="folder"
                  class="icon_color_general"
                  size="xs"
                ></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text_header_general"
                  >Dark Mode</q-item-label
                >
                <q-item-label caption class="caption_text_general">
                  Change my appearance to dark mode
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle color="blue" v-model="mode" val="battery" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <div class="col-md-8 col-sm-12 col-xs-12">
        <!-- div for Sessions -->
        <div v-if="tag == 'Session'" class="q-ml-lg">
          <SessionsTable
            :data="data"
            :columns="columns"
            :loading="getLoadingState"
            :table_header="session_table_header"
            @fetch-sessions="getSessions"
          ></SessionsTable>
        </div>

        <!-- div for registration fee -->
        <div v-if="tag == 'Registration_fee'" class="q-ml-lg">
          <RegistrationFeeTable
            :columns="reg_table_columns"
            :data="reg_table_data"
            :table_header="table_header"
            :loading="getLoadingState"
            @fetch-registration-fee="getRegFee"
          ></RegistrationFeeTable>
        </div>
      </div>
    </div>

    <!-- add new year dialog -->
    <q-dialog v-model="show_add_year">
      <q-card style="min-width: 400px" class="q-px-md q-pt-sm q-pb-md">
        <q-card-section class="row items-center q-pb-lg">
          <div class="text-h6 add_year">Add Session</div>
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
                  label="Save"
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
          <div class="text-h6 add_year">Update Session</div>
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
                label="Select year"
              />
            </div>
            <div class="flex q-mt-lg justify-end">
              <div class="q-mt-xs">
                <ButtonVue
                  class="form_button"
                  label="Save"
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
export default {
  mounted() {
    this.getSessions();
  },
  data() {
    return {
      mode: false,
      new_role_member: false,
      columns: [
        {
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
        },
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
        { name: "action", label: "Action", field: "action", align: "left" },
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
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
        },
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
        { name: "action", label: "Action", field: "action", align: "left" },
      ],
      reg_table_data: [],
      table_header: "Member's Registration Fee",
      session_table_header: "Sessions",
    };
  },
  computed: {
    validateForm() {
      return this.year == null;
    },
    getLoadingState() {
      return this.$store.getters.getFetchingState;
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
          this.is_fetching = false;
          this.getSessions();
          this.show_add_year = false;
        })
        .finally(() => {});
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
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        if (res) {
          this.data = [];
          res.data.forEach((ele) => {
            this.data.push({
              counter: res.data.indexOf(ele) + 1,
              id: ele.id,
              year: ele.year,
              status: ele.status,
              created_at: ele.created_at,
              updated_at: ele.updated_at,
              updated_by: ele.updated_by,
            });
          });
        }
        return this.data;
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
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.reg_table_data = [];
        if (res) {
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
      });
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
