/**
 * タスク管理関連のビジネスロジック
 *
 * タスクのCRUD操作、フィルタリング、ソート処理など
 * バックエンドAPI実装時にこのレイヤーを通してAPIコールを行う
 */

import type { Task } from "@/lib/types";
import { calcImportance } from "@/utils/taskUtils";

/**
 * ユニークなタスクIDを生成
 * @returns ユニークなタスクID
 */
export function generateTaskId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );
}

/**
 * タスクを重要度順にソート
 * @param tasks - ソート対象のタスク配列
 * @returns 重要度順にソートされたタスク配列
 */
export function sortTasksByImportance(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => calcImportance(b) - calcImportance(a));
}

/**
 * タスクを作成日順にソート
 * @param tasks - ソート対象のタスク配列
 * @returns 作成日順（新しい順）にソートされたタスク配列
 */
export function sortTasksByDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // 日付が同じ場合は時刻で比較
    if (a.date === b.date) {
      const timeA = a.time || "00:00";
      const timeB = b.time || "00:00";
      return timeA.localeCompare(timeB);
    }
    return a.date.localeCompare(b.date);
  });
}

/**
 * 指定された日付のタスクをフィルタリング
 * @param tasks - フィルタ対象のタスク配列
 * @param date - 対象日付 (YYYY-MM-DD)
 * @returns 指定日付のタスク配列
 */
export function filterTasksByDate(tasks: Task[], date: string): Task[] {
  return tasks.filter((task) => task.date === date);
}

/**
 * 指定された週のタスクをフィルタリング
 * @param tasks - フィルタ対象のタスク配列
 * @param weekDates - 週の日付配列
 * @returns 指定週のタスク配列
 */
export function filterTasksByWeek(tasks: Task[], weekDates: string[]): Task[] {
  return tasks.filter((task) => weekDates.includes(task.date));
}

/**
 * ステータスでタスクをフィルタリング
 * @param tasks - フィルタ対象のタスク配列
 * @param status - フィルタするステータス
 * @returns フィルタされたタスク配列
 */
export function filterTasksByStatus(
  tasks: Task[],
  status: Task["status"]
): Task[] {
  return tasks.filter((task) => task.status === status);
}

/**
 * タグでタスクをフィルタリング
 * @param tasks - フィルタ対象のタスク配列
 * @param tag - フィルタするタグ
 * @returns フィルタされたタスク配列
 */
export function filterTasksByTag(tasks: Task[], tag: string): Task[] {
  return tasks.filter((task) => task.tags?.includes(tag));
}

/**
 * 優先度でタスクをフィルタリング
 * @param tasks - フィルタ対象のタスク配列
 * @param minPriority - 最小優先度
 * @param maxPriority - 最大優先度
 * @returns フィルタされたタスク配列
 */
export function filterTasksByPriority(
  tasks: Task[],
  minPriority: number,
  maxPriority: number
): Task[] {
  return tasks.filter(
    (task) => task.priority >= minPriority && task.priority <= maxPriority
  );
}

/**
 * タスクを完了に変更
 * @param task - 対象タスク
 * @returns 完了状態に更新されたタスク
 */
export function completeTask(task: Task): Task {
  return { ...task, status: "完了" };
}

/**
 * タスクを未完了に変更
 * @param task - 対象タスク
 * @returns 未完了状態に更新されたタスク
 */
export function uncompleteTask(task: Task): Task {
  return { ...task, status: "未完了" };
}

/**
 * タスクを翌日に移動
 * @param task - 対象タスク
 * @returns 翌日に移動されたタスク
 */
export function moveTaskToTomorrow(task: Task): Task {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  return { ...task, date: tomorrowStr };
}

/**
 * 期限切れタスクを取得
 * @param tasks - 対象タスク配列
 * @returns 期限切れのタスク配列
 */
export function getOverdueTasks(tasks: Task[]): Task[] {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  return tasks.filter((task) => {
    if (task.status === "完了") return false;

    const taskDate = new Date(task.date);
    if (task.time) {
      const [hours, minutes] = task.time.split(":").map(Number);
      taskDate.setHours(hours, minutes);
    } else {
      taskDate.setHours(23, 59);
    }

    return taskDate < today;
  });
}
