// 认证用户信息接口
export interface AuthUser {
  id: number;
  username: string;
  created_at: string;
}

// 认证响应接口
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
}

// 登录请求参数
export interface LoginRequest {
  username: string;
  password: string;
}

// 注册请求参数
export interface RegisterRequest {
  username: string;
  password: string;
}
