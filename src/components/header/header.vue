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
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
        </div>
        <div v-if="seller.supports" class="support-count">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
      <div class="bulletin-wrapper">
        <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      };
    },
    props: ['seller']
  };
</script>
<style lang="stylus">
  @import "../../common/stylus/mixin.styl";

  .header{
    color: #fff;
    background: #999;
  }
  .content-wrapper{
    position: relative;
    padding: 24px 12px 18px 24px;
    font-size: 0;
  }
  .avatar{
    display: inline-block;
    vertical-align: top;
    width: 64px;
    height: 64px;
  }
  .avatar img{
    border-radius: 2px;
  }
  .content{
    display: inline-block;
    margin-left: 16px;
  }
    .title{
      margin: 2px 0 8px 0;
    }
    .brand{
      display: inline-block;
      /*实现顶部对齐,top是将元素的顶端与行中最高元素的顶端对齐；*/
      vertical-align: top;
      width: 30px;
      height: 18px;
      bg-image('brand');
      background-size: 30px 18px;
      background-repeat: no-repeat;
    }
    .name{
      margin-left: 6px;
      font-size: 16px;
      font-weight: bold;
      line-height: 18px;
    }
    .description{
      margin-bottom: 10px;
      font-size: 12px;
    }
    .support .icon{
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: 4px;
      background-size: 12px 12px;
      background-repeat: no-repeat;
    }
    .decrease{
      bg-image('decrease_1');
    }
    .discount{
      bg-image('discount_1');
    }
    .guarantee{
      bg-image('guarantee_1');
    }
    .invoice{
      bg-image('invoice_1');
    }
    .special{
      bg-image('special_1');
    }
    .text{
      vertical-align: top;
      font-size: 10px;
    }
  .support-count{
    position: absolute;
    background-color: rgba(0,0,0,0.2);
    padding: 3px 8px;
    height: 24px;
    right: 12px;
    bottom: 12px;
    border-radius: 14px;
    text-align: center;
  }
  .support-count .count{
    font-size: 10px;
    margin-right: 2px;
  }
  .icon-keyboard_arrow_right{
    font-size: 10px;
    line-height: 24px;
  }
  .bulletin-wrapper{
    position: relative;
    line-height: 28px;
    background-color: rgba(7,17,27,0.2);
    padding:0 22px 0 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
    .bulletin-title{
      vertical-align: top;
      margin-top: 7px;
      display: inline-block;
      width: 22px;
      height: 12px;
      bg-image('bulletin');
      background-size: 22px 12px;
      background-repeat: no-repeat;
    }
    .bulletin-text{
      margin: 0 4px;
      font-size: 10px;
    }
  .bulletin-wrapper .icon-keyboard_arrow_right{
    position: absolute;
    right: 12px;
    top: 7px;
  }

</style>
