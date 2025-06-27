import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

class AuthService {
  /**
   * 用户登录
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "登录失败");
      }

      return data;
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
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      console.log(response, "注册返回response");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "注册失败");
      }

      return data;
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
