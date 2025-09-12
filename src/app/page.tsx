/**
 * ホームページコンポーネント
 *
 * アプリケーションのメインページ
 * タスク一覧、フィルタ、作成機能を提供
 */

"use client";
import AppHeader from "@/components/layout/AppHeader";
import SidePanel from "@/components/layout/SidePanel";
import FilterBar from "@/components/filters/FilterBar";
import TaskList from "@/components/tasks/TaskList";
import FloatingActionButtons from "@/components/common/FloatingActionButtons";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAppStore } from "@/lib/store";
import { formatJapaneseDate } from "@/utils/date";

export default function HomePage() {
  const { selectedDate, viewMode } = useAppStore();

  return (
    <AuthGuard>
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
            </div>

            {/* フィルタ＆アクション */}
            <FilterBar />

            {/* タスクリスト */}
            <TaskList />
          </section>
        </div>
      </div>

      {/* フローティングアクションボタン */}
      <FloatingActionButtons />
    </AuthGuard>
  );
}
