<template>
  <view class="content"> </view>
</template>

<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

onLaunch(() => {
  console.log('App Launch');
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>

<style>
/* 微信小程序样式 */
/* #ifdef MP-WEIXIN */
page {
  height: 100%;
  width: 100%;
}
/* #endif */
</style>
