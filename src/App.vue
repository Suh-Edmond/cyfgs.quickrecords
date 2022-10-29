<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { SessionStorage } from 'quasar'
export default {
  name: 'App',

  created(){
    SessionStorage.set('from_tab', 'Dashboard')
  }
}
</script>
