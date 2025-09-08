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
