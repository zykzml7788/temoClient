import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Project from '@/views/project/Project'
import DataBase from '@/views/database/DataBase'
import Main from '@/views/Main'
import Script from '@/views/database/Script'
import Case from '@/views/case/CaseSets'
import Task from '@/views/task/Task'
import TimingTask from "@/views/task/TimingTask";
import TaskResult from "@/views/task/TaskResult";

Vue.use(Router);

export default new Router({
  mode: 'hash',
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
      path: '/main',
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
    },
    {
      path: '/database/script',
      name: 'script',
      component: Script
    },
    {
      path: '/case',
      name: 'Case',
      component: Case
    },
    {
      path:'/task',
      name: 'Task',
      component: Task
    },
    {
      path:'/timingTask',
      name: 'TimingTask',
      component: TimingTask
    },
    {
      path:'/taskResult',
      name: 'TaskResult',
      component: TaskResult
    },
  ]
})
