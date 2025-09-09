// src/components/filters/FilterBar.tsx
"use client";
import { useTaskStore } from "@/lib/store";

export default function FilterBar() {
  const { viewMode, setViewMode } = useTaskStore();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* モバイル版：追加ボタンを表示 */}
      <div className="grid order-1 w-full grid-cols-1 gap-2 lg:hidden sm:grid-cols-2">
        <button className="inline-flex items-center justify-center w-full gap-2 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
          音声で追加
        </button>
        <button className="inline-flex items-center justify-center w-full gap-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-sm hover:bg-gray-900">
          手動で追加
        </button>
      </div>

      {/* セレクト群 */}
      <div className="grid order-2 w-full grid-cols-1 gap-3 lg:order-none sm:grid-cols-3 lg:w-auto">
        <label className="text-sm text-gray-600">
          タグ:
          <select className="w-full px-2 py-2 mt-1 text-sm border border-gray-300 rounded-lg">
            <option>すべて</option>
            <option>仕事</option>
            <option>重要</option>
            <option>健康</option>
          </select>
        </label>
        <label className="text-sm text-gray-600">
          状態:
          <select className="w-full px-2 py-2 mt-1 text-sm border border-gray-300 rounded-lg">
            <option>すべて</option>
            <option>未完了</option>
            <option>完了</option>
            <option>キャンセル</option>
          </select>
        </label>
        <label className="text-sm text-gray-600">
          モード:
          <select className="w-full px-2 py-2 mt-1 text-sm border border-gray-300 rounded-lg">
            <option>すべて</option>
            <option>通常</option>
          </select>
        </label>
      </div>

      {/* 日/週 切替 */}
      <div className="flex items-center order-3 gap-2 lg:order-none">
        <button 
          className={`px-3 py-2 text-sm rounded-lg ${
            viewMode === "day" 
              ? "bg-blue-600 text-white" 
              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setViewMode("day")}
        >
          日表示
        </button>
        <button 
          className={`px-3 py-2 text-sm rounded-lg ${
            viewMode === "week" 
              ? "bg-blue-600 text-white" 
              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setViewMode("week")}
        >
          週表示
        </button>
      </div>
    </div>
  );
}
