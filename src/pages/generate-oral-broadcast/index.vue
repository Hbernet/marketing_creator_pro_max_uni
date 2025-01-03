<template>
  <view class="generate-oral-broadcast">
    <uni-nav-bar
      title="AI视频创作"
      color="#fff"
      background-color="#131414"
      left-icon="left"
      :border="false"
      @clickLeft="back"
      right-text="生成"
      @clickRight="generate"
    >
    </uni-nav-bar>
    <view class="generate-oral-broadcast-page h-full">
      <view class="preview-container">
        <view class="content-container" :class="data.video_layout === 1 ? 'content-container-horizontal' : 'content-container-vertical'">
          <image
            v-if="data.no_green_cover_image_path"
            class="preview-img"
            :src="data.no_green_cover_image_path"
            mode="aspectFit"
          />
          <view v-if="data.subtitle_switch === 1" class="preview-text">
            这是文案区的字幕
          </view>
        </view>
      </view>
    <view class="config-container">
      <view class="top-container">
        <template v-if="data.digital_human_avatars_id > 0">
          <view class="digital-human-container" @click="digitalHumanPopupOpen">
            <image class="digital-human-img" :src="data.no_green_cover_image_path" mode="aspectFill" />
            <view class="digital-human-name ml16">{{ data.digital_human_avatars_name }}</view>
            <image class="digital-human-icon ml16" src="/static/images/icon/icon_refresh.png" />
          </view>
        </template>
        <template v-else>
          <view class="digital-human-container" @click="digitalHumanPopupOpen">
            <image class="digital-human-icon" src="/static/images/icon/icon_digital_human.png" />
            <view class="digital-human-name ml16">数字人</view>
          </view>
        </template>
        <view class="digital-human-container ml16" @click="voicePopupOpen">
          <image class="digital-human-icon" src="/static/images/icon/icon_voice.png" />
          <view class="digital-human-name ml16">{{ data.voice_name || '配音' }}</view>
        </view>
        <view class="flex1"></view>
        <view class="subtitle-container">
          <view class="subtitle-title">字幕</view>
          <switch class="subtitle-switch" :checked="data.subtitle_switch === 1" color="#5CDAFD" @change="switchSubtitle" />
        </view>
      </view>
      <view class="script-container">
        <textarea class="script-textarea" placeholder="请输入文案" :maxlength="-1" v-model="data.script_content" />
      </view>
    </view>
    <uni-popup ref="digitalHumanPopup" type="bottom">
      <view class="popup-container">
        <view class="popup-title">选择数字人</view>
        <template v-if="currentTab === 'self'">
          <view class="popup-search">
            <image @click="getSelfCharacterList" class="popup-search-icon" src="/static/images/icon/icon_search.png" />
            <input
              class="popup-search-input" 
              placeholder="请输入关键字" 
              v-model="selfCharacterName"
              confirm-type="search"
              @confirm="getSelfCharacterList"
            />
          </view>
        </template>
        <template v-if="currentTab === 'public'"> 
          <view class="popup-search">
            <image @click="getPublicCharacterList" class="popup-search-icon" src="/static/images/icon/icon_search.png" />
            <input
              class="popup-search-input" 
              placeholder="请输入关键字" 
              v-model="publicCharacterName"
              confirm-type="search"
              @confirm="getPublicCharacterList"
            />
          </view>
        </template>
        <view class="global-tab-list">
          <view
            :class="['tab-item', currentTab === 'self' ? 'active' : '']"
            @click="currentTab = 'self'"
          >
            个人
          </view>
          <view
            :class="['tab-item', currentTab === 'public' ? 'active' : '']"
            @click="currentTab = 'public'"
          >
            公共
          </view>
        </view>
        <template v-if="currentTab === 'self'">
          <scroll-view 
            class="digital-human-popup-scroll-view" 
            scroll-y
            @scrolltolower="loadSelfCharacterMore"
          > 
            <template v-if="selfCharacterList.length > 0">
              <view class="digital-human-popup-list">
                <view
                  class="digital-human-popup-item"
                  :class="data.digital_human_avatars_id === item.id ? 'active' : ''"
                  v-for="item in selfCharacterList"
                  :key="item.id"
                  @click="selectDigitalHuman(item)"
                >
                  <image class="digital-human-popup-item-img" :src="item.no_green_cover_image_path" mode="aspectFill" />
                  <image class="selected-icon" src="/static/images/icon/icon_selected.png" />
                </view>
              </view>
              <uni-load-more :status="selfCharacterLoadMoreStatus" />
            </template>
            <template v-else>
              <view class="global-list-empty">
                <image class="global-list-empty-icon" src="/static/images/icon/empty_data.png" />
                <view class="global-list-empty-text">暂无数据</view>
              </view>
            </template>
          </scroll-view>
        </template>
        <template v-if="currentTab === 'public'">
          <scroll-view 
            class="digital-human-popup-scroll-view" 
            scroll-y
            @scrolltolower="loadPublicCharacterMore"
          > 
            <template v-if="publicCharacterList.length > 0">
              <view class="digital-human-popup-list">
                <view
                  class="digital-human-popup-item"
                  :class="data.digital_human_avatars_id === item.id ? 'active' : ''"
                  v-for="item in publicCharacterList"
                  :key="item.id"
                  @click="selectDigitalHuman(item)"
                >
                  <image class="digital-human-popup-item-img" :src="item.no_green_cover_image_path" mode="aspectFill" />
                  <image class="selected-icon" src="/static/images/icon/icon_selected.png" />
                </view>
              </view>
              <uni-load-more :status="publicCharacterLoadMoreStatus" />
            </template>
            <template v-else>
              <view class="global-list-empty">
                <image class="global-list-empty-icon" src="/static/images/icon/empty_data.png" />
                <view class="global-list-empty-text">暂无数据</view>
              </view>
            </template>
          </scroll-view>
        </template>
      </view>
    </uni-popup>
    <uni-popup ref="voicePopup" type="bottom">
      <view class="popup-container">
        <view class="popup-title">选择配音</view>
        <view class="popup-search">
            <image @click="getPublicVoiceList" class="popup-search-icon" src="/static/images/icon/icon_search.png" />
            <input
              class="popup-search-input" 
              placeholder="请输入关键字" 
              v-model="publicVoiceName"
              confirm-type="search"
              @confirm="getPublicVoiceList"
            />
          </view>
          <scroll-view 
            class="voice-popup-scroll-view" 
            scroll-y
            @scrolltolower="loadVoiceMore"
          > 
            <template v-if="publicVoiceList.length > 0">
              <view class="voice-popup-list">
                <view
                  :class="['voice-popup-item', data.voice_id === item.id ? 'active' : '']"
                  v-for="item in publicVoiceList"
                  :key="item.id"
                  @click="selectVoice(item)"
                >
                  <view class="voice-popup-item-img">
                    <image class="voice-popup-item-img-icon" src="/static/images/icon/icon_voice.png" mode="aspectFill" />
                  </view>
                  <view class="voice-popup-item-name">{{ item.name }}</view>
                  <image class="selected-icon" src="/static/images/icon/icon_selected.png" />
                </view>
              </view>
              <uni-load-more :status="publicVoiceLoadMoreStatus" />
            </template>
            <template v-else>
              <view class="global-list-empty">
                <image class="global-list-empty-icon" src="/static/images/icon/empty_data.png" />
                <view class="global-list-empty-text">暂无数据</view>
              </view>
            </template>
          </scroll-view>
      </view>
    </uni-popup>
  </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import http from '@/utils/http'
