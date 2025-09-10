/**
 * フローティングアクションボタンコンポーネント
 *
 * 画面右下に固定で表示される手動追加・音声追加ボタン
 * モバイル・デスクトップ両対応
 */

"use client";

import React, { useState } from "react";
import TaskCreateDialog, {
  TaskDraft,
} from "@/components/tasks/TaskCreateDialog";
import { useAppStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { formatJapaneseDate } from "@/utils/date";
import { generateTaskId } from "@/services/taskService";

export default function FloatingActionButtons() {
  const { selectedDate, addTask } = useAppStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);

  /**
   * タスク作成処理
   * TaskDraftをTask型に変換してストアに保存
   */
  const handleTaskCreate = (draft: TaskDraft) => {
    const task: Task = {
      id: generateTaskId(),
      title: draft.title,
      date: draft.dueAt ? draft.dueAt.split("T")[0] : selectedDate,
      time: draft.dueAt
        ? draft.dueAt.split("T")[1]?.substring(0, 5)
        : undefined,
      priority: draft.importance,
      duration: draft.estimatedMinutes || undefined,
      tags: draft.tags,
      status: "未完了",
    };

    addTask(task);
  };

  /**
   * 音声追加処理（将来実装）
   */
  const handleVoiceAdd = () => {
    // TODO: 音声認識機能の実装
    console.log("音声追加機能は将来実装予定");
    alert("音声追加機能は将来実装予定です");
  };

  return (
    <>
      {/* フローティングアクションボタン群 */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-row gap-3 sm:flex-col">
        {/* 音声追加ボタン（スマホ：左、デスクトップ：上） */}
        <button
          onClick={handleVoiceAdd}
          className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 active:scale-95"
          aria-label="音声でタスクを追加"
          title="音声でタスクを追加"
        >
          {/* マイクアイコン */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>

        {/* 手動追加ボタン（スマホ：右、デスクトップ：下） */}
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center justify-center w-14 h-14 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 hover:shadow-xl transition-all duration-200 active:scale-95"
          aria-label="手動でタスクを追加"
          title="手動でタスクを追加"
        >
          {/* 手のアイコン（編集アイコンを手の代わりに使用） */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>

      {/* タスク作成ダイアログ */}
      <TaskCreateDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={(draft) => {
          handleTaskCreate(draft);
          setShowCreateDialog(false);
        }}
      />
    </>
  );
}
