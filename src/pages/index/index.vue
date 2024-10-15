<template>
  <view class="robot-chat-content">
    <scroll-view
      :scroll-into-view="uniItemId"
      scroll-y="true"
      refresher-enabled
      class="scroll-Y"
      ref="myScrollView"
      :refresher-threshold="100"
      :scroll-with-animation="true"
      :refresher-triggered="triggered"
      @refresherrefresh="refresherpulling"
      @refresherpulling="onPulling"
      @refresherabort="onAbort"
    >
      <!--  @refresherrestore="onRestore" -->
      <uni-load-more status="more" :contentText="{ contentdown: '下拉显示更多' }"></uni-load-more>
      <view v-for="(item, index) in chatList" :key="index + 'chatList'" :id="'chatItem_' + index">
        <view class="chat-left" v-if="item.msgSender === 1">
          <image :src="item.avatarImg" class="head-con" mode="scaleToFill"></image>
          <view class="releative">
            <view class="left-triangle"></view>
            <text class="chat-detail-left">{{ item.text }}</text>
          </view>
        </view>
        <view class="chat-right" v-if="item.msgSender === 0 && item.msgType !== 4">
          <view class="releative">
            <view class="right-triangle"></view>
            <text class="chat-detail-right" v-if="item.msgType === 1">{{ item.text }}</text>
            <view class="chat-detail-right" v-if="item.msgType === 2">
              <image :src="item.mediaUrl" class="msg-img" mode="scaleToFill"></image
            ></view>
            <view class="chat-detail-right" v-if="item.msgType === 3">
              <image
                src="../../static/imgs/video-default.jpg"
                class="msg-img"
                mode="scaleToFill"
                @click="startVideo(item.mediaUrl)"
              ></image>
            </view>
          </view>
          <image :src="item.avatarImg" class="head-con" mode="scaleToFill"></image
        ></view>
        <view v-if="item.msgType === 4" class="rate-div">
          <uni-rate v-model="rateValue" color="#ccc" /> <text class="font-rate">谢谢您的支持~~</text></view
        >
      </view>
    </scroll-view>
    <uni-row class="demo-uni-row">
      <uni-col :span="2">
        <view class="img-con" @click="showPopup">
          <uni-icons type="plus" size="30"></uni-icons>
        </view>
      </uni-col>
      <!--  :style="dymicStyle" -->
      <uni-col :span="20">
        <uni-easyinput
          class="uni-mt-5"
          id="msgTextInput"
          trim="all"
          v-model="msgText"
          placeholder="请输入内容"
          ref="easyInput"
          @input="input"
          @confirm="sendMsg"
        ></uni-easyinput>
      </uni-col>
      <uni-col :span="2">
        <view class="img-con" @click="sendMsg">
          <uni-icons type="arrow-up" size="30"></uni-icons>
        </view>
      </uni-col>
    </uni-row>
    <view>
      <!-- 底部操作弹出层 -->
      <uni-popup ref="popup" background-color="#fff">
        <view class="popup-content"><MenuTool @sendMeidaMsg="sendMeidaMsg" @sendCommentMsg="sendCommentMsg" /></view>
      </uni-popup>
      <!-- 视频播放 -->
      <uni-popup ref="popupVideo" background-color="#fff">
        <view class="popup-video">
          <video
            id="myVideo"
            :style="videoDiv"
            :autoplay="true"
            :vslide-gesture="true"
            :src="videoUrl"
            @error="videoErrorCallback"
            :danmu-list="danmuList"
            enable-danmu
            danmu-btn
            controls
          ></video>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue';
import type { ChatMsg, DanmuItem } from '@/common/schema';
import MenuTool from '@/pages/common/menuTool.vue';

// 获取当前组件实例
const instance = getCurrentInstance();

const uniItemId = ref<string | null>('');
let msgText = ref<string>('');
let triggered = ref<Boolean | string>(false);
let videoUrl = ref<string>('');
let rateValue = ref<number>(2);
// let isOpenRefresh = ref(true); // 是否开启下拉
const danmuList = ref<DanmuItem[]>([
  {
    text: '第 1s 出现的弹幕',
    color: '#ff0000',
    time: 1,
  },
  {
    text: '第 3s 出现的弹幕',
    color: '#ff00ff',
    time: 3,
  },
]);

// uni-app获取元素设置样式不好用，响应式数据绑定样式的方式可行
const videoDiv = ref({
  width: '',
  height: '',
});

const chatList = ref<ChatMsg[]>([
  {
    text: '第1条用户数据',
    avatarImg: '../../static/imgs/me-visitor.png',
    msgType: 1,
    msgSender: 0,
  },
  {
    text: '第1条客服数据',
    avatarImg: '../../static/imgs/me-default.png',
    msgType: 1,
    msgSender: 1,
  },
]);
let count = 1;
let _freshing = false;

