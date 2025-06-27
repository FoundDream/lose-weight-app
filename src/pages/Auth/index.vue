<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from "../../stores/user";
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";

type AuthMode = "login" | "register";

const userStore = useUserStore();
const currentMode = ref<AuthMode>("login");

// 切换模式
const switchMode = (mode: AuthMode) => {
  currentMode.value = mode;
  // 切换时清除错误信息
  userStore.clearAuthError();
};

// 清除错误信息
onMounted(() => {
  userStore.clearAuthError();
});

onUnmounted(() => {
  userStore.clearAuthError();
});
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="app-title">减肥助手</h1>
        <p class="app-subtitle">开启你的健康减肥之旅</p>
      </div>

      <!-- Tab切换 -->
      <div class="auth-tabs-container">
        <div class="auth-tabs">
          <button
            class="tab-btn"
            :class="{ 'tab-btn--active': currentMode === 'login' }"
            @click="switchMode('login')"
          >
            登录
          </button>
          <button
            class="tab-btn"
            :class="{ 'tab-btn--active': currentMode === 'register' }"
            @click="switchMode('register')"
          >
            注册
          </button>
        </div>

        <!-- 表单内容 -->
        <div class="auth-content">
          <Transition name="fade" mode="out-in">
            <LoginForm v-if="currentMode === 'login'" key="login" />
            <RegisterForm v-else key="register" />
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: @font-family-primary;
  background-color: black;
}

.auth-tabs-container {
  background-color: @color-bg-primary;
  border-radius: @border-radius-lg @border-radius-lg 0 0;
  flex: 1;
  padding: 16px;
}

.auth-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.auth-header {
  text-align: center;
  height: 30vh;
}

.auth-tabs {
  display: flex;
  background: @color-bg-tertiary;
  border-radius: 32px;
  padding: @spacing-xs;
  margin-bottom: @spacing-xl;
}

.tab-btn {
  flex: 1;
  padding: @spacing-sm;
  font-size: @font-size-base;
  font-weight: @font-weight-medium;
  color: @color-text-secondary;
  background: transparent;
  border: none;
  border-radius: 32px;
  cursor: pointer;
  transition: all @transition-normal;
  font-family: @font-family-primary;

  &:hover {
    color: @color-text-primary;
  }

  &--active {
    color: @color-text-primary;
    background: @color-bg-primary;
    box-shadow: @shadow-sm;
  }
}

.auth-content {
  position: relative;
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: all @transition-normal;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
