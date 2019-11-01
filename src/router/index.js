import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Project from '@/views/project/Project'
import DataBase from '@/views/database/DataBase'
import Main from '@/views/Main'

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
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/project',
      name: 'project',
      component: Project
    },
    {
      path: '/database/config',
      name: 'database',
      component: DataBase
    }
  ]
})
