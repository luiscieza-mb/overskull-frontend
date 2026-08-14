import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
