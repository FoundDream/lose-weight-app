<template>
  <div class="app-layout">
    <template v-if="route.name !== 'Auth'">
      <BottomNavigation />
    </template>
    <div class="app-content">
      <router-view />
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
  background: @color-bg-secondary;
  font-family: @font-family-primary;
}
</style>
