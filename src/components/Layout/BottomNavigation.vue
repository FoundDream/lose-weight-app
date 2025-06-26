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
    label: "首页",
  },
  {
    name: "WeightManagement",
    path: "/weight-management",
    label: "体重",
  },
  {
    name: "Profile",
    path: "/profile",
    label: "我的",
  },
];

const currentPath = computed(() => route.path);

const handleNavClick = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="top-navigation">
    <div
      v-for="item in navItems"
      :key="item.name"
      class="nav-item"
      :class="{ active: currentPath === item.path }"
      @click="handleNavClick(item.path)"
    >
      <div class="nav-label">{{ item.label }}</div>
      <div v-if="currentPath === item.path" class="nav-indicator"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.top-navigation {
  display: flex;
  align-items: center;
  padding: 0 @spacing-md;
  border-bottom: 1px solid @color-border-light;
  gap: @spacing-md;
  margin-bottom: @spacing-sm;
  height: 40px;

  .nav-item {
    position: relative;
    cursor: pointer;
    padding: @spacing-sm 0;
    transition: all @transition-normal;

    .nav-label {
      font-size: @font-size-base;
      font-weight: @font-weight-semibold;
      color: @color-text-tertiary;
      transition: all @transition-normal;
      white-space: nowrap;
    }

    .nav-indicator {
      position: absolute;
      left: 0;
      right: 0;
      height: 3px;
      background: @color-primary;
      border-radius: 2px;
      animation: slideIn 0.3s ease-out;
    }

    &.active {
      .nav-label {
        color: @color-text-primary;
        font-weight: @font-weight-semibold;
        font-size: @font-size-lg;
      }
    }

    &:hover:not(.active) {
      .nav-label {
        color: @color-text-secondary;
      }
    }
  }
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
</style>
