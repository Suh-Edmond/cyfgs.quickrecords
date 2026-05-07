<template>
  <q-page>
    <q-header class="bg-primary text-white header">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="showLeftDrawer"
          v-if="$q.screen.lt.md"
        />
        <q-toolbar-title class="toolbar_title wrap">
          {{ $t("app.welcomeLabel") }} {{ auth_user_role }}
        </q-toolbar-title>

        <div>
          <q-btn
            round
            icon="notifications"
            class="q-mr-xl"
            flat
            v-if="canViewNotification()"
            size="sm"
            @click="getNotifications()"
          >
            <q-badge
              floating
              :color="notifications.length > 0 ? 'info' : ''"
              rounded
            >
              <span v-if="notifications.length > 0">{{
                notifications.length
              }}</span>
            </q-badge>
            <q-menu
              max-height="400px"
              :max-width="$q.platform.is.desktop ? '450px' : '330px'"
              :anchor="$q.platform.is.desktop ? 'top left' : 'top center'"
              :self="$q.platform.is.desktop ? 'bottom start' : 'bottom center'"
            >
              <q-list
                :style="
                  $q.platform.is.desktop
                    ? 'min-width: 450px'
                    : 'min-width: 300px'
                "
              >
                <q-item>
                  <q-item-section>
                    <div class="flex justify-between">
                      <label class="text-weight-medium notification">{{
                        $t("app.settingsNotificationLabel")
                      }}</label>
                      <label class="text-weight-medium">
                        <q-btn
                          flat
                          round
                          size="sm"
                          color="primary"
                          icon="card_giftcard"
                          @click="markAllNotificationsRead(notifications)"
                        >
                          <q-tooltip> Mark all as read </q-tooltip>
                        </q-btn>
                      </label>
                    </div>

                    <div
                      class="flex justify-center"
                      v-if="isLoadingNotification"
                    >
                      <q-spinner color="primary" size="2em" :thickness="2" />
                    </div>
                  </q-item-section>
                </q-item>

                <q-item
                  ><q-item-section
                    ><q-item-label
                      lines="1"
                      class="text-subtitle2 flex flex-center"
                      v-if="
                        notifications.length === 0 && !isLoadingNotification
                      "
                    >
                      {{ $t("app.NoNotificationAvailable") }}
                    </q-item-label></q-item-section
                  ></q-item
                >
                <q-item
                  clickable
                  v-ripple
                  @click="markNotificationRead(notification.id)"
                  v-for="notification in notifications"
                  :key="notification.id"
                  :active="!notification.has_seen_notification"
                  :active-class="
                    !notification.has_seen_notification
                      ? 'unread_notification'
                      : ''
                  "
                >
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white" size="md">{{
                      getRoleFirstName(notification.role)
                    }}</q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1" class="text-subtitle2">{{
                      $t("app.newPlatformUserMsg")
                    }}</q-item-label>
                    <q-item-label caption lines="2" class="text-subtitle3">
                      <span class="text-weight-medium">{{
                        notification.name
                      }}</span>
                      -- {{ $t("app.newPlatformUserCaption") }}
                      <span>{{ notification.role }}</span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption
                      >{{ calculateNotificationTime(notification.date) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator inset="item" />
              </q-list>
            </q-menu>
          </q-btn>
          <q-avatar size="xl" v-if="!hasProfilePic">
            <span class="material-icons"> account_circle </span>
          </q-avatar>
          <q-avatar size="sm" v-if="hasProfilePic">
            <img :src="getLoggedInUserProfilePic" alt="Profile Picture" />
          </q-avatar>
          <span class="q-pl-sm account_name">{{ auth_user.name }}</span>
          <q-btn-dropdown flat size="xs" rounded>
            <q-list>
              <q-item clickable v-close-popup :to="{ name: 'member_account' }">
                <q-item-section avatar>
                  <span>
                    <q-icon name="person" size="xs" />
                  </span>
                </q-item-section>
                <q-item-section class="text-center drop_down_text">
                  <q-item-label>{{ $t("app.accountLabel") }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <span>
                    <q-icon name="logout" size="xs" color="red" />
                  </span>
                </q-item-section>
                <q-item-section
                  class="text-center drop_down_text text-red"
                  @click="logoutUser"
                >
                  <q-item-label>{{ $t("app.logoutLabel") }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
      <TrialTimerVue
        v-if="$q.platform.is.desktop"
        :trialEndDate="getSubscriptionTrialEndDate"
        :status="getSubscriptionStatus"
      />
    </q-header>
    <div class="main_content">
      <q-card
        class="card"
        :style="
          $q.platform.is.mobile
            ? 'width: 100vw;height: 100vh;max-height: 100vh;'
            : 'height: 90vh;max-height: 90vh;'
        "
      >
        <q-card-section class="flex content_header">
          <div class="flex">
            <label>
              <span>
                <q-btn
                  round
                  color="primary"
                  icon="arrow_back"
                  flat
                  dense
                  @click="goBack(null)"
                  size="sm"
                />
              </span>
              <span class="title tab" @click="goBack(item.name)">{{
                item.name
              }}</span>
              <span
                class="q-pl-sm tab"
                v-for="tab in getIntermediateTabs"
                :key="tab.index"
                @click="goBack(null)"
              >
                <q-icon size="1rem" name="chevron_right" color="primary" />
                <span class="title">{{ tab.name }}</span></span
              >
            </label>
          </div>
          <q-space />
          <q-btn
            color="primary"
            icon-right="add"
            :label="$t('app.addLabel')"
            push
            :size="$q.platform.is.mobile ? 'sm' : 'md'"
            dense
            no-caps
            v-show="
              requires_add && !checkTreasurerRoleOnly() && verifyRequiredAdd()
            "
            @click="showRightDrawer"
            class="q-pa-xs"
            :class="$q.platform.is.mobile ? 'q-mr-xs' : ''"
          />
        </q-card-section>
        <q-card-section>
          <div class="data_content">
            <router-view
              @start-loading="startLoading"
              @update-payment-category="updatePaymentCategory"
              @update-payment-item="updatePaymentItem"
              @view-payment-item="viewPaymentItem"
              @update-expenditure-category="updateExpenditureCategory"
              @edit-expenditure-item="editExpenditureItem"
              @view-expenditure-item="viewExpenditureItem"
              @edit-expenditure-item-detail="editExpenditureItemDetail"
              @view-expenditure-item-detail="viewExpenditureItemDetail"
              @edit-member-saving="editMemberSaving"
              @view-member-saving="viewMemberSaving"
              @edit-income-activity="editIncomeActivity"
              @view-income-activity="viewIncomeActivity"
              @view-contribution="viewContribution"
              @edit-contribution="editContribution"
              @search-member-saving="searchMemberSaving"
              @search-members-contribution="searchMemberContribution"
              @report-generation="reportGeneration"
              @view-sponsorship="viewSponsorship"
              @edit-sponsorship="editSponsorship"
              @register-member="registerMember"
              @search-contribution="searchContribution"
              @view-payment-details="onViewPaymentDetails"
              @update-income-activity-history="updateIncomeActivityHistory"
              @update-sponsorship-history="updateSponsorshipHistory"
              @update-user-saving-history="updateUserSavingHistory"
              @update-expenditure-item-transaction="
                updateExpenditureItemTransaction
              "
              @update-expenditure-item-detail-transaction="
                updateExpenditureItemDetailTransaction
              "
              @update-user-contribution-transaction="
                updateUserContributionTransaction
              "
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import HelperMixin from "src/mixins/HelperMixin.vue";
import expenditureItemMixin from "src/mixins/expenditureItemMixin.vue";
import TrialTimerVue from "./setup/TrialTimer.vue";
export default {
  mixins: [expenditureItemMixin, HelperMixin],
  mounted() {
    this.auth_user = LocalStorage.getItem("data").user_data;
    const welcome_title = this.auth_user.roles.find(
      (role) => role.name !== "MEMBER"
    ).name;
    this.auth_user_role = this.formatUserRole(welcome_title);
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    requires_add: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      auth_user: LocalStorage.getItem("data").user_data,
      auth_user_role: null,
      left: false,
      year: new Date().getFullYear(),
      right: false,
      roles: [],
      intermediate_tab: "",
      has_intermediate_tab: false,
      intermediate_tab2: "",
      has_intermediate_tab2: false,
      loading: false,
      notifications: [],
      isLoadingNotification: false,
    };
  },

  computed: {
    getIntermediateTabs() {
      let data = [];
      Array.from(this.$store.getters.getIntermediateTabs).forEach((ele) => {
        data.push({
          name: ele.name,
          has_intermediate_tab: ele.has_intermediate_tab,
        });
      });
      return data;
    },

    getLoggedInUserProfilePic() {
      return (
        process.env.API_BASE_URL +
        LocalStorage.getItem("data").user_data.picture
      );
    },

    hasProfilePic() {
      return (
        this.auth_user !== undefined &&
        this.auth_user.picture !== null &&
        this.auth_user.picture !== undefined &&
        this.auth_user.picture !== ""
      );
    },

    getSubscriptionTrialEndDate() {
      const data = LocalStorage.getItem("data");
      if (!data) {
        return null;
      }
      const date =
        data.subscription.status === "trialing"
          ? LocalStorage.getItem("data").subscription.trial_period_end_date
          : LocalStorage.getItem("data").subscription.current_period_end_date;

      return date;
    },

    getSubscriptionStatus() {
      const data = LocalStorage.getItem("data");
      if (!data) {
        return null;
      }
      return LocalStorage.getItem("data").subscription.status;
    },
  },

  methods: {
    canViewNotification() {
      const president_role = LocalStorage.getItem("data").user_data.roles.find(
        (role) => role.name === "PRESIDENT" || role.name === "ADMIN"
      );
      return president_role !== undefined;
    },

    searchContribution(data) {
      this.$emit("search-contribution", data);
    },

    startLoading(data) {
      this.loading = data;
    },
    showRightDrawer() {
      this.right = true;
      this.$emit("show-right-drawer", {
        right: this.right,
        current_tab: this.getCurrentRightDrawerTab(),
      });
      this.resetAllForms(this.getCurrentRightDrawerTab());
    },
    showLeftDrawer() {
      this.left = !this.left;
      this.$emit("show-left-drawer", this.left);
    },
    logoutUser() {
      let payload = {
        to_on_ok: "Login",
        msg: "Logout Successful",
        color: "default",
        to_on_fail: "none",
        error_msg: "default",
        show_feedback: true,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store
        .dispatch("logoutUser", payload)
        .then(() => {
          this.$store.dispatch("setOrganisation", null);
        })
        .finally(() => {
          SessionStorage.clear();
          LocalStorage.clear();
        });
    },
    goBack(tab) {
      history.back();
      const expenditure_category_id =
        this.$store.getters.getCurrentExpenditureCategory !== null
          ? this.$store.getters.getCurrentExpenditureCategory.id
          : { value: "" };
      if (this.$route.name === "expenditure_detail") {
        this.filterExpenditureItems(
          1,
          10,
          { value: expenditure_category_id },
          "",
          { value: this.$route.params.session_id },
          ""
        );
      }
      let data = [];
      data = Array.from(this.$store.getters.getIntermediateTabs);
      if (tab === "Expenditure Categories") {
        data.pop();
        data.pop();
      } else {
        data.pop();
      }
      this.$store.dispatch("setIntermediateTabs", Array.from(data));
    },
    registerMember(data) {
      this.updateDrawer(data);
    },

    updatePaymentCategory(data) {
      this.updateDrawer(data);
    },

    updatePaymentItem(data) {
      this.updateDrawer(data);
    },

    viewPaymentItem(data) {
      this.updateDrawer(data);
    },

    viewMemberSaving(data) {
      this.updateDrawer(data);
    },

    updateDrawer(data) {
      this.right = true;
      this.$emit("show-right-drawer", {
        right: this.right,
        current_tab: data.tab,
        data: data.data,
      });
    },
    updateExpenditureCategory(data) {
      this.updateDrawer(data);
    },

    editExpenditureItem(data) {
      this.updateDrawer(data);
    },

    viewExpenditureItem(data) {
      this.updateDrawer(data);
    },

    editExpenditureItemDetail(data) {
      this.updateDrawer(data);
    },

    viewExpenditureItemDetail(data) {
      this.updateDrawer(data);
    },
    getCurrentRightDrawerTab() {
      let tab = "";
      if (Array.from(this.$store.getters.getIntermediateTabs).length === 0) {
        tab = SessionStorage.getItem("to_tab");
      }
      if (Array.from(this.$store.getters.getIntermediateTabs).length === 1) {
        tab = Array.from(this.$store.getters.getIntermediateTabs)[0].name;
      }
      if (Array.from(this.$store.getters.getIntermediateTabs).length === 2) {
        tab = Array.from(this.$store.getters.getIntermediateTabs)[1].name;
      }
      return tab;
    },
    editMemberSaving(data) {
      this.updateDrawer(data);
    },
    editIncomeActivity(data) {
      this.updateDrawer(data);
    },
    updateIncomeActivityHistory(data) {
      this.updateDrawer(data);
    },
    viewIncomeActivity(data) {
      this.updateDrawer(data);
    },
    viewContribution(data) {
      this.updateDrawer(data);
    },

    editContribution(data) {
      this.updateDrawer(data);
    },

    updateSponsorshipHistory(data) {
      this.updateDrawer(data);
    },

    updateUserSavingHistory(data) {
      this.updateDrawer(data);
    },
    updateExpenditureItemTransaction(data) {
      this.updateDrawer(data);
    },

    updateExpenditureItemDetailTransaction(data) {
      this.updateDrawer(data);
    },

    updateUserContributionTransaction(data) {
      this.updateDrawer(data);
    },
    formatUserRole(role) {
      let user_role = null;
      if (role === "FINANCIAL_SECRETARY") {
        user_role = "Financial Secretary";
      }
      if (role === "TREASURER") {
        user_role = "Treasurer";
      }
      if (role === "PRESIDENT") {
        user_role = "President";
      }
      if (role === "AUDITOR") {
        user_role = "Auditor";
      }
      if (role === "ADMIN") {
        user_role = "Admin";
      }
      return user_role;
    },

    searchMemberSaving(data) {
      this.updateDrawer(data);
    },

    searchMemberContribution(data) {
      this.updateDrawer(data);
    },

    reportGeneration(data) {
      this.updateDrawer(data);
    },

    viewSponsorship(data) {
      this.updateDrawer(data);
    },

    editSponsorship(data) {
      this.updateDrawer(data);
    },

    resetAllForms() {
      this.$store.dispatch("setUpdatedPayCategories", null);
      this.$store.dispatch("setUpdatedPaymentItem", null);
      this.$store.dispatch("setUpdatedExpenditureCategory", null);
      this.$store.dispatch("setUpdatedExpenditureItem", null);
      this.$store.dispatch("setUpdatedExpenditureItemDetail", null);
      this.$store.dispatch("setUpdatedMemberSaving", null);
      this.$store.dispatch("setUpdatedIncomeActivity", null);
    },

    verifyRequiredAdd() {
      return (
        this.$route.name !== "member_account" &&
        this.$route.name !== "member_profile"
      );
    },

    onViewPaymentDetails(data) {
      this.updateDrawer(data);
    },

    markNotificationRead(id) {
      let payload = {
        url: `/api/protected/organisations/members/get_invitation_notifications/${id}/mark_as_read`,
        msg: this.$t("app.notificationMarkReadMsg"),
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
        this.getNotifications();
      });
    },

    getNotifications() {
      this.isLoadingNotification = true;
      let payload = {
        url: `/api/protected/organisations/members/get_invitation_notifications`,
        msg: this.$t("app.saveContributionSuccessMsg"),
        show_feedback: false,
        show_spinner: false,
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
        to_be_store_data: {
          required: false,
          has_value: false,
          data: null,
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.isLoadingNotification = false;
        if (res.status === 200) {
          this.notifications = res.data.filter(
            (notification) => !notification.has_seen_notification
          );
        }
      });
    },

    calculateNotificationTime(date) {
      let currentDate = new Date();
      let notificationDate = new Date(date);
      let oneDay = 24 * 60 * 60 * 1000;
      let hour = 60 * 60 * 1000;
      let mins = 60 * 1000;
      let time = "";
      let millisec = Math.abs(
        currentDate.getTime() - notificationDate.getTime()
      );

      if (Math.trunc(millisec / hour) > 24) {
        time =
          Math.trunc(millisec / oneDay) === 1
            ? Math.trunc(millisec / oneDay) + " day ago"
            : Math.trunc(millisec / oneDay) + " days ago";
      } else if (
        Math.trunc(millisec / hour) >= 1 &&
        Math.trunc(millisec / hour) <= 24
      ) {
        time =
          Math.trunc(millisec / hour) === 1
            ? Math.trunc(millisec / hour) + " hour ago"
            : Math.trunc(millisec / hour) + " hours ago";
      } else if (Math.trunc(millisec / hour) < 1) {
        time =
          Math.trunc(millisec / mins) === 1
            ? Math.trunc(millisec / mins) + " min ago"
            : Math.trunc(millisec / mins) + " mins ago";
      }
      return time;
    },

    getRoleFirstName(role) {
      return role.substring(0, 1);
    },

    markAllNotificationsRead(notifications) {
      let payload = {
        url: `/api/protected/organisations/members/get_invitation_notifications/mark_all_as_read`,
        data: notifications,
        msg: this.$t("app.allNotificationMarkReadMsg"),
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
        this.getNotifications();
      });
    },
  },
  components: {
    TrialTimerVue,
  },
};
</script>

<style lang="scss" scoped>
.main_content {
  position: relative;
  z-index: 2000;
  margin-top: -70px;
  margin-left: 10px;
  margin-right: 10px;
}

.header_section {
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 0px;
}

.card {
  border-bottom-left-radius: 0;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}

.data_content {
  overflow: scroll;
  height: 80vh;
  max-height: 80vh;
}

.data_content::-webkit-scrollbar {
  width: 7px;
  height: 5px;
}

.data_content::-webkit-scrollbar-track {
  background: white;
}

.data_content::-webkit-scrollbar-thumb {
  background: grey;
}

.toolbar_title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 0.6rem;
  display: flex;
}

.header {
  height: 7.5rem;
}

.content_header {
  background-color: $grey6;
  height: 8vh;
}

.title {
  font-family: "Roboto";
  font-style: normal;
  text-transform: uppercase;
  color: $primary;
  font-weight: 500;
  font-size: 0.6rem;
}

.appName {
  font-family: "Roboto";
  font-style: normal;
  text-transform: capitalize;
  color: $dark;
  font-weight: 700;
  font-size: medium;
}

.tab {
  cursor: pointer;
}
.unread_notification {
  background-color: #d9d7d7;
}

.account_name {
  font-family: "Roboto";
  font-style: normal;
  text-transform: capitalize;
  font-weight: 500;
  font-size: 0.69rem;
}

.drop_down_text {
  font-size: 0.7rem;
}

.text-subtitle2 {
  font-size: 0.7rem;
}

.text-subtitle3 {
  font-size: 0.6rem;
}
.notification {
  font-size: 0.8rem;
}
</style>
