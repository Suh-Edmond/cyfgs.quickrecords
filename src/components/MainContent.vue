<template>
  <q-page>
    <div>
      <q-header class="bg-primary text-white header">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="left = !left" v-if="$q.screen.lt.md" />
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
                  <q-item-section class="text-center drop_down_text">
                    <q-item-label>Logout</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <!-- <q-btn dense flat round icon="menu" @click="right = !right" /> -->
        </q-toolbar>
      </q-header>
    </div>
    <div class="main_content">
      <div>
        <q-card class="card">
          <q-card-section class="content_header"> </q-card-section>
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
export default {
  data() {
    return {
      left: false,
      year: new Date().getFullYear(),
    }
  }
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
</style>
