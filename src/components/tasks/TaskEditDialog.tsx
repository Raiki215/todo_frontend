"use client";

import { useEffect, useId, useState, useRef } from "react";
import { createPortal } from "react-dom";
import type { Task } from "@/lib/types";
import { getCurrentDate, getCurrentTime } from "@/utils/dateTime";

/** 編集ダイアログのプロパティ */
type Props = {
  open: boolean;
  task: Task | null; // 編集対象のタスク
  onClose: () => void;
  onSubmit?: (taskId: string, updates: Partial<Task>) => void;
};

export default function TaskEditDialog({ open, task, onClose, onSubmit }: Props) {
  // ---- フォーム状態 ----
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<string>(""); // YYYY-MM-DD
  const [dueTime, setDueTime] = useState<string>(""); // HH:mm
  const [importance, setImportance] = useState(3);
  const [estimate, setEstimate] = useState<string>(""); // 表示は文字列で保持
  const [tagsInput, setTagsInput] = useState("");

  // input要素への参照
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // タスクが変更されたときにフォームを初期化（空の時は現在時刻をデフォルトに）
  useEffect(() => {
    if (!open || !task) return;
    
    setTitle(task.title || "");
    setDueDate(task.date || getCurrentDate());
    setDueTime(task.time || getCurrentTime());
    setImportance(task.priority || 3);
    setEstimate(task.duration ? String(task.duration) : "");
    setTagsInput(task.tags ? task.tags.join(", ") : "");
  }, [open, task]);

  // キーボード（Escで閉じる / Cmd/Ctrl+Enterで保存）
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, title, dueDate, dueTime, importance, estimate, tagsInput]);

  const handleSubmit = () => {
    if (!task) return;

    const tags = tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updates: Partial<Task> = {
      title: title.trim() || "無題",
      date: dueDate || task.date,
      time: dueTime || undefined,
      priority: importance,
      duration: estimate ? Number(estimate) : undefined,
      tags,
    };

    onSubmit?.(task.id, updates);
    onClose();
  };

  // Portal mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dialogId = useId();

  // mountされていない、またはopenがfalseの時は何も表示しない
  if (!mounted || !open) return null;
  
  if (!task) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 transition-opacity opacity-100 bg-black/30"
        onClick={onClose}
      />
      {/* panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${dialogId}-title`}
        className="absolute left-1/2 top-1/2 w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white shadow-xl transition-transform scale-100"
      >
        {/* header */}
        <div className="flex items-center justify-between h-12 px-4 border-b border-gray-200">
          <div id={`${dialogId}-title`} className="text-sm font-semibold">
            タスクを編集
          </div>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="text-gray-500 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        {/* body */}
        <div className="p-4 space-y-4">
          {/* タスク名 */}
          <div>
            <label className="block text-sm text-gray-700">タスク名</label>
            <input
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg"
              placeholder="例：プレゼン資料の作成"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 締切（任意） */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700">締切日</label>
              <div 
                className="relative mt-1 cursor-pointer"
                onClick={() => dateInputRef.current?.showPicker?.()}
              >
                <input
                  ref={dateInputRef}
                  type="date"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <div className="absolute inset-0 rounded-lg pointer-events-none"></div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700">時刻</label>
              <div 
                className="relative mt-1 cursor-pointer"
                onClick={() => timeInputRef.current?.showPicker?.()}
              >
                <input
                  ref={timeInputRef}
                  type="time"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                />
                <div className="absolute inset-0 rounded-lg pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* 優先度（スライダー） */}
          <div>
            <label className="block text-sm text-gray-700">
              優先度: <span className="font-semibold">{importance}</span>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={importance}
              onChange={(e) => setImportance(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          {/* 予想時間・タグ */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700">
                予想時間（分）
              </label>
              <input
                type="number"
                min={1}
                className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg"
                placeholder="30"
                value={estimate}
                onChange={(e) => setEstimate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">
                タグ（カンマ区切り）
              </label>
              <input
                className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg"
                placeholder="仕事, 重要, 健康"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200">
          <button
            className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={handleSubmit}
          >
            変更を保存
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
