/**
 * Zustand状態管理ストア
 *
 * アプリケーション全体の状態を管理
 * タスク、通知、UI状態を一元管理
 */

"use client";
import { create } from "zustand";
import type { Task, Notification, ViewMode } from "./types";
import { todayStr } from "@/utils/date";
import { mockTasks } from "@/data/mockTasks";
import { createMockNotifications } from "@/data/mockNotifications";

/**
 * アプリケーション状態の型定義
 */
interface AppState {
  // タスク関連の状態
  /** 現在選択されている日付 */
  selectedDate: string;
  /** 全タスクデータ */
  tasks: Task[];
  /** ハイライト対象のタスクID */
  highlightTaskId: string | null;
  /** 表示モード（日表示 or 週表示） */
  viewMode: ViewMode;

  // 通知関連の状態
  /** 全通知データ */
  notifications: Notification[];
  /** 未読通知数 */
  unreadCount: number;
  /** 通知機能の有効/無効状態 */
  notificationsEnabled: boolean;

  // アクション（タスク関連）
  /** 選択日付を変更 */
  setDate: (date: string) => void;
  /** ハイライトタスクを設定 */
  setHighlightTaskId: (id: string | null) => void;
  /** 表示モードを変更 */
  setViewMode: (mode: ViewMode) => void;
  /** タスクを追加 */
  addTask: (task: Task) => void;
  /** タスクを削除 */
  deleteTask: (taskId: string) => void;
  /** タスクを更新 */
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  /** タスクを翌日に移動 */
  moveTaskToTomorrow: (taskId: string) => void;

  // アクション（通知関連）
  /** 通知機能の有効/無効を切り替え */
  toggleNotifications: () => void;
  /** 通知を追加 */
  addNotification: (notification: Notification) => void;
  /** 通知を削除 */
  removeNotification: (id: string) => void;
  /** 通知を既読にする */
  markNotificationAsRead: (id: string) => void;
  /** 全通知をクリア */
  clearAllNotifications: () => void;
  /** 未読通知数を再計算 */
  updateUnreadCount: () => void;
}

/**
 * アプリケーション状態ストア
 * 全コンポーネントから参照可能なグローバル状態
 */
export const useAppStore = create<AppState>((set) => {
  // 初期通知データを作成
  const initialNotifications = createMockNotifications();
  const initialUnreadCount = initialNotifications.filter(
    (n) => !n.isRead
  ).length;

  return {
    // 初期状態
    selectedDate: todayStr(),
    tasks: mockTasks,
    highlightTaskId: null,
    viewMode: "day",
    notifications: initialNotifications,
    unreadCount: initialUnreadCount,
    notificationsEnabled: true, // デフォルトで通知有効

    // タスク関連のアクション
    setDate: (date) => set({ selectedDate: date }),

    setHighlightTaskId: (id) => set({ highlightTaskId: id }),

    setViewMode: (mode) => set({ viewMode: mode }),

    addTask: (task) =>
      set((state) => ({
        tasks: [...state.tasks, task],
      })),

    deleteTask: (taskId) =>
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      })),

    updateTask: (taskId, updates) =>
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      })),

    moveTaskToTomorrow: (taskId) =>
      set((state) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];

        return {
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, date: tomorrowStr } : task
          ),
        };
      }),

    // 通知関連のアクション
    toggleNotifications: () =>
      set((state) => ({
        notificationsEnabled: !state.notificationsEnabled,
      })),

    addNotification: (notification) =>
      set((state) => {
        // 同じタスクの同じ種類の通知は重複させない
        const exists = state.notifications.some(
          (n) =>
            n.task.id === notification.task.id && n.type === notification.type
        );
        if (exists) return state;

        const updatedNotifications = [...state.notifications, notification];
        // 最新10件のみ保持
        const newNotifications = updatedNotifications.slice(-10);

        return {
          notifications: newNotifications,
          unreadCount: newNotifications.filter((n) => !n.isRead).length,
        };
      }),

    removeNotification: (id) =>
      set((state) => {
        const newNotifications = state.notifications.filter((n) => n.id !== id);
        return {
          notifications: newNotifications,
          unreadCount: newNotifications.filter((n) => !n.isRead).length,
        };
      }),

    markNotificationAsRead: (id) =>
      set((state) => {
        console.log("Store markNotificationAsRead called for:", id);
        const newNotifications = state.notifications.map((n) => {
          if (n.id === id) {
            console.log(
              `通知 ${n.task.title} を既読に変更: ${n.isRead} -> true`
            );
            return { ...n, isRead: true };
          }
          return n;
        });
        console.log(
          "Store markNotificationAsRead - updated notifications:",
          newNotifications.map((n) => ({
            title: n.task.title,
            isRead: n.isRead,
          }))
        );

        const newUnreadCount = newNotifications.filter((n) => !n.isRead).length;
        console.log(
          "Store markNotificationAsRead - new unread count:",
          newUnreadCount
        );

        return {
          notifications: newNotifications,
          unreadCount: newUnreadCount,
        };
      }),

    clearAllNotifications: () =>
      set({
        notifications: [],
        unreadCount: 0,
      }),

    updateUnreadCount: () =>
      set((state) => ({
        unreadCount: state.notifications.filter((n) => !n.isRead).length,
      })),
  };
});

/**
 * 後方互換性のためのエイリアス
 * 既存コードの段階的移行用
 * @deprecated useAppStore を使用してください
 */
export const useTaskStore = useAppStore;
