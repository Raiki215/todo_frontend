// src/app/page.tsx
"use client";
import { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import SidePanel from "@/components/layout/SidePanel";
import FilterBar from "@/components/filters/FilterBar";
import TaskList from "@/components/tasks/TaskList";
import TaskCreateDialog, {
  TaskDraft,
} from "@/components/tasks/TaskCreateDialog";
import { useTaskStore } from "@/lib/store";
import type { Task } from "@/lib/types";

// 日付を日本語形式でフォーマットする関数
function formatJapaneseDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[date.getDay()];

  return `${year}年${month}月${day}日${weekday}曜日`;
}

export default function HomePage() {
  const { selectedDate, viewMode, add } = useTaskStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // TaskDraftをTask型に変換して保存
  const handleTaskCreate = (draft: TaskDraft) => {
    const uid = () =>
      globalThis.crypto?.randomUUID?.() ??
      `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const task: Task = {
      id: uid(),
      title: draft.title,
      date: draft.dueAt ? draft.dueAt.split("T")[0] : selectedDate, // dueAtがあればその日付、なければ選択された日付
      time: draft.dueAt
        ? draft.dueAt.split("T")[1]?.substring(0, 5)
        : undefined,
      priority: draft.importance,
      duration: draft.estimatedMinutes || undefined,
      tags: draft.tags,
      status: "未完了",
    };

    add(task);
  };

  return (
    <>
      <AppHeader />

      <div className="mx-auto w-full md:w-[clamp(720px,92vw,1400px)] lg:w-[clamp(1040px,92vw,1400px)] px-4 sm:px-6 xl:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 sm:gap-6 xl:gap-8">
          {/* 左ペイン：デスクトップのみ */}
          <div className="hidden lg:block">
            <SidePanel />
          </div>

          {/* 右メイン */}
          <section className="space-y-4">
            {/* タイトル行：PC版では右側にボタンを配置 */}
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

            {/* フィルタ＆アクション（内部でモバイル最適化） */}
            <FilterBar />

            {/* タスクリスト（既存のカードでOK） */}
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
