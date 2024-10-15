<template>
  <view class="menu-tool">
    <uni-title type="h4" title="请选择要发送的内容"></uni-title>
    <view class="pop-container">
      <!-- #ifdef H5 || MP-WEIXIN -->
      <!-- <uni-file-picker file-mediatype="image" v-model="fileList" :image-styles="imageStyles" disable-preview file-extname="png,jpg" :limit="5" @fail="fail" @select="selectChange"> -->
      <view class="button-con" @click="chooseImage">
        <uni-icons type="image" size="30"></uni-icons>
        <text class="text">相片</text></view
      >
      <!-- </uni-file-picker> -->
      <!-- <uni-file-picker v-model="value" file-mediatype="video" file-extname="png,jpg" :limit="5" @fail="fail" @select="selectChange"> -->
      <view class="button-con" @click="chooseVideo">
        <uni-icons type="camera" size="30"></uni-icons>
        <text class="text">视频</text></view
      >
      <!-- </uni-file-picker> -->
      <!-- <uni-file-picker v-model="value" file-mediatype="image" file-extname="png,jpg" :limit="5" @fail="fail" @select="selectChange"> -->
      <view class="button-con" @click="sendCommentMsg">
        <uni-icons type="chat" size="30"></uni-icons>
        <text class="text">评分</text></view
      >
      <!-- </uni-file-picker> -->
      <!-- #endif -->
    </view></view
  >
</template>

<script>
// 添加图片和评分
export default {
  name: 'menuTool',
  props: {},
  data() {
    return {
      fileList: [], // 上传图片
      imageStyles: {
        display: 'none',
      },
    };
  },
  created() {},
  mounted() {},
  // mixins: [hwUpload],
  methods: {
    // 发送图片、视频
    chooseImage() {
      const f = this;
      // #ifdef H5
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: function (res) {
          console.log(JSON.stringify(res.tempFilePaths));
          f.$emit('sendMeidaMsg', res.tempFilePaths[0], 2);
        },
      });
      //  #endif
      // #ifdef MP-WEIXIN
      uni.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success(res) {
          console.log(res.tempFiles);
          f.$emit('sendMeidaMsg', res.tempFiles[0].tempFilePath, 2);
        },
      });
      //  #endif
    },

    // 上传失败
    fail(e) {
      console.log('上传失败：', e, this.fileList);
    },
    chooseVideo() {
      const f = this;
      uni.chooseVideo({
        sourceType: ['camera', 'album'],
        success: function (res) {
          console.log(res.tempFilePath);
          f.$emit('sendMeidaMsg', res.tempFilePath, 3);
        },
      });
    },

    // 点击 评分
    sendCommentMsg() {
      this.$emit('sendCommentMsg');
    },
    // 点击打开订单列表
    openOrderList() {},
  },
};
</script>
<style lang="scss" scoped>
.font1 {
  font-weight: bold;
}
.margint10 {
  margin-top: 20px !important;
}
.chooseitem {
  margin: 15px 0;
  text-align: center;
}

.pop-title {
  margin: 20px 0 10px 20px;
  font-size: 15px;
}
.menu-tool {
  width: 100%;
  /* #ifdef MP-WEIXIN */
  width: calc(100% - 30px);
  /* #endif */
  box-sizing: border-box;
  height: auto;
  padding: 5px 15px 10px 15px;
}
.uni-file-picker {
  width: 30% !important;
  flex: none;
}
::v-deep .file-picker__box-content {
  border: none !important;
}
::v-deep .uni-file-picker__container {
  justify-content: center;
}
::v-deep .uni-file-picker__containe {
  height: 50px;
}
::v-deep .file-picker__box {
  height: 70px !important;
}
.pop-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
  .button-con {
    text-align: center;
    display: flex;
    flex-direction: column;
    .text {
      text-align: center;
      font-size: 12px;
    }
  }
  .up-con {
    margin-top: 20px;
    position: relative;
    height: 35px;
    line-height: 35px;
    width: 100%;
    text-align: center;
  }
}
</style>
