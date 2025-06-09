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
            <span class="status-dot"
                  :class="{'online': carInfo.connectState === 1, 'offline': carInfo.connectState === 0}"></span>
            小车编号：{{ carInfo.code }}
          </view>
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
            运行状态：
            <text :class="['status-text', carInfo.runState_dictText]">{{ carInfo.runState_dictText }}</text>
            运行方向：
            <text class="direction-icon">
              {{ carInfo.runDirection_dictText === '向前' ? '→' : '←' }}
              <text>{{ carInfo.runDirection_dictText }}</text>
            </text>
          </text>
          <text class="car-status">
            当前模式：{{ carInfo.mode===0?'自动模式':'维护模式' }}
          </text>
          <text class="car-status" v-if="faultMessages.length > 0">
            故障信息：<text class="fault-text">{{ faultMessages.join('、') }}</text>
          </text>
        </view>
      </view>

      <!-- 控制区域 -->
      <view class="control-area">
        <text class="title">控制面板</text>
        <view class="mode-selector" v-if="carInfo.runState === 0">
          <wd-radio-group shape="button"  v-model="mode">
            <wd-radio :value="0">自动模式</wd-radio>
            <wd-radio :value="1">维护模式</wd-radio>
          </wd-radio-group>
        </view>
        <!-- 运行方向 -->
        <!-- 运行状态切换按钮 -->
        <view class="control-item">
          <wd-button
            v-if="carInfo.runState === 0"
            type="primary" plain
            size="small"
            icon="arrow-left"
            @click="handle(1,1)"
            :loading="isSubmitting"
          >向后
          </wd-button>
          <wd-button

            :type="carInfo.runState === 1 ? 'error' : 'success'"
            :icon="carInfo.runState === 1 ?'stop':'play'"
            :loading="isSubmitting"
            @click="handle(carInfo.runState === 1? 0 : 1,carInfo.runDirection)"
          >
            {{ carInfo.runState === 1 ? '停止' : '启动' }}
          </wd-button>
          <wd-button
            v-if="carInfo.runState === 0"
            type="primary" plain size="small"
            icon="arrow-right"
            @click="handle(1,0)"
            :loading="isSubmitting"
          >向前
          </wd-button>
        </view>

      </view>
    </view>
    <view class="ws-status-area">
      <text class="ws-status" :class="{'connected': isWsConnected, 'disconnected': !isWsConnected}">
        服务端: {{ isWsConnected ? '已连接' : '已断开' }}
      </text>
      <wd-button
        v-if="!isWsConnected"
        type="primary"
        size="small"
        @click="manualReconnect"
        :loading="isReconnecting"
      >重新连接
      </wd-button>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {http} from '@/utils/http'

const isSubmitting = ref(false)
const code = ref('')
const mode = ref(0) // 0:自动 1:维护
// WebSocket 相关
const socket = ref<WebSocket | null>(null)
const reconnectAttempts = ref(0)
const maxReconnectAttempts = 5
const reconnectInterval = 3000 // 3秒重试间隔
let reconnectTimer: number | null = null
// 获取环境变量配置
const WS_BASEURL = import.meta.env.VITE_WS_BASEURL
// 添加WebSocket状态变量
const isWsConnected = ref(false)
const isReconnecting = ref(false)

// Canvas相关
// 获取路径参数
onLoad((options) => {
  const carCode = options.code // 获取传递的 code 参数
  console.log('小车编号:', carCode)
  code.value = carCode
})
// 小车基本信息
const carInfo = ref({})

