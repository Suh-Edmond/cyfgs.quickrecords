<template>
  <div class="q-pa-xs">
    <div class="button q-pb-xs"></div>
    <q-table
      :data="data"
      :columns="columns"
      row-key="id"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }"
      :filter="filter"
    >
    <template v-slot:top-left>
      <div class="text-h6 title" v-show="show_member_savings">
         All Savings for: {{ title }}
        </div>
    </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="name" :props="props">
            <q-btn
              flat
              class="view_savings"
              @click="showMemberSavings(props.row)"
              :to="{ name: 'user_savings', params: { id: props.row.id } }"
              v-show="show_savings"
            >
            {{ props.row.name }}
              <q-tooltip>View All Savings</q-tooltip>
            </q-btn>
            <span v-if="!show_savings || show_income_activity">{{ props.row.name }}</span>
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
          <q-td key="email" :props="props" v-show="show_savings">
            {{ props.row.email }}
          </q-td>
          <q-td key="telephone" :props="props" v-show="show_savings">
            {{ props.row.telephone }}
          </q-td>
          <q-td key="amount_deposited" :props="props" v-show="show_savings || show_member_savings">
            {{ props.row.amount_deposited }}
          </q-td>
          <q-td key="amount" :props="props" v-show="show_income_activity">
            {{ props.row.amount }}
          </q-td>
          <q-td key="date" :props="props" v-show="show_savings || show_member_savings || show_income_activity">
            {{ props.row.date }}
          </q-td>
          <q-td key="venue" :props="props" v-show="show_income_activity">
            {{ props.row.venue }}
          </q-td>
          <q-td key="action" :props="props">
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
                      @click="onEditMember(props.row)"
                      v-show="show_members"
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
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditMemberSaving(props.row)"
                      v-show="show_savings"
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

                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditIncomeActivity(props.row)"
                      v-show="show_income_activity"
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
                      @click="onViewIncomeActivity(props.row)"
                      v-show="show_income_activity"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="info" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">Details</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDeleteMember(props.row)"
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
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          :class="
            $q.screen.md
              ? 'text-h6-sm q-mb-lg q-mt-lg full-width'
              : 'text-h6-sm'
          "
          v-model="filter"
          placeholder="Type name to search..."
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <!-- confirmation dialog -->
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <div>
            <q-avatar icon="warning" class="warning_image" size="40px" />
            <span class="q-ml-sm text-dark"
              >{{message}}</span
            >
          </div>
          <div class="text-weight-bold text-center">{{ member_name }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <ButtonVue
            :label="label_cancel"
            :color="'primary'"
            :disabled="false"
            :loading="loading"
            :no_caps="false"
            :flat="true"
            v-close-popup
          ></ButtonVue>
          <ButtonVue
            :label="label"
            :color="'primary'"
            :disabled="false"
            :loading="loading"
            :no_caps="false"
            :flat="true"
            v-close-popup
          ></ButtonVue>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import ButtonVue from "./Button.vue";
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
    label: {
      required: true,
      type: String,
    },
    member_name: {
      required: false,
      type: String,
    },
    show_members:{
      required: true,
      type: Boolean
    },
    show_savings: {
      required: true,
      type: Boolean
    },
    message: {
      type: String,
      required: true
    },
    show_member_savings:{
      required: false,
      type: Boolean
    },
    title:{
      required: false,
      type: String
    },
    show_income_activity: {
      type:Boolean,
      required: true
    }
  },
  data() {
    return {
      label_download: "Print",
      loading: false,
      color: "positive",
      no_caps: true,
      dialog: false,
      filter: null,
      label_cancel: "Cancel",
    };
  },
  methods: {
    onEditMember(data) {
      let payload = {
        data: data,
        tab: "EditMember",
      };
      this.$emit("update-member", payload);
    },
    onDeleteMember(data) {
      this.dialog = true;
    },
    showMemberSavings(data){
      console.log(data);
    },
    onEditMemberSaving(data){
      console.log(data);
      let payload = {
        data: data,
        tab: "Member Savings",
      };
      this.$emit("edit-member-saving", payload);
    },
    onEditIncomeActivity(data){
      let payload = {
        data: data,
        tab: "Income Activities",
      };
      this.$emit("edit-income-activity", payload);
    },
    onViewIncomeActivity(data){
      console.log(data);
      let payload = {
        data: data,
        tab: "View Income Activity",
      };
      this.$emit("view-income-activity", payload);
    }
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
  color: yellow;
}
.view_savings {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 25px;
  align-items: left;
  letter-spacing: 0.01em;
  text-transform: capitalize;
  color: $primary;
}
</style>
