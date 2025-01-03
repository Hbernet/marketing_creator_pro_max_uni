<template>
  <view class="page-wrapper mh-100vh">
    <view class="login-bg-wrapper">
      <image class="login-bg-logo" src="@/static/images/login/logo.png"></image>
      <image class="login-bg-title" src="@/static/images/login/login_bg_title.png"></image>
      <view class="login-bg-subtitle">
        <text>赋能企业获客&成交</text>
      </view>
      <view class="login-bg-welcome">
        <text>欢迎登录</text>
      </view>
    </view>
    <view class="login-form-wrapper">
      <view class="login-form">
        <view class="login-form-item">
          <image class="login-form-item-icon" src="@/static/images/login/icon_account.png"></image>
          <input v-model="loginAccount" type="text" placeholder="请输入账号" autocomplete="off" />
        </view>
        <view class="login-form-item">
          <image class="login-form-item-icon" src="@/static/images/login/icon_password.png"></image>
          <input v-model="loginPassword" type="text" password placeholder="请输入密码" autocomplete="new-password" />
        </view>
      </view>
      <view class="flex1"></view>
      <view class="login-form-button" @click="handleLogin">
        登 录
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const loginAccount = ref('')
const loginPassword = ref('')
onLoad(() => {
  uni.setNavigationBarColor({
    backgroundColor: '#000000'
  })
})
const handleLogin = () => {
  if (!loginAccount.value || !loginPassword.value) {
    uni.showToast({
      title: '请输入账号和密码',
      icon: 'none'
    })
    return
  }
  if (loginAccount.value === 'admin' && loginPassword.value === 'admin') {
    uni.redirectTo({
      url: '/pages/index/index'
    })
  } else {
    uni.showToast({
      title: '账号或密码错误',
      icon: 'none'
    })
  }
}
</script>
  
<style scoped lang="scss">
@use './index.scss';
</style>
  