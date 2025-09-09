import React, { useState } from "react";
import { priorityBarClass } from "@/lib/constants";
import { calculateTimeRemaining } from "@/lib/date";
import { useTaskStore } from "@/lib/store";
import KebabMenu from "./KebabMenu";

// グラデーション風の発光アニメーション
const glowAnimation = `
  @keyframes glowPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(253, 224, 71, 0.4),
                  0 0 8px 0 rgba(253, 224, 71, 0.2);
    }
    25% {
      box-shadow: 0 0 0 2px rgba(253, 224, 71, 0.6),
                  0 0 16px 4px rgba(253, 224, 71, 0.3);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(253, 224, 71, 0.8),
                  0 0 24px 8px rgba(253, 224, 71, 0.4);
    }
    75% {
      box-shadow: 0 0 0 2px rgba(253, 224, 71, 0.6),
                  0 0 16px 4px rgba(253, 224, 71, 0.3);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(253, 224, 71, 0.4),
                  0 0 8px 0 rgba(253, 224, 71, 0.2);
    }
  }
`;

/**
 * 見た目用のタスクカード。
 * 左端に優先度カラーの縦バーを表示。
 */
export default function TaskCard({
  id,
  title,
  time,
  priority = 3,
  duration,
  tags,
  highlight,
  date,
}: {
  id: string;
  title: string;
  time?: string;
  priority?: number; // 1..5
  duration?: number;
  tags?: string[];
  highlight?: boolean;
  date: string; // 残り時間計算のために必要
}) {
  const [checked, setChecked] = React.useState(false);
  const {
    delete: deleteTask,
    update: updateTask,
    moveToTomorrow,
  } = useTaskStore();

  // 残り時間を計算
  const timeRemaining = calculateTimeRemaining(date, time);

  // 期限切れかどうかを判定
  const isOverdue = timeRemaining === "期限切れ";

  // メニューハンドラー
  const handleEdit = () => {
    // TODO: 編集ダイアログを開く処理
    console.log("編集:", title);
  };

  const handleDelete = () => {
    if (confirm(`「${title}」を削除しますか？`)) {
      deleteTask(id);
    }
  };

  const handleMoveToTomorrow = () => {
    moveToTomorrow(id);
  };

  const highlightStyle = highlight
    ? {
        animation: "glowPulse 2s ease-in-out",
      }
    : {};

  return (
    <>
      {highlight && <style>{glowAnimation}</style>}
      <div
        className={`relative p-4 bg-white border border-gray-200 shadow-sm rounded-2xl`}
        style={highlightStyle}
      >
        {/* 優先度バー（完了時は灰色） */}
        <div
          className={`absolute left-0 top-0 h-full w-1.5 ${
            checked ? "bg-gray-400" : priorityBarClass(priority)
          }`}
          aria-hidden
        />
        <div className="flex items-start justify-between gap-3 pl-2">
          <div className="flex-1">
            {/* タイトル行：チェックボックスを先頭に配置 */}
            <div className="flex items-center gap-3 mb-2">
              <input
                type="checkbox"
                className="flex-shrink-0 w-5 h-5 border-gray-300 rounded accent-green-300"
                checked={checked}
                onChange={() => setChecked(!checked)}
                style={checked ? { accentColor: "#86efac" } : {}}
              />
              <div
                className={`font-semibold ${
                  checked ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {title}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              {/* 完了時は「完了」と緑文字、未完了時は残り時間を表示 */}
              {checked ? (
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
              {time && <span>{time}</span>}
              <span>{"⭐️".repeat(priority ?? 3)}</span>
              {duration && <span>{duration}分</span>}
            </div>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <KebabMenu
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMoveToTomorrow={handleMoveToTomorrow}
            />
          </div>
        </div>
      </div>
    </>
  );
}
