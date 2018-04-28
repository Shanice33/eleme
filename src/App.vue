<template>
  <div id="app">
    <v-head :seller="seller"></v-head>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link  to="/goods" active-class="link">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" active-class="link">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller" active-class="link">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import header from '@/components/header/header.vue';
  import {urlParse} from './common/js/util.js';

  export default {
    data () {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    components: {
      'v-head': header
    },
    created () {
      this.$http.get('/api/seller?id='+this.seller.id).then((res) => {
        res = res.data;
        if(!res.errCode){
          this.seller = Object.assign({},this.seller,res.data);
        }
      });
    }
  };
</script>

<style lang="stylus" type="text/stylus">
  @import "./common/stylus/mixin.styl";

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.link
          color: rgb(240,20,20)

</style>
