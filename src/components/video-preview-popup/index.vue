<template>
  <uni-popup
    ref="videoPreviewPopup"
    type="center"
    class="video-preview-popup"
    mask-background-color="rgba(0, 0, 0, 1)"
    @close="closeVideoPreviewPopup"
  >
    <view class="video-preview-popup-content">
      <image class="close-btn-icon" @click="closeVideoPreviewPopup" src="@/static/images/icon/icon_close.png"></image>
      <image v-if="props.canDownload" class="download-btn-icon" @click="downloadVideo" src="@/static/images/icon/icon_download.png"></image>
      <image class="video-preview-popup-top-img" src="@/static/images/common/video_preview_top.png"></image>
      <video
        id="video"
        class="video"
        :src="videoPath"
        preload="auto"
        show-center-play-btn
      />
      <image class="video-preview-popup-bottom-img" src="@/static/images/common/video_preview_bottom.png"></image>
      <image class="video-preview-popup-modify-img" src="@/static/images/common/video_preview_modify.png"></image>
    </view>
  </uni-popup>
</template>
<script setup>
import { ref, getCurrentInstance } from 'vue'
import http from '@/utils/http'
let videoContext = null
const props = defineProps({
  canDownload: {
    type: Boolean,
    default: false
  }
})
const videoPreviewPopup = ref(null)
const videoPath = ref('')
const closeVideoPreviewPopup = () => {
  videoContext.pause()
  videoPreviewPopup.value.close()
}
const previewVideo = (path) => {
  videoPath.value = path
  videoPreviewPopup.value.open()
  const instance = getCurrentInstance()
  setTimeout(() => {
    videoContext = uni.createVideoContext('video', instance)
    videoContext.play()
  }, 300)
}
const downloadVideo = () => {
  uni.showLoading({
    title: '准备下载...'
  })
  http.request({
    url: '/file-deal/download',
    method: 'GET',
    data: {
      url: videoPath.value
    },
    responseType: 'arraybuffer'
  }).then((res) => {
    // TODO: 下载视频 目前只有h5支持
    const blob = new Blob([res], { type: 'video/mp4' })
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = blobUrl
    const fileName = videoPath.value.split('/').pop() || 'video.mp4'
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
    
    uni.showToast({
      title: '开始下载'
    })
  }).catch(error => {
    console.error('下载失败:', error)
    uni.showToast({
      title: '下载失败',
      icon: 'error'
    })
  }).finally(() => {
    uni.hideLoading()
  })
}
defineExpose({
  previewVideo,
  closeVideoPreviewPopup,
})
</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
