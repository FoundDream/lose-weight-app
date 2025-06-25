<template>
  <div class="user-info-card">
    <div class="card-header">
      <h3>基本信息</h3>
      <button @click="toggleEdit" class="edit-btn">
        {{ isEditing ? "保存" : "编辑" }}
      </button>
    </div>

    <div class="form-content">
      <div class="form-row">
        <div class="form-group">
          <label>姓名</label>
          <input
            v-model="formData.name"
            :disabled="!isEditing"
            placeholder="请输入姓名"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>年龄</label>
          <input
            v-model.number="formData.age"
            type="number"
            :disabled="!isEditing"
            placeholder="年龄"
            class="form-input"
            min="1"
            max="120"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>性别</label>
          <select
            v-model="formData.gender"
            :disabled="!isEditing"
            class="form-select"
          >
            <option value="female">女</option>
            <option value="male">男</option>
          </select>
        </div>
        <div class="form-group">
          <label>身高 (cm)</label>
          <input
            v-model.number="formData.height"
            type="number"
            :disabled="!isEditing"
            placeholder="身高"
            class="form-input"
            min="100"
            max="250"
          />
        </div>
      </div>

      <div class="form-group full-width">
        <label>活动水平</label>
        <select
          v-model="formData.activityLevel"
          :disabled="!isEditing"
          class="form-select"
        >
          <option value="sedentary">久坐 (办公室工作，很少运动)</option>
          <option value="lightly_active">轻度活动 (每周1-3次轻度运动)</option>
          <option value="moderately_active">
            中度活动 (每周3-5次中等强度运动)
          </option>
          <option value="very_active">高强度活动 (每周6-7次高强度运动)</option>
        </select>
      </div>

      <!-- 完善度提示 -->
      <div v-if="!hasCompleteProfile && !isEditing" class="completion-notice">
        <span class="notice-icon">⚠️</span>
        <span class="notice-text">请完善个人信息以获取专属减肥方案</span>
      </div>

      <!-- 分析按钮 -->
      <div v-if="hasCompleteProfile && !isEditing" class="analysis-section">
        <button
          @click="triggerAnalysis"
          :disabled="isAnalyzing"
          class="analysis-btn"
        >
          <span v-if="!isAnalyzing">🤖 生成AI减肥方案</span>
          <span v-else>分析中...</span>
        </button>
        <p class="analysis-note">基于您的信息，AI将为您定制专属减肥计划</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useUserStore } from "../../../stores/user";
import { useWeightStore } from "../../../stores/weight";
import { Gender, ActivityLevel } from "../../../types/user";

const userStore = useUserStore();
const weightStore = useWeightStore();

const isEditing = ref(!userStore.hasCompleteProfile);

const formData = ref({
  name: userStore.profile?.name || "",
  age: userStore.profile?.age || 0,
  gender: userStore.profile?.gender || Gender.FEMALE,
  height: userStore.profile?.height || 0,
  activityLevel:
    userStore.profile?.activityLevel || ActivityLevel.LIGHTLY_ACTIVE,
});

const hasCompleteProfile = computed(() => userStore.hasCompleteProfile);
const isAnalyzing = computed(() => userStore.isAnalyzing);

// 监听store中的profile变化
watch(
  () => userStore.profile,
  (newProfile) => {
    if (newProfile) {
      formData.value = {
        name: newProfile.name,
        age: newProfile.age,
        gender: newProfile.gender,
        height: newProfile.height,
        activityLevel: newProfile.activityLevel,
      };
    }
  },
  { immediate: true }
);

const toggleEdit = () => {
  if (isEditing.value) {
    // 保存数据
    if (validateForm()) {
      userStore.updateProfile(formData.value);
      isEditing.value = false;
    }
  } else {
    isEditing.value = true;
  }
};

const validateForm = () => {
  if (!formData.value.name.trim()) {
    alert("请输入姓名");
    return false;
  }
  if (formData.value.age <= 0 || formData.value.age > 120) {
    alert("请输入有效的年龄 (1-120)");
    return false;
  }
  if (formData.value.height <= 0 || formData.value.height > 250) {
    alert("请输入有效的身高 (100-250cm)");
    return false;
  }
  return true;
};

const triggerAnalysis = async () => {
  const currentWeight = weightStore.currentWeight;
  const targetWeight = weightStore.targetWeight;

  if (currentWeight <= 0 || targetWeight <= 0) {
    alert("请先在首页设置当前体重和目标体重");
    return;
  }

  // 获取体重历史数据
  const weightHistory = weightStore.entries.slice(0, 10).map((entry) => ({
    weight: entry.weight,
    date: entry.date,
  }));

  await userStore.analyzeWeightLoss(currentWeight, targetWeight, weightHistory);
};
</script>

<style scoped lang="less">
@primary-color: #6366f1;
@bg-primary: #ffffff;
@bg-secondary: #f8fafc;
@text-primary: #1e293b;
@text-secondary: #64748b;
@text-light: #94a3b8;
@border-color: #e2e8f0;
@success-color: #10b981;
@warning-color: #f59e0b;
@shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
@border-radius: 16px;

.user-info-card {
  background: @bg-primary;
  border-radius: @border-radius;
  padding: 20px;
  box-shadow: @shadow-md;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: @text-primary;
      margin: 0;
    }

    .edit-btn {
      background: @primary-color;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 6px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #5b21b6;
      }
    }
  }

  .form-content {
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;

      @media (max-width: 480px) {
        flex-direction: column;
        gap: 12px;
      }
    }

    .form-group {
      flex: 1;

      &.full-width {
        margin-bottom: 16px;
      }

      label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: @text-secondary;
        margin-bottom: 6px;
      }

      .form-input,
      .form-select {
        width: 100%;
        padding: 12px;
        border: 2px solid @border-color;
        border-radius: 8px;
        font-size: 16px;
        background: @bg-secondary;
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: @primary-color;
          background: @bg-primary;
        }

        &:disabled {
          background: #f1f5f9;
          cursor: not-allowed;
          color: @text-light;
        }
      }

      .form-select {
        cursor: pointer;

        &:disabled {
          cursor: not-allowed;
        }
      }
    }

    .completion-notice {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      margin-bottom: 16px;

      .notice-icon {
        font-size: 16px;
      }

      .notice-text {
        font-size: 14px;
        color: #92400e;
      }
    }

    .analysis-section {
      text-align: center;
      margin-top: 20px;

      .analysis-btn {
        background: linear-gradient(135deg, @success-color 0%, #059669 100%);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 8px;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }

        &:disabled {
          background: @text-light;
          cursor: not-allowed;
          transform: none;
        }
      }

      .analysis-note {
        font-size: 12px;
        color: @text-secondary;
        margin: 0;
      }
    }
  }
}
</style>
