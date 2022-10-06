<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',

  created(){
    // localStorage.setItem('is_exist_user', false);
  }
}
</script>
