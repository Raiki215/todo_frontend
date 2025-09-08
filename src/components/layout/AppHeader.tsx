"use client";

/**
 * 1440でも余白が気になりにくいフルイド幅。
 * 検索やアイコンは入れず、「通知」ボタンを右上に設置。
 */
export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto w-[clamp(1040px,92vw,1400px)] px-4 sm:px-6 xl:px-8">
        <div className="h-14 flex items-center justify-between gap-4">
          {/* 左：ロゴ + 今日へ戻る */}
          <div className="flex items-center gap-6">
            <div className="text-2xl font-extrabold tracking-wide select-none">
              <span className="inline-block -skew-x-6">TaskFlow</span>
            </div>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              今日へ戻る
            </button>
          </div>

          {/* 右：通知ボタン（アイコンなし・テキスト） */}
          <div className="flex items-center gap-5">
            <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
              通知
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
