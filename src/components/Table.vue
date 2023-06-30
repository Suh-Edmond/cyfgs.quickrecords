<template>
  <div class="q-pa-xs">
    <div class="button q-pb-xs"></div>
    <q-table
      :data="data"
      :columns="columns"
      row-key="index"
      :table-header-style="{ backgroundColor: '#5384ae', color: '#FFFFFF' }"
      :filter="filter"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top-left>
        <div
          class="text-h6 title"
          v-show="
            show_contribution ||
            show_member_contribution ||
            show_income_activity
          "
        >
          {{ title }}
        </div>
        <div class="text-h6 title" v-show="show_members">
          Organisation Members
        </div>
        <div class="text-h6 title" v-show="show_savings">Members Savings</div>
      </template>
      <template v-slot:body="props">
        <!-- body for members -->
        <q-tr :props="props" v-if="show_members">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>

          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>

          <q-td key="gender" :props="props">
            {{ props.row.gender }}
          </q-td>

          <q-td key="telephone" :props="props">
            {{ props.row.telephone }}
          </q-td>
          <q-td
            key="has_register"
            :props="props"
            v-if="props.row.has_register == 'NOT_REGISTERED'"
            class="not_registered"
          >
            {{ props.row.has_register }}
          </q-td>
          <q-td
            key="has_register"
            :props="props"
            v-if="props.row.has_register == 'REGISTERED'"
            class="registered"
          >
            {{ props.row.has_register }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'PENDING'"
            class="text-info"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'DECLINED'"
            class="not_registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'APPROVED'"
            class="registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="approve" :props="props" v-if="props.row.approve == ''">
          </q-td>

          <q-td key="year" :props="props">
            {{ props.row.year != null ? props.row.year : getCurrentYear.year }}
          </q-td>

          <q-td key="action" :props="props">
            <!-- buttons for approve and decline row data -->
            <q-btn
              class="decline_btn_saving"
              size="md"
              label="Decline"
              no-caps
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />

            <q-btn
              class="approve_btn"
              size="md"
              label="Approve"
              no-caps
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />

            <!-- button to handle edit, view and delete, invite and register  a member -->
            <q-btn flat round v-if="!checkTreasurerRole()">
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
                        <q-item-label class="edit">View Profile</q-item-label>
                      </q-item-section>
                    </q-item>
                    <!-- invite members to the app -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onInviteMember(props.row)"
                      v-if="checkPresidentRole()"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="share" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">Invite Member</q-item-label>
                      </q-item-section>
                    </q-item>

                    <!-- register members -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onRegisterMember(props.row)"
                      v-if="checkRole()"
                    >
                      <q-item-section avatar>
                        <span>
                          <q-icon name="person_add" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit"
                          >Register Member</q-item-label
                        >
                      </q-item-section>
                    </q-item>

                    <!-- deleted specify row -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDeleteMember(props.row)"
                      v-if="checkPresidentRole()"
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
        <!-- end of body for members -->

        <!-- body for members savings? -->
        <q-tr :props="props" v-if="show_savings && !checkTreasurerRole()">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="user_name" :props="props">
            {{ props.row.user_name }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="telephone" :props="props">
            {{ props.row.telephone }}
          </q-td>
          <q-td key="total_amount" :props="props">
            {{ Number(props.row.total_amount).toLocaleString() }}
          </q-td>
          <q-td key="date" :props="props">
            {{ getDate(props.row.date) }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'DECLINED'"
            class="not_registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="action" :props="props">
            <!-- buttons for approve and decline row data -->
            <q-btn
              class="decline_btn_saving"
              size="md"
              label="Decline"
              no-caps
              unelevated
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />

            <q-btn
              class="approve_btn"
              size="md"
              label="Approve"
              no-caps
              unelevated
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />
            <!-- button to handle view all member saving -->
            <q-btn
              unelevated
              no-caps
              dense
              color="primary"
              class="view_savings q-py-xs"
              label="All Savings"
              @click="showMemberSavings(props.row)"
              :to="{ name: 'user_savings', params: { id: props.row.user_id } }"
              v-if="show_savings && !checkTreasurerRole()"
            >
              <q-icon name="visibility" size="xs" class="q-pl-sm"></q-icon>
            </q-btn>
          </q-td>
        </q-tr>
        <!----------------------------------------------------END OF ALL SAVINGS---------------------------------------------->

        <!----------------------------------------------------END OF MEMBER SAVINGS--------------------------------------------->
        <q-tr :props="props" v-if="show_savings && checkTreasurerRole()">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="user_name" :props="props">
            {{ props.row.user_name }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="telephone" :props="props">
            {{ props.row.telephone }}
          </q-td>
          <q-td key="amount_deposited" :props="props">
            {{ Number(props.row.amount_deposited).toLocaleString() }}
          </q-td>
          <q-td key="amount_used" :props="props">
            {{ Number(props.row.amount_used).toLocaleString() }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'DECLINED'"
            class="not_registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'PENDING'"
            class="text-info"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'APPROVED'"
            class="registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="action" :props="props">
            <!-- buttons for approve and decline row data -->
            <q-btn
              class="decline_btn_saving"
              size="md"
              label="Decline"
              no-caps
              unelevated
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />

            <q-btn
              class="approve_btn"
              size="md"
              label="Approve"
              no-caps
              unelevated
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />
            <!-- button to handle view all member saving -->
            <q-btn
              unelevated
              no-caps
              dense
              color="primary"
              class="view_income q-px-sm q-mr-md"
              label="View"
              @click="onViewMemberSaving(props.row)"
            >
              <q-icon name="visibility" size="xs" class="q-pl-md"></q-icon>
            </q-btn>
          </q-td>
        </q-tr>
        <!-----------------------------------------------------------------------END OF ALL SAVINGS-------------------------------------------------------------------->

        <!---------------------------------------------------------------------------MEMBER SAVINGS--------------------------------------------------->
        <q-tr :props="props" v-if="show_member_savings">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="amount_deposited" :props="props">
            {{ Number(props.row.amount_deposited).toLocaleString() }}
          </q-td>
          <q-td key="amount_used" :props="props">
            {{ Number(props.row.amount_used).toLocaleString() }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'PENDING'"
            class="text-info"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'APPROVED'"
            class="registered"
          >
            {{ props.row.approve }}
          </q-td>

          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'DECLINED'"
            class="not_registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="date" :props="props">
            {{ getDate(props.row.date) }}
          </q-td>
          <q-td key="action" :props="props">
            <!-- menu to handle edit and view details of a single saving -->
            <q-btn
              flat
              round
              v-if="show_member_savings && !checkTreasurerRole()"
            >
              <q-icon
                name="menu"
                size="xs"
                color="primary"
                class="menu_icon"
                clickable
              >
                <q-menu>
                  <q-list bordered separator style="width: 180px">
                    <!-- edit and view savings -->
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
                        <q-item-label class="edit">Edit</q-item-label>
                      </q-item-section>
                    </q-item>

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
                        <q-item-label class="edit">View</q-item-label>
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
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="amount" :props="props">
            {{ Number(props.row.amount).toLocaleString() }}
          </q-td>
          <q-td key="date" :props="props">
            {{ getDate(props.row.date) }}
          </q-td>
          <q-td key="venue" :props="props">
            {{ props.row.venue }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'PENDING'"
            class="text-info"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'APPROVED'"
            class="registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'DECLINED'"
            class="not_registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="action" :props="props">
            <!-- button to handle view all activity -->
            <q-btn
              unelevated
              no-caps
              dense
              color="primary"
              class="view_income q-px-sm q-mr-md"
              label="View"
              @click="onViewIncomeActivity(props.row)"
              v-if="show_income_activity && checkTreasurerRole()"
            >
              <q-icon name="visibility" size="xs" class="q-pl-sm"></q-icon>
            </q-btn>

            <!-- buttons for approve and decline row data -->
            <q-btn
              class="decline_btn_income_activity"
              size="md"
              label="Decline"
              no-caps
              unelevated
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />

            <q-btn
              class="approve_btn_income_activity q-ml-md"
              size="md"
              label="Approve"
              no-caps
              unelevated
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />

            <!-- menu to handle edit and view details of a single show_income_activity -->
            <q-btn flat round v-if="!checkTreasurerRole()">
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
                      @click="onEditIncomeActivity(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
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
                      @click="onViewIncomeActivity(props.row)"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="visibility" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">View</q-item-label>
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
                        <q-item-label class="text-red">Delete</q-item-label>
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
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="user_name" :props="props">
            {{ props.row.user_name }}
          </q-td>
          <q-td key="total_amount_deposited" :props="props">
            {{ Number(props.row.total_amount_deposited).toLocaleString() }}
          </q-td>
          <q-td key="balance" :props="props">
            {{ Number(props.row.balance).toLocaleString() }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'PENDING'"
            class="text-info"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'APPROVED'"
            class="registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'DECLINED'"
            class="not_registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="action" :props="props">
            <!-- menu to handle edit and view details of a single contributions -->
            <q-btn
              unelevated
              color="primary"
              label="Details"
              no-caps
              class="view_items q-mr-md"
              icon-right="visibility"
              @click="onViewAllMemberContributions(props.row)"
              :to="{
                name: 'member_contributions',
                params: {
                  item_id: props.row.payment_item_id,
                  id: props.row.user_id,
                },
              }"
            >
            </q-btn>

            <!-- buttons for approve and decline row data -->
            <q-btn
              class="decline_btn_income_activity"
              label="Decline"
              no-caps
              unelevated
              @click="onDeclineRecord(props.row, 'Decline')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />

            <q-btn
              class="approve_btn_income_activity q-ml-md"
              label="Approve"
              no-caps
              unelevated
              @click="onApprovedRecord(props.row, 'Approve')"
              v-if="checkTreasurerRole() && props.row.approve == 'PENDING'"
            />
          </q-td>
        </q-tr>
        <!-------------------------------------------------------------------END OF ALL CONTRIBUTIONS---------------------------->

        <!------------------------------------------------------------MEMBER CONTRIBUTIONS------------------------------------------>
        <q-tr :props="props" v-if="show_member_contribution">
          <q-td key="counter" :props="props">
            {{ props.row.counter }}
          </q-td>
          <q-td key="user_name" :props="props">
            {{ props.row.user_name }}
          </q-td>
          <q-td key="amount_deposited" :props="props">
            {{ Number(props.row.amount_deposited).toLocaleString() }}
          </q-td>
          <q-td key="balance" :props="props">
            {{ Number(props.row.balance).toLocaleString() }}
          </q-td>
          <q-td key="status" :props="props" class="registered"  v-if="props.row.status == 'COMPLETE'">
            {{ props.row.status }}
          </q-td>
          <q-td key="status" :props="props" class="not_registered"  v-if="props.row.status == 'INCOMPLETE'">
            {{ props.row.status }}
          </q-td>
          <q-td key="date" :props="props">
            {{ getDate(props.row.date) }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'PENDING'"
            class="text-info"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'APPROVED'"
            class="registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td
            key="approve"
            :props="props"
            v-if="props.row.approve == 'DECLINED'"
            class="not_registered"
          >
            {{ props.row.approve }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              unelevated
              no-caps
              color="primary"
              class="view_income q-mr-md"
              label="View"
              @click="onViewContribution(props.row)"
              v-if="checkTreasurerRole()"
            >
              <q-icon name="visibility" size="xs" class="q-pl-md"></q-icon>
            </q-btn>
            <!-- menu to handle edit and view details of a single member contribution -->
            <q-btn flat round v-if="!checkTreasurerRole()">
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
                        <q-item-label class="edit">View</q-item-label>
                      </q-item-section>
                    </q-item>
                    <!-- edit a contribution -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onEditContribution(props.row)"
                      v-if="!show_member_contribution"
                    >
                      <q-item-section avatar class="q-mr-lg">
                        <span>
                          <q-icon name="edit" size="xs" class="edit" />
                        </span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="edit">Edit</q-item-label>
                      </q-item-section>
                    </q-item>
                    <!-- end of edit contribution -->
                    <q-item
                      clickable
                      v-close-popup
                      @click="onDeleteContribution(props.row)"
                      v-if="show_member_contribution"
                    >
                      <q-item-section avatar class="q-mr-lg">
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
        <!---------------------------------------------------------END OF CONTRIBUTIONS--------------------------------------------------->
      </template>
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          v-model="filter"
          :class="
            $q.screen.md
              ? 'text-h6-sm q-mb-lg q-mt-lg full-width'
              : 'text-h6-sm'
          "
          placeholder="Type name to search..."
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:bottom>
        <!-- members contributions -->
        <q-tr v-if="total_contribution > 0">
          <q-th
            class="text-bold total_label q-mt-md summary"
            v-if="show_contribution"
          >
            Total Members Contribution:
          </q-th>
          <q-th v-if="show_contribution" class="total_value">
            {{ Number(total_contribution).toLocaleString() }} XAF
          </q-th>
        </q-tr>
        <!-- member contribution -->
        <div class="text-bold q-pb-md" v-if="show_member_contribution">
          <div class="q-mt-md summary">
            Amount Contributed:
            <span class="total_value">
              {{ Number(total_contribution).toLocaleString() }} XAF
            </span>
          </div>
          <div class="q-my-md summary">
            <!-- member balance contribution -->
            <q-tr>
              Total Balance:
              <span class="total_contribution_balance">
                {{ Number(total_balance).toLocaleString() }} XAF
              </span>
            </q-tr>
          </div>
        </div>

        <!-- income  -->
        <q-tr>
          <q-th
            class="text-bold total_label q-mt-md summary"
            v-if="show_income_activity && total_income > 0"
          >
            Total Income:
          </q-th>
          <q-th
            class="total_value"
            v-if="show_income_activity && total_income > 0"
          >
            {{ Number(total_income).toLocaleString() }} XAF
          </q-th>
        </q-tr>

        <!-- members -->
        <q-tr>
          <q-th
            class="text-bold total_label q-mt-md summary"
            v-if="show_members && total_members > 0"
          >
            Total Members:
          </q-th>
          <q-th class="total_value" v-if="show_members && total_members > 0">
            {{ total_members }}
          </q-th>
        </q-tr>

        <!-- member savings-->
        <q-tr>
          <q-th
            class="text-bold total_label q-mt-md summary"
            v-if="show_member_savings && total_saving > 0"
          >
            Total Amount Saved:
          </q-th>
          <q-th
            class="total_value"
            v-if="show_member_savings && total_saving > 0"
          >
            {{ Number(total_saving).toLocaleString() }} XAF
          </q-th>
        </q-tr>

        <!-- members savings-->
        <q-tr>
          <q-th
            class="text-bold total_label q-mt-md summary"
            v-if="show_savings && total_saving > 0"
          >
            Total Members Savings:
          </q-th>
          <q-th class="total_value" v-if="show_savings && total_saving > 0">
            {{ Number(total_saving).toLocaleString() }} XAF
          </q-th>
        </q-tr>
      </template>
    </q-table>

    <div v-if="dialog">
      <ConfirmDialogVue
        :data="deleted_row"
        :type="type"
        :msg="delete_msg"
        :show_members="show_members"
        :show_income_activity="show_income_activity"
        @fetch-members="fetchMembers"
        @cancel-dialog="cancelDialog"
        @delete-row="deleteRow"
      ></ConfirmDialogVue>
    </div>

    <!-- dialog for invite members. -->
    <q-dialog v-model="show_invite" position="top">
      <q-card>
        <q-card-section>
          <div class="text-h6 q-pa-sm heading">
            Invite your Team Members to use Financial Assistance
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none" v-if="show_invite">
          <div class="row q-gutter-xl justify-center">
            <div v-if="member_to_be_invited.email != null">
              <q-btn
                flat
                icon="email"
                size="lg"
                :href="
                  'mailto:' +
                  member_to_be_invited.email +
                  '?subject=' +
                  invite_msg_subject +
                  '&cc=&bcc=&body=' +
                  invite_msg
                "
              >
                <q-tooltip>Invite via email</q-tooltip></q-btn
              >
            </div>
            <div>
              <q-btn flat color="secondary" size="sm" @click="whatsappInvite()"
                ><img src="../../src/assets/whatsapp.png" class="whatsapp_icon"
              /></q-btn>
              <q-tooltip>Invite via Whatsapp</q-tooltip>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- confirmation dialog for approve and decline row data -->
    <q-dialog v-model="show_approve_dialog" v-if="show_approve_dialog">
      <q-card class="approve_card q-pa-sm">
        <q-card-section>
          <div class="row">
            <div class="col-md-12">
              <label for="msg">
                <span class="text-weight-bold"
                  >Do you want to {{ chosen_state }} {{ approve_msg }} ?</span
                >
              </label>
            </div>

            <div v-if="show_members" class="text-red">
              <div class="text-weight-bold text-left">
                Name:
                <span class="q-pl-lg">{{ approve_data.name }}</span>
              </div>

              <div class="text-weight-bold text-left">
                Amount:
                <span class="amount"
                  >{{ Number(registration_amount).toLocaleString() }} XAF</span
                >
              </div>
            </div>
            <div v-if="show_income_activity" class="text-red">
              <div class="text-weight-bold text-left">
                Contributor:
                <span class="q-pl-lg">{{ contributor }}</span>
              </div>

              <div class="text-weight-bold text-left">
                Amount:
                <span class="q-pl-xl"
                  >{{ Number(income_amount).toLocaleString() }} XAF</span
                >
              </div>
            </div>

            <div v-if="show_contribution" class="q-mt-md">
              <div class="text-weight-bold text-left text-red">
                Name:
                <span class="q-pl-md">{{ approve_data.user_name }}</span>
              </div>

              <div class="text-weight-bold text-left text-red">
                Amount:
                <span class="amount"
                  >{{
                    Number(approve_data.total_amount_deposited).toLocaleString()
                  }}
                  XAF</span
                >
              </div>
            </div>
            <div v-if="show_savings" class="q-mt-md text-red">
              <div class="text-weight-bold text-left">
                Member:
                <span class="q-pl-sm">{{ contributor }}</span>
              </div>
              <div class="text-weight-bold text-left">
                Amount:
                <span class="amount"
                  >{{ Number(income_amount).toLocaleString() }} XAF</span
                >
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-my-md q-mx-sm">
          <q-btn
            :class="chosen_state == 'Approve' ? 'approve' : 'decline'"
            size="md"
            label="Cancel"
            flat
            v-close-popup
            no-caps
          />
          <q-btn
            :class="chosen_state == 'Approve' ? 'approve' : 'decline'"
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
import { LocalStorage } from "quasar";
import moment from "moment";
import ContributionsMixinVue from "src/mixins/ContributionsMixin.vue";
import memberMixin from "src/mixins/memberMixin.vue";
import ConfirmDialogVue from "./ConfirmDialog.vue";
import CurrentYearMixin from "src/mixins/CurrentYearMixin.vue";

export default {
  mixins: [
    UserSavingMixinVue,
    IncomeActivityMixin,
    UserSavingMixinVue,
    ContributionsMixinVue,
    memberMixin,
    CurrentYearMixin,
  ],

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
  },
  data() {
    return {
      loading: false,
      dialog: false,
      filter: "",
      pagination: {
        rowsPerPage: 15, // current rows per page being displayed
      },
      deleted_row: null,
      show_invite: false,
      member_to_be_invited: null,
      redirect_url: process.env.REDIRECT_URL,
      invite_msg_subject: "Invitation to Join Financial Assistance",
      invite_msg:
        "Hello there! You have been invited to join Financial Assistance in order to better manage your financial transaction.  " +
        "Click the link to join: " +
        process.env.REDIRECT_URL +
        ".  If you don't recognize the sender, simply ignore this message.",
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
    };
  },

  computed: {},

  methods: {
    getDate(date) {
      return moment(date).format("MMMM Do YYYY");
    },

    onInviteMember(data) {
      this.show_invite = true;
      this.member_to_be_invited = data;
    },

    whatsappInvite() {
      let msg = this.invite_msg_subject + "\n\n" + this.invite_msg;
      let whatsapp_url = `https://api.whatsapp.com/send?phone=${
        this.member_to_be_invited.telephone
      }&text=${encodeURIComponent(msg)}`;
      window.open(whatsapp_url);
    },

    checkPresidentRole() {
      const president_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name == "PRESIDENT"
      );
      return president_role != undefined;
    },

    checkRole() {
      const president_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name == "PRESIDENT" || role.name == "FINANCIAL_SECRETARY"
      );
      return president_role != undefined;
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

      intermediate_tabs.push({
        name: "Member Profile",
        has_intermediate_tab: true,
      });

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);
    },

    fetchMembers() {
      return this.$emit("fetch-members");
    },

    onDeleteMember(data) {
      this.deleted_row = data;
      this.dialog = true;
      this.type = "MEMBERS";
      this.delete_msg = "Are you sure you want to delete this Member ?";
    },

    onDeleteIncomeActivity(data) {
      this.deleted_row = data;
      this.dialog = true;
      this.type = "INCOME_ACTIVITIES";
      this.delete_msg =
        "Are you sure you want to delete this Income Activity ?";
    },

    deleteRow() {
      this.$emit("delete-row", this.deleted_row);
    },

    checkTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name == "TREASURER"
      );
      return treasurer_role != undefined;
    },

    checkPresidentTreasurerRole() {
      const treasurer_role = LocalStorage.getItem("data").roles.find(
        (role) => role.name == "TREASURER" || "PRESIDENT"
      );
      return treasurer_role != undefined;
    },

    onApprovedRecord(row, state) {
      this.registration_amount = this.$store.getters.getRegAmount.amount;
      this.show_approve_dialog = true;
      this.approve_data = row;
      this.chosen_state = state;
      this.setApproveWarningMsgByType(row);
    },

    onDeclineRecord(row, state) {
      this.registration_amount = this.$store.getters.getRegAmount.amount;
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
          this.approve_data.type == "MEMBERS_CONTRIBUTIONS"
            ? this.setApproveContributionPayload(this.approve_data)
            : null,
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
      this.$store.dispatch("putRequest", payload).then((res) => {
        if (res) {
          this.fetchDataBaseOnTypeAfterApprove(this.approve_data);
        }
      });
    },

    setApproveUrlBaseOnType(data) {
      let url = "";
      let type = this.chosen_state == "Approve" ? "APPROVED" : "DECLINED";
      switch (data.type) {
        case "INCOME_ACTIVITIES":
          url = `/api/protected/income-activities/${data.id}/approve?type=${type}`;
          break;
        case "MEMBERS_SAVINGS":
          url = `/api/protected/user-savings/${data.id}?type=${type}`;
          break;
        case "MEMBERS_CONTRIBUTIONS":
          url = `/api/protected/contributions/approve`;
          break;
        case "MEMBERS":
          url = `/api/protected/members-registration/approve?user_id=${data.id}&status=${type}&session_id=${data.session_id}`;
          break;
      }

      return url;
    },

    setApproveFeedbackMsg(data) {
      let msg = `Record was ${this.chosen_state} successfully`;
      if (data.type == "MEMBERS") {
        msg = `Member registration ${this.chosen_state} successfully`;
      }
      return msg;
    },

    setApproveWarningMsgByType(data) {
      let date = "";
      switch (data.type) {
        case "INCOME_ACTIVITIES":
          this.income_amount = data.amount;
          this.contributor = data.name;
          this.approve_msg = ` Contribution for ${data.payment_item.name}`;
          break;
        case "MEMBERS_SAVINGS":
          date = moment(data.created_at).format("MMMM Do YYYY");
          this.income_amount = data.amount_deposited;
          this.contributor = data.user_name;
          this.approve_msg = `Member Saving on the ${date}`;
          break;
        case "MEMBERS_CONTRIBUTIONS":
          date = moment(data.date).format("MMMM Do YYYY");
          this.approve_msg = `Member's Contribution for ${data.payment_item_name} on the ${date}`;
          break;
        case "MEMBERS":
          this.register_member_name = data.name;
          this.approve_msg = `Member Registration for ${data.year} `;
          break;
      }
      return this.approve_msg;
    },

    fetchDataBaseOnTypeAfterApprove(data) {
      const route_data = Object.assign({}, this.$route.query);

      let organisation_id = route_data.organisation_id;
      let session_id = route_data.session_id;
      let status = route_data.status != undefined ? route_data.status : "";
      let name = route_data.name != undefined ? route_data.name : "";
      let amount_deposited =
        this.$route.amount_deposited != undefined
          ? route_data.amount_deposited
          : "";
      let month = route_data.month != undefined ? route_data.month : "";
      let date = route_data.date ? route_data.date : "";
      let range = route_data.range ? route_data.range : "";
      let search_savings_url = "";

      switch (data.type) {
        case "INCOME_ACTIVITIES":
          this.getOrganisationIncomeActivities(
            this.$store.getters.getOrganisation.id
          );
          break;
        case "MEMBERS_SAVINGS":
          search_savings_url = `/api/protected/user-savings?organisation_id=${this.$store.getters.getOrganisation.id}&status=${status}&name=${name}&amount_deposited=${amount_deposited}&session_id=${session_id}&month=${month}&date=${date}&date_range=${range}`;
          this.filterSaving(search_savings_url);
          break;
        case "MEMBERS_CONTRIBUTIONS":
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
            amount_deposited
          );
          break;
        case "MEMBERS":
          this.getOrganisationMembers(
            this.$store.getters.getOrganisation.id,
            true
          );
          break;
      }
    },

    setApproveContributionPayload(data) {
      let type = this.chosen_state == "Approve" ? "APPROVED" : "DECLINED";
      let payload = {
        payment_item_id: data.payment_item_id,
        user_id: data.user_id,
        session_id: data.session_id,
        type: type,
      };

      return payload;
    },

    cancelDialog() {
      this.type = null;
      this.dialog = false;
    },

    showMemberSavings(data) {
      this.getMemberSavings(data.user_id);
      const intermediate_tabs = Array.from(
        this.$store.getters.getIntermediateTabs
      );

      intermediate_tabs.push({
        name: data.user_name + "  Savings",
        has_intermediate_tab: true,
      });

      this.$store.dispatch("setIntermediateTabs", intermediate_tabs);
    },

    onEditMemberSaving(data) {
      let payload = {
        data: data,
        tab: "Member Savings",
      };
      this.$store.dispatch("setUpdatedMemberSaving", data);
      this.$emit("edit-member-saving", payload);
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

      this.$emit("edit-income-activity", payload);
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
      this.$router.push({
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

      this.$emit("edit-contribution", payload);
    },

    onDeleteContribution(data) {},
  },
  components: {
    ConfirmDialogVue,
  },
};
</script>
<style lang="scss" scoped>
.view_items {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  align-items: center;
  text-transform: capitalize;
}
.button {
  text-align: end;
}

.menu_icon {
  cursor: pointer;
}

.edit {
  color: $primary;
}

.invite {
  color: $dark;
}

.warning_image {
  color: yellow;
}

.view_savings {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  align-items: center;
  text-transform: capitalize;
  }

.view_income {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  text-transform: capitalize;
  color: $primary;
}

.heading {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 25px;
  align-items: left;
  letter-spacing: 0.01em;
  color: $dark;
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
}

.approve_btn_income_activity {
  background-color: $secondary;
  color: white;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  align-items: center;
  text-transform: capitalize;
}

.approve_card {
  width: 25rem;
}

.decline_btn {
  background-color: $orange;
  color: white;
}

.decline_btn_saving {
  background-color: $orange;
  color: white;
  margin-right: 3rem;
}

.decline_btn_income_activity {
  background-color: $orange;
  color: white;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  align-items: center;
  text-transform: capitalize;
}

.approve {
  color: $secondary;
}

.decline {
  color: $orange;
}

.title {
  font-size: small;
  font-weight: bold;
}

.message {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  align-items: center;
  letter-spacing: 0.01em;
  color: $grey2;
}

.name {
  margin-left: 1.8rem;
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

.total_contribution_balance {
  padding-left: 4.2rem;
}

.whatsapp_icon {
  width: 2.7rem;
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
</style>
