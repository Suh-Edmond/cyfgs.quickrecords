<template>
  <q-layout view="lHr lpR lFr">
    <q-drawer show-if-above v-model="left" side="left" bordered :width="280">
      <div>
        <div class="bg-transparent q-pa-sm flex flex-center">
          <q-avatar size="70px">
            <img src="../assets/UB-Logo.png" />
          </q-avatar>
        </div>
        <div
          class="text-weight-bold text-center organisation_name q-mb-md q-pa-xs"
        >
          Brother’s Corner CYF Great Soppo Buea
        </div>
      </div>
      <div class="nav">
        <q-list padding>
          <q-item
            :active="item == 'Dashboard'"
            clickable
            v-ripple
            :active-class="item == 'Dashboard' ? 'item' : 'item_text'"
            @click="setItem('Dashboard', false)"
            v-if="checkRole(['PRESIDENT', null])"
          >
            <q-item-section
              avatar
              :class="item == 'Dashboard' ? 'item_icon' : 'item_text'"
            >
              <q-icon name="grid_view" size="xs" />
            </q-item-section>

            <q-item-section class="item_name"> Dashboard </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active-class="
              item == 'Organisation Management' ? 'item' : 'item_text'
            "
            :active="item == 'Organisation Management'"
            @click="setItem('Organisation Management', false)"
            v-if="checkRole(['PRESIDENT', null])"
          >
            <q-item-section
              avatar
              :class="
                item == 'Organisation Management' ? 'item_icon' : 'item_text'
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
            :active-class="item == 'User Management' ? 'item' : 'item_text'"
            :active="item == 'User Management'"
            @click="setItem('User Management', false)"
            v-if="checkRole(['PRESIDENT', 'FINANCIAL_SECRETARY'])"
          >
            <q-item-section
              avatar
              :class="item == 'User Management' ? 'item_icon' : 'item_text'"
            >
              <q-icon name="manage_accounts" size="xs" />
            </q-item-section>
            <q-item-section class="item_name"> User Management </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active-class="item == 'Settings' ? 'item' : 'item_text'"
            :active="item == 'Settings'"
            @click="setItem('Settings', false)"
            v-if="checkRole(['PRESIDENT', null])"
          >
            <q-item-section
              avatar
              :class="item == 'Settings' ? 'item_icon' : 'item_text'"
            >
              <q-icon name="settings" size="xs" />
            </q-item-section>
            <q-item-section class="item_name"> Settings Zone </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active-class="item == 'Payment Categories' ? 'item' : 'item_text'"
            :active="item == 'Payment Categories'"
            @click="setItem('Payment Categories', true)"
            v-if="checkRole(['FINANCIAL_SECRETARY', 'TREASURER'])"
          >
            <q-item-section
              avatar
              :class="item == 'Payment Categories' ? 'item_icon' : 'item_text'"
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
              item == 'Expenditure Categories' ? 'item' : 'item_text'
            "
            :active="item == 'Expenditure Categories'"
            @click="setItem('Expenditure Categories', true)"
            v-if="checkRole(['FINANCIAL_SECRETARY', 'TREASURER'])"
          >
            <q-item-section
              avatar
              :class="
                item == 'Expenditure Categories' ? 'item_icon' : 'item_text'
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
            :active-class="item == 'Member Savings' ? 'item' : 'item_text'"
            :active="item == 'Member Savings'"
            @click="setItem('Member Savings', true)"
            v-if="checkRole(['FINANCIAL_SECRETARY', 'TREASURER'])"
          >
            <q-item-section
              avatar
              :class="item == 'Member Savings' ? 'item_icon' : 'item_text'"
            >
              <q-icon name="savings" size="xs" />
            </q-item-section>
            <q-item-section class="item_name"> Member Savings </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active-class="item == 'Income Activities' ? 'item' : 'item_text'"
            :active="item == 'Income Activities'"
            @click="setItem('Income Activities', true)"
            v-if="checkRole(['FINANCIAL_SECRETARY', 'TREASURER'])"
          >
            <q-item-section
              avatar
              :class="item == 'Income Activities' ? 'item_icon' : 'item_text'"
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
            :active-class="item == 'Contributions' ? 'item' : 'item_text'"
            :active="item == 'Contributions'"
            @click="setItem('Contributions', true)"
            v-if="checkRole(['FINANCIAL_SECRETARY', 'TREASURER'])"
          >
            <q-item-section
              avatar
              :class="item == 'Contributions' ? 'item_icon' : 'item_text'"
            >
              <q-icon name="payments" size="xs" />
            </q-item-section>
            <q-item-section class="item_name"> Contributions </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active-class="item == 'Reports Generation' ? 'item' : 'item_text'"
            :active="item == 'Reports Generation'"
            @click="setItem('Reports Generation', false)"
            v-if="checkRole(['FINANCIAL_SECRETARY', 'TREASURER'])"

          >
            <q-item-section
              avatar
              :class="item == 'Reports Generation' ? 'item_icon' : 'item_text'"
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
            :active-class="item == 'Logout' ? 'item' : 'item_text'"
          >
            <q-item-section avatar class="item_text">
              <q-icon name="logout" size="xs" />
            </q-item-section>
            <q-item-section class="item_name"> Logout </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-drawer v-model="right" side="right" bordered :width="370">
      <q-page-container>
        <q-page>
          <q-bar class="bar">
            <div></div>
            <q-space />
            <div>
              <q-btn
                dense
                flat
                icon="close"
                v-close-popup
                @click="updateRightDrawer(false)"
                size="md"
              >
              </q-btn>
            </div>
          </q-bar>
        </q-page>
      </q-page-container>
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
  </q-layout>
</template>

<script>
import MainContent from "src/components/MainContent.vue";
export default {
  data() {
    return {
      left: false,
      right: false,
      year: new Date().getFullYear(),
      item: "Dashboard",
      requires_add: false,
    };
  },
  methods: {
    setItem(item, requires_add) {
      this.item = item;
      this.requires_add = requires_add;
    },
    updateRightDrawer(right) {
      this.right = right;
    },
    updateLeftDrawer(left) {
      this.left = left;
    },
    checkRole(tab_roles){
      let user_roles = [];
      JSON.parse(localStorage.getItem("data")).roles.forEach(role => {
         user_roles.push(role.name)
      });
      return user_roles.includes(tab_roles[0]) || user_roles.includes(tab_roles[1])? true : false;
    }
  },
  components: {
    MainContent,
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

.nav {
  background-color: $grey6;
  height: 77.9vh;
}
.item_icon {
  color: $white1;
  font-size: 0.8rem;
}

.item {
  background-color: $secondary;
  color: $white1;
}
.item_text {
  color: $grey2;
}
.item_name {
  font-size: 0.8rem;
}
.bar {
  background-color: $primary;
  color: $white1;
  padding: 0;
}
</style>
