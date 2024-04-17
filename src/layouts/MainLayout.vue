<template>
  <q-layout view="lHr lpr LFr">
    <q-drawer
      show-if-above
      v-model="left"
      side="left"
      bordered
      :width="280"
      :breakpoint="500"
      content-class="bg-grey-3"
    >
      <div>
        <div class="bg-white left_drawer">
          <div class="bg-transparent q-pa-sm flex flex-center">
            <q-avatar size="90px" v-if="getOrganisation != null">
              <q-img :src="getOrganisationLogo"> </q-img>
            </q-avatar>
          </div>
          <div
            class="text-weight-bold text-center organisation_name q-mb-md q-pa-xs"
            v-if="getOrganisation != null"
          >
            {{ getOrganisation.name }}
          </div>
        </div>
        <div class="nav">
          <q-list padding>
            <q-item
              v-for="tab in getUserSideTabs()"
              :key="tab.to"
              :active="item.name == tab.name"
              clickable
              v-ripple
              :active-class="item.name == tab.name ? 'item' : 'item_text'"
              @click="
                setItem({ name: tab.name, selected: true }, tab.requires_add)
              "
              :to="{ name: tab.to }"
            >
              <q-item-section
                avatar
                :class="item.name == tab.name ? 'item_icon' : 'item_text'"
              >
                <q-icon :name="tab.icon" size="xs" v-if="!tab.has_image" />
                <img
                  v-if="tab.has_image"
                  :src="tab.image_src"
                  class="sponsorship_icon"
                />
              </q-item-section>

              <q-item-section class="item_name">
                {{ tab.label }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-drawer>
    <q-page-container class="content">
      <MainContent
        :item="item"
        :requires_add="requires_add"
        @show-right-drawer="updateRightDrawer"
        @show-left-drawer="updateLeftDrawer"
        @search-contribution="searchContribution"
      >
        <router-view />
      </MainContent>
    </q-page-container>

    <q-drawer
      v-model="right"
      side="right"
      bordered
      :width="
        $q.platform.is.mobile
          ? right_drawer_width_mobile
          : right_drawer_width_desktop
      "
    >
      <q-page>
        <q-card class="bar" flat>
          <div class="flex q-pa-xs">
            <q-btn
              dense
              color="white"
              flat
              icon="arrow_back"
              v-close-popup
              @click="goBack()"
              :size="$q.platform.is.desktop ? 'sm' : 'md'"
            >
            </q-btn>
            <label
              for="heading"
              class="text-white q-ml-lg"
              :class="$q.platform.is.desktop ? 'text_h6' : 'side-bar-heading'"
              >{{ heading }}</label
            >
            <q-space />
            <q-btn
              v-if="$q.platform.is.desktop"
              dense
              flat
              color="white"
              icon="close"
              v-close-popup
              @click="closeRightDrawer()"
              size="sm"
            >
            </q-btn>
          </div>
        </q-card>
        <AddMember
          v-if="current_tab == 'Member Management'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        ></AddMember>
        <AddPaymentCategory
          v-if="current_tab == 'Payment Categories'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        >
        </AddPaymentCategory>
        <AddPaymentItem
          v-if="current_tab == 'Payment Items'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        ></AddPaymentItem>
        <AddExpenditureCategory
          v-if="current_tab == 'Expenditure Categories'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        ></AddExpenditureCategory>
        <AddExpenditureItem
          v-if="current_tab == 'Expenditure Items'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        ></AddExpenditureItem>
        <AddExpenditureItemDetail
          v-if="current_tab == 'Expenditure Item Details'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        ></AddExpenditureItemDetail>
        <AddMemberSavingVue
          v-if="current_tab.includes('Savings') && current_tab != 'Search Savings'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        ></AddMemberSavingVue>
        <ViewMemberSaving
          v-if="current_tab == 'View Member Saving'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        >
        </ViewMemberSaving>
        <AddIncomeActivity
          v-if="current_tab == 'Income Activities'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        ></AddIncomeActivity>
        <ViewIncomeActivity
          v-if="current_tab == 'View Income Activity'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        ></ViewIncomeActivity>
        <ViewContribution
          v-if="current_tab == 'View Contribution'"
          @set-heading="setHeading"
          @edit-contribution="updateRightDrawer"
        >
        </ViewContribution>
        <AddContribution
          v-if="current_tab.includes('Contributions') && current_tab != 'Search Members Contributions'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        ></AddContribution>
        <SearchSavings
          v-if="current_tab == 'Search Savings'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        >
        </SearchSavings>
        <SearchContribution
          v-if="current_tab == 'Search Members Contributions'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
          @search-contribution="searchContribution"
        >
        </SearchContribution>
        <EditMemberContribution
          v-if="current_tab == 'Edit Member Contribution'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        >
        </EditMemberContribution>
        <AddSponsorship
          v-if="current_tab == 'Sponsorship Management'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        ></AddSponsorship>
        <ViewSponsorshipVue
          v-if="current_tab == 'View Sponsorship'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        >
        </ViewSponsorshipVue>
        <ViewExpenditureItemVue
          v-if="current_tab == 'Expenditure Activity Information'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        >
        </ViewExpenditureItemVue>
        <ViewExpenditureItemDetail
          v-if="current_tab == 'Expenditure Item Detail Information'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        >
        </ViewExpenditureItemDetail>
        <MemberRegistration
          v-if="current_tab == 'Register Member'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        >
        </MemberRegistration>
        <ViewPaymentItem
          v-if="current_tab == 'View Payment Item'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        >
        </ViewPaymentItem>
        <PaymentDetails
          v-if="current_tab == 'Payment Details'"
          :payment-details="data"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        ></PaymentDetails>
      </q-page>
    </q-drawer>
  </q-layout>
</template>

<script>
import MainContent from "src/components/MainContent.vue";
import { LocalStorage, SessionStorage } from "quasar";
import AddMember from "src/components/AddMember.vue";
import AddPaymentCategory from "src/components/AddPaymentCategory.vue";
import AddPaymentItem from "src/components/AddPaymentItem.vue";
import AddExpenditureCategory from "src/components/AddExpenditureCategory.vue";
import AddExpenditureItem from "src/components/AddExpenditureItem.vue";
import AddExpenditureItemDetail from "src/components/AddExpenditureItemDetail.vue";
import AddMemberSavingVue from "src/components/AddMemberSaving.vue";
import AddIncomeActivity from "src/components/AddIncomeActivity.vue";
import ViewIncomeActivity from "src/components/ViewIncomeActivity.vue";
import ViewContribution from "src/components/ViewContribution.vue";
import AddContribution from "src/components/AddContribution.vue";
import organisationMixinVue from "src/mixins/organisationMixin.vue";
import ViewMemberSaving from "src/components/ViewMemberSaving.vue";
import SearchSavings from "src/components/SearchSavings.vue";
import SearchContribution from "src/components/SearchContribution.vue";
import EditMemberContribution from "src/components/EditMemberContribution.vue";
import AddSponsorship from "src/components/AddSponsorship.vue";
import ViewSponsorshipVue from "src/components/ViewSponsorship.vue";
import ViewExpenditureItemVue from "src/components/ViewExpenditureItem.vue";
import ViewExpenditureItemDetail from "src/components/ViewExpenditureItemDetail.vue";
import MemberRegistration from "src/components/MemberRegistration.vue";
import ViewPaymentItem from "src/components/ViewPaymentItem.vue";
import PaymentDetails from "src/components/PaymentDetails.vue";
import CurrentYearMixin from "src/mixins/CurrentYearMixin.vue";

export default {
  mixins: [organisationMixinVue, CurrentYearMixin],
  created() {
    this.getOrganisationInfo();
  },
  mounted() {},
  data() {
    return {
      left: false,
      right: false,
      year: new Date().getFullYear(),
      item: {
        name: SessionStorage.getItem("from_tab"),
        selected: true,
      },
      requires_add: false,
      right_drawer_width_mobile: 400,
      right_drawer_width_desktop: 480,
      current_tab: "",
      right_drawer_tab: "",
      data: null,
      heading: "",
    };
  },
  computed: {
    getOrganisation() {
      return this.$store.getters.getOrganisation;
    },
    getOrganisationLogo() {
      return (
        process.env.FILE_API_URL +
        process.env.FILE_DOWNLOAD_PATH +
        this.getOrganisation.logo
      );
    },
  },
  watch: {},
  methods: {
    searchContribution(data) {
      this.$emit("search-contribution", data);
    },
    setItem(item, requires_add) {
      this.item.name = item.name;

      this.requires_add = requires_add;

      this.item.selected = true;

      SessionStorage.set("from_tab", SessionStorage.getItem("to_tab"));

      SessionStorage.set("to_tab", item.name);

      SessionStorage.set("requires_add", this.requires_add);

      this.$store.dispatch("setIntermediateTabs", []);
    },

    updateRightDrawer({ right, current_tab, data }) {
      this.current_tab = current_tab;
      this.right = right;
      this.data = data;
    },

    updateLeftDrawer(left) {
      this.left = left;
    },

    checkRole(tab_roles) {
      let user_roles = [];
      LocalStorage.getItem("data").user_data.roles.forEach((role) => {
        user_roles.push(role.name);
      });
      return user_roles.includes(...tab_roles);
    },

    logoutUser() {
      let payload = {
        to_on_ok: "Login",
        msg: "Logout Successful",
        color: "default",
        to_on_fail: "none",
        show_feedback: false,
        error_msg: "default",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("logoutUser", payload).then(() => {
        this.$store.dispatch("SET_MEMBERS", null);
        this.$store.dispatch("SET_BAR_CHART_DATA", []);
      });
    },

    goBack() {
      this.right = !this.right;
    },

    closeRightDrawer() {
      this.right = !this.right;
    },

    setHeading(data) {
      this.heading = data;
    },

    getSidebarTabs() {
      const menu_tabs = [];
      menu_tabs.push({
        to: "dashboard",
        name: "Dashboard",
        label: this.$t("app.dashboardLabel"),
        icon: "grid_view",
        roles: ["PRESIDENT", "FINANCIAL_SECRETARY", "TREASURER", "ADMIN"],
        disable: false,
        has_image: false,
        requires_add: false,
      });
      menu_tabs.push({
        to: "organisation",
        roles: ["ADMIN", "PRESIDENT"],
        name: "Organisation Management",
        icon: "diversity_3",
        label: this.$t("app.organisationLabel"),
        disable: false,
        has_image: false,
        requires_add: false,
      });
      menu_tabs.push({
        to: "role_privilge",
        roles: ["ADMIN"],
        name: "Roles Managment",
        icon: "engineering",
        label: this.$t("app.role_privilage"),
        disable: this.getOrganisation == null,
        has_image: false,
        requires_add: false,
      }),
        menu_tabs.push({
          to: "settings",
          name: "Settings",
          roles: ["ADMIN", "PRESIDENT"],
          icon: "settings",
          label: this.$t("app.settingsLabel"),
          disable: this.getOrganisation == null,
          has_image: false,
          requires_add: false,
        });
      menu_tabs.push({
        to: "members",
        roles: ["ADMIN", "PRESIDENT", "FINANCIAL_SECRETARY", "TREASURER"],
        name: "Member Management",
        label: this.$t("app.memberMgtLabel"),
        icon: "manage_accounts",
        disable: this.getOrganisation == null,
        has_image: false,
        requires_add: true,
      });
      menu_tabs.push({
        to: "payment_category",
        roles: ["ADMIN", "PRESIDENT", "FINANCIAL_SECRETARY", "TREASURER"],
        name: "Payment Categories",
        label: this.$t("app.paymentCategoryLabel"),
        icon: "monetization_on",
        disable: this.getOrganisation == null,
        has_image: false,
        requires_add: true,
      });
      menu_tabs.push({
        to: "expenditure_category",
        roles: ["ADMIN", "PRESIDENT", "FINANCIAL_SECRETARY"],
        name: "Expenditure Categories",
        icon: "monetization_on",
        label: this.$t("app.expenditureCategoryLabel"),
        disable: this.getOrganisation == null,
        has_image: false,
        requires_add: true,
      });
      menu_tabs.push({
        to: "expenditures",
        roles: ["TREASURER"],
        name: "Expenditures",
        icon: "monetization_on",
        label: this.$t("app.expenditureLabel"),
        disable: this.getOrganisation == null,
        has_image: false,
        requires_add: false,
      });
      menu_tabs.push({
        to: "income_activity",
        roles: ["ADMIN", "PRESIDENT", "FINANCIAL_SECRETARY", "TREASURER"],
        icon: "local_activity",
        label: this.$t("app.incomeActivityLabel"),
        name: "Income Activities",
        disable: this.getOrganisation == null,
        has_image: false,
        requires_add: true,
      });
      menu_tabs.push({
        to: "savings",
        roles: ["ADMIN", "PRESIDENT", "FINANCIAL_SECRETARY", "TREASURER"],
        name: "Savings",
        label: this.$t("app.savingLabel"),
        icon: "savings",
        disable: this.getOrganisation == null,
        has_image: false,
        requires_add: true,
      });
      menu_tabs.push({
        to: "members_contributions",
        roles: ["ADMIN", "PRESIDENT", "FINANCIAL_SECRETARY", "TREASURER"],
        name: "Contributions",
        icon: "payments",
        label: this.$t("app.contributionName"),
        disable: this.getOrganisation == null,
        has_image: false,
        requires_add: true,
      });
      menu_tabs.push({
        to: "sponsorship",
        roles: ["ADMIN", "PRESIDENT", "FINANCIAL_SECRETARY", "TREASURER"],
        name: "Sponsorship Management",
        label: this.$t("app.sponsorshipLabel"),
        icon: "none",
        disable: this.getOrganisation == null,
        image_src: "images/sponsorship.png",
        has_image: true,
        requires_add: true,
      });
      menu_tabs.push({
        to: "report_generation",
        roles: ["ADMIN", "PRESIDENT", "FINANCIAL_SECRETARY"],
        name: "Reports Generation",
        icon: "summarize",
        label: this.$t("app.reportGenerationLabel"),
        disable: this.getOrganisation == null,
        has_image: false,
        requires_add: false,
      });

      return menu_tabs;
    },

    getRoleGroups() {
      const storage_data =
        LocalStorage.getItem("data") !== "undefined" && LocalStorage.getItem("data") !== null
          ? LocalStorage.getItem("data").user_data
          : [];
      return storage_data.roles.map((ele) => ele.name);
    },

    getUserSideTabs() {
      const tabs = [];
      this.getSidebarTabs().forEach((tab) => {
        this.getRoleGroups().forEach((role) => {
          if (tab.roles.includes(role)) {
            tabs.push(tab);
          }
        });
      });
      return tabs;
    },
  },
  components: {
    MainContent,
    AddMember,
    AddPaymentCategory,
    AddPaymentItem,
    AddExpenditureCategory,
    AddExpenditureItem,
    AddExpenditureItemDetail,
    AddMemberSavingVue,
    AddIncomeActivity,
    ViewIncomeActivity,
    ViewContribution,
    AddContribution,
    ViewMemberSaving,
    SearchSavings,
    SearchContribution,
    EditMemberContribution,
    AddSponsorship,
    ViewSponsorshipVue,
    ViewExpenditureItemVue,
    ViewExpenditureItemDetail,
    MemberRegistration,
    ViewPaymentItem,
    PaymentDetails,
  },
};
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

.content {
  background-color: $grey1;
  height: 100vh;
}

.drop_down_text {
  font-family: "Roboto";
  font-style: normal;
  line-height: 29px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.01em;
  text-transform: capitalize;
  color: $dark;
}

.organisation_name {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  letter-spacing: 0.01em;
  font-weight: 700;
  font-size: medium;
}

.left_drawer {
  height: 160px;
}

.item_icon {
  color: $white1;
  font-size: 0.8rem;
}

.item {
  background-color: $primary2;
  color: $white1;
}

.item_text {
  color: $grey2;
}

.item_name {
  font-size: 0.8rem;
}

.bar {
  color: $dark;
  padding: 0;
  background-color: $primary;
  height: 3.8rem;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.sponsorship_icon {
  color: $grey2;
  width: 1.13rem;
}

.logout {
  position: absolute;
  top: 91%;
}

.expand {
  color: red;
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

.appName {
  font-family: "Roboto";
  font-style: normal;
  text-transform: capitalize;
  color: $dark;
  font-weight: 700;
  font-size: medium;
}
</style>
