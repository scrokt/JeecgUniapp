<route lang="json5" type="page">
{
style: {
navigationStyle: 'custom',
navigationBarTitleText: '下发控制',
},
}
</route>
<template>
  <PageLayout
    :navbarShow="true"
    navTitle="下发控制"
    back-route-name="carList"
    route-method="pushTab"
  >
    <view class="container">
      <!-- 小车基本信息 -->
      <view class="car-item">
        <image src="@/static/car/lcar.png" class="car-image"/>
        <view class="car-info">
          <view class="car-name">
            <span class="status-dot" :class="{'online': carInfo.connectState === 1, 'offline': carInfo.connectState === 0}"></span>
            小车编号：{{ carInfo.code }}</view>
          <text class="car-status">
            {{
              carInfo.province_dictText +
              carInfo.city_dictText +
              carInfo.unit_dictText +
              carInfo.yard_dictText +
              carInfo.track_dictText +
              carInfo.area_dictText
            }}
          </text>
          <text class="car-status">
            运行状态： <text :class="['status-text', carInfo.runState_dictText]">{{ carInfo.runState_dictText }}</text>
            运行方向：<text class="direction-icon">
            {{ carInfo.runDirection_dictText === '向前' ? '→' : '←' }}
            <text>{{ carInfo.runDirection_dictText }}</text>
          </text>
          </text>
        </view>
      </view>

      <!-- 控制区域 -->
      <view class="control-area">
        <text class="title">控制面板</text>
        <!-- 运行方向 -->
        <view class="control-item">
          <text>运行方向：</text>
          <radio-group @change="handleDirectionChange">
            <label>
              <radio value="0" :checked="direction === 0"/>
              向前
            </label>
            <label>
              <radio value="1" :checked="direction === 1"/>
              向后
            </label>
          </radio-group>
        </view>

        <!-- 运行状态 -->
        <view class="control-item">
          <text>运行状态：</text>
          <radio-group @change="handleStatusChange">
            <label>
              <radio value="1" :checked="status === 1"/>
              启动
            </label>
            <label>
              <radio value="0" :checked="status === 0"/>
              停止
            </label>
          </radio-group>
        </view>

        <!-- 下发按钮 -->
        <wd-button class="submit-btn" :loading="isSubmitting" @click="handleSubmit">下发配置</wd-button>
      </view>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {http} from '@/utils/http'

const isSubmitting = ref(false)
const code = ref('')
// Canvas相关
// 获取路径参数
onLoad((options) => {
  const carCode = options.code // 获取传递的 code 参数
  console.log('小车编号:', carCode)
  code.value = carCode
})
// 小车基本信息
const carInfo = ref({})
onMounted(() => {
  fetchCar()

})
const fetchCar = async () => {
  try {
    const res = await http.get('/car/carInfo/carList', {
      code: code.value,
    })
    carInfo.value = res.result.records[0]
  } catch (error) {
    console.error('获取小车列表失败:', error)
  }
}
// 运行方向
const direction = ref(0)
const handleDirectionChange = (e: any) => {
  direction.value = e.detail.value
}

// 运行状态
const status = ref(0)
const handleStatusChange = (e: any) => {
  status.value = e.detail.value
}

// 下发配置
const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    console.log('下发配置：', {
      direction: direction.value,
      status: status.value
    })
    // 这里可以添加实际的下发逻辑
    // 模拟异步操作
    const res = await http.post('/car/carInfo/writeControlInfo', {
      code: code.value,
      runState: status.value,
      runDirection: direction.value
    })
    if(res.success){
      uni.showToast({
        title: '下发成功',
        icon: 'success',
        duration: 2000
      })
      fetchCar()
    }else {
      uni.showToast({
        title: res.message,
        icon:'error',
        duration: 2000
      })
    }
  } finally {
    isSubmitting.value = false
  }
  // 这里可以添加实际的下发逻辑
}
</script>

<style scoped lang="scss">
.container {
  padding: 16px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.info-item,
.control-item {
  margin-bottom: 15px;
}

.submit-btn {
  margin-top: 20px;
  background-color: #007aff;
  color: white;
}

.car-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.car-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 16px;
}

.car-info {
  flex: 1;
}

.car-name {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;

  &.online {
    background-color: #67c23a;
  }

  &.offline {
    background-color: #909399;
  }
}

.car-status {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  color: #666;

  &.启动 {
    color: #67c23a;
  }

  &.停止 {
    color: #f56c6c;
  }
}
.status-text {
  &.启动 {
    color: #67c23a;
  }
  &.停止 {
    color: #f56c6c;
  }
}
.direction-icon {
  margin: 0 4px;
  font-size: 16px;
  font-weight: bold;
}
.control-area {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

</style>
