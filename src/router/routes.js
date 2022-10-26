const routes = [
  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"),
    redirect: "/auth/login",
    meta: {
      middleware: "guest",
      firstTimer: true,
    },
    children: [
      {
        name: "Login",
        path: "auth/login",
        component: () => import("src/pages/Auth/Login.vue"),
        meta: {
          middleware: "guest",
          firstTimer: true,
        },
      },
      {
        name: "Register",
        path: "auth/register",
        component: () => import("src/pages/Auth/Register.vue"),
        meta: {
          middleware: "guest",
        },
      },
    ],
  },
  {
    path: "/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      middleware: "auth",
      role: "USER",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("src/pages/Dashboard/Dashboard.vue"),
        meta: {
          middleware: "auth",
          role: "USER",
        },
      },
      {
        name: "organisation",
        path: "/dashboard/organisation-management",
        component: () =>
          import("src/pages/Organisation/OrganisationManagment.vue"),
        meta: {
          middleware: "auth",
          role: "USER",
        },
      },
      {
        name: "payment_category",
        path: "/dashboard/payment-categories",
        component: () =>
          import("src/pages/Payment/PaymentCategoryManagement.vue"),
        meta: {
          middleware: "auth",
          role: "USER",
        },
      },
      {
        name: "payment_items",
        path: "/dashboard/payment-categories/:id/items",
        component: () => import("src/pages/Payment/PaymentItemManagement.vue"),
        meta: {
          middleware: "auth",
          role: "USER",
        },
      },
      {
        name: "members",
        path: "/dashboard/members",
        component: () => import("src/pages/Member/MemberManagement.vue"),
        meta: {
          middleware: "auth",
          role: "USER",
        },
      },
      {
        name: "expenditure_category",
        path: "/dashboard/expenditure-categories",
        component: () => import("src/pages/Expenditure/ExpenditureCategory.vue"),
        meta: {
          middleware: "auth",
          role: "USER",
        },
      },
      {
        name: "expenditure_items",
        path: "/dashboard/expenditure-categories/:id/items",
        component: () => import("src/pages/Expenditure/ExpenditureItems.vue"),
        meta: {
          middleware: "auth",
          role: "USER",
        },
      },
      {
        name: "income_activity",
        path: "/dashboard/income-activities",
        component: () => import("src/pages/IncomeActivity/IncomeActivity.vue"),
        meta: {
          middleware: "auth",
          role: "USER",
        },
      },
      {
        name: "savings",
        path: "/dashboard/members-savings",
        component: () => import("src/pages/Saving/MembersSavings.vue"),
        meta: {
          middleware: "auth",
          role: "USER",
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
