import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
  },
  {
    path: '/products',
    name: 'products.index',
    component: () => import('@/views/ProductListView.vue'),
  },
  {
    path: '/products/create',
    name: 'products.create',
    component: () => import('@/views/ProductFormView.vue'),
  },
  {
    path: '/products/:id/edit',
    name: 'products.edit',
    component: () => import('@/views/ProductFormView.vue'),
    props: true,
  },
  {
    path: '/categories',
    name: 'categories.index',
    component: () => import('@/views/CategoryListView.vue'),
  },
  {
    path: '/users',
    name: 'users.index',
    component: () => import('@/views/UserListView.vue'),
    meta: { adminOnly: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  if (to.meta.adminOnly && !auth.isAdmin) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
