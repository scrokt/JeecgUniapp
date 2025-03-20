<route lang="json5" type="home">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="saishi-page">
    <image class="background-image" :src="haibaoUrl" mode="cover"></image>
    <!-- 立即报名按钮 -->
    <button class="register-button" @click="showPopup = true">立即报名</button>
    <!-- wd-popup 组件 -->
    <wd-popup v-model="showPopup" :closeOnClickOverlay="true" custom-style="border-radius:24rpx;">
      <view class="track-list">
        <button
          v-for="(track, index) in event.routes"
          :key="index"
          :class="{ 'selected-track': selectedTrackIndex === index }"
          @click="selectTrack(index)"
        >
          <view
            class="track-image"
            :style="{ backgroundImage: `url(${getImageUrl(track.routeImage)})` }"
          ></view>
          <view class="track-text">{{ track.routeName }}</view>
          <image
            v-if="selectedTrackIndex === index"
            class="selected-icon"
            :src="selectedIcon"
            mode="aspectFit"
          ></image>
        </button>
      </view>
      <!-- 新增：确认和关闭按钮 -->
      <view class="button-group">
        <view class="confirm-button-group">
          <button class="confirm-button" @click="confirmSelection('个人报名')">个人报名</button>
          <button class="confirm-button" @click="confirmSelection('团队报名')">团队报名</button>
        </view>
        <button class="close-button" @click="showPopup = false">关闭</button>
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
import { http } from '@/utils/http'
import { getStaticDomainURL } from '@/common/uitls'
// 定义赛道数据
const event = reactive({
  event: {},
  routes: [],
})
const tracks = ref([
  { id: 1, image: '../../static/saishi/cg.png', text: '常规赛道' },
  { id: 2, image: '../../static/saishi/qz.png', text: '亲子赛道' },
  { id: 3, image: '../../static/saishi/wh.png', text: '网红赛道' },
])
const haibaoUrl = ref('')
onLoad(async () => {
  try {
    // 发起请求获取赛事数据
    const eventResponse = await http.get('/events/common/queryLastEvent')
    event.event = eventResponse.result
    haibaoUrl.value = getImageUrl(event.event.posterImage)
    // 发起请求获取路线数据
    const routeResponse = await http.get('/events/common/queryLastEventRoutes')
    event.routes = routeResponse.result
  } catch (error) {
    console.error('数据加载失败:', error)
    // 可以在这里添加提示信息，如 uni.showToast
  }
})
// 定义选中图标路径
const selectedIcon = '../../static/saishi/selected.png'

// 定义是否显示弹出层
const showPopup = ref(false)

// 定义选中的赛道索引
const selectedTrackIndex = ref(-1)
const getImageUrl = (path: string) => {
  return getStaticDomainURL() + '/' + path
}
// 选择赛道的方法
const selectTrack = (index: number) => {
  selectedTrackIndex.value = index
}
const confirmSelection = (type: string) => {
  if (selectedTrackIndex.value === -1) {
    uni.showToast({
      title: '请先选择赛道',
      icon: 'none',
    })
    return
  }
  const route = event.routes[selectedTrackIndex.value]
  showPopup.value = false
  if (type === '个人报名') {
    // 跳转到个人报名页面
    uni.navigateTo({
      url: `/pages/saishi/personRegisition?id=${route.id}`,
    })
  } else if (type === '团队报名') {
    // 跳转到个人报名页面
    uni.navigateTo({
      url: `/pages/saishi/teamRegisition?id=${route.id}`,
    })
  }
}
</script>

<style scoped>
.saishi-page {
  /* 设置全屏 */
  width: 100vw;
  /* #ifdef MP-WEIXIN */
  height: 100vh;
  /* #endif */
  /* #ifndef MP-WEIXIN */
  height: calc(100vh - 60px);
  /* #endif */

  position: relative; /* 为按钮的绝对定位做准备 */
}
/* 新增背景图片样式 */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* #ifdef MP-WEIXIN */
  z-index: -1;
  /* #endif */
}
.register-button {
  /* 悬浮按钮样式 */
  position: absolute;
  bottom: 50px; /* 距离底部的距离，可以根据需要调整 */
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 50px;
  line-height: 50px;
  background-color: #418aff;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 24px;
  cursor: pointer;
}

.track-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.track-list button {
  position: relative;
  width: 500rpx;
  border: 4rpx solid transparent;
  background: none;
  padding: 0;
  margin: 0;
  outline: none;
  border-radius: 10rpx;
}

.selected-track {
  border: 4rpx solid #ffac62 !important;
}
.track-image {
  width: 100%;
  height: 150rpx; /* 可根据实际情况调整高度 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.track-text {
  position: absolute;
  top: 30rpx;
  right: 10rpx;
  color: white;
  padding: 2px 5px;
}
.selected-icon {
  position: absolute;
  right: 0;
  bottom: -4rpx;
  width: 50rpx;
  height: 50rpx;
}

/* 新增：按钮组样式 */
.button-group {
  display: flex;
  /* 修改为纵向排列 */
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

/* 新增：确认按钮样式 */
.confirm-button {
  /* 修改宽度，以适应两个按钮横向排列 */
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 50rpx;
  font-size: 14px;
  background-color: #418aff;
  color: white;
  border: none;
  cursor: pointer;
  margin: 0 5px; /* 添加左右间距 */
}

/* 新增：确认按钮组样式 */
.confirm-button-group {
  display: flex;
  flex-direction: row; /* 横向排列 */
  justify-content: center;
  width: 500rpx;
}

/* 新增：关闭按钮样式 */
.close-button {
  width: 500rpx; /* 等宽设置 */
  height: 80rpx;
  line-height: 80rpx;
  background: none;
  border: 0; /* 无边框 */
  color: #656565;
  cursor: pointer;
  font-size: 14px;
}
.close-button::after {
  border: none !important;
}
</style>
