// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
import Vue from 'vue'
import Router from 'vue-router'
import Meeting from '@/components/Meeting'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/meetings/:id',
      name: 'Meeting',
      component: Meeting
    }
  ]
})
