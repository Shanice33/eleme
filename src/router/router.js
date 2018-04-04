import Vue from 'vue';
import VueRouter from 'vue-router';
import goods from '@/components/goods/goods';
import seller from '@/components/seller/seller';
import ratings from '@/components/ratings/ratings';

Vue.use(VueRouter);

const routes = [
  {
    path: '/goods',
    component: goods,
    name: 'goods'
  },
  {
    path: '/seller',
    component: seller,
    name: 'seller'
  },
  {
    path: '/ratings',
    component: ratings,
    name: 'ratings'
  },
  // 默认进入goods首页；
  {
    path: '*',
    redirect: '/goods'
  }
];
const router = new VueRouter({
  routes
});

export default router;
