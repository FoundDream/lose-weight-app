<template>
  <div class="calorie-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>热量管理</h2>
      <p class="page-subtitle">智能记录，科学管理你的每日热量摄入</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

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
}
</style>
