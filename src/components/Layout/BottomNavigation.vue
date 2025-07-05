<template>
  <div class="bottom-navigation">
    <div
      v-for="item in navItems"
      :key="item.name"
      class="nav-item"
      :class="{ active: currentPath === item.path }"
      @click="handleNavClick(item.path)"
    >
      <Icon
        :icon="currentPath === item.path ? item.iconActive : item.icon"
        width="28"
        height="28"
      />
      <!-- <div class="nav-label">{{ item.label }}</div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

const route = useRoute();
const router = useRouter();

// 导航相关类型
export interface NavItem {
  name: string;
  path: string;
  icon: string;
  iconActive: string;
  label: string;
}

const navItems: NavItem[] = [
  {
    name: "首页",
    path: "/",
    label: "首页",
    icon: "material-symbols-light:home-outline",
    iconActive: "material-symbols-light:home",
  },
  {
    name: "目标",
    path: "/target",
    label: "目标",
    icon: "ph:target-light",
    iconActive: "ph:target-fill",
  },
  {
    name: "断食",
    path: "/fasting",
    label: "断食",
    icon: "mingcute:time-line",
    iconActive: "mingcute:time-fill",
  },
  {
    name: "我的",
    path: "/profile",
    label: "我的",
    icon: "weui:me-outlined",
    iconActive: "weui:me-filled",
  },
];

const currentPath = computed(() => route.path);

const handleNavClick = (path: string) => {
  router.push(path);
};
</script>

<style scoped lang="less">
.bottom-navigation {
  border-top: 2px solid @color-border-light;
  display: flex;
  align-items: center;
  height: 60px;
  justify-content: space-around;
  background: @color-bg-primary;

  .nav-item {
    position: relative;
    cursor: pointer;
    padding: @spacing-sm 0;
    transition: all @transition-normal;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;

    .nav-label {
      font-size: @font-size-sm;
      font-weight: 400;
      color: @color-text-secondary;
      transition: all @transition-normal;
      white-space: nowrap;
    }

    &.active {
      .nav-label {
        color: @color-text-primary;
        font-weight: 400;
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