onMounted(() => {
  console.log('uni.getWindowInfo', uni.getWindowInfo());
  const width = uni.getWindowInfo().windowWidth - 20;
  const height = uni.getWindowInfo().windowHeight - 40;
  videoDiv.value.width = width + 'px';
  videoDiv.value.height = height + 'px';
});
function showPopup() {
  instance.proxy.$refs.popup.open('bottom');
}
function videoErrorCallback(e) {
  uni.showModal({
    content: e.target.errMsg,
    showCancel: false,
  });
}
// 发送文本消息
function sendMsg() {
  chatList.value.push({
    text: msgText.value,
    avatarImg: '../../static/imgs/me-visitor.png',
    msgType: 1,
    msgSender: 0,
  });
  msgText.value = '';
  setTimeout(() => {
    chatList.value.push({
      text: '第' + count + '条客服傻瓜式回复数据',
      avatarImg: '../../static/imgs/me-default.png',
      msgType: 1,
      msgSender: 1,
    });
    count++;
  }, 500);
  scrollBottom();
}
// 回到底部
function scrollBottom() {
  // 定位前，先把原锚点清除，再重新设置锚点,否则第一次定位后，滚动滚动条，无法定位到锚点位置
  uniItemId.value = null;
  setTimeout(() => {
    uniItemId.value = `chatItem_${chatList.value.length - 1}`;
  }, 1000);
}
// 播放视频
function startVideo(url: string) {
  instance.proxy.$refs.popupVideo.open('center');
  videoUrl.value = url;
}
// 发送视频、图片消息 type 2 - 图片 3 - 视频
function sendMeidaMsg(url: string, type: number) {
  chatList.value.push({
    mediaUrl: url,
    avatarImg: '../../static/imgs/me-visitor.png',
    msgType: type,
    msgSender: 0,
  });
  setTimeout(() => {
    chatList.value.push({
      text: '客服傻瓜式回复数据',
      avatarImg: '../../static/imgs/me-default.png',
      msgType: 1,
      msgSender: 1,
    });
    count++;
  }, 500);
  instance.proxy.$refs.popup.close();
  scrollBottom();
}
function sendCommentMsg() {
  chatList.value.push({
    text: '用户评分：' + rateValue.value + '星',
    avatarImg: '../../static/imgs/me-visitor.png',
    msgType: 4,
    msgSender: 0,
  });
  instance.proxy.$refs.popup.close();
  scrollBottom();
}
const focusInput = () => {
  // dymicStyle.value.border = 'solid 1px red';
};
// 自定义下拉刷新控件被下拉
function onPulling(e) {
  console.log('onpulling', e);
  if (e.detail.deltaY < 0) return; // 防止上滑页面也触发下拉
  triggered.value = true;
}
// 自定义下拉刷新被复位
function onRestore() {
  triggered.value = 'restore'; // 需要重置
  console.log('onRestore');
}
// 自定义下拉刷新被中止
function onAbort() {
  console.error('onAbort');
}
function refresherpulling() {
  if (_freshing) return;
  _freshing = true;
  setTimeout(() => {
    triggered.value = false;
    _freshing = false;
  }, 500);
  const Len = 5;
  for (let i = Len; i > 0; i--) {
    chatList.value.unshift({
      text: '第' + (chatList.value.length + Len - i) + '条下拉回复数据',
      avatarImg: '../../static/imgs/me-default.png',
      msgType: 1,
      msgSender: 1,
    });
    chatList.value.unshift({
      text: '第' + (chatList.value.length + Len - i) + '条下拉发送数据',
      avatarImg: '../../static/imgs/me-visitor.png',
      msgType: 1,
      msgSender: 0,
    });
  }
  // 定位前，先把原锚点清除，再重新设置锚点,否则第一次定位后，滚动滚动条，无法定位到锚点位置
  uniItemId.value = null;
  setTimeout(() => {
    uniItemId.value = `chatItem_${2 * Len - 2}`;
  }, 1000);
}
function input(event: InputEvent) {
  console.log(event);
}
</script>

<style lang="scss" scoped>
@import '@/static/css/variables.scss'; // 引入css变量
@import '@/static/css/chatStyle.scss'; // 引入样式

.content {
  width: 100%;
  height: 100%;
  position: relative;
}
.chat-custom-right {
  flex: 1;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

.chat-custom-text {
  font-size: 12rpx;
  color: #999;
}
.scroll-Y {
  height: calc(100% - 70px);
}
.msg-img {
  width: 100px;
  height: 100px;
}
.rate-div {
  margin: 10px auto;
  text-align: center;
  .font-rate {
    font-size: 12px;
    color: #333;
    text-align: center;
  }
}

// 底部按钮
.demo-uni-row {
  position: absolute;
  bottom: 10rpx;
  width: 100%;
  left: 0;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  z-index: 9;
  .img-con {
    width: 100%;
    text-align: center;
    .img {
      width: 26rpx;
      height: 26rpx;
    }
  }
}
::v-deep .uni-rate {
  justify-content: center;
}
/* 微信小程序使用了虚拟化节点，没有 demo-uni-row 层级 */
/* #ifdef MP-ALIPAY || MP-WEIXIN */
.popup-content {
  width: 360px;
  height: 106px;
}
::v-deep .uni-row {
  position: absolute !important;
  bottom: 10px;
  width: 100%;
  /* #ifdef MP-WEIXIN */
  width: calc(100% - 28rpx);
  /* #endif */
  background: #f6f6f6;
  padding: 8rpx 16rpx 8rpx 12rpx;
  display: flex;
  align-items: center;
  z-index: 9;
  .img-con {
    .img {
      width: 26rpx;
      height: 26rpx;
    }
  }
}
/* #endif */
.input-container {
  flex: 1;
  .uni-mt-5 {
    border-radius: 6px;
    padding: 8px 16px;
  }
}
</style>
