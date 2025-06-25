<template>
  <div class="profile-page">
    <!-- 头部 -->
    <div class="page-header">
      <div class="header-title">个人信息</div>
      <div class="header-subtitle">完善信息，获取专属减肥方案</div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <!-- 用户信息卡片 -->
      <UserInfoCard />

      <!-- 健康指标卡片 -->
      <HealthMetrics v-if="hasCompleteProfile" />

      <!-- AI减肥规划卡片 -->
      <WeightLossPlan v-if="hasCompleteProfile" />

      <!-- 运动建议卡片 -->
      <ExerciseSuggestions
        v-if="hasCompleteProfile && exerciseSuggestions.length > 0"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "../../stores/user";
import UserInfoCard from "./components/UserInfoCard.vue";
import HealthMetrics from "./components/HealthMetrics.vue";
import WeightLossPlan from "./components/WeightLossPlan.vue";
import ExerciseSuggestions from "./components/ExerciseSuggestions.vue";

const userStore = useUserStore();

const hasCompleteProfile = computed(() => userStore.hasCompleteProfile);
const exerciseSuggestions = computed(() => userStore.exerciseSuggestions);
</script>

<style scoped lang="less">
.profile-page {
  min-height: 100vh;
}

.page-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: @spacing-lg @spacing-lg @spacing-md;
  background: @gradient-primary;
  color: @color-text-inverse;

  .header-title {
    .heading-3();
    color: @color-text-inverse;
    margin-bottom: @spacing-xs;
  }

  .header-subtitle {
    .body-small();
    color: @color-text-inverse;
    opacity: 0.9;
  }
}

.main-content {
  padding: @spacing-lg;
  display: flex;
  flex-direction: column;
  gap: @spacing-lg;
  padding-bottom: 100px; // 为底部导航留出空间
}
</style>
