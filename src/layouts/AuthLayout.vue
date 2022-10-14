<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="header text-white">
      <q-toolbar>
        <q-toolbar-title :class="$q.screen.lg? 'header_title':'header_title_small'">
          <span class="app_name">Financial</span>Assistant
        </q-toolbar-title>
        <div class="header_note" v-show="$q.screen.lg">
          <div class="account_text" v-show="hasAccount">
            Don't Have an Account ?
          </div>
          <div class="account_text__signup" v-show="hasAccount" >
            <router-link to="/auth/register" class="sign_link"><span @click="checkAccountExist">SIGN UP</span></router-link>
          </div>
          <div class="account_text" v-show="!hasAccount">
            Already Have an Account ?
          </div>
          <div class="account_text__signup" v-show="!hasAccount" >
            <router-link to="/auth/login" class="sign_link"><span @click="checkAccountExist">SIGN IN</span></router-link>
          </div>
          <div class="q-pa-md header_language">
            <q-btn-dropdown color="black" :label="language" flat>
              <q-list>
                <q-item clickable v-close-popup @click="onItemClick('English')">
                  <q-item-section class="text-center">
                    <q-item-label>English</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="onItemClick('French')">
                  <q-item-section class="text-center">
                    <q-item-label>French</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <div class="header_note" v-show="!$q.screen.lg">
          <div class="q-pa-md header_language">
            <q-btn-dropdown color="black" :label="language" flat>
              <q-list>
                <q-item clickable v-close-popup @click="onItemClick('English')">
                  <q-item-section class="text-center">
                    <q-item-label>English</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="onItemClick('French')">
                  <q-item-section class="text-center">
                    <q-item-label>French</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="content">
      <router-view />
    </q-page-container>
    <q-footer class="text-black footer flex flex-center">
      <q-toolbar>
        <q-toolbar-title>
          <p class="footer_text"><span class="material-icons copy_right">
              copyright
            </span>Copy Right {{year}}. All Rights Reserved.</p>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      year: new Date().getFullYear(),
      language: "EN",
      hasAccount: true
    };
  },
  methods: {
    onItemClick(lang) {
      if(lang == 'French'){
        this.language = 'FR'
      }
      if(lang == 'English'){
        this.language = 'EN'
      }
    },
    checkAccountExist(){

      this.hasAccount = !this.hasAccount
    }

  }
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.footer {
  background-color: $white1;
  height: 2rem;
}

.content {
  background-color: $grey1;
  height: 100vh;
}

.app_name {
  color: $primary;
}

.header {
  background-color: $white1;
}

.header_title {
  text-transform: capitalize;
  color: $orange;
  font-weight: bold;
  padding: .6rem;
  font-size: xx-large;
  font-family: "Roboto";
  letter-spacing: 0.009em;
  display: block;
}

.header_title_small {
  text-transform: capitalize;
  color: $orange;
  font-weight: bold;
  padding: .6rem;
  font-size: large;
  font-family: "Roboto";
  letter-spacing: 0.009em;
  display: block;

}

.logo {
  width: 50px;
  height: 50px;
}

.header_logo {
  background-color: $dark;
  margin-right: 0.5rem;
}

.header_note {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.account_text {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: bold;
  font-size: 13px;
  color: $dark;
  margin-right: .5rem;
  text-transform: uppercase;
  line-height: 37px;

}

.sign_link {
  text-decoration: none;
  color: $primary;
}

.account_text__signup {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: bold;
  font-size: 13px;
  align-items: center;
  color: $primary;
  cursor: pointer;
  line-height: 37px;
  margin-right: 7rem;
}

.header_language {
  margin-right: .5rem;
}

.footer_text {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
  padding-bottom: 1rem;
}
.copy_right {
  font-size: large;
}

</style>
