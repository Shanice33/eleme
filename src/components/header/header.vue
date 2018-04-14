<template>
    <div class="header">
      <div class="content-wrapper">
        <!--商家的头像-->
        <div class="avatar">
          <img width="64" height="64" :src="seller.avatar">
        </div>
        <div class="content">
          <!--第一行显示部分-->
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <!--第二行显示部分-->
          <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟达到
          </div>
          <!--第三行显示部分-->
          <div v-if="seller.supports" class="support">
            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
            <span class="text">{{seller.supports[0].description}}个</span>
          </div>
        </div>
        <div v-if="seller.supports" class="support-count" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
      <div class="bulletin-wrapper" @click="showDetail">
        <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <div class="backgroundImg">
        <img :src="seller.avatar" width="100%" height="100%">
      </div>
      <transition name="fade">
        <v-detail v-show="detailShow" class="detail" :seller="seller">
          <ul v-if="seller.supports" class="support" slot="list">
            <li v-for="(item, index) in seller.supports" class="support-item" :key="index">
              <span class="icon" :class="classMap[item.type]"></span>
              <span class="text">{{item.description}}</span>
            </li>
          </ul>
        </v-detail>
      </transition>

    </div>
</template>
<script>
  import detail from '@/components/header/detail.vue';

  export default {
    props: ['seller'],
    data () {
      return {
        detailShow: false
      };
    },
    components: {
      "v-detail": detail
    },
    methods: {
      showDetail() {
        this.detailShow = true;
      }
    },
    created(){
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    }
  };
</script>
<!--使用什么css预处理器，就在style内加入type="text/less(stylus)"-->
<style lang="stylus" type="text/stylus">
  @import "../../common/stylus/mixin.styl";
  .header
    position: relative
    overflow: hidden
    color: #fff
    background: rgba(7, 17, 27, 0.5)
    .content-wrapper
      position: relative
      padding: 24px 12px 18px 24px
      font-size: 0
      .avatar
        display: inline-block
        vertical-align: top
        img
          border-radius: 2px
      .content
        display: inline-block
        margin-left: 16px
        width: 70%
        .title
          margin: 2px 0 8px 0
        .brand
          display: inline-block
          vertical-align: top
          width: 30px
          height: 18px
          bg-image('brand')
          background-size: 30px 18px
          background-repeat: no-repeat
        .name
          margin-left: 6px
          font-size: 14px
          line-height: 18px
          font-weight: bold
        .description
          margin-bottom: 10px
          line-height: 12px
          font-size: 12px
      .support-count
        position: absolute
        right: 12px
        bottom: 14px
        padding: 0 8px
        height: 24px
        line-height: 24px
        border-radius: 14px
        background: rgba(0, 0, 0, 0.2)
        text-align: center
        .count
          vertical-align: top
          font-size: 10px
        .icon-keyboard_arrow_right
          margin-left: 2px
          line-height: 24px
          font-size: 10p
    .support
      font-size: 0
      .icon
        display: inline-block
        vertical-align: top
        width: 12px
        height: 12px
        margin-right: 4px
        background-size: 12px 12px
        background-repeat: no-repeat
        &.decrease
          bg-image('decrease_1')
        &.discount
          bg-image('discount_1')
        &.guarantee
          bg-image('guarantee_1')
        &.invoice
          bg-image('invoice_1')
        &.special
          bg-image('special_1')
      .text
        line-height: 12px
        font-size: 10px
    .bulletin-wrapper
      position: relative
      height: 28px
      line-height: 28px
      padding: 0 22px 0 12px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      background: rgba(7, 17, 27, 0.2)
      .bulletin-title
        display: inline-block
        vertical-align: top
        margin-top: 8px
        width: 22px
        height: 12px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        vertical-align: top
        margin: 0 4px
        font-size: 10px
      .icon-keyboard_arrow_right
        position: absolute
        font-size: 10px
        right: 12px
        top: 8px
    .backgroundImg
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      //filter是整个元素都模糊;
      filter:blur(10px)

    .detail
      position: fixed
      top: 0
      left: 0
      z-index: 100
      width: 100%
      height: 100%
      overflow: auto
      background-color: rgba(7,17,27,0.8)
      //ios上支持背景模糊的效果
      backdrop-filter: blur(10px)
      &.fade-enter-active,&.fade-leave-active
        transition: all 1s
      &.fade-enter,&.fade-leave-to
        opacity: 0
      .support
        width: 80%
        margin: 0 auto
        .support-item
          padding:0 12px
          margin-bottom: 12px
          font-size: 0
          &:last-child
            margin-bottom: 0
          .icon
            width: 16px
            height: 16px
            margin-right: 6px
            background-size: 16px 16px
          .text
            line-height: 16px
            font-size: 12px


</style>
