<template>
  <q-page>
    <q-header class="bg-primary text-white header">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="showLeftDrawer" v-if="$q.screen.lt.md" />
        <q-toolbar-title class="toolbar_title">
          Welcome {{ auth_user_role }}
        </q-toolbar-title>
        <div>
          <q-avatar size="xl">
            <span class="material-icons"> account_circle </span>
          </q-avatar>
          {{ auth_name }}
          <q-btn-dropdown flat>
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <span>
                    <q-icon name="person" size="sm" />
                  </span>
                </q-item-section>
                <q-item-section class="text-center drop_down_text">
                  <q-item-label>My Account</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <span>
                    <q-icon name="logout" size="sm" color="red" />
                  </span>
                </q-item-section>
                <q-item-section class="text-center drop_down_text" @click="logoutUser">
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>
    <div class="main_content" :style="$q.screen.lg ? 'margin-left: .5rem;' : ''">
      <q-card class="header_section">
        <q-card-section class="content_header">
          <div class="row">
            <label for="title" class="title">
              <q-btn round color="primary" icon="arrow_back" flat dense @click="goBack" />
            </label>
            <div class="q-pa-xs">
              <span class="q-pl-sm title">{{ item.name }}</span>
              <span class="q-pl-sm">
                <q-icon size="1.5em" name="chevron_right" color="primary" v-if="has_intermediate_tab" /></span>
              <span class="q-pl-sm title" v-if="has_intermediate_tab">{{
                  intermediate_tab
              }}</span>
              <span class="q-pl-sm">
                <q-icon size="1.5em" name="chevron_right" color="primary" v-if="has_intermediate_tab2" /></span>
              <span class="q-pl-sm title" v-if="has_intermediate_tab2">{{
                  intermediate_tab2
              }}</span>
            </div>
            <q-space />
            <q-btn color="primary" icon-right="add" label="Add" outline size="md" dense no-caps v-show="requires_add"
              @click="showRightDrawer" class="q-pa-xs" />
          </div>
        </q-card-section>
      </q-card>
      <q-scroll-area style="height: 90vh">
        <q-card class="card">
          <q-card-section class="content">
            <router-view @start-loading="startLoading" @update-member="updateMember"
              @update-payment-category="updatePaymentCategory" @show-payment-items="showPaymentItems"
              @update-payment-item="updatePaymentItem" @update-expenditure-category="updateExpenditureCategory"
              @show-expenditure-items="showExpenditureItems" @edit-expenditure-item="editExpenditureItem"
              @show-expenditure-item-details="showExpenditureItemDetails"
              @edit-expenditure-item-detail="editExpenditureItemDetail" @edit-member-saving="editMemberSaving" @view-member-saving="viewMemberSaving"
              @edit-income-activity="editIncomeActivity" @view-income-activity="viewIncomeActivity"
              @view-contribution="viewContribution" @edit-contribution="editContribution" />
          </q-card-section>
        </q-card>
      </q-scroll-area>
    </div>
    <q-footer class="text-black text-center footer">
      <q-toolbar>
        <q-toolbar-title>
          <p class="footer_text">
            <span class="material-icons copy_right"> copyright </span>Copy Right
            {{ year }}. All Rights Reserved.
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
    this.auth_name = LocalStorage.getItem('data').name;
    this.auth_user_role = this.formatUserRole(LocalStorage.getItem('data').roles.find(role => role.name !== "USER").name);

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
      auth_name: LocalStorage.getItem('data').name,
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
      this.$store.dispatch("logoutUser", payload);
    },
    goBack() {
      history.back();
      if (SessionStorage.getItem("has_intermediate_tab2")) {
        this.has_intermediate_tab2 = false;
        SessionStorage.set("has_intermediate_tab2", false);
        SessionStorage.remove("intermediate_tab2");
      } else {
        this.has_intermediate_tab = false;
        SessionStorage.set("has_intermediate_tab", false);
        SessionStorage.remove("intermediate_tab");
      }
    },
    updateMember(data) {
      this.right = true;
      this.$emit("show-right-drawer", {
        right: this.right,
        current_tab: data.tab,
        data: data.data,
      });
    },
    updatePaymentCategory(data) {
      this.updateDrawer(data);
    },



    showPaymentItems(data) {
      this.has_intermediate_tab = data.has_intermediate_tab;
      this.getIntermediateTab();
    },


    getIntermediateTab() {
      this.intermediate_tab = SessionStorage.getItem("has_intermediate_tab") ? SessionStorage.getItem("intermediate_tab") : "";
      this.intermediate_tab2 =
        SessionStorage.getItem("has_intermediate_tab2")
          ? SessionStorage.getItem("intermediate_tab2")
          : "";
      return this.intermediate_tab;
    },


    updatePaymentItem(data) {
      this.updateDrawer(data);
    },


    viewMemberSaving(data) {
      this.updateDrawer(data)
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
    showExpenditureItems(data) {
      this.has_intermediate_tab = data.has_intermediate_tab;
      this.getIntermediateTab();
    },
    editExpenditureItem(data) {
      this.updateDrawer(data);
    },
    showExpenditureItemDetails(data) {
      this.has_intermediate_tab = data.has_intermediate_tab;
      this.has_intermediate_tab2 = SessionStorage.getItem(
        "has_intermediate_tab2"
      );
      this.getIntermediateTab();
    },
    editExpenditureItemDetail(data) {
      this.updateDrawer(data);
    },
    getCurrentRightDrawerTab() {
      let tab = "";
      if (
        SessionStorage.getItem("intermediate_tab") === null &&
        SessionStorage.getItem("intermediate_tab2") === null
      ) {
        tab = SessionStorage.getItem("to_tab");
      }
      if (
        SessionStorage.getItem("intermediate_tab") !== null &&
        SessionStorage.getItem("intermediate_tab2") === null
      ) {
        tab = SessionStorage.getItem("intermediate_tab");
      }
      if (SessionStorage.getItem("intermediate_tab2") !== null) {
        tab = SessionStorage.getItem("intermediate_tab2");
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
        user_role = "Financial Secretary"
      }
      if (role === "TREASURER") {
        user_role = "Treasurer"
      }
      if (role === "PRESIDENT") {
        user_role = "President"
      }
      if (role === "AUDITOR") {
        user_role = "Auditor"
      }
      return user_role
    }
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

</style>
