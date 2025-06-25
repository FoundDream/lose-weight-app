import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/Home/index.vue"),
    meta: {
      title: "首页",
      icon: "🏠",
    },
  },
  {
    path: "/weight-management",
    name: "WeightManagement",
    component: () => import("../pages/WeightManagement/index.vue"),
    meta: {
      title: "体重管理",
      icon: "📊",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 减肥助手`;
  }
  next();
});

export default router;
