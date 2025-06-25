<script setup lang="ts">
import { ref } from "vue";
import type { WeightUnit } from "../../../types/weight";

interface Props {
  unit: WeightUnit;
}

// interface Emits {
//   "add-record": (weight: number, date?: string, note?: string) => void;
// }

defineProps<Props>();
// const emit = defineEmits<Emits>();

const weightInput = ref("");
const noteInput = ref("");
const isSubmitting = ref(false);

const handleSubmit = async () => {
  const weight = parseFloat(weightInput.value);

  if (isNaN(weight) || weight <= 0) {
    alert("请输入有效的体重数值");
    return;
  }

  isSubmitting.value = true;

  try {
    // emit("add-record", weight, undefined, noteInput.value || undefined);

    // 清空输入
    weightInput.value = "";
    noteInput.value = "";

    // 提示成功
    alert("体重记录已保存");
  } catch (error) {
    alert("保存失败，请重试");
  } finally {
    isSubmitting.value = false;
  }
};

const quickWeights = [68.0, 68.5, 69.0, 69.5, 70.0];

const handleQuickInput = (weight: number) => {
  weightInput.value = weight.toString();
};
</script>

<template>
  <div class="quick-input">
    <div class="input-header">
      <h3>📝 今日体重记录</h3>
    </div>

    <div class="input-form">
      <div class="weight-input-section">
        <div class="input-group">
          <input
            v-model="weightInput"
            type="number"
            step="0.1"
            placeholder="输入体重"
            class="weight-input"
          />
          <span class="unit-label">{{ unit }}</span>
        </div>

        <div class="quick-buttons">
          <button
            v-for="weight in quickWeights"
            :key="weight"
            @click="handleQuickInput(weight)"
            class="quick-btn"
          >
            {{ weight }}
          </button>
        </div>
      </div>

      <div class="note-section">
        <input
          v-model="noteInput"
          type="text"
          placeholder="添加备注（可选）"
          class="note-input"
        />
      </div>

      <button
        @click="handleSubmit"
        :disabled="isSubmitting || !weightInput"
        class="submit-btn"
      >
        <span v-if="isSubmitting">保存中...</span>
        <span v-else>💾 保存记录</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="less">
@primary-color: #6366f1;
@success-color: #10b981;
@bg-primary: #ffffff;
@bg-secondary: #f8fafc;
@text-primary: #1e293b;
@text-secondary: #64748b;
@text-light: #94a3b8;
@border-color: #e2e8f0;
@shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
@border-radius: 16px;

.quick-input {
  background: @bg-primary;
  border-radius: @border-radius;
  padding: 20px;
  box-shadow: @shadow-md;

  .input-header {
    margin-bottom: 20px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: @text-primary;
      margin: 0;
    }
  }

  .input-form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .weight-input-section {
      .input-group {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;

        .weight-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid @border-color;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          text-align: center;
          background: @bg-secondary;
          transition: all 0.2s ease;

          &:focus {
            outline: none;
            border-color: @primary-color;
            background: @bg-primary;
          }
        }

        .unit-label {
          font-size: 16px;
          font-weight: 600;
          color: @text-secondary;
          min-width: 30px;
        }
      }

      .quick-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        .quick-btn {
          padding: 8px 12px;
          border: 1px solid @border-color;
          border-radius: 8px;
          background: @bg-secondary;
          color: @text-secondary;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            border-color: @primary-color;
            color: @primary-color;
            background: rgba(99, 102, 241, 0.1);
          }
        }
      }
    }

    .note-section {
      .note-input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid @border-color;
        border-radius: 12px;
        font-size: 14px;
        background: @bg-secondary;
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: @primary-color;
          background: @bg-primary;
        }

        &::placeholder {
          color: @text-light;
        }
      }
    }

    .submit-btn {
      padding: 12px 24px;
      background: @primary-color;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: darken(@primary-color, 10%);
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
    }
  }
}
</style>
