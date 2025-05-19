<route lang="json5" type="page">
{
style: {
navigationStyle: 'custom',
navigationBarTitleText: '',
},
}
</route>
<template>
  <PageLayout :navbarShow="false">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <wd-search v-model="code" placeholder="请输入小车编号" @search="handleSearch" hide-cancel />
    </view>

    <!-- 小车列表 -->
    <scroll-view class="scroll-container" scroll-y>
      <view class="car-list">
        <view v-for="car in carList" :key="car.id" class="car-item" @click="handleCarClick(car)">
          <image src="@/static/car/lcar.png" class="car-image"/>
          <view class="car-info">

            <view class="car-name">
              <span class="status-dot"
                    :class="{'online': car.connectState === 1, 'offline': car.connectState === 0}"></span>
              小车编号：{{ car.code }}
            </view>
            <text class="car-status">
              {{
                car.province_dictText +
                car.city_dictText +
                car.unit_dictText +
                car.yard_dictText +
                car.track_dictText +
                car.area_dictText
              }}
            </text>
            <text class="car-status">
              运行状态：{{ car.runState_dictText }} 运行方向：{{ car.runDirection_dictText }}
            </text>
            <view class="car-actions">
              <wd-button type="primary" size="small" @click="handleViewStatus(car)">
                查看顶信息
              </wd-button>
              <wd-button type="warning" size="small" @click="handleControl(car)">
                下发控制
              </wd-button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import {http} from '@/utils/http'

const carList = ref([])
const code = ref('')

// 获取小车列表
const fetchCarList = async () => {
  try {
    const res = await http.get('/car/carInfo/carList', {code: code.value})
    carList.value = res.result.records
  } catch (error) {
    console.error('获取小车列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  fetchCarList()
}

// 点击小车
const handleCarClick = (car) => {
  console.log('点击小车:', car)
  // 这里可以跳转到小车详情页
}

// 查看状态
const handleViewStatus = (car) => {
  uni.redirectTo({
    url: '/pages/car/retarderList?code=' + car.code,
  })
}

// 下发控制
const handleControl = (car) => {
  uni.redirectTo({
    url: '/pages/car/carControl?code=' + car.code,
  })
}

onMounted(() => {
  fetchCarList()
})
</script>

<style lang="scss" scoped>
.scroll-container {
  height: calc(100vh - 60px); // 根据实际情况调整高度
  overflow-y: auto;
}

.search-bar {
  padding: 16px;
  background-color: #fff;
}

.car-list {
  padding: 16px;
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

.car-actions {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.pagination {
  padding: 16px;
  background-color: #fff;
}
</style>
