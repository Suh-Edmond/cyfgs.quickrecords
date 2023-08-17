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
        <q-toolbar-title class="toolbar_title">
          {{ $t("app.welcomeLabel") }} {{ auth_user_role }}
        </q-toolbar-title>
        <div>
          <q-avatar size="xl" v-if="!hasProfilePic">
            <span class="material-icons"> account_circle </span>
          </q-avatar>
          <q-avatar size="md" v-if="hasProfilePic">
            <img :src="getLoggedInUserProfilePic" alt="Profile Picture">
          </q-avatar>
          {{ auth_user.name }}
          <q-btn-dropdown flat>
            <q-list>
              <q-item clickable v-close-popup :to="{ name: 'member_account' }">
                <q-item-section avatar>
                  <span>
                    <q-icon name="person" size="sm" />
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
                    <q-icon name="logout" size="sm" color="red" />
                  </span>
                </q-item-section>
                <q-item-section
                  class="text-center drop_down_text"
                  @click="logoutUser"
                >
                  <q-item-label>{{ $t("app.logoutLabel") }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>
    <div
      class="main_content"
      :style="$q.screen.lg ? 'margin-left: .5rem;' : ''"
    >
      <q-card class="header_section">
        <q-card-section class="content_header">
          <div class="row">
            <label for="title" class="title">
              <q-btn
                round
                color="primary"
                icon="arrow_back"
                flat
                dense
                @click="goBack(null)"
              />
            </label>
            <div class="q-pa-xs" v-show="verifyRequiredAdd()">
              <span class="q-pl-sm title tab" @click="goBack(item.name)">{{
                item.name
              }}</span>

              <span v-if="getIntermediateTabs.length > 0">
                <span
                  class="q-pl-sm tab"
                  v-for="tab in getIntermediateTabs"
                  :key="tab.index"
                  @click="goBack(null)"
                >
                  <q-icon size="1.5em" name="chevron_right" color="primary" />
                  <span class="q-pl-sm title">{{ tab.name }}</span></span
                >
              </span>
            </div>
            <q-space />
            <q-btn
              color="primary"
              icon-right="add"
              label="Add"
              push
              size="md"
              dense
              no-caps
              v-show="
                requires_add && !checkTreasurerRole() && verifyRequiredAdd()
              "
              @click="showRightDrawer"
              class="q-pa-xs"
            />
          </div>
        </q-card-section>
      </q-card>
      <q-scroll-area style="height: 90vh">
        <q-card class="card">
          <q-card-section class="content">
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
            />
          </q-card-section>
        </q-card>
      </q-scroll-area>
    </div>
    <q-footer class="text-black text-center footer">
      <q-toolbar>
        <q-toolbar-title>
          <p class="footer_text">
            <span class="material-icons copy_right"> copyright </span
            >{{ $t("app.copyright") }} {{ year }}
            <span class="appName"
              >{{ $t("app.nameOne") }}{{ $t("app.nameTwo") }}</span
            >. {{ $t("app.allRightsReserved") }}
          </p>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";

export default {
  mounted() {
    this.auth_user = LocalStorage.getItem("data").user_data;
    this.auth_user_role = this.formatUserRole(
      LocalStorage.getItem("data").user_data.roles.find(
        (role) => role.name !== "MEMBER"
      ).name
    );
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
        process.env.FILE_API_URL +
        process.env.FILE_DOWNLOAD_PATH +
        LocalStorage.getItem("data").user_data.picture
      );
    },

    hasProfilePic(){
      return this.auth_user !== undefined &&this.auth_user.picture !== null && this.auth_user.picture !== undefined
    }
  },

  methods: {
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
      this.$store.dispatch("logoutUser", payload).then(() => {
        this.$store.dispatch("setOrganisation", null);
      });
    },
    goBack(tab) {
      history.back();
      let data = [];
      data = Array.from(this.$store.getters.getIntermediateTabs);
      if (tab == "Expenditure Categories") {
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
      if (Array.from(this.$store.getters.getIntermediateTabs).length == 0) {
        tab = SessionStorage.getItem("to_tab");
      }
      if (Array.from(this.$store.getters.getIntermediateTabs).length == 1) {
        tab = Array.from(this.$store.getters.getIntermediateTabs)[0].name;
      }
      if (Array.from(this.$store.getters.getIntermediateTabs).length == 2) {
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
    viewIncomeActivity(data) {
      this.updateDrawer(data);
    },
    viewContribution(data) {
      this.updateDrawer(data);
    },

    editContribution(data) {
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
      return user_role;
    },

    searchMemberSaving(data) {
      this.updateDrawer(data);
    },

    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").user_data.roles.find(
        (role) => role.name == "TREASURER"
      );
      return treasurer_role != undefined;
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
      return this.$route.name !== "member_account";
    },
  },
};
</script>

<style lang="scss" scoped>
.main_content {
  position: relative;
  z-index: 2000;
  margin-top: -70px;
}

.header_section {
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 0px;
}

.card {
  height: 100vh;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}

.toolbar_title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 29px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
}

.header {
  height: 130px;
}

.content {
  background-color: $white1;
  padding-bottom: 4rem;
}

.content_header {
  background-color: $white2;
  height: 8vh;
}

.footer_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
}

.copy_right {
  font-size: large;
}

.footer {
  height: 2rem;
  background-color: $white1;
  margin-left: 1rem;
}

.title {
  font-family: "Roboto";
  font-style: normal;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: $primary;
  font-weight: 500;
  font-size: smaller;
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
</style>
