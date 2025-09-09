"use client";

import { useEffect, useState, useCallback } from "react";
import { useTaskStore } from "@/lib/store";
import type { Task } from "@/lib/types";

type NotificationType = "30min-warning" | "overdue";

type Notification = {
  id: string;
  type: NotificationType;
  task: Task;
  timestamp: Date;
  message: string;
  isRead: boolean; // 既読状態を追加
};

export function useNotifications() {
  const { tasks } = useTaskStore();
  
  // 仮の通知データ（テスト用）
  const dummyNotifications: Notification[] = [
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
  
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  // 通知許可を要求
  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  }, []);

  // 通知を表示
  const showNotification = useCallback((notification: Notification) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`TODOアプリ: ${notification.message}`, {
        body: `タスク: ${notification.task.title}\n現在時刻: ${notification.timestamp.toLocaleString('ja-JP')}`,
        icon: "/favicon.ico",
        tag: notification.id,
      });
    }
  }, []);

  // 通知を追加
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => {
      // 同じタスクの同じ種類の通知は重複させない
      const exists = prev.some(n => 
        n.task.id === notification.task.id && n.type === notification.type
      );
      if (exists) return prev;
      
      const updated = [...prev, notification];
      // 最新10件のみ保持
      return updated.slice(-10);
    });
    
    showNotification(notification);
  }, [showNotification]);

  // 通知をチェック
  const checkNotifications = useCallback(() => {
    const now = new Date();
    const currentTime = now.getTime();

    tasks.forEach(task => {
      if (task.status === "完了") return; // 完了タスクは除外

      // タスクの期限を計算
      let taskDeadline: Date | null = null;
      if (task.date) {
        taskDeadline = new Date(task.date);
        if (task.time) {
          const [hours, minutes] = task.time.split(':').map(Number);
          taskDeadline.setHours(hours, minutes, 0, 0);
        } else {
          // 時刻が指定されていない場合は23:59に設定
          taskDeadline.setHours(23, 59, 0, 0);
        }
      }

      if (!taskDeadline) return;

      const deadlineTime = taskDeadline.getTime();
      const thirtyMinutesBefore = deadlineTime - (30 * 60 * 1000); // 30分前

      // 30分前通知
      if (currentTime >= thirtyMinutesBefore && currentTime < deadlineTime && lastCheck.getTime() < thirtyMinutesBefore) {
        const notification: Notification = {
          id: `${task.id}-30min`,
          type: "30min-warning",
          task,
          timestamp: now,
          message: "30分前です",
          isRead: false,
        };
        addNotification(notification);
      }

      // 期限切れ通知
      if (currentTime >= deadlineTime && lastCheck.getTime() < deadlineTime) {
        const notification: Notification = {
          id: `${task.id}-overdue`,
          type: "overdue",
          task,
          timestamp: now,
          message: "期限切れ",
          isRead: false,
        };
        addNotification(notification);
      }
    });

    setLastCheck(now);
  }, [tasks, lastCheck, addNotification]);

  // 定期的にチェック（1分間隔）
  useEffect(() => {
    const interval = setInterval(checkNotifications, 60000); // 1分間隔
    return () => clearInterval(interval);
  }, [checkNotifications]);

  // コンポーネントマウント時に通知許可を要求
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  // 通知を削除
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // 既読にする
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }, []);

  // 全通知をクリア
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // 未読通知数を取得
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    removeNotification,
    markAsRead,
    clearAllNotifications,
    unreadCount,
    checkNotifications, // 手動チェック用
  };
}
