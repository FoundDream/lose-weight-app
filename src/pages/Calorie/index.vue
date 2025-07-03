<template>
  <div class="calorie-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>热量管理</h2>
      <p class="page-subtitle">智能记录，科学管理你的每日热量摄入</p>
    </div>

    <!-- 智能录入区域 -->
    <div class="input-section">
      <CalorieInput @record-saved="handleRecordSaved" />
    </div>

    <!-- 今日统计概览 -->
    <div class="stats-section">
      <CalorieStats />
    </div>

    <!-- 历史记录 -->
    <div class="history-section">
      <CalorieHistory @record-updated="handleRecordUpdated" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import CalorieInput from "./components/CalorieInput/index.vue";
import CalorieStats from "./components/CalorieStats/index.vue";
import CalorieHistory from "./components/CalorieHistory/index.vue";

const handleRecordSaved = () => {
  // 记录保存后刷新数据
  console.log("新记录已保存，刷新页面数据");
};

const handleRecordUpdated = () => {
  // 记录更新后刷新数据
  console.log("记录已更新，刷新页面数据");
};

onMounted(() => {
  // 页面加载时初始化数据
  console.log("热量页面已加载");
});
</script>

<style scoped lang="less">
.calorie-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: @spacing-md;

  .page-header {
    margin-bottom: @spacing-lg;
    text-align: center;

    h2 {
      font-size: @font-size-xl;
      font-weight: @font-weight-bold;
      color: @color-text-primary;
      margin-bottom: @spacing-xs;
    }

    .page-subtitle {
      font-size: @font-size-sm;
      color: @color-text-secondary;
      margin: 0;
    }
  }

  .input-section {
    margin-bottom: @spacing-lg;
  }

  .stats-section {
    margin-bottom: @spacing-lg;
  }

  .history-section {
    margin-bottom: @spacing-lg;
  }
}
</style>
