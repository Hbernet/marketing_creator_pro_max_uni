<template>
  <view class="page-wrapper">
    <view class="page-header" @click="toCharacterClone">
      <image class="page-header-bg" src="@/static/images/index/page_header_bg.png"></image>
      <view class="page-header-title">
        定制我的AI数字人
      </view>
      <view class="page-header-subtitle">
        形象、声音 1:1 完美克隆
      </view>
    </view>
    <view class="video-creation">
      <view class="video-creation-item" @click="toGenerateOralBroadcast">
        <view class="video-creation-item-left">
          <view class="video-creation-item-title">
            AI视频创作
          </view>
          <view class="video-creation-item-subtitle">
            数字人口播视频
          </view>
        </view>
        <image class="video-creation-item-right" src="@/static/images/index/video_creation_1.png"></image>
      </view>
      <view class="video-creation-item">
        <view class="video-creation-item-left">
          <view class="video-creation-item-title">
            AI混剪
          </view>
          <view class="video-creation-item-subtitle">
            暂无权限
          </view>
        </view>
        <image class="video-creation-item-right" src="@/static/images/index/video_creation_2.png"></image>
      </view>
    </view>
    <view class="digital-human-section">
      <view class="digital-human-section-title">
        <view class="digital-human-section-title-text">
          我的数字人
        </view>
        <view v-if="digitalHumanList.length > 0" class="digital-human-section-all" @click="toCharacterList">
          全部
          <image class="digital-human-section-all-icon" src="@/static/images/icon/icon_right_arrow.png"></image>
        </view>
      </view>
      <scroll-view 
        :scroll-x="true" 
        class="digital-human-section-list"
        @scrolltolower="onScrollToRight"
      >
        <view class="digital-human-section-item customized" @click="toCharacterClone">
          <image class="add-icon" src="@/static/images/icon/icon_add.png"></image>
          <view class="add-text">
            定制数字人
          </view>
        </view>
        <view
          v-for="item in digitalHumanList"
          class="digital-human-section-item"
          :key="item.id"
        >
          <video-item
            :item="item"
            :haveBottom="false"
            :haveMore="false"
            @previewVideo="previewDigitalHuman"
          />
        </view>
      </scroll-view>
    </view>
    <view class="video-section">
      <view class="video-section-tab">
        <view
          class="video-section-tab-item active"
        >
          短视频
        </view>
      </view>
      <scroll-view 
        v-if="videoList.length > 0" 
        :scroll-x="true" 
        class="video-section-list"
        @scrolltolower="onVideoScrollToRight"
      >
        <view
          v-for="item in videoList"
          class="video-section-item"
          :key="item.id"
        >
          <video-item
            :item="item"
            :keyFilter="videoKeyFilter"
            :haveBottom="false"
            :haveMore="false"
            @previewVideo="previewVideo"
          />
        </view>
      </scroll-view>
      <view v-if=" videoList.length === 0" class="video-section-empty">
        <image class="video-section-empty-icon" src="@/static/images/icon/empty_data.png"></image>
        <view class="video-section-empty-text">
          暂无生成视频
        </view>
      </view>
    </view>
    <!-- 退出登录 -->
    <view class="logout-btn" @click="logoutPopup.open()">
      退出登录
    </view>
    <!-- 数字人预览 -->
    <VideoPreviewPopup ref="digitalHumanPreviewPopup"/>
    <!-- 视频预览 -->
    <VideoPreviewPopup ref="videoPreviewPopup" :canDownload="true"/>
    <!-- 退出登录 -->
    <uni-popup ref="logoutPopup" type="center">
      <logout-popup
        title="您确定退出登录吗？"
        content=""
        @close="logoutPopup.close()"
        @confirm="logout"
      />
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/utils/http'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import videoItem from '@/components/video-item/index.vue'
import LogoutPopup from '@/components/logout-popup/index.vue'
import VideoPreviewPopup from '@/components/video-preview-popup/index.vue'
const logoutPopup = ref(null)
const videoPreviewPopup = ref(null)
const digitalHumanPreviewPopup = ref(null)
const digitalHumanList = ref([])
const digitalHumanPage = ref(1)
const digitalHumanHasMore = ref(true)
const videoList = ref([])
const videoPage = ref(1)
const videoHasMore = ref(true)
const videoKeyFilter = ref({
  coverPath: 'video_cover',
  createdAt: 'created_at',
  videoPath: 'video_url',
  name: 'title',
  id: 'id',
  status: 'status'
})
onMounted(() => {
  setTimeout(() => {
    uni.startPullDownRefresh()
  }, 100)
})
onPullDownRefresh(() => {
  init()
})
const init = () => {
  digitalHumanPage.value = 1
  videoPage.value = 1
  digitalHumanHasMore.value = true
  videoHasMore.value = true
  
  Promise.all([
    getDigitalHumanList(),
    getVideoList(),
  ]).finally(() => {
    uni.stopPullDownRefresh()
  })
}
const logout = () => {
  uni.clearStorage()
  uni.reLaunch({
    url: '/pages/login/index'
  })
  }
const previewVideo = (videoPath) => {
  videoPreviewPopup.value.previewVideo(videoPath)
}
const previewDigitalHuman = (digitalHumanPath) => {
  digitalHumanPreviewPopup.value.previewVideo(digitalHumanPath)
}
const toGenerateOralBroadcast = () => {
  uni.navigateTo({
    url: '/pages/generate-oral-broadcast/index'
  })
}
const toCharacterList = () => {
  uni.navigateTo({
    url: '/pages/characterList/index'
  })
}
const toCharacterClone = () => {
  uni.navigateTo({
    url: '/pages/characterClone/index'
  })
}
const getDigitalHumanList = (isLoadMore = false) => {
  if (!digitalHumanHasMore.value && isLoadMore) return Promise.resolve()
  const params = {
    url: '/digital-human-avatars/',
    method: 'GET',
    data: {
      page: digitalHumanPage.value,
      page_size: 5,
      type: 1
    }
  }
  return http.request(params).then(({ data: res }) => {
    if (isLoadMore) {
      digitalHumanList.value = [...digitalHumanList.value, ...res.items]
    } else {
      digitalHumanList.value = res.items
    }
    if (res.items.length < 10) {
      digitalHumanHasMore.value = false
    } else {
      digitalHumanPage.value++
    }
  })
}
const getVideoList = (isLoadMore = false) => {
  if (!videoHasMore.value && isLoadMore) return Promise.resolve()
  return http.request({
    url: '/short-videos/',
    method: 'GET',
    data: {
      page: videoPage.value,
      pageSize: 10,
      video_type: 0
    }
  }).then(({ data: res }) => {
    if (isLoadMore) {
      videoList.value = [...videoList.value, ...res.items]
    } else {
      videoList.value = res.items
    }
    if (res.items.length < 10) {
      videoHasMore.value = false
    } else {
      videoPage.value++
    }
  })
}
const onScrollToRight = () => {
  getDigitalHumanList(true)
}
const onVideoScrollToRight = () => {
  getVideoList(true)
}
</script>

<style scoped lang="scss">
@use './index.scss';
</style>
