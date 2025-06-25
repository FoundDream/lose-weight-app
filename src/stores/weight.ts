import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { WeightRecord, WeightUnit, WeightStats } from "../types/weight";

export const useWeightStore = defineStore("weight", () => {
  // 状态
  const records = ref<WeightRecord[]>([]);
  const currentWeight = ref(68.5);
  const targetWeight = ref(60.0);
  const unit = ref<WeightUnit>("kg");
  const isEditable = ref(true);

  // 模拟初始数据
  const initMockData = () => {
    const now = new Date();
    const mockRecords: WeightRecord[] = [];

    // 生成过去30天的模拟数据
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // 模拟体重逐渐减少的趋势
      const baseWeight = 70 - i * 0.05 + (Math.random() - 0.5) * 0.5;

      mockRecords.push({
        id: `record-${i}`,
        date: date.toISOString().split("T")[0],
        weight: Math.round(baseWeight * 10) / 10,
        unit: unit.value,
        createdAt: date.toISOString(),
        note: i === 0 ? "今日体重" : i % 7 === 0 ? "周末称重" : undefined,
      });
    }

    records.value = mockRecords;
    currentWeight.value = mockRecords[mockRecords.length - 1]?.weight || 68.5;
  };

  // 计算属性
  const yesterdayWeight = computed(() => {
    if (records.value.length < 2) return currentWeight.value + 0.3;
    return (
      records.value[records.value.length - 2]?.weight ||
      currentWeight.value + 0.3
    );
  });

  const weightStats = computed((): WeightStats => {
    if (records.value.length === 0) {
      return {
        totalLoss: 0,
        weeklyLoss: 0,
        monthlyLoss: 0,
        averageWeekly: 0,
        daysToGoal: 0,
      };
    }

    const firstRecord = records.value[0];
    const lastRecord = records.value[records.value.length - 1];
    const totalLoss = firstRecord.weight - lastRecord.weight;

    // 计算周损失
    const weekAgo = records.value.find((r) => {
      const recordDate = new Date(r.date);
      const weekAgoDate = new Date();
      weekAgoDate.setDate(weekAgoDate.getDate() - 7);
      return recordDate >= weekAgoDate;
    });
    const weeklyLoss = weekAgo ? weekAgo.weight - currentWeight.value : 0;

    // 计算月损失
    const monthAgo = records.value.find((r) => {
      const recordDate = new Date(r.date);
      const monthAgoDate = new Date();
      monthAgoDate.setDate(monthAgoDate.getDate() - 30);
      return recordDate >= monthAgoDate;
    });
    const monthlyLoss = monthAgo
      ? monthAgo.weight - currentWeight.value
      : totalLoss;

    // 计算平均周损失
    const totalWeeks = Math.max(1, records.value.length / 7);
    const averageWeekly = totalLoss / totalWeeks;

    // 计算达到目标的天数
    const needToLose = currentWeight.value - targetWeight.value;
    const avgDailyLoss = averageWeekly / 7;
    const daysToGoal =
      avgDailyLoss > 0 ? Math.ceil(needToLose / avgDailyLoss) : 0;

    return {
      totalLoss,
      weeklyLoss,
      monthlyLoss,
      averageWeekly,
      daysToGoal,
    };
  });

  const recentRecords = computed(() => {
    return records.value
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  });

  // 方法
  const addRecord = (weight: number, date?: string, note?: string) => {
    const recordDate = date || new Date().toISOString().split("T")[0];
    const newRecord: WeightRecord = {
      id: `record-${Date.now()}`,
      date: recordDate,
      weight,
      unit: unit.value,
      note,
      createdAt: new Date().toISOString(),
    };

    // 检查是否已存在当天记录
    const existingIndex = records.value.findIndex((r) => r.date === recordDate);
    if (existingIndex >= 0) {
      // 更新现有记录
      records.value[existingIndex] = newRecord;
    } else {
      // 添加新记录并按日期排序
      records.value.push(newRecord);
      records.value.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    // 更新当前体重
    if (recordDate === new Date().toISOString().split("T")[0]) {
      currentWeight.value = weight;
    }
  };

  const updateRecord = (id: string, updates: Partial<WeightRecord>) => {
    const index = records.value.findIndex((r) => r.id === id);
    if (index >= 0) {
      records.value[index] = { ...records.value[index], ...updates };
    }
  };

  const deleteRecord = (id: string) => {
    const index = records.value.findIndex((r) => r.id === id);
    if (index >= 0) {
      records.value.splice(index, 1);
    }
  };

  const updateTargetWeight = (newTarget: number) => {
    targetWeight.value = newTarget;
  };

  const switchUnit = (newUnit: WeightUnit) => {
    // 这里可以添加单位转换逻辑
    unit.value = newUnit;
  };

  return {
    // 状态
    records,
    currentWeight,
    targetWeight,
    yesterdayWeight,
    unit,
    isEditable,

    // 计算属性
    weightStats,
    recentRecords,

    // 方法
    initMockData,
    addRecord,
    updateRecord,
    deleteRecord,
    updateTargetWeight,
    switchUnit,
  };
});
