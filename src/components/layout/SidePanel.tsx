"use client";
import MiniCalendar from "@/components/calendar/MiniCalendar";
import { useTaskStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { calcImportance } from "@/lib/types";

export default function SidePanel() {
  const { tasks }: { tasks: Task[] } = useTaskStore();

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
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          優先度の高いタスク
        </h3>
        <div className="space-y-2">
          {topTasks.map((task: Task & { importance: number }) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 p-3"
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
