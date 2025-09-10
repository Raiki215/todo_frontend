"use client";
import TaskCard from "@/components/tasks/TaskCard";
import { useTaskStore } from "@/lib/store";
import { getWeekDates } from "@/utils/date";

export default function TaskList() {
  const { selectedDate, tasks, highlightTaskId, viewMode } = useTaskStore();

  // 表示するタスクを決定
  const items =
    viewMode === "week"
      ? tasks.filter((t) => getWeekDates(selectedDate).includes(t.date))
      : tasks.filter((t) => t.date === selectedDate);

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-sm text-gray-400">
          {viewMode === "week"
            ? "この週にタスクはありません"
            : "タスクはありません"}
        </div>
      ) : (
        items.map((it) => (
          <TaskCard
            key={it.id}
            id={it.id}
            title={it.title}
            time={it.time}
            priority={it.priority}
            duration={it.duration}
            tags={it.tags}
            highlight={highlightTaskId === it.id}
            date={it.date}
          />
        ))
      )}
    </div>
  );
}
