import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: (HomeView)
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue')
    },
    {
      path: '/doctors',
      name: 'doctors',
      component: () => import('../views/DoctorsView.vue')
    },
    {
      path: '/doctors/:id',
      component: () => import('@/views/SingleDoctorView.vue')
    },
    {
      path: '/patients',
      component: () => import('@/views/PatientsView.vue')
    },
    {
      path: '/wards',
      component: () => import('@/views/WardsView.vue')
    },
    {
      path: '/cases',
      component: () => import('@/views/CasesView.vue')
    },
    {
      path: '/appointments',
      component: () => import('@/views/AppointmentsView.vue')
    },
  ]
})

export default router
