/**
 * 右上のタイトル配下に並ぶフィルタ群（白い箱では囲わない）
 */
export default function FilterBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* 左：セレクト群 */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-gray-600">
          タグ:
          <select className="ml-1 rounded-lg border border-gray-300 px-2 py-1 text-sm">
            <option>すべて</option>
            <option>仕事</option>
            <option>重要</option>
            <option>健康</option>
          </select>
        </label>
        <label className="text-sm text-gray-600">
          状態:
          <select className="ml-1 rounded-lg border border-gray-300 px-2 py-1 text-sm">
            <option>すべて</option>
            <option>未完了</option>
            <option>完了</option>
            <option>キャンセル</option>
          </select>
        </label>
        <label className="text-sm text-gray-600">
          モード:
          <select className="ml-1 rounded-lg border border-gray-300 px-2 py-1 text-sm">
            <option>すべて</option>
            <option>通常</option>
          </select>
        </label>

        {/* 表示切替（ダミー） */}
        <div className="ml-2 flex items-center gap-2">
          <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white">
            日表示
          </button>
          <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
            週表示
          </button>
        </div>
      </div>

      {/* 右：追加ボタン */}
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white shadow-sm hover:bg-blue-700">
          音声で追加
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-white shadow-sm hover:bg-gray-900">
          手入力で追加
        </button>
      </div>
    </div>
  );
}
