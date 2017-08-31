// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
import Vue from 'vue'
import Router from 'vue-router'
import Meeting from '@/components/Meeting'
import Home from '@/components/Home'
import Login from '@/components/Login'
import PropertyStore from '../commonUtils/PropertyStore.js'
Vue.use(Router)

var navigationGuard = (to, from, next) => {
  if (PropertyStore.getUserName() === '') {
    next('/login')
  }
  else {
    next()
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: navigationGuard
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/meetings/:id',
      name: 'Meeting',
      component: Meeting,
      beforeEnter: navigationGuard
    }
  ]
})
