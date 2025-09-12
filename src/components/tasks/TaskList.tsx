"use client";
import TaskCard from "@/components/tasks/TaskCard";
import { useTaskStore } from "@/lib/store";
import { getWeekDates } from "@/utils/date";
import { useEffect, useState } from "react";

export default function TaskList() {
  const {
    selectedDate,
    tasks,
    highlightTaskId,
    viewMode,
    addTask,
    deleteTask,
  } = useTaskStore();

  const [isInitialFetch, setIsInitialFetch] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        tasks.forEach((task) => {
          if (task.id) deleteTask(task.id);
        });

        const response = await fetch("http://127.0.0.1:5000//get_user_todos", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();

        const formattedTasks = result.datas.map(
          (task: {
            todo_id: string;
            todo: string;
            deadline?: string;
            priority: number;
            duration?: number;
            finish_flg: number;
            estimated_time?: string | number;
            tags?: string[];
          }) => {
            let time = "";
            let date = "";
            if (task.deadline) {
              const d = new Date(task.deadline);
              const hours = d.getUTCHours().toString().padStart(2, "0");
              const minutes = d.getUTCMinutes().toString().padStart(2, "0");
              time = `${hours}:${minutes}`;

              const year = d.getUTCFullYear();
              const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
              const day = d.getUTCDate().toString().padStart(2, "0");
              date = `${year}-${month}-${day}`;
            }
            addTask({
              id: task.todo_id,
              title: task.todo,
              date: date,
              priority: task.priority,
              duration: Number(task.estimated_time),
              tags: task.tags,
              time: time,
              status: task.finish_flg === 1 ? "完了" : "未完了",
            });

            console.log(task);
          }
        );
      } catch (error) {
        console.error("タスクの取得に失敗しました:", error);
      }
    };

    // 最初の1回だけ実行する
    if (isInitialFetch) {
      fetchTasks();
      setIsInitialFetch(false);
    }
  }, [addTask, deleteTask, tasks, isInitialFetch]);

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
