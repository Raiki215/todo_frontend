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
export const mockTasks: Task[] = [
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
    date: formatDateOffset(1),
    priority: 2,
    status: "未完了",
    duration: 45,
    tags: ["生活"],
  },
  {
    id: "e",
    title: "レビュー",
    date: formatDateOffset(2),
    priority: 4,
    status: "未完了",
    duration: 30,
    tags: ["仕事"],
  },
  {
    id: "f",
    title: "学習",
    date: formatDateOffset(5),
    priority: 1,
    status: "未完了",
    duration: 90,
    tags: ["勉強"],
  },
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
    date: formatDateOffset(1),
    time: "21:00",
    priority: 3,
    status: "未完了",
    duration: 45,
    tags: ["趣味"],
  },
  {
    id: "k",
    title: "システム設計",
    date: formatDateOffset(1),
    time: "09:00",
    priority: 5,
    status: "未完了",
    duration: 240,
    tags: ["仕事", "技術"],
  },
  {
    id: "l",
    title: "病院予約",
    date: formatDateOffset(3),
    time: "16:00",
    priority: 4,
    status: "未完了",
    duration: 120,
    tags: ["健康"],
  },
  {
    id: "m",
    title: "英語学習",
    date: formatDateOffset(4),
    time: "18:00",
    priority: 3,
    status: "未完了",
    duration: 60,
    tags: ["勉強"],
  },
  {
    id: "n",
    title: "コード修正",
    date: formatDateOffset(-1),
    time: "13:00",
    priority: 5,
    status: "未完了",
    duration: 90,
    tags: ["仕事", "技術"],
  },
  {
    id: "o",
    title: "掃除",
    date: formatDateOffset(6),
    time: "10:00",
    priority: 2,
    status: "未完了",
    duration: 90,
    tags: ["生活"],
  },
];
