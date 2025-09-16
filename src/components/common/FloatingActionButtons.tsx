/**
 * フローティングアクションボタンコンポーネント
 *
 * 画面右下に固定で表示される手動追加・音声追加ボタン
 * モバイル・デスクトップ両対応
 */

"use client";

import React, { useState } from "react";
import TaskCreateDialog, {
  TaskDraft,
} from "@/components/tasks/TaskCreateDialog";
import { useAppStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { formatJapaneseDate } from "@/utils/date";
import { generateTaskId } from "@/services/taskService";
import TagsManager from "@/utils/TagsManager";
import recognizeVoice, {
  cancelRecognition,
  stopRecognition,
} from "@/components/tasks/VoiceDialog";

export default function FloatingActionButtons() {
  const { selectedDate, addTask } = useAppStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * タスク作成処理
   * TaskDraftをTask型に変換してストアに保存
   */
  const handleTaskCreate = (draft: TaskDraft) => {
    const task: Task = {
      id: generateTaskId(),
      title: draft.title,
      date: draft.dueAt ? draft.dueAt.split("T")[0] : selectedDate,
      time: draft.dueAt
        ? draft.dueAt.split("T")[1]?.substring(0, 5)
        : undefined,
      priority: draft.importance,
      duration: draft.estimatedMinutes || undefined,
      tags: draft.tags,
      status: "未完了",
    };

    addTask(task);
  };

  /**
   * 音声追加処理（将来実装）
   */
  const handleVoiceAdd = async () => {
    // トグル動作：録音中なら停止（完了）、解析中は無効、未録音なら開始
    if (isRecording) {
      stopRecognition();
      return;
    }
    if (isProcessing) return;
    try {
      setIsRecording(true);
      const result = await recognizeVoice();
      // 録音が終わったら解析モードへ
      setIsRecording(false);
      setIsProcessing(true);
      if (!result || result.trim() === "") {
        alert("音声が認識されませんでした。");
        setIsProcessing(false);
        return;
      }
      const response = await fetch("http://127.0.0.1:5000/insert_todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: result }),
        credentials: "include",
      });
      if (response.status === 401) {
        alert("ログインしてください");
      } else if (response.status === 201) {
        const data = await response.json();
        const todo = data.todo;
        console.log("APIレスポンス:", data);
        console.log("todo_info:", todo);
        let date = "";
        let time = "";
        if (todo.deadline) {
          const [d, t] = todo.deadline.split(" ");
          date = d;
          time = t ? t.substring(0, 5) : "00:00";
        }
        console.log(date);
        console.log(time);
        addTask({
          id: todo.todo_id,
          title: todo.todo,
          date: date,
          priority: todo.priority,
          duration: todo.estimated_time,
          tags: todo.tags,
          time: time,
          status: "未完了",
        });

        // バックエンドから返されたタグ一覧があれば更新
        if (todo.all_tags) {
          try {
            console.log("音声タスク作成: タグ一覧を更新します:", todo.all_tags);
            TagsManager.updateTags(todo.all_tags);
          } catch (error) {
            console.error("音声タスク作成: タグの更新に失敗しました:", error);
          }
        } else {
          // 明示的にタグ一覧が返されなかった場合は再取得を試みる
          try {
            console.log("音声タスク作成: タグ一覧を再取得します");
            const refreshedTags = await TagsManager.fetchTags();
            if (refreshedTags.length > 0) {
              TagsManager.updateTags(refreshedTags);
            }
          } catch (err) {
            console.error("音声タスク作成: タグの再取得に失敗しました", err);
          }
        }

        alert("タスク登録成功");
      } else {
        alert("タスク登録失敗");
      }
      setIsRecording(false);
      setIsProcessing(false);
    } catch (err) {
      alert("音声認識エラー" + err);
    } finally {
      setIsRecording(false);
    }
    // // TODO: 音声認識機能の実装
    // console.log("音声追加機能は将来実装予定");
    // alert("音声追加機能は将来実装予定です");
  };

  return (
    <>
      {/* フローティングアクションボタン群 */}
      <div className="fixed z-40 flex flex-row gap-3 bottom-6 right-6 sm:flex-col">
        {/* 音声追加ボタン（スマホ：左、デスクトップ：上） */}
        <div className="relative">
          {/* 録音中の波紋アニメーション */}
          {isRecording && (
            <span
              className="absolute inset-0 rounded-full animate-ping bg-red-400/30"
              aria-hidden
            />
          )}
          <button
            onClick={handleVoiceAdd}
            // 録音中は停止、解析中は無効
            disabled={isProcessing}
            aria-pressed={isRecording}
            aria-busy={isRecording || isProcessing}
            className={`relative flex items-center justify-center text-white transition-all duration-200 rounded-full shadow-lg w-14 h-14 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isRecording
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : isProcessing
                ? "bg-gray-500 hover:bg-gray-600 focus:ring-gray-400"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            }`}
            aria-label={
              isRecording
                ? "録音を停止"
                : isProcessing
                ? "AI解析中"
                : "音声でタスクを追加"
            }
            title={
              isRecording
                ? "録音を停止"
                : isProcessing
                ? "AI解析中"
                : "音声でタスクを追加"
            }
          >
            {/* アイコン: 録音中はマイク、解析中はスピナー、待機中はマイク */}
            {isProcessing ? (
              <span
                className="absolute w-6 h-6 border-2 rounded-full animate-spin border-white/30 border-t-white"
                aria-hidden
              />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}

            {/* 録音中ドット */}
            {isRecording && (
              <span
                className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white"
                aria-hidden
              />
            )}
          </button>
          {/* 録音中のキャンセルボタン（マイクボタンの上に表示） */}
          {isRecording && (
            <button
              type="button"
              onClick={() => {
                cancelRecognition();
                setIsRecording(false);
              }}
              className="absolute z-10 flex items-center justify-center -translate-x-1/2 rounded-full -top-12 left-1/2 focus:outline-none"
              aria-label="録音をキャンセル"
              title="録音をキャンセル"
            >
              <span className="flex items-center justify-center text-white rounded-full shadow-md w-9 h-9 bg-black/55 hover:bg-black/65">
                {/* × アイコン */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </span>
            </button>
          )}
        </div>

        {/* 手動追加ボタン（スマホ：右、デスクトップ：下） */}
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full shadow-lg w-14 h-14 hover:bg-gray-900 hover:shadow-xl active:scale-95"
          aria-label="手動でタスクを追加"
          title="手動でタスクを追加"
        >
          {/* 手のアイコン（編集アイコンを手の代わりに使用） */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>

      {/* タスク作成ダイアログ */}
      <TaskCreateDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={(draft) => {
          handleTaskCreate(draft);
          setShowCreateDialog(false);
        }}
      />
    </>
  );
}
