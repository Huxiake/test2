/**
 * Created by HuXiaKe on 19/05/18.
 */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/stock/all',
    hidden: true,
    children: [{
      path: 'dashboard',
      redirect: '/stock/all',
      name: 'Dashboard',
      // component: () => import('@/views/dashboard/index'),
      meta: { title: '主页' }
      // meta: { title: '主页', icon: 'dashboard' }
    }]
  },

  {
    path: '/stock',
    component: Layout,
    children: [
      {
        path: 'all',
        name: 'allstock',
        component: () => import('@/views/stock/index'),
        meta: { title: '库存管理' }
        // meta: { title: '库存管理', icon: 'kucun' }
      },
      // {
      //   path: 'ali',
      //   name: 'alistock',
      //   component: () => import('@/views/stock/index'),
      //   meta: { title: '阿里库存', icon: 'kucun' }
      // },
      // {
      //   path: 'ny',
      //   name: 'nystock',
      //   component: () => import('@/views/stock/index'),
      //   meta: { title: '南油库存', icon: 'kucun' }
      // },
      {
        path: 'index/scaningEnter',
        name: 'scaningEnter',
        hidden: true,
        component: () => import('@/views/stock/scaningEnter'),
        meta: { title: '扫描入库' }
      },
      {
        path: 'index/scaningOut',
        name: 'scaningOut',
        hidden: true,
        component: () => import('@/views/stock/scaningOut'),
        meta: { title: '扫描出库' }
      },
      {
        path: 'details/:id',
        name: 'stockDetails',
        hidden: true,
        component: () => import('@/views/stock/stockDetails'),
        meta: { title: '库存详情' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    meta: { title: '订单管理' },
    children: [
      {
        path: 'ali',
        name: 'ali',
        component: () => import('@/views/order/aliOrder'),
        meta: { title: '阿里订单' }
      },
      {
        path: 'other',
        name: 'other',
        component: () => import('@/views/order/otherOrder'),
        meta: { title: '自建订单' }
      }
    ]
  },

  {
    path: '/goods',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '拿货管理' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/get_goods/index'),
        meta: { title: '拿货列表' }
      },
      {
        path: 'feedback',
        name: 'feedback',
        component: () => import('@/views/get_goods/feedback'),
        meta: { title: '拿货反馈' }
      },
      {
        path: 'toPrint',
        name: 'toPrint',
        component: () => import('@/views/get_goods/toPrint'),
        meta: { title: '待打印' }
      }
    ]
  },

  {
    path: '/downpage',
    name: 'downpage',
    hidden: true,
    component: () => import('@/views/components/downpage'),
    meta: { title: '库存标签打印' }
  },

  {
    path: '/downGetGoods',
    name: 'downGetGoods',
    hidden: true,
    component: () => import('@/views/components/downGetGoods'),
    meta: { title: '拿货标签打印' }
  },

  {
    path: '/downGetGoodsTemp',
    name: 'downGetGoodsTemp',
    hidden: true,
    component: () => import('@/views/components/downGetGoodsTemp'),
    meta: { title: '临时标签打印' }
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
