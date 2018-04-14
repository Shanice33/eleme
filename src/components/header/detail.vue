<template>
    <div>
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <v-star :size="48" :score="seller.score"></v-star>
          </div>
          <v-title>
            <div slot="text" class="text">优惠信息</div>
          </v-title>
          <slot name="list"></slot>
          <v-title>
            <div slot="text" class="text">商家公告</div>
          </v-title>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="show">
        <i class="icon-close"></i>
      </div>
    </div>
</template>
<script>
  import star from '@/components/star/star.vue';
  import title from './titleStyle.vue'

  export default {
    props: ['detailShow','seller'],
    methods: {
      show() {
        this.$parent.detailShow = false;
      }
    },
    components: {
      "v-star": star,
      "v-title": title
    }
  }
</script>
<style lang="stylus" type="text/stylus">
  .detail-wrapper
    /*将底部元素挤到最下面*/
    min-height: 100%
    width: 100%
    .detail-main
      margin-top: 64px
      /*padding-bottom给底部元素留空间*/
      padding-bottom: 64px
      .name
        line-height: 16px
        text-align: center
        font-size: 16px
        font-weight: 700
      .star-wrapper
        margin-top: 16px
        padding: 2px 0
        text-align: center
      .bulletin
        width: 80%
        margin: 0 auto
        .content
          padding: 0 12px
          font-size: 12px
          line-height: 24px

  .detail-close
    position: relative
    width: 32px
    height: 32px
    margin: -64px auto
    clear: both
    font-size: 32px
    //background-color: rgba(255,255,255,0)

</style>
