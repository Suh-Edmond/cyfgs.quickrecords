<template>
  <q-btn
    :color="color"
    :label="label"
    :flat="flat"
    class="button"
    :class="$q.platform.is.mobile?'full-width':''"
    type="submit"
    :loading="loading"
    :disable="disabled"
    :no-caps="no_caps"
    :icon-right="icon_right"
  >
    <template v-slot:loading>
      <q-spinner color="white" :size="size" />
    </template>
  </q-btn>
</template>

<script>
export default {
  props: {
    size: {
      required: false,
      type: Number,
    },
    label: {
      required: true,
    },
    loading: {
      required: true,
    },
    disabled: {
      required: true,
    },
    color: {
      required: true,
    },
    no_caps: {
      required: true,
    },
    icon_right: {
      required: false,
    },
    flat: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
.button {
  border-radius: 3px;
}
</style>
