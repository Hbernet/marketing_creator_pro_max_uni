<template>
  <view class="logout-popup">
    <view class="logout-popup-title">
      {{ title }}
    </view>
    <view class="logout-popup-content">
      {{ content }}
    </view>
    <view class="logout-popup-footer">
      <view class="logout-popup-footer-item" @click="emit('close')">取消</view>
      <view class="logout-popup-footer-item logout-confirm" @click="emit('confirm')">退出登录</view>
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue'
const emit = defineEmits(['close', 'confirm'])
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  }
})
</script>
<style lang="scss" scoped>
.logout-popup {
  width: 686rpx;
  padding: 50rpx 16rpx 16rpx;
  background: #2B2D2D;
  border-radius: 12rpx;
  box-sizing: border-box;
  .logout-popup-title {
    font-size: 28rpx;
    line-height: 40rpx; 
    text-align: center;
    color: #FFFFFF;
  }
  .logout-popup-content {
    padding-top: 20rpx;
    font-size: 24rpx;
    line-height: 36rpx;
    text-align: center;
    color: rgba(255,255,255,0.6);
    font-weight: 400;
  }
  .logout-popup-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 32rpx;
    .logout-popup-footer-item {
      width: 240rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      color: rgba(255,255,255,0.8);
      border-radius: 12rpx;
      background: #393C3C;
      font-size: 28rpx;
      font-weight: 500;
      &.logout-confirm {
        color: rgba(0,0,0,0.8);
        background: linear-gradient( 98deg, #75E8FF 0%, #5CDAFD 100%);
        width: 398rpx;
      }
    }
  }
}
</style>
