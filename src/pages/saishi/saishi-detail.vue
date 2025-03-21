<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationBarTitleText: '赛事详情',
    navigationStyle: 'default',
  },
}
</route>
<template>
  <view class="saishi-detail-page">
    <!-- 赛事图片 -->
    <image class="saishi-image" :src="`${getImageUrl(event.event.bannerImage)}`" mode="scaleToFill"></image>
    <!-- 赛事信息 -->
    <view class="saishi-info">
      <view class="info-item-title" >{{ event.event.eventName }}</view>
      <view class="info-item">报名开始时间：{{ event.event.startTime }}</view>
      <view class="info-item">报名截止时间：{{ event.event.endTime }}</view>
      <view class="info-item">比赛日期：{{ event.event.competitionDate }}</view>
      <view class="info-item">颁奖日期：{{ event.event.awardDate }}</view>
      <view class="info-item">报名费用：{{ event.event.registrationFee }} 元</view>
    </view>
    <!-- 赛事介绍 -->
<!--    <view class="saishi-introduction">-->
<!--      <view class="title">赛事介绍</view>-->
<!--      <view class="content">{{ event.event.description }}</view>-->
<!--    </view>-->
    <wd-tabs v-model="tab" slidable="always">
      <wd-tab :title="`赛事介绍`">
        <rich-text :nodes="event.event.description"></rich-text>
      </wd-tab>
      <wd-tab :title="`比赛规则`">
        <rich-text :nodes="event.event.description"></rich-text>
      </wd-tab>
      <wd-tab :title="`赛程安排`">
        <rich-text :nodes="event.event.description"></rich-text>
      </wd-tab>
      <wd-tab :title="`比赛地图`">
        <rich-text :nodes="event.event.description"></rich-text>
      </wd-tab>
    </wd-tabs>
    <!-- 悬浮按钮 -->
    <view class="button-group">
      <button class="button" @click="confirmSelection('个人报名')">个人报名</button>
      <button class="button" @click="confirmSelection('团队报名')">团队报名</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getImageUrl, cache } from '@/common/uitls'

const trackId = ref(null)
const event = reactive({
  event: {},
  routes: [],
})
const tab = ref<number>(0)
onLoad((options) => {
  if (options.id) {
    trackId.value = options.id
  }
  event.event = cache('event')
})


// 个人报名方法
const confirmSelection = (type: string) => {
  if (type === '个人报名') {
    // 跳转到个人报名页面
    uni.navigateTo({
      url: `/pages/saishi/personRegisition?id=${trackId.value}`,
    })
  } else if (type === '团队报名') {
    // 跳转到个人报名页面
    uni.navigateTo({
      url: `/pages/saishi/teamRegisition?id=${trackId.value}`,
    })
  }
}

// 团队报名方法
const teamRegistration = () => {
  console.log('点击了团队报名')
  // 这里可以添加跳转到团队报名页面的逻辑
}
</script>

<style scoped>
.saishi-detail-page {
  width: 100vw;
  min-height: 100vh;
  position: relative;
}

.saishi-image {
  width: 100%;
  height: 330rpx;
  object-fit: cover;
}

.saishi-info {
  padding: 20rpx;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  margin-bottom: 10rpx;
}
.info-item-title {
  margin-bottom: 10rpx;
  font-size: 20px;
  font-weight: bold;
}
.info-item {
  margin-bottom: 10rpx;
}

.saishi-introduction {
  padding: 20rpx;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.content {
  color: #666;
}

.button-group {
  position: fixed;
  bottom: 20rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20rpx;
}

.button {
  width: 300rpx;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #418aff;
  color: white;
  border: none;
  border-radius: 40rpx;
  font-size: 16px;
  cursor: pointer;
}
</style>
