<template>
  <div class="loading-analysis">
    <div class="loading-content">
      <!-- 加载动画 -->
      <div class="loading-animation">
        <div class="ai-icon">🤖</div>
        <div class="loading-dots">
          <span class="dot dot-1"></span>
          <span class="dot dot-2"></span>
          <span class="dot dot-3"></span>
        </div>
      </div>

      <!-- 加载文本 -->
      <div class="loading-text">
        <h3>{{ currentText }}</h3>
        <p>{{ currentSubtext }}</p>
      </div>

      <!-- 进度条 -->
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>

      <!-- 用户输入回显 -->
      <div class="input-echo" v-if="userInput">
        <span class="echo-label">正在分析：</span>
        <span class="echo-text">{{ userInput }}</span>
      </div>

      <!-- 取消按钮 -->
      <button @click="$emit('cancel')" class="cancel-btn">取消分析</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// Props
interface Props {
  userInput?: string;
}

withDefaults(defineProps<Props>(), {
  userInput: "",
});

// Emits
defineEmits<{
  cancel: [];
}>();

// State
const progress = ref(0);
const currentTextIndex = ref(0);

// 加载文本序列
const loadingTexts = [
  {
    text: "AI正在分析食物...",
    subtext: "识别食物类型和份量",
  },
  {
    text: "计算营养成分...",
    subtext: "分析卡路里和营养价值",
  },
  {
    text: "生成建议...",
    subtext: "为您定制减肥建议",
  },
  {
    text: "即将完成...",
    subtext: "整理分析结果",
  },
];

const currentText = ref(loadingTexts[0].text);
const currentSubtext = ref(loadingTexts[0].subtext);

let progressInterval: NodeJS.Timeout | null = null;
let textInterval: NodeJS.Timeout | null = null;

// 启动加载动画
onMounted(() => {
  // 进度条动画
  progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 15;
    }
  }, 200);

  // 文本切换动画
  textInterval = setInterval(() => {
    currentTextIndex.value = (currentTextIndex.value + 1) % loadingTexts.length;
    const current = loadingTexts[currentTextIndex.value];
    currentText.value = current.text;
    currentSubtext.value = current.subtext;
  }, 1500);
});

// 清理定时器
onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval);
  }
  if (textInterval) {
    clearInterval(textInterval);
  }
});
</script>

<style scoped lang="less">
.loading-analysis {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;

  .loading-content {
    .loading-animation {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;

      .ai-icon {
        font-size: 48px;
        margin-bottom: 16px;
        animation: bounce 2s infinite;
      }

      .loading-dots {
        display: flex;
        gap: 4px;

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6366f1;
          animation: pulse 1.5s infinite;

          &.dot-1 {
            animation-delay: 0s;
          }

          &.dot-2 {
            animation-delay: 0.2s;
          }

          &.dot-3 {
            animation-delay: 0.4s;
          }
        }
      }
    }

    .loading-text {
      margin-bottom: 20px;

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 8px 0;
        animation: fadeInOut 1.5s infinite;
      }

      p {
        font-size: 14px;
        color: #6b7280;
        margin: 0;
      }
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 16px;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        transition: width 0.3s ease;
        animation: shimmer 2s infinite;
      }
    }

    .input-echo {
      background: #f3f4f6;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 20px;

      .echo-label {
        font-size: 12px;
        color: #6b7280;
        font-weight: 500;
      }

      .echo-text {
        font-size: 14px;
        color: #111827;
        font-weight: 500;
        margin-left: 8px;
      }
    }

    .cancel-btn {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 14px;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #e5e7eb;
        border-color: #9ca3af;
        color: #374151;
      }

      &:active {
        background: #d1d5db;
      }
    }
  }
}

// 动画定义
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}
</style>
