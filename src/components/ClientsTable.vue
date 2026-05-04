<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :data="data"
      :columns="columns"
      row-key="name"
      :visible-columns="visibleColumns"
      :loading="loading"
    >
      <template v-slot:top>
        <img
          style="height: 100px; width: 100px"
          src="../assets/App_Logo.jpeg"
        />

        <q-space />

        <q-select
          v-model="visibleColumns"
          multiple
          outlined
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          options-cover
          style="min-width: 150px"
        />
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    visibleColumns: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:visibleColumns"],
  data() {
    return {};
  },
  computed: {
    getVisibleColumns() {
      return this.visibleColumns;
    },
  },
  methods: {
    // updateVisibleColumns() {
    //   this.$emit("update:visibleColumns");
    // },
  },
};
</script>
