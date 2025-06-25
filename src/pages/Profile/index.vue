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
  padding: 24px 20px 16px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;

  .header-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .header-subtitle {
    font-size: 14px;
    opacity: 0.9;
  }
}

.main-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 100px; // 为底部导航留出空间
}
</style>
