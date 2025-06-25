import type { WeightUnit } from "../types/weight";

/**
 * 重量单位转换
 * @param weight 重量值
 * @param fromUnit 源单位
 * @param toUnit 目标单位
 * @returns 转换后的重量值
 */
export const convertWeight = (
  weight: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit
): number => {
  if (fromUnit === toUnit) return weight;

  if (fromUnit === "kg" && toUnit === "lb") {
    return weight * 2.20462;
  }

  if (fromUnit === "lb" && toUnit === "kg") {
    return weight / 2.20462;
  }

  return weight;
};

/**
 * 格式化重量显示
 * @param weight 重量值
 * @param unit 单位
 * @returns 格式化后的字符串
 */
export const formatWeight = (weight: number, unit: WeightUnit): string => {
  const decimalPlaces = unit === "kg" ? 1 : 1;
  return weight.toFixed(decimalPlaces);
};

/**
 * 计算重量变化
 * @param current 当前重量
 * @param yesterday 昨日重量
 * @returns 重量变化值（正数表示增加，负数表示减少）
 */
export const calculateChange = (current: number, yesterday: number): number => {
  return yesterday - current;
};

/**
 * 验证重量值是否有效
 * @param weight 重量值
 * @param unit 单位
 * @returns 是否有效
 */
export const isValidWeight = (weight: number, unit: WeightUnit): boolean => {
  if (isNaN(weight) || weight <= 0) return false;

  // 设置合理的重量范围
  const ranges = {
    kg: { min: 20, max: 300 },
    lb: { min: 44, max: 661 }, // 约等于 20kg - 300kg
  };

  const range = ranges[unit];
  return weight >= range.min && weight <= range.max;
};
