<template>
  <div class="q-pa-xs">
    <div class="button q-pb-xs"></div>
    <q-table
      :data="data"
      :columns="columns"
      row-key="index"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }"
      :filter="filter"
      :pagination.sync="pagination"

    >
      <template v-slot:top-left>
        <div class="text-h6 title" v-show="show_member_savings">
          All Savings for: {{ title }}
        </div>
        <div class="text-h6 title" v-show="show_contribution || show_member_contribution">
          {{ title }}
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td
            key="name"
            :props="props"
            v-if="!show_contribution || !show_member_contribution"
          >
            {{ props.row.name }}
          </q-td>
          <q-td
            key="user_name"
            :props="props"
            v-if="show_contribution || show_member_contribution"
          >
            {{ props.row.user_name }}
          </q-td>
          <q-td
            key="email"
            :props="props"
            v-show="show_savings || show_members"
          >
            {{ props.row.email }}
          </q-td>
          <q-td key="gender" :props="props" v-show="show_members">
            {{ props.row.gender }}
          </q-td>
          <q-td
            key="telephone"
            :props="props"
            v-show="show_savings || show_members"
          >
            {{ props.row.telephone }}
          </q-td>
          <q-td key="address" :props="props" v-show="show_members">
            {{ props.row.address }}
          </q-td>
          <q-td key="occupation" :props="props" v-show="show_members">
            {{ props.row.occupation }}
          </q-td>
          <q-td
            key="amount_deposited"
            :props="props"
            v-show="
              show_savings ||
              show_member_savings ||
              show_member_contribution
            "
          >
            {{ Number(props.row.amount_deposited).toLocaleString() }}
          </q-td>
          <q-td
            key="total_amount_deposited"
            :props="props"
            v-show="show_contribution">
            {{ Number(props.row.total_amount_deposited).toLocaleString() }}
          </q-td>
          <q-td key="approve" :props="props" v-show="show_member_savings">
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="amount"
            :props="props"
            v-show="show_income_activity || show_contribution"
          >
            {{ Number(props.row.amount).toLocaleString() }}
          </q-td>
          <q-td
            key="balance"
            :props="props"
            v-show="show_contribution || show_member_contribution"
          >
            {{ Number(props.row.balance).toLocaleString() }}
          </q-td>
          <q-td key="status" :props="props" v-show="show_contribution || show_member_contribution">
            {{ props.row.status }}
          </q-td>
          <q-td
            key="date"
            :props="props"
            v-if="
              show_savings ||
              show_member_savings ||
              show_income_activity
            "
          >
            {{ getFormatedDate(props.row.date) }}
          </q-td>
          <q-td
            key="date"
            :props="props"
            v-if="
              show_contribution ||
              show_member_contribution
            "
          >
            {{ getFormatedDate(props.row.created_at) }}
          </q-td>
          <q-td key="venue" :props="props" v-show="show_income_activity">
            {{ props.row.venue }}
          </q-td>
          <q-td
            key="state"
            :props="props"
            v-if="
              show_member_savings ||
              show_savings ||
              show_income_activity ||
              show_contribution || show_member_contribution
            "
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="action" :props="props">
            <!-- button to handle edit, view and delete of row data -->
            <q-btn
              flat
              round
              v-if="
                !show_savings && !show_member_savings && !checkTreasurerRole()
              "
            >
              <q-icon
                name="more_vert"
                size="xs"
                color="primary"
                class="menu_icon"
                clickable
              >
                <q-menu>
                  <q-list style="width: 180px" bordered separator>
                    <!-- edit member -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditMember(props.row)"
                      v-show="show_members"
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

                    <!-- invite members to the app -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onInviteMember(props.row)"
                      v-show="checkPresidentRole()"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="share" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">Invite Member</q-item-label>
                      </q-item-section>
                    </q-item>

                    <!-- edit, view income activities -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditIncomeActivity(props.row)"
                      v-show="show_income_activity"
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

                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewIncomeActivity(props.row)"
                      v-show="show_income_activity"
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

                    <!-- edit and view contributions -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewContribution(props.row)"
                      v-show="show_member_contribution"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="info" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">View</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewAllMemberContributions(props.row)"
                      v-show="show_contribution"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="info" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">Details</q-item-label>
                      </q-item-section>
                    </q-item>

                    <!-- deleted specify row -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDeleteMember(props.row)"
                      v-show="!show_member_savings"
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

            <!-- button for view all savings by member -->
            <q-btn
              flat
              class="view_savings q-py-xs"
              @click="showMemberSavings(props.row)"
              :to="{ name: 'user_savings', params: { id: props.row.user_id } }"
              v-if="show_savings && !checkTreasurerRole()"
            >
              View All Savings
            </q-btn>

            <!-- menu to handle edit and view details of a single saving -->
            <q-btn
              flat
              round
              v-if="show_member_savings && !checkTreasurerRole()"
            >
              <q-icon
                name="more_vert"
                size="xs"
                color="primary"
                class="menu_icon"
                clickable
              >
                <q-menu>
                  <q-list bordered separator>
                    <!-- edit and view savings -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditMemberSaving(props.row)"
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

                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewMemberSaving(props.row)"
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
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>

            <!-- buttons for approve and decline row data -->
            <q-btn
              :class="
                show_savings || show_income_activity || show_contribution
                  ? 'decline_btn_saving'
                  : 'decline_btn'
              "
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
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          v-model="filter"
          :class="
            $q.screen.md
              ? 'text-h6-sm q-mb-lg q-mt-lg full-width'
              : 'text-h6-sm'
          "
          placeholder="Type name to search..."
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <!-- confirmation dialog for delete -->
    <q-dialog v-model="dialog" v-if="dialog">
      <q-card>
        <q-card-section>
          <div>
            <!-- <q-avatar
              icon="warning"
              class="warning_image"
              size="30px"
              color="yellow"
              text-color="white"
            /> -->
            <label class="q-ml-sm text-dark">{{ message }}</label>
          </div>
          <div class="text-weight-bold text-center">{{ deleted_row.name }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :label="label_cancel"
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

    <!-- dialog for invite members. -->
    <q-dialog v-model="show_invite" position="top">
      <q-card>
        <q-card-section>
          <div class="text-h6 q-pa-sm heading">
            Invite your Team Members to use Financial Assistance
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none" v-if="show_invite">
          <div class="row q-gutter-xl justify-center">
            <div>
              <q-btn
                round
                color="dark"
                icon="mail"
                size="md"
                :href="
                  'mailto:' +
                  member_to_be_invited.email +
                  '?subject=' +
                  invite_msg_subject +
                  '&cc=&bcc=&body=' +
                  invite_msg
                "
              >
                <q-tooltip>Invite via email</q-tooltip></q-btn
              >
            </div>
            <div>
              <q-btn round color="secondary" size="md" @click="whatsappInvite()"
                ><i class="bi bi-whatsapp"></i
              ></q-btn>
              <q-tooltip>Invite via Whatsapp</q-tooltip>
            </div>
            <div>
              <q-btn
                round
                color="primary"
                icon="facebook"
                size="md"
                @click="faceBookInvite()"
              />
              <q-tooltip>Invite via Facebook</q-tooltip>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
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
            :label="label_cancel"
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
import UserSavingMixinVue from "src/mixins/UserSavingMixin.vue";
import IncomeActivityMixin from "src/mixins/IncomeActivityMixin.vue";
import { LocalStorage } from "quasar";
import moment from "moment";
import ContributionsMixinVue from "src/mixins/ContributionsMixin.vue";

export default {
  mixins: [
    UserSavingMixinVue,
    IncomeActivityMixin,
    UserSavingMixinVue,
    ContributionsMixinVue,
  ],

  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    label: {
      required: true,
      type: String,
    },
    member_name: {
      required: false,
      type: Object,
    },
    show_members: {
      required: true,
      type: Boolean,
    },
    show_savings: {
      required: true,
      type: Boolean,
    },
    message: {
      type: String,
      required: true,
    },
    show_member_savings: {
      required: false,
      type: Boolean,
    },
    title: {
      required: false,
      type: String,
    },
    show_income_activity: {
      type: Boolean,
      required: true,
    },
    show_contribution: {
      type: Boolean,
      required: true,
    },
    show_member_contribution: {
      required: false,
      type: Boolean,
    },
  },
  data() {
    return {
      label_download: "Print",
      loading: false,
      color: "positive",
      no_caps: true,
      dialog: false,
      filter: "",
      label_cancel: "Cancel",
      pagination: {
        rowsPerPage: 15, // current rows per page being displayed
      },
      deleted_row: null,
      show_invite: false,
      member_to_be_invited: null,
      redirect_url: process.env.REDIRECT_URL,
      invite_msg_subject: "Invitation to Join Financial Assistance",
      invite_msg:
        "Hello there! You have been invited to join Financial Assistance in order to better manage your financial transaction.  " +
        "Click the link to join: " +
        process.env.REDIRECT_URL +
        ".  If you don't recognize the sender, simply ignore this message.",
      show_approve_dialog: false,
      chosen_state: null,
      approve_msg: null,
      approve_data: null,
    };
  },
  methods: {
    onEditMember(data) {
      let payload = {
        url: `/api/protected/organisations/users/${data.id}`,
        data: this.user,
        msg: "Member information updated successfully",
        status: "none",
        color: "default",
        show_feedback: true,
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        show_spinner: false,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.$emit("update-member", { data: res.data, tab: "EditMember" });
      });
    },

    onInviteMember(data) {
      this.show_invite = true;
      this.member_to_be_invited = data;
    },

    emailInvite() {},

    whatsappInvite() {
      let msg = this.invite_msg_subject + "\n\n" + this.invite_msg;
      let whatsapp_url = `https://api.whatsapp.com/send?phone=${
        this.member_to_be_invited.telephone
      }&text=${encodeURIComponent(msg)}`;
      window.open(whatsapp_url);
    },

    faceBookInvite() {},

    checkPresidentRole() {
      const president_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name == "PRESIDENT"
      );
      return president_role != undefined;
    },

    deleteRow(data) {
      let payload = {
        url: `/api/protected/users/${data.id}`,
        msg: "Member successfully deleted",
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
        this.$emit("fetch-members", data.organisation_id);
      });
    },

    onDeleteMember(data) {
      this.deleted_row = data;
      this.dialog = true;
    },

    showMemberSavings(data) {
      this.getMemberSavings(data.user_id);
    },

    onEditMemberSaving(data) {
      let payload = {
        data: data,
        tab: "Member Savings",
      };
      this.$store.dispatch("setEditState", false);

      this.$store.dispatch("setUpdatedMemberSaving", data);

      this.$emit("edit-member-saving", payload);
    },

    onViewMemberSaving(data) {
      let payload = {
        data: data,
        tab: "View Member Saving",
      };
      this.$store.dispatch("setEditState", true);

      this.$store.dispatch("setCurrentMemberSaving", data);

      this.$emit("view-member-saving", payload);
    },

    onEditIncomeActivity(data) {
      let payload = {
        data: data,
        tab: "Income Activities",
      };

      this.$store.dispatch("setEditState", false);

      this.$store.dispatch("setUpdatedIncomeActivity", data);

      this.$emit("edit-income-activity", payload);
    },

    onViewIncomeActivity(data) {
      let payload = {
        data: data,
        tab: "View Income Activity",
      };
      this.$store.dispatch("setEditState", false);

      this.$store.dispatch("setCurrentIncomeActivity", data);

      this.$emit("view-income-activity", payload);
    },

    onViewAllMemberContributions(data) {

      this.$router.push({
        name: "member_contributions",
        params: { item_id:data.payment_item_id, id: data.user_id },
      });
    },

    onViewContribution(data) {
      let payload = {
        data: data,
        tab: "View Contribution",
      };

      this.$store.dispatch("setSelectedContribution", data);

      this.$store.dispatch("setEditState", true);

     this.$emit("view-contribution", payload);
    },

    onAllContribution(data) {
      this.$router.push({
        name: "member_contributions",
        params: { id: data.id },
      });
    },

    getFormatedDate(date) {
      return moment(date).format("MMMM Do YYYY");
    },

    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name == "TREASURER"
      );
      return treasurer_role != undefined;
    },
    onApprovedRecord(row, state) {
      this.show_approve_dialog = true;
      this.approve_data = row;
      this.chosen_state = state;
      this.setApproveWarningMsgByType(row);
    },

    onDeclineRecord(row, state) {
      this.show_approve_dialog = true;
      this.approve_data = row;
      this.chosen_state = state;
      this.setApproveWarningMsgByType(row);
    },

    onChangeRecordState() {
      let payload = {
        url: this.setApproveUrlBaseOnType(this.approve_data),
        msg: this.setApproveFeedbackMsg(),
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
          this.fetchDataBaseOnTypeAfterApprove(this.approve_data);
        }
      });
    },

    setApproveUrlBaseOnType(data) {
      let url = "";
      let type = this.chosen_state == "Approve" ? "APPROVED" : "DECLINED";
      switch (data.type) {
        case "INCOME_ACTIVITIES":
          url = `/api/protected/income-activities/${data.id}/approve?type=${type}`;
          break;
        case "MEMBERS_SAVINGS":
          url = `/api/protected/user-savings/${data.id}?type=${type}`;
          break;
        case "MEMBERS_CONTRIBUTIONS":
          url = `/api/protected/contributions/${data.id}/approve?type=${type}`;
          break;
      }

      return url;
    },

    setApproveFeedbackMsg() {
      let msg = `Record was ${this.chosen_state} successfully`;
      return msg;
    },

    setApproveWarningMsgByType(data) {
      let date = "";
      switch (data.type) {
        case "INCOME_ACTIVITIES":
          date = moment(data.date).format("MMMM Do YYYY");
          this.approve_msg = ` ${data.amount}  F CFA  for ${data.name} on the ${date} at ${data.venue} ?`;
          break;
        case "MEMBERS_SAVINGS":
          date = moment(data.created_at).format("MMMM Do YYYY");
          this.approve_msg = ` ${data.amount_deposited} F CFA Member Saving for ${data.name} on the ${date} ?`;
          break;
        case "MEMBERS_CONTRIBUTIONS":
          date = moment(data.date).format("MMMM Do YYYY");
          this.approve_msg = ` ${data.amount_deposited} F CFA Payment for ${data.name} on the ${date} ?`;
      }

      return this.approve_msg;
    },

    fetchDataBaseOnTypeAfterApprove(data) {
      let organisation_id = this.$store.getters.getOrganisation.id;
      let search_savings_url = "";
      let payload = {
        status:
          this.$store.getters.getSearchSavingParams.status == undefined
            ? ""
            : this.$store.getters.getSearchSavingParams.status,
        name:
          this.$store.getters.getSearchSavingParams.name == undefined
            ? ""
            : this.$store.getters.getSearchSavingParams.name,
        amount_deposited:
          this.$store.getters.getSearchSavingParams.amount_deposited ==
          undefined
            ? 0
            : this.$store.getters.getSearchSavingParams.amount_deposited,
        date_range:
          this.$store.getters.getSearchSavingParams.date_range == undefined
            ? ""
            : this.$store.getters.getSearchSavingParams.date_range,
        date:
          this.$store.getters.getSearchSavingParams.date == undefined
            ? ""
            : this.$store.getters.getSearchSavingParams.date,
        month:
          this.$store.getters.getSearchSavingParams.month == undefined
            ? ""
            : this.$store.getters.getSearchSavingParams.month,
        year:
          this.$store.getters.getSearchSavingParams.year == undefined
            ? ""
            : this.$store.getters.getSearchSavingParams.year,
        payment_item_id:
          this.$store.getters.getSearchSavingParams.payment_item_id == undefined
            ? ""
            : this.$store.getters.getSearchSavingParams.payment_item_id,
        range:
          this.$store.getters.getSearchSavingParams.range == undefined
            ? ""
            : this.$store.getters.getSearchSavingParams.range,
        organisation_id:
          this.$store.getters.getSearchSavingParams.organisation_id == undefined
            ? ""
            : this.$store.getters.getSearchSavingParams.organisation_id,
      };

      switch (data.type) {
        case "INCOME_ACTIVITIES":
          this.getOrganisationIncomeActivities(organisation_id);
          break;
        case "MEMBERS_SAVINGS":
          search_savings_url = `/api/protected/user-savings?organisation_id=${organisation_id}&status=${status}&name=${name}&amount_deposited=${amount_deposited}&year=${year}&month=${month}&date=${date}&date_range=${date_range}`;
          this.filterSaving(search_savings_url);
          break;
        case "MEMBERS_CONTRIBUTIONS":
          this.filterMembersContributions(payload);
          break;
      }
    },
  },
  components: {},
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
  color: $primary;
}

.invite {
  color: $dark;
}

.warning_image {
  color: yellow;
}

.view_savings {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 25px;
  align-items: left;
  letter-spacing: 0.01em;
  text-transform: capitalize;
  color: $primary;
}

.heading {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 25px;
  align-items: left;
  letter-spacing: 0.01em;
  color: $dark;
}

.title {
  font-size: small;
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

.decline_btn_saving {
  background-color: $orange;
  color: white;
  margin-right: 5rem;
}

.approve {
  color: $secondary;
}

.decline {
  color: $orange;
}
</style>
