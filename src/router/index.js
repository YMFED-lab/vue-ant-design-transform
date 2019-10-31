import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import { UserLayout } from '@/components/layouts'
import { setStore, getStore } from '@/utils/storage'
import { createRoute } from '@/utils/util'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { ACCESS_TOKEN } from '@/store/mutation-types'

import { analysis ,ldap_mock } from './mock.js'

const whiteList = ['login'] // no redirect whitelist

Vue.use(Router)
const routes = []
const side_menus = [...analysis, ...ldap_mock];
setStore('side_menus', side_menus);
if (side_menus && side_menus != 'undefined') {
  side_menus.forEach(function (v) {
    routes.push(createRoute(v));
    if (v.children) {
        v.children.forEach(function (v2) {
            routes.push(createRoute(v2));
            if (v2.children) {
                v2.children.forEach(function (v3) {
                    routes.push(createRoute(v3));
                });
            }
        });
    }
  });
}

const router = new Router({
  routes: [
    {
        path: '/',
        name: 'index',
        redirect: '/dashboard/workplace',
        component: Index,
        children: routes.concat([
          {
            path: 'dashboard/workplace',
            name: 'dashboard',
            component: () => import(/* webpackChunkName: "user" */ '@/views/dashboard')
          }
        ])
    },
    {
      path: '/user',
      component: UserLayout,
      redirect: '/user/login',
      // hidden: true,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
        }
      ]
    },
  ],
  // base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
})

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  // if(Vue.ls.get(ACCESS_TOKEN)) { // 有token
  //   if(to.name === 'index' || to.path === '/index' || to.path === '/') {
  //     next({ path: '/dashboard/workplace'})
  //     NProgress.done()
  //     return false
  //   }
  //   next()
  // }else {
  //   if(to.path !== '/user/login') {
  //     (new Vue()).$notification['error']({
  //       message: "超时，请重新登录"
  //     })
  //   }
  //   if (whiteList.includes(to.name)) {
  //     // 在免登录白名单，直接进入
  //     next()
  //   } else {
  //     next({ path: '/user/login', query: { redirect: to.fullPath } })
  //     NProgress.done()
  //   }
  // }
  next()
})

router.afterEach(route => {
  NProgress.done()
})

export default router
  