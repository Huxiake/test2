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
    redirect: '/stock/index',
    hidden: true,
    children: [{
      path: 'dashboard',
      redirect: '/stock/index',
      name: 'Dashboard',
      // component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },

  {
    path: '/stock',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'stock',
        component: () => import('@/views/stock/index'),
        meta: { title: '库存管理', icon: 'kucun' }
      },
      {
        path: 'index/scaningEnter',
        name: 'scaningEnter',
        hidden: true,
        component: () => import('@/views/stock/scaningEnter'),
        meta: { title: '扫描入库', icon: 'kucun' }
      },
      {
        path: 'index/scaningOut',
        name: 'scaningOut',
        hidden: true,
        component: () => import('@/views/stock/scaningOut'),
        meta: { title: '扫描出库', icon: 'kucun' }
      },
      {
        path: 'details/:id',
        name: 'stockDetails',
        hidden: true,
        component: () => import('@/views/stock/stockDetails'),
        meta: { title: '库存详情', icon: 'kucun' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    meta: { title: '订单管理', icon: 'dingdan' },
    children: [
      {
        path: 'ali',
        name: 'ali',
        component: () => import('@/views/order/aliOrder'),
        meta: { title: '阿里订单', icon: 'ali' }
      },
      {
        path: 'other',
        name: 'other',
        component: () => import('@/views/order/otherOrder'),
        meta: { title: '自建订单', icon: 'qita' }
      }
      // {
      //   path: 'pending',
      //   name: 'pending',
      //   component: () => import('@/views/order/pending'),
      //   meta: { title: '待处理', icon: 'pending' }
      // },
      // {
      //   path: 'fulfilled',
      //   name: 'fulfilled',
      //   component: () => import('@/views/order/fulfilled'),
      //   meta: { title: '已配货', icon: 'fulfilled' }
      // },
      // {
      //   path: 'completed',
      //   name: 'completed',
      //   component: () => import('@/views/order/completed'),
      //   meta: { title: '已完成', icon: 'completed' }
      // }
    ]
  },

  // {
  //   path: '/pickup',
  //   component: Layout,
  //   meta: { title: '发货管理', icon: 'dingdan' },
  //   children: [
  //     {
  //       path: 'ali',
  //       name: 'ali',
  //       component: () => import('@/views/order/aliOrder'),
  //       meta: { title: '未拣货', icon: 'ali' }
  //     },
  //     {
  //       path: 'other',
  //       name: 'other',
  //       component: () => import('@/views/order/temporder'),
  //       meta: { title: '已拣货', icon: 'qita' }
  //     }
  //   ]
  // },

  {
    path: '/goods',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '拿货管理', icon: 'nahuo' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/get_goods/index'),
        meta: { title: '拿货列表', icon: 'liebiao' }
      },
      {
        path: 'feedback',
        name: 'feedback',
        component: () => import('@/views/get_goods/feedback'),
        meta: { title: '拿货反馈', icon: 'fankui' }
      }
    ]
  },

  {
    path: '/downpage',
    name: 'downpage',
    hidden: true,
    component: () => import('@/views/components/downpage'),
    meta: { title: '库存标签打印', icon: 'fankui' }
  },

  {
    path: '/downGetGoods',
    name: 'downGetGoods',
    hidden: true,
    component: () => import('@/views/components/downGetGoods'),
    meta: { title: '拿货标签打印', icon: 'fankui' }
  },

  {
    path: '/downGetGoodsTemp',
    name: 'downGetGoodsTemp',
    hidden: true,
    component: () => import('@/views/components/downGetGoodsTemp'),
    meta: { title: '临时标签打印', icon: 'fankui' }
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
