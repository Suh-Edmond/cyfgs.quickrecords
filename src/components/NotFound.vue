<template>
  <q-page>
    <div class="text-center member_not_found">
      <h6>
        {{message}}
        <q-avatar>
          <img src="../assets/arrow.png" alt="" width="200px">
        </q-avatar>
      </h6>
    </div>
  </q-page>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  },
  data() {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
.member_not_found {
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 39px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
  color: $grey5;
}
</style>
