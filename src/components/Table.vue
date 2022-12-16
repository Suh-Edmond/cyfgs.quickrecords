<template>
  <div class="q-pa-xs">
    <div class="button q-pb-xs"></div>
    <q-table
      :data="data"
      :columns="columns"
      row-key="index"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }"
      :filter="filter"
      :pagination.sync="pagination"
    >
    <template v-slot:top-left>
      <div class="text-h6 title" v-show="show_member_savings">
         All Savings for: {{ title }}
        </div>
        <div class="text-h6 title" v-show="show_member_contribution">
        {{ title }}
        </div>
    </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="counter" :props="props">
            {{props.row.counter}}
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
            <span v-if="!show_savings || show_income_activity || show_contribution">{{ props.row.name }}</span>
          </q-td>
          <q-td key="email" :props="props" v-show="show_savings || show_members">
            {{ props.row.email }}
          </q-td>
          <q-td key="gender" :props="props" v-show="show_members">
            {{ props.row.gender }}
          </q-td>
          <q-td key="telephone" :props="props" v-show="show_savings || show_members">
            {{ props.row.telephone }}
          </q-td>
          <q-td key="address" :props="props" v-show="show_members">
            {{ props.row.address }}
          </q-td>
          <q-td key="occupation" :props="props" v-show="show_members">
            {{ props.row.occupation }}
          </q-td>
          <q-td key="amount_deposited" :props="props" v-show="show_savings || show_member_savings">
            {{ props.row.amount_deposited }}
          </q-td>
          <q-td key="amount" :props="props" v-show="show_income_activity || show_contribution">
            {{ props.row.amount }}
          </q-td>
          <q-td key="status" :props="props" v-show="show_contribution">
            {{ props.row.status }}
          </q-td>
          <q-td key="date" :props="props" v-show="show_savings || show_member_savings || show_income_activity || show_contribution">
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
                    <!-- <q-separator /> -->
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
                    <!-- <q-separator /> -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewIncomeActivity(props.row)"
                      v-show="show_income_activity"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="visibility" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">Details</q-item-label>
                      </q-item-section>
                    </q-item>
                    <!-- <q-separator /> -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditContribution(props.row)"
                      v-show="show_contribution"
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
                    <!-- <q-separator /> -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewContribution(props.row)"
                      v-show="show_contribution"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="visibility" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">Details</q-item-label>
                      </q-item-section>
                    </q-item>
                    <!-- <q-separator /> -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onAllContribution(props.row)"
                      v-show="show_contribution"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="eye" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">All Contributions</q-item-label>
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
    <q-dialog v-model="dialog" v-if="dialog" >
      <q-card>
        <q-card-section>
          <div>
            <q-avatar
              icon="warning"
              class="warning_image"
              size="30px"
              color="yellow"
              text-color="white"
            />
            <span class="q-ml-sm text-dark"
              >{{message}}</span
            >
          </div>
          <div class="text-weight-bold text-center">{{ deleted_row.name }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :label="label_cancel"
            :color="'primary'"
            :disabled="false"
            :loading="loading"
            :no_caps="true"
            :flat="true"
            class="dialog_button"
            v-close-popup
          ></q-btn>
          <q-btn
            :label="label"
            :color="'primary'"
            class="dialog_button"
            :disabled="false"
            :loading="loading"
            :no_caps="false"
            :flat="true"
            v-close-popup
            @click="deleteRow(deleted_row)"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
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
      type: Object,
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
    },
    show_contribution:{
      type:Boolean,
      required: true
    },
    show_member_contribution:{
      required: false,
      type: Boolean
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
      pagination: {
        rowsPerPage: 15 // current rows per page being displayed
      },
      deleted_row: null,
    };
  },
  methods: {
    onEditMember(data) {
      let payload = {
        url: `/api/protected/organisations/users/${data.id}`,
        data: this.user,
        msg: "Member information updated successfully",
        status:"none",
        color: "default",
        show_feedback:true,
        to_on_ok: "none",
        to_on_fail: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        this.$emit("update-member", {"data":res.data, "tab":"EditMember"});
      })

    },
    deleteRow(data){
      let payload = {
        url: `/api/protected/users/${data.id}`,
        msg: "Member successfully deleted",
        status:"success",
        color: "default",
        to_on_ok: "none",
        show_feedback:true,
        to_on_fail: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("deleteRequest", payload).then(() => {
        this.$emit("fetch-members", data.organisation_id);
      })
    },
    onDeleteMember(data) {
      this.deleted_row = data;
      this.dialog = true;
    },
    showMemberSavings(data){
    },
    onEditMemberSaving(data){
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
      let payload = {
        data: data,
        tab: "View Income Activity",
      };
      this.$emit("view-income-activity", payload);
    },
    onViewContribution(data){
      let payload = {
        data: data,
        tab: "View Contribution",
      };
      this.$emit("view-contribution", payload);
    },
    onEditContribution(data){
      let payload = {
        data: data,
        tab: "Members Contributions",
      };
      this.$emit("edit-contribution", payload);
    },
    onAllContribution(data){
      this.$router.push({name:'member_contributions', params:{id:data.id}})
    }
  },
  components: {

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
  color: $primary;
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

.title {
  font-size: small;
}

.dialog_button {
  font-size: small;
  font-weight: 500;
}
</style>
