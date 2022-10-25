<template>
  <div class="q-pa-xs">
    <div class="button q-pb-xs">
      <ButtonVue
        :label="label_fetch_user"
        :loading="loading"
        :color="color"
        :disabled="false"
        :no_caps="no_caps"
        icon_right="print"
      ></ButtonVue>
    </div>
    <q-table
      :title="title"
      :data="data"
      :columns="columns"
      row-key="name"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="calories" :props="props">
            {{ props.row.calories }}
          </q-td>
          <q-td key="fat" :props="props">
            {{ props.row.fat }}
          </q-td>
          <q-td key="carbs" :props="props">
            {{ props.row.carbs }}
          </q-td>
          <q-td key="protein" :props="props">
            {{ props.row.protein }}
          </q-td>
          <q-td key="sodium" :props="props">
            {{ props.row.sodium }}
          </q-td>
          <q-td key="calcium" :props="props">
            {{ props.row.calcium }}
          </q-td>
          <q-td key="iron" :props="props">
            <q-btn flat round>
              <q-icon
                name="more_vert"
                size="xs"
                color="primary"
                class="menu_icon"
                clickable
              >
                <q-menu>
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditClick(props)"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="edit" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">Edit</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDeleteClick(props.row)"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="delete" size="xs" color="red" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-red">Delete</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- confirmation dialog -->
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" class="warning_image" size="lg" />
          <span class="q-ml-sm text-dark"
            >Are you sure you want to delete this Member?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" class="text-color" v-close-popup no-caps />
          <q-btn flat :label="label" color="primary" v-close-popup no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import ButtonVue from "src/components/Button.vue";
export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    title: {
      required: true,
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      label_fetch_user: "Print",
      loading: false,
      color: "secondary",
      no_caps: true,
      dialog: false,
    };
  },
  methods: {
    onEditClick(data) {
      let payload = {
        data: data,
        tab: "EditMember"
      }
      this.$emit("update-member", payload);
    },
    onDeleteClick(id) {
      this.dialog = true;
    },
  },
  components: {
    ButtonVue,
  },
};
</script>
<style lang="scss" scoped>
.button {
  text-align: end;
}
.menu_icon {
  cursor: pointer;
}
.edit {
  color: $grey5;
}
.warning_image {
  color: $orange;
}
.text-color {
  color: $grey2;
}
</style>
