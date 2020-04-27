// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import store from './vuex/store'
import VCharts from 'v-charts'
import JsonViewer from 'vue-json-viewer'
import kityminder from 'vue-kityminder-gg'
import VueCodeMirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'









Vue.config.productionTip = false;

// 引入VEcharts库
Vue.use(VCharts);
// 引入element-ui库
Vue.use(ElementUI);
// Import JsonViewer as a Vue.js plugin
Vue.use(JsonViewer);
Vue.use(kityminder);
Vue.use(VueCodeMirror);

Vue.prototype.$axios=axios;
axios.defaults.timeout = 10000;
axios.defaults.baseURL = 'http://39.105.34.24:8888';
axios.defaults.withCredentials = true;
Vue.prototype.$websockerUrl = "ws://39.105.34.24:8888/websocket/";


// 全局导航钩子
router.beforeEach((to, from, next) => {
  // 判断该路由是否需要登录权限
  if (to.meta.requireAuth) {
    if(localStorage.getItem("userInfo")!==null) {
      next();
    }
    else {
      next({
        path: '/',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
});

// 添加响应拦截器http respones
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
  if (error.toString().indexOf("403")!==-1) {
    Vue.prototype.$alert('你的token已失效，请重新登入','超时提醒').then(()=>{
      router.push("/");
      localStorage.removeItem("userInfo");
    });

  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  data:{
    return:{
      jsonData: {
        total: 25,
        limit: 10,
        skip: 0,
        links: {
          previous: undefined,
          next: function () {},
        }
      }
    }
  },
  components: { App },
  template: '<App/>'
});
