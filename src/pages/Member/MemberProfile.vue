<template>
  <div>
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
          <q-tab name="profile" :label="$t('app.profileLabel')" class="tab" icon="person" />
          <q-tab
            name="contributions"
            :label="$t('app.contributionName')"
            class="tab"
            icon="payments"
          />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <!-------------------------------------------MEMBER PROFILE TAB PENEL----------------------------------------->
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
                            :alt="$t('app.profilePicAlt')"
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
                            <q-tooltip>{{$t('app.uploadPicture')}}</q-tooltip>
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
                            >{{$t('app.rolesName')}}
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
                            <q-tooltip>{{$t('app.addRoleLabel')}}</q-tooltip>
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
                                >{{$t('app.updatedBy')}}:
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
                                  <q-tooltip>{{$t('app.removeRole')}}</q-tooltip>
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
                      <!----------------------------------------MEMBER  PROFILE DETAILS------------------------------------->
                      <div class="q-pa-sm" v-if="!edit_profile">
                        <div class="row">
                          <div class="q-pb-md">
                            <label for="info" class="personal_info"
                              >{{$t('app.personalInformationLabel')}}</label
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
                              <q-tooltip>{{$t('app.editProfile')}}</q-tooltip>
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
                            {{$t('app.nameLabel')}}:
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
                            {{$t('app.gender')}}:
                            <span class="value value_code gender">{{
                              getCurrentMember.gender
                            }}</span>
                            <span
                              class="value value_code q-pl-lg"
                              v-if="getCurrentMember.gender == null"
                              >{{ $t('app.notSet') }}</span
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
                            >{{$t('app.emailLabel')}}:
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
                            >{{$t('app.telephoneLabel')}}:
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
                            {{$t('app.addressLabel')}}:
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
                            {{$t('app.occupation')}}:
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
                            >{{$t('app.createdDate')}}:
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
                            >{{$t('app.updatedDate')}}:
                            <span class="value date value_code">{{
                              getFormatedUpdatedDate
                            }}</span></label
                          >
                        </div>
                      </div>
                      <!----------------------------------------------END OF MEMBER PROFILE------------------------------------------>

                      <!-----------------------------------------EDIT MEMBER PROFILE FORM------------------------------------------>
                      <div class="q-pa-sm q-mb-lg" v-if="edit_profile">
                        <q-form @submit="onUpdateMember" class="q-gutter-md">
                          <div class="update_profile q-pb-md">
                           {{$t('app.editProfile')}}
                          </div>
                          <small class="hint"
                            >{{$t('app.warningField')}}<span class="text-red">*</span> {{$t('app.fields')}}</small
                          >
                          <div>
                            <label for="credential" class="form_field"
                              >{{$t('app.nameLabel')}} <span class="text-red">*</span></label
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
                              >{{$t('app.gender')}} <span class="text-red">*</span></label
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
                              >{{$t('app.emailLabel')}}</label
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
                              >{{$t('app.addressLabel')}} <span class="text-red">*</span></label
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
                              >{{$t('app.occupation')}} <span class="text-red">*</span></label
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
                       <div>
                        <div
                          class="not_register q-pa-sm"
                          v-if="
                            getCurrentMember.has_register == 'NOT_REGISTERED' &&
                            !getCurrentMember.has_paid
                          "
                        >
                          <label for="not_register"
                            >{{$t('app.notCompletedRegistration')}}:
                            {{ getCurrentYear.year }}</label
                          >
                        </div>
                        <div
                          class="q-mt-md has_register q-pa-sm"
                          v-if="getCurrentMember.has_register == 'REGISTERED'"
                        >
                          <label for="register"
                            >{{$t('app.hasCompletedRegistration')}}:
                            {{ getCurrentYear.year }}</label
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
                            >{{$t('app.registrationPending')}}</label
                          >
                        </div>
                      </div>
                      <!---------------------------------------END OF ALERT FOR MEMBER'S REGISTRATION STATUS---------------------->
                    </q-card-section>
                  </div>
                </div>
              </q-card>
            </div>
          </q-tab-panel>
          <!-------------------------------------------END OF MEMBER PROFILE TAB PANEL---------------------------------->

          <!-------------------------------------------MEMBER CONTRIBUTIONS TAB PANEL----------------------------------->
          <q-tab-panel name="contributions">
            <!-----------------------------------------PAYMENT ITEMS--------------------------------------------------->
            <div class="row q-mx-xs">
              <div class="col-12 col-md-12 col-sm-12 col-xs-12">
                <q-table
                  :data="data"
                  :columns="columns"
                  row-key="index"
                  :table-header-style="{
                    backgroundColor: '#5384ae',
                    color: '#FFFFFF',
                  }"
                  flat
                >
                  <template v-slot:top-left>
                    <div class="text-h6 contribution_item_header">
                      {{$t('app.paymentItemLabel')}}:
                      {{ Number(due_amount).toLocaleString() }} XAF
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
                      <q-td key="balance" :props="props">
                        {{ Number(props.row.balance).toLocaleString() }}
                      </q-td>
                      <q-td key="frequency" :props="props">
                        {{ props.row.frequency }}
                      </q-td>
                      <q-td key="month_name" :props="props">
                        {{
                          props.row.month_name == null
                            ? "N/A"
                            : props.row.month_name
                        }}
                      </q-td>
                      <q-td key="quarterly_name" :props="props">
                        {{
                          props.row.frequency == "QUARTERLY"
                            ? props.row.quarterly_name
                            : "N/A"
                        }}
                      </q-td>
                      <q-td key="year" :props="props">
                        {{
                          props.row.frequency == "YEARLY"
                            ? props.row.session.year
                            : "N/A"
                        }}
                      </q-td>
                      <q-td key="has_pay" :props="props">
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
            <div class="flex q-my-lg justify-center">
              <div>
                <label for="total" class="amount_payable_title"
                  >{{$t('app.totalAmountPayable')}}</label
                >
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
                <q-btn
                  :label="$t('app.makePaymentBtnLabel')"
                  color="primary"
                  :disabled="validatePayment"
                  no-caps
                  @click="showPaymentDialog"
                >
                  <q-icon
                    size="xs"
                    name="arrow_forward"
                    class="q-pl-md"
                  ></q-icon>
                </q-btn>
              </div>
            </div>
            <!----------------------------------------END OF TOTAL AMOUNT PAYABLE------------------------------------>

            <!-----------------------------------------PAID ITEM LIST------------------------------------------------>
            <div class="row q-mt-lg q-mx-md">
              <div class="col-12">
                <q-table
                  :data="data1"
                  :columns="columns1"
                  row-key="index"
                  :table-header-style="{
                    backgroundColor: '#5384ae',
                    color: '#FFFFFF',
                  }"
                  flat
                >
                  <template v-slot:top-left>
                    <div class="text-h6 contribution_item_header">
                     {{$t('app.paidItem')}}: {{ Number(amount_paid).toLocaleString() }} XAF
                    </div>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="counter" :props="props">
                        {{ props.row.counter }}
                      </q-td>
                      <q-td
                        key="name"
                        :props="props"
                      >
                        {{ props.row.name }}
                      </q-td>
                      <q-td key="frequency" :props="props">
                        {{ props.row.frequency }}
                      </q-td>
                      <q-td key="month_name" :props="props">
                        {{
                          props.row.month_name == null
                            ? "N/A"
                            : props.row.month_name
                        }}
                      </q-td>
                      <q-td key="quarterly_name" :props="props">
                        {{
                          props.row.quarterly_name == null || " "
                            ? "N/A"
                            : props.row.quarterly_name
                        }}
                      </q-td>
                      <q-td key="year" :props="props">
                        {{ props.row.year == null ? "N/A" : props.row.year }}
                      </q-td>
                      <q-td key="amount" :props="props">
                        {{ Number(props.row.amount).toLocaleString() }}
                      </q-td>
                      <q-td key="balance" :props="props">
                        {{ Number(props.row.balance).toLocaleString() }}
                      </q-td>
                      <q-td
                        key="payment_status"
                        :props="props"
                        v-if="props.row.payment_status == 'COMPLETE'"
                        class="status_approve_completed"
                      >
                        {{ props.row.payment_status }}
                      </q-td>
                      <q-td
                        key="payment_status"
                        :props="props"
                        v-if="props.row.payment_status == 'INCOMPLETE'"
                        class="status_decline_not_completed"
                      >
                        {{ props.row.payment_status }}
                      </q-td>
                      <q-td
                        key="approve"
                        :props="props"
                        class="status_approve_completed"
                        v-if="props.row.approve == 'APPROVED'"
                      >
                        {{ props.row.approve }}
                      </q-td>
                      <q-td
                        key="approve"
                        :props="props"
                        class="status_pending"
                        v-if="props.row.approve == 'PENDING'"
                      >
                        {{ props.row.approve }}
                      </q-td>
                      <q-td
                        key="approve"
                        :props="props"
                        class="status_decline_not_completed"
                        v-if="props.row.approve == 'DECLINED'"
                      >
                        {{ props.row.approve }}
                      </q-td>
                      <q-td key="created_at" :props="props">
                        {{ props.row.created_at }}
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
          <div class="text-h6 add_role_title">{{$t('app.addRoleLabel')}}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onAddRole" class="q-gutter-md">
            <div>
              <label for="credential" class="form_field"
                >{{$t('app.selectRole')}} <span class="text-red">*</span></label
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
      <q-card style="min-width: 400px" class="q-pa-xs">
        <q-card-section>
          <div class="text-center q-pb-xs">
            <label class="text-dark message text-bold"
              >{{$t('app.removeRoleWarningMsg')}}</label
            >
          </div>
          <div
            class="text-weight-medium text-center text-red"
            v-if="show_remove_role_dialog"
          >
            {{$t('app.role')}}: <span class="q-pl-md">{{ role_deleted.name }}</span>
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
      <q-card style="min-width: 600px" class="q-pa-xs">
        <q-card-section class="row items-center q-pb-sm">
          <div class="text-h6 confirm_payment_title">{{$t('app.confirmPaymentLabel')}}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div>
            <q-markup-table flat>
              <thead>
                <tr class="text-weight-bold">
                  <th class="text-left text-weight-bold">{{$t('app.sn')}}</th>
                  <th class="text-left text-weight-bold">{{$t('app.paymentItem')}}</th>
                  <th class="text-left text-weight-bold">{{ $t('app.amount') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selected_items" :key="item.id">
                  <td class="text-left">{{ index + 1 }}</td>
                  <td class="text-left">{{ item.name }}</td>
                  <td class="text-left">{{ item.balance }}</td>
                </tr>
                <tr>
                  <td class="text-left text-weight-bold">{{$t('app.total')}}</td>
                  <td class="text-left"></td>
                  <td class="text-left text-weight-bold">
                    {{ Number(total_amount_payable).toLocaleString() }} XAF
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </q-card-section>

        <q-card-section class="q-mb-md">
          <div class="flex justify-end">
            <q-btn
              icon-right="check"
              class="form_button"
              :label="$t('app.confirm')"
              :loading="loading_payment"
              color="primary"
              :disabled="false"
              no-caps
              @click="onConfirmPayment"
            >
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-------------------------------------------END OF DIALOG TO APPROVE PAYMENT------------>
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
    this.getUserRoles(this.$route.params.id);
    this.getMembersDebts(false);
    this.getMembersContributions(false);
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
          label: "Quarter Name",
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
            contributed_via_saving:false
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
              frequency: ele.frequency,
              month_name: ele.month_name,
              quarterly_name: ele.quarterly_name,
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
  top: -45px;
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
  font-size: 16px;
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

.contribution_item_header {
  color: $dark;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.005em;
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
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.005em;
}

.confirm_payment_title {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.005em;
}
</style>
