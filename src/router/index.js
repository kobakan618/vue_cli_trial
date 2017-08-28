import Vue from 'vue'
import Router from 'vue-router'
import Meeting from '@/components/Meeting'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Meeting',
      component: Meeting
    }
  ]
})
