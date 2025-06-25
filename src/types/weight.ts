export type WeightUnit = "kg" | "lb";

export interface WeightData {
  current: number;
  target: number;
  yesterday: number;
}

export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
  unit: WeightUnit;
  note?: string;
  createdAt: string;
}

export interface WeightCardProps {
  currentWeight: number;
  targetWeight: number;
  yesterdayWeight: number;
  unit: WeightUnit;
  editable: boolean;
}

export interface WeightDisplayProps {
  weight: number;
  unit: WeightUnit;
}

export interface WeightTargetProps {
  targetWeight: number;
  currentWeight: number;
  unit: WeightUnit;
  editable: boolean;
}

export interface WeightChangeProps {
  currentWeight: number;
  yesterdayWeight: number;
  unit: WeightUnit;
}

export interface WeightStats {
  totalLoss: number;
  weeklyLoss: number;
  monthlyLoss: number;
  averageWeekly: number;
  daysToGoal: number;
}

// 导航相关类型
export interface NavItem {
  name: string;
  path: string;
  icon?: string;
  label: string;
}
