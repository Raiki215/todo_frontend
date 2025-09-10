/**
 * タスクのチェックボックスコンポーネント
 *
 * タスクの完了/未完了状態を管理するチェックボックス
 * 完了時に視覚的なフィードバックを提供
 */

"use client";

import { ChangeEvent } from "react";

interface TaskCheckboxProps {
  /** チェックボックスの選択状態 */
  checked: boolean;
  /** チェック状態変更時のコールバック */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** タスクID（アクセシビリティ用） */
  taskId: string;
}

/**
 * タスクチェックボックス
 * 完了時にグリーンのアクセントカラーで表示
 */
export default function TaskCheckbox({
  checked,
  onChange,
  taskId,
}: TaskCheckboxProps) {
  return (
    <input
      type="checkbox"
      id={`task-checkbox-${taskId}`}
      className="flex-shrink-0 w-5 h-5 border-gray-300 rounded accent-green-300"
      checked={checked}
      onChange={onChange}
      style={checked ? { accentColor: "#86efac" } : {}}
      aria-label={`タスクの完了状態を変更`}
    />
  );
}
