import { defineStore } from "pinia";
import type { WeightRecord, WeightUnit, WeightStats } from "../types/weight";
import type {
  CalorieAnalysis,
  AnalysisHistory,
  AnalysisStatus,
  AnalysisError,
} from "../types/calorie";
import {
  analyzeFoodCalories,
  createMockAnalysis,
  checkApiConfiguration,
} from "../services/openai";

// 定义体重条目接口（基于现有的WeightRecord，但使用Date对象）
interface WeightEntry {
  id: string;
  weight: number;
  date: Date;
  note: string;
}

interface WeightState {
  // 现有的体重相关状态
  entries: WeightEntry[];
  unit: WeightUnit;
  isEditable: boolean;

  // 新增的卡路里相关状态
  calorieAnalyses: CalorieAnalysis[];
  analysisStatus: AnalysisStatus;
  analysisError: AnalysisError | null;
  dailyCalorieGoal: number;
  dailyBurnedCalories: number;
}

export const useWeightStore = defineStore("weight", {
  state: (): WeightState => ({
    // 体重条目数据
    entries: [
      { id: "1", weight: 70.5, date: new Date("2024-01-15"), note: "晨起体重" },
      { id: "2", weight: 70.2, date: new Date("2024-01-14"), note: "昨日体重" },
      { id: "3", weight: 70.8, date: new Date("2024-01-13"), note: "" },
      { id: "4", weight: 71.0, date: new Date("2024-01-12"), note: "周五称重" },
      { id: "5", weight: 70.9, date: new Date("2024-01-11"), note: "" },
      { id: "6", weight: 71.2, date: new Date("2024-01-10"), note: "周三体重" },
      {
        id: "7",
        weight: 71.5,
        date: new Date("2024-01-09"),
        note: "工作日体重",
      },
      { id: "8", weight: 71.3, date: new Date("2024-01-08"), note: "" },
      { id: "9", weight: 71.8, date: new Date("2024-01-07"), note: "周日体重" },
      {
        id: "10",
        weight: 72.0,
        date: new Date("2024-01-06"),
        note: "周末体重",
      },
      { id: "11", weight: 71.9, date: new Date("2024-01-05"), note: "" },
      {
        id: "12",
        weight: 72.2,
        date: new Date("2024-01-04"),
        note: "周四称重",
      },
      { id: "13", weight: 72.4, date: new Date("2024-01-03"), note: "" },
      {
        id: "14",
        weight: 72.1,
        date: new Date("2024-01-02"),
        note: "新年体重",
      },
      {
        id: "15",
        weight: 72.8,
        date: new Date("2024-01-01"),
        note: "元旦体重",
      },
    ],
    unit: "kg",
    isEditable: true,

    // 卡路里相关状态
    calorieAnalyses: [],
    analysisStatus: "idle",
    analysisError: null,
    dailyCalorieGoal: 1800,
    dailyBurnedCalories: 2200,
  }),

  getters: {
    // 体重相关getters
    currentWeight: (state): number => state.entries[0]?.weight || 0,
    targetWeight: (): number => 65,
    yesterdayWeight: (state): number => state.entries[1]?.weight || 0,
    weightChange: (state): number => {
      const current = state.entries[0]?.weight || 0;
      const yesterday = state.entries[1]?.weight || 0;
      return current - yesterday;
    },
    recentEntries: (state): WeightEntry[] => state.entries.slice(0, 7),
    totalWeightLoss: (state): number => {
      const latest = state.entries[0]?.weight || 0;
      const earliest =
        state.entries[state.entries.length - 1]?.weight || latest;
      return earliest - latest;
    },
    averageWeightLoss: (state): number => {
      if (state.entries.length < 2) return 0;
      const totalLoss =
        (state.entries[state.entries.length - 1]?.weight || 0) -
        (state.entries[0]?.weight || 0);
      const days = state.entries.length - 1;
      return totalLoss / days;
    },
    estimatedDaysToGoal: (state): number => {
      const currentWeight = state.entries[0]?.weight || 0;
      const targetWeight = 65;

      // 计算平均每日减重
      if (state.entries.length < 2) return 0;
      const totalLoss =
        (state.entries[state.entries.length - 1]?.weight || 0) -
        (state.entries[0]?.weight || 0);
      const days = state.entries.length - 1;
      const avgLossPerDay = totalLoss / days;

      if (avgLossPerDay <= 0 || currentWeight <= targetWeight) return 0;
      return Math.ceil((currentWeight - targetWeight) / avgLossPerDay);
    },
    progressPercentage: (state): number => {
      const startWeight = state.entries[state.entries.length - 1]?.weight || 0;
      const currentWeight = state.entries[0]?.weight || 0;
      const targetWeight = 65;

      if (startWeight <= targetWeight) return 100;
      const totalToLose = startWeight - targetWeight;
      const lostSoFar = startWeight - currentWeight;
      return Math.min(100, Math.max(0, (lostSoFar / totalToLose) * 100));
    },

    // 卡路里相关getters
    todayAnalyses: (state): CalorieAnalysis[] => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return state.calorieAnalyses.filter((analysis) => {
        const analysisDate = new Date(analysis.timestamp);
        analysisDate.setHours(0, 0, 0, 0);
        return analysisDate.getTime() === today.getTime();
      });
    },

    todayTotalCalories: (state): number => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return state.calorieAnalyses
        .filter((analysis) => {
          const analysisDate = new Date(analysis.timestamp);
          analysisDate.setHours(0, 0, 0, 0);
          return analysisDate.getTime() === today.getTime();
        })
        .reduce(
          (total: number, analysis: CalorieAnalysis) =>
            total + analysis.totalCalories,
          0
        );
    },

    calorieDeficit: (state): number => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayTotal = state.calorieAnalyses
        .filter((analysis) => {
          const analysisDate = new Date(analysis.timestamp);
          analysisDate.setHours(0, 0, 0, 0);
          return analysisDate.getTime() === today.getTime();
        })
        .reduce(
          (total: number, analysis: CalorieAnalysis) =>
            total + analysis.totalCalories,
          0
        );

      return state.dailyBurnedCalories - todayTotal;
    },

    analysisHistory: (state): AnalysisHistory => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      return {
        today: state.calorieAnalyses.filter(
          (a) => new Date(a.timestamp) >= today
        ),
        thisWeek: state.calorieAnalyses.filter(
          (a) => new Date(a.timestamp) >= weekAgo
        ),
        thisMonth: state.calorieAnalyses.filter(
          (a) => new Date(a.timestamp) >= monthAgo
        ),
      };
    },

    isAnalyzing: (state): boolean => state.analysisStatus === "analyzing",

    // 兼容原有的WeightStats格式
    weightStats: (state): WeightStats => {
      if (state.entries.length === 0) {
        return {
          totalLoss: 0,
          weeklyLoss: 0,
          monthlyLoss: 0,
          averageWeekly: 0,
          daysToGoal: 0,
        };
      }

      const firstRecord = state.entries[state.entries.length - 1];
      const lastRecord = state.entries[0];
      const totalLoss = firstRecord.weight - lastRecord.weight;

      // 计算周损失
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoEntry = state.entries.find((entry) => entry.date >= weekAgo);
      const weeklyLoss = weekAgoEntry
        ? weekAgoEntry.weight - lastRecord.weight
        : 0;

      // 计算月损失
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      const monthAgoEntry = state.entries.find(
        (entry) => entry.date >= monthAgo
      );
      const monthlyLoss = monthAgoEntry
        ? monthAgoEntry.weight - lastRecord.weight
        : totalLoss;

      // 计算平均周损失
      const totalWeeks = Math.max(1, state.entries.length / 7);
      const averageWeekly = totalLoss / totalWeeks;

      // 计算达到目标的天数
      const needToLose = lastRecord.weight - 65; // targetWeight = 65
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
    },
  },

  actions: {
    // 体重相关actions
    addWeightEntry(weight: number, note?: string) {
      const newEntry: WeightEntry = {
        id: Date.now().toString(),
        weight,
        date: new Date(),
        note: note || "",
      };
      this.entries.unshift(newEntry);
    },

    updateWeightEntry(id: string, weight: number, note?: string) {
      const index = this.entries.findIndex((entry) => entry.id === id);
      if (index !== -1) {
        this.entries[index] = {
          ...this.entries[index],
          weight,
          note: note || this.entries[index].note,
        };
      }
    },

    deleteWeightEntry(id: string) {
      const index = this.entries.findIndex((entry) => entry.id === id);
      if (index !== -1) {
        this.entries.splice(index, 1);
      }
    },

    updateTargetWeight(newTargetWeight: number) {
      console.log("Target weight updated to:", newTargetWeight);
    },

    setUnit(unit: WeightUnit) {
      this.unit = unit;
    },

    setEditable(editable: boolean) {
      this.isEditable = editable;
    },

    // 卡路里相关actions
    async analyzeFood(foodInput: string): Promise<void> {
      this.analysisStatus = "analyzing";
      this.analysisError = null;

      try {
        let result;

        // 检查API配置，如果未配置则使用模拟数据
        if (checkApiConfiguration()) {
          result = await analyzeFoodCalories(foodInput);
        } else {
          // 模拟延迟
          await new Promise((resolve) => setTimeout(resolve, 1500));
          result = createMockAnalysis(foodInput);
        }

        // 创建分析记录
        const analysis: CalorieAnalysis = {
          id: Date.now().toString(),
          timestamp: new Date(),
          originalInput: foodInput,
          foods: result.foods.map((food) => ({
            ...food,
            id: Date.now().toString() + Math.random(),
          })),
          totalCalories: result.foods.reduce(
            (sum, food) => sum + food.calories,
            0
          ),
          nutrition: result.nutrition,
          suggestions: result.suggestions,
          confidence: result.confidence,
        };

        // 添加到历史记录
        this.calorieAnalyses.unshift(analysis);
        this.analysisStatus = "success";
      } catch (error: any) {
        this.analysisError = error;
        this.analysisStatus = "error";
        console.error("Food analysis failed:", error);
      }
    },

    clearAnalysisError() {
      this.analysisError = null;
      this.analysisStatus = "idle";
    },

    deleteAnalysis(id: string) {
      const index = this.calorieAnalyses.findIndex(
        (analysis) => analysis.id === id
      );
      if (index !== -1) {
        this.calorieAnalyses.splice(index, 1);
      }
    },

    updateDailyCalorieGoal(goal: number) {
      this.dailyCalorieGoal = goal;
    },

    updateDailyBurnedCalories(burned: number) {
      this.dailyBurnedCalories = burned;
    },
  },
});
