import MiniCalendar from "@/components/calendar/MiniCalendar";

export default function SidePanel() {
  return (
    <aside className="space-y-4">
      {/* カレンダー（白背景） */}
      <MiniCalendar />

      {/* 優先度の高いタスク（ダミー） */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          優先度の高いタスク
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
            <div className="text-sm text-gray-700 truncate">
              プレゼンテーション資料の作成
            </div>
            <div className="text-xs text-gray-500">⭐️⭐️⭐️⭐️</div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
            <div className="text-sm text-gray-700 truncate">運動</div>
            <div className="text-xs text-gray-500">⭐️⭐️⭐️</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
