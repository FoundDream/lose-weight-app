import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/onboarding",
    name: "Onboarding",
    component: () => import("../pages/Onboarding/index.vue"),
    meta: {
      title: "用户引导",
      requiresAuth: false, // 不需要登录
    },
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import("../pages/Auth/index.vue"),
    meta: {
      title: "登录注册",
      requiresGuest: true, // 仅游客可访问
    },
  },
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/Home/index.vue"),
    meta: {
      title: "首页",
      requiresAuth: true, // 需要登录
    },
  },
  {
    path: "/ai-diet-suggestion",
    name: "AIDietSuggestion",
    component: () => import("../pages/AIDietSuggestion/index.vue"),
    meta: {
      title: "AI 饮食建议",
      requiresAuth: true, // 需要登录
    },
  },
  {
    path: "/target",
    name: "Target",
    component: () => import("../pages/Target/index.vue"),
    meta: {
      title: "目标",
      requiresAuth: true, // 需要登录
    },
  },
  {
    path: "/fasting",
    name: "Fasting",
    component: () => import("../pages/Fasting/index.vue"),
    meta: {
      title: "16+8断食",
      requiresAuth: true, // 需要登录
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../pages/Profile/index.vue"),
    meta: {
      title: "个人信息",
      requiresAuth: true, // 需要登录
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 当用户使用浏览器的前进/后退按钮时，页面会回到之前离开时的滚动位置，提供原生浏览器的导航体验。
  // 当用户通过应用程序内部的链接跳转到新页面时，页面会自动滚动到顶部，确保用户从新页面的开头开始浏览。
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// // 路由守卫
// router.beforeEach((to, _from, next) => {
//   const userStore = useUserStore();

//   // 设置页面标题
//   if (to.meta?.title) {
//     document.title = `${to.meta.title} - 减肥助手`;
//   }

//   // 检查认证状态
//   const requiresAuth = to.meta?.requiresAuth;
//   const requiresGuest = to.meta?.requiresGuest;
//   const isAuthenticated = userStore.isAuthenticated; // 从store中获取认证状态，判断是否需要登录

//   if (requiresAuth && !isAuthenticated) {
//     // 需要登录但未登录，重定向到登录页
//     next({ name: "Auth", query: { redirect: to.fullPath } });
//   } else if (requiresGuest && isAuthenticated) {
//     // 已登录用户访问游客页面，重定向到首页
//     next({ name: "Home" });
//   } else {
//     next();
//   }
// });

export default router;
