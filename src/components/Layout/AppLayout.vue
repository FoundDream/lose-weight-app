<script setup lang="ts">
import BottomNavigation from "./BottomNavigation.vue";
</script>

<template>
  <div class="app-layout">
    <BottomNavigation />
    <div class="app-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="less">
.app-layout {
  min-height: 100vh;
  max-width: 100vw;
  background: @color-bg-secondary;
  font-family: @font-family-primary;

  .app-content {
    padding-bottom: 60px; // 调整为适合底部导航的高度
  }
}
</style>
