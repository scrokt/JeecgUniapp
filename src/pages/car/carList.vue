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
      <wd-search
        v-model="code"
        placeholder="请输入小车编号"
        @search="handleSearch"
      />
    </view>

    <!-- 小车列表 -->
    <view class="car-list">
      <view
        v-for="car in carList"
        :key="car.id"
        class="car-item"
        @click="handleCarClick(car)"
      >
        <image src="@/static/car/lcar.png" class="car-image" />
        <view class="car-info">
          <text class="car-name">小车编号：{{ car.code }}</text>
          <text class="car-status" >{{ car.province_dictText + car.city_dictText+ car.unit_dictText+car.yard_dictText+car.track_dictText+car.area_dictText}}</text>
          <text class="car-status" >运行状态：{{ car.runState_dictText}} 运行方向：{{ car.runDirection_dictText}}</text>
          <view class="car-actions">
            <wd-button type="primary" size="small" @click="handleViewStatus(car)">查看顶信息</wd-button>
            <wd-button type="warning" size="small" @click="handleControl(car)">下发控制</wd-button>
          </view>
        </view>
      </view>
    </view>

  </PageLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { http } from '@/utils/http'

const carList = ref([])
const code = ref('')
const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)

// 获取小车列表
const fetchCarList = async () => {
  try {
    const res = await http.get('/car/carInfo/list', {
        code: code.value,
        pageNo: currentPage.value,
        pageSize: pageSize.value,
    })
    carList.value = res.result.records
    total.value = res.result.total
  } catch (error) {
    console.error('获取小车列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
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
const handleControl = (car: Car) => {
  router.push({
    path: '/pages/car/control',
    query: { id: car.id.toString() },
  })
}


onMounted(() => {
  fetchCarList()
})
</script>

<style lang="scss" scoped>
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
  font-size: 16px;
  font-weight: bold;
  color: #333;
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
