<template>
  <div class="q-pa-xs">
    <!-- table element -->
    <q-table
      :data="data"
      :columns="columns"
      row-key="id"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }"
      class="col-xs-12"
      :filter="filter"
      :pagination.sync="pagination"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="item" :props="props" v-if="show_payment_category">
            <q-btn
              flat
              class="view_items"
              @click="showPaymentItems(props.row)"
              :to="{ name: 'payment_items', params: { id: props.row.id } }"
            >
              {{ props.row.item }}
            </q-btn>
          </q-td>
          <q-td
            key="expenditure_category"
            :props="props"
            v-if="show_expenditure_category"
          >
            <q-btn
              flat
              class="view_items"
              @click="showExpenditureItems(props.row)"
              :to="{
                name: 'expenditure_items',
                params: { id: props.row.id },
              }"
            >
              {{ props.row.expenditure_category }}
            </q-btn>
          </q-td>
          <q-td key="amount" :props="props" v-if="show_payment_item || show_expenditure_item">
            {{ props.row.amount }}
          </q-td>
          <q-td key="amount_given" :props="props" v-if="show_expenditure_item_detail">
            {{ props.row.amount_given }}
          </q-td>
          <q-td key="amount_spent" :props="props" v-if="show_expenditure_item_detail">
            {{ props.row.amount_spent }}
          </q-td>
          <q-td key="balance" :props="props" v-if="show_expenditure_item_detail">
            {{ props.row.balance }}
          </q-td>
          <q-td key="venue" :props="props" v-if="show_expenditure_item">
            {{ props.row.venue }}
          </q-td>
          <q-td key="date" :props="props" v-if="show_expenditure_item">
            {{ props.row.date }}
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
                      @click="onViewCategory(props.row)"
                      v-if="show_payment_category"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="visibility" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">View</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewPaymentItem(props.row)"
                      v-if="show_payment_item"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="visibility" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">Details</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewExpenditureCategory(props.row)"
                      v-if="show_expenditure_category"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="visibility" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">Details</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditExpenditureItem(props.row)"
                      v-if="show_expenditure_item"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="edit" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">Edit</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewExpenditureItemDetail(props.row)"
                      v-if="show_expenditure_item"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="visibility" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">Details</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditExpenditureItemDetail(props.row)"
                      v-if="show_expenditure_item_detail"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="edit" size="xs" class="details" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="details">Edit</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator/>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDelete(props.row)"
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
      <template v-slot:top-left>
        <div class="text-h6 title" v-show="show_payment_item">
         Category Name: {{ title }}
        </div>
        <div class="text-h6 title" v-show="show_expenditure_item">
          Category Name: {{ title }}
        </div>
        <div class="text-h6 title" v-show="show_expenditure_item_detail">
          Item Name: {{ title }}
        </div>
      </template>
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          :class="
            $q.screen.md
              ? 'text-h6-sm q-mb-sm q-mt-sm full-width'
              : 'text-h6-sm'
          "
          v-model="filter"
          placeholder="Search category..."
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <!-- confirmation delete category dialog -->
    <q-dialog v-model="dialog" v-if="dialog">
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
            <span class="q-ml-sm text-dark">{{ message }}</span>
          </div>
          <div class="text-weight-bold text-center">{{ deleted_row.name }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            :label="label_cancel"
            :color="'primary'"
            :disabled="false"
            :loading="loading"
            :no_caps="false"
            v-close-popup
            :flat="true"
          ></q-btn>
          <q-btn
            :label="label"
            :color="'primary'"
            :disabled="false"
            :loading="loading"
            :no_caps="false"
            v-close-popup
            @click="deletedRow(deleted_row)"
            :flat="true"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { SessionStorage } from 'quasar';
import PaymentCategoryMixinVue from 'src/mixins/PaymentCategoryMixin.vue';
export default {
  mixins:[PaymentCategoryMixinVue],
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
      required: false,
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    show_payment_category: {
      type: Boolean,
      required: true,
    },
    show_payment_item: {
      type: Boolean,
      required: true,
    },
    show_expenditure_category: {
      type: Boolean,
      required: true,
    },
    show_expenditure_item: {
      type: Boolean,
      required: true,
    },
    show_expenditure_item_detail:{
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      label_download: "Print",
      loading: false,
      color: "positive",
      no_caps: true,
      dialog: false,
      deleted_row : null,
      showTable: true,
      label_cancel: "Cancel",
      filter: "",
      pagination: {
        rowsPerPage:15 // current rows per page being displayed
      },
    };
  },
  computed:{
    getSelectedCategory(){
      return SessionStorage.getItem("selected_category");
    }
  },
  methods: {
    onViewCategory(categories) {
      let payload = {
        data: categories,
        tab: "Payment Categories",
      };
      this.$emit("update-payment-category", payload);
    },
    onViewPaymentItem(payment_items) {
      let payload = {
        data: payment_items,
        tab: "Payment Items",
      };
      this.$emit("update-payment-item", payload);
    },
    onDelete(row) {
      this.deleted_row = row;
      this.dialog = true;
    },
    showPaymentItems(payment_items) {
      let has_intermediate_tab = true;
      this.$emit("show-payment-items", { payment_items, has_intermediate_tab });
    },
    showExpenditureItems(expenditure_items){
      let has_intermediate_tab = true;
      SessionStorage.set("selected_category", expenditure_items.id)
      this.$emit("show-expenditure-items", { data, has_intermediate_tab });

    },
    onViewExpenditureItemDetail(expenditure_item_detail) {
      let has_intermediate_tab = true;
      let selected_category = SessionStorage.getItem("selected_category");
      this.$router.push({ name: 'expenditure_item_details', params:{ "id": selected_category, "item_id":expenditure_item_detail.id } })
      this.$emit("show-expenditure-item-details", {expenditure_item_detail, has_intermediate_tab})
    },
    onViewExpenditureCategory(expenditure_category) {
      let payload = {
        data: expenditure_category,
        tab: "Expenditure Categories",
      };
      this.$emit("update-expenditure-category", payload);
    },
    onEditExpenditureItem(expenditure_item){
      let payload = {
        data: expenditure_item,
        tab: "Expenditure Items",
      };
      this.$emit("edit-expenditure-item", payload);
    },
    onEditExpenditureItemDetail(expenditure_item_detail){
      let payload = {
        data: expenditure_item_detail,
        tab: "Expenditure Item Details",
      };
      this.$emit("edit-expenditure-item-detail", payload);
    },
    deletedRow(deleted_data){
      let payload = {
        url: this.setDeletedUrlBaseOnType(deleted_data),
        msg: "Payment category deleted Successfully",
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      }
      this.$store.dispatch("deleteRequest", payload).then(() => {
        this.callFetchDataBaseOnType(deleted_data);
      })
    },
    setDeletedUrlBaseOnType(row) {
      let url = '';
      switch(row.type){
        case 'PAYMENT_CATEGORY':
          url =  `/api/protected/organisations/${row.organisation_id}/payment-categories/${row.id}`;
          break;
      }
      return url;
    },

    callFetchDataBaseOnType(row){
      switch(row.type){
        case "PAYMENT_CATEGORY":
          this.fetchCategories();
          break;
      }
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
  color: $grey5;
}

.details {
  color: $primary;
}

.warning_image {
  color: yellow;
}

.view_items {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 25px;
  align-items: center;
  letter-spacing: 0.01em;
  text-transform: capitalize;
  color: $primary;
}

.title {
  font-size: medium;
}

.dialog_button {
  font-size: 9px;
  font-weight: 300;
}
</style>
