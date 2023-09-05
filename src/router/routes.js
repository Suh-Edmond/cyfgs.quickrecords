const routes = [
  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"),
    redirect: "/auth/login",
    meta: {
      middleware: "guest",
      firstTimer: true,
      enableSignUp: true,
    },
    children: [
      {
        name: "Login",
        path: "auth/login",
        component: () => import("src/pages/Auth/Login.vue"),
        meta: {
          middleware: "guest",
          firstTimer: true,
          enableSignUp: true,
        },
      },
      {
        name: "Register",
        path: "auth/register",
        component: () => import("src/pages/Auth/Register.vue"),
        meta: {
          middleware: "guest",
          enableSignUp: true,
        },
      },
      {
        name: "PasswordResetToken",
        path: "auth/password-reset/get-token",
        component: () => import("src/pages/Auth/PasswordResetToken.vue"),
        meta: {
          middleware: "guest",
          enableSignUp: true,
        },
      },
      {
        name:"PasswordReset",
        path:"/auth/password-reset",
        component:() => import("src/pages/Auth/ResetPassword.vue"),
        meta: {
          middleware: "guest",
          enableSignUp: true,
        },
      },
      {
        name: "create_organisation",
        path: "organisation/create",
        component: () =>
          import("src/pages/Organisation/CreateOrganisation.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
        },
      },
    ],
  },
  {
    path: "/auth/invite-member",
    component: () => import("layouts/AuthLayout.vue"),
    redirect: "/auth/set-password",
    meta: {
      middleware: "guest",
      firstTimer: true,
    },
    children: [
      {
        name: "Set_Password",
        path: "/auth/set-password",
        component: () => import("src/pages/Auth/SetPassword.vue"),
        meta: {
          middleware: "guest",
          firstTimer: true,
          enableSignUp: false,
        },
      },
    ],
  },
  {
    path: "/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middleware: "auth",
      role: "MEMBER",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("src/pages/Dashboard/Dashboard.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },
      {
        name: "organisation",
        path: "/dashboard/organisation-management",
        component: () =>
          import("src/pages/Organisation/OrganisationManagment.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },
      {
        name: "payment_category",
        path: "/dashboard/payment-categories",
        component: () =>
          import("src/pages/Payment/PaymentCategoryManagement.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },
      {
        name: "payment_items",
        path: "/dashboard/payment-categories/:id/items",
        component: () => import("src/pages/Payment/PaymentItemManagement.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: true,
        },
      },
      {
        name: "members",
        path: "/dashboard/members",
        component: () => import("src/pages/Member/MemberManagement.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },
      {
        name: "member_profile",
        path: "/dashboard/members/:id/profile",
        component: () => import("src/pages/Member/MemberProfile.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },
      {
        name: "expenditure_category",
        path: "/dashboard/expenditure-categories",
        component: () =>
          import("src/pages/Expenditure/ExpenditureCategory.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },
      {
        name: "expenditure_items",
        path: "/dashboard/expenditure-categories/:id/items",
        component: () => import("src/pages/Expenditure/ExpenditureItems.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: true,
        },
      },
      {
        name: "expenditure_item_details",
        path: "/dashboard/expenditure-categories/:id/items/:item_id/details",
        component: () =>
          import("src/pages/Expenditure/ExpenditureItemDetail.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: true,
        },
      },
      {
        name: "expenditures",
        path: "/dashboard/expenditures",
        component: () => import("src/pages/Expenditure/Expenditures.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: true,
        },
      },
      {
        name: "expenditure_detail",
        path: "/dashboard/expenditures/:id/details",
        component: () => import("src/pages/Expenditure/ExpenditureDetail.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: true,
        },
      },
      {
        name: "income_activity",
        path: "/dashboard/income-activities",
        component: () => import("src/pages/IncomeActivity/IncomeActivity.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },
      {
        name: "savings",
        path: "/dashboard/members-savings",
        component: () => import("src/pages/Saving/MembersSavings.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },
      {
        name: "user_savings",
        path: "/dashboard/members-savings/users/:id",
        component: () => import("src/pages/Saving/UserSavings.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },
      {
        name: "members_contributions",
        path: "/dashboard/contributions/payment-item",
        component: () => import("src/pages/Contribution/Contributions.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },
      {
        name: "member_contributions",
        path: "/dashboard/contributions/payment-item/:item_id/members/:id",
        component: () =>
          import("src/pages/Contribution/MemberContributions.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },

      {
        name: "member_account",
        path: "/dashboard/user/profile",
        component: () => import("src/pages/Account/Account.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },

      {
        name: "report_generation",
        path: "/dashboard/reports",
        component: () => import("src/pages/Report/ReportManagement.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },

      {
        name: "sponsorship",
        path: "/dashboard/sponsorship",
        component: () => import("src/pages/Sponsor/SponsorshipManagement.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },

      {
        name: "settings",
        path: "/dashboard/settings",
        component: () => import("src/pages/Settings/Settings.vue"),
        meta: {
          middleware: "auth",
          role: "MEMBER",
          has_intermediate_tab: false,
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
