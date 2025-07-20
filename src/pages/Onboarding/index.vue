<template>
  <div class="onboarding-page">
    <!-- 步骤指示器 -->
    <div class="step-indicator">
      <div class="step-indicator-header">
        <var-icon
          name="chevron-left"
          @click="prevStep"
          class="step-indicator-header-back-icon"
        />
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${(step / (stepLabels.length - 1)) * 100}%` }"
          ></div>
        </div>
      </div>
      <div class="step-text">{{ stepLabels[step] }}</div>
    </div>

    <!-- 步骤内容 -->
    <div class="onboarding-step-content">
      <!-- 步骤0：欢迎页 -->
      <template v-if="step === 0">
        <div class="onboarding-page-content">AI 陪你科学减肥</div>
      </template>

      <!-- 步骤1：性别 -->
      <template v-else-if="step === 1">
        <div class="options-container">
          <button
            v-for="option in ['男', '女', '其他']"
            :key="option"
            :class="['option-button', { selected: form.gender === option }]"
            @click="selectGender(option)"
          >
            {{ option }}
          </button>
        </div>
      </template>

      <!-- 步骤2：身体/体重 -->
      <template v-else-if="step === 2">
        <div class="picker-container">
          <var-picker
            :columns="columnsHeight"
            :toolbar="true"
            title="身高"
            v-model="form.height"
          >
            <template #confirm>
              <div />
            </template>
            <template #cancel> <div /></template>
          </var-picker>
          <var-picker
            :columns="columnsWeight"
            :toolbar="true"
            title="体重"
            v-model="form.weight"
          >
            <template #confirm>
              <div />
            </template>
            <template #cancel> <div /> </template>
          </var-picker>
        </div>
      </template>

      <!-- 步骤3：年龄 -->
      <template v-else-if="step === 3">
        <var-picker
          :columns="columnsAge"
          :toolbar="true"
          title="年龄"
          v-model="form.age"
          ><template #confirm>
            <div />
          </template>
          <template #cancel> <div /></template>
        </var-picker>
      </template>

      <!-- 步骤4：减重目标 -->
      <template v-else-if="step === 4">
        <div class="target-weight-container">
          <div class="target-weight-title">减重目标</div>
          <div class="target-weight-value">
            {{ form.targetWeight.toFixed(1) }} <span class="unit">kg</span>
          </div>
          <div
            class="simple-slider-wrapper"
            ref="simpleSliderRef"
            @click="onSimpleSliderClick"
          >
            <!-- 轨道 -->
            <div class="simple-slider-track"></div>
            <!-- 主刻度数字 -->
            <template v-for="(mark, _idx) in mainMarks" :key="_idx">
              <span
                class="simple-slider-mark"
                :style="{ left: mark.left + '%' }"
                >{{ mark.label }}</span
              >
            </template>
            <!-- 手柄 -->
            <div
              class="simple-slider-thumb"
              :style="{ left: thumbLeft + '%' }"
              @mousedown.stop="onSimpleThumbDown"
              @touchstart.stop="onSimpleThumbDown"
            ></div>
          </div>
        </div>
      </template>

      <!-- 步骤5：达成目标日期 -->
      <template v-else-if="step === 5">
        <var-picker
          :columns="columnsDeadline"
          :toolbar="true"
          title="几天后"
          v-model="form.deadline"
          ><template #confirm>
            <div />
          </template>
          <template #cancel> <div /></template>
        </var-picker>
      </template>
    </div>

    <div class="step-actions">
      <var-button
        type="primary"
        @click="nextStep"
        block
        class="step-actions-button"
      >
        {{ stepActions[step] }}
      </var-button>
      <div class="onboarding-page-content-login">
        已有账号点击
        <a
          type="text"
          @click="router.push('/auth')"
          class="onboarding-page-content-login-link"
          >登陆</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useOnboardingStore } from "../../stores";

const onboardingStore = useOnboardingStore();
const router = useRouter();

const step = ref(0);
const stepLabels = [
  "",
  "性别",
  "身体/体重",
  "年龄",
  "减重目标",
  "达成目标日期",
  "完成",
];
const stepActions = [
  "开始",
  "下一步",
  "下一步",
  "下一步",
  "下一步",
  "下一步",
  "完成",
];

const generateColumns = (start: number, end: number, unit: string) => {
  const length = end - start + 1; // Calculate the number of items needed
  const data = Array.from({ length: length }, (_, i) => ({
    text: `${start + i}${unit}`,
    value: start + i,
  }));
  return [data]; // Wrap it in an array to match your desired structure
};
const columnsHeight = ref(generateColumns(60, 240, "cm"));

const columnsWeight = ref(generateColumns(20, 400, "kg"));

const columnsAge = ref(generateColumns(1, 100, "岁"));

const columnsDeadline = ref(generateColumns(1, 365, "天"));

const form = reactive({
  age: [25] as number[],
  gender: "男",
  height: [170] as number[],
  weight: [70] as number[],
  targetWeight: 60 as number,
  deadline: [30] as number[],
});

const simpleSliderRef = ref<HTMLElement | null>(null);
const minWeight = 20;
const maxWeight = computed(() => form.weight[0] || 100);
const stepWeight = 0.5;

// 主刻度点（每5kg）
const mainMarks = computed(() => {
  const arr = [];
  const min = minWeight;
  const max = maxWeight.value;
  for (let v = min; v <= max; v += 5) {
    const percent = ((v - min) / (max - min)) * 100;
    arr.push({ left: percent, label: v });
  }
  if (arr[arr.length - 1].label !== max) {
    arr.push({ left: 100, label: max });
  }
  return arr;
});
// 手柄位置百分比
const thumbLeft = computed(() => {
  const min = minWeight;
  const max = maxWeight.value;
  return ((form.targetWeight - min) / (max - min)) * 100;
});
// 点击轨道
function onSimpleSliderClick(e: MouseEvent) {
  if (!simpleSliderRef.value) return;
  const rect = simpleSliderRef.value.getBoundingClientRect();
  let percent = (e.clientX - rect.left) / rect.width;
  percent = Math.max(0, Math.min(1, percent));
  let value = minWeight + percent * (maxWeight.value - minWeight);
  value = Math.round(value / stepWeight) * stepWeight;
  value = Math.max(minWeight, Math.min(maxWeight.value, value));
  form.targetWeight = value;
}
// 拖动手柄
function onSimpleThumbDown(_e: MouseEvent | TouchEvent) {
  const move = (ev: MouseEvent | TouchEvent) => {
    const clientX = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
    if (!simpleSliderRef.value) return;
    const rect = simpleSliderRef.value.getBoundingClientRect();
    let percent = (clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    let value = minWeight + percent * (maxWeight.value - minWeight);
    value = Math.round(value / stepWeight) * stepWeight;
    value = Math.max(minWeight, Math.min(maxWeight.value, value));
    form.targetWeight = value;
  };
  const up = () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("touchmove", move);
    window.removeEventListener("mouseup", up);
    window.removeEventListener("touchend", up);
  };
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move);
  window.addEventListener("mouseup", up);
  window.addEventListener("touchend", up);
}

function nextStep() {
  if (step.value === 1 && (!form.age || !form.gender)) return;
  if (step.value === 2 && (!form.height || !form.weight)) return;
  if (step.value === 3 && !form.age) return;
  if (step.value === 4 && !form.targetWeight) return;
  if (step.value === 5 && !form.deadline) return;
  if (step.value < stepLabels.length - 1) step.value++;
  if (step.value === stepLabels.length - 1) {
    router.replace("/auth");
    const formData = {
      age: form.age[0],
      gender: form.gender,
      height: form.height[0],
      weight: form.weight[0],
      targetWeight: form.targetWeight,
      deadline: new Date(
        new Date().getTime() + form.deadline[0] * 24 * 60 * 60 * 1000
      ),
    };
    onboardingStore.setFormData(formData);
  }
}

function prevStep() {
  if (step.value > 0) step.value--;
}

function selectGender(gender: string) {
  form.gender = gender;
}
</script>

<style scoped lang="less">
.onboarding-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: @spacing-lg;
  background: @color-bg-primary;
  overflow-x: hidden;

  .step-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;
    width: 100%;

    .step-indicator-header {
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 4px;

      .progress-bar {
        width: 100%;
        height: 16px;
        background: @color-border;
        border-radius: 8px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          background: @color-primary;
          transition: width @transition-normal ease-out;
        }
      }
    }

    .step-text {
      margin-top: 8px;
      font-size: @font-size-base;
      font-weight: 500;
      color: @color-text-primary;
      transition: opacity @transition-fast ease;
    }
  }
}

.onboarding-step-content {
  width: 100%;
  max-width: 360px;
  height: 100%;
  border-radius: @border-radius-lg;
  padding: 32px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  transition: transform @transition-normal ease, opacity @transition-normal ease;
}

.onboarding-page-content {
  font-size: @font-size-xl;
  font-weight: 500;
  color: @color-text-primary;
  font-family: @font-family-primary;
  text-align: center;
  margin-bottom: 32px;
  animation: fadeInUp 0.5s ease-out;
}

.step-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  .step-actions-button {
    border-radius: 100px;
    background: @color-primary;
  }
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 12px; /* 选项之间的间距 */
  width: 100%;
  max-width: 350px; /* 组件最大宽度 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
}

/* 按钮通用样式 */
.option-button {
  width: 100%;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 12px; /* 圆角 */
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease-in-out; /* 平滑过渡效果 */
  background-color: @color-bg-secondary; /* 默认背景色 */
  color: #000000; /* 默认文字颜色 */
}

/* 选中状态的样式 */
.option-button.selected {
  background-color: @color-primary; /* 选中时背景色 */
  color: #ffffff; /* 选中时文字颜色 */
  border-color: @color-primary; /* 选中时边框颜色 */
}

.picker-container {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

:deep(.var-picker__title) {
  color: #000;
  font-weight: 500;
}

:deep(.var-picker__picked) {
  border: none;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.04);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.target-weight-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  padding: 24px 0 0 0;
}
.target-weight-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #222;
}
.target-weight-value {
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #111;
  .unit {
    font-size: 20px;
    font-weight: 400;
    margin-left: 4px;
    color: #888;
  }
}
.simple-slider-wrapper {
  position: relative;
  width: 100%;
  height: 64px;
  margin-top: 16px;
  user-select: none;
  touch-action: none;
}
.simple-slider-track {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 4px;
  background: #bbb;
  border-radius: 2px;
  transform: translateY(-50%);
  z-index: 1;
}
.simple-slider-mark {
  position: absolute;
  top: 0;
  font-size: 14px;
  color: #222;
  font-weight: 500;
  transform: translateX(-50%);
  z-index: 2;
}
.simple-slider-thumb {
  position: absolute;
  top: 50%;
  width: 4px;
  height: 32px;
  background: #111;
  border-radius: 2px;
  transform: translate(-50%, -50%);
  z-index: 3;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.onboarding-page-content-login {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 16px;
}
.onboarding-page-content-login-link {
  color: @color-primary;
}
</style>
