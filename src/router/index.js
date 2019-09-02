import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import App from '../App'
import Project from '@/views/project/Project'
import Case from '@/views/caseSet/TestCase'


Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/project',
      name: 'project',
      component: Project
    },
    {
      path: '/case',
      name: 'case',
      component: Case
    }
  ]
})
