// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/router.js';
import axios from 'axios';
import '@/common/stylus/index.styl';

Vue.prototype.$http = axios;

Vue.config.productionTip = false;

/* eslint-disable no-new */
// 上面一句话说明new操作符不需要复制给变量；
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
