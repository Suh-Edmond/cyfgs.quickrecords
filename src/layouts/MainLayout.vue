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
            <q-avatar size="90px" v-if="getOrganisation !== null">
              <q-img :src="getOrganisation.logo"> </q-img>
            </q-avatar>
            <q-avatar
              size="90px"
              v-if="getOrganisation == null"
              font-size="52px"
              color="grey"
            >
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
              :active="item.name == 'Dashboard'"
              clickable
              v-ripple
              :active-class="item.name == 'Dashboard' ? 'item' : 'item_text'"
              @click="setItem({ name: 'Dashboard', selected: true }, false)"
              v-if="checkRole(['PRESIDENT', null])"
              to="/dashboard"
            >
              <q-item-section
                avatar
                :class="item.name == 'Dashboard' ? 'item_icon' : 'item_text'"
              >
                <q-icon name="grid_view" size="xs" />
              </q-item-section>

              <q-item-section class="item_name"> Dashboard </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :active-class="
                item.name == 'Organisation Management' ? 'item' : 'item_text'
              "
              :active="item.name == 'Organisation Management'"
              @click="
                setItem(
                  { name: 'Organisation Management', selected: true },
                  false
                )
              "
              v-if="checkRole(['PRESIDENT', null])"
              to="/dashboard/organisation-management"
            >
              <q-item-section
                avatar
                :class="
                  item.name == 'Organisation Management'
                    ? 'item_icon'
                    : 'item_text'
                "
              >
                <q-icon name="diversity_3" size="xs" />
              </q-item-section>
              <q-item-section class="item_name">
                Organisation Management
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :active-class="
                item.name == 'Member Management' ? 'item' : 'item_text'
              "
              :active="item.name == 'Member Management'"
              @click="
                setItem({ name: 'Member Management', selected: true }, true)
              "
              v-if="checkRole(['PRESIDENT', 'FINANCIAL_SECRETARY'])"
              to="/dashboard/members"
            >
              <q-item-section
                avatar
                :class="
                  item.name == 'Member Management' ? 'item_icon' : 'item_text'
                "
              >
                <q-icon name="manage_accounts" size="xs" />
              </q-item-section>
              <q-item-section class="item_name">
                Member Management
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :active-class="item.name == 'Settings' ? 'item' : 'item_text'"
              :active="item.name == 'Settings'"
              @click="setItem({ name: 'Settings', selected: true }, false)"
              v-if="checkRole(['PRESIDENT', null])"
            >
              <q-item-section
                avatar
                :class="item.name == 'Settings' ? 'item_icon' : 'item_text'"
              >
                <q-icon name="settings" size="xs" />
              </q-item-section>
              <q-item-section class="item_name"> Settings Zone </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :active-class="
                item.name == 'Invite Members' ? 'item' : 'item_text'
              "
              :active="item.name == 'Invite Members'"
              @click="
                setItem({ name: 'Invite Members', selected: true }, false)
              "
              v-if="checkRole(['PRESIDENT', null])"
            >
              <q-item-section
                avatar
                :class="
                  item.name == 'Invite Members' ? 'item_icon' : 'item_text'
                "
              >
                <q-icon name="share" size="xs" />
              </q-item-section>
              <q-item-section class="item_name">
                Invite Members
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :active-class="
                item.name == 'Payment Categories' ? 'item' : 'item_text'
              "
              :active="item.name == 'Payment Categories'"
              @click="
                setItem({ name: 'Payment Categories', selected: true }, true)
              "
              v-if="checkRole(['FINANCIAL_SECRETARY', 'TREASURER'])"
              to="/dashboard/payment-categories"
            >
              <q-item-section
                avatar
                :class="
                  item.name == 'Payment Categories' ? 'item_icon' : 'item_text'
                "
              >
                <q-icon name="monetization_on" size="xs" />
              </q-item-section>
              <q-item-section class="item_name">
                Payment Categories
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :active-class="
                item.name == 'Expenditure Categories' ? 'item' : 'item_text'
              "
              :active="item.name == 'Expenditure Categories'"
              @click="
                setItem(
                  { name: 'Expenditure Categories', selected: true },
                  true
                )
              "
              v-if="checkRole(['FINANCIAL_SECRETARY', 'TREASURER'])"
              to="/dashboard/expenditure-categories"
            >
              <q-item-section
                avatar
                :class="
                  item.name == 'Expenditure Categories'
                    ? 'item_icon'
                    : 'item_text'
                "
              >
                <q-icon name="monetization_on" size="xs" />
              </q-item-section>
              <q-item-section class="item_name">
                Expenditure Categories
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :active-class="
                item.name == 'Member Savings' ? 'item' : 'item_text'
              "
              :active="item.name == 'Member Savings'"
              @click="setItem({ name: 'Member Savings', selected: true }, true)"
              v-if="checkRole(['FINANCIAL_SECRETARY', 'TREASURER'])"
              to="/dashboard/members-savings"
            >
              <q-item-section
                avatar
                :class="
                  item.name == 'Member Savings' ? 'item_icon' : 'item_text'
                "
              >
                <q-icon name="savings" size="xs" />
              </q-item-section>
              <q-item-section class="item_name">
                Member Savings
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :active-class="
                item.name == 'Income Activities' ? 'item' : 'item_text'
              "
              :active="item.name == 'Income Activities'"
              @click="
                setItem({ name: 'Income Activities', selected: true }, true)
              "
              v-if="checkRole(['FINANCIAL_SECRETARY', 'TREASURER'])"
              to="/dashboard/income-activities"
            >
              <q-item-section
                avatar
                :class="
                  item.name == 'Income Activities' ? 'item_icon' : 'item_text'
                "
              >
                <q-icon name="local_activity" size="xs" />
              </q-item-section>
              <q-item-section class="item_name">
                Income Activities
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :active-class="
                item.name == 'Members Contributions' ? 'item' : 'item_text'
              "
              :active="item.name == 'Members Contributions'"
              @click="
                setItem({ name: 'Members Contributions', selected: true }, true)
              "
              v-if="checkRole(['FINANCIAL_SECRETARY', 'TREASURER'])"
              :to="{ name: 'members_contributions' }"
            >
              <q-item-section
                avatar
                :class="
                  item.name == 'Members Contributions'
                    ? 'item_icon'
                    : 'item_text'
                "
              >
                <q-icon name="payments" size="xs" />
              </q-item-section>
              <q-item-section class="item_name"
                >Members Contributions
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :active-class="
                item.name == 'Reports Generation' ? 'item' : 'item_text'
              "
              :active="item.name == 'Reports Generation'"
              @click="
                setItem({ name: 'Reports Generation', selected: true }, false)
              "
              v-if="checkRole(['FINANCIAL_SECRETARY', 'TREASURER'])"
            >
              <q-item-section
                avatar
                :class="
                  item.name == 'Reports Generation' ? 'item_icon' : 'item_text'
                "
              >
                <q-icon name="summarize" size="xs" />
              </q-item-section>
              <q-item-section class="item_name">
                Reports Generation
              </q-item-section>
            </q-item>
          </q-list>
          <q-list padding>
            <q-item
              clickable
              v-ripple
              :active-class="item.name == 'Logout' ? 'item' : 'item_text'"
              @click="logoutUser"
            >
              <q-item-section avatar class="item_text">
                <q-icon name="logout" size="xs" />
              </q-item-section>
              <q-item-section class="item_name"> Logout </q-item-section>
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
      >
        <router-view />
      </MainContent>
    </q-page-container>

    <q-drawer
      v-model="right"
      side="right"
      bordered
      :width="right_drawer_width"
      class="q-ml-lg"
    >
      <q-page>
        <q-card class="bar" flat>
          <div class="flex q-pa-xs">
            <div>
              <q-btn
                dense
                color="white"
                flat
                icon="arrow_back"
                v-close-popup
                @click="goBack()"
                size="sm"
              >
              </q-btn>
            </div>
            <div class="flex flex-center">
              <label for="heading" class="heading text-white q-pl-lg text_h6">{{
                heading
              }}</label>
            </div>
            <q-space />
            <div>
              <q-btn
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
          </div>
        </q-card>
        <AddMember
          v-if="current_tab == 'Member Management'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        ></AddMember>
        <EditMember
          v-if="current_tab == 'EditMember'"
          @close-right-drawer="closeRightDrawer"
          @set-heading="setHeading"
        >
        </EditMember>
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
          v-if="current_tab == 'Member Savings'"
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
        ></AddIncomeActivity>
        <ViewIncomeActivity
          v-if="current_tab == 'View Income Activity'"
        ></ViewIncomeActivity>
        <ViewContribution
          v-if="current_tab == 'View Contribution'"
          @edit-contribution="updateRightDrawer"
        >
        </ViewContribution>
        <AddContribution
          v-if="current_tab == 'Members Contributions'"
        ></AddContribution>
      </q-page>
    </q-drawer>
  </q-layout>
