<template>
    <div class="shopCart">
      <div class="content">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight': totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount > 0">
              {{totalCount}}
            </div>
          </div>
          <div class="price" :class="{'highlight': totalPrice>0}">￥{{totalPrice}}元</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" :class="{'enough': totalPrice >= minPrice}">
          <div class="pay">{{payDesc}}</div>
        </div>
      </div>
    </div>
</template>
<script>
  export default {
    props: {
      selectFoods: {
        type: Array,
        default() { //当type为Array或Object时，default是一个函数；
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 4
      }
    },
    computed: {
      totalPrice() {//totalPrice依赖于selectFoods，所以使用computed属性;
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if(this.totalPrice === 0){
          return `￥${this.minPrice}元起送`;
        }else if(this.totalPrice < this.minPrice){
          let diff = this.minPrice-this.totalPrice;
          return `还差￥${diff}元起送`;
        }else{
          return '去结算'
        }
      }
    }
  }
</script>
<style lang="stylus" type="text/stylus">
  .shopCart
    position: fixed
    width: 100%
    height: 48px
    left: 0
    bottom: 0
    z-index: 50
    .content
      display: flex
      background: #141d27
      color: rgba(255,255,255,0.4)
      .content-left
        flex: 1
        font-size: 0
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          vertical-align: top
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background: #2b343c
            text-align: center
            &.highlight
              background: rgb(0,160,220)
            .icon-shopping_cart
              font-size: 24px
              line-height: 44px
              color: #80858a
              &.highlight
                color: rgb(255,255,255)
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            font-weight: 700
            font-size: 9px
            color: rgb(255,255,255)
            border-radius: 12px
            background-color: rgb(240,20,20)
            border-shadow: 0 4px 8px 0 rgb(0,0,0,0.4)
        .price
          display: inline-block
          vertical-align: top
          font-size: 16px
          font-weight: 700
          //利用line-height和margin设置垂直居中；
          margin: 12px  0
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255,255,255,0.1)
          &.highlight
            color: rgb(255,255,255)
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0
          line-height: 24px
          font-size: 10px
          font-weight: 700
          padding-left: 12px
      .content-right
        flex: 0 0 105px
        width: 105px
        background: #2b333b
        &.enough
          background: #00b43c
          color: #fff
        .pay
          font-size: 12px
          font-weight: 700
          line-height: 24px
          text-align: center
          margin: 12px 0

</style>
