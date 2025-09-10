/**
 * APIクライアント
 *
 * バックエンドAPIとの通信を管理
 * 現在はモックデータを返すが、実際のAPI実装時に置き換える予定
 */

import type { Task, Notification } from "@/lib/types";
import { mockTasks } from "@/data/mockTasks";
import { createMockNotifications } from "@/data/mockNotifications";

/**
 * API レスポンスの基本型
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * タスク関連のAPI
 */
export const taskApi = {
  /**
   * 全タスクを取得
   */
  async getAllTasks(): Promise<ApiResponse<Task[]>> {
    // TODO: 実際のAPI呼び出しに置き換える
    await new Promise((resolve) => setTimeout(resolve, 100)); // 擬似的な遅延

    return {
      success: true,
      data: mockTasks,
    };
  },

  /**
   * タスクを作成
   */
  async createTask(task: Omit<Task, "id">): Promise<ApiResponse<Task>> {
    // TODO: 実際のAPI呼び出しに置き換える
    await new Promise((resolve) => setTimeout(resolve, 200));

    const newTask: Task = {
      id: `api_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ...task,
    };

    return {
      success: true,
      data: newTask,
    };
  },

  /**
   * タスクを更新
   */
  async updateTask(
    id: string,
    updates: Partial<Task>
  ): Promise<ApiResponse<Task>> {
    // TODO: 実際のAPI呼び出しに置き換える
    await new Promise((resolve) => setTimeout(resolve, 150));

    // モックの更新ロジック
    const existingTask = mockTasks.find((task) => task.id === id);
    if (!existingTask) {
      return {
        success: false,
        error: "タスクが見つかりません",
      };
    }

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
    };

    return {
      success: true,
      data: updatedTask,
    };
  },

  /**
   * タスクを削除
   */
  async deleteTask(id: string): Promise<ApiResponse<void>> {
    // TODO: 実際のAPI呼び出しに置き換える
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      success: true,
      message: "タスクを削除しました",
    };
  },

  /**
   * 指定日付のタスクを取得
   */
  async getTasksByDate(date: string): Promise<ApiResponse<Task[]>> {
    // TODO: 実際のAPI呼び出しに置き換える
    await new Promise((resolve) => setTimeout(resolve, 120));

    const tasksForDate = mockTasks.filter((task) => task.date === date);

    return {
      success: true,
      data: tasksForDate,
    };
  },
};

/**
 * 通知関連のAPI
 */
export const notificationApi = {
  /**
   * 全通知を取得
   */
  async getAllNotifications(): Promise<ApiResponse<Notification[]>> {
    // TODO: 実際のAPI呼び出しに置き換える
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      success: true,
      data: createMockNotifications(),
    };
  },

  /**
   * 通知を既読にする
   */
  async markAsRead(id: string): Promise<ApiResponse<void>> {
    // TODO: 実際のAPI呼び出しに置き換える
    await new Promise((resolve) => setTimeout(resolve, 80));

    return {
      success: true,
      message: "通知を既読にしました",
    };
  },

  /**
   * 通知を削除
   */
  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    // TODO: 実際のAPI呼び出しに置き換える
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      success: true,
      message: "通知を削除しました",
    };
  },

  /**
   * 全通知をクリア
   */
  async clearAllNotifications(): Promise<ApiResponse<void>> {
    // TODO: 実際のAPI呼び出しに置き換える
    await new Promise((resolve) => setTimeout(resolve, 150));

    return {
      success: true,
      message: "全通知をクリアしました",
    };
  },
};

/**
 * API設定
 */
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  timeout: 10000,

  // 認証が必要になった場合のヘッダー設定
  getAuthHeaders(): Record<string, string> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

/**
 * エラーハンドリング用のユーティリティ
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * 共通のfetch wrapper
 * 実際のAPI実装時に使用
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${apiConfig.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...apiConfig.getAuthHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API request failed:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Unknown API error"
    );
  }
}
