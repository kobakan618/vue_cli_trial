// Author: "Hiroshi Kobayashi"
// Copyright © 2017 RICOH Co, Ltd. All rights reserved
import Vue from 'vue'
import Router from 'vue-router'
import Meeting from '@/components/Meeting'
import MeetingList from '@/components/MeetingList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MeetingList',
      component: MeetingList
    },
    {
      path: '/meetings/:id',
      name: 'Meeting',
      component: Meeting
    }
  ]
})
