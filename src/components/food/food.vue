<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div >
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image">
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span>
              <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartControl-wrapper">
              <cart-control :food="food"></cart-control>
            </div>
            <!--因为小球运动需要通过点击的DOM元素计算初始运动位置，所以需要延迟将其display设置为none；-->
            <transition name="fade">
              <div class="buy" v-show="!food.count || food.count === 0" @click="addFirst">加入购物车</div>
            </transition>
          </div>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <span class="text">{{food.info}}</span>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <rating-select :select-type="selectType" :only-content="onlyContent"  :ratings="food.ratings" @select="select" @toggle="toggle"></rating-select>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType === 0 , 'icon-thumb_down': rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import cartControl from '@/components/cartControl/cartControl';
  import split from '@/components/split/split';
  import ratingSelect from "@/components/ratingSelect/ratingSelect";
  import {formatDate} from '../../common/js/date'

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    components: {
      cartControl,
      split,
      ratingSelect
    },
    data() {
      return{
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      show() {
        this.showFlag = true;
        //保证初始化时这两个变量的值没变;
        this.selectType = ALL;
        this.onlyContent = true;

        this.$nextTick(() => {//DOM更新循环结束之后执行延迟回掉，在修改数据之后立即使用这个方法，获取更新后的DOM；
          if(!this.scroll){
            this.scroll = new BScroll(this.$refs.food, { click: true });//click: true可以在购物车组件中派发点击效果
          } else{
            this.scroll.refresh();//做一次重新计算;
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event){
        if(!event._constructed){
          return;
        }
        this.$emit('add', event.target);//调用小球抛物线运动的动画；
        Vue.set(this.food, 'count',1);
      },
      select(type){
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggle(){
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      needShow(type, text){
        if(this.onlyContent && !text){
          return false;
        }
        if(this.selectType === ALL){
          return true;
        }else{
          return type === this.selectType;
        }
      }
    },
    filters: {
      formDate (time){
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>
<style type="text/stylus" lang="stylus">
  @import "../../common/stylus/mixin.styl"

  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30 //要高于goods的z-index，低于购物车详情页的z-index
    background: #fff
    width: 100%
    transform: translate3d(0,0,0) //可以通过GPU加速；
    &.move-enter-active,&.move-leave-active
      transition: all 0.2s linear
    &.move-enter,&.move-leave-active
      transform: translate3d(100%,0,0)
    .food-content
      .image-header
        position: relative
        width: 100%
        height: 0
        padding-top: 100% //padding的百分比是以父元素的宽度进行计算，width：100%就形成一个正方形容器了；
        img
          position: absolute //设置的宽高百分比按非static定位的父元素的padding+content的高宽为百分比基准；
          left: 0
          top: 0
          width: 100%  //图片在只设置宽/高时，图片会等比例显式；
          height: 100%
        .back
          position: absolute
          left: 0
          top: 10px
          .icon-arrow_lift
            display: block
            padding: 10px //增大按钮点击区域
            font-size: 20px
            color: #fff
      .content
        padding: 18px
        position: relative
      .title
        margin: 0
        margin-bottom: 8px
        font-size: 14px
        line-height: 14px
        font-weight: bold
        color: rgb(7,17,27)
      .detail
        font-size: 0
        line-height: 10px
        height: 10px
        margin-bottom: 18px
        color: rgb(147,153,159)
        .sell-count
          font-size: 10px
          margin-right: 12px
        .rating
          font-size: 10px
      .price
        font-size: 0
        font-weight: 700
        line-height: 24px
        .now
          font-size: 14px
          color: rgb(240,20,20)
          margin-right: 8px
        .old
          font-size: 10px
          color: rgb(147,153,159)
          text-decoration: line-through
      .cartControl-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        box-sizing: border-box
        height: 24px
        line-height: 24px
        padding: 0 12px
        font-size: 12px
        border-radius: 12px
        background: rgb(0,160,220)
        color: #fff
        opacity: 1
        &.fade-enter-active,&.fade-leave-active
          transition: all 0.2s
        &.fade-enter,&.fade.move-leave-active
          opacity: 0
    .info
      padding: 18px
      .title
        margin: 0
        margin-bottom: 6px
        font-size: 14px
        line-height: 14px
        font-weight: bold
        color: rgb(7,17,27)
      .text
        padding: 0 8px
        font-size: 12px
        line-height: 24px
        font-weight: 200
        color: rgb(77,85,93)
    .rating
      padding-top: 18px
      .title
        margin: 0 0 0 18px
        font-size: 14px
        line-height: 14px
        font-weight: bold
        color: rgb(7,17,27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            font-size: 0
            line-height: 12px
            .name
              display: inline-block
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
              margin-right: 12px
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up,.icon-thumb_down
              margin-right: 4px
              line-height: 16px
              color: rgb(147, 153, 159)
            .icon-thumb_up
              color: rgb(0, 160, 220)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>
