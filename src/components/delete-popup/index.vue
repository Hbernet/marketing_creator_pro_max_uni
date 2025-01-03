<template>
  <view class="delete-popup">
    <view class="delete-popup-title">
      {{ title }}
    </view>
    <view class="delete-popup-content">
      {{ content }}
    </view>
    <view class="delete-popup-footer">
      <view class="delete-popup-footer-item" @click="emit('close')">取消</view>
      <view class="delete-popup-footer-item delete-confirm" @click="emit('confirm')">删除</view>
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
.delete-popup {
  width: 686rpx;
  padding: 50rpx 16rpx 16rpx;
  background: #2B2D2D;
  border-radius: 12rpx;
  box-sizing: border-box;
  .delete-popup-title {
    font-size: 28rpx;
    line-height: 40rpx; 
    text-align: center;
    color: #FFFFFF;
  }
  .delete-popup-content {
    padding-top: 20rpx;
    font-size: 24rpx;
    line-height: 36rpx;
    text-align: center;
    color: rgba(255,255,255,0.6);
    font-weight: 400;
  }
  .delete-popup-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 32rpx;
    .delete-popup-footer-item {
      width: 240rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      color: rgba(255,255,255,0.8);
      border-radius: 12rpx;
      background: #393C3C;
      font-size: 28rpx;
      font-weight: 500;
      &.delete-confirm {
        background: rgba(220,12,12,0.2);
        width: 398rpx;
        color: rgba(220,12,12,0.8);
      }
    }
  }
}
</style>
