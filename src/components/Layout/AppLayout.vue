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
  background: linear-gradient(135deg, #6366f1 0%, #764ba2 100%);
  font-family: "Space Grotesk", system-ui, sans-serif;

  .app-content {
    padding-bottom: 60px; // 为底部导航留出空间
  }
}
</style>
