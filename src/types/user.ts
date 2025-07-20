// 用户信息接口
export interface UserInfoRequest {
  username: string;
}

export interface UserInfoResponse {
  id: number;
  username: string;
  gender: string;
  age: number;
  height: number;
  initialWeight: number;
  currentWeight: number;
  targetWeight: number;
  deadline: Date;
  bmi: number;
}
