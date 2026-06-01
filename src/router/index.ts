import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/chinese'
    },
    {
      path: '/chinese',
      name: 'ChineseHome',
      component: () => import('@/subjects/chinese/pages/ChineseHome.vue')
    },
    {
      path: '/math',
      name: 'MathHome',
      component: () => import('@/subjects/math/pages/MathHome.vue')
    },
    {
      path: '/math/formulas',
      name: 'FormulaList',
      component: () => import('@/subjects/math/pages/FormulaList.vue')
    },
    {
      path: '/english',
      name: 'EnglishHome',
      component: () => import('@/subjects/english/pages/EnglishHome.vue')
    },
    {
      path: '/practice',
      name: 'Practice',
      component: () => import('@/pages/PracticePage.vue')
    },
    {
      path: '/me',
      name: 'Me',
      component: () => import('@/pages/ReportPage.vue')
    },
    {
      path: '/me/errors',
      name: 'ErrorBook',
      component: () => import('@/pages/ErrorBookPage.vue')
    }
  ]
})

export default router
