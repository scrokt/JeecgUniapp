<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '个人',
  },
}
</route>

<template>
  <PageLayout :navbarShow="false">
    <view
      class="avatar-area"
      :style="{ backgroundImage: `url(${getImageUrl('static/wode1.png')})` }"
    >
      <!-- prettier-ignore -->
      <image class="avatar-bg" :src="`${getImageUrl('static/wode2.png')}`"  mode="scaleFill"></image>
      <image class="avatar-logo" :src="getAvatar(personalList.sex)"></image>
      <view class="user-name">{{ personalList.realname }}</view>
    </view>

    <view class="grid-container">
      <!-- 循环生成 6 个网格项 -->
      <view class="grid-item">
        <view class="top-text">2</view>
        <view class="bottom-text">已报名</view>
      </view>
      <view class="grid-item">
        <view class="top-text">2</view>
        <view class="bottom-text">已完成</view>
      </view>
      <view class="grid-item">
        <view class="top-text">2</view>
        <view class="bottom-text">待评价</view>
      </view>
      <view class="grid-item">
        <view class="top-text">2</view>
        <view class="bottom-text">获赞</view>
      </view>
      <view class="grid-item">
        <view class="top-text">2</view>
        <view class="bottom-text">获评论</view>
      </view>
      <view class="grid-item">
        <view class="top-text">2</view>
        <view class="bottom-text">最佳成绩</view>
      </view>
    </view>

    <scroll-view scroll-y>
      <wd-cell-group custom-class="shadow-warp" border clickable>
        <template v-for="(item, index) in dataSource" :key="index">
          <wd-cell :title="item.title" is-link @click="handleCell(item)">
            <template #icon>
              <view :class="item.class" class="mr-2"></view>
            </template>
          </wd-cell>
        </template>
      </wd-cell-group>
    </scroll-view>
  </PageLayout>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onBeforeUnmount } from 'vue'
import { cache, getFileAccessHttpUrl, hasRoute, getImageUrl } from '@/common/uitls'
import { onLaunch, onShow, onHide, onLoad, onReady } from '@dcloudio/uni-app'
import { useToast, useMessage, useNotify } from 'wot-design-uni'
import { useRouter } from '@/plugin/uni-mini-router'
import { http } from '@/utils/http'
import { useUserStore } from '@/store/user'
import { getEnvBaseUrl } from '@/utils/index'

//
const userStore = useUserStore()
const toast = useToast()
const router = useRouter()
const message = useMessage()
const personalList = reactive({
  avatar: '',
  realname: '',
  username: '',
  post: '',
  depart: '',
  sex: '',
})
const userId = ref(userStore.userInfo.userid)
const stopWatch: any = null
const api = {
  userUrl: '/events/common/queryUserInfo',
  uploadUrl: `${getEnvBaseUrl()}/sys/common/upload`,
}
const dataSource = [
  { key: 'registration', title: '报名信息', class: 'cuIcon-favorfill text-yellow' },
  { key: 'redPacket', title: '成绩记录', class: 'cuIcon-redpacket_fill text-red' },
  { key: 'scan', title: '评价反馈', class: 'cuIcon-scan text-red' },
  { key: 'location', title: '互动游戏', class: 'cuIcon-location text-cyan' },
  { key: 'exit', title: '退出登录', class: 'cuIcon-exit text-cyan' },
]
const getAvatar = (gender) => {
  return gender === 1
    ? getImageUrl('static/male_avatar.png')
    : getImageUrl('static/female_avatar.png')
}
const load = () => {
  if (!userId.value) {
    return
  }
  http
    .get(api.userUrl)
    .then((res: any) => {
      if (res.success) {
        const perArr = res.result
        personalList.realname = perArr.realname
        personalList.username = perArr.username
        personalList.sex = perArr.sex
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
const goRegistion = () => {
  uni.navigateTo({
    url: '/pages/saishi/registration-list',
  })
}
const exit = () => {
  message
    .confirm({
      title: '提示',
      msg: '确定退出吗？',
    })
    .then(() => {
      userStore.clearUserInfo()
      router.replaceAll({ name: 'login' })
    })
}
const handleCell = (item) => {
  switch (item.key) {
    case 'registration':
      goRegistion()
      break
    case 'location':
      router.push({ name: 'location' })
      break
    case 'setttings':
      router.push({ name: 'userEdit' })
      break
    case 'exit':
      exit()
      break
    default:
      toast.show('功能暂未开发~')
  }
}
onBeforeUnmount(() => {
  stopWatch?.()
})
onLoad(() => {
  load()
})
</script>

<style lang="scss" scoped>
//
.avatar-area {
  background-size: cover;
  height: 600rpx;
  display: flex;
  justify-content: center;
  padding-top: 200rpx;
  overflow: hidden;
  position: relative;
  flex-direction: column;
  align-items: center;
  color: #fff;
  font-weight: 300;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}
.avatar-bg {
  width: 100%;
  height: 300px !important;
}
.avatar-logo {
  width: 154rpx;
  height: 154rpx;
  border-radius: 50%;
  position: absolute;
  top: 220rpx;
}

:deep(.wd-cell-group) {
  margin: 0 26upx;
  border-radius: 18upx;
  overflow: hidden;
  --wot-cell-line-height: 32px;
  .wd-cell {
    --wot-cell-title-fs: 15px;
    --wot-cell-title-color: var(--color-gray);
    .wd-cell__left {
      font-size: 15px;
    }
  }
}
:deep(.pageContent) {
  background-color: #f0f3f8;
}
:deep(.uni-scroll-view-content) {
  background-color: #f0f3f8;
}
.user-name {
  font-size: 20px;
  margin-top: 10px;
  color: #333333;
  position: absolute;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 150rpx);
  gap: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 20rpx;
  margin: 26rpx;
  margin-top: -50px;
  z-index: 1;
}

.grid-item {
  border: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.top-text {
  font-size: 18px;
  font-weight: bold;
}

.bottom-text {
  font-size: 14px;
  color: #666666;
}
</style>
