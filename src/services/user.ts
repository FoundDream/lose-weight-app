import type { UserInfoRequest, UserInfoResponse } from "../types/user";
import http from "./http";

class UserService {
  async getUserInfo(request: UserInfoRequest): Promise<UserInfoResponse> {
    const response = await http.get<UserInfoResponse>(
      `/api/user/profile/${request.username}`
    );
    return response;
  }
}

export const userService = new UserService();
