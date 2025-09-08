"use client";
import TaskCard from "@/components/tasks/TaskCard";
import { useTaskStore } from "@/lib/store";

export default function TaskList() {
  const { selectedDate, tasks } = useTaskStore();
  const items = tasks.filter((t) => t.date === selectedDate);

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-gray-400 text-sm">タスクはありません</div>
      ) : (
        items.map((it) => (
          <TaskCard
            key={it.id}
            title={it.title}
            time={it.time}
            priority={it.priority}
            duration={it.duration}
            tags={it.tags}
          />
        ))
      )}
    </div>
  );
}
