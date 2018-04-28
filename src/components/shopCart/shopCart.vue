<template>
  <div>
    <div class="shopCart">
      <div class="content" @click="toggleShow">
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
        <div class="content-right" :class="{'enough': totalPrice >= minPrice}" @click.stop.prevent="pay">
          <div class="pay">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <transition v-for="(ball,index) in balls" :key="index" @before-enter="beforeDrop" @enter="enterDrop" @after-enter="afterDrop">
          <!--外层控制小球的轨道和方向，内层控制动画小球的运动状态-->
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
      <transition name="fade">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li v-for="food in selectFoods" class="food">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food"></cart-control>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>
<script>
  import BScroll from 'better-scroll';
  import cartControl from '../cartControl/cartControl'

  export default {
    components: {
      cartControl
    },
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
    data() {
     return {
       balls: [
         {
           show: false
         },
         {
           show: false
         },
         {
           show: false
         },
         {
           show: false
         },
         {
           show: false
         },
       ], //保证有足够的小球数量来运行动画；
       dropBalls: [], //正在运行的小球；
       fold: true
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
      },
      listShow() {
        if(!this.totalCount){
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        //当展开时初始化BScroll，其严重依赖于DOM，要在$nextTick中初始化；
        if(show){
          this.$nextTick(() => {
            //如果没有这个滚动对象时，初始化滚动对象；
            if(!this.scroll){
              this.scroll = new BScroll(this.$refs.listContent, { click: true });//click: true可以在购物车组件中派发点击效果
            } else{
              //重新计算listContent内容高度，决定是否可以滚动；
              this.scroll.refresh();
            }
          })
        }
        return show;
      }
    },
    methods: {
      drop(el) {//el是触发该事件的dom元素
        //触发一次事件就将小球进行遍历；
        for(let i=0; i<this.balls.length; i++){
          let ball = this.balls[i];
          if(!ball.show){//将未运动的小球(false)放到dropBalls中；
            ball.show = true;
            ball.el = el; //将触发的dom对象加到小球的el属性中；
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      //使用vue的js钩子函数实现动画;以下的动画的el都是指transition标签内的dom对象，translate3d的x，y，z轴的位移都是以小球定义的位置(购物车)处为原点；
      //beforeenter是将小球移动到加号位置；
      beforeDrop(el) {
        let count = this.balls.length;
        while(count--){
          let ball = this.balls[count];
          if(ball.show){//如果有移动的小球了，先不显式它，给它配置移动轨道;
            let rect = ball.el.getBoundingClientRect();//ball.el是+号dom元素相对于视口的位移；
            let x = rect.left - 32; //小球水平方向向右要移动的距离，x轴正方向;
            let y = -(window.innerHeight - rect.top - 22);//小球竖直方向要移动的位移，向上是y轴负方向;
            //让小球从最初在购物车那个位置先移动到加号元素的位置，通过display=' '使其运动轨道不显式出来；
            el.style.display = '';//清空display，让其开始不显示;
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
            el.style.transform = `translate3d(0, ${y}px, 0)`;
            //处理内层动画：水平方向的移动;
            let inner = el.getElementsByClassName('inner-hook')[0];

            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      //enter是从加号位置回到最初的位置；
      enterDrop(el, done) {//在进入的动画过程中触发重绘将小球运动轨迹展示出来；
        let r = el.offsetHeight; //立即手动触发html重绘;
        this.$nextTick(() => {//进入动画的结束状态配置参数，并告知vue过渡完成，可以执行after-enter事件了；
          el.style.webkitTransform = 'translate3d(0, 0, 0)';
          el.style.transform = 'translate3d(0, 0, 0)';
          //处理内层动画：水平方向的移动;
          let inner = el.getElementsByClassName('inner-hook')[0];

          inner.style.webkitTransform = 'translate3d(0, 0, 0)';
          inner.style.transform = 'translate3d(0, 0, 0)';

          //通知vue过渡已完成，可以执行after-enter事件了；
          el.addEventListener('transitionend',done);
        });
      },
      //afterenter是小球回到了最初的位置后的操作；
      afterDrop(el) {
        let ball = this.dropBalls.shift();
        if(ball){
          ball.show = false;
          el.style.display = 'none';//el才是表示小球的dom对象，ball只是表示小球的变量而已，所以display属性是设置到el上；
        }
      },
      toggleShow() {
        if(!this.totalCount){
          return;
        }
        this.fold = !this.fold;
      },
      hideList(){
        this.fold = true;
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        })
      },
      pay() {

        if(this.totalPrice < this.minPrice){
          return;
        }
        window.alert(`支付${this.totalPrice}`);

      }
    }
  }
</script>
<style lang="stylus" type="text/stylus">
  @import "../../common/stylus/mixin.styl"

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
          //利用line-height和margin设置垂直居中；因为display为inline-height，若没设置height则将其行高inline-height设置为height值；
          //对行内元素设置line-height是无效的；
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

    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.6s linear
    .shopcart-list
      position: absolute
      top: 0
      left: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fade-enter-active,&.fade-leave-active
        transition: all 0.5s
      &.fade-enter,&.fade-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        /*width: 100%*/
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7,17,27,0.1)
        .title
          float: left
          margin: 0
          font-size: 14px
          color: rgb(7,17,27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            font-size: 14px
            line-height: 24px
            color: rgb(7,17,27)
          .price
            position: absolute
            right: 95px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240,20,20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    z-index: 40
    background: rgba(7, 17, 27, 0.6)
    filter: blur(10px)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      background: rgba(7, 17, 27, 0)
</style>
