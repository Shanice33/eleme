// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/router.js';
import VueResource from 'vue-resource';

import '@/common/stylus/index.styl';

Vue.use(VueResource);

Vue.config.productionTip = false;

/* eslint-disable no-new */
// 上面一句话说明new操作符不需要复制给变量；
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