const initWebSocket = () => {
  // 清除之前的连接
  if (socket.value) {
    socket.value.close()
  }

  // 创建新连接
  socket.value = new WebSocket(`${WS_BASEURL}?carId=${code.value}`)

  socket.value.onopen = () => {
    console.log('WebSocket 连接已建立')
    isWsConnected.value = true
    isReconnecting.value = false
    reconnectAttempts.value = 0
  }

  socket.value.onmessage = (e) => {
    console.log('收到消息:', e.data)
    // 处理小车状态更新
    try {
      const data = JSON.parse(e.data)
      if (data.code == code.value) {
        // 更新小车状态
        carInfo.value.runState = data.runState
        carInfo.value.runState_dictText = data.runState === 0 ? '停止' : '运行'
        carInfo.value.runDirection = data.runDirection
        carInfo.value.runDirection_dictText = data.runDirection === 0 ? '向前' : '向后'
        carInfo.value.mode = data.mode
        mode.value = data.mode
        carInfo.value.faultInfo = data.faultInfo
      }
    } catch (error) {
      console.error('解析WebSocket消息失败:', error)
    }
  }

  socket.value.onerror = (e) => {
    console.error('WebSocket 错误:', e)
    isWsConnected.value = false
    isReconnecting.value = false
    // 尝试重连
    attemptReconnect()
  }

  socket.value.onclose = (e) => {
    console.log('WebSocket 连接已关闭', e.code, e.reason)
    isWsConnected.value = false
    if (e.code !== 1000) { // 1000是正常关闭
      attemptReconnect()
    }
  }
}
// 添加手动重连方法
const manualReconnect = () => {
  if (isReconnecting.value) return

  isReconnecting.value = true
  reconnectAttempts.value = 0 // 重置重连计数器
  initWebSocket()
}
const attemptReconnect = () => {
  if (reconnectAttempts.value < maxReconnectAttempts) {
    reconnectAttempts.value++
    console.log(`尝试第 ${reconnectAttempts.value} 次重连...`)

    reconnectTimer = setTimeout(() => {
      initWebSocket()
    }, reconnectInterval) as unknown as number
  } else {
    console.log('已达到最大重连次数，停止尝试')
    isReconnecting.value = false
    uni.showToast({
      title: '连接服务器失败',
      icon: 'none',
      duration: 2000
    })
  }
}
onMounted(() => {
  fetchCar()
  initWebSocket()
})
const fetchCar = async () => {
  try {
    const res = await http.get('/car/carInfo/carList', {
      code: code.value,
    })
    carInfo.value = res.result.records[0]
    mode.value = carInfo.value.mode
  } catch (error) {
    console.error('获取小车列表失败:', error)
  }
}
// 计算故障信息
const faultMessages = computed(() => {
  const faults = []
  if (!carInfo.value.faultInfo) return faults

  const faultMap = [
    '压力缸过载',
    '压力缸过流',
    '压力缸过压',
    '压力缸欠压',
    '轮毂电机报警',
    '电量低报警'
  ]

  for (let i = 0; i < faultMap.length; i++) {
    if (carInfo.value.faultInfo & (1 << i)) {
      faults.push(faultMap[i])
    }
  }
  return faults
})
// 切换运行状态并下发
const handle = async (status, dir) => {
  isSubmitting.value = true
  try {
    const res = await http.post('/car/carInfo/writeControlInfo', {
      code: code.value,
      runState: status,
      runDirection: dir,
      mode: mode.value,
    })
    if (res.success) {
      uni.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000
      })
      fetchCar()
    } else {
      uni.showToast({
        title: res.message,
        icon: 'error',
        duration: 2000
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

onUnmounted(() => {
  // 清理
  if (socket.value) {
    socket.value.close()
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
  }
})
</script>

<style scoped lang="scss">
.container {
  padding: 16px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 30px;
}

.info-item,
.control-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
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
}

.status-text {
  &.启动 {
    color: #67c23a;
  }

  &.停止 {
    color: #f56c6c;
  }
}
.mode-selector {
  margin-bottom: 15px;

  .wd-radio-group {
    display: flex;
    gap: 20px;
    justify-content: center;
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

.ws-status-area {
  margin-top: 20px;
  padding: 12px;
  background-color: #f8f8f8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ws-status {
  font-size: 14px;

  &.connected {
    color: #67c23a;
  }

  &.disconnected {
    color: #f56c6c;
  }
}
.fault-text {
  color: #f56c6c;
  font-weight: bold;
}
</style>
