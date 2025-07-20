import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";
import http from "./http";

class AuthService {
  /**
   * 用户登录
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await http.post<AuthResponse>(
        "/api/auth/login",
        request
      );
      if (response) {
        this.setToken(response.token);
      }
      return response;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "网络错误，请稍后重试");
    }
  }

  /**
   * 用户注册
   */
  async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await http.post<AuthResponse>(
        "/api/auth/register",
        request
      );
      if (response) {
        this.setToken(response.token);
      }
      return response;
    } catch (error: any) {
      console.error("Register error:", error);
      throw new Error(error.message || "网络错误，请稍后重试");
    }
  }

  /**
   * 获取存储的token
   */
  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  /**
   * 存储token
   */
  setToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  /**
   * 清除token
   */
  clearToken(): void {
    localStorage.removeItem("auth_token");
  }

  /**
   * 检查token是否存在
   */
  hasToken(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
