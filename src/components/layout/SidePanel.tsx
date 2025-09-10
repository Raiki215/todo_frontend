"use client";
import MiniCalendar from "@/components/calendar/MiniCalendar";
import { useAppStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { calcImportance } from "@/utils/taskUtils";
import { calculateTimeRemaining } from "@/utils/date";

interface SidePanelProps {
  onDateSelect?: () => void; // 日付選択時のコールバック
}

export default function SidePanel({ onDateSelect }: SidePanelProps) {
  const { tasks, setDate, setHighlightTaskId } = useAppStore();

  const topTasks: (Task & { importance: number })[] = tasks
    .filter((t: Task) => t.status === "未完了")
    .map((t: Task) => ({ ...t, importance: calcImportance(t) }))
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 3);

  console.log(
    "未完了タスク数:",
    tasks.filter((t) => t.status === "未完了").length
  );
  console.log(
    "優先度順タスク:",
    topTasks.map((t) => ({ title: t.title, importance: t.importance }))
  );

  return (
    <aside className="space-y-4">
      {/* カレンダー（白背景） */}
      <MiniCalendar onDateSelect={onDateSelect} />

      {/* 優先度の高いタスク（重要度順で3件） */}
      <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-2xl">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          優先度の高いタスク
        </h3>
        <div className="space-y-2">
          {topTasks.map((task: Task & { importance: number }) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 transition-all duration-200 border border-gray-200 shadow-md cursor-pointer rounded-xl"
              onClick={() => {
                setDate(task.date);
                setHighlightTaskId(task.id);
                setTimeout(() => setHighlightTaskId(null), 2000);
                // モバイル版の場合、タスク選択時にもカレンダーを閉じる
                onDateSelect?.();
              }}
            >
              <div className="text-sm text-gray-700 truncate">{task.title}</div>
              <div className="flex flex-col items-end text-xs text-gray-500">
                {/* 残り時間を上に表示。期限切れは「残り」を付けず赤文字のみ */}
                {calculateTimeRemaining(task.date, task.time) === "期限切れ" ? (
                  <div className="font-bold text-red-600">期限切れ</div>
                ) : (
                  <div className="font-bold text-blue-600">
                    {`残り${calculateTimeRemaining(task.date, task.time)}`}
                  </div>
                )}
                {/* かかる時間（duration）を下に表示 */}
                {task.duration && <div>{task.duration}分</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
