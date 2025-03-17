<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '团队报名',
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
        <image src="../../static/saishi/logo.png" mode="aspectFit"></image>
      </view>
      <!-- 右侧赛事详情 -->
      <view class="event-details">
        <view class="event-name">趣味马拉松大赛</view>
        <view class="event-deadline">报名截止时间：2025-04-30</view>
        <view class="event-fee">报名费用：100 元/人</view>
      </view>
    </view>

    <!-- 团队名称输入框 -->
    <view class="team-container">
      <wd-form-item label="团队名称">
        <wd-input v-model="teamName" placeholder="请输入团队名称"></wd-input>
      </wd-form-item>

      <!-- 团队成员添加按钮 -->
      <view class="team-member-header">
        <view class="team-member-title">团队成员</view>
        <view class="add-member-container">
          <wd-button class="add-member-button" @click="showPersonForm = true">+ 添加成员</wd-button>
        </view>
      </view>

      <!-- 团队成员列表 -->
      <view class="member-list">
        <view v-for="(member, index) in teamMembers" :key="index" class="member-item">
          <!-- 头像 -->
          <view class="member-avatar">
            <image :src="getAvatar(member.gender)" mode="aspectFit"></image>
          </view>
          <!-- 成员信息 -->
          <view class="member-info">
            <view class="member-name">{{ member.name }}</view>
            <view class="member-phone">{{ member.phone }}</view>
          </view>
          <!-- 删除按钮 -->
          <wd-button class="delete-member-button" @click="deleteMember(index)">删除</wd-button>
        </view>
      </view>
      <!-- 团队人数和报名费用总数 -->
      <view class="total-info">
        <view>团队人数：{{ teamMembers.length }} 人</view>
        <view>报名费用总数：{{ teamMembers.length * 100 }} 元</view>
      </view>
      <!-- 确认报名按钮 -->
      <wd-button custom-class="confirm-button" @click="submitTeamForm">确认报名</wd-button>
    </view>

    <!-- 个人报名表单弹出层 -->
    <wd-popup
      v-model="showPersonForm"
      :closeOnClickOverlay="true"
      custom-style="border-radius:24rpx;"
    >
      <wd-form @submit="addMemberToTeam" class="add-form">
        <!-- 姓名输入框 -->
        <wd-form-item label="姓名">
          <wd-input v-model="personFormData.name" placeholder="请输入姓名"></wd-input>
        </wd-form-item>
        <!-- 性别单选框 -->
        <wd-form-item label="性别">
          <wd-radio-group v-model="personFormData.gender">
            <wd-radio value="男">男</wd-radio>
            <wd-radio value="女">女</wd-radio>
          </wd-radio-group>
        </wd-form-item>
        <!-- 手机号码输入框 -->
        <wd-form-item label="手机号码">
          <wd-input v-model="personFormData.phone" placeholder="请输入手机号码"></wd-input>
        </wd-form-item>
        <!-- 身份证号输入框 -->
        <wd-form-item label="身份证号">
          <wd-input
            v-model="personFormData.idCard"
            placeholder="请输入身份证号"
            @blur="calculateAge"
          ></wd-input>
        </wd-form-item>
        <!-- 年龄输入框 -->
        <wd-form-item label="年龄">
          <wd-input
            v-model="personFormData.age"
            placeholder="输入身份证号自动计算"
            readonly
          ></wd-input>
        </wd-form-item>
        <wd-button form-type="submit" @click="addMemberToTeam">确定</wd-button>
      </wd-form>
    </wd-popup>
  </view>
</template>

<script setup>
// 团队名称
const teamName = ref('')
// 团队成员列表
const teamMembers = ref([])

// 个人报名表单数据，改为响应式对象
const personFormData = reactive({
  name: '',
  gender: '男',
  phone: '',
  idCard: '',
  age: '',
})

// 是否显示个人报名表单弹出层
const showPersonForm = ref(false)

// 手机号码正则表达式
const phoneReg = /^1[3-9]\d{9}$/
// 身份证号正则表达式
const idCardReg = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$/

// 计算年龄
const calculateAge = () => {
  const idCard = personFormData.idCard
  if (idCardReg.test(idCard)) {
    const birthYear = parseInt(idCard.slice(6, 10))
    const currentYear = new Date().getFullYear()
    personFormData.age = currentYear - birthYear
  } else {
    personFormData.age = ''
  }
}

// 获取头像
const getAvatar = (gender) => {
  return gender === '男'
    ? '../../static/saishi/male_avatar.png'
    : '../../static/saishi/female_avatar.png'
}

// 添加成员到团队
const addMemberToTeam = () => {
  const { name, gender, phone, idCard } = personFormData
  if (!name || !gender || !phone || !idCard) {
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
  if (!idCardReg.test(idCard)) {
    uni.showToast({
      title: '身份证号格式不正确',
      icon: 'none',
    })
    return
  }
  teamMembers.value.push({ ...personFormData })
  // 重置表单数据
  personFormData.name = ''
  personFormData.gender = '男'
  personFormData.phone = ''
  personFormData.idCard = ''
  personFormData.age = ''

  showPersonForm.value = false
}

// 删除成员
const deleteMember = (index) => {
  teamMembers.value.splice(index, 1)
}

// 提交团队报名表单
const submitTeamForm = () => {
  if (!teamName.value) {
    uni.showToast({
      title: '请输入团队名称',
      icon: 'none',
    })
    return
  }
  if (teamMembers.value.length === 0) {
    uni.showToast({
      title: '请至少添加一名团队成员',
      icon: 'none',
    })
    return
  }
  // 这里可以添加提交团队报名表单数据到后端的逻辑
  uni.showToast({
    title: '团队报名提交成功',
    icon: 'success',
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
.team-container {
  background-color: #fff;
  height: calc(100vh - 130px);
}
.team-member-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.team-member-title {
  font-size: 18px;
  font-weight: bold;
}

.add-member-container {
  text-align: right;
  padding: 10px;
}

.add-member-button {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
}

.member-list {
  padding: 10px;
}

.member-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.member-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.member-avatar image {
  width: 100%;
  height: 100%;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 16px;
  font-weight: bold;
}

.member-phone {
  font-size: 14px;
  color: #666;
}

.add-form {
  width: 600rpx;
}

.delete-member-button {
  background-color: #ff3b30;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
}

.total-info {
  text-align: center;
  padding: 10px;
}

.confirm-button {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  border-radius: 25px;
}
</style>
