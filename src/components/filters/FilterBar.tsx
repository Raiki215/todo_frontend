// src/components/filters/FilterBar.tsx
export default function FilterBar() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* モバイル：ボタンを先に、デスクトップ：右側へ */}
      <div className="order-1 lg:order-none grid grid-cols-1 sm:grid-cols-2 gap-2 w-full lg:w-auto">
        <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-blue-700">
          音声で追加
        </button>
        <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm text-white shadow-sm hover:bg-gray-900">
          手入力で追加
        </button>
      </div>

      {/* セレクト群 */}
      <div className="order-2 lg:order-none grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
        <label className="text-sm text-gray-600">
          タグ:
          <select className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm">
            <option>すべて</option>
            <option>仕事</option>
            <option>重要</option>
            <option>健康</option>
          </select>
        </label>
        <label className="text-sm text-gray-600">
          状態:
          <select className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm">
            <option>すべて</option>
            <option>未完了</option>
            <option>完了</option>
            <option>キャンセル</option>
          </select>
        </label>
        <label className="text-sm text-gray-600">
          モード:
          <select className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm">
            <option>すべて</option>
            <option>通常</option>
          </select>
        </label>
      </div>

      {/* 日/週 切替（必要なら残す） */}
      <div className="order-3 lg:order-none flex items-center gap-2">
        <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">
          日表示
        </button>
        <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
          週表示
        </button>
      </div>
    </div>
  );
}
