<template>
  <q-layout view="lHr lpR lFr">
    <q-drawer show-if-above v-model="left" side="left" bordered :width="260">
      <div>
        <div class="bg-transparent q-pa-sm flex flex-center">
          <q-avatar size="70px">
            <img src="../assets/UB-Logo.png">
          </q-avatar>
        </div>
        <div class="text-weight-bold text-center organisation_name q-mb-md q-pa-xs">Brother’s Corner CYF Great Soppo Buea</div>
      </div>
      <div class="nav">
        <q-list padding>
          <q-item :active="active" clickable v-ripple :class="active?'item':''">
            <q-item-section avatar>
              <q-icon name="grid_view" />
            </q-item-section>

            <q-item-section>
              Dashboard
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="item_text" @click="onItemChange" :to="{ name: 'Login' }">
            <q-item-section avatar>
              <q-icon name="diversity_3" />
            </q-item-section>
            <q-item-section>
              Organisation
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple class="item_text">
            <q-item-section avatar>
              <q-icon name="manage_accounts" />
            </q-item-section>
            <q-item-section>
              User Management
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="item_text" >
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>
              Settings Zone
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="item_text" >
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>
            <q-item-section>
              Payment Categories
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="item_text" >
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>
            <q-item-section>
              Expenditure Categories
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="item_text">
            <q-item-section avatar>
              <q-icon name="savings" />
            </q-item-section>
            <q-item-section>
              Member Savings
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="item_text">
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>
            <q-item-section>
              Income Activities
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="item_text">
            <q-item-section avatar>
              <q-icon name="payments" />
            </q-item-section>
            <q-item-section>
              Contributions
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="item_text">
            <q-item-section avatar>
              <q-icon name="summarize" />
            </q-item-section>
            <q-item-section>
              Reports
            </q-item-section>
          </q-item>

        </q-list>
      </div>
    </q-drawer>

    <q-drawer v-model="right" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container class="content">
      <MainContent>
        <router-view />
      </MainContent>
    </q-page-container>

  </q-layout>
</template>

<script>
import MainContent from "src/components/MainContent.vue"
export default {
  data() {
    return {
      left: false,
      right: false,
      year: new Date().getFullYear(),
      active: true
    }
  },
  methods:{
    onItemChange(evt){
      evt.preventDefault()
      console.log(evt.to);
    }
  },
  components: {
    MainContent
  }
}
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
  height: 100vh
}

.drop_down_text {
  font-family: 'Roboto';
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
  font-family: 'Roboto';
  font-style: normal;
  letter-spacing: 0.01em;
  font-weight: 700;
  font-size: medium;
}

.nav {
  background-color: $grey6;
  height: 77vh;
}

.item {
  background-color: $secondary;
  color: $white1;
}
.item_text {
  color:$grey2;
}
</style>
