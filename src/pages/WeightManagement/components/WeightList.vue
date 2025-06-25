<script setup lang="ts">
import { ref } from "vue";
import type { WeightRecord, WeightUnit } from "../../../types/weight";

interface Props {
  records: WeightRecord[];
  unit: WeightUnit;
}

interface Emits {
  "update-record": (id: string, updates: Partial<WeightRecord>) => void;
  "delete-record": (id: string) => void;
}

defineProps<Props>();
const emit = defineEmits(["update-record", "delete-record"]);

const editingId = ref<string | null>(null);
const editWeight = ref("");
const editNote = ref("");

const startEdit = (record: WeightRecord) => {
  editingId.value = record.id;
  editWeight.value = record.weight.toString();
  editNote.value = record.note || "";
};

const saveEdit = (id: string) => {
  const weight = parseFloat(editWeight.value);
  if (isNaN(weight) || weight <= 0) {
    alert("请输入有效的体重数值");
    return;
  }

  emit("update-record", id, {
    weight,
    note: editNote.value || undefined,
  });

  cancelEdit();
};

const cancelEdit = () => {
  editingId.value = null;
  editWeight.value = "";
  editNote.value = "";
};

const deleteRecord = (id: string) => {
  if (confirm("确定要删除这条记录吗？")) {
    emit("delete-record", id);
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays === 2) return "前天";

  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const getWeightChange = (currentRecord: WeightRecord, index: number) => {
  if (index === 0) return null;

  // 这里需要从完整记录列表中找到前一条记录
  // 简化处理，假设records已经按日期排序
  return null; // 暂时返回null，后续可以优化
};
</script>

<template>
  <div class="weight-list">
    <div class="list-header">
      <h3>📋 历史记录</h3>
      <span class="record-count">共 {{ records.length }} 条</span>
    </div>

    <div class="record-list">
      <div
        v-for="(record, index) in records"
        :key="record.id"
        class="record-item"
      >
        <div class="record-date">
          <div class="date-text">{{ formatDate(record.date) }}</div>
          <div class="date-full">{{ record.date }}</div>
        </div>

        <div class="record-content">
          <div v-if="editingId !== record.id" class="record-display">
            <div class="weight-info">
              <span class="weight-value">{{ record.weight }}{{ unit }}</span>
              <span v-if="record.note" class="weight-note">{{
                record.note
              }}</span>
            </div>
          </div>

          <div v-else class="record-edit">
            <div class="edit-inputs">
              <input
                v-model="editWeight"
                type="number"
                step="0.1"
                class="edit-weight-input"
              />
              <span class="unit-label">{{ unit }}</span>
              <input
                v-model="editNote"
                type="text"
                placeholder="备注"
                class="edit-note-input"
              />
            </div>
            <div class="edit-actions">
              <button @click="saveEdit(record.id)" class="save-btn">
                保存
              </button>
              <button @click="cancelEdit" class="cancel-btn">取消</button>
            </div>
          </div>
        </div>

        <div class="record-actions">
          <button
            v-if="editingId !== record.id"
            @click="startEdit(record)"
            class="action-btn edit"
          >
            ✏️
          </button>
          <button @click="deleteRecord(record.id)" class="action-btn delete">
            🗑️
          </button>
        </div>
      </div>

      <div v-if="records.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <p>还没有体重记录</p>
        <small>点击上方添加您的第一条记录</small>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@primary-color: #6366f1;
@success-color: #10b981;
@danger-color: #ef4444;
@warning-color: #f59e0b;
@bg-primary: #ffffff;
@bg-secondary: #f8fafc;
@text-primary: #1e293b;
@text-secondary: #64748b;
@text-light: #94a3b8;
@border-color: #e2e8f0;
@shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
@shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
@border-radius: 16px;

.weight-list {
  background: @bg-primary;
  border-radius: @border-radius;
  padding: 20px;
  box-shadow: @shadow-md;

  .list-header {
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

    .record-count {
      font-size: 14px;
      color: @text-secondary;
      background: @bg-secondary;
      padding: 4px 12px;
      border-radius: 12px;
    }
  }

  .record-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .record-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: @bg-secondary;
      border-radius: 12px;
      transition: all 0.2s ease;

      &:hover {
        background: #f1f5f9;
      }

      .record-date {
        min-width: 80px;
        text-align: center;

        .date-text {
          font-size: 14px;
          font-weight: 600;
          color: @text-primary;
        }

        .date-full {
          font-size: 12px;
          color: @text-light;
          margin-top: 2px;
        }
      }

      .record-content {
        flex: 1;

        .record-display {
          .weight-info {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .weight-value {
              font-size: 18px;
              font-weight: 600;
              color: @primary-color;
            }

            .weight-note {
              font-size: 14px;
              color: @text-secondary;
            }
          }
        }

        .record-edit {
          .edit-inputs {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;

            .edit-weight-input {
              width: 80px;
              padding: 8px 12px;
              border: 2px solid @border-color;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              text-align: center;

              &:focus {
                outline: none;
                border-color: @primary-color;
              }
            }

            .unit-label {
              font-size: 14px;
              color: @text-secondary;
            }

            .edit-note-input {
              flex: 1;
              padding: 8px 12px;
              border: 2px solid @border-color;
              border-radius: 8px;
              font-size: 14px;

              &:focus {
                outline: none;
                border-color: @primary-color;
              }
            }
          }

          .edit-actions {
            display: flex;
            gap: 8px;

            .save-btn,
            .cancel-btn {
              padding: 6px 12px;
              border: none;
              border-radius: 6px;
              font-size: 12px;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .save-btn {
              background: @success-color;
              color: white;

              &:hover {
                background: darken(@success-color, 10%);
              }
            }

            .cancel-btn {
              background: @text-light;
              color: white;

              &:hover {
                background: darken(@text-light, 10%);
              }
            }
          }
        }
      }

      .record-actions {
        display: flex;
        gap: 8px;

        .action-btn {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;

          &.edit:hover {
            background: rgba(99, 102, 241, 0.1);
          }

          &.delete:hover {
            background: rgba(239, 68, 68, 0.1);
          }
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: @text-light;

      .empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      p {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 500;
      }

      small {
        font-size: 14px;
      }
    }
  }
}
</style>
