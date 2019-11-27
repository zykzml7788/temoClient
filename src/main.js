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

Vue.config.productionTip = false;

// 引入VEcharts库
Vue.use(VCharts);
// 引入element-ui库
Vue.use(ElementUI);
// Import JsonViewer as a Vue.js plugin
Vue.use(JsonViewer);

Vue.prototype.$axios=axios;
axios.defaults.timeout = 10000;
// axios.defaults.baseURL = 'http://129.204.148.24:8888';


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
