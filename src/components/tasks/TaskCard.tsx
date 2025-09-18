import React, { useState } from "react";
import { priorityBarClass } from "@/lib/constants";
import { calculateTimeRemaining } from "@/utils/date";
import { useTaskStore } from "@/lib/store";
import KebabMenu from "./KebabMenu";
import TaskEditDialog from "./TaskEditDialog";
import TaskCheckbox from "./TaskCheckbox";
import TaskTitle from "./TaskTitle";
import TaskMeta from "./TaskMeta";
import TaskTags from "./TaskTags";
import type { Task } from "@/lib/types";
import TagsManager from "@/utils/TagsManager";

// グラデーション風の発光アニメーション
const glowAnimation = `
  @keyframes glowPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(253, 224, 71, 0.4),
                  0 0 8px 0 rgba(253, 224, 71, 0.2);
    }
    25% {
      box-shadow: 0 0 0 2px rgba(253, 224, 71, 0.6),
                  0 0 16px 4px rgba(253, 224, 71, 0.3);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(253, 224, 71, 0.8),
                  0 0 24px 8px rgba(253, 224, 71, 0.4);
    }
    75% {
      box-shadow: 0 0 0 2px rgba(253, 224, 71, 0.6),
                  0 0 16px 4px rgba(253, 224, 71, 0.3);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(253, 224, 71, 0.4),
                  0 0 8px 0 rgba(253, 224, 71, 0.2);
    }
  }
`;

/**
 * タスクカードコンポーネント
 *
 * 個別のタスクを表示するカード
 * チェックボックス、タイトル、メタ情報、タグ、メニューで構成
 * ハイライト機能付き
 */
export default function TaskCard({
  id,
  title,
  time,
  priority = 3,
  duration,
  tags,
  highlight,
  date,
  status,
}: {
  id: string;
  title: string;
  time?: string;
  priority?: number; // 1..5
  duration?: number;
  tags?: string[];
  highlight?: boolean;
  date: string; // 残り時間計算のために必要
  status: string;
}) {
  const [checked, setChecked] = React.useState(status === "完了");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { deleteTask, updateTask, moveTaskToTomorrow } = useTaskStore();

  // 残り時間を計算
  const timeRemaining = calculateTimeRemaining(date, time);

  // 期限切れかどうかを判定
  const isOverdue = timeRemaining === "期限切れ";

  // 現在のタスクオブジェクトを作成
  const currentTask: Task = {
    id,
    title,
    date,
    time,
    priority: priority || 3,
    duration,
    tags: tags || [],
    status: checked ? "完了" : "未完了",
  };

  // メニューハンドラー
  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleEditSubmit = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
  };

  const handleDelete = async () => {
    if (confirm(`「${title}」を削除しますか？`)) {
      const response = await fetch(
        "http://127.0.0.1:5000/get_user_todos_delete",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ todo_id: id }),
        }
      );
      if (response.status === 201) {
        deleteTask(id);

        // タスク削除後にタグ一覧を再取得して更新
        try {
          console.log("タスク削除: タグ一覧を再取得します");
          const refreshedTags = await TagsManager.fetchTags();
          if (refreshedTags.length > 0) {
            TagsManager.updateTags(refreshedTags);
          }
        } catch (err) {
          console.error("タスク削除後のタグ更新に失敗しました", err);
        }
      } else {
        console.error("タスクの削除に失敗しました");
        alert("タスクの削除に失敗しました");
      }
    }
  };

  const handleMoveToTomorrow = async () => {
    const response = await fetch(
      `http://127.0.0.1:5000/tomorrow_todo?todo_id=${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    if (!response.ok) {
      console.error("タスクの編集に失敗しました");
      alert("タスクの編集に失敗しました");
      return;
    } else if (response.status === 200) {
      const data = await response.json();
      let todo_id: string = data.todo_id;
      let deadline = new Date(data.deadline);
      let date = "";
      const year = deadline.getUTCFullYear();
      const month = (deadline.getUTCMonth() + 1).toString().padStart(2, "0");
      const day = deadline.getUTCDate().toString().padStart(2, "0");
      date = `${year}-${month}-${day}`;
      moveTaskToTomorrow(todo_id, date);
    }
  };

  const handleCheckboxChange = async () => {
    const newChecked = !checked; // チェック状態を切り替え
    setChecked(newChecked);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/get_user_todos_finishflg_update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            todo_id: id,
            finish_flg: newChecked,
          }),
        }
      );

      if (response.ok) {
        // 状態更新に成功した場合のみタグを更新
        try {
          // タスク完了状態変更時にもタグを再取得
          const refreshedTags = await TagsManager.fetchTags();
          if (refreshedTags.length > 0) {
            TagsManager.updateTags(refreshedTags);
          }
        } catch (err) {
          console.error("タスク状態変更後のタグ更新に失敗しました", err);
        }
      } else {
        console.error("タスクの状態更新に失敗しました");
        alert("タスクの状態更新に失敗しました");
        setChecked(!newChecked); // 状態を元に戻す
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("タスクの状態更新中にエラーが発生しました");
      setChecked(!newChecked); // 状態を元に戻す
    }
  };

  const highlightStyle = highlight
    ? {
        animation: "glowPulse 2s ease-in-out",
      }
    : {};

  return (
    <>
      {highlight && <style>{glowAnimation}</style>}
      <div
        className={`relative p-4 bg-white border border-gray-200 shadow-sm rounded-2xl`}
        style={highlightStyle}
      >
        {/* 優先度バー（完了時は灰色） */}
        <div
          className={`absolute left-0 top-0 h-full w-1.5 ${
            checked ? "bg-gray-400" : priorityBarClass(priority)
          }`}
          aria-hidden
        />
        <div className="flex items-start justify-between gap-3 pl-2">
          <div className="flex-1">
            {/* タイトル行：チェックボックスを先頭に配置 */}
            <div className="flex items-center gap-3 mb-2">
              <TaskCheckbox
                checked={checked}
                onChange={handleCheckboxChange}
                taskId={id}
              />
              <TaskTitle title={title} isCompleted={checked} />
            </div>

            {/* メタ情報（時間、優先度など） */}
            <TaskMeta
              isCompleted={checked}
              timeRemaining={timeRemaining}
              isOverdue={isOverdue}
              time={time}
              priority={priority}
              duration={duration}
            />

            {/* タグ表示 */}
            <TaskTags tags={tags || []} />
          </div>
          <div className="flex items-center gap-3">
            <KebabMenu
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMoveToTomorrow={handleMoveToTomorrow}
            />
          </div>
        </div>
      </div>

      {/* 編集ダイアログ */}
      <TaskEditDialog
        open={showEditDialog}
        task={currentTask}
        onClose={() => setShowEditDialog(false)}
        onSubmit={handleEditSubmit}
      />
    </>
  );
}
