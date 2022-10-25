<template>
  <q-btn :color="color" :label="label"  class="button" type="submit"  :loading="loading" :disable="disabled" :no-caps="no_caps" :icon-right="icon_right">
    <template v-slot:loading>
          <q-spinner-ios />
        </template>
  </q-btn>
</template>

<script>
export default {
  props: {
    label: {
     required:true
    },
    loading: {
      required:true
    },
    disabled: {
      required:true
    },
    color:{
      required:true
    },
    no_caps: {
      required:true
    },
    icon_right: {
      required:false
    }
  },
  data(){
    return {
    }
  }
}
</script>

<style>
  .button {
    border-radius: 3px;
  }
</style>
