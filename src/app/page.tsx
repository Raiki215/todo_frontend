import AppHeader from "@/components/layout/AppHeader";
import SidePanel from "@/components/layout/SidePanel";
import FilterBar from "@/components/filters/FilterBar";
import TaskList from "@/components/tasks/TaskList";

export default function HomePage() {
  return (
    <>
      <AppHeader />

      <div className="mx-auto w-[clamp(1040px,92vw,1400px)] px-4 sm:px-6 xl:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-4 sm:gap-6 xl:gap-8">
          {/* 左ペイン（白背景のカレンダー＋優先度高タスク） */}
          <SidePanel />

          {/* 右メイン（上部は白い箱で囲わない） */}
          <section className="space-y-4">
            {/* タイトル + フィルタ（白枠なし） */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-800">
                2025年9月8日月曜日のタスク
              </h1>
              <FilterBar />
            </div>

            {/* タスクリスト（縦バー付きカード） */}
            <TaskList />
          </section>
        </div>
      </div>
    </>
  );
}
