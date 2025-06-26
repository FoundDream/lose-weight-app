<template>
  <div class="profile-page">
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
</style>
