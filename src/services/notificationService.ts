/**
 * 通知システム関連のビジネスロジック
 *
 * 通知の生成、管理、ブラウザ通知の制御など
 * バックエンド実装時はAPI経由で通知データを取得
 */

import type { Task, Notification, NotificationType } from "@/lib/types";

/**
 * ユニークな通知IDを生成
 * @returns ユニークな通知ID
 */
export function generateNotificationId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `notification_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );
}

/**
 * ブラウザ通知の許可を要求
 * @returns 許可が得られた場合true
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("このブラウザは通知をサポートしていません");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

/**
 * ブラウザ通知を表示
 * @param notification - 表示する通知データ
 */
export function showBrowserNotification(notification: Notification): void {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const browserNotification = new Notification(
    `TaskFlow: ${notification.message}`,
    {
      body: `タスク: ${notification.task.title}\n期限: ${
        notification.task.date
      } ${notification.task.time || ""}`,
      icon: "/favicon.ico",
      tag: notification.id,
      requireInteraction: true, // ユーザーが操作するまで表示し続ける
    }
  );

  // 通知クリック時の処理
  browserNotification.onclick = () => {
    window.focus();
    browserNotification.close();
  };

  // 5秒後に自動で閉じる
  setTimeout(() => {
    browserNotification.close();
  }, 5000);
}

/**
 * タスクから30分前警告通知を生成
 * @param task - 対象タスク
 * @returns 生成された通知オブジェクト
 */
export function createWarningNotification(task: Task): Notification {
  return {
    id: generateNotificationId(),
    type: "30min-warning",
    task,
    timestamp: new Date(),
    message: "30分前です",
    isRead: false,
  };
}

/**
 * タスクから期限切れ通知を生成
 * @param task - 対象タスク
 * @returns 生成された通知オブジェクト
 */
export function createOverdueNotification(task: Task): Notification {
  return {
    id: generateNotificationId(),
    type: "overdue",
    task,
    timestamp: new Date(),
    message: "期限切れ",
    isRead: false,
  };
}

/**
 * タスクの期限をチェックして必要な通知を生成
 * @param tasks - チェック対象のタスク配列
 * @param lastCheckTime - 前回チェック時刻
 * @returns 生成された通知配列
 */
export function checkTaskDeadlines(
  tasks: Task[],
  lastCheckTime: Date
): Notification[] {
  const now = new Date();
  const notifications: Notification[] = [];

  for (const task of tasks) {
    // 完了タスクはスキップ
    if (task.status === "完了") continue;

    // タスクの期限日時を構築
    let taskDeadline: Date | null = null;
    if (task.date) {
      taskDeadline = new Date(task.date);
      if (task.time) {
        const [hours, minutes] = task.time.split(":").map(Number);
        taskDeadline.setHours(hours, minutes, 0, 0);
      } else {
        // 時刻未指定の場合は23:59に設定
        taskDeadline.setHours(23, 59, 0, 0);
      }
    }

    if (!taskDeadline) continue;

    const deadlineTime = taskDeadline.getTime();
    const currentTime = now.getTime();
    const lastCheckTimeMs = lastCheckTime.getTime();
    const thirtyMinutesBefore = deadlineTime - 30 * 60 * 1000; // 30分前

    // 30分前通知
    if (
      currentTime >= thirtyMinutesBefore &&
      currentTime < deadlineTime &&
      lastCheckTimeMs < thirtyMinutesBefore
    ) {
      notifications.push(createWarningNotification(task));
    }

    // 期限切れ通知
    if (currentTime >= deadlineTime && lastCheckTimeMs < deadlineTime) {
      notifications.push(createOverdueNotification(task));
    }
  }

  return notifications;
}

/**
 * 通知の重複を除去
 * 同じタスクの同じ種類の通知は1つだけ保持
 * @param notifications - 通知配列
 * @returns 重複除去後の通知配列
 */
export function deduplicateNotifications(
  notifications: Notification[]
): Notification[] {
  const seen = new Set<string>();
  return notifications.filter((notification) => {
    const key = `${notification.task.id}-${notification.type}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * 古い通知を削除（最新N件のみ保持）
 * @param notifications - 通知配列
 * @param maxCount - 保持する最大件数
 * @returns 件数制限後の通知配列
 */
export function limitNotificationCount(
  notifications: Notification[],
  maxCount: number = 10
): Notification[] {
  if (notifications.length <= maxCount) {
    return notifications;
  }

  // タイムスタンプでソートして最新のものを保持
  return [...notifications]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, maxCount);
}

/**
 * 未読通知数を計算
 * @param notifications - 通知配列
 * @returns 未読通知数
 */
export function countUnreadNotifications(
  notifications: Notification[]
): number {
  return notifications.filter((notification) => !notification.isRead).length;
}

/**
 * 通知タイプに基づいてアイコンを取得
 * @param type - 通知タイプ
 * @returns 通知タイプに対応するアイコン文字列
 */
export function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case "30min-warning":
      return "⚠️";
    case "overdue":
      return "🚨";
    default:
      return "📝";
  }
}

/**
 * 通知タイプに基づいてスタイルクラスを取得
 * @param type - 通知タイプ
 * @returns Tailwind CSS用のスタイルクラス
 */
export function getNotificationStyle(type: NotificationType): string {
  switch (type) {
    case "30min-warning":
      return "bg-yellow-100 text-yellow-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
}
