<template>
  <div class="q-px-md">
    <div class="row">
      <div class="col-md-12 col-xs-12 col-sm-12 col-lg-12">
        <!-- spinners -->
        <div class="flex justify-center">
          <q-spinner-ios
            color="primary"
            size="2em"
            class="q-mb-md"
            v-if="getLoadingState"
          />
        </div>
        <q-tabs
          v-model="tab"
          dense
          class="text-primary bg-grey-2"
          active-color="white"
          indicator-color="primary"
          align="justify"
          narrow-indicator
          inline-label
          shadow-2
          active-class="active_tab"
        >
          <q-tab name="profile" label="Profile" class="tab" icon="person" />
          <q-tab
            name="contributions"
            label="Contributions"
            class="tab"
            icon="payments"
          />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="profile">
            <div class="q-pt-md" v-if="!getLoadingState">
              <q-card class="my-card" flat>
                <div class="row">
                  <div class="col-md-4 col-sm-12 col-xs-12">
                    <q-card-section>
                      <div class="text-center">
                        <q-avatar size="190px">
                          <q-icon
                            name="account_circle"
                            size="190px"
                            class="icon"
                            v-if="
                              getCurrentMember != null &&
                              getCurrentMember.picture == null
                            "
                          >
                          </q-icon>
                          <img
                            :src="getCurrentMember.picture"
                            alt="User picture"
                            v-if="
                              getCurrentMember != null &&
                              getCurrentMember.picture != null
                            "
                          />
                        </q-avatar>
                        <div class="camara">
                          <input
                            type="file"
                            accept="image/x-png,image/jpg,image/jpeg"
                            style="display: none"
                            id="logo"
                            @change="onFileChanged"
                          />
                          <q-icon
                            name="add_a_photo"
                            size="sm"
                            @click="openFileUpload"
                          >
                            <q-tooltip>Upload Picture</q-tooltip>
                          </q-icon>
                        </div>
                      </div>
                      <!-- member roles -->
                      <div class="flex q-mt-md q-px-md">
                        <div>
                          <label for="role" class="role_heading"
                            ><span
                              ><q-icon
                                name="military_tech"
                                class="role_icon"
                              ></q-icon></span
                            >My Roles:
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
                      <div class="q-mt-md">
                        <q-list>
                          <q-item
                            v-for="(role, index) in fetchUserRoles"
                            :key="index"
                            class="q-mb-md"
                          >
                            <q-item-section avatar v-if="role.name == 'MEMBER'">
                              <q-avatar
                                color="primary"
                                text-color="white"
                                size="35px"
                              >
                                M</q-avatar
                              >
                            </q-item-section>
                            <q-item-section
                              avatar
                              v-if="role.name == 'PRESIDENT'"
                            >
                              <q-avatar
                                color="primary"
                                text-color="white"
                                size="35px"
                              >
                                PP
                              </q-avatar>
                            </q-item-section>
                            <q-item-section
                              avatar
                              v-if="role.name == 'FINANCIAL_SECRETARY'"
                            >
                              <q-avatar
                                color="primary"
                                text-color="white"
                                size="35px"
                              >
                                FS
                              </q-avatar>
                            </q-item-section>
                            <q-item-section
                              avatar
                              v-if="role.name == 'TREASURER'"
                            >
                              <q-avatar
                                color="primary"
                                text-color="white"
                                size="35px"
                              >
                                TR
                              </q-avatar>
                            </q-item-section>
                            <q-item-section
                              avatar
                              v-if="role.name == 'AUDITOR'"
                            >
                              <q-avatar
                                color="primary"
                                text-color="white"
                                size="35px"
                              >
                                AU
                              </q-avatar>
                            </q-item-section>
                            <q-item-section>
                              <q-item-label class="role_name">{{
                                role.name
                              }}</q-item-label>
                              <q-item-label
                                caption
                                class="text-sm role_update_date"
                                >Updated by:
                                <span>
                                  {{ role.updated_by }}</span
                                ></q-item-label
                              >
                            </q-item-section>

                            <q-item-section side top>
                              <q-item-label caption class="role_update_date">
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
                                <q-icon
                                  name="delete"
                                  color="negative"
                                  size="xs"
                                >
                                  <q-tooltip>Remove Role</q-tooltip>
                                </q-icon>
                              </q-btn>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </q-card-section>
                  </div>
                  <div class="col-md-2 col-sm-12 col-xs-12"></div>
                  <div class="col-md-6 col-sm-12 col-xs-12">
                    <q-card-section>
                      <!-- personal infomation -->
                      <div class="q-pa-sm" v-if="!edit_profile">
                        <div class="row">
                          <div class="q-pb-md">
                            <label for="info" class="personal_info"
                              >Personal information</label
                            >
                          </div>
                          <q-space />
                          <div class="flex justify-end">
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
                        <div class="flex q-pb-md">
                          <label for="name" class="label"
                            ><span
                              ><q-icon
                                name="person"
                                class="q-pr-xs person_icon"
                              ></q-icon
                            ></span>
                            Name:
                            <span class="value q-pl-xl value_code">{{
                              getCurrentMember.name
                            }}</span></label
                          >
                        </div>
                        <div class="flex q-pb-md">
                          <label for="name" class="label"
                            ><span
                              ><q-icon
                                name="female"
                                v-if="getCurrentMember.gender == 'FEMALE'"
                                class="q-pr-xs gender_icon"
                              ></q-icon
                            ></span>
                            <span
                              ><q-icon
                                name="male"
                                v-if="getCurrentMember.gender == 'MALE'"
                                class="q-pr-xs gender_icon"
                              ></q-icon
                            ></span>
                            <span class="q-pr-xs"></span>
                            Gender:
                            <span class="value value_code gender">{{
                              getCurrentMember.gender
                            }}</span>
                            <span
                              class="value value_code q-pl-lg"
                              v-if="getCurrentMember.gender == null"
                              >Not Set</span
                            >
                          </label>
                        </div>
                        <div class="flex q-pb-lg">
                          <label for="name" class="label"
                            ><span
                              ><q-icon
                                name="email"
                                size="xs"
                                class="q-pr-sm"
                              ></q-icon></span
                            >Email:
                            <span class="value value_code email">{{
                              getCurrentMember.email
                            }}</span></label
                          >
                        </div>
                        <div class="flex q-pb-lg">
                          <label for="name" class="label"
                            ><span
                              ><q-icon
                                name="phone"
                                size="xs"
                                class="q-pr-xs"
                              ></q-icon></span
                            >Telephone:
                            <span class="value phone value_code">{{
                              getCurrentMember.telephone
                            }}</span></label
                          >
                        </div>
                        <div class="flex q-pb-lg">
                          <label for="name" class="label"
                            ><span
                              ><q-icon
                                name="location_on"
                                size="xs"
                                class="q-pr-xs"
                              ></q-icon
                            ></span>
                            Address:
                            <span class="value address value_code">{{
                              getCurrentMember.address
                            }}</span></label
                          >
                        </div>
                        <div class="flex q-pb-lg">
                          <label for="name" class="label"
                            ><span
                              ><q-icon
                                name="work"
                                size="xs"
                                class="q-pr-xs"
                              ></q-icon
                            ></span>
                            Occupation:
                            <span class="value occupation value_code">{{
                              getCurrentMember.occupation
                            }}</span></label
                          >
                        </div>
                        <div class="flex q-pb-lg">
                          <label for="name" class="label"
                            ><span
                              ><q-icon
                                name="verified_user"
                                size="xs"
                                class="q-pr-xs"
                              ></q-icon></span
                            >Created Date:
                            <span class="value date value_code">{{
                              getFormatedCreatedDate
                            }}</span></label
                          >
                        </div>
                        <div class="flex q-pb-lg">
                          <label for="name" class="label"
                            ><span
                              ><q-icon
                                name="verified_user"
                                size="xs"
                                class="q-pr-xs"
                              ></q-icon></span
                            >Updated Date:
                            <span class="value date value_code">{{
                              getFormatedUpdatedDate
                            }}</span></label
                          >
                        </div>
                        <div>
                          <div
                            class="not_register q-pa-sm"
                            v-if="
                              getCurrentMember.has_register ==
                                'NOT_REGISTERED' && !getCurrentMember.has_paid
                            "
                          >
                            <label for="not_register"
                              >Member has not Completed Registration for the Year: {{ getCurrentYear.year }}</label
                            >
                          </div>
                          <div
                            class="q-mt-md has_register q-pa-sm"
                            v-if="getCurrentMember.has_register == 'REGISTERED'"
                          >
                            <label for="register"
                              >Member has Completed Registration for the Year: {{ getCurrentYear }}</label
                            >
                          </div>
                          <div
                            class="q-mt-md pending_reg q-pa-sm"
                            v-if="
                              getCurrentMember.has_paid &&
                              getCurrentMember.approve == 'PENDING'
                            "
                          >
                            <label for="pending"
                              >Member's Registration is awaiting Approval</label
                            >
                          </div>
                        </div>
                      </div>

                      <!-- edit personal information -->
                      <div class="q-pa-sm q-mb-lg" v-if="edit_profile">
                        <q-form @submit="onUpdateMember" class="q-gutter-md">
                          <div class="update_profile q-pb-md">
                            Update Profile
                          </div>
                          <small class="hint"
                            >All fields with <span class="text-red">*</span> are
                            required</small
                          >
                          <div>
                            <label for="credential" class="form_field"
                              >Name <span class="text-red">*</span></label
                            >
                            <q-input
                              v-model="user.name"
                              outlined
                              dense
                              type="text"
                            />
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
                            />
                          </div>
                          <div>
                            <label for="credential" class="form_field"
                              >Email</label
                            >
                            <q-input
                              v-model="user.email"
                              outlined
                              dense
                              type="email"
                            />
                          </div>
                          <div>
                            <label for="credential" class="form_field"
                              >Address <span class="text-red">*</span></label
                            >
                            <q-input
                              v-model="user.address"
                              outlined
                              dense
                              type="text"
                            />
                          </div>
                          <div>
                            <label for="credential" class="form_field"
                              >Occupation <span class="text-red">*</span></label
                            >
                            <q-input
                              v-model="user.occupation"
                              outlined
                              dense
                              type="text"
                            />
                          </div>
                          <div class="row justify-end">
                            <q-btn
                              class="q-mr-lg"
                              label="Cancel"
                              color="primary"
                              no-caps
                              outline
                              @click="edit_profile = false"
                            >
                            </q-btn>
                            <ButtonVue
                              label="Save"
                              :loading="loading"
                              color="primary"
                              :disabled="validateForm"
                              :no_caps="no_caps"
                            >
                            </ButtonVue>
                          </div>
                        </q-form>
                      </div>
                    </q-card-section>
                  </div>
                </div>
              </q-card>
            </div>
          </q-tab-panel>

          <q-tab-panel name="contributions">
            <div class="text-h6">Member's Contributions</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <!-------------------------------------------ADD ROLE DIALOG------------------------------>
    <q-dialog v-model="show_add_role_dialog">
      <q-card style="min-width: 400px" class="q-pa-xs">
        <q-card-section class="row items-center q-pb-md">
          <div class="text-h6 add_role_title">Add Member Role</div>
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
    <!-------------------------------------------END OF ADD ROLE DIALOG----------------------->

    <!-------------------------------------------REMOVE ROLE DIALOG--------------------------->
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
    <!-------------------------------------------END OF REMOVE ROLE DIALOG-------------------->
  </div>
