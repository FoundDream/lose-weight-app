// 食物项目类型
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  unit: string;
  quantity: number;
  confidence: number; // AI分析的置信度 0-1
}

// 营养成分类型
export interface NutritionInfo {
  protein: number; // 蛋白质(g)
  carbs: number; // 碳水化合物(g)
  fat: number; // 脂肪(g)
  fiber: number; // 纤维(g)
  sugar: number; // 糖分(g)
}

// AI分析结果类型
export interface CalorieAnalysis {
  id: string;
  timestamp: Date;
  originalInput: string; // 用户原始输入
  foods: FoodItem[];
  totalCalories: number;
  nutrition: NutritionInfo;
  suggestions: string[]; // AI建议
  confidence: number; // 整体分析置信度
}

// 分析历史记录类型
export interface AnalysisHistory {
  today: CalorieAnalysis[];
  thisWeek: CalorieAnalysis[];
  thisMonth: CalorieAnalysis[];
}

// 输入模板类型
export interface InputTemplate {
  id: string;
  name: string;
  placeholder: string;
  examples: string[];
  category: "meal" | "snack" | "drink" | "fruit";
}

// API响应类型
export interface OpenAIResponse {
  foods: Array<{
    name: string;
    calories: number;
    unit: string;
    quantity: number;
    confidence: number;
  }>;
  nutrition: NutritionInfo;
  suggestions: string[];
  confidence: number;
}

// 分析状态类型
export type AnalysisStatus = "idle" | "analyzing" | "success" | "error";

// 错误类型
export interface AnalysisError {
  message: string;
  code: string;
  details?: any;
}

// 热量统计数据类型
export interface CalorieStats {
  today: {
    consumed: number;
    goal: number;
    remaining: number;
    percentage: number;
  };
  week: {
    average: number;
    total: number;
    days: number;
  };
  month: {
    average: number;
    total: number;
    days: number;
  };
}

// 热量记录过滤器类型
export interface CalorieFilter {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchText: string;
  sortBy: "date" | "calories" | "confidence";
  sortOrder: "asc" | "desc";
}

// 营养成分百分比类型
export interface NutritionPercentage {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

// 快速录入模板类型（扩展）
export interface QuickInputTemplate {
  id: string;
  name: string;
  description: string;
  estimatedCalories: number;
  category: "breakfast" | "lunch" | "dinner" | "snack";
  icon: string;
}

// 热量趋势数据类型
export interface CalorieTrend {
  date: string;
  consumed: number;
  goal: number;
  deficit: number;
}
