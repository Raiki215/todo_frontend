// lib/types.ts
export type Status = "未完了" | "完了" | "キャンセル";

export interface Task {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD（表示用の日付）
  time?: string; // HH:mm（任意）
  priority: number; // 1..5
  status: Status;
  duration?: number; // 所要時間（分）
  tags?: string[]; // タグ
}

export type NotificationType = "30min-warning" | "overdue";

export interface Notification {
  id: string;
  type: NotificationType;
  task: Task;
  timestamp: Date;
  message: string;
  isRead: boolean;
}

export function calcImportance(task: Task): number {
  const today = new Date();
  const due = new Date(task.date);
  const daysLeft = Math.floor(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  let deadlineFactor = 1.0;
  if (daysLeft < 0) deadlineFactor = 2.0;
  else if (daysLeft === 0) deadlineFactor = 1.5;
  else if (daysLeft === 1) deadlineFactor = 1.2;
  else if (daysLeft === 2) deadlineFactor = 1.1;
  // それ以降は1.0
  return task.priority * deadlineFactor;
}
