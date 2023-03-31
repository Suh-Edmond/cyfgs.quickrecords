<template>
  <div>
    <!-- spinners -->
    <div class="flex justify-center">
      <q-spinner-ios
        color="primary"
        size="2em"
        class="q-mb-lg"
        v-if="getLoadingState"
      />
    </div>
    <div class="row q-px-md" v-if="!getLoadingState">
      <div class="col-md-4 col-sm-12 col-xs-12">
        <div class="text-center q-pb-sm">
          <label for="title" class="title">Member's Profile</label>
        </div>
        <div class="text-center">
          <q-avatar size="190px">
            <q-icon
              name="account_circle"
              size="190px"
              class="icon"
              v-if="getCurrentMember.picture == null"
            >
            </q-icon>
            <img
              :src="getCurrentMember.picture"
              alt="User picture"
              v-if="getCurrentMember != null"
            />
          </q-avatar>
          <div>
            <input
              type="file"
              accept="image/x-png,image/jpg,image/jpeg"
              style="display: none"
              id="logo"
              @change="onFileChanged"
            />
            <q-icon
              name="add_a_photo"
              class="camara"
              size="sm"
              @click="openFileUpload"
            >
              <q-tooltip>Upload Picture</q-tooltip>
            </q-icon>
          </div>
        </div>

        <!-- member roles -->
        <div class="flex q-pt-md">
          <div>
            <label for="info" class="info"
              ><span
                ><q-icon
                  name="military_tech"
                  class="q-pr-xs person_icon"
                ></q-icon></span
              >My Roles:
              <q-list>
                <q-item
                  v-for="role in user_roles"
                  :key="role.id"
                  v-ripple
                  class="q-mb-sm"
                >
                  <q-item-section avatar v-if="role.name == 'MEMBER'">
                    <q-avatar color="primary" text-color="white" size="30px">
                      M</q-avatar
                    >
                  </q-item-section>
                  <q-item-section avatar v-if="role.name == 'PRESIDENT'">
                    <q-avatar color="primary" text-color="white" size="30px">
                      PP
                    </q-avatar>
                  </q-item-section>
                  <q-item-section
                    avatar
                    v-if="role.name == 'FINANCIAL_SECRETARY'"
                  >
                    <q-avatar color="primary" text-color="white" size="30px">
                      FS
                    </q-avatar>
                  </q-item-section>
                  <q-item-section avatar v-if="role.name == 'TREASURER'">
                    <q-avatar color="primary" text-color="white" size="30px">
                      TR
                    </q-avatar>
                  </q-item-section>
                  <q-item-section avatar v-if="role.name == 'AUDITOR'">
                    <q-avatar color="primary" text-color="white" size="30px">
                      AU
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="role_name">{{
                      role.name
                    }}</q-item-label>
                    <q-item-label caption class="text-sm"
                      >Updated by:
                      <span> {{ role.updated_by }}</span></q-item-label
                    >
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption>
                      <span
                        >{{ formDateTime(role.created_at) }}
                      </span></q-item-label
                    >
                    <q-btn
                      flat
                      round
                      @click="showRemoveRoleDialog(role)"
                      v-if="role.name !== 'MEMBER' && canEditUserRole"
                    >
                      <q-icon name="delete" color="negative" size="xs">
                        <q-tooltip>Remove Role</q-tooltip>
                      </q-icon>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </label>
          </div>
          <q-space />
          <div v-if="canEditUserRole">
            <q-icon
              name="add"
              size="sm"
              color="primary"
              class="edit_icon"
              @click="showAddRole()"
            >
              <q-tooltip>Add Role</q-tooltip>
            </q-icon>
          </div>
        </div>

        <q-separator class="q-my-md" />
        <!-- personal infomation -->
        <div class="q-mb-md">
          <div class="flex">
            <div>
              <label for="info" class="info"
                ><span
                  ><q-icon
                    name="person"
                    class="q-pr-xs person_icon"
                  ></q-icon></span
                >Personal information</label
              >
            </div>
            <q-space />
            <div>
              <q-icon
                name="edit"
                size="xs"
                color="primary"
                class="edit_icon"
                @click="showEditProfile"
              >
                <q-tooltip>Edit Profile</q-tooltip>
              </q-icon>
            </div>
          </div>
          <div class="flex q-pt-md q-pb-md q-pl-lg">
            <label for="name" class="label">
              Name:
              <span class="value name value_code">{{
                getCurrentMember.name
              }}</span></label
            >
          </div>
          <div class="flex q-pb-md q-pl-lg">
            <label for="name" class="label">
              Gender:
              <span class="value value_code gender">{{
                getCurrentMember.gender
              }}</span>
            </label>
          </div>
          <div class="flex q-pb-md q-pl-lg">
            <label for="name" class="label"
              >Email:
              <span class="value value_code email">{{
                getCurrentMember.email
              }}</span></label
            >
          </div>
          <div class="flex q-pb-md q-pl-lg">
            <label for="name" class="label"
              >Telephone:
              <span class="value phone value_code">{{
                getCurrentMember.telephone
              }}</span></label
            >
          </div>
          <div class="flex q-pb-md q-pl-lg">
            <label for="name" class="label">
              Address:
              <span class="value address value_code">{{
                getCurrentMember.address
              }}</span></label
            >
          </div>
          <div class="flex q-pb-md q-pl-lg">
            <label for="name" class="label">
              Occupation:
              <span class="value occupation value_code">{{
                getCurrentMember.occupation
              }}</span></label
            >
          </div>
        </div>

        <div
          class="not_register q-pa-sm"
          v-if="getCurrentMember.has_register == 'NOT_REGISTERED'"
        >
          <label for="register">Member has not Completed Registration</label>
        </div>
        <div
          class="q-mt-md has_register q-pa-sm"
          v-if="getCurrentMember.has_register == 'REGISTERED'"
        >
          <label for="register">Member has Completed registration</label>
        </div>

        <div
          class="q-mt-md pending_reg q-pa-sm"
          v-if="
            getCurrentMember.has_paid && getCurrentMember.approve == 'PENDING'
          "
        >
          <label for="register"
            >Member's Registration is awaiting Approval</label
          >
        </div>
      </div>
      <div class="col-md-8 col-sm-12 col-xs-12">
        <div class="text-center q-pb-sm">
          <label for="title" class="title">Member's Contributions</label>
        </div>
        <!-- payment items -->
        <div class="q-ml-lg">
          <div class="row">
            <div class="col-12">
              <q-table
                :data="data"
                :columns="columns"
                row-key="index"
                :table-header-style="{
                  backgroundColor: '#5384ae',
                  color: '#FFFFFF',
                }"
              >
                <template v-slot:top-left>
                  <div class="text-h6 contribution_item_header">
                    Payment Items
                  </div>
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="counter" :props="props">
                      {{ props.row.counter }}
                    </q-td>
                    <q-td key="name" :props="props">
                      {{ props.row.name }}
                    </q-td>
                    <q-td key="is_complusory" :props="props">
                      {{ props.row.is_complusory }}
                    </q-td>
                    <q-td key="amount" :props="props">
                      {{ props.row.amount }}
                    </q-td>
                    <q-td key="has_pay" :props="props">
                      <q-checkbox
                        v-model="props.row.has_pay"
                        dense
                        size="sm"
                        @input="computeTotal(props.row)"
                      />
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </div>
        <!-- total amount payable -->
        <div class="flex q-ml-lg q-my-lg justify-center">
          <div>
            <label for="total" class="title">Total Amount Payable</label>
          </div>
          <div class="q-pl-lg">
            <q-input
              disable
              outlined
              dense
              type="number"
              v-model="total_amount_payable"
            ></q-input>
          </div>
          <div class="q-pl-lg">
            <ButtonVue
              label="Make Payment"
              :loading="loading"
              color="primary"
              :disabled="true"
              :no_caps="no_caps"
            >
            </ButtonVue>
          </div>
        </div>
        <!-- paid items -->
        <div class="q-ml-lg q-mt-lg">
          <div class="row">
            <div class="col-12">
              <q-table
                :data="data1"
                :columns="columns1"
                row-key="index"
                :table-header-style="{
                  backgroundColor: '#5384ae',
                  color: '#FFFFFF',
                }"
              >
                <template v-slot:top-left>
                  <div class="text-h6 contribution_item_header">Paid Items</div>
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="counter" :props="props">
                      {{ props.row.counter }}
                    </q-td>
                    <q-td key="name" :props="props">
                      {{ props.row.name }}
                    </q-td>
                    <q-td key="is_complusory" :props="props">
                      {{ props.row.is_complusory }}
                    </q-td>
                    <q-td key="amount" :props="props">
                      {{ props.row.amount }}
                    </q-td>
                    <q-td key="amount_paid" :props="props">
                      {{ props.row.amount_paid }}
                    </q-td>
                    <q-td key="balance" :props="props">
                      {{ props.row.balance }}
                    </q-td>
                    <q-td key="approve" :props="props">
                      {{ props.row.approve }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- edit member profile dialog -->
    <q-dialog v-model="edit_profile">
      <q-card style="min-width: 500px" class="q-pa-sm">
        <q-card-section class="row items-center q-pb-md">
          <div class="text-h6 title">Update Personal Information</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onUpdateMember" class="q-gutter-md">
            <div>
              <label for="credential" class="form_field"
                >Name <span class="text-red">*</span></label
              >
              <q-input v-model="user.name" outlined dense type="text" />
            </div>
            <div>
              <label for="credential" class="form_field"
                >Gender <span class="text-red">*</span></label
              >
              <q-select
                v-model="user.gender"
                outlined
                dense
                :options="gender_options"
                :disable="user.gender != null"
              />
            </div>
            <div>
              <label for="credential" class="form_field">Email</label>
              <q-input v-model="user.email" outlined dense type="email" />
            </div>
            <div>
              <label for="credential" class="form_field"
                >Telephone <span class="text-red">*</span></label
              >
              <q-input
                v-model="user.telephone"
                outlined
                dense
                type="tel"
                mask="(+###) ### - ### - ###"
                unmasked-value
                disable
                readonly
              />
            </div>
            <div>
              <label for="credential" class="form_field"
                >Address <span class="text-red">*</span></label
              >
              <q-input v-model="user.address" outlined dense type="text" />
            </div>
            <div>
              <label for="credential" class="form_field"
                >Occupation <span class="text-red">*</span></label
              >
              <q-input v-model="user.occupation" outlined dense type="text" />
            </div>
            <div class="flex q-mt-lg justify-end">
              <div class="q-mt-xs">
                <ButtonVue
                  class="form_button"
                  label="Save"
                  :loading="is_fetching"
                  color="primary"
                  :disabled="validateForm"
                  :no_caps="no_caps"
                >
                </ButtonVue>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- add member role -->
    <q-dialog v-model="show_role_dialog">
      <q-card style="min-width: 400px" class="q-pa-xs">
        <q-card-section class="row items-center q-pb-md">
          <div class="text-h6 title">Add Member Role</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onAddRole" class="q-gutter-md">
            <div>
              <label for="credential" class="form_field"
                >Select role <span class="text-red">*</span></label
              >
              <q-select
                v-model="role"
                outlined
                :options="getAvailableRoles"
                dense
              />
            </div>
            <div class="flex justify-end">
              <div class="q-mt-xs">
                <ButtonVue
                  class="form_button"
                  label="Add"
                  :loading="loading"
                  color="primary"
                  :disabled="validateAddRole"
                  :no_caps="true"
                >
                </ButtonVue>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- remove role dialog -->
    <q-dialog v-model="show_remove_role_dialog">
      <q-card style="min-width: 400px" class="q-pa-xs">
        <q-card-section>
          <div class="text-center q-pb-xs">
            <label class="text-dark message text-bold"
              >Are you sure you want to remove this role ?</label
            >
          </div>
          <div
            class="text-weight-medium text-center text-red"
            v-if="show_remove_role_dialog"
          >
            Role: <span class="q-pl-md">{{ role_deleted.name }}</span>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Cancel"
            color="primary"
            size="md"
            no-caps
            flat
            class="dialog_button"
            v-close-popup
          ></q-btn>
          <q-btn
            label="Remove"
            color="primary"
            class="dialog_button"
            @click="removeUserRole"
            no-caps
            flat
            v-close-popup
            size="md"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { LocalStorage } from "quasar";
import ButtonVue from "src/components/Button.vue";
import moment from "moment";
import organisationMixin from "src/mixins/organisationMixin.vue";
import memberMixin from "src/mixins/memberMixin.vue";
import roleMixin from "src/mixins/roleMixin.vue";

export default {
  mixins: [organisationMixin, memberMixin, roleMixin],

  mounted() {
    this.getUserRoles();
    this.getAllRoles();
    this.setFormField();
  },

  data() {
    return {
      user: {
        name: "",
        email: "",
        gender: "",
        address: "",
        occupation: "",
        user_id: "",
      },
      loading: false,
      edit_profile: false,
      show_role_dialog: false,
      role_deleted: null,
      no_caps: true,
      columns: [
        {
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
        },
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "is_complusory",
          align: "left",
          label: "Complusory",
          field: "is_complusory",
          sortable: true,
        },
        {
          name: "amount",
          align: "left",
          label: "Amount Payable (XAF)",
          field: "amount",
          sortable: true,
        },
        { name: "has_pay", label: "Action", field: "has_pay", align: "left" },
      ],
      data: [
        {
          counter: 1,
          name: "Frozen Yogurt",
          amount: 500,
          is_complusory: "YES",
          has_pay: false,
        },
        {
          counter: 2,
          name: "Frozen Yogurt",
          amount: 500,
          is_complusory: "YES",
          has_pay: false,
        },
        {
          counter: 3,
          name: "Frozen Yogurt",
          amount: 500,
          is_complusory: "YES",
          has_pay: false,
        },
        {
          counter: 4,
          name: "Frozen Yogurt",
          amount: 500,
          is_complusory: "YES",
          has_pay: false,
        },
        {
          counter: 5,
          name: "Frozen Yogurt",
          amount: 500,
          is_complusory: "YES",
          has_pay: false,
        },
        {
          counter: 6,
          name: "Frozen Yogurt",
          amount: 500,
          is_complusory: "YES",
          has_pay: false,
        },
      ],
      columns1: [
        {
          name: "counter",
          required: true,
          label: "S/N",
          align: "left",
          field: "counter",
        },
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "is_complusory",
          align: "left",
          label: "Complusory",
          field: "is_complusory",
          sortable: true,
        },
        {
          name: "amount_paid",
          align: "left",
          label: "Amount Paid (XAF)",
          field: "amount_paid",
          sortable: true,
        },
        {
          name: "balance",
          align: "left",
          label: "Balance (XAF)",
          field: "balance",
          sortable: true,
        },
        {
          name: "approve",
          label: "Transaction Status",
          field: "approve",
          align: "left",
        },
      ],
      data1: [
        {
          counter: 1,
          name: "Frozen Yogurt",
          amount: 500,
          is_complusory: "YES",
          balance: 0.0,
          amount_paid: 300.0,
          approve: "COMPLETED",
        },
        {
          counter: 2,
          name: "Frozen Yogurt",
          amount: 500,
          is_complusory: "YES",
          amount_paid: 300.0,
          balance: 0.0,
          approve: "COMPLETED",
        },
        {
          counter: 3,
          name: "Frozen Yogurt",
          amount: 500,
          amount_paid: 300.0,
          is_complusory: "YES",
          balance: 0.0,
          approve: "COMPLETED",
        },
        {
          counter: 4,
          name: "Frozen Yogurt",
          amount: 500,
          amount_paid: 300.0,
          is_complusory: "YES",
          balance: 0.0,
          approve: "COMPLETED",
        },
        {
          counter: 5,
          name: "Frozen Yogurt",
          amount: 500,
          amount_paid: 300.0,
          is_complusory: "YES",
          balance: 0.0,
          approve: "COMPLETED",
        },
        {
          counter: 6,
          name: "Frozen Yogurt",
          amount: 500,
          amount_paid: 300.0,
          is_complusory: "YES",
          balance: 0.0,
          approve: "COMPLETED",
        },
      ],
      total_amount_payable: 0.0,
      role: null,
      gender_options: ["MALE", "FEMALE", "OTHER"],
      user_roles: [],
      show_remove_role_dialog: false,
      is_fetching: false,
    };
  },
  computed: {
    getFormatedCreatedDate() {
      return moment(this.getCurrentMember.created_at).format("MMMM Do YYYY");
    },

    getFormatedUpdatedDate() {
      return moment(this.getCurrentMember.updated_at).format("MMMM Do YYYY");
    },
    validateForm() {
      return this.user.name == null ||
        this.user.telephone == null ||
        this.user.address == null ||
        this.user.address == null ||
        this.user.occupation == null ||
        this.user.gender == null
        ? true
        : false;
    },

    validateAddRole() {
      return this.role == null;
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getCurrentMember() {
      return this.$store.getters.getCurrentMember;
    },

    getAvailableRoles() {
      let roles = [];
      this.$store.getters.getRoles
        .filter(
          (role) =>
            role.name == "TREASURER" ||
            role.name == "FINANCIAL_SECRETARY" ||
            role.name == "AUDITOR"
        )
        .forEach((role) => {
          roles.push({
            label: role.name,
            value: role.name,
          });
        });
      let member_roles = this.user_roles.map((ele) => ele.name);

      roles = roles.filter((ele) => !member_roles.includes(ele.value));
      return roles;
    },

    canEditUserRole() {
      let has_president_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name === "PRESIDENT"
      );
      return has_president_role != undefined;
    },
  },
  methods: {
    formDateTime(date) {
      return moment(date).format("MMMM Do YYYY");
    },

    showRemoveRoleDialog(role) {
      this.role_deleted = role;
      this.show_remove_role_dialog = true;
    },
    setFormField() {
      if (this.$store.getters.getCurrentMember != null) {
        this.user.name = this.$store.getters.getCurrentMember.name;
        this.user.email = this.$store.getters.getCurrentMember.email;
        this.user.gender = this.$store.getters.getCurrentMember.gender;
        this.user.telephone = this.$store.getters.getCurrentMember.telephone;
        this.user.address = this.$store.getters.getCurrentMember.address;
        this.user.occupation = this.$store.getters.getCurrentMember.occupation;
        this.user.user_id = this.$store.getters.getCurrentMember.id;
      }

      return this.user;
    },
    onUpdateMember() {
      this.is_fetching = true;
      let payload = {
        url: `/api/protected/user/profile/update`,
        data: this.user,
        msg: "Profile Updated Successfully",
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
      };
      this.$store
        .dispatch("putRequest", payload)
        .then(() => {
          this.edit_profile = false;
          this.is_fetching = false;
          this.getMemberProfile(this.user.user_id);
        })
        .finally(() => {});
    },
    showEditProfile() {
      return (this.edit_profile = true);
    },
    showEditPassword() {
      return (this.edit_password = true);
    },
    openFileUpload() {
      document.getElementById("logo").click();
    },
    onFileChanged(e) {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      let organisation = this.$store.getters.getOrganisation;
      let fileCategory = "IMAGES";
      let APP_NAME = "FINANCIAL_ASSISTANT_APP";
      let upload_folder = "PROFILE_PICTURES";
      let directory = `${APP_NAME}/${organisation.name}/${upload_folder}`;
      let payload = {
        url: `/api/v1/protected/upload-file?directory=${directory}&fileCategory=${fileCategory}`,
        data: formData,
        status: "none",
        show_feedback: false,
        msg: "Picture uploaded successfully",
        color: "default",
        error_msg: "default",
        commit: "none",
        has_commit: false,
      };
      this.$store.dispatch("uploadImageRequest", payload).then(() => {
        let get_file_payload = {
          url: `/api/v1/protected/file?directory=${directory}&fileCategory=${fileCategory}&fileName=${e.target.files[0].name}`,
          data: formData,
          show_feedback: false,
        };
        this.$store
          .dispatch("fetchUploadedImageRequest", get_file_payload)
          .then((res) => {
            let user = this.$store.getters.getCurrentMember;
            let data = {
              name: user.name,
              email: user.email,
              gender: user.gender,
              address: user.address,
              occupation: user.occupation,
              picture: res.data.fileDownloadUri,
            };
            let update_user = {
              url: `/api/protected/users/${user.id}`,
              data: data,
              status: "none",
              show_feedback: false,
            };
            this.$store.dispatch("putRequest", update_user).then(() => {
              this.getMemberProfile(user.id);
            });
          });
      });
    },

    computeTotal(data) {
      if (data.has_paid) {
        this.total_amount_payable += data.amount;
      }
    },

    showAddRole() {
      this.show_role_dialog = true;
    },

    onAddRole() {
      let user_id = this.getCurrentMember.id;
      let payload = {
        url: `/api/protected/roles`,
        msg: "Role added successfully",
        data: { user_id: user_id, role: this.role.value },
        color: "default",
        to_on_ok: "none",
        show_feedback: true,
        status: "none",
        to_on_fail: "none",
        error_msg:
          "Only one member of your organisation is allowed to have this Role",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading = true;
      this.$store.dispatch("postRequest", payload).then(() => {
        this.loading = false;
        this.role = null;
        this.getUserRoles(user_id);
        this.show_role_dialog = false;
      });
    },

    getUserRoles() {
      let id = this.$route.params.id;
      let payload = {
        url: `/api/protected/roles/users/${id}`,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        status: "none",
        to_on_fail: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        show_feedback: false,
        show_spinner: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          this.user_roles = res.data;
        })
        .finally(() => {});
    },

    removeUserRole() {
      let id = this.$route.params.id;
      let payload = {
        url: `/api/protected/roles/users/${id}?role=${this.role_deleted.name}`,
        msg: "Role removed successfully",
        color: "default",
        to_on_ok: "none",
        status: "success",
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
      };
      this.$store.dispatch("deleteRequest", payload).then(() => {
        this.getUserRoles(id);
      });
    },
  },
  components: {
    ButtonVue,
  },
};
</script>

<style lang="scss" scoped>
.icon {
  color: $grey1;
  cursor: pointer;
}

.edit_icon {
  cursor: pointer;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.gender {
  padding-left: 3rem;
}

.name {
  padding-left: 3.4rem;
}

.has_register {
  color: $white1;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
  background-color: $secondary;
}

.pending_reg {
  color: $white1;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
  background-color: $info;
}
.title {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
}

.contribution_item_header {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 24px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
}

.make_payment {
  color: $white1;
  background-color: $tertiary;
}
.not_register {
  color: $white1;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
  background-color: $warning;
}

.person_icon {
  font-size: 1.4rem;
}

.email {
  padding-left: 3.5rem;
}

.camara {
  position: absolute;
  top: 19%;
  left: 21%;
  cursor: pointer;
  color: $grey8;
}

.phone {
  padding-left: 2rem;
}

.address {
  padding-left: 2.6rem;
}

.occupation {
  padding-left: 1.4rem;
}

.date {
  padding-left: 1rem;
}

.label {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $grey5;
}

.role_name {
  font-size: smaller;
}
.info {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $primary;
}

.security {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: red;
}

.password {
  padding-left: 2rem;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 27px;
  letter-spacing: 0.005em;
  color: $dark;
}
</style>
