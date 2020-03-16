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
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/project',
      name: 'project',
      component: Project,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path: '/database/config',
      name: 'database',
      component: DataBase,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path: '/database/script',
      name: 'script',
      component: Script,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path: '/case',
      name: 'Case',
      component: Case,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path:'/task',
      name: 'Task',
      component: Task,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path:'/timingTask',
      name: 'TimingTask',
      component: TimingTask,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path:'/taskResult',
      name: 'TaskResult',
      component: TaskResult,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
  ]
})