import { Howl } from 'howler'
const data = ref({
  script_content: '',
  video_title: '',
  digital_human_avatars_switch: 1,
  digital_human_avatars_id: 0,
  digital_human_avatars_download_url: '',
  digital_human_avatars_human_id: 0,
  digital_human_avatars_type: 1, // 0-公共 1-个人
  digital_human_avatars_position: "0,0",
  digital_human_avatars_scale: 1,
  digital_human_avatars_name: '',
  no_green_cover_image_path: '',
  digital_human_avatars_no_green_cover_image_width: 0,
  digital_human_avatars_no_green_cover_image_height: 0,
  voice_id: 0,
  voice_download_url: '',
  voice_npy_prompt_text: '',
  voice_voice_id: 0,
})
const generateLoading = ref(false)
const selfCharacterList = ref([])
const selfCharacterHasMore = ref(true)
const selfCharacterLoadMoreStatus = ref('more')
const selfCharacterPage = ref(1)
const selfCharacterName = ref('')
const publicCharacterName = ref('')
const publicCharacterList = ref([])
const publicCharacterHasMore = ref(true)
const publicCharacterLoadMoreStatus = ref('more')
const publicCharacterPage = ref(1)
const publicVoiceName = ref('')
const publicVoiceList = ref([])
const publicVoiceHasMore = ref(true)
const publicVoiceLoadMoreStatus = ref('more')
const publicVoicePage = ref(1)
const digitalHumanPopup = ref(null)
const voicePopup = ref(null)
const currentTab = ref('self')
let innerAudioContext = null
onLoad((options) => {
  data.value.video_layout = options.videoLayout - 0
  getSelfCharacterList()
  getPublicCharacterList()
  getPublicVoiceList()
})
onUnload(() => {
  if (innerAudioContext) {
    innerAudioContext.unload()
  }
})
const back = () => {
  uni.reLaunch({
    url: '/pages/index/index'
  })
}
const playVoice = (path) => {
  if (innerAudioContext) {
    innerAudioContext.unload()
    innerAudioContext = null
  }
  innerAudioContext = new Howl({ src: [path] })
  innerAudioContext.play()
}
const generate = () => {
  if (generateLoading.value) {
    return false
  }
  let params = JSON.parse(JSON.stringify(data.value))
  if (!params.script_content) {
    uni.showToast({
      title: '请输入文案',
      icon: 'none'
    })
    return false
  }
  if (!params.digital_human_avatars_id) {
    uni.showToast({
      title: '请选择数字人',
      icon: 'none'
    })
    return false
  }
  if (!params.voice_id) {
    uni.showToast({
      title: '请选择配音',
      icon: 'none'
    })
    return false
  }
  generateLoading.value = true
  uni.showLoading({
    title: '生成中...'
  })
  http.request({
    url: '/video/h5-create',
    method: 'post',
    data: params
  }).then((res) => {
    uni.hideLoading()
    uni.showToast({
      title: res.message,
      icon: 'success',
      duration: 1500
    })
    setTimeout(() => {
      back()
    }, 1500)
  }).finally(() => {
    generateLoading.value = false
  })
}
const selectDigitalHuman = (item) => {
  data.value.digital_human_avatars_id = item.id
  data.value.digital_human_avatars_type = item.type
  data.value.no_green_cover_image_path = item.no_green_cover_image_path
  data.value.digital_human_avatars_no_green_cover_image_width = item.no_green_cover_image_width
  data.value.digital_human_avatars_no_green_cover_image_height = item.no_green_cover_image_height
  data.value.digital_human_avatars_name = item.name
  data.value.digital_human_avatars_human_id = item.human_id
  data.value.digital_human_avatars_download_url = item.video_path
  digitalHumanPopup.value.close()
}
const selectVoice = (item) => {
  data.value.voice_id = item.id
  data.value.voice_name = item.name
  data.value.voice_download_url = item.file_path
  data.value.voice_npy_prompt_text = item.npy_prompt_text
  data.value.voice_voice_id = item.voice_id
  playVoice(item.sample_audio_url)
  voicePopup.value.close()
}
const digitalHumanPopupOpen = () => {
  digitalHumanPopup.value.open()
}
const switchSubtitle = (e) => {
  data.value.subtitle_switch = e.detail.value ? 1 : 0
}
const getSelfCharacterList = (isLoadMore = false) => {
  if (!selfCharacterHasMore.value && isLoadMore) return Promise.resolve()
  const params = {
    url: '/digital-human-avatars/',
    method: 'GET',
    data: {
      page: selfCharacterPage.value,
      page_size: 9,
      name: selfCharacterName.value,
      status: 1,
      type: 1
    }
  }
  selfCharacterLoadMoreStatus.value = 'loading'
  return http.request(params).then(({ data: res }) => {
    if (isLoadMore) {
      selfCharacterList.value = [...selfCharacterList.value, ...res.items]
    } else {
      selfCharacterList.value = res.items
    }
    if (selfCharacterList.value.length < res.total) {
      selfCharacterHasMore.value = true
      selfCharacterLoadMoreStatus.value = 'more'
      selfCharacterPage.value++
    } else {
      selfCharacterHasMore.value = false
      selfCharacterLoadMoreStatus.value = 'noMore'
    }
  })
}
const loadSelfCharacterMore = () => {
  if (selfCharacterLoadMoreStatus.value === 'loading') return
  getSelfCharacterList(true)
}
const getPublicCharacterList = (isLoadMore = false) => {
  if (!publicCharacterHasMore.value && isLoadMore) return Promise.resolve()
  const params = {
    url: '/digital-human-avatars/',
    method: 'GET',
    data: {
      page: publicCharacterPage.value,
      page_size: 9,
      name: publicCharacterName.value,
      status: 1,
      type: 0
    }
  }
  publicCharacterLoadMoreStatus.value = 'loading'
  return http.request(params).then(({ data: res }) => {
    if (isLoadMore) {
      publicCharacterList.value = [...publicCharacterList.value, ...res.items]
    } else {
      publicCharacterList.value = res.items
    }
    if (publicCharacterList.value.length < res.total) {
      publicCharacterHasMore.value = true
      publicCharacterLoadMoreStatus.value = 'more'
      publicCharacterPage.value++
    } else {
      publicCharacterHasMore.value = false
      publicCharacterLoadMoreStatus.value = 'noMore'
    }
  })
}
const loadPublicCharacterMore = () => {
  if (publicCharacterLoadMoreStatus.value === 'loading') return
  getPublicCharacterList(true)
}
const voicePopupOpen = () => {
  voicePopup.value.open()
}
const getPublicVoiceList = (isLoadMore = false) => {
  if (!publicVoiceHasMore.value && isLoadMore) return Promise.resolve()
  const params = {
    url: '/digital-human-voices/',
    method: 'GET',
    data: {
      page: publicVoicePage.value,
      page_size: 9,
      name: publicVoiceName.value,
      status: 1,
      type: 0
    }
  }
  publicVoiceLoadMoreStatus.value = 'loading'
  return http.request(params).then(({ data: res }) => {
    if (isLoadMore) {
      publicVoiceList.value = [...publicVoiceList.value, ...res.items]
    } else {
      publicVoiceList.value = res.items
    }
    if (publicVoiceList.value.length < res.total) {
      publicVoiceHasMore.value = true
      publicVoiceLoadMoreStatus.value = 'more'
      publicVoicePage.value++
    } else {
      publicVoiceHasMore.value = false
      publicVoiceLoadMoreStatus.value = 'noMore'
    }
  })
}
const loadVoiceMore = () => {
  if (publicVoiceLoadMoreStatus.value === 'loading') return
  getPublicVoiceList(true)
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>

