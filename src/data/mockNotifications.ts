/**
 * モック通知データ
 *
 * 開発・テスト用の通知データを提供
 * 本番環境では削除予定。バックエンドAPI実装時に置き換えられる。
 */

import type { Notification } from "@/lib/types";

/**
 * 開発・テスト用のサンプル通知データ
 * 実際の通知システムでは動的に生成される
 */
export const createMockNotifications = (): Notification[] => [
  {
    id: "notification-1",
    type: "30min-warning",
    task: {
      id: "mock-task-1",
      title: "重要な会議の準備",
      date: "2025-09-10",
      time: "14:30",
      priority: 5,
      status: "未完了",
    },
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5分前に作成
    message: "30分前です",
    isRead: false,
  },
  {
    id: "notification-2",
    type: "overdue",
    task: {
      id: "mock-task-2",
      title: "レポート提出",
      date: "2025-09-09",
      time: "23:59",
      priority: 4,
      status: "未完了",
    },
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1時間前に作成
    message: "期限切れ",
    isRead: true,
  },
  {
    id: "notification-3",
    type: "30min-warning",
    task: {
      id: "mock-task-3",
      title: "プレゼンテーション",
      date: "2025-09-10",
      time: "16:00",
      priority: 3,
      status: "未完了",
    },
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2分前に作成
    message: "30分前です",
    isRead: false,
  },
];
