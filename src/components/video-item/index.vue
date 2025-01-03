<template>
  <view class="video-item">
    <image
      class="video-item-img"
      v-if="item[keyFilter.status] === 1"
      :src="item[keyFilter.coverPath]"
      @click="previewVideo(item[keyFilter.videoPath])"
      mode="aspectFill"
    ></image>
    <image
      class="video-item-img"
      v-else-if="item[keyFilter.status] === 0"
      src="@/static/images/common/creating_img.png"
      mode="aspectFill"
    ></image>
    <view class="img-fail" v-else>
      <image class="img-fail-icon" src="@/static/images/common/img_fail.png" mode="aspectFill"></image>
      <text class="img-fail-text">生成失败</text>
    </view>
    <view class="item-top">
      <view class="item-top-left">
        <view v-if="item[keyFilter.status] === 0" class="view-cell blue">
          <image class="icon" src="@/static/images/icon/icon_loading.png" mode="aspectFill"></image>
          <view class="name">生成中</view>
        </view>
        <view v-else-if="item[keyFilter.status] === 1" class="view-cell green">
          <view class="point"></view>
          <view class="name">已完成</view>
        </view>
        <view v-else class="view-cell red">
          <view class="point"></view>
          <view class="name">生成失败</view>
        </view>
      </view>
      <view class="flex1"></view>
      <view class="more-cell" @click="handleMore(item)" v-if="haveMore">
        <image class="more-cell-icon" src="@/static/images/icon/icon_more.png" mode="aspectFill"></image>
      </view>
    </view>
    <view class="item-bottom" v-if="haveBottom">
      <view class="name">{{ item[keyFilter.name] }}</view>
      <view class="time">{{ item[keyFilter.createdAt] }}</view>
    </view>
  </view> 
</template>

<script setup>
const emit = defineEmits(['handleMore', 'previewVideo'])
const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  keyFilter: {
    type: Object, // key映射 默认为数字人列表字段
    default: () => {
      return {
        coverPath: 'no_green_cover_image_path',
        createdAt: 'created_at',
        videoPath: 'welcome_video_path',
        name: 'name',
        id: 'id',
        status: 'status'
      }
    }
  },
  haveMore: {
    type: Boolean,
    default: true
  },
  haveBottom: {
    type: Boolean,
    default: true
  }
})
const handleMore = (item) => {
  emit('handleMore', item)
}
const previewVideo = (videoPath) => {
  emit('previewVideo', videoPath)
}
</script>
<style lang="scss" scoped>
.video-item {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12rpx;
  overflow: hidden;
  .video-item-img {
    width: 100%;
    height: 100%;
    display: block;
  }
  .img-fail {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #2B2D2D;
    .img-fail-icon {
      width: 80rpx;
      height: 80rpx;
      color: rgba(255,255,255,0.2);
    }
    .img-fail-text {
      padding-top: 16rpx;
      font-size: 28rpx;
      line-height: 40rpx;
      color: rgba(255,255,255,0.2);
    }
  }
  .item-top {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 20rpx 20rpx 0;
    box-sizing: border-box;
    .item-top-left {
      display: flex;
      align-items: center;
      .view-cell {
        display: flex;
        align-items: center;
        padding: 0 8rpx;
        height: 36rpx;
        background: #ffffff;
        border-radius: 12rpx;
        color: rgba(0,0,0,0.8);
        .icon {
          width: 32rpx;
          height: 32rpx;
          display: block;
          margin-right: 8rpx;
        }
        .point {
          width: 12rpx;
          height: 12rpx;
          margin-right: 8rpx;
          border-radius: 50%;
        }
        .name {
          font-size: 24rpx;
          line-height: 32rpx;
          font-weight: 500;
        }
        
        &.blue {
          background: #D6F6FF;
          color: #05BDF0;
        }
        &.green {
          background: #D7FFD8;
          color: rgba(0,154,3,0.8);
          .point {
            background: #0CDC10;
          }
        }
        &.red {
          background: #FFD3D3;
          color: rgba(220,12,12,0.8);
          .point {
            background: #DC0C0C;
          }
        }
      }
    }
    .more-cell {
      width: 48rpx;
      height: 48rpx;
      .more-cell-icon {
        width: 48rpx;
        height: 48rpx;
        display: block;
      }
    }
  }
  .item-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient( 180deg, rgba(0,0,0,0) 0%, #000000 100%);
    box-sizing: border-box;
    padding: 10rpx 16rpx;
    .name {
      font-size: 28rpx;
      line-height: 40rpx;
      font-weight: 500;
      color: #ffffff;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .time {
      font-size: 24rpx;
      line-height: 34rpx;
      color: rgba(255,255,255,0.5);
      font-weight: 400;
      padding-top: 8rpx;
    }
  }
}
</style>
