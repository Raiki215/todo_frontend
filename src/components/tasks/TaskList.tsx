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

  // Service Workerの登録
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("Service Worker 登録成功:", registration);
        } catch (error) {
          console.error("Service Worker 登録失敗:", error);
        }
      }
    };

    registerServiceWorker();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        tasks.forEach((task) => {
          if (task.id) deleteTask(task.id);
        });
        const response = await fetch("http://127.0.0.1:5000/get_user_todos", {
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
            console.log(
              `-------------${task.todo_id}:${Number(
                task.finish_flg
              )}-----------`
            );
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

            // タグ形式の処理
            let formattedTags = task.tags;

            if (Array.isArray(task.tags) && task.tags.length > 0) {
              formattedTags = task.tags;
            }

            addTask({
              id: task.todo_id,
              title: task.todo,
              date: date,
              priority: task.priority,
              duration: Number(task.estimated_time),
              tags: formattedTags,
              time: time,
              status: Number(task.finish_flg) === 1 ? "完了" : "未完了",
            });

            console.log(task);
          }
        );
      } catch (error) {
        console.error("タスクの取得に失敗しました:", error);
      }
    };

    const subscribeUser = async () => {
      try {
        // Service Workerが利用可能か確認
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
          console.error("プッシュ通知がサポートされていません");
          return;
        }

        const registration = await navigator.serviceWorker.ready;

        // applicationServerKeyが設定されているか確認
        let vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          console.error("NEXT_PUBLIC_VAPID_PUBLIC_KEY が設定されていません");
          return;
        }

        // ダブルクォーテーション、改行、空白を削除
        vapidPublicKey = vapidPublicKey
          .replace(/"/g, "")
          .replace(/\n/g, "")
          .replace(/\s/g, "");

        // 標準Base64 → URLセーフBase64 に変換
        const urlSafeVapidKey = vapidPublicKey
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        // Web Push標準の関数: URLセーフBase64文字列をUint8Arrayに変換
        function urlBase64ToUint8Array(base64String: string): Uint8Array {
          const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
          const base64 = (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");

          const rawData = window.atob(base64);
          const outputArray = new Uint8Array(rawData.length);

          for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
          }
          return outputArray;
        }

        const applicationServerKey = urlBase64ToUint8Array(urlSafeVapidKey);

        // Push通知のサブスクリプション登録
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey as any,
        });

        // サーバーに登録
        const response = await fetch(
          "http://127.0.0.1:5000/save-subscription",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscription }),
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`サーバーエラー: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        console.log("Subscription saved!", result);
      } catch (error) {
        console.error("プッシュ通知の登録に失敗しました:", error);
      }
    };

    // 最初の1回だけ実行する
    if (isInitialFetch) {
      fetchTasks();
      subscribeUser();
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
            status={it.status}
          />
        ))
      )}
    </div>
  );
}
