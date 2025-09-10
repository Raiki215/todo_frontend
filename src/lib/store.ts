// lib/store.ts
"use client";
import { create } from "zustand";
import type { Task, Notification } from "./types";
import { todayStr } from "./date";

type State = {
  selectedDate: string;
  tasks: Task[];
  highlightTaskId: string | null;
  viewMode: "day" | "week"; // 表示モード
  notifications: Notification[];
  unreadCount: number;
  setDate: (d: string) => void;
  setHighlightTaskId: (id: string | null) => void;
  setViewMode: (mode: "day" | "week") => void;
  add: (task: Task) => void; // タスクを追加する関数
  delete: (taskId: string) => void; // タスクを削除する関数
  update: (taskId: string, updates: Partial<Task>) => void; // タスクを更新する関数
  moveToTomorrow: (taskId: string) => void; // タスクを翌日に移動する関数
  // 通知関連のアクション
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  updateUnreadCount: () => void;
};

const seed: Task[] = [
  {
    id: "a",
    title: "資料作成",
    date: todayStr(),
    time: "15:00",
    priority: 5,
    status: "未完了",
    duration: 120,
    tags: ["仕事"],
  },
  {
    id: "b",
    title: "運動",
    date: todayStr(),
    time: "19:30",
    priority: 4,
    status: "未完了",
    duration: 60,
    tags: ["健康"],
  },
  {
    id: "c",
    title: "メール",
    date: todayStr(),
    time: "11:30",
    priority: 3,
    status: "未完了",
    duration: 15,
    tags: ["仕事"],
  },
  {
    id: "d",
    title: "買い物",
    date: fmtOffset(1),
    priority: 2,
    status: "未完了",
    duration: 45,
    tags: ["生活"],
  },
  {
    id: "e",
    title: "レビュー",
    date: fmtOffset(2),
    priority: 4,
    status: "未完了",
    duration: 30,
    tags: ["仕事"],
  },
  {
    id: "f",
    title: "学習",
    date: fmtOffset(5),
    priority: 1,
    status: "未完了",
    duration: 90,
    tags: ["勉強"],
  },
  // 追加のテストデータ
  {
    id: "g",
    title: "プレゼン準備",
    date: todayStr(),
    time: "10:00",
    priority: 5,
    status: "未完了",
    duration: 180,
    tags: ["仕事", "重要"],
  },
  {
    id: "h",
    title: "会議参加",
    date: todayStr(),
    time: "14:00",
    priority: 4,
    status: "未完了",
    duration: 90,
    tags: ["仕事"],
  },
  {
    id: "i",
    title: "家事",
    date: todayStr(),
    time: "20:00",
    priority: 2,
    status: "未完了",
    duration: 60,
    tags: ["生活"],
  },
  {
    id: "j",
    title: "読書",
    date: fmtOffset(1),
    time: "21:00",
    priority: 3,
    status: "未完了",
    duration: 45,
    tags: ["趣味"],
  },
  {
    id: "k",
    title: "システム設計",
    date: fmtOffset(1),
    time: "09:00",
    priority: 5,
    status: "未完了",
    duration: 240,
    tags: ["仕事", "技術"],
  },
  {
    id: "l",
    title: "病院予約",
    date: fmtOffset(3),
    time: "16:00",
    priority: 4,
    status: "未完了",
    duration: 120,
    tags: ["健康"],
  },
  {
    id: "m",
    title: "英語学習",
    date: fmtOffset(4),
    time: "18:00",
    priority: 3,
    status: "未完了",
    duration: 60,
    tags: ["勉強"],
  },
  {
    id: "n",
    title: "コード修正",
    date: fmtOffset(-1),
    time: "13:00",
    priority: 5,
    status: "未完了",
    duration: 90,
    tags: ["仕事", "技術"],
  },
  {
    id: "o",
    title: "掃除",
    date: fmtOffset(6),
    time: "10:00",
    priority: 2,
    status: "未完了",
    duration: 90,
    tags: ["生活"],
  },
];

function fmtOffset(deltaDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + deltaDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 仮の通知データ（テスト用）
const createDummyNotifications = (): Notification[] => [
  {
    id: "dummy-1",
    type: "30min-warning",
    task: {
      id: "dummy-task-1",
      title: "重要な会議の準備",
      date: "2025-09-10",
      time: "14:30",
      priority: 5,
      status: "未完了"
    },
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5分前
    message: "30分前です",
    isRead: false
  },
  {
    id: "dummy-2", 
    type: "overdue",
    task: {
      id: "dummy-task-2",
      title: "レポート提出",
      date: "2025-09-09",
      time: "23:59",
      priority: 4,
      status: "未完了"
    },
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1時間前
    message: "期限切れ",
    isRead: true
  },
  {
    id: "dummy-3",
    type: "30min-warning", 
    task: {
      id: "dummy-task-3",
      title: "プレゼンテーション",
      date: "2025-09-10",
      time: "16:00",
      priority: 3,
      status: "未完了"
    },
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2分前
    message: "30分前です",
    isRead: false
  }
];

export const useTaskStore = create<State>((set, get) => {
  const initialNotifications = createDummyNotifications();
  const initialUnreadCount = initialNotifications.filter(n => !n.isRead).length;
  
  return {
    selectedDate: todayStr(),
    tasks: seed,
    highlightTaskId: null,
    viewMode: "day", // デフォルトは日表示
    notifications: initialNotifications,
    unreadCount: initialUnreadCount,
  setDate: (d) => set({ selectedDate: d }),
  setHighlightTaskId: (id) => set({ highlightTaskId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  add: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  delete: (taskId) => set((state) => ({ 
    tasks: state.tasks.filter(task => task.id !== taskId) 
  })),
  update: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    )
  })),
  moveToTomorrow: (taskId) => set((state) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    return {
      tasks: state.tasks.map(task => 
        task.id === taskId ? { ...task, date: tomorrowStr } : task
      )
    };
  }),
  // 通知関連のアクション
  addNotification: (notification) => set((state) => {
    // 同じタスクの同じ種類の通知は重複させない
    const exists = state.notifications.some(n => 
      n.task.id === notification.task.id && n.type === notification.type
    );
    if (exists) return state;
    
    const updated = [...state.notifications, notification];
    // 最新10件のみ保持
    const newNotifications = updated.slice(-10);
    
    return {
      notifications: newNotifications,
      unreadCount: newNotifications.filter(n => !n.isRead).length
    };
  }),
  removeNotification: (id) => set((state) => {
    const newNotifications = state.notifications.filter(n => n.id !== id);
    return {
      notifications: newNotifications,
      unreadCount: newNotifications.filter(n => !n.isRead).length
    };
  }),
  markAsRead: (id) => set((state) => {
    console.log("Store markAsRead called for:", id);
    const newNotifications = state.notifications.map(n => {
      if (n.id === id) {
        console.log(`通知 ${n.task.title} を既読に変更: ${n.isRead} -> true`);
        return { ...n, isRead: true };
      }
      return n;
    });
    console.log("Store markAsRead - updated notifications:", newNotifications.map(n => ({ title: n.task.title, isRead: n.isRead })));
    
    const newUnreadCount = newNotifications.filter(n => !n.isRead).length;
    console.log("Store markAsRead - new unread count:", newUnreadCount);
    
    return {
      notifications: newNotifications,
      unreadCount: newUnreadCount
    };
  }),
  clearAllNotifications: () => set({
    notifications: [],
    unreadCount: 0
  }),
  updateUnreadCount: () => set((state) => ({
    unreadCount: state.notifications.filter(n => !n.isRead).length
  }))
  };
});
