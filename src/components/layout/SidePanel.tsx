"use client";
import MiniCalendar from "@/components/calendar/MiniCalendar";
import { useTaskStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { calcImportance } from "@/lib/types";

export default function SidePanel() {
  const { tasks, setDate, setHighlightTaskId } = useTaskStore();

  const topTasks: (Task & { importance: number })[] = tasks
    .filter((t: Task) => t.status === "未完了")
    .map((t: Task) => ({ ...t, importance: calcImportance(t) }))
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 3);

  return (
    <aside className="space-y-4">
      {/* カレンダー（白背景） */}
      <MiniCalendar />

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
              }}
            >
              <div className="text-sm text-gray-700 truncate">{task.title}</div>
              <div className="text-xs text-gray-500">
                {"⭐️".repeat(task.priority)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
