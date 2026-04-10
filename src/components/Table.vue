<template>
  <div>
    <q-table
      :data="data"
      :columns="columns"
      row-key="index"
      :table-header-style="{ backgroundColor: '#213c65', color: '#FFFFFF' }"
      :filter="filter"
      :loading="table_loading"
      :pagination.sync="getPagination"
      @request="onRequest"
      binary-state-sort
      flat
    >
      <template v-slot:top-left>
        <div
          class="title"
          v-show="show_contribution || show_member_contribution"
        >
          <label>
            {{ title }}
          </label>
        </div>
        <div class="title" v-show="show_income_activity">
          {{ $t("app.total") }}: {{ Number(total_income).toLocaleString() }} XAF
        </div>
        <div class="title" v-show="show_members">
          {{ $t("app.organisationMembers") }}
        </div>
        <div class="title" v-show="show_savings">
          {{ $t("app.totalSaving") }} :
          {{ Number(total_saving).toLocaleString() }} XAF
        </div>
        <div class="title" v-show="show_member_savings">
          {{ $t("app.totalSaving") }} :
          {{ Number(total_saving).toLocaleString() }} XAF
        </div>
      </template>
      <template v-slot:body="props">
        <!---------------------------------------------BODY FOR MEMBERS------------------------------------------------------>
        <q-tr :props="props" v-if="show_members">
          <q-td key="name" :props="props" class="table_value">
            {{ props.row.name }}
          </q-td>

          <q-td key="gender" :props="props" class="table_value">
            {{ props.row.gender }}
          </q-td>

          <q-td key="telephone" :props="props" class="table_value">
            {{ props.row.telephone }}
          </q-td>
          <q-td
            key="has_register"
            :props="props"
            class="not_registered table_value"
            v-if="
              props.row.registered &&
              props.row.registered.approve !== 'APPROVED'
            "
          >
            NOT_REGISTERED
          </q-td>
          <q-td
            key="has_register"
            :props="props"
            class="registered table_value"
            v-if="
              props.row.registered &&
              props.row.registered.approve === 'APPROVED'
            "
          >
            REGISTERED
          </q-td>
          <q-td
            key="has_register"
            :props="props"
            class="not_registered table_value"
            v-if="props.row.registered === '' || props.row.registered === null"
          >
            NOT_REGISTERED
          </q-td>
          <q-td
            key="approve"
            :props="props"
            class="registered table_value"
            v-if="
              props.row.registered &&
              props.row.registered.approve === 'APPROVED'
            "
          >
            {{ props.row.registered.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            class="not_registered table_value"
            v-if="
              props.row.registered &&
              props.row.registered.approve === 'DECLINED'
            "
          >
            {{ props.row.registered.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            class="text-info table_value"
            v-if="
              props.row.registered && props.row.registered.approve === 'PENDING'
            "
          >
            {{ props.row.registered.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            class="text-info table_value"
            v-if="props.row.registered === '' || props.row.registered === null"
          >
          </q-td>

          <q-td
            key="status"
            :props="props"
            v-if="props.row.status === 'ACTIVE'"
            class="registered table_value"
          >
            {{ props.row.status }}
          </q-td>

          <q-td
            key="status"
            :props="props"
            v-if="props.row.status === 'IN_ACTIVE'"
            class="not_registered table_value"
          >
            {{ props.row.status }}
          </q-td>

          <q-td key="action" :props="props">
            <!-- button to handle edit, view and delete, invite and register  a member -->
            <q-btn flat round v-if="checkTreasurerRoleOnly()">
              <q-icon
                name="menu"
                size="xs"
                color="primary"
                class="menu_icon"
                clickable
              >
                <q-menu>
                  <q-list bordered separator style="width: 210px">
                    <!-- view member profile -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewMember(props.row)"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon
                            name="account_circle"
                            size="xs"
                            class="edit"
                          />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">{{
                          $t("app.viewProfile")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>

            <!-- button to handle edit, view and delete, invite and register  a member -->
            <q-btn flat round v-if="!checkTreasurerRoleOnly()">
              <q-icon
                name="menu"
                size="xs"
                color="primary"
                class="menu_icon"
                clickable
              >
                <q-menu>
                  <q-list bordered separator style="width: 210px">
                    <!-- view member profile -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewMember(props.row)"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon
                            name="account_circle"
                            size="xs"
                            class="edit"
                          />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">{{
                          $t("app.viewProfile")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <!-- invite members to the app -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onInviteMember(props.row)"
                      :disabled="props.row.status === 'IN_ACTIVE'"
                      v-if="checkAdminPresidentRole()"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="share" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">{{
                          $t("app.inviteMember")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <!-- register members -->
                    <q-item
                      clickable
                      v-close-popup
                      :disabled="props.row.status === 'IN_ACTIVE'"
                      @click="onRegisterMember(props.row)"
                      v-if="checkRole()"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="person_add" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">{{
                          $t("app.registerMember")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <!-- deleted specify row -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDeleteMember(props.row)"
                      v-if="checkAdminPresidentRole()"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="delete" size="xs" color="red" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-red delete_text">{{
                          $t("app.delete")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>

            <q-btn
              class="q-ml-md approve_btn"
              :label="$t('app.approve')"
              no-caps
              dense
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="
                canValidateTransaction() &&
                props.row.registered &&
                props.row.registered.approve === 'PENDING'
              "
            />

            <!-- buttons for approve and decline row data -->
            <q-btn
              class="decline_btn"
              :label="$t('app.decline')"
              no-caps
              dense
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="
                canValidateTransaction() &&
                props.row.registered &&
                props.row.registered.approve === 'PENDING'
              "
            />
          </q-td>
        </q-tr>
        <!---------------------------------------------END BODE FOR MEMBERS------------------------------------------------------------------------------------->

        <!---------------------------------------------------START OF SAVINGS FOR ALL MEMBER TO BE VIEW BY USER WITH UNTREASUERER ROLE------------------------->
        <q-tr :props="props" v-if="show_savings && !checkTreasurerRoleOnly()">
          <q-td key="user_name" :props="props" class="table_value">
            {{ props.row.user_name }}
          </q-td>
          <q-td key="email" :props="props" class="table_value">
            {{ props.row.email }}
          </q-td>
          <q-td key="telephone" :props="props" class="table_value">
            {{ props.row.telephone }}
          </q-td>
          <q-td key="total_amount" :props="props" class="table_value">
            {{ Number(props.row.total_amount).toLocaleString() }}
          </q-td>
          <q-td key="date" :props="props" class="table_value">
            {{ getDate(props.row.date) }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'DECLINED'"
            class="not_registered table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              unelevated
              no-caps
              dense
              color="primary"
              class="view_savings"
              :label="$t('app.allSavings')"
              @click="showMemberSavings(props.row)"
              :to="{ name: 'user_savings', params: { id: props.row.user_id } }"
              :style="$q.platform.is.mobile ? 'width:100px' : 'width:100px'"
            >
              <q-icon name="visibility" class="q-pl-sm eye_icon"></q-icon>
            </q-btn>
          </q-td>
        </q-tr>
        <!----------------------------------------------------END F SAVINGS FOR ALL MEMBER TO BE VIEW BY USER WITH UNTREASUERER ROLE---------------------------------------------->

        <!----------------------------------------------------END OF MEMBER SAVINGS TO BE VIEW BY THE TREASUERER--------------------------------------------->
        <q-tr :props="props" v-if="show_savings && checkTreasurerRoleOnly()">
          <q-td key="user_name" :props="props" class="table_value">
            {{ props.row.user_name }}
          </q-td>
          <q-td key="email" :props="props" class="table_value">
            {{ props.row.email }}
          </q-td>
          <q-td key="telephone" :props="props" class="table_value">
            {{ props.row.telephone }}
          </q-td>
          <q-td key="total_amount" :props="props" class="table_value">
            {{ Number(props.row.total_amount).toLocaleString() }}
          </q-td>
          <q-td key="date" :props="props" class="table_value">
            {{ getDate(props.row.date) }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'DECLINED'"
            class="not_registered table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              unelevated
              no-caps
              dense
              color="primary"
              class="view_savings"
              :label="$t('app.allSavings')"
              @click="showMemberSavings(props.row)"
              :to="{ name: 'user_savings', params: { id: props.row.user_id } }"
              :style="$q.platform.is.mobile ? 'width:100px' : 'width:100px'"
            >
              <q-icon name="visibility" class="q-pl-sm eye_icon"></q-icon>
            </q-btn>
          </q-td>
        </q-tr>
        <!--------------------------------------------------------END OF ALL SAVINGS TO BE VIEW BY THE TREASUERER------------------------------------------------------------------->

        <!---------------------------------------------------------------------------MEMBER SAVINGS--------------------------------------------------->
        <q-tr :props="props" v-if="show_member_savings">
          <q-td key="amount_deposited" :props="props" class="table_value">
            {{ Number(props.row.amount_deposited).toLocaleString() }}
          </q-td>
          <q-td key="amount_used" :props="props" class="table_value">
            {{ Number(props.row.amount_used).toLocaleString() }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'PENDING'"
            class="text-info table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'APPROVED'"
            class="registered table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'DECLINED'"
            class="not_registered table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="date" :props="props" class="table_value">
            {{ getDate(props.row.date) }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              class="approve_btn"
              :label="$t('app.approve')"
              no-caps
              unelevated
              dense
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="props.row.approve === 'PENDING' && canValidateTransaction()"
            />

            <q-btn
              class="decline_btn"
              :label="$t('app.decline')"
              no-caps
              unelevated
              dense
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="props.row.approve === 'PENDING' && canValidateTransaction()"
            />

            <q-btn
              unelevated
              no-caps
              dense
              color="primary"
              class="view_income"
              :label="$t('app.view')"
              @click="onViewMemberSaving(props.row)"
              v-if="checkTreasurerRoleOnly()"
            >
              <q-icon name="visibility" class="q-pl-md eye_icon"></q-icon>
            </q-btn>
            <!-- menu to handle edit and view details of a single saving -->
            <q-btn flat round v-if="!checkTreasurerRoleOnly()">
              <q-icon
                name="menu"
                size="xs"
                color="primary"
                class="menu_icon"
                clickable
              >
                <q-menu>
                  <q-list bordered separator style="width: 180px">
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewMemberSaving(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="visibility" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">{{
                          $t("app.view")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditMemberSaving(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="edit" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">{{
                          $t("app.edit")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>
          </q-td>
        </q-tr>
        <!-------------------------------------------------------------------------END OF MEMBER SAVINGS----------------------------------------------------------->

        <!----------------------------------------------------------------------INCOME ACTIVITIES----------------------------------------------------------->
        <q-tr :props="props" v-if="show_income_activity">
          <q-td key="name" :props="props" class="table_value">
            {{ props.row.name }}
          </q-td>
          <q-td key="amount" :props="props" class="table_value">
            {{ Number(props.row.amount).toLocaleString() }}
          </q-td>
          <q-td key="date" :props="props" class="table_value">
            {{ getDate(props.row.date) }}
          </q-td>
          <q-td key="venue" :props="props" class="table_value">
            {{ props.row.venue }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'PENDING'"
            class="text-info table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'APPROVED'"
            class="registered table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'DECLINED'"
            class="not_registered table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="action" :props="props">
            <!-- buttons for approve and decline row data -->
            <q-btn
              class="approve_btn q-mx-xl"
              :label="$t('app.approve')"
              no-caps
              unelevated
              dense
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="canValidateTransaction() && props.row.approve === 'PENDING'"
            />

            <q-btn
              class="decline_btn q-mr-sm"
              :label="$t('app.decline')"
              no-caps
              unelevated
              dense
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="canValidateTransaction() && props.row.approve === 'PENDING'"
            />

            <!-- button to handle view all activity -->
            <q-btn
              unelevated
              no-caps
              dense
              color="primary"
              class="view_income"
              :label="$t('app.view')"
              @click="onViewIncomeActivity(props.row)"
              v-if="show_income_activity && checkTreasurerRoleOnly()"
            >
              <q-icon name="visibility" class="q-pl-sm eye_icon"></q-icon>
            </q-btn>

            <!-- menu to handle edit and view details of a single show_income_activity -->
            <q-btn flat round v-if="!checkTreasurerRoleOnly()">
              <q-icon
                name="menu"
                size="xs"
                color="primary"
                class="menu_icon"
                clickable
              >
                <q-menu>
                  <q-list bordered separator style="width: 180px">
                    <!-- edit and view show_income_activity -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewIncomeActivity(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="visibility" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">{{
                          $t("app.view")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditIncomeActivity(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="edit" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">{{
                          $t("app.edit")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <!-- deleted specify row -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDeleteIncomeActivity(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="delete" size="xs" color="red" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-red delete_text">{{
                          $t("app.delete")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>
          </q-td>
        </q-tr>
        <!--------------------------------------------------------------------END OF INCOME ACTIVITIES---------------------------------------------------------->

        <!--------------------------------------------------------------------CONTRIBUTION-------------------------------------->
        <q-tr :props="props" v-if="show_contribution">
          <q-td key="user_name" :props="props" class="table_value">
            {{ props.row.user_name }}
          </q-td>
          <q-td key="total_amount_deposited" :props="props" class="table_value">
            {{ Number(props.row.total_amount_deposited).toLocaleString() }}
          </q-td>
          <q-td key="balance" :props="props" class="table_value">
            {{ Number(props.row.balance).toLocaleString() }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'PENDING'"
            class="text-info table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'APPROVED'"
            class="registered table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'DECLINED'"
            class="not_registered table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              class="approve_btn"
              :label="$t('app.approve')"
              no-caps
              unelevated
              dense
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="canValidateTransaction() && props.row.approve === 'PENDING'"
            />

            <!-- buttons for approve and decline row data -->
            <q-btn
              class="decline_btn q-mx-xl"
              :label="$t('app.decline')"
              no-caps
              unelevated
              dense
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="canValidateTransaction() && props.row.approve === 'PENDING'"
            />

            <!-- menu to handle edit and view details of a single contributions -->
            <q-btn
              unelevated
              color="primary"
              :label="$t('app.details')"
              no-caps
              class="view_savings"
              @click="onViewAllMemberContributions(props.row)"
              :style="$q.platform.is.mobile ? 'width:100px' : 'width:100px'"
              :to="{
                name: 'member_contributions',
                params: {
                  item_id: props.row.payment_item_id,
                  id: props.row.user_id,
                },
              }"
            >
              <q-icon name="visibility" class="q-pl-sm eye_icon"></q-icon>
            </q-btn>
          </q-td>
        </q-tr>
        <!-------------------------------------------------------------------END OF ALL CONTRIBUTIONS---------------------------->

        <!------------------------------------------------------------MEMBER CONTRIBUTIONS------------------------------------------>
        <q-tr :props="props" v-if="show_member_contribution">
          <q-td
            key="quarterly_name"
            :props="props"
            v-if="props.row.payment_item_frequency === 'QUARTERLY'"
            class="table_value"
          >
            {{ props.row.quarterly_name }}
          </q-td>
          <q-td
            key="quarterly_name"
            :props="props"
            v-if="props.row.payment_item_frequency === 'MONTHLY'"
            class="table_value"
          >
            {{ props.row.month_name }}
          </q-td>
          <q-td
            key="quarterly_name"
            :props="props"
            v-if="props.row.payment_item_frequency === 'ONE_TIME'"
            class="table_value"
          >
            {{ formatConstants(props.row.payment_item_frequency) }}
          </q-td>
          <q-td
            key="quarterly_name"
            :props="props"
            v-if="props.row.payment_item_frequency === 'YEARLY'"
            class="table_value"
          >
            {{ props.row.payment_item_frequency }}
          </q-td>
          <q-td key="amount_deposited" :props="props" class="table_value">
            {{ Number(props.row.amount_deposited).toLocaleString() }}
          </q-td>
          <q-td key="balance" :props="props" class="table_value">
            {{ Number(props.row.balance).toLocaleString() }}
          </q-td>
          <q-td
            key="status"
            :props="props"
            class="registered table_value"
            v-if="props.row.status === 'COMPLETE'"
          >
            {{ props.row.status }}
          </q-td>
          <q-td
            key="status"
            :props="props"
            class="not_registered table_value"
            v-if="props.row.status === 'INCOMPLETE'"
          >
            {{ props.row.status }}
          </q-td>
          <q-td key="date" :props="props" class="table_value">
            {{ getDate(props.row.created_at) }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'PENDING'"
            class="text-info table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'APPROVED'"
            class="registered table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve === 'DECLINED'"
            class="not_registered table_value"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              unelevated
              no-caps
              dense
              color="primary"
              class="view_savings"
              :label="$t('app.view')"
              @click="onViewContribution(props.row)"
              v-if="checkTreasurerRoleOnly()"
              :style="$q.platform.is.mobile ? 'width:100px' : 'width:100px'"
            >
              <q-icon name="visibility" class="q-pl-md eye_icon"></q-icon>
            </q-btn>
            <!-- menu to handle edit and view details of a single member contribution -->
            <q-btn flat round v-if="!checkTreasurerRoleOnly()">
              <q-icon
                name="menu"
                size="xs"
                color="primary"
                class="menu_icon"
                clickable
              >
                <q-menu>
                  <q-list bordered separator style="width: 200px">
                    <!-- edit and view member contribution -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onViewContribution(props.row)"
                      v-if="show_member_contribution"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="info" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">{{
                          $t("app.view")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <!-- edit a contribution -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditContribution(props.row)"
                      v-if="
                        show_member_contribution && checkAdminPresidentRole()
                      "
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="edit" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">{{
                          $t("app.edit")
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-icon>
            </q-btn>
          </q-td>
        </q-tr>
        <!---------------------------------------------------------END OF CONTRIBUTIONS--------------------------------------------------->
      </template>
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          v-model="filter"
          :placeholder="$t('app.tableSearch')"
          v-if="$q.platform.is.desktop"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <div v-if="dialog">
      <ConfirmDialogVue
        :data="deleted_row"
        :type="type"
        :msg="delete_msg"
        :show_members="show_members"
        :show_income_activity="show_income_activity"
        :show_contribution="show_contribution"
        :show_delete_contribution="show_delete_contribution"
        @fetch-members="fetchMembers"
        @cancel-dialog="cancelDialog"
        @delete-row="deleteRow"
      ></ConfirmDialogVue>
    </div>

    <!-- dialog for invite members. -->
    <q-dialog v-model="show_invite">
      <q-card
        :style="$q.platform.is.desktop ? 'width: 350px' : 'width: 450px'"
        class="q-pt-sm q-pb-md"
        :class="$q.platform.is.desktop ? 'q-px-sm' : ''"
      >
        <q-card-section>
          <div class="q-py-md heading text-center">
            {{ $t("app.inviteMsg") }}
          </div>
          <div v-if="show_invite">
            <label class="form_field">{{ $t("app.membersName") }}</label>
            <q-input
              v-model="member_invite_name"
              outlined
              dense
              disable
              hide-bottom-space
            />
          </div>
          <div class="q-pt-md">
            <label class="form_field"
              >{{ $t("app.selectRole") }} <span class="text-red">*</span></label
            >
            <q-select
              v-model="selected_role"
              outlined
              dense
              :options="roles"
              hide-bottom-space
            />
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row justify-center">
            <q-btn
              icon-right="send"
              label="Send Invitation"
              no-caps
              color="primary"
              class="full-width"
              @click="onSendInvitation()"
              :loading="loading_invitation"
              :disable="validateMemberInvite"
            >
              <q-tooltip>{{ $t("app.inviteVia") }}</q-tooltip></q-btn
            >
          </div>
        </q-card-section>

        <q-card-actions class="justify-end q-mb-md">
          <q-btn
            flat
            label="Close"
            class="q-mr-md"
            color="primary"
            v-close-popup
            size="sm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- confirmation dialog for approve and decline row data -->
    <q-dialog v-model="show_approve_dialog" v-if="show_approve_dialog">
      <q-card class="q-pa-sm">
        <q-card-section>
          <div class="row">
            <div class="col-md-12">
              <label class="warning_msg">
                <span class="text-weight-bold"
                  >{{ $t("app.doYouKnow") }}{{ chosen_state }}
                  {{ approve_msg }}?</span
                >
              </label>
            </div>

            <div v-if="show_members" class="text-red q-mt-md">
              <div class="text-weight-bold text-left record_label">
                {{ $t("app.nameLabel") }}:
                <span class="q-pl-lg">{{ approve_data.name }}</span>
              </div>

              <div class="text-weight-bold text-left record_value">
                {{ $t("app.amount") }}:
                <span class="amount"
                  >{{ Number(registration_amount).toLocaleString() }} XAF</span
                >
              </div>
            </div>
            <div v-if="show_income_activity" class="text-red">
              <div class="text-weight-bold text-left record_label">
                {{ $t("app.contributor") }}:
                <span class="q-pl-lg">{{ contributor }}</span>
              </div>

              <div class="text-weight-bold text-left record_value">
                {{ $t("app.amount") }}:
                <span class="q-pl-xl"
                  >{{ Number(income_amount).toLocaleString() }} XAF</span
                >
              </div>
            </div>

            <div v-if="show_contribution" class="q-mt-md">
              <div class="text-weight-bold text-left text-red record_label">
                {{ $t("app.nameLabel") }}:
                <span class="q-pl-md">{{ approve_data.user_name }}</span>
              </div>

              <div class="text-weight-bold text-left text-red record_value">
                {{ $t("app.amount") }}:
                <span class="amount"
                  >{{
                    Number(approve_data.total_amount_deposited).toLocaleString()
                  }}
                  XAF</span
                >
              </div>
            </div>
            <div v-if="show_member_savings" class="q-mt-md text-red">
              <div class="text-weight-bold text-left record_label">
                {{ $t("app.member") }}:
                <span class="q-pl-sm">{{ contributor }}</span>
              </div>
              <div class="text-weight-bold text-left record_value">
                {{ $t("app.amount") }}:
                <span class="amount"
                  >{{ Number(income_amount).toLocaleString() }} XAF</span
                >
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-mx-sm">
          <q-btn
            :class="chosen_state === 'Approve' ? 'approve' : 'decline'"
            size="md"
            :label="$t('app.cancel')"
            flat
            v-close-popup
            no-caps
          />
          <q-btn
            :class="chosen_state === 'Approve' ? 'approve' : 'decline'"
            size="md"
            :label="chosen_state"
            flat
            @click="onChangeRecordState()"
            v-close-popup
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import UserSavingMixinVue from "src/mixins/UserSavingMixin.vue";
import IncomeActivityMixin from "src/mixins/IncomeActivityMixin.vue";
import { LocalStorage, Notify, Platform } from "quasar";
import moment from "moment";
import ContributionsMixinVue from "src/mixins/ContributionsMixin.vue";
import memberMixin from "src/mixins/memberMixin.vue";
import ConfirmDialogVue from "./ConfirmDialog.vue";
import HelperMixin from "src/mixins/HelperMixin.vue";
import CategoryConstants from "components/Constants/CategoryConstants";
import TransactionStatus from "components/Constants/TransactionStatus";

export default {
  mixins: [
    UserSavingMixinVue,
    IncomeActivityMixin,
    UserSavingMixinVue,
    ContributionsMixinVue,
    memberMixin,
    HelperMixin,
  ],

  mounted() {},

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
    show_members: {
      required: true,
      type: Boolean,
    },
    show_savings: {
      required: true,
      type: Boolean,
    },
    message: {
      type: String,
      required: true,
    },
    show_member_savings: {
      required: false,
      type: Boolean,
    },
    title: {
      required: false,
      type: String,
    },
    show_income_activity: {
      type: Boolean,
      required: true,
    },
    show_contribution: {
      type: Boolean,
      required: true,
    },
    show_delete_contribution: {
      type: Boolean,
      required: false,
    },
    show_member_contribution: {
      required: false,
      type: Boolean,
    },
    total_members: {
      required: false,
      type: Number,
    },
    total_income: {
      required: false,
      type: Number,
    },
    total_saving: {
      required: false,
      type: Number,
    },
    total_member_saving: {
      required: false,
      type: Number,
    },
    total_contribution: {
      required: false,
      type: Number,
      default: 0.0,
    },
    total_balance: {
      required: false,
      type: Number,
      default: 0.0,
    },
    pagination: {
      required: true,
      type: Object,
    },
    table_loading: {
      required: false,
      type: Boolean,
    },
  },

  data() {
    return {
      dialog: false,
      filter: "",
      deleted_row: null,
      show_invite: false,
      member_to_be_invited: null,
      redirect_url: process.env.REDIRECT_URL,
      show_approve_dialog: false,
      chosen_state: null,
      approve_msg: null,
      approve_data: null,
      register_member_name: null,
      type: null,
      delete_msg: "",
      show_confirm_dialog_detail: false,
      registration_amount: null,
      income_amount: 0,
      contributor: null,
      roles: ["TREASURER", "FINANCIAL_SECRETARY", "PRESIDENT"],
      member_invite_name: "",
      selected_role: "",
      loading_invitation: false,
      current_session_id: LocalStorage.getItem("data").current_session.id,
    };
  },

  computed: {
    getPagination: {
      get() {
        return this.pagination;
      },
      set(pagination) {
        return pagination;
      },
    },

    validateMemberInvite() {
      return this.selected_role === "";
    },
  },

  methods: {
    onRequest(props) {
      this.$emit("onRequest", props);
    },
    getDate(date) {
      return moment(date).format("MMMM Do YYYY");
    },

    onInviteMember(data) {
      this.show_invite = true;
      this.member_to_be_invited = data;
      this.member_invite_name = this.member_to_be_invited.name;
    },

    onSendInvitation() {
      let payload = {
        data: {
          user_id: this.member_to_be_invited.id,
          role: this.selected_role,
          user_name: this.member_to_be_invited.name,
          user_email: this.member_to_be_invited.email,
        },
        url: `/api/protected/organisations/members/send_invitation`,
        msg: "none",
        color: "default",
        to_on_ok: "none",
        status: "success",
        to_on_fail: "none",
        show_feedback: false,
        error_msg: "none",
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading_invitation = true;
      this.$store
        .dispatch("postRequest", payload)
        .then((response) => {
          if (response.status === 200) {
            Notify.create({
              type: "positive",
              color: "positive",
              message: this.$t("app.memberInviteSuccess"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          } else if (response.status === 403) {
            Notify.create({
              type: "info",
              color: "info",
              message: this.$t("app.oneMemberRoleWarningMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          } else if (response.status === 427) {
            Notify.create({
              type: "info",
              color: "info",
              message: this.$t("app.expirationTermNotCompletedMsg"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          } else {
            Notify.create({
              type: "negative",
              color: "negative",
              message: this.$t("app.memberInviteFail"),
              position: Platform.is.mobile ? "bottom" : "top-right",
            });
          }
        })
        .finally(() => {
          this.show_invite = false;
          this.loading_invitation = false;
        });
    },

    checkAdminPresidentRole() {
      const president_role = LocalStorage.getItem("data").user_data.roles.find(
        (role) => role.name === "PRESIDENT" || role.name === "ADMIN"
      );
      return president_role !== undefined;
    },

    isRegisterEnabled() {
      if (
        this.$store.getters.getRegAmount === null ||
        this.$store.getters.getRegAmount === undefined
      ) {
        return false;
      }
      return this.$store.getters.getRegAmount.status === "ACTIVE";
    },

    checkRole() {
      const president_role = LocalStorage.getItem("data").user_data.roles.find(
        (role) =>
          role.name === "PRESIDENT" ||
          role.name === "FINANCIAL_SECRETARY" ||
          role.name === "ADMIN"
      );

      return president_role !== undefined && this.isRegisterEnabled();
    },

    onRegisterMember(data) {
      let payload = {
        data: data,
        tab: "Register Member",
      };
      this.$store.dispatch("setMemberToRegister", data);
      this.$emit("register-member", payload);
    },

    onViewMember(data) {
      this.getMemberProfile(data.id);
      this.$router.push({ name: "member_profile", params: { id: data.id } });

      const intermediate_tabs = Array.from(
        this.$store.getters.getIntermediateTabs
      );

      const exist_tab = intermediate_tabs.find(
        (tab) => tab.name === "Member Profile"
      );
      if (exist_tab === undefined) {
        intermediate_tabs.push({
          name: "Member Profile",
          has_intermediate_tab: true,
        });
      }

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);
    },

    fetchMembers() {
      return this.$emit("fetch-members");
    },

    onDeleteMember(data) {
      this.deleted_row = data;
      this.dialog = true;
      this.type = "MEMBERS";
      this.delete_msg = this.$t("app.deleteMemberWarningMsg");
    },

    onDeleteIncomeActivity(data) {
      this.deleted_row = data;
      this.dialog = true;
      this.type = "INCOME_ACTIVITIES";
      this.delete_msg = this.$t("app.deleteIncomeWarningMsg");
    },

    deleteRow() {
      this.$emit("delete-row", this.deleted_row);
    },

    checkPresidentTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").user_data.roles.find(
        (role) => role.name === "TREASURER" || "PRESIDENT"
      );
      return treasurer_role !== undefined;
    },

    onApprovedRecord(row, state) {
      this.show_approve_dialog = true;
      this.approve_data = row;
      this.chosen_state = state;
      this.setApproveWarningMsgByType(row);
    },

    onDeclineRecord(row, state) {
      this.show_approve_dialog = true;
      this.approve_data = row;
      this.chosen_state = state;
      this.setApproveWarningMsgByType(row);
    },

    onChangeRecordState() {
      let payload = {
        url: this.setApproveUrlBaseOnType(this.approve_data),
        msg: this.setApproveFeedbackMsg(this.approve_data),
        data:
          this.approve_data.type === CategoryConstants.MEMBERS_CONTRIBUTIONS
            ? this.setApproveContributionPayload(this.approve_data)
            : null,
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
      this.$store.dispatch("putRequest", payload).then((res) => {
        if (res) {
          this.fetchDataBaseOnTypeAfterApprove(this.approve_data);
        }
      });
    },

    setApproveUrlBaseOnType(data) {
      let url = "";
      let type =
        this.chosen_state === CategoryConstants.Approve
          ? TransactionStatus.APPROVED
          : TransactionStatus.DECLINED;
      switch (data.type) {
        case CategoryConstants.INCOME_ACTIVITIES:
          url = `/api/protected/income-activities/${data.id}/approve?type=${type}`;
          break;
        case CategoryConstants.MEMBER_SAVINGS:
          url = `/api/protected/user-savings/${data.id}?type=${type}`;
          break;
        case CategoryConstants.MEMBERS_CONTRIBUTIONS:
          url = `/api/protected/contributions/approve`;
          break;
        case CategoryConstants.MEMBERS:
          url = `/api/protected/members-registration/approve?user_id=${data.id}&status=${type}&session_id=${data.registered.session_id}`;
          break;
      }

      return url;
    },

    setApproveFeedbackMsg(data) {
      let msg =
        this.$t("app.recordWas") +
        `${this.chosen_state}` +
        this.$t("app.successfull");
      if (data.type === CategoryConstants.MEMBERS) {
        msg =
          this.$t("app.memberReg") +
          `${this.chosen_state}` +
          " " +
          this.$t("app.successfull");
      }
      return msg;
    },

    setApproveWarningMsgByType(data) {
      let date = "";
      switch (data.type) {
        case CategoryConstants.INCOME_ACTIVITIES:
          this.income_amount = data.amount;
          this.contributor = data.name;
          this.approve_msg =
            this.$t("app.contributionFor") + `${data.payment_item.name}`;
          break;
        case CategoryConstants.MEMBER_SAVINGS:
          date = moment(data.created_at).format("MMMM Do YYYY");
          this.income_amount = data.amount_deposited;
          this.contributor = data.user_name;
          this.approve_msg = this.$t("app.memberContribution") + `${date}`;
          break;
        case CategoryConstants.MEMBERS_CONTRIBUTIONS:
          date = moment(data.date).format("MMMM Do YYYY");
          this.approve_msg =
            this.$t("app.memberContributionDownloadLabel") +
            `${data.payment_item_name}` +
            this.$t("app.on") +
            `${date}`;
          break;
        case CategoryConstants.MEMBERS:
          this.register_member_name = data.name;
          this.approve_msg =
            this.$t("app.regFor") +
            `${LocalStorage.getItem("data").current_session.year}`;
          break;
      }
      return this.approve_msg;
    },

    fetchDataBaseOnTypeAfterApprove(data) {
      const route_data = Object.assign({}, this.$route.query);

      let organisation_id =
        LocalStorage.getItem("data").subscription.organisation.id;
      let session_id = this.current_session_id;
      let status = route_data.status !== undefined ? route_data.status : "";
      let name = route_data.name !== undefined ? route_data.name : "";
      let amount_deposited =
        this.$route.amount_deposited !== undefined
          ? route_data.amount_deposited
          : "";
      let month = route_data.month !== undefined ? route_data.month : "";
      let date = route_data.date ? route_data.date : "";
      let range = route_data.range ? route_data.range : "";
      switch (data.type) {
        case CategoryConstants.INCOME_ACTIVITIES:
          this.getOrganisationIncomeActivities(organisation_id, 1, 10);
          break;
        case CategoryConstants.MEMBER_SAVINGS:
          this.getMemberSavings(data.user_id, 1, 10, month, status);
          break;
        case CategoryConstants.MEMBERS_CONTRIBUTIONS:
          let payload = {
            payment_item_id: data.payment_item_id,
            year: data.session_id,
          };
          this.filterMembersContributions(
            payload,
            session_id,
            status,
            month,
            date,
            range,
            amount_deposited,
            1,
            10
          );
          this.$store.dispatch("setSearchContributionParams", {
            item: {
              label: data.payment_item_name,
              value: data.payment_item_id,
            },
          });
          break;
        case CategoryConstants.MEMBERS:
          this.filterOrganisationMembers(
            organisation_id,
            true,
            1,
            10,
            "name",
            "",
            "",
            "",
            ""
          );
          break;
      }
    },

    setApproveContributionPayload(data) {
      let type =
        this.chosen_state === CategoryConstants.Approve
          ? TransactionStatus.APPROVED
          : TransactionStatus.DECLINED;
      return {
        payment_item_id: data.payment_item_id,
        user_id: data.user_id,
        session_id: data.session_id,
        type: type,
      };
    },

    cancelDialog() {
      this.type = null;
      this.dialog = false;
    },

    showMemberSavings(data) {
      this.$emit("fetch-member-saving", data);
      const intermediate_tabs = Array.from(
        this.$store.getters.getIntermediateTabs
      );

      const exist_tab = intermediate_tabs.find(
        (tab) => tab.name === data.user_name + " " + "Savings"
      );
      if (exist_tab === undefined) {
        intermediate_tabs.push({
          name: data.user_name + " " + "Savings",
          has_intermediate_tab: true,
        });
      }

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);
    },

    onEditMemberSaving(data) {
      let payload = {
        data: data,
        tab: "Savings",
      };
      this.$store.dispatch("setUpdatedMemberSaving", data);
      if (this.checkPresidentOrAdminRole()) {
        let transactionHistoryPayload = {
          data: data,
          tab: "Change User Saving History",
        };
        this.$emit("update-user-saving-history", transactionHistoryPayload);
      } else {
        this.$emit("edit-member-saving", payload);
      }
    },

    onViewMemberSaving(data) {
      let payload = {
        data: data,
        tab: "View Member Saving",
      };
      this.$store.dispatch("setCurrentMemberSaving", data);
      this.$emit("view-member-saving", payload);
    },

    onEditIncomeActivity(data) {
      let payload = {
        data: data,
        tab: "Income Activities",
      };
      this.$store.dispatch("setUpdatedIncomeActivity", data);

      if (this.checkPresidentOrAdminRole()) {
        let transactionHistoryPayload = {
          data: data,
          tab: "Change Income Activity History",
        };
        this.$emit("update-income-activity-history", transactionHistoryPayload);
      } else {
        this.$emit("edit-income-activity", payload);
      }
    },

    onViewIncomeActivity(data) {
      let payload = {
        data: data,
        tab: "View Income Activity",
      };
      this.$store.dispatch("setCurrentIncomeActivity", data);

      this.$emit("view-income-activity", payload);
    },

    onViewAllMemberContributions(data) {
      const intermediate_tabs = Array.from(
        this.$store.getters.getIntermediateTabs
      );
      const exist_tab = intermediate_tabs.find(
        (tab) => tab.name === data.user_name + " Contributions"
      );
      if (exist_tab === undefined) {
        intermediate_tabs.push({
          name: data.user_name + " Contributions",
          has_intermediate_tab: true,
        });
      }

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);

      this.$router.replace({
        name: "member_contributions",
        params: { item_id: data.payment_item_id, id: data.user_id },
      });
    },

    onViewContribution(data) {
      let payload = {
        data: data,
        tab: "View Contribution",
      };

      this.$store.dispatch("setSelectedContribution", data);

      this.$emit("view-contribution", payload);
    },

    onAllContribution(data) {
      this.$router.push({
        name: "member_contributions",
        params: { id: data.id },
      });
    },

    onEditContribution(data) {
      let payload = {
        data: data,
        tab: "Edit Member Contribution",
      };
      this.$store.dispatch("setSelectedContribution", data);

      if (this.checkPresidentOrAdminRole()) {
        let transactionHistoryPayload = {
          data: data,
          tab: "Change User Contribution Transaction",
        };
        this.$emit(
          "update-user-contribution-transaction",
          transactionHistoryPayload
        );
      } else {
        this.$emit("edit-contribution", payload);
      }
    },

    onDeleteContribution(data) {
      this.deleted_row = data;
      this.dialog = true;
      this.type = CategoryConstants.MEMBERS_CONTRIBUTIONS;
      this.delete_msg = this.$t("app.deleteContributionWarningMsg");
    },
  },
  components: {
    ConfirmDialogVue,
  },
};
</script>
<style lang="scss" scoped>
.invite_card {
  width: 100%;
  max-width: 460px;
}

.view_items {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem;
  align-items: center;
  text-transform: capitalize;
  width: 8rem;
}

.button {
  text-align: end;
}

.menu_icon {
  cursor: pointer;
}

.edit {
  color: $primary;
  font-size: 0.8rem;
}

.invite {
  color: $dark;
}

.view_savings {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.7rem;
  align-items: center;
  text-transform: capitalize;
}

.view_income {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.7rem;
  text-transform: capitalize;
  color: $primary;
  width: 5.5rem;
}

.view_contribution {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  text-transform: capitalize;
  color: $primary;
  width: 5.7rem;
}

.heading {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem;
  color: $primary;
}

.dialog_button {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.approve_btn {
  background-color: $secondary;
  color: white;
  margin-right: 2.5rem;
  width: 4.2rem;
  font-size: 0.8rem;
}

.decline_btn {
  background-color: $orange;
  color: white;
  margin-right: 2.5rem;
  font-size: 0.8rem;
  width: 4.2rem;
}

.approve {
  color: $secondary;
}

.decline {
  color: $orange;
}

.title {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem;
}

.message {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem;
  color: $primary;
}

.name {
  margin-left: 1.8rem;
  font-size: 0.8rem;
}

.date {
  margin-left: 2.6rem;
}

.amount {
  margin-left: 0.8rem;
}

.payment_item_name {
  margin-left: 1.8rem;
}

.member_name {
  margin-left: 2.1rem;
}

.total_label {
  font-size: 13px;
}

.total_value {
  padding-left: 2rem;
  font-size: 13px;
}

.not_registered {
  color: $orange;
}

.registered {
  color: $secondary;
}

.warning_caption {
  color: $grey2;
  font-weight: 500;
  font-size: 15px;
}

.summary {
  font-size: 15px;
}

.paginate {
  float: right;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.7rem;
  align-items: center;
  color: $grey5;
}

.table_value {
  font-size: 0.7rem;
  font-weight: 500;
}

.delete_text {
  font-size: 0.8rem;
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

.eye_icon {
  font-size: 0.7rem;
}
</style>
