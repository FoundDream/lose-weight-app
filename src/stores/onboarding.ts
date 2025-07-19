import { defineStore } from "pinia";
import { ref } from "vue";

// 用户引导信息接口
export interface OnboardingData {
  age: number;
  gender: string;
  height: number;
  weight: number;
  targetWeight: number;
  deadline: Date;
}

export const useOnboardingStore = defineStore("onboarding", () => {
  const onboardingData = ref<OnboardingData>({
    age: 0,
    gender: "",
    height: 0,
    weight: 0,
    targetWeight: 0,
    deadline: new Date(),
  });

  const setFormData = (data: OnboardingData) => {
    onboardingData.value = data;
  };

  return {
    onboardingData,
    setFormData,
  };
});