</template>

<script>
import { LocalStorage } from "quasar";
import ButtonVue from "src/components/Button.vue";
import moment from "moment";
import organisationMixin from "src/mixins/organisationMixin.vue";
import memberMixin from "src/mixins/memberMixin.vue";
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";

export default {
  mixins: [organisationMixin, memberMixin, CurrentYearMixinVue],

  mounted() {
    this.getMembersDebts(false);
    this.getMembersContributions(false);
    // this.setFormField();
    this.getUserRoles(this.$route.params.id);
  },

  data() {
    return {
      tab: "profile",
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
      show_add_role_dialog: false,
      role_deleted: null,
      show_payment_dialog: false,
      no_caps: true,
      selected_items: [],
      loading_payment: false,
      member_registration: "Member's Registration",
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
          name: "balance",
          align: "left",
          label: "Amount Payable (XAF)",
          field: "balance",
          sortable: true,
        },
        {
          name: "frequency",
          align: "left",
          label: "Frequency",
          field: "frequency",
          sortable: true,
        },
        {
          name: "month_name",
          align: "left",
          label: "Month",
          field: "month_name",
          sortable: true,
        },
        {
          name: "quarterly_name",
          align: "left",
          label: "Quarter",
          field: "quarterly_name",
          sortable: true,
        },
        {
          name: "year",
          align: "left",
          label: "Year",
          field: "year",
          sortable: true,
        },
        { name: "has_pay", label: "Action", field: "has_pay", align: "left" },
      ],
      data: [],
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
          name: "amount",
          align: "left",
          label: "Amount Paid (XAF)",
          field: "amount",
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
          name: "payment_status",
          label: "Payment Status",
          field: "payment_status",
          align: "left",
        },
        {
          name: "approve",
          label: "Transaction Status",
          field: "approve",
          align: "left",
        },
        {
          name: "created_at",
          label: "Payment Date",
          field: "created_at",
          align: "left",
        },
      ],
      data1: [],
      total_amount_payable: 0,
      role: null,
      gender_options: ["MALE", "FEMALE", "OTHER"],
      user_roles: [],
      show_remove_role_dialog: false,
      is_fetching: false,
      current_year: this.getCurrentYear != null ? this.getCurrentYear.id : "",
      due_amount: 0.0,
      amount_paid: 0.0,
      available_roles: [],
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

    validatePayment() {
      return this.total_amount_payable > 0 ? false : true;
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
      this.available_roles
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

    fetchUserRoles() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.user_roles = [];
      this.$store.getters.getRoles.forEach((ele) => {
        this.user_roles.push(ele);
      });
      return this.user_roles;
    },

    getFormField() {
      return this.setFormField(this.$store.getters.getCurrentMember);
    },
  },
  watch: {
    getFormField() {
      return this.setFormField(this.$store.getters.getCurrentMember);
    },
  },
  methods: {
    getFormatedDate(created_at) {
      return moment(created_at).format("MMMM Do YYYY");
    },

    showPaymentDialog() {
      this.show_payment_dialog = true;
    },

    formDateTime(date) {
      return moment(date).format("MMMM Do YYYY");
    },

    showRemoveRoleDialog(role) {
      this.role_deleted = role;
      this.show_remove_role_dialog = true;
    },

    setFormField(data) {
      if (data != null) {
        this.user.name = data.name;
        this.user.email = data.email;
        this.user.gender = data.gender;
        this.user.telephone = data.telephone;
        this.user.address = data.address;
        this.user.occupation = data.occupation;
        this.user.user_id = data.id;
      }

      return this.user;
    },

    onUpdateMember() {
      this.loading = true;
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
          this.loading = false;
          this.getMemberProfile(this.user.user_id);
        })
        .finally(() => {});
    },

    showEditProfile() {
      this.setFormField();
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
              this.user_roles = [];
            });
          });
      });
    },

    computeTotal(data, evt) {
      if (evt) {
        this.total_amount_payable += data.balance;
        this.total_amount_payable = parseFloat(this.total_amount_payable);
        this.selected_items.push(data);
      } else {
        this.total_amount_payable -= data.balance;
        this.total_amount_payable = parseFloat(this.total_amount_payable);
        this.selected_items = this.selected_items.filter(
          (ele) => ele.id != data.id
        );
      }
      return this.total_amount_payable;
    },

    showAddRole() {
      this.getAllRoles();
      this.show_add_role_dialog = true;
    },

    getAllRoles() {
      this.available_roles = [];
      let payload = {
        url: `/api/protected/roles`,
        msg: "none",
        color: "default",
        status: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit: false,
        show_spinner: false,
        commit: "",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then((res) => {
        res.data.forEach((ele) => {
          this.available_roles.push(ele);
        });
      });
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
        this.show_add_role_dialog = false;
        this.getUserRoles(user_id);
      });
    },

    getUserRoles(id) {
      this.user_roles = [];
      let payload = {
        url: `/api/protected/roles/users/${id}`,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        status: "none",
        to_on_fail: "none",
        error_msg: "An Error occurred! Please try again",
        has_commit: true,
        show_feedback: false,
        show_spinner: false,
        commit: "SET_ROLES",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("getRequest", payload).then(() => {});
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
        this.user_roles = [];
        this.getUserRoles(id);
      });
    },

    onConfirmPayment() {
      this.loading_payment = true;
      let payload = {
        data: this.buildPayloadData(),
        url: `/api/protected/contributions/bulk-payments`,
        msg: "Payment made successfully",
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
      this.$store.dispatch("postRequest", payload).then(() => {
        this.loading_payment = false;
        this.show_payment_dialog = false;
        this.data = [];
        this.data1 = [];
        this.selected_items = [];
        this.total_amount_payable = 0;
        this.getMembersDebts(true);
        this.getMembersContributions(true);
        this.getMemberProfile(this.$store.getters.getCurrentMember.id);
      });
    },

    buildPayloadData() {
      let data = [];
      this.selected_items.forEach((ele) => {
        if (ele.code != "REGISTRATION") {
          data.push({
            user_id: this.$store.getters.getCurrentMember.id,
            payment_item_id: ele.id,
            amount_deposited: parseInt(ele.balance),
            is_compulsory: ele.is_compulsory,
            code: ele.code,
            year: this.getCurrentYear.id,
            comment: "BULK PAYMENT",
            quarterly_name: ele.quarterly_name,
            month_name: ele.month_name,
            registration_id: ele.id,
          });
        } else {
          data.push({
            user_id: this.$store.getters.getCurrentMember.id,
            payment_item_id: ele.id,
            amount_deposited: parseInt(ele.balance),
            is_compulsory: ele.is_compulsory,
            code: ele.code,
            year: ele.session.id,
            comment: "BULK PAYMENT",
            quarterly_name: ele.quarterly_name,
            month_name: ele.month_name,
            registration_id: ele.id,
          });
        }
      });
      return data;
    },

    getMembersDebts(show_spinner) {
      this.due_amount = 0.0;
      let id = this.$route.params.id;
      let current_year = this.getCurrentYear.id;
      let payload = {
        data: "none",
        url: `/api/protected/contributions/members/debts?user_id=${id}&session_id=${current_year}`,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        status: "success",
        to_on_fail: "none",
        show_feedback: false,
        show_spinner: show_spinner,
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
        if (res != undefined && res.data.length > 0) {
          res.data.forEach((ele) => {
            this.due_amount += ele.balance;
            this.data.push({
              counter: res.data.indexOf(ele) + 1,
              name: ele.name,
              is_compulsory: ele.is_compulsory,
              balance: ele.balance,
              type: ele.type,
              has_pay: ele.has_pay,
              id: ele.id,
              code: ele.code,
              frequency: ele.frequency,
              item_amount: ele.item_amount,
              month_name: ele.month_name,
              quarterly_name: ele.quarterly_name,
              session: ele.session,
            });
          });
        }
      });
    },

    getMembersContributions(show_spinner) {
      this.amount_paid = 0.0;
      let id = this.$route.params.id;
      let current_year = this.getCurrentYear.id;
      let payload = {
        data: "none",
        url: `/api/protected/contributions/members/paid?user_id=${id}&session_id=${current_year}`,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        status: "success",
        to_on_fail: "none",
        show_feedback: false,
        show_spinner: show_spinner,
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
        if (res != undefined) {
          res.data.forEach((ele) => {
            this.amount_paid += ele.amount;
            this.data1.push({
              counter: res.data.indexOf(ele) + 1,
              payment_item_id: ele.payment_item_id,
              payment_item_amount: ele.payment_item_amount,
              name: ele.name,
              amount: ele.amount,
              balance: ele.balance,
              payment_status: ele.payment_status,
              approve: ele.approve,
              created_at: this.getFormatedDate(ele.created_at),
              id: ele.id,
              year: ele.year,
            });
          });
        }
      });
    },
  },
  components: {
    ButtonVue,
  },
};
</script>

<style lang="scss" scoped>
.tab {
  height: 50px;
}

.active_tab {
  background-color: $primary;
}

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
  font-weight: 500;
  font-size: 13px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey8;
}

.gender {
  padding-left: 2.5rem;
}

.text_h6 {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
}

.person_icon {
  font-size: 1.4rem;
}
.role_icon {
  font-size: 1.4rem;
}

.gender_icon {
  font-size: 1.4rem;
}

.email {
  padding-left: 3.5rem;
}

.camara {
  position: relative;
  left: 10%;
  top: -25px;
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
  font-size: 14px;
  line-height: 11px;
  letter-spacing: 0.01em;
}

.personal_info {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $primary;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 27px;
  letter-spacing: 0.005em;
  color: $dark;
}

.update_profile {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $primary;
}

.hint {
  font-size: small;
}

.role_heading {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $primary;
}

.role_name {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 12.5px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $grey8;
}

.role_update_date {
  font-weight: 500;
}

.add_role_title {
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
</style>
