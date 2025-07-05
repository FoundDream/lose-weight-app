<template>
  <div class="calorie-page"></div>
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
