// components/calendar/MiniCalendar.tsx
"use client";

import { useMemo } from "react";
import { useTaskStore } from "../../lib/store";
import { buildMonthGrid, addMonths, fmtDate, todayStr } from "../../lib/date";

export default function MiniCalendar() {
  const { selectedDate, setDate, tasks } = useTaskStore();
  // currentは毎回最新のselectedDateを参照
  const current = new Date(selectedDate);

  // 月グリッド（日曜始まり×6週=42マス）
  const days = useMemo(() => buildMonthGrid(current), [current]);

  // 日付ごとの件数 / 重要タスク件数(優先度4以上)を集計
  const counts = useMemo(() => {
    const map: Record<string, { total: number; urgent: number }> = {};
    const uncompletedTasks = tasks.filter((t) => t.status === "未完了");

    console.log("全タスク数:", tasks.length);
    console.log("未完了タスク数:", uncompletedTasks.length);
    console.log(
      "未完了タスクの日付:",
      uncompletedTasks.map((t) => ({
        title: t.title,
        date: t.date,
        priority: t.priority,
      }))
    );

    uncompletedTasks.forEach((t) => {
      const m = (map[t.date] ||= { total: 0, urgent: 0 });
      m.total += 1;
      if (t.priority >= 4) m.urgent += 1;
    });

    console.log("カウント結果:", map);
    return map;
  }, [tasks]);

  const year = current.getFullYear();
  const month = current.getMonth(); // 0-11
  const today = todayStr();

  const go = (diff: number) => {
    const base = new Date(selectedDate);
    const day = base.getDate();
    // 月を移動
    const next = new Date(base);
    next.setMonth(base.getMonth() + diff);
    // 変更後の月の日数を取得
    const y = next.getFullYear();
    const m = next.getMonth();
    const lastDay = new Date(y, m + 1, 0).getDate();
    // 31日→次月/前月が31日なら31日、なければその月の最終日
    next.setDate(Math.min(day, lastDay));
    setDate(fmtDate(next));
  };

  return (
    <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-2xl">
      {/* ヘッダー（月移動） */}
      <div className="flex items-center justify-between mb-2">
        <button
          className="px-2 text-gray-600 hover:text-gray-900"
          onClick={() => go(-1)}
        >
          ‹
        </button>
        <div className="font-medium">
          {year}年{month + 1}月
        </div>
        <button
          className="px-2 text-gray-600 hover:text-gray-900"
          onClick={() => go(1)}
        >
          ›
        </button>
      </div>

      {/* 曜日 */}
      <div className="grid grid-cols-7 gap-1 mb-1 text-xs text-center text-gray-500">
        {["日", "月", "火", "水", "木", "金", "土"].map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      {/* 本体 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const key = fmtDate(d);
          const isCurMonth = d.getMonth() === month;
          const isToday = key === today;
          // 選択状態はselectedDateと一致する日付
          const isSelected = key === selectedDate;

          const c = counts[key];
          const showBadge = c && c.total > 0;
          const badgeText = c?.total ?? 0; // 常に総数を表示
          const badgeClass =
            c?.urgent && c.urgent > 0
              ? "bg-red-500 text-white" // 重要タスクがある場合は赤
              : "bg-gray-300 text-gray-800"; // ない場合はグレー

          return (
            <button
              key={key}
              onClick={() => setDate(key)}
              className={[
                "relative aspect-square rounded-xl text-sm transition",
                isSelected
                  ? "bg-blue-600 text-white hover:bg-blue-600"
                  : "hover:bg-gray-50",
                isCurMonth ? "" : "opacity-50",
                isToday && !isSelected ? "ring-2 ring-blue-500" : "",
              ].join(" ")}
              aria-label={key}
            >
              {/* 日付数字 */}
              <div
                className={
                  "absolute top-1 left-1 text-xs " +
                  (isSelected ? "text-white/90" : "text-gray-700")
                }
              >
                {d.getDate()}
              </div>

              {/* 件数バッジ（常に総数表示、重要タスクがあれば赤丸、なければグレー丸） */}
              {showBadge && (
                <div
                  className={
                    "absolute bottom-1 right-1 h-[18px] min-w-[18px] px-1 rounded-full " +
                    "text-[10px] leading-[18px] text-center " +
                    badgeClass
                  }
                  aria-hidden
                >
                  {badgeText}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
