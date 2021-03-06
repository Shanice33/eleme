<template>
    <div class="ratings" ref="ratings">
      <div class="ratings-content">
        <div class="overview">
          <div class="overview-left">
            <h1 class="score">{{seller.score}}</h1>
            <div class="title">综合评分</div>
            <div class="rank">高于周边商家{{seller.rankRate}}%</div>
          </div>
          <div class="overview-right">
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <star :size="36" :score="seller.serviceScore"></star>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">商品评分</span>
              <star :size="36" :score="seller.foodScore"></star>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="delivery-wrapper">
              <span class="title">送达时间</span>
              <span class="delivery">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
        <split></split>
        <rating-select :ratings="ratings" :select-type="selectType" :only-content="onlyContent" @select="select" @toggle="toggle"></rating-select>
        <div class="rating-wrapper">
          <ul>
            <li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType, rating.text)">
              <div class="avatar">
                <img :src="rating.avatar" width="28" height="28">
              </div>
              <div class="content">
                <h1 class="name">{{rating.username}}</h1>
                <div class="star-wrapper">
                  <star :size="24" :score="rating.score"></star>
                  <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                </div>
                <p class="text">{{rating.text}}</p>
                <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                  <span class="icon-thumb_up"></span>
                  <span class="item" v-for="item in rating.recommend">{{item}}</span>
                </div>
                <div class="time">{{rating.rateTime | formDate}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>
<script>
  import BScroll from 'better-scroll';
  import {formatDate} from '../../common/js/date'
  import star from '../star/star.vue';
  import split from  '../split/split.vue';
  import ratingSelect from '../ratingSelect/ratingSelect.vue';

  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      seller: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true
      }
    },
    components: {
      star,
      split,
      ratingSelect
    },
    methods: {
      select(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggle() {
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
          return this.selectType === type;
        }
      }
    },
    filters: {
      formDate(time) {
        let  date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    created() {
      this.$http('api/ratings').then((res) => {
        res = res.data;
        if(!res.errCode){
          this.ratings = res.data;
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, { click: true});
          });
        }
      });
    }
  };
</script>
<style type="text/stylus" lang="stylus">
  @import "../../common/stylus/mixin.styl"

  .ratings
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        //弹性布局中，flex设置的宽度优先级会高于width；子元素的高度默认为父元素的高度；
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7,17,27,0.1)
        text-align: center
        //宽度为137px在iphone5显示会过宽，导致右半部分换行显示；
        @media only screen and (max-width: 320px)
          flex: 0 0 110px
          width: 110px
        .score
          margin-bottom: 6px
          font-size: 24px
          line-height: 28px
          color: rgb(255, 153, 0)
        .title
          display: inline-block
          width: 100%
          margin: 0 0 8px 0
          font-size: 12px
          line-height: 12px
          color: rgb(7, 17, 27)
          text-align: center
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          //因为有图片，所以要用vertical-align：top对齐，而如果结构一样(比如都是文字)则不需要设置该属性;
          .title
            margin: 0
            display: inline
            vertical-align: top
            font-size: 12px
            line-height: 18px
            font-weight: bold
            color: rgb(7,17,27)
          .star
            display: inline-block
            vertical-align: top
            margin: 0 12px
          .score
            display: inline-block
            vertical-align: top
            font-size: 12px
            line-height: 18px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          line-height: 18px
          .title
            margin: 0
            display: inline
            vertical-align: top
            font-size: 12px
            line-height: 18px
            font-weight: bold
            color: rgb(7,17,27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex: 0 0 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
            margin-bottom: 4px
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              vertical-align: top
              margin-right: 6px
            .delivery
              display: inline-block
              vertical-align: top
              font-size: 10px
              line-height: 12px
              color: rgb(147, 153, 159)
          .text
            margin-bottom: 8px
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .recommend
            font-size: 0
            line-height: 16px
            .icon-thumb_up, .item
              margin: 0 8px 4px 0
              display: inline-block
              font-size: 9px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .item
              padding: 0 6px
              color: rgb(147, 153, 159)
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              background: #fff
          .time
            position: absolute
            right: 0
            top: 0
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)

</style>
