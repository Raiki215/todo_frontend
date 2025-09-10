/**
 * タスク関連のユーティリティ関数
 *
 * タスクの重要度計算、バリデーション、変換処理など
 */

import type { Task } from "@/lib/types";

/**
 * タスクの重要度を計算
 * 優先度と期限の近さを考慮して重要度を算出
 * @param task - 対象タスク
 * @returns 計算された重要度（数値が大きいほど重要）
 */
export function calcImportance(task: Task): number {
  const today = new Date();
  const dueDate = new Date(task.date);
  const daysLeft = Math.floor(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 期限に基づく重要度係数を計算
  let deadlineFactor = 1.0;
  if (daysLeft < 0) {
    deadlineFactor = 2.0; // 期限切れ
  } else if (daysLeft === 0) {
    deadlineFactor = 1.5; // 今日が期限
  } else if (daysLeft === 1) {
    deadlineFactor = 1.2; // 明日が期限
  } else if (daysLeft === 2) {
    deadlineFactor = 1.1; // 明後日が期限
  }
  // それ以降は1.0（基本の重要度）

  return task.priority * deadlineFactor;
}

/**
 * タスクが期限切れかどうかを判定
 * @param task - 対象タスク
 * @returns 期限切れの場合true
 */
export function isTaskOverdue(task: Task): boolean {
  if (task.status === "完了") return false;

  const now = new Date();
  const taskDateTime = new Date(task.date);

  if (task.time) {
    const [hours, minutes] = task.time.split(":").map(Number);
    taskDateTime.setHours(hours, minutes, 0, 0);
  } else {
    taskDateTime.setHours(23, 59, 0, 0);
  }

  return taskDateTime < now;
}

/**
 * タスクが今日のものかどうかを判定
 * @param task - 対象タスク
 * @returns 今日のタスクの場合true
 */
export function isTaskToday(task: Task): boolean {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  return task.date === todayStr;
}

/**
 * タスクが未来のものかどうかを判定
 * @param task - 対象タスク
 * @returns 未来のタスクの場合true
 */
export function isTaskFuture(task: Task): boolean {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  return task.date > todayStr;
}

/**
 * タスクのタグから色を取得
 * @param tag - タグ名
 * @returns Tailwind CSS用のカラークラス
 */
export function getTagColor(tag: string): string {
  const colorMap: Record<string, string> = {
    仕事: "bg-blue-100 text-blue-800",
    健康: "bg-green-100 text-green-800",
    生活: "bg-gray-100 text-gray-800",
    勉強: "bg-purple-100 text-purple-800",
    趣味: "bg-pink-100 text-pink-800",
    技術: "bg-indigo-100 text-indigo-800",
    重要: "bg-red-100 text-red-800",
  };

  return colorMap[tag] || "bg-gray-100 text-gray-800";
}

/**
 * 優先度から色を取得
 * @param priority - 優先度 (1-5)
 * @returns Tailwind CSS用のカラークラス
 */
export function getPriorityColor(priority: number): string {
  switch (priority) {
    case 5:
      return "text-red-600";
    case 4:
      return "text-orange-600";
    case 3:
      return "text-yellow-600";
    case 2:
      return "text-blue-600";
    case 1:
    default:
      return "text-gray-600";
  }
}

/**
 * 優先度から表示ラベルを取得
 * @param priority - 優先度 (1-5)
 * @returns 優先度の表示ラベル
 */
export function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 5:
      return "最重要";
    case 4:
      return "重要";
    case 3:
      return "普通";
    case 2:
      return "低";
    case 1:
    default:
      return "最低";
  }
}

/**
 * 所要時間を読みやすい形式で表示
 * @param duration - 所要時間（分）
 * @returns 読みやすい時間表示文字列
 */
export function formatDuration(duration: number): string {
  if (duration < 60) {
    return `${duration}分`;
  }

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (minutes === 0) {
    return `${hours}時間`;
  }

  return `${hours}時間${minutes}分`;
}

/**
 * タスクの入力値をバリデート
 * @param task - バリデート対象のタスク
 * @returns バリデーション結果とエラーメッセージ
 */
export function validateTask(task: Partial<Task>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // タイトルの検証
  if (!task.title || task.title.trim().length === 0) {
    errors.push("タスクタイトルは必須です");
  } else if (task.title.length > 100) {
    errors.push("タスクタイトルは100文字以内で入力してください");
  }

  // 日付の検証
  if (!task.date) {
    errors.push("日付は必須です");
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(task.date)) {
    errors.push("日付はYYYY-MM-DD形式で入力してください");
  }

  // 時刻の検証（省略可能）
  if (task.time && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(task.time)) {
    errors.push("時刻はHH:MM形式で入力してください");
  }

  // 優先度の検証
  if (task.priority !== undefined && (task.priority < 1 || task.priority > 5)) {
    errors.push("優先度は1から5の間で入力してください");
  }

  // 所要時間の検証（省略可能）
  if (
    task.duration !== undefined &&
    (task.duration < 1 || task.duration > 1440)
  ) {
    errors.push("所要時間は1分から24時間の間で入力してください");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
