import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Project from '@/views/project/Project'
import DataBase from '@/views/database/DataBase'
import Main from '@/views/Main'
import Script from '@/views/database/Script'
import Mind from '@/views/case/FunctionMind'
import Case from '@/views/case/FunctionCase'
import AutoCase from '@/views/case/CaseSets'
import Task from '@/views/task/Task'
import TimingTask from "@/views/task/TimingTask";
import TaskResult from "@/views/task/TaskResult";
import ApiUtil from '@/views/util/ApiUtil'
import DingTalk from '@/views/config/DingTalk'


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
        tabname: '主页',
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/project',
      name: 'project',
      component: Project,
      meta: {
        tabname: '项目管理',
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path: '/database/config',
      name: 'database',
      component: DataBase,
      meta: {
        tabname: '数据源管理',
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path: '/database/script',
      name: 'script',
      component: Script,
      meta: {
        tabname: '脚本管理',
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path: '/mind',
      name: 'Mind',
      component: Mind,
      meta: {
        tabname: '脑图管理',
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    // {
    //   path: '/case',
    //   name: 'Case',
    //   component: Case,
    //   meta: {
    //     requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    //   },
    // },
    {
      path: '/autoCase',
      name: 'Case',
      component: AutoCase,
      meta: {
        tabname: '自动化用例集管理',
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path:'/task',
      name: 'Task',
      component: Task,
      meta: {
        tabname: '普通任务管理',
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path:'/timingTask',
      name: 'TimingTask',
      component: TimingTask,
      meta: {
        tabname: '定时任务管理',
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path:'/taskResult',
      name: 'TaskResult',
      component: TaskResult,
      meta: {
        tabname: '执行记录',
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path:'/apiUtil',
      name: 'ApiUtil',
      component: ApiUtil,
      meta: {
        tabname: 'TeemoPost',
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
    {
      path:'/dingTalk',
      name: 'dingTalk',
      component: DingTalk,
      meta: {
        tabname: '钉钉通知',
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
    },
  ]
})
