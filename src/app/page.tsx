/**
 * ホームページコンポーネント
 *
 * アプリケーションのメインページ
 * タスク一覧、フィルタ、作成機能を提供
 */

"use client";
import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import SidePanel from "@/components/layout/SidePanel";
import FilterBar from "@/components/filters/FilterBar";
import TaskList from "@/components/tasks/TaskList";
import TaskCreateDialog, {
  TaskDraft,
} from "@/components/tasks/TaskCreateDialog";
import { useAppStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { formatJapaneseDate } from "@/utils/date";
import { generateTaskId } from "@/services/taskService";

export default function HomePage() {
  const { selectedDate, viewMode, addTask } = useAppStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

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

  return (
    <>
      {/* ヘッダー */}
      <AppHeader />

      {/* メインコンテンツ */}
      <div className="mx-auto w-full md:w-[clamp(720px,92vw,1400px)] lg:w-[clamp(1040px,92vw,1400px)] px-4 sm:px-6 xl:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 sm:gap-6 xl:gap-8">
          {/* 左ペイン：デスクトップのみ表示 */}
          <div className="hidden lg:block">
            <SidePanel />
          </div>

          {/* 右メイン */}
          <section className="space-y-4">
            {/* タイトル行 */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* タイトル：選択された日付を動的に表示 */}
              <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                {viewMode === "week"
                  ? `${formatJapaneseDate(selectedDate)}からの週のタスク`
                  : `${formatJapaneseDate(selectedDate)}のタスク`}
              </h1>

              {/* PC版：追加ボタンを右側に配置 */}
              <div className="items-center hidden gap-3 lg:flex">
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 whitespace-nowrap">
                  音声で追加
                </button>
                <button
                  onClick={() => setShowCreateDialog(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-sm hover:bg-gray-900 whitespace-nowrap"
                >
                  手動で追加
                </button>
              </div>
            </div>

            {/* フィルタ＆アクション */}
            <FilterBar />

            {/* タスクリスト */}
            <TaskList />
          </section>
        </div>
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
