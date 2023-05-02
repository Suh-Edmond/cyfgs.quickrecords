<template>
  <q-page>
    <div class="text-center member_not_found ">
      <p>
        {{message}}
        <!-- <span class="arrow"><img src="../assets/arrow.png" alt=""  width="100px"></span> -->
      </p>
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
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: medium;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
  color: $grey5;
}

.arrow {
  color: $dark;
}
</style>
