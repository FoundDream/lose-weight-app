<script setup lang="ts">
import BottomNavigation from "./BottomNavigation.vue";
</script>

<template>
  <div class="app-layout">
    <div class="app-content">
      <router-view />
    </div>
    <BottomNavigation />
  </div>
</template>

<style scoped lang="less">
.app-layout {
  min-height: 100vh;
  max-width: 100vw;
  background: @color-bg-secondary;
  font-family: @font-family-primary;

  .app-content {
    padding-bottom: 60px; // 为底部导航留出空间
  }
}
</style>
