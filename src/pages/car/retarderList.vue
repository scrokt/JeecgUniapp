<route lang="json5" type="page">
{
style: {
navigationStyle: 'custom',
navigationBarTitleText: '顶信息列表',
},
}
</route>
<template>
  <PageLayout
    :navbarShow="true"
    navTitle="顶信息列表"
    back-route-name="carList"
    route-method="pushTab"
  >
    <!-- 搜索区域 -->
    <view class="search-area">
      <wd-input
        v-model="searchParams.retarderNo"
        placeholder="请输入顶编号"
        clearable
        class="search-input"
      />
      <wd-button type="primary" @click="handleSearch">搜索</wd-button>
    </view>
    <scroll-view
      class="scroll-container"
      scroll-y
      @scrolltolower="loadMore"
      :style="{height: `calc(100vh - ${navbarHeight + 60}px)`}"
    >
      <view class="retarder-list">
        <view v-for="(retarder, index) in retarderList" :key="index" class="retarder-item">
          <view class="retarder-header">
            <text class="code">顶编号：{{ retarder.retarderNo }}</text>
          </view>
          <view class="retarder-details">
            <view class="detail">
              <text class="label">顶型号：</text>
              <text class="value">{{ retarder.model_dictText }}</text>
            </view>
            <view class="detail">
              <text class="label">慢压压力值：</text>
              <text class="value">{{ retarder.slowPress }}</text>
            </view>
            <view class="detail">
              <text class="label">快压压力值：</text>
              <text class="value">{{ retarder.fastPress }}</text>
            </view>
            <view class="detail">
              <text class="label">顶状态：</text>
              <text class="value">{{ retarder.retarderState_dictText }}</text>
            </view>
            <view class="detail">
              <text class="label">回程时间：</text>
              <text class="value">{{ retarder.returnTime }}</text>
            </view>
            <view class="detail">
              <text class="label">间隙：</text>
              <text class="value">{{ retarder.clearance }}</text>
            </view>
            <view class="detail">
              <text class="label">安装高度：</text>
              <text class="value">{{ retarder.installHeight }}</text>
            </view>
            <view class="detail">
              <text class="label">更新时间：</text>
              <text class="value">{{ retarder.createTime }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="loading-text" v-if="isLoading">加载中...</view>
      <view class="no-more-text" v-if="noMoreData">没有更多数据了</view>
    </scroll-view>
  </PageLayout>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import {http} from '@/utils/http'

const retarderList = ref([])
const code = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const isLoading = ref(false)
const noMoreData = ref(false)
const navbarHeight = ref(0)
const searchParams = ref({
  retarderNo: '',
})
// 获取路径参数
onLoad((options) => {
  const carCode = options.code // 获取传递的 code 参数
  console.log('小车编号:', carCode)
  code.value = carCode
  // 获取导航栏高度
  const systemInfo = uni.getSystemInfoSync()
  navbarHeight.value = systemInfo.statusBarHeight + 44
})
// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  noMoreData.value = false
  fetchRetarderList()
}

// 获取顶状态列表
const fetchRetarderList = async (isLoadMore = false) => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const params = {
      code: code.value,
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      retarderNo: searchParams.value.retarderNo,
    }
    const res = await http.get('/car/carInfo/list', params)
    if (isLoadMore) {
      retarderList.value = [...retarderList.value, ...res.result.records]
    } else {
      retarderList.value = res.result.records
    }
    noMoreData.value = res.result.records.length < pageSize.value
  } catch (error) {
    console.error('获取顶状态列表失败:', error)
  } finally {
    isLoading.value = false
  }
}
// 加载更多
const loadMore = () => {
  if (noMoreData.value || isLoading.value) return
  currentPage.value++
  fetchRetarderList(true)
}

onMounted(() => {
  fetchRetarderList()
})
</script>

<style lang="scss" scoped>
.search-area {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.search-input {
  flex: 1;
  margin-right: 10px;
}

.date-picker {
  width: 150px;
  margin-right: 10px;
}
.scroll-container {
  overflow-y: auto;
}

.retarder-list {
  padding: 16px;
}

.retarder-item {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.retarder-header {
  margin-bottom: 8px;
}

.code {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.retarder-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.detail {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.label {
  color: #999;
  margin-right: 4px;
}

.value {
  color: #333;
}

.loading-text, .no-more-text {
  text-align: center;
  padding: 10px;
  color: #999;
  font-size: 14px;
}
</style>
