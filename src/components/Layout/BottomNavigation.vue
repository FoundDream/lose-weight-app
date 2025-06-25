<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { NavItem } from "../../types/weight";

const route = useRoute();
const router = useRouter();

const navItems: NavItem[] = [
  {
    name: "Home",
    path: "/",
    // icon: "🏠",
    label: "首页",
  },
  {
    name: "WeightManagement",
    path: "/weight-management",
    // icon: "📊",
    label: "体重管理",
  },
];

const currentPath = computed(() => route.path);

const handleNavClick = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="bottom-navigation">
    <div
      v-for="item in navItems"
      :key="item.name"
      class="nav-item"
      :class="{ active: currentPath === item.path }"
      @click="handleNavClick(item.path)"
    >
      <div class="nav-icon">{{ item.icon }}</div>
      <div class="nav-label">{{ item.label }}</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 12px;
    min-width: 60px;

    &:hover {
      background: rgba(99, 102, 241, 0.1);
    }

    &.active {
      background: rgba(99, 102, 241, 0.1);

      .nav-icon {
        transform: scale(1.1);
      }

      .nav-label {
        color: #6366f1;
        font-weight: 600;
      }
    }

    .nav-icon {
      font-size: 24px;
      margin-bottom: 4px;
      transition: transform 0.2s ease;
    }

    .nav-label {
      font-size: 12px;
      color: #64748b;
      transition: all 0.2s ease;
    }
  }
}
</style>
