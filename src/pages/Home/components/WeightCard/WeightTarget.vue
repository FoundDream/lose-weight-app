<script setup lang="ts">
import { ref, computed } from "vue";
import type { WeightTargetProps } from "./weight";
import { isValidWeight } from "../../../../utils/weight";

const props = defineProps<WeightTargetProps>();
const emit = defineEmits(["update:targetWeight"]);

const isEditing = ref(false);
const editValue = ref(props.targetWeight.toString());

const remainingWeight = computed(() => {
  const remaining = props.currentWeight - props.targetWeight;
  return remaining > 0 ? remaining : 0;
});

const startEdit = () => {
  if (!props.editable) return;
  isEditing.value = true;
  editValue.value = props.targetWeight.toString();
};

const saveEdit = () => {
  const newValue = parseFloat(editValue.value);
  if (!isValidWeight(newValue, props.unit)) {
    editValue.value = props.targetWeight.toString();
    return;
  }
  emit("update:targetWeight", newValue);
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
  editValue.value = props.targetWeight.toString();
};

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    saveEdit();
  } else if (event.key === "Escape") {
    cancelEdit();
  }
};
</script>

<template>
  <div class="weight-target">
    <div class="target-info">
      <span class="label">目标体重</span>
      <div v-if="!isEditing" class="target-display" @click="startEdit">
        <span class="target-value">{{ targetWeight }}{{ unit }}</span>
        <span v-if="editable" class="edit-hint">✏️</span>
      </div>
      <div v-else class="target-edit">
        <input
          v-model="editValue"
          type="number"
          step="0.1"
          min="30"
          max="300"
          class="target-input"
          @keyup="handleKeyup"
          @blur="saveEdit"
          ref="editInput"
        />
        <span class="unit-suffix">{{ unit }}</span>
      </div>
    </div>
    <div class="progress-info">
      <span class="remaining">
        还需减重 {{ remainingWeight.toFixed(1) }}{{ unit }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="less">
.weight-target {
  .target-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;

    .label {
      font-size: 14px;
      color: #94a3b8;
    }

    .target-display {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(99, 102, 241, 0.1);
      }

      .target-value {
        font-size: 14px;
        font-weight: 600;
        color: #6366f1;
      }

      .edit-hint {
        font-size: 12px;
        opacity: 0.6;
      }
    }

    .target-edit {
      display: flex;
      align-items: center;
      gap: 4px;

      .target-input {
        width: 60px;
        padding: 4px 8px;
        border: 2px solid #6366f1;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        background: white;

        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
      }

      .unit-suffix {
        font-size: 14px;
        color: #64748b;
      }
    }
  }

  .progress-info {
    .remaining {
      font-size: 13px;
      color: #64748b;
    }
  }
}
</style>
