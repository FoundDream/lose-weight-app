import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// 环境变量配置
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// 响应数据接口
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 创建axios实例
const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10秒超时
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem("auth_token");

    // 如果有token，添加到请求头
    if (token && config.headers) {
      config.headers.authorization = `Bearer ${token}`;
    }

    console.log("🚀 发送请求:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ 请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data, status } = response;

    console.log("✅ 响应成功:", status, response.config.url);

    // 如果后端返回的数据结构包含success字段
    if (data && typeof data.success !== "undefined") {
      if (!data.success) {
        // 业务逻辑错误
        const errorMessage = data.message || "请求失败";
        throw new Error(errorMessage);
      }
      return data.data; // 直接返回data字段
    }

    // 如果没有success字段，直接返回整个响应数据
    return data;
  },
  (error) => {
    console.error("❌ 响应错误:", error);

    let errorMessage = "网络错误，请稍后重试";

    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response;

      switch (status) {
        case 401:
          errorMessage = "登录已过期，请重新登录";
          // 清除本地token
          localStorage.removeItem("auth_token");
          // 可以在这里跳转到登录页
          // router.push('/auth');
          break;
        case 403:
          errorMessage = "没有权限访问该资源";
          break;
        case 404:
          errorMessage = "请求的资源不存在";
          break;
        case 500:
          errorMessage = "服务器内部错误";
          break;
        default:
          errorMessage = data?.message || `请求失败 (${status})`;
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = "网络连接失败，请检查网络设置";
    } else {
      // 请求配置出错
      errorMessage = error.message || "请求配置错误";
    }

    return Promise.reject(new Error(errorMessage));
  }
);

// 封装常用请求方法
export const request = {
  // GET请求
  get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return http.get(url, { params, ...config });
  },

  // POST请求
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return http.post(url, data, config);
  },

  // PUT请求
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return http.put(url, data, config);
  },

  // DELETE请求
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return http.delete(url, config);
  },

  // PATCH请求
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return http.patch(url, data, config);
  },

  // 上传文件
  upload<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    return http.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
  },
};

// 导出axios实例，以便在特殊情况下使用
export { http };

// 默认导出request对象
export default request;
