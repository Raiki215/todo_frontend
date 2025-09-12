/**
 * モックタスクデータ
 *
 * 本番環境では削除予定。
 * バックエンドAPI実装時に置き換えられる。
 */

import type { Task } from "@/lib/types";
import { todayStr } from "@/utils/date";

/**
 * 指定された日数だけ現在日付からオフセットした日付文字列を生成
 * @param deltaDays - オフセット日数（正の値で未来、負の値で過去）
 * @returns YYYY-MM-DD形式の日付文字列
 */
function formatDateOffset(deltaDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + deltaDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 開発・テスト用のサンプルタスクデータ
 * 本番環境では削除予定
 */
export const mockTasks: Task[] = [];
