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
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../pages/Profile/index.vue"),
    meta: {
      title: "个人信息",
      icon: "👤",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 减肥助手`;
  }
  next();
});

export default router;
