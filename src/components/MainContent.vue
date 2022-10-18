<template>
  <q-page>
    <div>
      <q-header class="bg-primary text-white header">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="showLeftDrawer" v-if="$q.screen.lt.md" />
          <q-toolbar-title class="toolbar_title">
            Welcome President
          </q-toolbar-title>
          <div>
            <q-avatar size="xl">
              <span class="material-icons">
                account_circle
              </span>
            </q-avatar> Suh Edmond
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
    </div>
    <div class="main_content">
      <div>
        <q-card class="card">
          <q-card-section class="content_header">
            <div class="row">
              <label for="title" class="title"><q-btn round color="primary" icon="arrow_back" flat dense /><span class="q-pl-sm">{{item}}</span></label>
              <q-space />
              <q-btn color="primary" icon-right="add" label="Add" flat size="md" dense no-caps v-show="requires_add" @click="showRightDrawer"/>
            </div>
          </q-card-section>
          <q-card-section class="content">
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div>
      <q-footer class="text-black text-center footer">
        <q-toolbar>
          <q-toolbar-title>
            <p class="footer_text"><span class="material-icons copy_right">
                copyright
              </span>Copy Right {{year}}. All Rights Reserved.</p>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    item: {
      type: String,
      required: true
    },
    requires_add: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      left: false,
      year: new Date().getFullYear(),
      right:false,
      roles: [],
    }
  },
  methods:{
    showRightDrawer(){
      this.right = true;
      this.$emit('show-right-drawer', this.right)
    },
    showLeftDrawer(){
      this.left = !this.left;
      this.$emit('show-left-drawer', this.left)
    },
    logoutUser(){
      let payload = {
        to_on_ok: "Login",
        msg: "Logout Successful",
        color: "default",
        to_on_fail: "none",
        error_msg: "default",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      }
      this.$store.dispatch("auth/logoutUser", payload)
    }
  },
};
</script>

<style lang="scss" scoped>
.main_content {
  position: relative;
  z-index: 2000;
  margin-top: -67px;
  margin-left: 1rem;
}

.card {
  height: 90vh;
}

.toolbar_title {
  font-family: 'Roboto';
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
  border-bottom-left-radius: 2rem;
}

.content {
  background-color: $white1;
}

.content_header {
  background-color: $white2;
  height: 10vh;
}

.footer_text {
  font-family: 'Roboto';
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
  font-family: 'Roboto';
  font-style: normal;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: $primary;
  font-weight: 500;
  font-size: smaller;
}
</style>
