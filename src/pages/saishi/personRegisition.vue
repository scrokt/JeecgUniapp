<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationBarTitleText: '个人报名',
    navigationStyle: 'default',
  },
}
</route>
<template>
  <view class="container">
    <!-- 赛事信息摘要 -->
    <view class="event-summary">
      <!-- 左侧 logo 图 -->
      <view class="event-logo">
        <image :src="`${getImageUrl(event.event.logoImage)}`" mode="aspectFit"></image>
      </view>
      <!-- 右侧赛事详情 -->
      <view class="event-details">
        <view class="event-name">{{ event.event.eventName }}</view>
        <view class="event-deadline">报名截止时间：{{ event.event.endTime }}</view>
        <view class="event-fee">报名费用：{{ event.event.registrationFee }} 元</view>
      </view>
    </view>

    <wd-form @submit="submitForm" custom-class="regis-form">
      <!-- 姓名输入框 -->
      <wd-form-item label="姓名">
        <wd-input v-model="formData.username" placeholder="请输入姓名"></wd-input>
      </wd-form-item>
      <!-- 性别单选框 -->
      <wd-form-item label="性别">
        <wd-radio-group v-model="formData.gender">
          <wd-radio value="1">男</wd-radio>
          <wd-radio value="2">女</wd-radio>
        </wd-radio-group>
      </wd-form-item>
      <!-- 手机号码输入框 -->
      <wd-form-item label="手机号码">
        <wd-input v-model="formData.phone" placeholder="请输入手机号码"></wd-input>
      </wd-form-item>
      <!-- 身份证号输入框 -->
      <wd-form-item label="身份证号">
        <wd-input
          v-model="formData.idCardNumber"
          placeholder="请输入身份证号"
          @blur="calculateAge"
        ></wd-input>
      </wd-form-item>
      <!-- 年龄输入框（只读） -->
      <wd-form-item label="年龄">
        <wd-input v-model="formData.age" placeholder="输入身份证号自动计算" readonly></wd-input>
      </wd-form-item>
    </wd-form>
    <!-- 确认报名按钮 -->
    <wd-button custom-class="confirm-button" @click="submitForm">确认报名</wd-button>
    <wd-toast />
  </view>
</template>

<script lang="ts" setup>
import { useToast } from 'wot-design-uni'
import { http } from '@/utils/http'
import { getImageUrl, cache } from '@/common/uitls'
import { useUserStore } from '@/store/user'

// 定义赛道 id
const trackId = ref(null)
const userStore = useUserStore()
const event = reactive({
  event: {},
  routes: [],
})
onLoad((options) => {
  if (options.id) {
    trackId.value = options.id
  }
  event.event = cache('event')
  // 每次进入页面时初始化表单数据
  initFormData()
})

// 表单数据
const formData = reactive({
  username: '',
  gender: '',
  phone: '',
  idCardNumber: '',
  age: '',
})
// 重新初始化表单数据的函数
const initFormData = () => {
  formData.username = userStore.userInfo.realname
  formData.gender = userStore.userInfo.sex + ''
  formData.phone = userStore.userInfo.phone
  formData.idCardNumber = userStore.userInfo.idCardNumber
  formData.age = ''
}
// 手机号码正则表达式
const phoneReg = /^1[3-9]\d{9}$/
// 身份证号正则表达式
const idCardReg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$/
const toast = useToast()
// 计算年龄
const calculateAge = () => {
  const idCardNumber = formData.idCardNumber
  if (idCardReg.test(idCardNumber)) {
    const birthYear = parseInt(idCardNumber.slice(6, 10))
    const currentYear = new Date().getFullYear()
    formData.age = currentYear - birthYear
  } else {
    formData.age = ''
  }
}

// 提交表单
const submitForm = () => {
  const { username, gender, phone, idCardNumber } = formData
  if (!username || !gender || !phone || !idCardNumber) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none',
    })
    return
  }
  if (!phoneReg.test(phone)) {
    uni.showToast({
      title: '手机号码格式不正确',
      icon: 'none',
    })
    return
  }
  if (!idCardReg.test(idCardNumber)) {
    uni.showToast({
      title: '身份证号格式不正确',
      icon: 'none',
    })
    return
  }
  http
    .post('/events/app/personRegistration', { ...formData, routeId: trackId.value })
    .then((res: any) => {
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
}
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.event-summary {
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  background-color: #fff;
  padding: 10px;
}

.event-logo {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}

.event-logo image {
  width: 100%;
  height: 100%;
}

.event-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.event-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.event-deadline,
.event-fee {
  font-size: 14px;
  color: #666;
}
.regis-form {
  height: calc(100vh - 130px);
  background-color: #fff;
}
/* 确认报名按钮样式 */
:deep .confirm-button {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
}
</style>
