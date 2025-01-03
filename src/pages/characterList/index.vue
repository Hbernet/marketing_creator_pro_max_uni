<template>
  <scroll-view 
    class="character-list-page h-full" 
    scroll-y
    @scrolltolower="loadMore"
  > 
    <view class="character-list"> 
      <view class="character-item" v-for="item in characterList" :key="item.id">
        <video-item :item="item" @handleMore="popupOpen" @previewVideo="previewVideo" />
      </view>
    </view>
    <uni-popup ref="popup" type="bottom">
      <view class="popup-content">
        <view class="popup-content-title">
          <view class="popup-content-title-text">{{ currentItem.name }}</view>
          <image class="popup-content-title-icon" src="@/static/images/icon/icon_close.png" mode="aspectFill" @click="popupClose"></image>
        </view>
        <view class="popup-content-body">
          <view class="popup-content-body-item" @click="deletePopupOpen">删除</view>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="deletePopup" type="center">
      <delete-popup
        :title="currentItem.name"
        :content="`您确定删除【${currentItem.name}】吗？删除无法找回`"
        @close="deletePopupClose"
        @confirm="deleteCharacter"
      />
    </uni-popup>
    <uni-load-more :status="loadMoreStatus" />
    <!-- 视频预览 -->
    <VideoPreviewPopup ref="videoPreviewPopup"/>
  </scroll-view>
</template>
<script setup>
import { ref } from 'vue'
import http from '@/utils/http'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import DeletePopup from '@/components/delete-popup/index.vue'
import VideoItem from '@/components/video-item/index.vue'
import VideoPreviewPopup from '@/components/video-preview-popup/index.vue'
const characterList = ref([])
const characterPage = ref(1)
const characterHasMore = ref(true)
const loadMoreStatus = ref('loading')
const popup = ref(null)
const deletePopup = ref(null)
const currentItem = ref({})
const isDeleting = ref(false)
const videoPreviewPopup = ref(null)
const previewVideo = (videoPath) => {
  videoPreviewPopup.value.previewVideo(videoPath)
}
const getCharacterList = (isLoadMore = false) => {
  if (!characterHasMore.value && isLoadMore) return Promise.resolve()
  const params = {
    url: '/digital-human-avatars/',
    method: 'GET',
    data: {
      page: characterPage.value,
      page_size: 10
    }
  }
  loadMoreStatus.value = 'loading'
  return http.request(params).then(({ data: res }) => {
    if (isLoadMore) {
      characterList.value = [...characterList.value, ...res.items]
    } else {
      characterList.value = res.items
    }
    if (characterList.value.length < res.total) {
      characterHasMore.value = true
      loadMoreStatus.value = 'more'
      characterPage.value++
    } else {
      characterHasMore.value = false
      loadMoreStatus.value = 'noMore'
    }
  })
}
const deletePopupOpen = () => {
  deletePopup.value.open()
}
const deletePopupClose = () => {
  deletePopup.value.close()
}
const deleteCharacter = () => {
  if (isDeleting.value) return
  
  isDeleting.value = true
  const params = {
    url: `/digital-human-avatars/${currentItem.value.id}/`,
    method: 'delete',
  }
  uni.showToast({
    title: '删除中',
    icon: 'loading'
  })
  http.request(params).then(() => {
    uni.showToast({
      title: '删除成功',
      icon: 'success'
    })
    deletePopup.value.close()
    getCharacterList()
  }).catch((err) => {
    uni.showToast({
      title: '删除失败',
      icon: 'error'
    })
  }).finally(() => {
    isDeleting.value = false
  })
}
const popupOpen = (item) => {
  currentItem.value = item
  popup.value.open()
}
const popupClose = () => {
  popup.value.close()
}
const onPullDownRefreshFn = () => {
  characterPage.value = 1
  characterHasMore.value = true
  getCharacterList().finally(() => {
    uni.stopPullDownRefresh()
  })
}
const loadMore = () => {
  if (loadMoreStatus.value === 'loading') return
  getCharacterList(true)
}
onLoad(() => {
  getCharacterList()
  onPullDownRefresh(onPullDownRefreshFn)
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>

