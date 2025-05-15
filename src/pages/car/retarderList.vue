<route lang="json5" type="page">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '顶状态列表',
  }
}
</route>
<template>
  <PageLayout :navbarShow="false">
    <!-- 顶状态列表 -->
    <view class="retarder-list">
      <view v-for="(retarder, index) in retarderList" :key="index" class="retarder-item">
        <view class="retarder-info">
          <text class="label">顶型号：</text>
          <text class="value">{{ retarder.model_dictText }}</text>
        </view>
        <view class="retarder-info">
          <text class="label">顶编号：</text>
          <text class="value">{{ retarder.retarderNo }}</text>
        </view>
        <view class="retarder-info">
          <text class="label">慢压压力值：</text>
          <text class="value">{{ retarder.slowPress }}</text>
        </view>
        <view class="retarder-info">
          <text class="label">快压压力值：</text>
          <text class="value">{{ retarder.fastPress }}</text>
        </view>
        <view class="retarder-info">
          <text class="label">顶状态：</text>
          <text class="value">{{ retarder.retarderState_dictText }}</text>
        </view>
        <view class="retarder-info">
          <text class="label">回程时间：</text>
          <text class="value">{{ retarder.returnTime }}</text>
        </view>
        <view class="retarder-info">
          <text class="label">间隙：</text>
          <text class="value">{{ retarder.clearance }}</text>
        </view>
        <view class="retarder-info">
          <text class="label">安装高度：</text>
          <text class="value">{{ retarder.installHeight }}</text>
        </view>
        <view class="retarder-info">
          <text class="label">更新时间：</text>
          <text class="value">{{ retarder.updateTime }}</text>
        </view>
      </view>
    </view>
  </PageLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { http } from '@/utils/http'

const retarderList = ref([])

// 获取路径参数
onLoad((options) => {
  const code = options.code // 获取传递的 code 参数
  console.log('顶编号:', code)
  // 根据 code 获取顶状态数据
  fetchRetarderList(code)
})
// 获取顶状态列表
const fetchRetarderList = async (code) => {
  try {
    const res = await http.get('/car/carInfo/list',{code})
    retarderList.value = res.result.records
  } catch (error) {
    console.error('获取顶状态列表失败:', error)
  }
}

onMounted(() => {
  fetchRetarderList()
})
</script>

<style lang="scss" scoped>
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

.retarder-info {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.label {
  font-weight: bold;
  color: #333;
  width: 100px;
}

.value {
  flex: 1;
  color: #666;
}
</style>
