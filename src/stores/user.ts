import { ref } from "vue";
import { defineStore } from "pinia";
import { userService } from "../services/user";
import type { UserInfoRequest, UserInfoResponse } from "../types/user";

export const useUserStore = defineStore("user", () => {
  const userInfo = ref<UserInfoResponse | null>(null);

  const getUserInfo = async (data: UserInfoRequest) => {
    const response = await userService.getUserInfo(data);
    userInfo.value = response;
    return response;
  };

  return {
    userInfo,
    getUserInfo,
  };
});
