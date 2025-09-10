// src/components/filters/FilterBar.tsx
"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";

export default function FilterBar() {
  const { viewMode, setViewMode } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* モバイル版：条件の追加ボタンと日/週切替を横並び */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          条件の追加
        </button>

        {/* モバイル版日/週切替 */}
        <div className="flex items-center gap-2">
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

      {/* フィルタ条件（モバイル：条件付き表示、デスクトップ：常時表示） */}
      <div
        className={`grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto lg:grid ${
          showFilters ? "grid" : "hidden lg:grid"
        }`}
      >
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

      {/* デスクトップ版日/週切替 */}
      <div className="items-center hidden gap-2 lg:flex">
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
