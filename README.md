# uniapp-chat

## 简介

uniapp-chat 是一个同构小程序和H5版本IM系统的示例，从前端层面搭建框架，实现聊天常用的收发消息、下拉获取更错消息、发送文字、图片、视频、评价等多种格式消息，以及播放视频，仅用于项目前期调研uni-app可行性和开发成本。

## 技术栈
uni-app + Vite5 + Vue3 + Typescript + pinia



## 注意事项

- 应用scroll-into-view属性进行描点定位时，绑定的响应式数据在变更前先把原锚点清除，再重新设置锚点,否则第一次定位后，滚动滚动条，无法定位到锚点位置；
- :refresher-triggered="triggered"中，这个属性要随着下拉树下的过程变更状态，否则会导致下拉的loading状态一直不消失；
- :refresher-triggered="triggered"中triggered的初始值要设置为false，const triggered = ref<Boolean | string>(false);否则在小程序中初始化页面就会触发下拉刷新。

## 后期迭代

- 后期随着项目演进，会将更多的总结示例迭代进来
