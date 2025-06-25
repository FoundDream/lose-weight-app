<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useWeightStore } from "../../stores/weight";
import WeightStats from "./components/WeightStats.vue";
import QuickInput from "./components/QuickInput.vue";
import WeightList from "./components/WeightList.vue";
import WeightChart from "./components/WeightChart.vue";

const weightStore = useWeightStore();

// 初始化数据
onMounted(() => {
  weightStore.initMockData();
});

const currentWeight = computed(() => weightStore.currentWeight);
const targetWeight = computed(() => weightStore.targetWeight);
const unit = computed(() => weightStore.unit);
const weightStats = computed(() => weightStore.weightStats);
const recentRecords = computed(() => weightStore.recentRecords);

const handleUpdateRecord = (id: string, updates: any) => {
  weightStore.updateRecord(id, updates);
};

const handleDeleteRecord = (id: string) => {
  weightStore.deleteRecord(id);
};
</script>

<template>
  <div class="weight-management-page">
    <!-- 头部 -->
    <div class="page-header">
      <div class="header-title">体重管理</div>
      <div class="header-date">
        {{ new Date().toLocaleDateString("zh-CN") }}
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 统计卡片 -->
      <WeightStats
        :current-weight="currentWeight"
        :target-weight="targetWeight"
        :unit="unit"
        :stats="weightStats"
      />

      <!-- 快速输入 -->
      <QuickInput :unit="unit" />

      <!-- 趋势图表 -->
      <WeightChart :records="recentRecords" :unit="unit" />

      <!-- 历史记录列表 -->
      <WeightList
        :records="recentRecords"
        :unit="unit"
        @update-record="handleUpdateRecord"
        @delete-record="handleDeleteRecord"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
@primary-color: #6366f1;
@bg-primary: #ffffff;
@text-primary: #1e293b;
@text-secondary: #64748b;

.weight-management-page {
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  color: white;
  font-weight: 600;

  .header-title {
    font-size: 20px;
  }

  .header-date {
    font-size: 14px;
    opacity: 0.9;
  }
}

.main-content {
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
