<template>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods"  class="menu-item border-1px" :class="{'currentIndex': currentIndex === index}" @click="selectMenu(index,$event)">
            <span class="text">
              <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
              {{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-list" ref="foodList">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px">
                <div class="icon">
                  <img :src="food.icon" width="57px">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="new">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartControl-wrapper">
                    <cart-control :food="food"></cart-control>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shop-cart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shop-cart>
    </div>
</template>
<script>
  import BScroll from 'better-scroll';
  //BScroll库使用：new BScroll(DOM对象,options)
  import shopCart from '../shopCart/shopCart';
  import cartControl from '../cartControl/cartControl';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
       shopCart,
      cartControl
    },
    data(){
      return {
        goods: [],
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        listHeight: [],
        scrollY: 0
      };
    },
    methods: {
      selectMenu(index, event) {
        if(!event._constructed){//浏览器原生的点击事件是没有这个属性的，只有主动去触发点击事件时才有该属性；
          //若是浏览器原生的点击事件,不做任何操作;
          return false;
        }
        let el = this.$refs.foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper,{click: true});//click事件默认被拦截了，click:true默认派发点击事件;
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{click: true,probeType: 3});//结合BScroll的接口使用,probeType:3实时派发scroll事件，返回滚动的位置
        //结合BScroll的接口使用,监听scroll事件(实时派发的),并获取对象的坐标，当滚动时能实时暴露出scrollY；
        this.foodsScroll.on('scroll',(pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.foodList;
        let height = 0;
        this.listHeight.push(height);
        for(let i = 0; i<foodList.length-1; i++){
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    },
    computed: {
      currentIndex() {
        for(let i=0; i<this.listHeight.length; i++){
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i+1];
          if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
            return i;
          }
        }
        return 0;
      }
    },
    created(){
      this.$http('/api/goods').then((res)=>{
        res = res.data;
        if(!res.errCode){
          this.goods = res.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight(); //计算每个food-list区间的高度;
          });
        }
      })
    }
  };
</script>
<style type="text/stylus" lang="stylus">
  @import '../../common/stylus/mixin.styl'

  .goods
    position: absolute
    width: 100%
    top: 174px
    bottom: 46px
    display: flex
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        border-1px(rgba(7,17,27,0.1))
        .text
          display: table-cell
          vertical-align: middle
          font-size: 12px
          .icon
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            margin-right: 2px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
      .currentIndex
        position: relative
        margin-top: -1px
        background: white
        border-none()
        .text
          font-weight: bold
    .foods-wrapper
      flex: 1
      .title
        margin: 0
        width: 100%
        padding-left: 14px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147,153,159)
        background: #f3f5f7
        line-height: 26px
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          font-size: 10px
          color: rgb(147,153,159)
          line-height: 10px
          position: relative
          .name
            font-size: 14px
            color: rgb(7,17,27)
            line-height: 14px
            margin: 2px 0 8px 0
          .extra
            margin-top: 8px
            line-height: 12px
            .count
              margin-right: 12px
          .price
            font-size: 10px
            font-weight: 700
            line-height: 24px
            color: rgb(147,153,159)
            .new
              font-size: 14px
              color: rgb(240,20,20)
              margin-right: 8px;
            .old
              text-decoration: line-through
          .cartControl-wrapper
            position: absolute
            right: 0
            bottom: 0
</style>
