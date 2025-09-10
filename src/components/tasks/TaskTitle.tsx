/**
 * タスクタイトル表示コンポーネント
 *
 * タスクのタイトルを表示し、完了状態に応じて取り消し線を適用
 */

"use client";

interface TaskTitleProps {
  /** タスクのタイトル */
  title: string;
  /** タスクが完了済みかどうか */
  isCompleted: boolean;
}

/**
 * タスクタイトル
 * 完了時に取り消し線とグレーアウト効果を適用
 */
export default function TaskTitle({ title, isCompleted }: TaskTitleProps) {
  return (
    <div
      className={`font-semibold ${
        isCompleted ? "line-through text-gray-400" : "text-gray-800"
      }`}
    >
      {title}
    </div>
  );
}
