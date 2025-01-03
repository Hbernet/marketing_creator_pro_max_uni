<template>
  <view class="character-clone-page mh-100vh">
    <view class="introduction-section">
      <video class="video" src="@/static/video/guidance_figure.mp4" controls></video>
      <view class="introduction-content">
        <view class="title">
          参照视频中的规范进行视频素材拍摄，素材要求如下：
        </view>
        <view class="content">
          1、拍摄时长5分钟以内<br>
          2、神态自然，动作不易过大<br>
          3、建议使用绿幕
        </view>
        <view class="tip-cell">
          <image class="tip-cell-icon" src="@/static/images/icon/icon_safety.png" alt=""></image>
          <text class="tip-cell-text">您的资料均保存在本地设备中，请放心使用</text>
        </view>
      </view>
    </view>
    <view class="form-section">
      <view class="form-item">
        <view class="form-item-label">
          人物名称
        </view>
        <view class="form-item-content">
          <input class="form-item-input" type="text" v-model="figureData.name" placeholder="请输入人物名称" />
        </view>
      </view>
      <view class="form-item">
        <view class="form-item-label">
          上传视频
        </view>
        <view class="form-item-content">
          <view
            class="upload-video-preview"
            :class="videoType"
            v-if="figureData.video_path"
          >
            <view class="upload-video-preview-edit" @click="uploadVideo">
              <image class="upload-video-edit-icon" src="@/static/images/icon/icon_edit.png" alt=""></image>
            </view>
            <video class="upload-video-preview-video" :src="figureData.video_path" controls></video>
          </view>
          <view v-else class="upload-video-wrapper" @click="uploadVideo">
            <image class="upload-video-icon" src="@/static/images/icon/icon_add.png" alt=""></image>
            <text class="upload-video-text">请上传200m以上的MP4文件</text>
          </view>
        </view>
      </view>
      <view class="flex1"></view>
      <view class="form-item">
        <view class="form-item-content-checkbox">
          <checkbox
            class="form-item-content-checkbox-input"
            :checked="figureData.agree"
            @tap="changeAgree"
            backgroundColor="#2B2D2D"
            activeBackgroundColor="#5CDAFD"
            color="#000"
            borderColor="#fff"
            activeBorderColor="#5CDAFD"
          />
          <view class="form-item-content-text">我同意<text @click="goAgreement" class="form-item-content-text-link">形象克隆协议</text></view>
        </view>
      </view>
      <view class="form-item">
        <view class="clone-btn" @click="cloneFigure">开始生成我的数字人</view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import http from '@/utils/http'
const figureLoading = ref(false)
const videoType = ref('horizontal')
const figureData = ref({
  name: '',
  video_path: '',
  agree: false,
  clone_type: 1, // 0-声音形象都克隆  1-只克隆形象
})
onLoad((options) => {
  if (options.agree) {
    figureData.value.agree = true
  }
})
const goAgreement = () => {
  uni.navigateTo({
    url: '/pages/agreement/index'
  })
}
const changeAgree = () => {
  figureData.value.agree = !figureData.value.agree
}
const uploadVideo = () => {
  uni.chooseVideo({
    count: 1,
    success: (res) => {
      uni.showLoading({
        title: '视频上传中...',
        duration: 60000
      })
      http.chooseVideoFn({
        res,
        code: 1
      }).then((file) => {
        console.log(file)
        if (res.width > res.height) {
          videoType.value = 'horizontal'
        } else {
          videoType.value = 'vertical'
        }
        figureData.value.video_path = file[0].filePath
      }).finally(() => {
        uni.hideLoading()
      })
    },
    fail: (err) => {
      uni.showToast({
        title: '选择视频失败',
        icon: 'none'
      })
    }
  })
}

const cloneFigure = () => {
  if (!figureData.value.name) {
    uni.showToast({
      title: '请填写人物名称',
      icon: 'none'
    })
    return false
  }
  if (!figureData.value.video_path) {
    uni.showToast({
      title: '请上传MP4文件',
      icon: 'none'
    })
    return false
  }
  if (!figureData.value.agree) {
    uni.showToast({
      title: '请同意形象克隆协议',
      icon: 'none'
    })
    return false
  }
  if (figureLoading.value) {
    return false
  }
  uni.showLoading({
    title: '生成中...',
    duration: 60000
  })
  figureLoading.value = true
  figureData.value.status = 0
  http.request({
    url: '/digital-human-avatars/',
    method: 'post',
    data: {
      name: figureData.value.name,
      clone_type: figureData.value.clone_type,
      video_path: figureData.value.video_path
    }
  }).then((res) => {
    uni.showToast({
      title: res.message,
      icon: 'success',
      duration: 1500
    })
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/index/index'
      })
    }, 1500)
  }).finally(() => {
    uni.hideLoading()
    figureLoading.value = false
  })
}
</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
