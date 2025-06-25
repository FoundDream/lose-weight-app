export type WeightUnit = "kg" | "lb";

export interface WeightData {
  current: number;
  target: number;
  yesterday: number;
}

export interface WeightCardProps {
  currentWeight: number;
  targetWeight: number;
  yesterdayWeight: number;
  unit: WeightUnit;
  editable: boolean;
}

export interface WeightCardEmits {
  "update:targetWeight": (value: number) => void;
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

export interface WeightTargetEmits {
  "update:targetWeight": (value: number) => void;
}

export interface WeightChangeProps {
  currentWeight: number;
  yesterdayWeight: number;
  unit: WeightUnit;
}

// 工具函数类型
export interface WeightUtils {
  convertWeight: (
    weight: number,
    fromUnit: WeightUnit,
    toUnit: WeightUnit
  ) => number;
  formatWeight: (weight: number, unit: WeightUnit) => string;
  calculateChange: (current: number, yesterday: number) => number;
}