</template>

<script>
import MainContent from "src/components/MainContent.vue";
import { LocalStorage, SessionStorage } from "quasar";
import AddMember from "src/components/AddMember.vue";
import EditMember from "src/components/EditMember.vue";
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
export default {
  mixins: [organisationMixinVue],
  mounted() {
    this.getOrganisationInfo();
  },
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
      right_drawer_width: 450,
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
  },
  watch: {
    getOrganisation() {
      return this.$store.getters.getOrganisation;
    },
  },
  methods: {
    setItem(item, requires_add) {
      this.item.name = item.name;

      this.requires_add = requires_add;

      this.item.selected = true;

      SessionStorage.set("from_tab", SessionStorage.getItem("to_tab"));

      SessionStorage.set("to_tab", item.name);

      SessionStorage.set("requires_add", this.requires_add);

      SessionStorage.remove("intermediate_tab");

      SessionStorage.set("has_intermediate_tab", false);

      SessionStorage.remove("intermediate_tab2");

      SessionStorage.set("has_intermediate_tab2", false);
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
      LocalStorage.getItem("data").roles.forEach((role) => {
        user_roles.push(role.name);
      });
      return user_roles.includes(tab_roles[0]) ||
        user_roles.includes(tab_roles[1])
        ? true
        : false;
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
      this.$store.dispatch("logoutUser", payload);
    },
    goBack() {
      this.right = !this.right;
      this.$store.dispatch("setEditState", false);
    },
    closeRightDrawer() {
      this.right = !this.right;
      this.$store.dispatch("setEditState", false);
    },
    setHeading(data) {
      this.heading = data;
    },
  },
  components: {
    MainContent,
    AddMember,
    EditMember,
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
  },
};
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

.header {
  height: 120px;
  border-bottom-left-radius: 2rem;
}

.content {
  background-color: $grey1;
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
</style>
