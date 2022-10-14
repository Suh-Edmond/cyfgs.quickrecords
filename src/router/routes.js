
const routes = [
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    redirect:'/auth/login',
    meta: {
      middleware: "guest",
      firstTimer: true
    },
    children: [
      {
        name:"Login",
        path: 'auth/login', component: () => import('src/pages/Auth/Login.vue'),
        meta: {
          middleware: "guest",
          firstTimer: true
        },
      },
      {
        name:"Register",
        path: 'auth/register', component: () => import('src/pages/Auth/Register.vue'),
        meta: {
          middleware: "guest"
        }
      }
    ]
  },
  {
    name:"Dashboard",
    path: '/user/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      middleware: "guest",
      roles: 'PRESIDENT'
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
