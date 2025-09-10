/**
 * タスクメタ情報表示コンポーネント
 * 
 * 残り時間、実行時刻、優先度、予想時間を表示
 * 完了状態と期限切れ状態に応じてスタイルを変更
 */

"use client";

interface TaskMetaProps {
  /** タスクが完了済みかどうか */
  isCompleted: boolean;
  /** 残り時間の文字列 */
  timeRemaining: string;
  /** 期限切れかどうか */
  isOverdue: boolean;
  /** 実行予定時刻 */
  time?: string;
  /** 優先度（1-5） */
  priority: number;
  /** 予想時間（分） */
  duration?: number;
}

/**
 * タスクメタ情報
 * 時間、優先度、期間などの情報を表示
 */
export default function TaskMeta({ 
  isCompleted, 
  timeRemaining, 
  isOverdue, 
  time, 
  priority, 
  duration 
}: TaskMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
      {/* 完了状態または残り時間 */}
      {isCompleted ? (
        <span className="font-bold text-green-600">完了</span>
      ) : (
        <span
          className={`font-bold ${
            isOverdue ? "text-red-600" : "text-blue-600"
          }`}
        >
          {isOverdue ? timeRemaining : `残り${timeRemaining}`}
        </span>
      )}
      
      {/* 実行時刻 */}
      {time && <span>{time}</span>}
      
      {/* 優先度（星マーク） */}
      <span>{"⭐️".repeat(priority)}</span>
      
      {/* 予想時間 */}
      {duration && <span>{duration}分</span>}
    </div>
  );
}
