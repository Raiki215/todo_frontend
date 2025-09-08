// src/app/page.tsx
import AppHeader from "@/components/layout/AppHeader";
import SidePanel from "@/components/layout/SidePanel";
import FilterBar from "@/components/filters/FilterBar";
import TaskList from "@/components/tasks/TaskList";

export default function HomePage() {
  return (
    <>
      <AppHeader />

      <div className="mx-auto w-full md:w-[clamp(720px,92vw,1400px)] lg:w-[clamp(1040px,92vw,1400px)] px-4 sm:px-6 xl:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 sm:gap-6 xl:gap-8">
          {/* 左ペイン：デスクトップのみ */}
          <div className="hidden lg:block">
            <SidePanel />
          </div>

          {/* 右メイン */}
          <section className="space-y-4">
            {/* タイトル */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              2025年9月8日月曜日のタスク
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
