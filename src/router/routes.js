
const routes = [
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'auth/login', component: () => import('src/pages/Auth/Login.vue') },
      { path: 'auth/register', component: () => import('src/pages/Auth/Register.vue') }
    ]
  },
  {
    path: '/user/dashboard',
    component: () => import('layouts/MainLayout.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
