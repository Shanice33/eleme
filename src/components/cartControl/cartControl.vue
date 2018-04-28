<template>
    <div class="cartControl">
      <transition name="move">
        <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart($event)">
          <span class="inner icon-remove_circle_outline"></span>
        </div>
      </transition>
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <div class="cart-add icon-add_circle" @click="addCart($event)"></div>
    </div>
</template>
<script>
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if(!event._constructed){ //判断点击事件是浏览器派生的还是用户点击事件;
          return false;
        }
        if(!this.food.count){
          Vue.set(this.food, 'count', 1);
        }else{
          this.food.count++;
        }
        //将点击对应的dom传给父组件goods，通过父组件传给子组件shopCart，实现多个组件之间的通讯；实现点击子组件cartContro组件后添加一个动画，将小球滑动到另外一个组件shopCart组件；
        this.$emit('add', event.target);
      },
      decreaseCart(event) {
        if(!event._constructed){ //判断点击事件是浏览器派生的还是用户点击事件;
          return false;
        }
        if(this.food.count){
          this.food.count--;
        }
      }
    }
  };
</script>
<style type="text/stylus" lang="stylus">
  .cartControl
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 3px 6px
      opacity: 1
      transform: translate3d(0, 0, 0) //使用3d可以加速;
      .inner
        display: inline-block
        font-size: 24px
        line-height: 24px
        color: rgb(0,160,220)
        transform: rotate(0)
      &.move-enter-active,&.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      line-height: 24px
      text-align: center
      font-size: 10px
      width: 12px
      color: rgb(147,163,169)
      padding-top: 6px
    .cart-add
      display: inline-block
      padding: 6px
      font-size: 24px
      line-height: 24px
      color: rgb(0,160,220)
</style>
