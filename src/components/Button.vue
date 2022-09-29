<template>
  <q-btn color="primary" :label="label"  class="button" type="submit"  :loading="loading" :disable="disabled">
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
