// src/app/page.tsx
"use client";
import AppHeader from "@/components/layout/AppHeader";
import SidePanel from "@/components/layout/SidePanel";
import FilterBar from "@/components/filters/FilterBar";
import TaskList from "@/components/tasks/TaskList";
import { useTaskStore } from "@/lib/store";

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
  const { selectedDate } = useTaskStore();

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
            {/* タイトル：選択された日付を動的に表示 */}
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
              {formatJapaneseDate(selectedDate)}のタスク
            </h1>

            {/* フィルタ＆アクション（内部でモバイル最適化） */}
            <FilterBar />

            {/* タスクリスト（既存のカードでOK） */}
            <TaskList />
          </section>
        </div>
      </div>
    </>
  );
}
