<template>
    <div class="cartControl">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click="decreaseCart($event)"></div>
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
      },
      decreaseCart(event) {
        if(!event._constructed){ //判断点击事件是浏览器派生的还是用户点击事件;
          return false;
        }
        if(this.food.count){
          this.food.count--;
        }
      }
    },
    created(){
      //console.log(this.food);
    }
  };
</script>
<style type="text/stylus" lang="stylus">
  .cartControl
    font-size: 0
    line-height: 24px
    .cart-decrease,.cart-add
      display: inline-block
      padding: 6px
      font-size: 24px
      color: rgb(0,160,220)
    .cart-count
      display: inline-block
      vertical-align: top
      text-align: center
      font-size: 10px
      width: 12px
      color: rgb(147,163,169)
      padding-top: 6px
    .cart-add
      color: rgb(0,160,220)
</style>
