<template>
  <div class="title">
    <div class="line"></div>
    <slot name="text"></slot>
    <div class="line"></div>
  </div>
</template>
<script>
</script>
<style lang="stylus" type="text/stylus">
  .title
    display: flex
    width: 85%
    margin: 28px auto 24px auto
    .line
      position: relative
      flex: 1
      top: -6px
      border-bottom: 1px solid rgba(255,255,255,0.2)
    .text
      padding: 0 12px
      font-weight: 700
      font-size: 14px
</style>
