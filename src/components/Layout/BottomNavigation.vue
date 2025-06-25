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
    label: "体重管理",
  },
  {
    name: "Profile",
    path: "/profile",
    label: "个人信息",
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
  background: @color-bg-primary;
  border-top: @border-width solid @color-border;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: @shadow-none;
  z-index: @z-index-fixed;

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: @spacing-sm @spacing-md;
    cursor: pointer;
    transition: all @transition-normal;
    border-radius: @border-radius-md;
    min-width: 60px;

    &:hover {
      background: fade(@color-primary, 10%);
    }

    &.active {
      background: fade(@color-primary, 10%);

      .nav-label {
        color: @color-primary;
        font-weight: @font-weight-semibold;
      }
    }

    .nav-label {
      font-size: @font-size-xs;
      color: @color-text-secondary;
      transition: all @transition-normal;
    }
  }
}
</style>
