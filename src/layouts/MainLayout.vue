<template>
  <q-layout view="lHr lpR lff" class="content">
    <q-header class="bg-primary text-white header">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title> Title </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="right = !right" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-drawer show-if-above v-model="right" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container class="main-content">
      <MainContent>
         <router-view />
      </MainContent>
    </q-page-container>

    <!-- <q-footer class="text-black footer flex flex-center">
      <q-toolbar>
        <q-toolbar-title>
          <p class="footer_text"><span class="material-icons copy_right">
              copyright
            </span>Copy Right {{year}}. All Rights Reserved.</p>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer> -->
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
    };
  },
  components: {
    MainContent
  }
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-content {
  position: relative;
}

.header {
  height: 120px;
  border-bottom-left-radius: 2rem;
}

.footer {
  background-color: $white1;
  height: .5rem;
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
.content {
  background-color: $grey1;
}
</style>
