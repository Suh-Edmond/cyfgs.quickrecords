<template>
  <div>
    <div class="row">
      <div class="col-md col-12">
        <!-------------------------------------------LOADING INDICATOR------------------------------------------------->
        <div class="flex justify-center q-mb-md" v-if="is_fetching">
          <q-spinner color="primary" size="2.5em" />
        </div>
        <!-------------------------------------------END OF LOADING INDICATOR------------------------------------------>
        <q-tabs
          v-model="tab"
          dense
          class="text-primary"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
          inline-label
          shadow-2
        >
          <q-tab
            name="profile"
            :label="$t('app.profileLabel')"
            class="tab"
            icon="person"
          />
          <q-tab
            name="contributions"
            :label="$t('app.contributionName')"
            class="tab"
            icon="payments"
            v-if="!checkTreasurerRoleOnly()"
          />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <!-------------------------------------------MEMBER PROFILE TAB PENEL----------------------------------------->
          <q-tab-panel name="profile">
            <q-card flat v-if="!is_fetching">
              <div class="row">
                <div class="col-md-4 col-sm-12 col-xs-12">
                  <div class="text-center">
                    <q-avatar
                      size="150px"
                      v-if="
                        getCurrentMember.picture != '' &&
                        getCurrentMember.picture != null &&
                        getCurrentMember.picture != 'undefined'
                      "
                    >
                      <img
                        :src="getProfilePicture"
                        :alt="$t('app.profilePicAlt')"
                      />
                    </q-avatar>
                    <q-avatar
                      size="150px"
                      font-size="52px"
                      color="grey-3"
                      v-if="
                        getCurrentMember.picture === '' ||
                        getCurrentMember.picture == null ||
                        getCurrentMember.picture == 'undefined'
                      "
                    >
                    </q-avatar>
                    <div class="camara" v-if="!checkTreasurerRoleOnly()">
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
                        <q-tooltip>{{ $t("app.uploadPicture") }}</q-tooltip>
                      </q-icon>
                    </div>
                  </div>
                  <!-- member roles -->
                  <div class="flex q-px-md q-pb-md">
                    <label for="role" class="role_heading"
                      ><span
                        ><q-icon
                          name="military_tech"
                          class="role_icon"
                        ></q-icon></span
                      >{{ $t("app.rolesName") }}
                    </label>
                    <q-space />

                    <label for="role" class="role_heading"
                      ><q-icon
                        name="add"
                        class="role_icon q-mr-md"
                        @click="showAddRole"
                        v-if="canEditUserRole"
                        size="xs"
                      ></q-icon>

                      <q-tooltip> {{ $t("app.addRoleLabel") }} </q-tooltip>
                    </label>
                  </div>
                  <q-list>
                    <q-item
                      v-for="(role, index) in user_roles"
                      :key="index"
                      class="q-mb-md"
                    >
                      <q-item-section avatar v-if="role.name == 'MEMBER'">
                        <q-avatar color="primary" text-color="white" size="md">
                          M</q-avatar
                        >
                      </q-item-section>
                      <q-item-section avatar v-if="role.name == 'ADMIN'">
                        <q-avatar color="primary" text-color="white" size="md">
                          AD
                        </q-avatar>
                      </q-item-section>
                      <q-item-section avatar v-if="role.name == 'PRESIDENT'">
                        <q-avatar color="primary" text-color="white" size="md">
                          PP
                        </q-avatar>
                      </q-item-section>
                      <q-item-section
                        avatar
                        v-if="role.name == 'FINANCIAL_SECRETARY'"
                      >
                        <q-avatar color="primary" text-color="white" size="md">
                          FS
                        </q-avatar>
                      </q-item-section>
                      <q-item-section avatar v-if="role.name == 'TREASURER'">
                        <q-avatar color="primary" text-color="white" size="md">
                          TR
                        </q-avatar>
                      </q-item-section>
                      <q-item-section avatar v-if="role.name == 'AUDITOR'">
                        <q-avatar color="primary" text-color="white" size="md">
                          AU
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="role_name">{{
                          formatConstants(role.name)
                        }}</q-item-label>
                        <q-item-label caption class="text-sm role_update_date"
                          >{{ $t("app.updatedBy") }}:
                          <span> {{ role.updated_by }}</span></q-item-label
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
                          v-if="
                            role.name !== 'MEMBER' &&
                            role.name !== 'ADMIN' &&
                            canEditUserRole
                          "
                        >
                          <q-icon name="delete" color="negative" size="xs">
                            <q-tooltip>{{ $t("app.removeRole") }}</q-tooltip>
                          </q-icon>
                        </q-btn>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <div class="col-md-2 col-sm-12 col-xs-12"></div>
                <div class="col-md-6 col-sm-12 col-xs-12">
                  <!----------------------------------------MEMBER  PROFILE DETAILS------------------------------------->
                  <div v-if="!edit_profile">
                    <div class="row">
                      <div class="q-pb-lg">
                        <label for="info" class="personal_info">{{
                          $t("app.personalInformationLabel")
                        }}</label>
                      </div>
                      <q-space />
                      <div class="flex justify-end">
                        <q-icon
                          name="edit"
                          size="xs"
                          color="primary"
                          class="edit_icon"
                          @click="showEditProfile"
                          v-if="!checkTreasurerRoleOnly()"
                        >
                          <q-tooltip>{{ $t("app.editProfile") }}</q-tooltip>
                        </q-icon>
                      </div>
                    </div>
                    <div class="flex q-pb-md">
                      <label for="name" class="label"
                        ><q-icon name="person" class="person_icon"></q-icon>
                        {{ $t("app.nameLabel") }} </label
                      ><q-space />
                      <label class="value">{{ getCurrentMember.name }}</label>
                    </div>
                    <div class="flex q-pb-md">
                      <label for="name" class="label"
                        ><q-icon
                          name="female"
                          v-if="getCurrentMember.gender == 'FEMALE'"
                          class="person_icon"
                        ></q-icon>
                        <q-icon
                          name="male"
                          v-if="getCurrentMember.gender == 'MALE'"
                          class="person_icon"
                        ></q-icon>
                        {{ $t("app.gender") }}
                      </label>
                      <q-space />

                      <label
                        class="value"
                        v-if="getCurrentMember.gender != null"
                        >{{ getCurrentMember.gender }}</label
                      >
                      <label
                        class="value"
                        v-if="getCurrentMember.gender == null"
                        >{{ $t("app.notSet") }}</label
                      >
                    </div>
                    <div class="flex q-pb-md">
                      <label for="name" class="label"
                        ><q-icon name="email" class="person_icon"></q-icon
                        >{{ $t("app.emailLabel") }}
                      </label>
                      <q-space />
                      <label class="value">{{ getCurrentMember.email }}</label>
                    </div>
                    <div class="flex q-pb-md">
                      <label for="name" class="label"
                        ><q-icon name="phone" class="person_icon"></q-icon
                        >{{ $t("app.telephoneLabel") }}
                      </label>
                      <q-space />
                      <label class="value">{{
                        getCurrentMember.telephone
                      }}</label>
                    </div>
                    <div class="flex q-pb-md">
                      <label for="name" class="label"
                        ><q-icon
                          name="location_on"
                          size="xs"
                          class="person_icon"
                        ></q-icon>
                        {{ $t("app.addressLabel") }}
                      </label>
                      <q-space />
                      <label class="value">{{
                        getCurrentMember.address
                      }}</label>
                    </div>
                    <div class="flex q-pb-md">
                      <label for="name" class="label"
                        ><q-icon name="work" class="person_icon"></q-icon>
                        {{ $t("app.occupation") }}:
                      </label>
                      <q-space />
                      <label class="value">{{
                        getCurrentMember.occupation
                      }}</label>
                    </div>
                    <div class="flex q-pb-md">
                      <label for="name" class="label"
                        ><q-icon
                          name="verified_user"
                          class="person_icon"
                        ></q-icon
                        >{{ $t("app.createdDate") }}
                      </label>
                      <q-space />
                      <label class="value">{{ getFormatedCreatedDate }}</label>
                    </div>
                    <div class="flex q-pb-md">
                      <label for="name" class="label"
                        ><q-icon
                          name="verified_user"
                          class="person_icon"
                        ></q-icon
                        >{{ $t("app.updatedDate") }}
                      </label>
                      <q-space />
                      <label class="value">{{ getFormatedUpdatedDate }}</label>
                    </div>
                    <div class="flex q-pb-md">
                      <label for="name" class="label"
                        ><q-icon
                          name="hourglass_top"
                          class="person_icon"
                        ></q-icon
                        >{{ $t("app.status") }}
                      </label>
                      <q-space />
                      <label
                        :class="
                          getCurrentMember.status == 'ACTIVE'
                            ? 'active_text_color'
                            : 'in_active_text_color'
                        "
                        >{{ getCurrentMember.status }}</label
                      >
                    </div>
                  </div>
                  <!----------------------------------------------END OF MEMBER PROFILE------------------------------------------>

                  <!-----------------------------------------EDIT MEMBER PROFILE FORM------------------------------------------>
                  <div class="q-pa-sm" v-if="edit_profile">
                    <q-form @submit="onUpdateMember" class="q-gutter-md">
                      <div class="personal_info q-pb-md">
                        {{ $t("app.editProfile") }}
                      </div>
                      <small class="hint"
                        >{{ $t("app.warningField")
                        }}<span class="text-red">*</span>
                        {{ $t("app.fields") }}</small
                      >
                      <div>
                        <label for="credential" class="form_field"
                          >{{ $t("app.nameLabel") }}
                          <span class="text-red">*</span></label
                        >
                        <q-input
                          v-model="user.name"
                          outlined
                          dense
                          type="text"
                          hide-bottom-space
                        />
                      </div>
                      <div>
                        <label for="credential" class="form_field"
                          >{{ $t("app.gender") }}
                          <span class="text-red">*</span></label
                        >
                        <q-select
                          v-model="user.gender"
                          outlined
                          dense
                          :options="gender_options"
                          hide-bottom-space
                        />
                      </div>
                      <div>
                        <label for="credential" class="form_field"
                          >{{ $t("app.emailLabel") }}
                          <span class="text-red">*</span></label
                        >
                        <q-input
                          v-model="user.email"
                          outlined
                          dense
                          type="email"
                          disable
                          hide-bottom-space
                        />
                      </div>
                      <div>
                        <label for="credential" class="form_field"
                          >{{ $t("app.telephoneLabel") }}
                        </label>
                        <vue-tel-input
                          v-model="user.telephone"
                          defaultCountry="cm"
                          mode="international"
                          hide-bottom-space
                        ></vue-tel-input>
                      </div>
                      <div>
                        <label for="credential" class="form_field"
                          >{{ $t("app.addressLabel") }}
                          <span class="text-red">*</span></label
                        >
                        <q-input
                          v-model="user.address"
                          outlined
                          dense
                          type="text"
                          hide-bottom-space
                        />
                      </div>
                      <div>
                        <label for="credential" class="form_field"
                          >{{ $t("app.occupation") }}
                          <span class="text-red">*</span></label
                        >
                        <q-input
                          v-model="user.occupation"
                          outlined
                          dense
                          type="text"
                          hide-bottom-space
                        />
                      </div>
                      <div>
                        <label for="credential" class="form_field"
                          >{{ $t("app.status") }}
                          <span class="text-red">*</span></label
                        >
                        <q-select
                          v-model="user.status"
                          outlined
                          dense
                          type="text"
                          :options="status_options"
                          hide-bottom-space
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
                          :label="$t('app.saveBtnLabel')"
                          :loading="loading"
                          color="primary"
                          :disabled="validateForm"
                          :no_caps="no_caps"
                        >
                        </ButtonVue>
                      </div>
                    </q-form>
                  </div>
                  <!------------------------------------------END OF EDIT MEMBER PROFILE FORM---------------------------------->

                  <!---------------------------------------------START OF ALERT OF MEMBER'S REGISTRATION STATUS------------------>
                  <div
                    class="q-mb-xl"
                    v-if="
                      getCurrentMember.has_register == 'NOT_REGISTERED' &&
                      !getCurrentMember.has_paid &&
                      !edit_profile
                    "
                  >
                    <span>
                      <q-icon
                        name="info"
                        color="warning"
                        size="sm"
                        class="q-mr-sm"
                      ></q-icon>
                    </span>
                    <label
                      for="not_register"
                      class="text-bold text-warning registration_status_msg"
                      >{{ $t("app.notCompletedRegistration") }}:
                      {{ getCurrentYear.year }}</label
                    >
                  </div>
                  <div
                    class="q-mb-xl"
                    v-if="
                      getCurrentMember.has_register == 'REGISTERED' &&
                      !edit_profile
                    "
                  >
                    <span>
                      <q-icon
                        name="info"
                        color="secondary"
                        size="sm"
                        class="q-mr-sm"
                      ></q-icon>
                    </span>
                    <label
                      for="register"
                      class="text-bold text-secondary registration_status_msg"
                      >{{ $t("app.hasCompletedRegistration") }}:
                      {{ getCurrentYear.year }}</label
                    >
                  </div>
                  <div
                    class="q-mb-xl"
                    v-if="
                      getCurrentMember.has_paid &&
                      getCurrentMember.approve == 'PENDING' &&
                      !edit_profile
                    "
                  >
                    <span>
                      <q-icon
                        name="info"
                        color="info"
                        size="sm"
                        class="q-mr-sm"
                      ></q-icon>
                    </span>
                    <label
                      for="pending"
                      class="text-bold text-info registration_status_msg"
                      >{{ $t("app.registrationPending") }}</label
                    >
                  </div>
                  <!---------------------------------------END OF ALERT FOR MEMBER'S REGISTRATION STATUS---------------------->
                </div>
              </div>
            </q-card>
          </q-tab-panel>
          <!-------------------------------------------END OF MEMBER PROFILE TAB PANEL---------------------------------->

          <!-------------------------------------------MEMBER CONTRIBUTIONS TAB PANEL----------------------------------->
          <q-tab-panel name="contributions" v-if="!checkTreasurerRoleOnly()">
            <!-----------------------------------------PAYMENT ITEMS--------------------------------------------------->
            <div class="row">
              <div class="col-12 col-md-12 col-sm-12 col-xs-12">
                <q-table
                  :data="data"
                  :columns="columns"
                  row-key="index"
                  :table-header-style="{
                    backgroundColor: '#213c65',
                    color: '#FFFFFF',
                  }"
                  :loading="getLoadingState"
                  flat
                >
                  <template v-slot:top-left>
                    <label for="title" class="contribution_item_header"
                      >{{ $t("app.paymentItemLabel") }}:
                      {{ Number(due_amount).toLocaleString() }} XAF</label
                    >
                  </template>
                  <template v-slot:top-right>
                    <q-btn
                      :label="$t('app.print')"
                      color="positive"
                      :disabled="validateDownloadUnPaidItems"
                      no-caps
                      icon-right="download"
                      size="sm"
                      dense
                      padding="sm"
                      @click="downloadUnPaidItem"
                      :loading="loading_upaid_download"
                    ></q-btn>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="counter" :props="props" class="table_value">
                        {{ props.row.counter }}
                      </q-td>
                      <q-td key="name" :props="props" class="table_value">
                        {{ props.row.name }}
                      </q-td>
                      <q-td key="balance" :props="props" class="table_value">
                        {{ Number(props.row.balance).toLocaleString() }}
                      </q-td>
                      <q-td key="frequency" :props="props" class="table_value">
                        {{ formatConstants(props.row.frequency) }}
                      </q-td>
                      <q-td key="month_name" :props="props" class="table_value">
                        {{
                          props.row.month_name == null
                            ? "N/A"
                            : props.row.month_name
                        }}
                      </q-td>
                      <q-td
                        key="quarterly_name"
                        :props="props"
                        class="table_value"
                      >
                        {{
                          props.row.frequency == "QUARTERLY"
                            ? props.row.quarterly_name
                            : "N/A"
                        }}
                      </q-td>
                      <q-td key="year" :props="props" class="table_value">
                        {{
                          props.row.frequency == "YEARLY"
                            ? props.row.session.year
                            : current_year.year
                        }}
                      </q-td>
                      <q-td key="has_pay" :props="props" class="table_value">
                        <q-checkbox
                          v-model="props.row.has_pay"
                          dense
                          size="sm"
                          @input="computeTotal(props.row, $event)"
                        />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </div>
            <!-----------------------------------------END OF PAYMENT ITEMS------------------------------------------->

            <!----------------------------------------TOTAL AMOUNT PAYABLE------------------------------------------->
            <div
              class="row q-my-lg justify-center"
              :class="$q.platform.is.mobile ? 'q-gutter-sm' : ''"
            >
              <div :class="$q.platform.is.mobile ? 'col-12 col-md' : ''">
                <label for="total" class="amount_payable_title">{{
                  $t("app.totalAmountPayable")
                }}</label>
              </div>
              <div
                :class="$q.platform.is.desktop ? 'q-pl-lg' : 'col-12 col-md'"
              >
                <q-input
                  disable
                  outlined
                  dense
                  type="number"
                  v-model="total_amount_payable"
                ></q-input>
              </div>
              <div
                :class="$q.platform.is.desktop ? 'q-pl-lg' : 'col-12 col-md'"
              >
                <q-btn
                  :label="$t('app.makePaymentBtnLabel')"
                  color="primary"
                  :disabled="validatePayment"
                  no-caps
                  size="md"
                  @click="showPaymentDialog"
                  :class="$q.platform.is.mobile ? 'full-width' : ''"
                >
                  <q-icon
                    size="xs"
                    name="arrow_forward"
                    class="q-pl-sm"
                  ></q-icon>
                </q-btn>
              </div>
            </div>
            <!----------------------------------------END OF TOTAL AMOUNT PAYABLE------------------------------------>

            <!-----------------------------------------PAID ITEM LIST------------------------------------------------>
            <div class="row q-mt-lg">
              <div class="col-12 col-md-12 col-sm-12 col-xs-12">
                <q-table
                  :data="data1"
                  :columns="columns1"
                  row-key="counter"
                  ref="table"
                  :table-header-style="{
                    backgroundColor: '#213c65',
                    color: '#FFFFFF',
                  }"
                  flat
                  :loading="getLoadingState"
                >
                  <template v-slot:top-left>
                    <div class="contribution_item_header">
                      {{ $t("app.paidItem") }}:
                      {{ Number(amount_paid).toLocaleString() }} XAF
                    </div>
                  </template>
                  <template v-slot:top-right>
                    <q-btn
                      :label="$t('app.print')"
                      color="positive"
                      :disabled="validateDownloadPaidItems"
                      no-caps
                      icon-right="download"
                      size="sm"
                      dense
                      padding="sm"
                      :loading="loading_paid_download"
                      @click="downloadPaidItem"
                    ></q-btn>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="name" :props="props" class="table_value">
                        {{ props.row.name }}
                      </q-td>
                      <q-td key="frequency" :props="props" class="table_value">
                        {{ formatConstants(props.row.frequency) }}
                      </q-td>
                      <q-td key="month_name" :props="props" class="table_value">
                        {{
                          props.row.month_name == null
                            ? "N/A"
                            : props.row.month_name
                        }}
                      </q-td>
                      <q-td
                        key="quarterly_name"
                        :props="props"
                        class="table_value"
                      >
                        {{
                          props.row.quarterly_name == null
                            ? "N/A"
                            : props.row.quarterly_name
                        }}
                      </q-td>
                      <q-td key="amount" :props="props" class="table_value">
                        {{ Number(props.row.amount).toLocaleString() }}
                      </q-td>
                      <q-td key="balance" :props="props" class="table_value">
                        {{ Number(props.row.balance).toLocaleString() }}
                      </q-td>
                      <q-td
                        key="payment_status"
                        :props="props"
                        v-if="props.row.payment_status == 'COMPLETE'"
                        class="status_approve_completed table_value"
                      >
                        {{ props.row.payment_status }}
                      </q-td>
                      <q-td
                        key="payment_status"
                        :props="props"
                        v-if="props.row.payment_status == 'INCOMPLETE'"
                        class="status_decline_not_completed table_value"
                      >
                        {{ props.row.payment_status }}
                      </q-td>
                      <q-td
                        key="approve"
                        :props="props"
                        class="status_approve_completed table_value"
                        v-if="props.row.approve == 'APPROVED'"
                      >
                        {{ props.row.approve }}
                      </q-td>
                      <q-td
                        key="approve"
                        :props="props"
                        class="status_pending table_value"
                        v-if="props.row.approve == 'PENDING'"
                      >
                        {{ props.row.approve }}
                      </q-td>
                      <q-td
                        key="approve"
                        :props="props"
                        class="status_decline_not_completed table_value"
                        v-if="props.row.approve == 'DECLINED'"
                      >
                        {{ props.row.approve }}
                      </q-td>
                      <q-td key="created_at" :props="props" class="table_value">
                        {{ props.row.created_at }}
                      </q-td>
                      <q-td key="action" :props="props">
                        <q-btn
                          unelevated
                          no-caps
                          dense
                          color="primary"
                          class="view_details"
                          :label="$t('app.view')"
                          size="sm"
                          @click="viewDetails(props.row)"
                        >
                          <q-icon
                            name="visibility"
                            size="xs"
                            class="q-pl-xs"
                          ></q-icon>
                        </q-btn>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </div>
            <!-----------------------------------------END OF PAID ITEMS--------------------------------------------->
          </q-tab-panel>

          <!-------------------------------------------END OF MEMBER CONTRIBUTIONS TAB PANEL--------------------------->
        </q-tab-panels>
      </div>
    </div>

    <!-------------------------------------------ADD ROLE DIALOG------------------------------>
    <q-dialog v-model="show_add_role_dialog">
      <q-card style="min-width: 400px" class="q-pa-xs">
        <q-card-section class="row items-center q-pb-md">
          <div class="text-h6 add_role_title">{{ $t("app.addRoleLabel") }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onAddRole" class="q-gutter-md">
            <div>
              <label for="credential" class="form_field"
                >{{ $t("app.selectRole") }}
                <span class="text-red">*</span></label
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
                  :label="$t('app.addLabel')"
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
      <q-card
        :style="
          $q.platform.is.desktop ? 'min-width: 400px' : 'min-width: 350px'
        "
        class="q-pa-xs"
      >
        <q-card-section>
          <div class="text-start">
            <label class="text-dark warning_msg text-bold text-primary">{{
              $t("app.removeRoleWarningMsg")
            }}</label>
          </div>
          <div
            class="text-weight-medium text-start text-red"
            v-if="show_remove_role_dialog"
          >
            <label class="record_label">{{ $t("app.role") }}:</label>
            <label class="q-pl-md record_value">{{ role_deleted.name }}</label>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :label="$t('app.cancel')"
            color="primary"
            size="md"
            no-caps
            flat
            class="dialog_button"
            v-close-popup
          ></q-btn>
          <q-btn
            :label="$t('app.remove')"
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

    <!-------------------------------------------DIALOG TO APPROVE PAYMENT------------------->
    <q-dialog v-model="show_payment_dialog">
      <q-card
        :style="$q.platform.is.mobile ? 'min-width: 370px' : 'min-width: 600px'"
        class="q-pa-xs"
      >
        <q-card-section class="row q-pb-sm">
          <div class="text-h6 confirm_payment_title">
            {{ $t("app.confirmPaymentLabel") }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup size="sm" />
        </q-card-section>
        <q-card-section>
          <div>
            <q-markup-table flat>
              <thead>
                <tr class="text-weight-bold">
                  <th class="text-left text-weight-bold">{{ $t("app.sn") }}</th>
                  <th class="text-left text-weight-bold">
                    {{ $t("app.paymentItem") }}
                  </th>
                  <th class="text-left text-weight-bold">
                    {{ $t("app.amount") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selected_items" :key="index">
                  <td class="text-left">{{ index + 1 }}</td>
                  <td class="text-left">{{ item.name }}</td>
                  <td class="text-left">{{ item.balance }}</td>
                </tr>
                <tr>
                  <td class="text-left text-weight-bold">
                    {{ $t("app.total") }}
                  </td>
                  <td class="text-left"></td>
                  <td class="text-left text-weight-bold">
                    {{ Number(total_amount_payable).toLocaleString() }} XAF
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </q-card-section>

        <q-card-section class="q-mb-md flex justify-end">
          <q-btn
            icon-right="check"
            :class="$q.platform.is.mobile ? 'full-width' : ''"
            :label="$t('app.confirm')"
            :loading="loading_payment"
            color="primary"
            :disabled="false"
            no-caps
            size="md"
            @click="onConfirmPayment"
            padding="q-xs"
          >
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-------------------------------------------END OF DIALOG TO APPROVE PAYMENT------------>

    <!-----------------------------------------------EDIT PROFILE DIALOG----------------------------------------->
    <q-dialog v-model="showEditProfileDialog" persistent>
      <q-card style="min-width: 360px">
        <q-form @submit="onUpdateMember" class="q-pa-md">
          <div class="flex personal_info q-pb-md">
            {{ $t("app.editProfile") }}
            <q-space />
            <span
              ><q-icon
                name="close"
                size="xs"
                class="q-pr-xs"
                @click="closeEditDialog"
              ></q-icon
            ></span>
          </div>
          <small class="hint"
            >{{ $t("app.warningField") }}<span class="text-red">*</span>
            {{ $t("app.fields") }}</small
          >
          <div>
            <label for="credential" class="form_field"
              >{{ $t("app.nameLabel") }} <span class="text-red">*</span></label
            >
            <q-input v-model="user.name" outlined dense type="text" />
          </div>
          <div class="q-mt-sm">
            <label for="credential" class="form_field"
              >{{ $t("app.gender") }} <span class="text-red">*</span></label
            >
            <q-select
              v-model="user.gender"
              outlined
              dense
              :options="gender_options"
            />
          </div>
          <div class="q-mt-sm">
            <label for="credential" class="form_field"
              >{{ $t("app.emailLabel") }} <span class="text-red">*</span></label
            >
            <q-input v-model="user.email" outlined dense type="email" />
          </div>
          <div class="q-mt-sm">
            <label for="credential" class="form_field"
              >{{ $t("app.telephoneLabel") }}
            </label>
            <q-input
              v-model="user.telephone"
              outlined
              dense
              type="text"
              disable
            />
          </div>
          <div class="q-mt-sm">
            <label for="credential" class="form_field"
              >{{ $t("app.addressLabel") }}
              <span class="text-red">*</span></label
            >
            <q-input v-model="user.address" outlined dense type="text" />
          </div>
          <div class="q-mt-sm">
            <label for="credential" class="form_field"
              >{{ $t("app.occupation") }} <span class="text-red">*</span></label
            >
            <q-input v-model="user.occupation" outlined dense type="text" />
          </div>
          <div class="q-mt-sm">
            <label for="credential" class="form_field"
              >{{ $t("app.status") }} <span class="text-red">*</span></label
            >
            <q-select
              v-model="user.status"
              outlined
              dense
              type="text"
              :options="status_options"
            />
          </div>
          <div
            class="row justify-end"
            :class="$q.platform.is.mobile ? 'q-mt-md' : ''"
          >
            <ButtonVue
              :label="$t('app.saveBtnLabel')"
              :loading="loading"
              color="primary"
              :disabled="validateForm"
              :no_caps="no_caps"
            >
            </ButtonVue>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <!-----------------------------------------------END OF EDIT PROFILE DIALOG---------------------------------->
  </div>
</template>

<script>
import { LocalStorage, Platform, Notify } from "quasar";
import ButtonVue from "src/components/Button.vue";
import moment from "moment";
import organisationMixin from "src/mixins/organisationMixin.vue";
import memberMixin from "src/mixins/memberMixin.vue";
import CurrentYearMixinVue from "src/mixins/CurrentYearMixin.vue";
import HelperMixinVue from "src/mixins/HelperMixin.vue";
import { VueTelInput } from "vue-tel-input";

export default {
  mixins: [organisationMixin, memberMixin, CurrentYearMixinVue, HelperMixinVue],

  mounted() {
    this.getUserRoles(this.$route.params.id);
    this.getMembersDebts(true);
    this.getMembersContributions(true);
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
        status: "",
      },
      loading: false,
      edit_profile: false,
      show_add_role_dialog: false,
      role_deleted: null,
      show_payment_dialog: false,
      no_caps: true,
      selected_items: [],
      loading_payment: false,
      columns: [
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
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
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
        {
          name: "action",
          label: "Action",
          field: "action",
          align: "left",
        },
      ],
      data1: [],
      total_amount_payable: 0,
      role: null,
      gender_options: ["MALE", "FEMALE", "OTHER"],
      user_roles: [],
      show_remove_role_dialog: false,
      is_fetching: true,
      current_year: LocalStorage.getItem("data").current_session,
      due_amount: 0.0,
      amount_paid: 0.0,
      available_roles: [],
      status_options: ["ACTIVE", "IN_ACTIVE"],
      showEditProfileDialog: false,
      loading_upaid_download: false,
      loading_paid_download: false,
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
      return (
        this.user.name == null ||
        this.user.telephone == null ||
        this.user.address == null ||
        this.user.address == null ||
        this.user.occupation == null ||
        this.user.gender == null ||
        this.user.email == null
      );
    },

    validatePayment() {
      return this.total_amount_payable == 0;
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
            role.name == "PRESIDENT"
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
      const auth_user = LocalStorage.getItem("data").user_data.roles.find(
        (role) => role.name === "ADMIN"
      );
      return auth_user !== undefined;
    },

    getFormField() {
      return this.setFormField(this.$store.getters.getCurrentMember);
    },

    getProfilePicture() {
      return process.env.API_BASE_URL + this.getCurrentMember.picture;
    },

    validateDownloadUnPaidItems() {
      return this.data.length < 0;
    },

    validateDownloadPaidItems() {
      return this.data1.length < 0;
    },
  },
  watch: {
    getFormField() {
      return this.setFormField(this.$store.getters.getCurrentMember);
    },
  },
  methods: {
    viewDetails(data) {
      let payload = {
        data: {
          details: data,
          user: this.$store.getters.getCurrentMember,
        },
        tab: "Payment Details",
      };
      this.$store.dispatch("setSelectedContribution", data);

      this.$emit("view-payment-details", payload);
    },

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
        this.user.status = data.status;
      }

      return this.user;
    },

    onUpdateMember() {
      this.loading = true;
      let payload = {
        url: `/api/protected/user/member/profile/update`,
        data: this.user,
        msg: this.$t("app.memberProfileUpdateSuccessMsg"),
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        commit: "none",
        status: "success",
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
        .finally(() => {
          this.loading = false;
          if (Platform.is.mobile) {
            this.showEditProfileDialog = false;
          }
        });
    },

    showEditProfile() {
      this.setFormField();
      if (Platform.is.mobile) {
        this.showEditProfileDialog = true;
      } else {
        this.edit_profile = true;
      }
    },

    closeEditDialog() {
      return (this.showEditProfileDialog = false);
    },

    openFileUpload() {
      document.getElementById("logo").click();
    },

    onFileChanged(e) {
      this.is_fetching = true;
      const formData = new FormData();
      formData.append("image", e.target.files[0]);

      let payload = {
        url: `/api/protected/upload_file?requester=MEMBER&file_category=${process.env.PROFILE_PICTURES}`,
        data: formData,
        status: "none",
        show_feedback: true,
        msg: this.$t("app.profilePicUploadSuccessMsg"),
        color: "default",
        error_msg: this.$t("app.defaultErrorMsg"),
        commit: "none",
        has_commit: false,
      };
      this.$store
        .dispatch("uploadImageRequest", payload)
        .then((response) => {
          let user = this.$store.getters.getCurrentMember;
          if (response.status == 200) {
            user.picture = response.data.data;
            return user;
          }
        })
        .then((user) => {
          this.$store.dispatch("setCurrentMember", user);
          return user;
        })
        .then((user) => {
          let update_user = {
            url: `/api/protected/users/${user.id}`,
            data: {
              picture: user.picture,
            },
            msg: this.$t("app.profilePicUploadSuccessMsg"),
            color: "default",
            to_on_ok: "none",
            to_on_fail: "none",
            show_feedback: true,
            error_msg: this.$t("app.defaultErrorMsg"),
            has_commit: false,
            commit: "none",
            to_be_store_data: {
              required: false,
              has_value: false,
              data: [],
            },
          };
          this.$store
            .dispatch("putRequest", update_user)
            .then(() => {})
            .finally(() => {
              this.is_fetching = false;
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
        error_msg: "",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading = true;
      this.$store
        .dispatch("postRequest", payload)
        .then((response) => {
          this.loading = false;
          if (response.status == 200) {
            this.role = null;
            this.getUserRoles(user_id);
          } else if (response.status == 427) {
            Notify.create({
              type: "info",
              message: this.$t("app.termNotExpired"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          } else if (response.status == 403) {
            Notify.create({
              type: "negative",
              message: this.$t("app.oneMemberRoleWarningMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
        })
        .finally(() => {
          this.show_add_role_dialog = false;
          this.role = null;
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
      this.is_fetching = true;
      this.$store
        .dispatch("getRequest", payload)
        .then((response) => {
          if (response.success) {
            this.user_roles = [];
            this.user_roles.push(...response.data);
          }
        })
        .finally(() => {
          this.is_fetching = false;
        });
    },

    removeUserRole() {
      let id = this.$route.params.id;
      let payload = {
        url: `/api/protected/roles/users/${id}?role=${this.role_deleted.name}`,
        msg: this.$t("app.roleRemoveSuccessMsg"),
        color: "default",
        to_on_ok: "none",
        status: "success",
        to_on_fail: "none",
        show_feedback: false,
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.$store.dispatch("deleteRequest", payload).then((response) => {
        if (response.status == 200) {
          this.user_roles = [];
          this.getUserRoles(id);
          Notify.create({
            type: "positive",
            message: this.$t("app.roleRemoveSuccessMsg"),
            position: Platform.is.mobile ? "bottom" : "top-right",
          });
        } else if (response.status == 427) {
          Notify.create({
            type: "info",
            message: this.$t("app.termNotExpired"),
            position: Platform.is.mobile ? "bottom" : "top-right",
          });
        }
      });
    },

    onConfirmPayment() {
      this.loading_payment = true;
      let user_id = this.$store.getters.getCurrentMember.id;
      let payload = {
        data: this.buildPayloadData(),
        url: `/api/protected/contributions/bulk-payments?user_id=${user_id}&current_session_id=${this.current_year.id}`,
        msg: this.$t("app.bulkSuccessMsg"),
        color: "default",
        to_on_ok: "none",
        status: "success",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: this.$t("app.defaultErrorMsg"),
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
            year: this.current_year.id,
            comment: "BULK PAYMENT",
            quarterly_name: ele.quarterly_name,
            month_name: ele.month_name,
            registration_id: ele.id,
            contributed_via_saving: false,
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
      let payload = {
        data: "none",
        url: `/api/protected/contributions/members/debts?user_id=${id}&session_id=${this.current_year.id}`,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        status: "success",
        to_on_fail: "none",
        show_feedback: false,
        show_spinner: show_spinner,
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.is_fetching = show_spinner;
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
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
        })
        .finally(() => {
          this.is_fetching = false;
          this.$store.commit("SET_IS_FETCHING", false);
        });
    },

    getMembersContributions(show_spinner) {
      this.amount_paid = 0.0;
      let id = this.$route.params.id;
      let payload = {
        data: "none",
        url: `/api/protected/contributions/members/paid?user_id=${id}&session_id=${this.current_year.id}`,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        status: "success",
        to_on_fail: "none",
        show_feedback: false,
        show_spinner: show_spinner,
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.is_fetching = show_spinner;
      this.$store.commit("SET_IS_FETCHING", true);
      this.$store
        .dispatch("getRequest", payload)
        .then((res) => {
          if (res.success) {
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
                frequency: ele.frequency,
                month_name: ele.month_name,
                quarterly_name: ele.quarterly_name,
                code: ele.code,
                created_by: ele.created_by,
                comment: ele.comment,
                is_compulsory: ele.is_compulsory,
              });
            });
          }
        })
        .finally(() => {
          this.is_fetching = false;
          this.$store.commit("SET_IS_FETCHING", false);
        });
    },

    downloadUnPaidItem() {
      let id = this.$route.params.id;
      let url = `/api/protected/contributions/members/debts/download?user_id=${id}&session_id=${this.current_year.id}`;
      this.loading_upaid_download = this.downloadPdf(
        url,
        "Unpaid_PaymentItems.pdf"
      );

      return (this.loading_upaid_download = false);
    },

    downloadPaidItem() {
      let id = this.$route.params.id;
      let url = `/api/protected/contributions/members/paid_items/download?user_id=${id}&session_id=${this.current_year.id}`;
      this.loading_paid_download = this.downloadPdf(
        url,
        "Paid_PaymentItem.pdf"
      );
      return (this.loading_paid_download = false);
    },
  },
  components: {
    ButtonVue,
    VueTelInput,
  },
};
</script>

<style src="vue-tel-input/dist/vue-tel-input.css"></style>
<style lang="scss" scoped>
.tab {
  height: 50px;
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
  font-size: 0.7rem;
  align-items: center;
  color: $grey5;
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
  align-items: center;
  text-align: center;
}

.person_icon {
  font-size: 1rem;
}
.role_icon {
  font-size: 1rem;
  cursor: pointer;
}

.camara {
  position: relative;
  left: 10%;
  top: -45px;
  cursor: pointer;
  color: $grey8;
}

.active_text_color {
  color: $secondary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
}

.in_active_text_color {
  color: $orange;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
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
  font-weight: 500;
  font-size: 0.9rem;
  color: $primary;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
  color: $dark;
}

.personal_info {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 11px;
  letter-spacing: 0.01em;
  color: $primary;
}

.hint {
  color: $grey2;
  font-size: smaller;
}

.role_heading {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
  color: $primary;
}

.role_name {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.7rem;
  color: $grey8;
}

.role_update_date {
  font-weight: 500;
  font-size: 0.6rem;
}
.add_role_title {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  align-items: center;
  text-align: center;
}

.not_register {
  color: $white1;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  align-items: center;
  text-align: center;
  background-color: $warning;
}
.has_register {
  color: $white1;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  align-items: center;
  text-align: center;
  background-color: $secondary;
}

.pending_reg {
  color: $white1;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  align-items: center;
  text-align: center;
  background-color: $info;
}

.contribution_item_header {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem;
}

.status_decline_not_completed {
  color: $orange;
}

.status_approve_completed {
  color: $secondary;
}

.status_pending {
  color: $info;
}

.amount_payable_title {
  color: $grey8;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
}

.confirm_payment_title {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
}

.view_details {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  align-items: center;
  text-transform: capitalize;
  width: 5rem;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
}

.profile_icon {
  font-size: 1.1rem;
}

.label {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 0.7rem;
  color: $grey5;
}

.value {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.8rem;
  color: $dark;
}

.registration_status_msg {
  font-size: 0.8rem;
}

.table_value {
  font-size: 0.7rem;
  font-weight: 500;
}

.warning_msg {
  font-size: 0.9rem;
  color: $primary;
}

.record_value {
  font-size: 0.8rem;
}

.record_label {
  font-size: 0.8rem;
}
</style>
