<template>
  <div class="app-layout">
    <div class="app-content">
      <router-view />
    </div>
    <div
      class="app-content-bottom"
      v-if="route.name !== 'Auth' && route.name !== 'Onboarding'"
    >
      <BottomNavigation />
    </div>
  </div>
</template>

<script setup lang="ts">
import BottomNavigation from "./BottomNavigation.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<style scoped lang="less">
.app-layout {
  height: 100vh;
  max-width: 100vw;
  background: @color-bg-primary;

  .app-content-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
}
</style>
