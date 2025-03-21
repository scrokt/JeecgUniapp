<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationBarTitleText: '报名信息',
    navigationStyle: 'default',
  },
}
</route>
<template>
  <view class="registration-list-page">
    <!-- 列表容器 -->
    <view class="list-container">
      <!-- 循环渲染每个报名信息项 -->
      <view class="list-item" v-for="item in registrationList" :key="item.id">
        <!-- 赛事 Logo -->
        <image class="event-logo" :src="getImageUrl(item.logoImage)" mode="aspectFit"></image>
        <!-- 赛事信息 -->
        <view class="event-info">
          <!-- 赛事名称 -->
          <view class="event-name">{{ item.eventName }}</view>
          <!-- 报名类型 -->
          <view class="registration-type">报名类型：{{ item.registrationType }}</view>
          <!-- 报名时间 -->
          <view class="registration-time">报名时间：{{ item.registrationTime }}</view>
          <view class="registration-time">报名费用：{{ item.registrationFee }}</view>
          <view class="registration-time">
            <wd-tag v-if="item.paymentStatus===0" type="danger" plain>未支付</wd-tag>
            <wd-tag v-if="item.paymentStatus===1" type="success" plain>已支付</wd-tag>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { http } from '@/utils/http'
import { getImageUrl,cache } from '@/common/uitls'
// 定义报名信息列表数据
const registrationList = ref([])

// 获取报名信息列表的函数
const getRegistrationList = async () => {
  try {
    // 调用后台接口获取数据，这里需要替换为实际的接口地址
    const registrationRes = await http.get(
      '/events/app/registration/list',
    )
    if (registrationRes.success) {
      // 将接口返回的数据赋值给 registrationList
      registrationList.value = registrationRes.result
    }else{
      uni.showToast({
        title: registrationRes.message,
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('获取报名信息列表失败:', error)
  }
}

// 在页面挂载时调用获取数据的函数
onMounted(() => {
  getRegistrationList()
})
</script>

<style scoped>
.registration-list-page {
  width: 100vw;
  min-height: 100vh;
  padding: 20rpx;
}

.list-container {
  width: 100%;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
  background-color: #fff;
}

.event-logo {
  width: 100rpx;
  height: 100rpx;
  margin-right: 20rpx;
}

.event-info {
  flex: 1;
}

.event-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.registration-type,
.registration-time {
  font-size: 14px;
  color: #666;
}
</style>
