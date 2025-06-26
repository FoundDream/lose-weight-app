<template>
  <div class="profile-page">
    <!-- 用户头像和基本信息 -->
    <div class="profile-header">
      <div class="avatar-section">
        <div class="avatar">
          <img src="https://picsum.photos/200/300" alt="用户头像" />
        </div>
        <div class="user-basic">
          <h2 class="username">{{ userInfo.name || "未设置姓名" }}</h2>
          <p class="user-subtitle">{{ getUserSubtitle() }}</p>
        </div>
      </div>
      <button @click="toggleEdit" class="edit-btn">
        {{ isEditing ? "保存" : "编辑" }}
      </button>
    </div>

    <!-- 个人信息卡片 -->
    <div class="info-cards">
      <div class="info-card">
        <div class="card-icon">📊</div>
        <div class="card-content">
          <h3>基本信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">年龄</span>
              <span class="value">{{ userInfo.age || "--" }}岁</span>
            </div>
            <div class="info-item">
              <span class="label">身高</span>
              <span class="value">{{ userInfo.height || "--" }}cm</span>
            </div>
            <div class="info-item">
              <span class="label">性别</span>
              <span class="value">{{ getGenderText() }}</span>
            </div>
            <div class="info-item">
              <span class="label">活动水平</span>
              <span class="value">{{ getActivityText() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- BMI和健康指标 -->
      <div class="info-card">
        <div class="card-icon">💪</div>
        <div class="card-content">
          <h3>健康指标</h3>
          <div class="health-metrics">
            <div class="metric-item">
              <span class="metric-label">BMI指数</span>
              <span class="metric-value" :class="getBMIClass()">{{
                getBMI()
              }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">理想体重</span>
              <span class="metric-value">{{ getIdealWeight() }}kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI交互区域 -->
    <div class="ai-section">
      <div class="ai-header">
        <div class="ai-icon">🤖</div>
        <h3>AI健康顾问</h3>
      </div>

      <div class="ai-actions">
        <button
          @click="generateWeightPlan"
          :disabled="isAnalyzing || !hasCompleteProfile"
          class="ai-btn primary"
        >
          <span v-if="!isAnalyzing">📋 生成减重计划</span>
          <span v-else>分析中...</span>
        </button>

        <button
          @click="askAI"
          :disabled="isAnalyzing || !hasCompleteProfile"
          class="ai-btn secondary"
        >
          💬 咨询AI
        </button>

        <button
          @click="getHealthAdvice"
          :disabled="isAnalyzing || !hasCompleteProfile"
          class="ai-btn secondary"
        >
          💡 健康建议
        </button>
      </div>

      <div v-if="!hasCompleteProfile" class="incomplete-notice">
        <span class="notice-icon">⚠️</span>
        <span>请完善个人信息以使用AI功能</span>
      </div>

      <div v-if="aiResponse" class="ai-response">
        <h4>AI回复：</h4>
        <p>{{ aiResponse }}</p>
      </div>
    </div>

    <!-- 编辑模态框 -->
    <div v-if="isEditing" class="edit-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>编辑个人信息</h3>
          <button @click="cancelEdit" class="close-btn">×</button>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>姓名</label>
            <input v-model="formData.name" placeholder="请输入姓名" />
          </div>

          <div class="form-group">
            <label>年龄</label>
            <input
              v-model.number="formData.age"
              type="number"
              placeholder="年龄"
            />
          </div>

          <div class="form-group">
            <label>身高 (cm)</label>
            <input
              v-model.number="formData.height"
              type="number"
              placeholder="身高"
            />
          </div>

          <div class="form-group">
            <label>性别</label>
            <select v-model="formData.gender">
              <option value="female">女</option>
              <option value="male">男</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label>活动水平</label>
            <select v-model="formData.activityLevel">
              <option value="sedentary">久坐 (办公室工作，很少运动)</option>
              <option value="lightly_active">
                轻度活动 (每周1-3次轻度运动)
              </option>
              <option value="moderately_active">
                中度活动 (每周3-5次中等强度运动)
              </option>
              <option value="very_active">
                高强度活动 (每周6-7次高强度运动)
              </option>
            </select>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="cancelEdit" class="btn-cancel">取消</button>
          <button @click="saveProfile" class="btn-save">保存</button>
        </div>
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

const isEditing = ref(false);
const aiResponse = ref("");

const userInfo = computed(
  () =>
    userStore.profile || {
      name: "",
      age: 0,
      gender: Gender.FEMALE,
      height: 0,
      activityLevel: ActivityLevel.LIGHTLY_ACTIVE,
    }
);

const formData = ref({
  name: userInfo.value.name,
  age: userInfo.value.age,
  gender: userInfo.value.gender,
  height: userInfo.value.height,
  activityLevel: userInfo.value.activityLevel,
});

const hasCompleteProfile = computed(() => userStore.hasCompleteProfile);
const isAnalyzing = computed(() => userStore.isAnalyzing);

// 获取用户副标题
const getUserSubtitle = () => {
  if (!hasCompleteProfile.value) return "完善信息，开启健康之旅";
  const currentWeight = weightStore.currentWeight;
  const targetWeight = weightStore.targetWeight;
  const difference = currentWeight - targetWeight;
  if (difference > 0) {
    return `目标减重 ${difference.toFixed(1)}kg`;
  }
  return "已达成目标体重 🎉";
};

// 获取性别文本
const getGenderText = () => {
  return userInfo.value.gender === "male" ? "男" : "女";
};

// 获取活动水平文本
const getActivityText = () => {
  const activityMap = {
    sedentary: "久坐",
    lightly_active: "轻度活动",
    moderately_active: "中度活动",
    very_active: "高强度活动",
  };
  return activityMap[userInfo.value.activityLevel] || "--";
};

// 计算BMI
const getBMI = () => {
  if (!userInfo.value.height || !weightStore.currentWeight) return "--";
  const heightInM = userInfo.value.height / 100;
  const bmi = weightStore.currentWeight / (heightInM * heightInM);
  return bmi.toFixed(1);
};

// 获取BMI样式类
const getBMIClass = () => {
  const bmi = parseFloat(getBMI());
  if (isNaN(bmi)) return "";
  if (bmi < 18.5) return "underweight";
  if (bmi < 24) return "normal";
  if (bmi < 28) return "overweight";
  return "obese";
};

// 计算理想体重
const getIdealWeight = () => {
  if (!userInfo.value.height) return "--";
  const heightInM = userInfo.value.height / 100;
  const idealBMI = 22; // 理想BMI值
  const idealWeight = idealBMI * heightInM * heightInM;
  return idealWeight.toFixed(1);
};

// 编辑相关方法
const toggleEdit = () => {
  if (isEditing.value) {
    saveProfile();
  } else {
    formData.value = { ...userInfo.value };
    isEditing.value = true;
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  formData.value = { ...userInfo.value };
};

const saveProfile = () => {
  if (validateForm()) {
    userStore.updateProfile(formData.value);
    isEditing.value = false;
  }
};

const validateForm = () => {
  if (!formData.value.name.trim()) {
    alert("请输入姓名");
    return false;
  }
  if (formData.value.age <= 0 || formData.value.age > 120) {
    alert("请输入有效的年龄");
    return false;
  }
  if (formData.value.height <= 0 || formData.value.height > 250) {
    alert("请输入有效的身高");
    return false;
  }
  return true;
};

// AI交互方法
const generateWeightPlan = async () => {
  aiResponse.value = "";
  const currentWeight = weightStore.currentWeight;
  const targetWeight = weightStore.targetWeight;

  await userStore.analyzeWeightLoss(currentWeight, targetWeight, []);
  aiResponse.value =
    "基于您的个人信息，AI已为您生成专属减重计划。建议每周减重0.5-1kg，通过合理饮食控制和适量运动达成目标。";
};

const askAI = () => {
  aiResponse.value =
    "您好！我是您的AI健康顾问。您可以随时向我咨询关于减重、饮食、运动等方面的问题。我会根据您的个人信息为您提供专业建议。";
};

const getHealthAdvice = () => {
  const bmi = parseFloat(getBMI());
  let advice = "";

  if (bmi < 18.5) {
    advice =
      "您的BMI偏低，建议适当增重。多摄入优质蛋白质和健康脂肪，配合力量训练。";
  } else if (bmi < 24) {
    advice = "您的BMI正常，继续保持健康的生活方式。均衡饮食，定期运动。";
  } else if (bmi < 28) {
    advice = "您的BMI偏高，建议控制饮食，增加有氧运动，每周减重0.5-1kg。";
  } else {
    advice = "您的BMI过高，建议寻求专业医生指导，制定科学的减重计划。";
  }

  aiResponse.value = advice;
};

// 监听用户信息变化
watch(
  () => userStore.profile,
  (newProfile) => {
    if (newProfile) {
      formData.value = { ...newProfile };
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="less">
.profile-page {
  padding: @spacing-lg;
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: @spacing-xl;
  padding: @spacing-lg;
  background: @color-bg-primary;
  border-radius: @border-radius-lg;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .avatar-section {
    display: flex;
    align-items: center;
    gap: @spacing-md;

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid @color-primary;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-basic {
      .username {
        font-size: @font-size-2xl;
        font-weight: @font-weight-bold;
        color: @color-text-primary;
        margin: 0 0 @spacing-xs 0;
      }

      .user-subtitle {
        font-size: @font-size-sm;
        color: @color-text-secondary;
        margin: 0;
      }
    }
  }

  .edit-btn {
    background: @color-primary;
    color: white;
    border: none;
    border-radius: @border-radius-md;
    padding: @spacing-sm @spacing-md;
    font-weight: @font-weight-medium;
    cursor: pointer;
    transition: all @transition-normal;

    &:hover {
      background: @color-primary-dark;
      transform: translateY(-1px);
    }
  }
}

.info-cards {
  display: grid;
  gap: @spacing-lg;
  margin-bottom: @spacing-xl;

  .info-card {
    background: @color-bg-primary;
    border-radius: @border-radius-lg;
    padding: @spacing-lg;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: flex-start;
    gap: @spacing-md;

    .card-icon {
      font-size: 2rem;
      line-height: 1;
    }

    .card-content {
      flex: 1;

      h3 {
        font-size: @font-size-lg;
        font-weight: @font-weight-semibold;
        color: @color-text-primary;
        margin: 0 0 @spacing-md 0;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: @spacing-md;

        .info-item {
          .label {
            display: block;
            font-size: @font-size-xs;
            color: @color-text-secondary;
            margin-bottom: @spacing-xs;
          }

          .value {
            font-size: @font-size-base;
            font-weight: @font-weight-medium;
            color: @color-text-primary;
          }
        }
      }

      .health-metrics {
        display: flex;
        gap: @spacing-xl;

        .metric-item {
          .metric-label {
            display: block;
            font-size: @font-size-xs;
            color: @color-text-secondary;
            margin-bottom: @spacing-xs;
          }

          .metric-value {
            font-size: @font-size-xl;
            font-weight: @font-weight-bold;

            &.normal {
              color: @color-success;
            }
            &.underweight {
              color: @color-info;
            }
            &.overweight {
              color: @color-warning;
            }
            &.obese {
              color: @color-danger;
            }
          }
        }
      }
    }
  }
}

.ai-section {
  background: linear-gradient(
    135deg,
    @color-primary-light 0%,
    rgba(54, 193, 195, 0.1) 100%
  );
  border-radius: @border-radius-lg;
  padding: @spacing-lg;
  margin-bottom: @spacing-xl;

  .ai-header {
    display: flex;
    align-items: center;
    gap: @spacing-sm;
    margin-bottom: @spacing-lg;

    .ai-icon {
      font-size: 1.5rem;
    }

    h3 {
      font-size: @font-size-lg;
      font-weight: @font-weight-semibold;
      color: @color-text-primary;
      margin: 0;
    }
  }

  .ai-actions {
    display: flex;
    gap: @spacing-md;
    margin-bottom: @spacing-md;
    flex-wrap: wrap;

    .ai-btn {
      border: none;
      border-radius: @border-radius-md;
      padding: @spacing-sm @spacing-md;
      font-weight: @font-weight-medium;
      cursor: pointer;
      transition: all @transition-normal;
      min-width: 120px;

      &.primary {
        background: @color-primary;
        color: white;

        &:hover:not(:disabled) {
          background: @color-primary-dark;
          transform: translateY(-1px);
        }
      }

      &.secondary {
        background: white;
        color: @color-primary;
        border: 2px solid @color-primary;

        &:hover:not(:disabled) {
          background: @color-primary;
          color: white;
        }
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
    }
  }

  .incomplete-notice {
    display: flex;
    align-items: center;
    gap: @spacing-sm;
    padding: @spacing-md;
    background: rgba(251, 191, 36, 0.1);
    border: 1px solid #fbbf24;
    border-radius: @border-radius-md;
    color: #92400e;
    font-size: @font-size-sm;
  }

  .ai-response {
    margin-top: @spacing-md;
    padding: @spacing-md;
    background: white;
    border-radius: @border-radius-md;
    border-left: 4px solid @color-primary;

    h4 {
      font-size: @font-size-sm;
      color: @color-primary;
      margin: 0 0 @spacing-sm 0;
    }

    p {
      font-size: @font-size-sm;
      color: @color-text-primary;
      line-height: @line-height-normal;
      margin: 0;
    }
  }
}

.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: @z-index-modal;
  padding: @spacing-md;

  .modal-content {
    background: white;
    border-radius: @border-radius-lg;
    padding: @spacing-lg;
    max-width: 500px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: @spacing-lg;

      h3 {
        margin: 0;
        font-size: @font-size-lg;
        color: @color-text-primary;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: @color-text-tertiary;
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: @spacing-md;

      .form-group {
        &.full-width {
          grid-column: 1 / -1;
        }

        label {
          display: block;
          font-size: @font-size-sm;
          font-weight: @font-weight-medium;
          color: @color-text-secondary;
          margin-bottom: @spacing-xs;
        }

        input,
        select {
          width: 100%;
          padding: @spacing-sm;
          border: 2px solid @color-border;
          border-radius: @border-radius-sm;
          font-size: @font-size-base;

          &:focus {
            outline: none;
            border-color: @color-primary;
          }
        }
      }
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: @spacing-md;
      margin-top: @spacing-lg;

      button {
        padding: @spacing-sm @spacing-md;
        border: none;
        border-radius: @border-radius-sm;
        font-weight: @font-weight-medium;
        cursor: pointer;
        transition: all @transition-normal;

        &.btn-cancel {
          background: @color-bg-tertiary;
          color: @color-text-secondary;
        }

        &.btn-save {
          background: @color-primary;
          color: white;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: @spacing-md;
  }

  .profile-header {
    flex-direction: column;
    gap: @spacing-md;
    text-align: center;
  }

  .ai-actions {
    flex-direction: column;

    .ai-btn {
      width: 100%;
    }
  }
}
</style>
